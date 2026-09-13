import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldAlert,
  AlertTriangle,
  Layers,
  Search,
  ArrowRight,
  TrendingUp,
  Timer,
  CheckCircle2,
  Filter,
  BarChart3,
  SlidersHorizontal,
} from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/common/Card";
import { api } from "../../services/apiClient";

export default function RiskIntelligence() {
  const [projects, setProjects] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [matrixFilter, setMatrixFilter] = useState(null);

  useEffect(() => {
    async function loadRiskData() {
      try {
        const [projRes, predRes] = await Promise.all([
          api.get("/api/projects", { params: { skip: 0, limit: 12 } }),
          api.get("/api/predictions", { params: { limit: 12 } }),
        ]);

        const items = Array.isArray(projRes) ? projRes : projRes?.items ?? [];
        setProjects(items);

        const predItems = (predRes?.items ?? []).map((p) => ({
          id: p.id,
          name: p.name || "Unnamed Project",
          agency: p.agency || "MoSPI",
          sector: p.sector || "Infrastructure",
          riskScore: Number(p.riskScore ?? 0),
          riskLevel: p.riskLevel ?? "LOW",
          costRisk: Number(p.costProbability ?? 0),
          timeRisk: Number(p.timeProbability ?? 0),
          reasons: p.reasons ?? [],
        }));

        setAnalyses(predItems);
      } catch (err) {
        console.error("Failed to load risk data:", err);
        setProjects([]);
        setAnalyses([]);
      } finally {
        setLoading(false);
      }
    }

    loadRiskData();
  }, []);

  const stats = useMemo(() => {
    const total = analyses.length;
    const high = analyses.filter((p) => p.riskLevel === "HIGH" || p.riskLevel === "CRITICAL").length;
    const medium = analyses.filter((p) => p.riskLevel === "MEDIUM").length;
    const low = analyses.filter((p) => p.riskLevel === "LOW").length;
    const avg = total > 0 ? analyses.reduce((sum, p) => sum + p.riskScore, 0) / total : 0;
    const costDriverCount = analyses.filter((p) => p.costRisk >= 50).length;
    const timeDriverCount = analyses.filter((p) => p.timeRisk >= 50).length;

    return { total, high, medium, low, avg, costDriverCount, timeDriverCount };
  }, [analyses]);

  const filtered = useMemo(() => {
    let result = analyses;

    if (filter === "HIGH") {
      result = result.filter((p) => p.riskLevel === "HIGH" || p.riskLevel === "CRITICAL");
    } else if (filter === "MEDIUM") {
      result = result.filter((p) => p.riskLevel === "MEDIUM");
    } else if (filter === "LOW") {
      result = result.filter((p) => p.riskLevel === "LOW");
    } else if (filter === "COST") {
      result = result.filter((p) => p.costRisk >= 50);
    } else if (filter === "TIME") {
      result = result.filter((p) => p.timeRisk >= 50);
    }

    if (matrixFilter) {
      if (matrixFilter === "high-high") {
        result = result.filter((p) => p.riskScore >= 70);
      } else if (matrixFilter === "high-med") {
        result = result.filter((p) => p.riskScore >= 50 && p.riskScore < 70);
      } else if (matrixFilter === "med-low") {
        result = result.filter((p) => p.riskScore >= 30 && p.riskScore < 50);
      } else if (matrixFilter === "low-low") {
        result = result.filter((p) => p.riskScore < 30);
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.agency.toLowerCase().includes(q) ||
          p.sector.toLowerCase().includes(q) ||
          p.reasons.some((r) => r.toLowerCase().includes(q))
      );
    }

    return result.sort((a, b) => b.riskScore - a.riskScore);
  }, [analyses, filter, matrixFilter, searchQuery]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Portfolio Risk Intelligence"
        subtitle="Multi-factor risk indexing, AI root-cause decomposition, and cross-sector vulnerability mapping."
      />

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        <Card
          onClick={() => { setFilter("ALL"); setMatrixFilter(null); }}
          className={`cursor-pointer p-4 border-l-4 border-l-primary-500 transition hover:shadow-md ${
            filter === "ALL" && !matrixFilter ? "ring-2 ring-primary-500 bg-primary-50/20" : ""
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Mean Portfolio Risk
            </p>
            <BarChart3 className="h-4 w-4 text-primary-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {loading ? "—" : `${stats.avg.toFixed(0)}/100`}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">Across {stats.total} major projects</p>
        </Card>

        <Card
          onClick={() => { setFilter(filter === "HIGH" ? "ALL" : "HIGH"); setMatrixFilter(null); }}
          className={`cursor-pointer p-4 border-l-4 border-l-red-500 transition hover:shadow-md ${
            filter === "HIGH" ? "ring-2 ring-red-500 bg-red-50/20" : ""
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-red-600">
              Critical & High Risk
            </p>
            <ShieldAlert className="h-4 w-4 text-red-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-red-600">
            {loading ? "—" : stats.high}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">Exceeds 70 risk index</p>
        </Card>

        <Card
          onClick={() => { setFilter(filter === "COST" ? "ALL" : "COST"); setMatrixFilter(null); }}
          className={`cursor-pointer p-4 border-l-4 border-l-amber-500 transition hover:shadow-md ${
            filter === "COST" ? "ring-2 ring-amber-500 bg-amber-50/20" : ""
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-600">
              Cost Escalation Risk
            </p>
            <TrendingUp className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-600">
            {loading ? "—" : stats.costDriverCount}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">&gt;50% escalation probability</p>
        </Card>

        <Card
          onClick={() => { setFilter(filter === "TIME" ? "ALL" : "TIME"); setMatrixFilter(null); }}
          className={`cursor-pointer p-4 border-l-4 border-l-blue-500 transition hover:shadow-md ${
            filter === "TIME" ? "ring-2 ring-blue-500 bg-blue-50/20" : ""
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-600">
              Schedule Slippage Risk
            </p>
            <Timer className="h-4 w-4 text-blue-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-blue-600">
            {loading ? "—" : stats.timeDriverCount}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">&gt;50% delay probability</p>
        </Card>
      </div>

      {/* 2-COLUMN INTELLIGENCE SECTION: MATRIX & DRIVERS */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Interactive 3x3 Risk Matrix */}
        <Card className="p-5 lg:col-span-6 space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Interactive Risk Matrix
              </h3>
              <p className="text-[11px] text-slate-500">
                Click any zone below to filter corresponding projects instantly
              </p>
            </div>
            {matrixFilter && (
              <button
                onClick={() => setMatrixFilter(null)}
                className="text-[11px] font-semibold text-primary-600 hover:underline"
              >
                Clear Matrix Filter
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div
              onClick={() => setMatrixFilter(matrixFilter === "high-high" ? null : "high-high")}
              className={`cursor-pointer rounded-xl border p-4 transition text-center ${
                matrixFilter === "high-high"
                  ? "bg-red-100 border-red-400 ring-2 ring-red-400"
                  : "bg-red-50/80 border-red-200 hover:bg-red-100/70"
              }`}
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-red-700">
                Severe Zone (Score ≥ 70)
              </span>
              <p className="mt-1 text-2xl font-extrabold text-red-800">
                {analyses.filter((p) => p.riskScore >= 70).length} Projects
              </p>
              <p className="mt-1 text-[10px] text-red-600">High Prob + High Cost Impact</p>
            </div>

            <div
              onClick={() => setMatrixFilter(matrixFilter === "high-med" ? null : "high-med")}
              className={`cursor-pointer rounded-xl border p-4 transition text-center ${
                matrixFilter === "high-med"
                  ? "bg-amber-100 border-amber-400 ring-2 ring-amber-400"
                  : "bg-amber-50/80 border-amber-200 hover:bg-amber-100/70"
              }`}
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                Elevated Zone (Score 50-69)
              </span>
              <p className="mt-1 text-2xl font-extrabold text-amber-800">
                {analyses.filter((p) => p.riskScore >= 50 && p.riskScore < 70).length} Projects
              </p>
              <p className="mt-1 text-[10px] text-amber-600">Medium Prob + High Delay Impact</p>
            </div>

            <div
              onClick={() => setMatrixFilter(matrixFilter === "med-low" ? null : "med-low")}
              className={`cursor-pointer rounded-xl border p-4 transition text-center ${
                matrixFilter === "med-low"
                  ? "bg-blue-100 border-blue-400 ring-2 ring-blue-400"
                  : "bg-blue-50/80 border-blue-200 hover:bg-blue-100/70"
              }`}
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
                Moderate Zone (Score 30-49)
              </span>
              <p className="mt-1 text-2xl font-extrabold text-blue-800">
                {analyses.filter((p) => p.riskScore >= 30 && p.riskScore < 50).length} Projects
              </p>
              <p className="mt-1 text-[10px] text-blue-600">Moderate Variance Expected</p>
            </div>

            <div
              onClick={() => setMatrixFilter(matrixFilter === "low-low" ? null : "low-low")}
              className={`cursor-pointer rounded-xl border p-4 transition text-center ${
                matrixFilter === "low-low"
                  ? "bg-emerald-100 border-emerald-400 ring-2 ring-emerald-400"
                  : "bg-emerald-50/80 border-emerald-200 hover:bg-emerald-100/70"
              }`}
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                Stable Zone (Score &lt; 30)
              </span>
              <p className="mt-1 text-2xl font-extrabold text-emerald-800">
                {analyses.filter((p) => p.riskScore < 30).length} Projects
              </p>
              <p className="mt-1 text-[10px] text-emerald-600">On Track / Minor Monitoring</p>
            </div>
          </div>
        </Card>

        {/* Primary Portfolio Risk Drivers */}
        <Card className="p-5 lg:col-span-6 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-semibold text-slate-900">
              Primary Vulnerability Drivers
            </h3>
            <p className="text-[11px] text-slate-500">
              Aggregated system signals across all monitored corridors
            </p>
          </div>

          <div className="space-y-3.5">
            {[
              {
                name: "Cost Revision & Scope Creep",
                count: stats.costDriverCount,
                pct: Math.round((stats.costDriverCount / (stats.total || 1)) * 100),
                color: "bg-amber-500",
              },
              {
                name: "Contractor Physical Execution Lag",
                count: stats.timeDriverCount,
                pct: Math.round((stats.timeDriverCount / (stats.total || 1)) * 100),
                color: "bg-blue-500",
              },
              {
                name: "Critical Combined Escalation",
                count: stats.high,
                pct: Math.round((stats.high / (stats.total || 1)) * 100),
                color: "bg-red-500",
              },
              {
                name: "Stable Milestones & RoW Cleared",
                count: stats.low,
                pct: Math.round((stats.low / (stats.total || 1)) * 100),
                color: "bg-emerald-500",
              },
            ].map((d) => (
              <div key={d.name}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">{d.name}</span>
                  <span className="font-bold text-slate-900">
                    {d.count} ({d.pct}%)
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${d.color}`}
                    style={{ width: `${d.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* FILTER & SEARCH CONTROLS */}
      <Card className="p-3.5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search project risk register by name, agency, or sector..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 pl-9 pr-4 py-2 text-xs focus:border-primary-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-medium text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Filter:
            </span>
            {[
              { label: "All", key: "ALL" },
              { label: "Critical/High", key: "HIGH" },
              { label: "Medium", key: "MEDIUM" },
              { label: "Low", key: "LOW" },
              { label: "Cost Driven", key: "COST" },
              { label: "Delay Driven", key: "TIME" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => { setFilter(tab.key); setMatrixFilter(null); }}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                  filter === tab.key && !matrixFilter
                    ? "bg-primary-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* PROJECT RISK TABLE */}
      <Card className="overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50 px-5 py-3.5 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            Project-Level Risk Register ({filtered.length} Projects Shown)
          </h3>
          {matrixFilter && (
            <span className="rounded-full bg-primary-100 px-2.5 py-0.5 text-[10px] font-bold text-primary-800">
              Filtered by Matrix: {matrixFilter.toUpperCase()}
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50/50 text-[11px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Project</th>
                <th className="px-5 py-3 font-semibold">Agency / Sector</th>
                <th className="px-5 py-3 font-semibold text-center">Risk Score</th>
                <th className="px-5 py-3 font-semibold">Cost Overrun Risk</th>
                <th className="px-5 py-3 font-semibold">Delay Risk</th>
                <th className="px-5 py-3 font-semibold">Severity</th>
                <th className="px-5 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition">
                  <td className="px-5 py-3.5 font-medium text-slate-900">
                    <Link
                      to={`/projects/${item.id}`}
                      className="hover:text-primary-600 hover:underline"
                    >
                      {item.name}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-slate-600">
                    {item.agency} • {item.sector}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span
                      className={`inline-block font-extrabold text-sm ${
                        item.riskScore >= 70
                          ? "text-red-600"
                          : item.riskScore >= 45
                          ? "text-amber-600"
                          : "text-emerald-600"
                      }`}
                    >
                      {item.riskScore}/100
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className={`h-full rounded-full ${
                            item.costRisk > 50 ? "bg-amber-500" : "bg-emerald-500"
                          }`}
                          style={{ width: `${item.costRisk}%` }}
                        />
                      </div>
                      <span className="text-slate-700 font-medium">{item.costRisk.toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className={`h-full rounded-full ${
                            item.timeRisk > 50 ? "bg-blue-500" : "bg-emerald-500"
                          }`}
                          style={{ width: `${item.timeRisk}%` }}
                        />
                      </div>
                      <span className="text-slate-700 font-medium">{item.timeRisk.toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        item.riskLevel === "HIGH" || item.riskLevel === "CRITICAL"
                          ? "bg-red-100 text-red-700"
                          : item.riskLevel === "MEDIUM"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {item.riskLevel}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      to={`/projects/${item.id}`}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary-600 hover:text-primary-700"
                    >
                      Review <ArrowRight className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-5 py-10 text-center text-xs text-slate-500">
                    No projects found matching the current search and filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}