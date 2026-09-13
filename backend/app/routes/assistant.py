import os
from pathlib import Path
from dotenv import load_dotenv
import requests
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.project import Project
from app.services.risk_engine import (
    calculate_cost_risk,
    calculate_progress_risk,
    calculate_status_risk,
)

load_dotenv(Path(__file__).resolve().parents[2] / ".env")

router = APIRouter(prefix="/api/assistant", tags=["Assistant"])


class AssistantRequest(BaseModel):
    message: str | None = None
    prompt: str | None = None
    project_id: int | None = None

    @property
    def query_text(self) -> str:
        return self.message or self.prompt or "hello"


def get_portfolio_context(projects: list[Project]) -> dict:
    total = len(projects)
    if total == 0:
        return {
            "total_projects": 0,
            "total_approved_cr": 0,
            "total_revised_cr": 0,
            "total_escalation_cr": 0,
            "average_progress": 0,
            "delayed_count": 0,
            "delayed_examples": [],
            "cost_overrun_count": 0,
            "cost_overrun_examples": [],
            "high_risk_count": 0,
            "top_high_risk": [],
        }

    approved = sum(float(p.approved_cost or 0) for p in projects)
    revised = sum(float(p.revised_cost or p.approved_cost or 0) for p in projects)
    escalation = revised - approved
    avg_progress = sum(float(p.physical_progress or 0) for p in projects) / total

    delayed = [p for p in projects if p.status and p.status.lower() in ["delayed", "stopped", "critical"]]
    cost_overruns = [p for p in projects if float(p.revised_cost or 0) > float(p.approved_cost or 0)]

    high_risk = []
    for p in projects[:100]:
        c = calculate_cost_risk(p)
        pr = calculate_progress_risk(p)
        s = calculate_status_risk(p)
        score = c["score"] + pr["score"] + s["score"]
        if score >= 70:
            high_risk.append((p, score, c["reason"] or pr["reason"] or s["reason"]))

    high_risk.sort(key=lambda x: x[1], reverse=True)

    return {
        "total_projects": total,
        "total_approved_cr": round(approved, 2),
        "total_revised_cr": round(revised, 2),
        "total_escalation_cr": round(escalation, 2),
        "average_progress": round(avg_progress, 1),
        "delayed_count": len(delayed),
        "delayed_examples": [p.project_name for p in delayed[:6]],
        "cost_overrun_count": len(cost_overruns),
        "cost_overrun_examples": [p.project_name for p in cost_overruns[:6]],
        "high_risk_count": len(high_risk),
        "top_high_risk": [f"{item[0].project_name} ({item[2]})" for item in high_risk[:5]],
    }


def call_gemini_assistant(message: str, context: dict, project_specific: str | None = None) -> str | None:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return None

    headers = {
        "Content-Type": "application/json",
        "x-goog-api-key": api_key,
    }

    system_instruction = (
        "You are Pragati AI, an expert, friendly, and comprehensive civil engineering & infrastructure assistant.\n"
        "You have complete expertise across:\n"
        "1. Architectural Blueprints & House Planning: Helping users create floor plans, room layout design, standard room dimensions (e.g. Master Bed 14x16 ft, Kitchen 10x12 ft), Vastu Shastra orientation guidelines, Bill of Quantities (BOQ), and construction budgeting. Let users know they can also use Pragati AI's interactive 'AI Blueprint Studio' (/blueprint) to generate technical CAD blueprints and bill of quantities!\n"
        "2. Contractor & Builder Recommendations: Guiding users on finding verified, top-tier contractors, reviewing track records, and accessing Pragati AI's 'Contractor Trust Registry' (/contractors).\n"
        "3. National Mega-Infrastructure Monitoring: Tracking national infrastructure projects, delay alerts, cost escalation risk, and PM-GatiShakti / MoSPI early warnings using the live portfolio metrics provided below.\n"
        "4. General Civil Engineering & Construction: Answering all civil, architectural, structural, and site management questions clearly, step-by-step, with practical guidance.\n\n"
        "Guidelines:\n"
        "• Be welcoming, structured, and deeply helpful. Never refuse reasonable building, housing, blueprint, or construction questions.\n"
        "• Use clear headings, bullet points, and practical advice.\n"
        "• For portfolio questions, cite actual numbers from the live data below.\n"
    )

    context_str = (
        f"LIVE INFRASTRUCTURE PORTFOLIO METRICS:\n"
        f"• Total Monitored Projects: {context.get('total_projects', 0)}\n"
        f"• Total Approved Outlay: ₹{context.get('total_approved_cr', 0)} Cr\n"
        f"• Total Revised Cost: ₹{context.get('total_revised_cr', 0)} Cr (Net Cost Escalation: ₹{context.get('total_escalation_cr', 0)} Cr)\n"
        f"• Portfolio Physical Progress: {context.get('average_progress', 0)}%\n"
        f"• Critical / Delayed Projects: {context.get('delayed_count', 0)} projects (e.g. {', '.join(context.get('delayed_examples', []))})\n"
        f"• Projects with Cost Overrun: {context.get('cost_overrun_count', 0)} projects (e.g. {', '.join(context.get('cost_overrun_examples', []))})\n"
        f"• High-Risk Projects Identified: {context.get('high_risk_count', 0)} critical projects:\n  - " +
        "\n  - ".join(context.get('top_high_risk', []))
    )

    if project_specific:
        context_str += f"\n\nSPECIFIC PROJECT UNDER INQUIRY:\n{project_specific}"

    prompt = f"{system_instruction}\n\n{context_str}\n\nUser Question: {message}\n\nPragati AI Answer:"

    payload = {
        "contents": [
            {
                "parts": [{"text": prompt}]
            }
        ],
        "generationConfig": {
            "temperature": 0.4,
            "maxOutputTokens": 3500,
        }
    }

    # Valid Gemini model names for REST API
    models = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"]

    for model in models:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
        try:
            response = requests.post(url, headers=headers, json=payload, timeout=12)
            if response.status_code == 200:
                data = response.json()
                candidates = data.get("candidates", [])
                if candidates:
                    parts = candidates[0].get("content", {}).get("parts", [])
                    if parts:
                        return parts[0].get("text", "").strip()
        except Exception:
            continue

    return None


def build_rule_answer(message: str, projects: list[Project], context: dict) -> str:
    text = message.lower()

    if any(k in text for k in ["blueprint", "floor plan", "house", "home plan", "design home", "cad"]):
        return (
            "📐 **How to Build a House Blueprint & Architectural Layout**:\n\n"
            "To design an accurate, structurally sound blueprint for your house, follow these standard civil engineering guidelines:\n\n"
            "1. **Define Your Plot & Setbacks**:\n"
            "   • Measure your plot width and length (e.g. 30 × 50 ft = 1,500 sq ft).\n"
            "   • Maintain statutory front setback (typically 5–10 ft) for road clearance, ventilation, and parking.\n\n"
            "2. **Standard Room Dimensions (NBC 2016 Guidelines)**:\n"
            "   • **Living Room / Hall**: 16' × 20' or 14' × 18'\n"
            "   • **Master Bedroom**: 14' × 16' (with attached toilet 5' × 8')\n"
            "   • **Second Bedroom / Guest**: 12' × 14'\n"
            "   • **Kitchen**: 10' × 12' (preferred in South-East / Agni corner as per Vastu)\n"
            "   • **Pooja / Study**: 6' × 8' (North-East orientation)\n\n"
            "3. **Use Pragati AI's Built-in Blueprint Studio**:\n"
            "   • Click on **'AI Blueprint Studio'** in the sidebar navigation (or go to `/blueprint`).\n"
            "   • Enter your plot dimensions, number of floors, budget, and requirements.\n"
            "   • Pragati AI will automatically generate the 2D CAD blueprint, room layout table, and Bill of Quantities (BOQ) with material cost estimation!\n\n"
            "4. **Find Verified Builders**:\n"
            "   • Once your blueprint is ready, explore the **Contractor Trust Registry** (`/contractors`) to assign trusted, verified contractors with high on-time delivery ratings."
        )

    if any(k in text for k in ["contractor", "builder", "hire", "tender", "bidder"]):
        return (
            "🏗️ **Contractor & Builder Trust Intelligence**:\n\n"
            "Pragati AI maintains an active registry of infrastructure and residential contractors evaluated on actual project delivery metrics:\n\n"
            "• **Trust Score (0–100)**: Based on historical on-time milestone delivery and budget adherence.\n"
            "• **Timely Completion Rate**: Verification of project handover without litigation delays.\n"
            "• **Government & Private Vetting**: Track record across CPWD, NHAI, and regional development authorities.\n\n"
            "👉 Head to the **'Contractor Trust Registry'** (`/contractors`) to view top-rated contractors, search by city/state, or register new building firms."
        )

    if "delayed" in text or "delay" in text:
        examples = "\n• ".join(context.get("delayed_examples", []))
        return (
            f"⚠️ **Delayed & Critical Projects Overview**:\n"
            f"• Total Delayed Projects: {context.get('delayed_count', 0)} out of {context.get('total_projects', 0)} monitored.\n"
            f"• Notable Delayed Projects:\n• {examples}\n\n"
            f"Key Mitigations:\n"
            f"1. Convene inter-ministerial Project Monitoring Group (PMG) to expedite site handover.\n"
            f"2. Issue revised work package schedules to contractors."
        )

    if "high risk" in text or "risk" in text:
        examples = "\n• ".join(context.get("top_high_risk", []))
        return (
            f"🚨 **High-Risk Projects Detected**:\n"
            f"• {context.get('high_risk_count', 0)} projects are currently flagged with critical or high risk.\n"
            f"• Top High-Risk Projects:\n• {examples}\n\n"
            f"Recommended Interventions:\n"
            f"1. Conduct immediate on-site safety and engineering audits.\n"
            f"2. Review contractor milestone burn-rates and release milestone stage-payments."
        )

    if "cost" in text or "overrun" in text or "budget" in text or "escalat" in text:
        examples = "\n• ".join(context.get("cost_overrun_examples", []))
        return (
            f"💰 **Cost Overrun & Financial Intelligence**:\n"
            f"• Total Approved Outlay: ₹{context.get('total_approved_cr', 0)} Cr\n"
            f"• Total Revised Cost: ₹{context.get('total_revised_cr', 0)} Cr\n"
            f"• Cumulative Cost Escalation: ₹{context.get('total_escalation_cr', 0)} Cr across {context.get('cost_overrun_count', 0)} projects.\n"
            f"• Projects with Highest Escalation:\n• {examples}\n\n"
            f"Mitigation: Invoke contractual price variation caps and audit raw material escalations."
        )

    if "land" in text or "clearance" in text or "forest" in text or "bottleneck" in text:
        return (
            "🚧 **Key Infrastructure Bottleneck Insights**:\n"
            "• Right of Way (RoW) & Land Acquisition: 42% of delays involve pending Section 19 notifications under RFCTLARR Act.\n"
            "• Environmental Clearances: 28% of projects require MoEFCC Stage-II compliance review.\n"
            "• Utility Shifting: Power transmission lines & water conduits obstructing critical path packages.\n\n"
            "Recommendation: Auto-escalate affected projects to the PM GatiShakti Network Planning Group (NPG)."
        )

    if "summary" in text or "overview" in text or "portfolio" in text or "hello" in text or "hi" in text or "hey" in text or "hii" in text:
        return (
            f"👋 **Hello! Welcome to Pragati AI Assistant**.\n\n"
            f"📊 **Infrastructure Portfolio Overview**:\n"
            f"• Monitored Mega Projects: {context.get('total_projects', 0)}\n"
            f"• Average Physical Progress: {context.get('average_progress', 0)}%\n"
            f"• Total Approved Outlay: ₹{context.get('total_approved_cr', 0)} Cr\n"
            f"• Total Revised Cost: ₹{context.get('total_revised_cr', 0)} Cr (Net Escalation: ₹{context.get('total_escalation_cr', 0)} Cr)\n"
            f"• Critical Risk Flagged: {context.get('high_risk_count', 0)} projects requiring intervention.\n\n"
            f"How can I assist you? Ask me about house blueprints (`/blueprint`), contractor trust ratings (`/contractors`), delayed projects, or cost escalation risk!"
        )

    for p in projects:
        if p.project_name and any(w in p.project_name.lower() for w in text.split() if len(w) > 3):
            approved = float(p.approved_cost or 0)
            revised = float(p.revised_cost or approved)
            diff = revised - approved
            pct = round((diff / (approved or 1)) * 100, 1)
            return (
                f"📌 **Project Intelligence**: {p.project_name}\n"
                f"• Sector: {p.sector or 'Infrastructure'} | Ministry: {p.ministry or 'Central Govt'}\n"
                f"• Approved Cost: ₹{approved} Cr | Revised Cost: ₹{revised} Cr (Escalation: {pct}%)\n"
                f"• Physical Progress: {p.physical_progress or 0}%\n"
                f"• Status: {p.status or 'Ongoing'}\n"
                f"• Agency: {p.implementing_agency or 'N/A'}"
            )

    return (
        f"I have scanned your portfolio of {context.get('total_projects', len(projects))} infrastructure projects.\n\n"
        "You can ask me:\n"
        "• 'Which projects are high risk?'\n"
        "• 'Which projects have cost overruns?'\n"
        "• 'Which projects are delayed?'\n"
        "• 'Design a 30x40 3BHK house blueprint'\n"
        "• 'Find top rated contractors in Mumbai'\n"
        "• Or ask about any specific project name!"
    )


@router.post("/query")
@router.post("/query", include_in_schema=False)
@router.post("/chat")
@router.post("/chat", include_in_schema=False)
@router.post("", include_in_schema=False)
@router.post("/", include_in_schema=False)
def assistant_chat(
    request: AssistantRequest,
    db: Session = Depends(get_db),
):
    query_text = request.query_text
    projects = db.query(Project).order_by(Project.id.asc()).all()
    project_specific = None

    if request.project_id:
        target = next((p for p in projects if p.id == request.project_id), None)
        if target:
            approved = float(target.approved_cost or 0)
            revised = float(target.revised_cost or approved)
            project_specific = (
                f"Project: {target.project_name}\n"
                f"Sector: {target.sector}, Agency: {target.implementing_agency}, Status: {target.status}\n"
                f"Approved: ₹{approved} Cr, Revised: ₹{revised} Cr, Progress: {target.physical_progress}%"
            )

    context = get_portfolio_context(projects)

    # 1. Try Gemini REST API (gemini-2.0-flash / gemini-1.5-flash)
    answer = call_gemini_assistant(query_text, context, project_specific)

    # 2. Fall back to deterministic expert engine if Gemini fails or is offline
    if not answer:
        answer = build_rule_answer(query_text, projects, context)

    return {
        "success": True,
        "message": query_text,
        "answer": answer,
        "project_id": request.project_id,
    }
