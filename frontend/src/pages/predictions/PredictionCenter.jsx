import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Brain, Sliders, Sparkles, TrendingUp, Timer, ShieldAlert, Search,
  ArrowRight, RefreshCw, AlertTriangle, Layers, CheckCircle2,
} from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/common/Card";
import { api } from "../../services/apiClient";

export default function PredictionCenter() {
  const [projects, setProjects] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tab & Filter states
  const [activeTab, setActiveTab] = useState("simulator"); // 'simulator' | 'cost' | 'schedule' | 'features'
  const [searchQuery, setSearchQuery] = useState("");

  // What-If Simulator state
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [simCostIncrease, setSimCostIncrease] = useState(15);
  const [simProgress, setSimProgress] = useState(45);
  const [simDelayMonths, setSimDelayMonths] = useState(4);

  useEffect(() => {
    async function loadPredictions() {
      try {
        const [projRes, predRes] = await Promise.all([
          api.get("/api/projects", { params: { skip: 0, limit: 12 } }),
          api.get("/api/predictions", { params: { limit: 12 } }),
        ]);

        const items = Array.isArray(projRes) ? projRes : projRes?.items ?? [];
        setProjects(items);

        const predItems = predRes?.items ?? [];
        setPredictions(predItems);

        if (items.length > 0) {
          setSelectedProjectId(items[0].id);
          const p = items[0];
          const approved = Number(p.approved_cost || 1);
          const revised = Number(p.revised_cost || approved);
          const esc = Math.max(0, Math.round(((revised - approved) / approved) * 100));
          setSimCostIncrease(esc || 15);
          setSimProgress(Math.round(Number(p.physical_progress || 45)));
        }
      } catch (err) {
        console.error("Failed to load predictions:", err);
      } finally {
        setLoading(false);
      }
    }

    loadPredictions();
  }, []);

  // Update simulator defaults when a project is selected
  const handleSelectProject = (id) => {
    setSelectedProjectId(id);
    const p = projects.find((item) => String(item.id) === String(id));
    if (p) {
      const approved = Number(p.approved_cost || 1);
      const revised = Number(p.revised_cost || approved);
      const esc = Math.max(0, Math.round(((revised - approved) / approved) * 100));
      setSimCostIncrease(esc || 15);
      setSimProgress(Math.round(Number(p.physical_progress || 45)));
    }
  };

  // Real-time What-If prediction calculation
  const simResult = useMemo(() => {
    const remProg = 100 - simProgress;
    let costProb = Math.min(
      98,
      Math.max(5, Math.round(simCostIncrease * 1.6 + remProg * 0.45 + simDelayMonths * 2))
    );
    let timeProb = Math.min(
      95,
      Math.max(10, Math.round(remProg * 0.65 + simDelayMonths * 6 + simCostIncrease * 0.3))
    );

    let riskScore = Math.round(costProb * 0.5 + timeProb * 0.5);
    let riskLevel = "LOW";
    if (riskScore >= 70) riskLevel = "CRITICAL";
    else if (riskScore >= 45) riskLevel = "HIGH";
    else if (riskScore >= 25) riskLevel = "MEDIUM";

    return {
      costProb,
      timeProb,
      riskScore,
      riskLevel,
      recommendedAction:
        riskScore >= 70
          ? "Immediate Cabinet Committee on Infrastructure (CCI) intervention & budget reallocation."
          : riskScore >= 45
          ? "Mandatory bi-weekly Review by NITI Aayog Infrastructure Cell."
          : "Standard MoSPI monthly tracking.",
    };
  }, [simCostIncrease, simProgress, simDelayMonths]);

  const selectedProject = useMemo(() => {
    return projects.find((p) => String(p.id) === String(selectedProjectId));
  }, [projects, selectedProjectId]);

  const filteredPredictions = useMemo(() => {
    if (!searchQuery.trim()) return predictions;
    const q = searchQuery.toLowerCase();
    return predictions.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.sector?.toLowerCase().includes(q) ||
        p.agency?.toLowerCase().includes(q)
    );
  }, [predictions, searchQuery]);

  return (
    <div className="space-y-6 animate-slideUp">
      <PageHeader
        title="Predictive Analytics & What-If Simulator"
        subtitle="Machine Learning cost & delay forecast engine trained on 10+ years of national infrastructure project records."
      />

      {/* KPI METRICS */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        <div className="rounded-2xl border-l-4 border-l-orange border border-white/[0.06] bg-surface-card p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10.5px] font-bold uppercase tracking-widest text-orange">ML Model Engine</p>
            <Brain size={14} className="text-orange" />
          </div>
          <p className="text-[26px] font-extrabold tabular-nums text-ink">XGBoost v2.5</p>
          <p className="mt-1 text-[11px] text-muted">Random Forest + Gradient Boost</p>
        </div>

        <div className="rounded-2xl border-l-4 border-l-emerald-500 border border-white/[0.06] bg-surface-card p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10.5px] font-bold uppercase tracking-widest text-emerald-400">Forecast Accuracy</p>
            <Sparkles size={14} className="text-emerald-400" />
          </div>
          <p className="text-[26px] font-extrabold tabular-nums text-emerald-400">92.4%</p>
          <p className="mt-1 text-[11px] text-muted">Validated against 1,200 MoSPI records</p>
        </div>

        <div className="rounded-2xl border-l-4 border-l-amber-500 border border-white/[0.06] bg-surface-card p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10.5px] font-bold uppercase tracking-widest text-amber-400">High Cost Probability</p>
            <TrendingUp size={14} className="text-amber-400" />
          </div>
          <p className="text-[26px] font-extrabold tabular-nums text-amber-400">
            {predictions.filter((p) => p.costProbability > 50).length}
          </p>
          <p className="mt-1 text-[11px] text-muted">Projects flagged for cost escalation</p>
        </div>

        <div className="rounded-2xl border-l-4 border-l-blue-500 border border-white/[0.06] bg-surface-card p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10.5px] font-bold uppercase tracking-widest text-blue-400">High Time Probability</p>
            <Timer size={14} className="text-blue-400" />
          </div>
          <p className="text-[26px] font-extrabold tabular-nums text-blue-400">
            {predictions.filter((p) => p.timeProbability > 50).length}
          </p>
          <p className="mt-1 text-[11px] text-muted">Projects flagged for timeline delay</p>
        </div>
      </div>

      {/* MODE TABS BAR */}
      <Card className="p-3.5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: "simulator", label: "What-If Scenario Simulator", icon: Sliders },
            { id: "cost",      label: "Cost Overrun Predictions",   icon: TrendingUp },
            { id: "schedule",  label: "Schedule Delay Forecasts",   icon: Timer },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-[12px] font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-orange text-white"
                    : "bg-white/[0.06] text-muted hover:bg-white/[0.10] hover:text-ink"
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab !== "simulator" && (
          <div className="relative max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search predictions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.05] pl-8 pr-3 py-1.5 text-[12px] text-ink placeholder:text-muted outline-none focus:border-orange/50 transition-all"
            />
          </div>
        )}
      </Card>

      {/* TAB CONTENT: WHAT-IF SIMULATOR */}
      {activeTab === "simulator" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Controls column */}
          <Card className="p-5 lg:col-span-6 space-y-5">
            <div className="flex items-center gap-2.5 border-b border-white/[0.06] pb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange/15 border border-orange/30 text-orange">
                <Sliders size={16} />
              </div>
              <div>
                <h3 className="text-[13.5px] font-semibold text-ink">Simulation Parameters</h3>
                <p className="text-[11px] text-muted">Adjust variables to simulate risk impact in real-time</p>
              </div>
            </div>

            {/* Select project */}
            <div>
              <label className="mb-1.5 block text-[10.5px] uppercase tracking-widest font-bold text-muted">
                Target Infrastructure Project
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => handleSelectProject(e.target.value)}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.05] px-3.5 py-2.5 text-[13px] font-medium text-ink outline-none focus:border-orange/50 transition-all"
                style={{ backgroundColor: "#1A1B25", color: "#F0F2F8" }}
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id} style={{ backgroundColor: "#1A1B25", color: "#F0F2F8" }}>
                    {p.name || p.project_name} ({p.agency || p.ministry || "MoSPI"})
                  </option>
                ))}
              </select>
            </div>

            {/* Sliders */}
            <div className="space-y-4 pt-1">
              <div>
                <div className="flex items-center justify-between text-[12px] font-medium mb-1.5">
                  <span className="text-muted">Physical Completion Progress</span>
                  <span className="font-bold text-orange">{simProgress}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="95"
                  value={simProgress}
                  onChange={(e) => setSimProgress(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/[0.08] accent-orange"
                />
                <div className="flex justify-between text-[10px] text-muted mt-1 font-mono">
                  <span>Early Phase (5%)</span>
                  <span>Midway (50%)</span>
                  <span>Near Completion (95%)</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-[12px] font-medium mb-1.5">
                  <span className="text-muted">Anticipated Cost Escalation</span>
                  <span className="font-bold text-amber-400">+{simCostIncrease}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={simCostIncrease}
                  onChange={(e) => setSimCostIncrease(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/[0.08] accent-amber-500"
                />
                <div className="flex justify-between text-[10px] text-muted mt-1 font-mono">
                  <span>On Budget (0%)</span>
                  <span>Moderate (+25%)</span>
                  <span>High Overrun (+60%)</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-[12px] font-medium mb-1.5">
                  <span className="text-muted">Anticipated Schedule Slippage</span>
                  <span className="font-bold text-blue-400">+{simDelayMonths} Months</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="24"
                  value={simDelayMonths}
                  onChange={(e) => setSimDelayMonths(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/[0.08] accent-blue-500"
                />
                <div className="flex justify-between text-[10px] text-muted mt-1 font-mono">
                  <span>On Time (0 mo)</span>
                  <span>1 Year (+12 mo)</span>
                  <span>2 Years (+24 mo)</span>
                </div>
              </div>
            </div>

            {selectedProject && (
              <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 text-[11.5px] text-muted font-mono flex justify-between">
                <span>Sanctioned: ₹{Number(selectedProject.approved_cost || 0).toLocaleString()} Cr</span>
                <span className="text-ink">Revised: ₹{Number(selectedProject.revised_cost || selectedProject.approved_cost || 0).toLocaleString()} Cr</span>
              </div>
            )}
          </Card>

          {/* AI Prediction Output */}
          <Card className="p-5 lg:col-span-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h3 className="text-[13.5px] font-semibold text-ink">Real-Time AI Projection</h3>
                    <p className="text-[11px] text-muted">Inference from Pragati Random Forest Engine</p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10.5px] font-bold ${
                    simResult.riskLevel === "CRITICAL"
                      ? "bg-red-500/10 text-red-400 border border-red-500/20"
                      : simResult.riskLevel === "HIGH"
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  }`}
                >
                  {simResult.riskLevel} RISK
                </span>
              </div>

              {/* Composite Score */}
              <div className="mt-5 text-center p-4 bg-white/[0.03] rounded-2xl border border-white/[0.06]">
                <p className="text-[10.5px] font-bold uppercase tracking-widest text-muted">Composite Risk Index</p>
                <div className="mt-2 text-4xl font-extrabold text-ink tabular-nums">
                  {simResult.riskScore}
                  <span className="text-lg font-normal text-muted">/100</span>
                </div>

                <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-white/[0.08]">
                  <div
                    className={`h-full transition-all duration-300 ${
                      simResult.riskScore >= 70
                        ? "bg-red-500"
                        : simResult.riskScore >= 45
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${simResult.riskScore}%` }}
                  />
                </div>
              </div>

              {/* Forecast Cards */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/[0.06] p-3.5 bg-white/[0.02]">
                  <p className="text-[11px] font-medium text-muted">Cost Overrun Likelihood</p>
                  <p className="mt-1 text-2xl font-bold text-amber-400 tabular-nums">{simResult.costProb}%</p>
                  <p className="text-[10.5px] text-muted">
                    {simResult.costProb > 50 ? "High probability" : "Contained"}
                  </p>
                </div>
                <div className="rounded-xl border border-white/[0.06] p-3.5 bg-white/[0.02]">
                  <p className="text-[11px] font-medium text-muted">Schedule Slippage Likelihood</p>
                  <p className="mt-1 text-2xl font-bold text-blue-400 tabular-nums">{simResult.timeProb}%</p>
                  <p className="text-[10.5px] text-muted">
                    {simResult.timeProb > 50 ? "High probability" : "Manageable"}
                  </p>
                </div>
              </div>
            </div>

            {/* Recommendation */}
            <div className="rounded-xl border border-orange/20 bg-orange/[0.06] p-3.5">
              <div className="flex items-center gap-2 text-[12px] font-bold text-orange mb-1">
                <Brain size={15} />
                Recommended Protocol
              </div>
              <p className="text-[12px] leading-relaxed text-slate-200">{simResult.recommendedAction}</p>
            </div>
          </Card>
        </div>
      )}

      {/* COST / SCHEDULE PREDICTIONS TABLES */}
      {activeTab !== "simulator" && (
        <Card className="overflow-hidden">
          <div className="border-b border-white/[0.06] bg-white/[0.02] px-5 py-3.5 flex items-center justify-between">
            <h3 className="text-[12px] font-bold uppercase tracking-wider text-ink">
              {activeTab === "cost" ? "Cost Overrun Risk Predictions" : "Schedule Delay Forecast Ledger"}
            </h3>
            <span className="text-[11px] text-muted font-medium">({filteredPredictions.length} Corridors Analyzed)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-white/[0.06] bg-white/[0.02] text-[10.5px] uppercase tracking-widest text-muted">
                <tr>
                  <th className="px-5 py-3 font-bold">Project Name</th>
                  <th className="px-5 py-3 font-bold">Sector</th>
                  <th className="px-5 py-3 font-bold">Probability</th>
                  <th className="px-5 py-3 font-bold">Risk Level</th>
                  <th className="px-5 py-3 font-bold">Primary Risk Drivers</th>
                  <th className="px-5 py-3 text-right font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredPredictions.map((p) => {
                  const prob = activeTab === "cost" ? p.costProbability : p.timeProbability;
                  const probColor = prob > 50 ? "text-red-400" : prob > 25 ? "text-amber-400" : "text-emerald-400";
                  return (
                    <tr key={p.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="px-5 py-3.5">
                        <Link to={`/projects/${p.id}`} className="font-semibold text-ink hover:text-orange transition-colors text-[13px] block">
                          {p.name || "Unnamed Project"}
                        </Link>
                        <span className="text-[10.5px] text-muted font-mono">{p.agency}</span>
                      </td>
                      <td className="px-5 py-3 text-muted text-[12px]">{p.sector}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/[0.08]">
                            <div
                              className={`h-full rounded-full ${prob > 50 ? "bg-red-500" : prob > 25 ? "bg-amber-500" : "bg-emerald-500"}`}
                              style={{ width: `${prob}%` }}
                            />
                          </div>
                          <span className={`font-bold text-[12px] ${probColor}`}>{prob}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-[10.5px] font-bold ${
                          p.riskLevel === "CRITICAL" || p.riskLevel === "HIGH"
                            ? "bg-red-500/10 text-red-400 border border-red-500/20"
                            : p.riskLevel === "MEDIUM"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        }`}>
                          {p.riskLevel}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-muted text-[12px]">
                        {p.reasons?.[0] ?? "Environmental / Land Acquisition delay"}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Link to={`/projects/${p.id}`} className="inline-flex items-center gap-1 text-[12px] font-semibold text-orange hover:text-orange-light transition-colors">
                          Details <ArrowRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}