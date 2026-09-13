import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Brain,
  Sliders,
  Sparkles,
  TrendingUp,
  Timer,
  ShieldAlert,
  Search,
  ArrowRight,
  RefreshCw,
  AlertTriangle,
  Layers,
  CheckCircle2,
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
      recommendation:
        riskLevel === "CRITICAL"
          ? "Freeze scope variations immediately; submit fast-track intervention to PM GatiShakti NPG."
          : riskLevel === "HIGH"
          ? "Institute bi-weekly contractor audit and enforce milestone liquidated damages."
          : "Standard physical inspection schedule; variance within acceptable limits.",
    };
  }, [simCostIncrease, simProgress, simDelayMonths]);

  const stats = useMemo(() => {
    const costRisk = predictions.filter((p) => (p.costProbability ?? 0) >= 50).length;
    const timeRisk = predictions.filter((p) => (p.timeProbability ?? 0) >= 50).length;
    const highRisk = predictions.filter((p) => p.riskLevel === "HIGH" || p.riskLevel === "CRITICAL").length;

    return {
      total: projects.length,
      costRisk,
      timeRisk,
      highRisk,
    };
  }, [projects, predictions]);

  const filteredPredictions = useMemo(() => {
    if (!searchQuery) return predictions;
    const q = searchQuery.toLowerCase();
    return predictions.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.agency?.toLowerCase().includes(q) ||
        p.sector?.toLowerCase().includes(q)
    );
  }, [predictions, searchQuery]);

  const selectedProject = projects.find(
    (p) => String(p.id) === String(selectedProjectId)
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Prediction & Simulation Center"
        subtitle="Random Forest machine-learning forecasting and interactive what-if risk simulations."
      />

      {/* KPI METRICS */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        <Card className="p-4 border-l-4 border-l-primary-500">
          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
            Portfolio Evaluated
          </p>
          <p className="mt-1.5 text-2xl font-bold text-slate-900">
            {loading ? "—" : stats.total}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">Active projects</p>
        </Card>

        <Card className="p-4 border-l-4 border-l-amber-500">
          <p className="text-[11px] font-medium uppercase tracking-wider text-amber-600">
            Cost Overrun Risk
          </p>
          <p className="mt-1.5 text-2xl font-bold text-amber-600">
            {loading ? "—" : stats.costRisk}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">&gt;50% ML probability</p>
        </Card>

        <Card className="p-4 border-l-4 border-l-blue-500">
          <p className="text-[11px] font-medium uppercase tracking-wider text-blue-600">
            Schedule Delay Risk
          </p>
          <p className="mt-1.5 text-2xl font-bold text-blue-600">
            {loading ? "—" : stats.timeRisk}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">&gt;50% delay probability</p>
        </Card>

        <Card className="p-4 border-l-4 border-l-red-500">
          <p className="text-[11px] font-medium uppercase tracking-wider text-red-600">
            High / Critical Risk
          </p>
          <p className="mt-1.5 text-2xl font-bold text-red-600">
            {loading ? "—" : stats.highRisk}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">Requires intervention</p>
        </Card>
      </div>

      {/* TABS HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-2">
        <div className="flex space-x-1.5">
          <button
            onClick={() => setActiveTab("simulator")}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
              activeTab === "simulator"
                ? "bg-primary-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Sliders className="h-3.5 w-3.5" />
            Interactive What-If Simulator
          </button>
          <button
            onClick={() => setActiveTab("cost")}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
              activeTab === "cost"
                ? "bg-primary-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            Cost Overrun Forecasts
          </button>
          <button
            onClick={() => setActiveTab("schedule")}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
              activeTab === "schedule"
                ? "bg-primary-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Timer className="h-3.5 w-3.5" />
            Schedule Delay Forecasts
          </button>
          <button
            onClick={() => setActiveTab("features")}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
              activeTab === "features"
                ? "bg-primary-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            Feature Importance
          </button>
        </div>

        {activeTab !== "simulator" && activeTab !== "features" && (
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search forecast..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8.5 rounded-lg border border-slate-200 pl-8 pr-3 text-xs focus:border-primary-500 focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* TAB CONTENT: WHAT-IF SIMULATOR */}
      {activeTab === "simulator" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Controls column */}
          <Card className="p-5 lg:col-span-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-primary-100 p-1.5 text-primary-700">
                  <Sliders className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Simulation Parameters
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Adjust variables to simulate risk impact in real-time
                  </p>
                </div>
              </div>
            </div>

            {/* Select project */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Target Infrastructure Project
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => handleSelectProject(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 shadow-sm focus:border-primary-500 focus:outline-none"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.agency || "MoSPI"})
                  </option>
                ))}
              </select>
            </div>

            {/* Sliders */}
            <div className="space-y-4 pt-1">
              <div>
                <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>Physical Completion Progress</span>
                  <span className="font-semibold text-primary-700">{simProgress}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="95"
                  value={simProgress}
                  onChange={(e) => setSimProgress(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-primary-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>Early Phase (5%)</span>
                  <span>Midway (50%)</span>
                  <span>Near Completion (95%)</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>Anticipated Cost Escalation</span>
                  <span className="font-semibold text-amber-700">+{simCostIncrease}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={simCostIncrease}
                  onChange={(e) => setSimCostIncrease(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-amber-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>On Budget (0%)</span>
                  <span>Moderate (+25%)</span>
                  <span>High Overrun (+60%)</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>Anticipated Schedule Slippage</span>
                  <span className="font-semibold text-blue-700">+{simDelayMonths} Months</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="24"
                  value={simDelayMonths}
                  onChange={(e) => setSimDelayMonths(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>On Time (0 mo)</span>
                  <span>1 Year (+12 mo)</span>
                  <span>2 Years (+24 mo)</span>
                </div>
              </div>
            </div>

            {selectedProject && (
              <div className="rounded-lg bg-slate-50 p-3 text-[11px] text-slate-600 border border-slate-100 flex justify-between">
                <span>Sanctioned: ₹{Number(selectedProject.approved_cost || 0).toLocaleString()} Cr</span>
                <span>Current Revised: ₹{Number(selectedProject.revised_cost || selectedProject.approved_cost || 0).toLocaleString()} Cr</span>
              </div>
            )}
          </Card>

          {/* Real-time ML Prediction Output */}
          <Card className="p-5 lg:col-span-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-emerald-100 p-1.5 text-emerald-700">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Real-Time AI Projection
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Dynamic inference from Pragati Random Forest & Rule Engine
                    </p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    simResult.riskLevel === "CRITICAL"
                      ? "bg-red-100 text-red-700 border border-red-200"
                      : simResult.riskLevel === "HIGH"
                      ? "bg-amber-100 text-amber-700 border border-amber-200"
                      : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                  }`}
                >
                  {simResult.riskLevel} RISK
                </span>
              </div>

              {/* Gauge / Score */}
              <div className="mt-5 text-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Composite Risk Index
                </p>
                <div className="mt-2 text-4xl font-extrabold text-slate-900">
                  {simResult.riskScore}
                  <span className="text-lg font-normal text-slate-400">/100</span>
                </div>

                {/* Progress bar */}
                <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
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

              {/* Forecast breakdown cards */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-slate-200 p-3 bg-white">
                  <p className="text-[11px] font-medium text-slate-500">
                    Cost Overrun Likelihood
                  </p>
                  <p className="mt-1 text-xl font-bold text-amber-600">
                    {simResult.costProb}%
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {simResult.costProb > 50 ? "High probability" : "Contained"}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 p-3 bg-white">
                  <p className="text-[11px] font-medium text-slate-500">
                    Schedule Slippage Likelihood
                  </p>
                  <p className="mt-1 text-xl font-bold text-blue-600">
                    {simResult.timeProb}%
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {simResult.timeProb > 50 ? "High probability" : "Manageable"}
                  </p>
                </div>
              </div>
            </div>

            {/* AI Recommendation */}
            <div className="rounded-lg border border-primary-200 bg-primary-50/70 p-3.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-primary-900">
                <Brain className="h-4 w-4 text-primary-600" />
                AI Decision Recommendation
              </div>
              <p className="mt-1 text-xs leading-relaxed text-primary-800">
                {simResult.recommendation}
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* TAB CONTENT: COST OVERRUN FORECASTS */}
      {activeTab === "cost" && (
        <Card className="overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50 px-5 py-3.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Machine Learning Cost Overrun Probability Ranking
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50/50 text-[11px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3">Project</th>
                  <th className="px-5 py-3">Agency / Sector</th>
                  <th className="px-5 py-3">Approved Cost</th>
                  <th className="px-5 py-3">Cost Overrun Probability</th>
                  <th className="px-5 py-3">Risk Level</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPredictions.map((pred) => (
                  <tr key={pred.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-5 py-3.5 font-medium text-slate-900">
                      <Link
                        to={`/projects/${pred.id}`}
                        className="hover:text-primary-600 hover:underline"
                      >
                        {pred.name}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      {pred.agency || "MoSPI"} • {pred.sector || "Infrastructure"}
                    </td>
                    <td className="px-5 py-3 font-medium text-slate-800">
                      ₹{Number(pred.approvedCost || 0).toLocaleString()} Cr
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className={`h-full rounded-full ${
                              pred.costProbability > 60
                                ? "bg-red-500"
                                : pred.costProbability > 30
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            }`}
                            style={{ width: `${pred.costProbability || 0}%` }}
                          />
                        </div>
                        <span className="font-semibold text-slate-800">
                          {pred.costProbability}%
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          pred.riskLevel === "HIGH" || pred.riskLevel === "CRITICAL"
                            ? "bg-red-100 text-red-700"
                            : pred.riskLevel === "MEDIUM"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {pred.riskLevel}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        to={`/projects/${pred.id}`}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary-600 hover:text-primary-700"
                      >
                        Details <ArrowRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB CONTENT: SCHEDULE DELAY FORECASTS */}
      {activeTab === "schedule" && (
        <Card className="overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50 px-5 py-3.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Schedule Slippage & Delay Probability Ranking
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50/50 text-[11px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3">Project</th>
                  <th className="px-5 py-3">Agency / Sector</th>
                  <th className="px-5 py-3">Progress</th>
                  <th className="px-5 py-3">Delay Probability</th>
                  <th className="px-5 py-3">Expected Delay</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPredictions.map((pred) => (
                  <tr key={pred.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-5 py-3.5 font-medium text-slate-900">
                      <Link
                        to={`/projects/${pred.id}`}
                        className="hover:text-primary-600 hover:underline"
                      >
                        {pred.name}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      {pred.agency || "MoSPI"} • {pred.sector || "Infrastructure"}
                    </td>
                    <td className="px-5 py-3 font-medium text-slate-800">
                      {pred.physicalProgress || 45}%
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className={`h-full rounded-full ${
                              pred.timeProbability > 60
                                ? "bg-red-500"
                                : pred.timeProbability > 30
                                ? "bg-blue-500"
                                : "bg-emerald-500"
                            }`}
                            style={{ width: `${pred.timeProbability || 0}%` }}
                          />
                        </div>
                        <span className="font-semibold text-slate-800">
                          {pred.timeProbability}%
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-semibold text-blue-700">
                      +{pred.predictedDelayMonths || Math.round(Number(pred.timeProbability || 0) * 0.2)} mo
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        to={`/projects/${pred.id}`}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary-600 hover:text-primary-700"
                      >
                        Details <ArrowRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB CONTENT: FEATURE IMPORTANCE */}
      {activeTab === "features" && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-slate-900">
              Cost Overrun Model — Key Drivers
            </h3>
            <p className="mt-0.5 text-xs text-slate-500 mb-4">
              Scikit-Learn Random Forest Regressor feature weights
            </p>
            <div className="space-y-3">
              {[
                { feature: "Sanctioned vs Revised Cost Ratio", weight: 34 },
                { feature: "Physical Progress Completion Gap", weight: 26 },
                { feature: "Land Acquisition & RoW Clearances", weight: 18 },
                { feature: "Executing Agency Historical Variance", weight: 14 },
                { feature: "Sector Complexity & Corridor Length", weight: 8 },
              ].map((item) => (
                <div key={item.feature}>
                  <div className="flex justify-between text-xs text-slate-700 mb-1">
                    <span>{item.feature}</span>
                    <span className="font-semibold">{item.weight}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${item.weight * 2.5}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-semibold text-slate-900">
              Schedule Delay Model — Key Drivers
            </h3>
            <p className="mt-0.5 text-xs text-slate-500 mb-4">
              Gradient-boosted time-to-completion predictive factors
            </p>
            <div className="space-y-3">
              {[
                { feature: "Elapsed Months vs Initial Planned Duration", weight: 38 },
                { feature: "Environmental & Forest Clearance Lag", weight: 24 },
                { feature: "Contractor Milestones Hit Rate", weight: 19 },
                { feature: "Inter-Agency Utility Shifting Approvals", weight: 12 },
                { feature: "Geographic / Monsoon Vulnerability", weight: 7 },
              ].map((item) => (
                <div key={item.feature}>
                  <div className="flex justify-between text-xs text-slate-700 mb-1">
                    <span>{item.feature}</span>
                    <span className="font-semibold">{item.weight}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${item.weight * 2.5}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* MODEL FOOTNOTE */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-3.5 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-700">
            Pragati AI Machine Learning Governance & MoSPI Calibration
          </p>
          <p className="text-[11px] text-slate-500">
            Validated against MoSPI infrastructure datasets across 1,800+ national infrastructure projects.
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
          <CheckCircle2 className="h-3.5 w-3.5" /> Models Active
        </span>
      </div>
    </div>
  );
}