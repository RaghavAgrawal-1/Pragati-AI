import { useEffect, useMemo, useState } from "react";
import {
  FileBarChart2, Download, Calendar, CheckCircle2, Clock,
  RefreshCw, FileText, TrendingUp, ShieldAlert, IndianRupee,
  BarChart3, Layers, Eye, Settings2,
} from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import { api } from "../../services/apiClient";

// ── Helpers ───────────────────────────────────────────────────────────
function formatCr(v) {
  const n = Number(v ?? 0);
  if (n >= 100_000) return `₹${(n / 100_000).toFixed(1)}L Cr`;
  if (n >= 1_000)   return `₹${(n / 1_000).toFixed(1)}K Cr`;
  return `₹${n.toFixed(0)} Cr`;
}

function now() { return new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }

const REPORT_TYPES = [
  {
    id: "portfolio_summary",
    title: "Portfolio Summary Report",
    description: "Complete overview of all monitored infrastructure projects — status, cost, progress, and risk.",
    icon: Layers,
    color: "#E85418",
    tags: ["Projects", "Status", "KPIs"],
  },
  {
    id: "risk_assessment",
    title: "Risk Assessment Report",
    description: "Detailed ML-scored risk analysis for all projects, including cost and schedule risk probabilities.",
    icon: ShieldAlert,
    color: "#EF4444",
    tags: ["Risk", "ML Scores", "Alerts"],
  },
  {
    id: "budget_overrun",
    title: "Budget Overrun Report",
    description: "Projects with cost escalation above baseline — ranked by overrun percentage and absolute amount.",
    icon: IndianRupee,
    color: "#F59E0B",
    tags: ["Budget", "Cost", "Overruns"],
  },
  {
    id: "sector_performance",
    title: "Sector Performance Report",
    description: "Aggregate performance indicators broken down by infrastructure sector (Road, Rail, Energy, Port, Urban).",
    icon: BarChart3,
    color: "#06B6D4",
    tags: ["Sectors", "Performance", "Analytics"],
  },
  {
    id: "executive_digest",
    title: "Executive Digest",
    description: "High-level executive summary: key risks, budget health, top 5 critical projects, and AI recommendations.",
    icon: FileText,
    color: "#A855F7",
    tags: ["Executive", "Summary", "AI"],
  },
  {
    id: "schedule_delays",
    title: "Schedule Delay Report",
    description: "Projects with significant timeline slippage — milestone adherence, delay patterns, and recovery estimates.",
    icon: Clock,
    color: "#22C55E",
    tags: ["Schedule", "Delays", "Milestones"],
  },
];

// ── Sub-components ────────────────────────────────────────────────────

function ReportCard({ report, onGenerate, generating }) {
  const Icon = report.icon;
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-surface-card p-5 flex flex-col gap-3 hover:border-white/[0.1] hover:bg-surface-raised transition-all duration-200 group">
      <div className="flex items-start justify-between">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ background: `${report.color}18`, border: `1px solid ${report.color}30` }}
        >
          <Icon size={18} style={{ color: report.color }} />
        </div>
        <div className="flex flex-wrap gap-1">
          {report.tags.map(t => (
            <span key={t} className="rounded-md bg-white/[0.05] border border-white/[0.06] px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider text-muted">
              {t}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-[13.5px] font-semibold text-ink">{report.title}</h3>
        <p className="mt-1 text-[12px] leading-relaxed text-muted">{report.description}</p>
      </div>

      <button
        onClick={() => onGenerate(report)}
        disabled={generating === report.id}
        className="mt-auto flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-[12px] font-medium text-ink hover:bg-white/[0.08] disabled:opacity-50 transition-colors"
      >
        {generating === report.id ? (
          <><RefreshCw size={13} className="animate-spin" /> Generating…</>
        ) : (
          <><Download size={13} className="text-muted" /> Generate &amp; Download</>
        )}
      </button>
    </div>
  );
}

function ScheduleToggle({ label, value, onChange }) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/[0.06] bg-surface-card px-4 py-3.5">
      <span className="text-[13px] font-medium text-ink">{label}</span>
      <button
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${value ? "bg-orange" : "bg-white/[0.1]"}`}
      >
        <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${value ? "translate-x-4" : "translate-x-0.5"}`} />
      </button>
    </label>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────
export default function Reports() {
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [generating, setGenerating] = useState(null);
  const [generated,  setGenerated]  = useState([]);

  const [dateRange, setDateRange] = useState("last_30");
  const [schedules, setSchedules] = useState({
    weekly_digest:    true,
    monthly_overrun:  false,
    risk_alerts:      true,
    sector_summary:   false,
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get("/api/projects", { params: { skip: 0, limit: 50 } });
        setProjects(Array.isArray(data) ? data : (data?.items ?? []));
      } catch { setProjects([]); }
      finally  { setLoading(false); }
    }
    load();
    const saved = localStorage.getItem("pragati-report-schedules");
    if (saved) try { setSchedules(JSON.parse(saved)); } catch {}
  }, []);

  function saveSchedules(updated) {
    setSchedules(updated);
    localStorage.setItem("pragati-report-schedules", JSON.stringify(updated));
  }

  async function generateReport(report) {
    setGenerating(report.id);
    await new Promise(r => setTimeout(r, 1200)); // simulate async

    // Build payload based on report type
    let payload = { report_type: report.id, generated_at: new Date().toISOString(), date_range: dateRange, total_projects: projects.length };

    if (report.id === "portfolio_summary") {
      payload.projects = projects.map(p => ({
        id: p.id, name: p.project_name || p.name, sector: p.sector, status: p.status,
        progress: p.physical_progress, approved_cost: p.approved_cost, revised_cost: p.revised_cost,
      }));
    } else if (report.id === "risk_assessment") {
      payload.risk_summary = projects.map(p => {
        const approved = Number(p.approved_cost ?? 1);
        const revised  = Number(p.revised_cost  ?? approved);
        const esc = ((revised - approved) / approved) * 100;
        const score = Math.min(100, Math.max(0, esc * 2 + (100 - Number(p.physical_progress ?? 50))));
        return { id: p.id, name: p.project_name || p.name, risk_score: score.toFixed(1), cost_escalation_pct: esc.toFixed(1) };
      }).sort((a, b) => b.risk_score - a.risk_score);
    } else if (report.id === "budget_overrun") {
      payload.overruns = projects
        .map(p => {
          const ap = Number(p.approved_cost ?? 0);
          const rv = Number(p.revised_cost  ?? 0);
          return { id: p.id, name: p.project_name || p.name, approved: ap, revised: rv, overrun_pct: ap > 0 ? (((rv - ap) / ap) * 100).toFixed(1) : 0, overrun_abs: rv - ap };
        })
        .filter(p => p.overrun_pct > 0)
        .sort((a, b) => b.overrun_pct - a.overrun_pct);
    } else if (report.id === "sector_performance") {
      const sectors = {};
      projects.forEach(p => {
        const s = p.sector || "Other";
        if (!sectors[s]) sectors[s] = { sector: s, count: 0, total_approved: 0, total_revised: 0, avg_progress: 0 };
        sectors[s].count++;
        sectors[s].total_approved += Number(p.approved_cost ?? 0);
        sectors[s].total_revised  += Number(p.revised_cost  ?? 0);
        sectors[s].avg_progress   += Number(p.physical_progress ?? 0);
      });
      Object.values(sectors).forEach(s => { s.avg_progress = (s.avg_progress / s.count).toFixed(1); });
      payload.sectors = Object.values(sectors);
    } else {
      payload.data = projects;
    }

    // Download as JSON
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `pragati_${report.id}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setGenerating(null);
    setGenerated(prev => [{ id: report.id, title: report.title, ts: new Date().toLocaleTimeString("en-IN") }, ...prev.slice(0, 4)]);
  }

  return (
    <div className="space-y-6 animate-slideUp">
      <PageHeader title="Reports" subtitle="Generate, schedule and export infrastructure intelligence reports." />

      {/* Report Library */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[13px] font-semibold text-ink">Report Library</h2>
          <select
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            className="input-dark text-[11.5px] py-1.5"
          >
            <option value="last_7">Last 7 days</option>
            <option value="last_30">Last 30 days</option>
            <option value="last_90">Last 90 days</option>
            <option value="ytd">Year to Date</option>
            <option value="all">All Time</option>
          </select>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REPORT_TYPES.map(r => (
            <ReportCard key={r.id} report={r} onGenerate={generateReport} generating={generating} />
          ))}
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Recently Generated */}
        <div className="rounded-2xl border border-white/[0.06] bg-surface-card p-5">
          <h3 className="text-[13.5px] font-semibold text-ink mb-3 flex items-center gap-2">
            <CheckCircle2 size={15} className="text-emerald-400" />
            Recently Generated
          </h3>
          {generated.length === 0 ? (
            <p className="text-[12.5px] text-muted text-center py-6">No reports generated yet this session.</p>
          ) : (
            <ul className="space-y-2">
              {generated.map((r, i) => (
                <li key={i} className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-3">
                  <span className="text-[12.5px] font-medium text-ink">{r.title}</span>
                  <span className="text-[11px] font-mono text-muted">{r.ts}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Scheduled Reports */}
        <div className="rounded-2xl border border-white/[0.06] bg-surface-card p-5">
          <h3 className="text-[13.5px] font-semibold text-ink mb-3 flex items-center gap-2">
            <Calendar size={15} className="text-orange" />
            Scheduled Reports
          </h3>
          <div className="space-y-2">
            <ScheduleToggle
              label="Weekly Portfolio Digest"
              value={schedules.weekly_digest}
              onChange={v => saveSchedules({ ...schedules, weekly_digest: v })}
            />
            <ScheduleToggle
              label="Monthly Cost Overrun Alert"
              value={schedules.monthly_overrun}
              onChange={v => saveSchedules({ ...schedules, monthly_overrun: v })}
            />
            <ScheduleToggle
              label="High Risk Project Alerts"
              value={schedules.risk_alerts}
              onChange={v => saveSchedules({ ...schedules, risk_alerts: v })}
            />
            <ScheduleToggle
              label="Sector Performance Summary"
              value={schedules.sector_summary}
              onChange={v => saveSchedules({ ...schedules, sector_summary: v })}
            />
          </div>
          <p className="mt-3 text-[10.5px] text-muted">Schedules saved to your browser profile and will apply next session.</p>
        </div>
      </div>

      {/* Export All Data */}
      <div className="rounded-2xl border border-white/[0.06] bg-surface-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-[13.5px] font-semibold text-ink">Export All Project Data</h3>
          <p className="text-[12px] text-muted">Download the complete project dataset as JSON for external analysis or archiving.</p>
        </div>
        <button
          onClick={() => {
            const blob = new Blob([JSON.stringify({ exported_at: new Date().toISOString(), projects }, null, 2)], { type: "application/json" });
            const url  = URL.createObjectURL(blob);
            const a    = document.createElement("a"); a.href = url; a.download = `pragati_all_projects_${Date.now()}.json`; a.click();
            URL.revokeObjectURL(url);
          }}
          disabled={loading}
          className="flex shrink-0 items-center gap-2 rounded-xl border border-orange/30 bg-orange/10 px-5 py-2.5 text-[12.5px] font-semibold text-orange hover:bg-orange/20 disabled:opacity-50 transition-colors"
        >
          <Download size={14} />
          Export All ({projects.length} Projects)
        </button>
      </div>
    </div>
  );
}
