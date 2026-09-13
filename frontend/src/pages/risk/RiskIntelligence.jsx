import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldAlert, AlertTriangle, Layers, Search, ArrowRight,
  TrendingUp, Timer, CheckCircle2, Filter, BarChart3, SlidersHorizontal,
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
          p.sector.toLowerCase().includes(q)
      );
    }

    return result;
  }, [analyses, filter, matrixFilter, searchQuery]);

  return (
    <div className="space-y-6 animate-slideUp">
      <PageHeader
        title="Risk Assessment & Vulnerability Intelligence"
        subtitle="Multi-factor risk evaluation matrix, early disruption signals, and vulnerability scoring across major infrastructure assets."
      />

      {/* KPI METRICS ROW */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        <div className="rounded-2xl border-l-4 border-l-orange border border-white/[0.06] bg-surface-card p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10.5px] font-bold uppercase tracking-widest text-orange">Portfolio Risk Index</p>
            <BarChart3 size={14} className="text-orange" />
          </div>
          <p className="text-[26px] font-extrabold tabular-nums text-orange">
            {loading ? "—" : Math.round(stats.avg)}
            <span className="text-[12px] font-normal text-muted">/100</span>
          </p>
          <p className="mt-1 text-[11px] text-muted">Average vulnerability rating</p>
        </div>

        <div
          onClick={() => { setFilter(filter === "HIGH" ? "ALL" : "HIGH"); setMatrixFilter(null); }}
          className={`cursor-pointer rounded-2xl border-l-4 border-l-red-500 border border-white/[0.06] bg-surface-card p-4 transition-all hover:bg-white/[0.04] ${
            filter === "HIGH" ? "ring-1 ring-red-500/50" : ""
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10.5px] font-bold uppercase tracking-widest text-red-400">Critical & High Risk</p>
            <ShieldAlert size={14} className="text-red-400" />
          </div>
          <p className="text-[26px] font-extrabold tabular-nums text-red-400">
            {loading ? "—" : stats.high}
          </p>
          <p className="mt-1 text-[11px] text-muted">Exceeds 70 risk index</p>
        </div>

        <div
          onClick={() => { setFilter(filter === "COST" ? "ALL" : "COST"); setMatrixFilter(null); }}
          className={`cursor-pointer rounded-2xl border-l-4 border-l-amber-500 border border-white/[0.06] bg-surface-card p-4 transition-all hover:bg-white/[0.04] ${
            filter === "COST" ? "ring-1 ring-amber-500/50" : ""
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10.5px] font-bold uppercase tracking-widest text-amber-400">Cost Escalation Risk</p>
            <TrendingUp size={14} className="text-amber-400" />
          </div>
          <p className="text-[26px] font-extrabold tabular-nums text-amber-400">
            {loading ? "—" : stats.costDriverCount}
          </p>
          <p className="mt-1 text-[11px] text-muted">&gt;50% escalation probability</p>
        </div>

        <div
          onClick={() => { setFilter(filter === "TIME" ? "ALL" : "TIME"); setMatrixFilter(null); }}
          className={`cursor-pointer rounded-2xl border-l-4 border-l-blue-500 border border-white/[0.06] bg-surface-card p-4 transition-all hover:bg-white/[0.04] ${
            filter === "TIME" ? "ring-1 ring-blue-500/50" : ""
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10.5px] font-bold uppercase tracking-widest text-blue-400">Schedule Slippage Risk</p>
            <Timer size={14} className="text-blue-400" />
          </div>
          <p className="text-[26px] font-extrabold tabular-nums text-blue-400">
            {loading ? "—" : stats.timeDriverCount}
          </p>
          <p className="mt-1 text-[11px] text-muted">&gt;50% delay probability</p>
        </div>
      </div>

      {/* MATRIX & DRIVERS SECTION */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Risk Matrix */}
        <Card className="p-5 lg:col-span-6 space-y-3.5">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div>
              <h3 className="text-[13.5px] font-semibold text-ink">Interactive Risk Matrix</h3>
              <p className="text-[11px] text-muted">Click any zone to filter matching projects</p>
            </div>
            {matrixFilter && (
              <button
                onClick={() => setMatrixFilter(null)}
                className="text-[11px] font-semibold text-orange hover:underline"
              >
                Clear Filter
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div
              onClick={() => setMatrixFilter(matrixFilter === "high-high" ? null : "high-high")}
              className={`cursor-pointer rounded-xl border p-4 text-center transition-all ${
                matrixFilter === "high-high"
                  ? "bg-red-500/20 border-red-500/50 ring-1 ring-red-500/50"
                  : "bg-red-500/10 border-red-500/20 hover:bg-red-500/15"
              }`}
            >
              <span className="text-[10.5px] font-bold uppercase tracking-widest text-red-400">Severe Zone (≥ 70)</span>
              <p className="mt-1.5 text-2xl font-extrabold text-red-400">
                {analyses.filter((p) => p.riskScore >= 70).length} Projects
              </p>
              <p className="mt-1 text-[10.5px] text-red-300/70">High Prob + High Impact</p>
            </div>

            <div
              onClick={() => setMatrixFilter(matrixFilter === "high-med" ? null : "high-med")}
              className={`cursor-pointer rounded-xl border p-4 text-center transition-all ${
                matrixFilter === "high-med"
                  ? "bg-amber-500/20 border-amber-500/50 ring-1 ring-amber-500/50"
                  : "bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/15"
              }`}
            >
              <span className="text-[10.5px] font-bold uppercase tracking-widest text-amber-400">Elevated Zone (50–69)</span>
              <p className="mt-1.5 text-2xl font-extrabold text-amber-400">
                {analyses.filter((p) => p.riskScore >= 50 && p.riskScore < 70).length} Projects
              </p>
              <p className="mt-1 text-[10.5px] text-amber-300/70">Medium Prob + High Delay</p>
            </div>

            <div
              onClick={() => setMatrixFilter(matrixFilter === "med-low" ? null : "med-low")}
              className={`cursor-pointer rounded-xl border p-4 text-center transition-all ${
                matrixFilter === "med-low"
                  ? "bg-blue-500/20 border-blue-500/50 ring-1 ring-blue-500/50"
                  : "bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/15"
              }`}
            >
              <span className="text-[10.5px] font-bold uppercase tracking-widest text-blue-400">Moderate Zone (30–49)</span>
              <p className="mt-1.5 text-2xl font-extrabold text-blue-400">
                {analyses.filter((p) => p.riskScore >= 30 && p.riskScore < 50).length} Projects
              </p>
              <p className="mt-1 text-[10.5px] text-blue-300/70">Moderate Variance</p>
            </div>

            <div
              onClick={() => setMatrixFilter(matrixFilter === "low-low" ? null : "low-low")}
              className={`cursor-pointer rounded-xl border p-4 text-center transition-all ${
                matrixFilter === "low-low"
                  ? "bg-emerald-500/20 border-emerald-500/50 ring-1 ring-emerald-500/50"
                  : "bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/15"
              }`}
            >
              <span className="text-[10.5px] font-bold uppercase tracking-widest text-emerald-400">Stable Zone (&lt; 30)</span>
              <p className="mt-1.5 text-2xl font-extrabold text-emerald-400">
                {analyses.filter((p) => p.riskScore < 30).length} Projects
              </p>
              <p className="mt-1 text-[10.5px] text-emerald-300/70">On Track / Low Risk</p>
            </div>
          </div>
        </Card>

        {/* Primary Drivers */}
        <Card className="p-5 lg:col-span-6 space-y-4">
          <div className="border-b border-white/[0.06] pb-3">
            <h3 className="text-[13.5px] font-semibold text-ink">Primary Vulnerability Drivers</h3>
            <p className="text-[11px] text-muted">Aggregated risk signals across monitored corridors</p>
          </div>

          <div className="space-y-3">
            {[
              { label: "Land Acquisition & Right of Way (RoW)", pct: 84, bar: "bg-red-500", text: "text-red-400" },
              { label: "Environmental & Statutory Clearances",  pct: 68, bar: "bg-amber-500", text: "text-amber-400" },
              { label: "Contractor Liquidity & Cash-flow",       pct: 52, bar: "bg-orange",    text: "text-orange" },
              { label: "Utility Shifting & Local Resistance",    pct: 37, bar: "bg-blue-500",  text: "text-blue-400" },
            ].map((driver) => (
              <div key={driver.label} className="space-y-1">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="font-medium text-ink">{driver.label}</span>
                  <span className={`font-bold ${driver.text}`}>{driver.pct}% Prevalence</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.08]">
                  <div className={`h-full rounded-full ${driver.bar}`} style={{ width: `${driver.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* FILTER & SEARCH BAR */}
      <Card className="p-3.5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search by project name, agency, or sector..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.05] pl-9 pr-4 py-2 text-[12.5px] text-ink placeholder:text-muted outline-none focus:border-orange/50 focus:bg-white/[0.08] transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10.5px] font-bold uppercase tracking-widest text-muted mr-1 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Risk Category:
            </span>
            {[
              { label: "All Projects",    key: "ALL" },
              { label: "High / Critical", key: "HIGH" },
              { label: "Medium",          key: "MEDIUM" },
              { label: "Low",             key: "LOW" },
              { label: "Cost Driver",     key: "COST" },
              { label: "Schedule Driver", key: "TIME" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => { setFilter(tab.key); setMatrixFilter(null); }}
                className={`rounded-full px-3 py-1 text-[11.5px] font-semibold transition-colors ${
                  filter === tab.key && !matrixFilter
                    ? "bg-orange text-white"
                    : "bg-white/[0.06] text-muted hover:bg-white/[0.10] hover:text-ink"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* RISK LEDGER TABLE */}
      <Card className="overflow-hidden">
        <div className="border-b border-white/[0.06] bg-white/[0.02] px-5 py-3.5 flex items-center justify-between">
          <h3 className="text-[12px] font-bold uppercase tracking-wider text-ink">
            Risk Analysis Ledger <span className="ml-2 text-orange">({filtered.length} Monitored Assets)</span>
          </h3>
          <span className="text-[11px] text-muted font-medium">Updated live from predictive models</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-muted">Loading risk data…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-white/[0.06] bg-white/[0.02] text-[10.5px] uppercase tracking-widest text-muted">
                <tr>
                  <th className="px-5 py-3 font-bold">Project Name</th>
                  <th className="px-5 py-3 font-bold">Sector</th>
                  <th className="px-5 py-3 font-bold text-center">Risk Index</th>
                  <th className="px-5 py-3 font-bold">Cost Risk</th>
                  <th className="px-5 py-3 font-bold">Time Delay Risk</th>
                  <th className="px-5 py-3 font-bold">Primary Driver</th>
                  <th className="px-5 py-3 text-right font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filtered.map((item) => {
                  const levelClass =
                    item.riskScore >= 70
                      ? "bg-red-500/10 text-red-400 border-red-500/20"
                      : item.riskScore >= 50
                      ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                      : item.riskScore >= 30
                      ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";

                  return (
                    <tr key={item.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="px-5 py-3.5">
                        <Link to={`/projects/${item.id}`} className="font-semibold text-ink hover:text-orange transition-colors text-[13px] block">
                          {item.name}
                        </Link>
                        <span className="text-[10.5px] text-muted font-mono">{item.agency}</span>
                      </td>
                      <td className="px-5 py-3 text-muted text-[12px]">{item.sector}</td>
                      <td className="px-5 py-3 text-center">
                        <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${levelClass}`}>
                          {item.riskScore} / 100
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/[0.08]">
                            <div className="h-full rounded-full bg-amber-500" style={{ width: `${item.costRisk}%` }} />
                          </div>
                          <span className="text-[12px] font-bold text-amber-400">{item.costRisk}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/[0.08]">
                            <div className="h-full rounded-full bg-blue-500" style={{ width: `${item.timeRisk}%` }} />
                          </div>
                          <span className="text-[12px] font-bold text-blue-400">{item.timeRisk}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-muted text-[12px]">
                        {item.reasons?.[0] ?? (item.costRisk > item.timeRisk ? "Budget overrun risk" : "Schedule delay risk")}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Link to={`/projects/${item.id}`} className="inline-flex items-center gap-1 text-[12px] font-semibold text-orange hover:text-orange-light transition-colors">
                          Details <ArrowRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}

                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-5 py-10 text-center text-sm text-muted">
                      No assets found matching the selected risk filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}