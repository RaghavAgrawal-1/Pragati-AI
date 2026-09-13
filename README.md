# 🏗️ PRAGATI AI

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB.svg?style=flat&logo=react)](https://reactjs.org)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com)
[![Python](https://img.shields.io/badge/Python-3.11%20%7C%203.12-3776AB.svg?style=flat&logo=python)](https://www.python.org)
[![Machine Learning](https://img.shields.io/badge/ML-XGBoost%20%7C%20Scikit--Learn-F7931E.svg?style=flat&logo=scikit-learn)](https://scikit-learn.org)
[![Explainability](https://img.shields.io/badge/XAI-SHAP-FF6F00.svg?style=flat)](https://github.com/slundberg/shap)
[![Gemini AI](https://img.shields.io/badge/AI-Google%20Gemini-4285F4.svg?style=flat&logo=google)](https://ai.google.dev)
[![Docker](https://img.shields.io/badge/Deployment-Docker%20Compose-2496ED.svg?style=flat&logo=docker)](https://www.docker.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat)](LICENSE)

> **Next-Generation National Infrastructure Intelligence, Mega-Project Risk Prediction, CAD Blueprint Studio & Contractor Trust Verification Platform.**

---

## 🌟 Executive Overview

**Pragati AI** is an enterprise-grade artificial intelligence and decision-support platform designed to solve India's most critical infrastructure challenges: **cost overruns**, **schedule delays**, **statutory bottlenecks**, and **lack of contractor accountability**.

Aligned with **MoSPI** (Ministry of Statistics and Programme Implementation) and **PM GatiShakti National Master Plan**, Pragati AI monitors over **1,800+ national infrastructure projects** totaling **₹30+ Lakh Crore**, predicting project risks up to 6 months before they materialize on-site.

Furthermore, Pragati AI democratizes infrastructure technology for citizens, builders, and regional contractors through an **AI Blueprint Studio** (instant CAD floor plans & Bill of Quantities estimation) and a **Contractor Trust Registry** with milestone-verified trust scores.

---

## 🏛️ System Architecture

```
                                    ┌─────────────────────────────────────────┐
                                    │       Pragati AI Client (React 18)      │
                                    │   Vite • Tailwind CSS • Lucide • Charts │
                                    └────────────────────┬────────────────────┘
                                                         │ REST / JSON
                                                         ▼
                                    ┌─────────────────────────────────────────┐
                                    │        FastAPI Application Server       │
                                    │    Asynchronous • Pydantic V2 • CORS    │
                                    └────┬──────────────┬──────────────┬──────┘
                                         │              │              │
                   ┌─────────────────────┴──────┐       │              └────────────────────┐
                   ▼                            ▼       ▼                                   ▼
       ┌────────────────────────┐  ┌────────────────────────┐  ┌──────────────────┐  ┌───────────────────┐
       │   ML Inference Engine  │  │  Pragati AI Assistant  │  │ Computer Vision  │  │ Database Layer    │
       │  • XGBoost Regressor   │  │  • Gemini 3.5 Fallback │  │  • Aerial Drone  │  │  • PostgreSQL     │
       │  • Risk Classifier     │  │  • Civil Engineering   │  │  • PPE & Safety  │  │  • SQLite (Local) │
       │  • SHAP Explainability │  │    Rule Engine         │  │  • Work Progress │  │  • SQLAlchemy ORM │
       └────────────────────────┘  └────────────────────────┘  └──────────────────┘  └───────────────────┘
```

---

## ⚡ Core Capabilities & Features

### 1. 📊 Executive Infrastructure Dashboard
- Real-time aggregation of ₹30+ Lakh Crore portfolio capital outlay.
- Critical delay counts, cost escalation heatmaps, and physical progress metrics.
- Sectoral filtering across Railways, Roads & Highways, Power, Petroleum, and Urban Transport.

### 2. 🧠 Predictive Cost & Schedule Intelligence
- **Cost Escalation Forecaster**: Multi-variate regression predicting final project outlays and price escalation percentages.
- **Delay Risk Classifier**: Quantifies probability of project stagnation based on right-of-way (RoW) clearances, land acquisition, and contractor capacity.
- **SHAP Feature Importance**: Generates transparent waterfall explainability plots for audit compliance and ministry briefings.

### 3. 📐 AI Blueprint Studio & CAD Visualizer
- Instant parametric generation of 2D CAD floor plans based on plot dimensions (e.g., 30×50 ft, 40×60 ft).
- **Vastu Shastra & NBC 2016 Compliance**: Automatic placement of Master Bedrooms (SW), Kitchens (SE), and Entrances (NE).
- **Automated Bill of Quantities (BOQ)**: Live material and cost estimation (Cement bags, Steel TMT bars, Sand, Aggregates, Finishing).
- Direct export and one-click contractor dispatch.

### 4. 🤝 Contractor Trust Registry & Verification
- Public & institutional registry rating builders and EPC contractors (0–100 Trust Score).
- Evaluates on-time delivery rate, dispute records, and past project completions.
- Streamlined contractor onboarding modal with GSTIN, PAN, and technical class verification.

### 5. 🤖 Pragati AI Multimodal Assistant
- Conversational civil engineering intelligence powered by Google Gemini (with multi-model fallback chain: `gemini-3.5-flash-lite`, `gemini-3.5-flash`, `gemini-flash-latest`).
- Answers both domestic house blueprint queries and complex MoSPI mega-infrastructure portfolio inquiries.
- Zero-downtime deterministic fallback engine for offline reliability.

### 6. 🛰️ Drone & Computer Vision Site Monitor
- Real-time imagery analysis tracking physical construction progress percentage.
- Worker safety and PPE compliance detection (Hardhats, High-Vis vests).

---

## 🧠 Machine Learning Engine

* **Infrastructure Portfolio Dataset**: Trained on comprehensive infrastructure project telemetry across 16 Indian sectors (approved outlay, revised cost, cumulative expenditure, physical progress, agency type, and milestone delays).
* **Cost Escalation Model**: Gradient Boosted Trees / XGBoost minimizing Root Mean Squared Error (RMSE) to predict budget creep before tender modifications.
* **Delay Classification Model**: Binary & multi-class classification determining high-risk project slippage with high precision and recall.
* **Explainable AI (XAI)**: Integrated SHAP (SHapley Additive exPlanations) values identifying the top root causes behind project delays (e.g., Land Acquisition Delay > Environmental Clearance > Contractor Milestones).

---

## 🚀 Quick Setup & Deployment

### Prerequisites
* **Docker & Docker Compose** (optional, recommended for full-stack containerization)
* **Node.js 18+** & `npm`
* **Python 3.10+** or **3.11 / 3.12**
* **Git**

---

### 1. Clone the Repository
```bash
git clone https://github.com/RaghavAgrawal-1/Pragati-AI.git
cd Pragati-AI
```

---

### 2. Configure Environment Variables

Create `.env` inside the `backend/` directory:
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```env
DATABASE_URL=sqlite:///./pragati.db
# Or PostgreSQL for production:
# DATABASE_URL=postgresql://pragati:password@localhost:5432/pragati_ai

GEMINI_API_KEY=your_gemini_api_key_here
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
ENVIRONMENT=development
```

Create `.env` inside the `frontend/` directory:
```bash
cp frontend/.env.example frontend/.env
```

```env
VITE_API_URL=http://127.0.0.1:8000
```

---

### 3. Spin Up with Docker (One-Command Deployment)

```bash
docker compose up --build -d
```
* **Frontend**: `http://localhost:5173`
* **Backend API**: `http://localhost:8000/docs`
* **PostgreSQL Database**: `localhost:5433`

---

### 4. Or Run Manually (Local Development)

#### Step 4.1: Start Backend API
```bash
cd backend
python -m venv venv

# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation will be live at: `http://127.0.0.1:8000/docs`

#### Step 4.2: Train / Run ML Models
```bash
# In a separate terminal with venv activated:
cd ml
python ml_service.py
```

#### Step 4.3: Start Frontend Dashboard
```bash
cd frontend
npm install
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🧪 Running Tests

### Backend Tests:
```bash
cd backend
pytest
```

### Frontend Build & Lint Verification:
```bash
cd frontend
npm run build
```

---

## 🛡️ Cloud Deployment Guide

### Deploy Backend (Render / Railway / AWS EC2)
1. **Root Directory**: `backend`
2. **Build Command**: `pip install -r requirements.txt`
3. **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Set environment variables: `DATABASE_URL`, `GEMINI_API_KEY`, `CORS_ORIGINS`.

### Deploy Frontend (Vercel / Netlify / Cloudflare Pages)
1. **Root Directory**: `frontend`
2. **Framework Preset**: `Vite`
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. Set environment variable: `VITE_API_URL=https://your-backend-domain.com`

---

## 📁 Repository Structure

```plaintext
Pragati-AI/
├── backend/
│   ├── app/
│   │   ├── api/            # API endpoints & dependency injection
│   │   ├── core/           # Configuration, security & settings
│   │   ├── db/             # SQLAlchemy engine & session management
│   │   ├── models/         # Database models (Project, Contractor, etc.)
│   │   ├── routes/         # FastAPI router endpoints (Projects, Risk, Assistant, Blueprint)
│   │   ├── schemas/        # Pydantic schemas & contracts
│   │   └── services/       # Business logic, Risk engine & Blueprint generators
│   ├── tests/              # Pytest automated test suite
│   ├── Dockerfile          # Backend container specification
│   └── requirements.txt    # Python production dependencies
├── frontend/
│   ├── public/             # Static public assets
│   ├── src/
│   │   ├── components/     # Reusable UI components, cards, tables, charts
│   │   ├── context/        # Theme & Global application context
│   │   ├── pages/          # Dashboard, Risk, Blueprint, Contractors, Assistant
│   │   ├── routes/         # React Router configuration
│   │   └── services/       # Axios API client & data services
│   ├── Dockerfile          # Multi-stage production Nginx container
│   ├── package.json        # Frontend dependencies & scripts
│   └── tailwind.config.js  # Tailwind CSS configuration
├── ml/
│   ├── ml_service.py       # ML training, model evaluation & prediction service
│   └── models/             # Serialized model artifacts (.joblib / .pkl)
├── docker-compose.yml      # Multi-container orchestration (DB, API, Web)
├── .gitignore              # Repository exclusion rules
└── README.md               # Project documentation
```

---

## 🛡️ CI/CD Pipeline

GitHub Actions automatically lints code, executes `pytest` test suites across the FastAPI backend, and validates production Vite builds on every Pull Request to `main`.

---

*Built as a Senior-Level Portfolio Architecture Project demonstrating full-stack engineering, scalable system design, and AI integration.*
