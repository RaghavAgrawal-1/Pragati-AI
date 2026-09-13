import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Award, TrendingUp, AlertTriangle, Search, Building2, Layers,
  ArrowRight, Sparkles, BarChart2, CheckCircle2,
} from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/common/Card";
import { api } from "../../services/apiClient";

function getRiskScore(project) {
  let score = 0;
  const approved = Number(project.approved_cost ?? 0);
  const revised  = Number(project.revised_cost  ?? 0);
  const progress = Number(project.physical_progress ?? 0);
  const status   = String(project.status ?? "").toLowerCase();

  if (approved > 0) {
    const escalation = ((revised - approved) / approved) * 100;
    if (escalation > 20) score += 40;
    else if (escalation > 10) score += 30;
    else if (escalation > 5) score += 10;
  }

  if (progress < 30) score += 40;
  else if (progress < 50) score += 30;
  else if (progress < 70) score += 15;
  else score += 5;

  if (["delayed", "stopped", "critical"].includes(status)) score += 30;
  else if (["running", "ongoing", "in progress"].includes(status)) score += 5;
  else score += 10;

  return Math.min(score, 100);
}

export default function Benchmarking() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dimension, setDimension] = useState("sector"); // 'sector' | 'ministry' | 'agency'
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await api.get("/api/projects", { params: { skip: 0, limit: 100 } });
        setProjects(Array.isArray(data) ? data : data.items ?? []);
      } catch (error) {
        console.error("Benchmarking error:", error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  const enriched = useMemo(
    () =>
      projects.map((project) => {
        const approved = Number(project.approved_cost ?? 0);
        const revised  = Number(project.revised_cost  ?? 0);
        const progress = Number(project.physical_progress ?? 0);
        const escalation = approved > 0 ? Math.max(0, ((revised - approved) / approved) * 100) : 0;
        const status = String(project.status ?? "").toLowerCase();
        const isDelayed = status.includes("delay") || status.includes("stop");

        return {
          ...project,
          progress,
          escalation,
          isDelayed,
          riskScore: getRiskScore(project),
        };
      }),
    [projects]
  );

  const benchmarkData = useMemo(() => {
    const map = {};
    enriched.forEach((p) => {
      let key = "Unknown";
      if (dimension === "sector") key = p.sector || "Infrastructure";
      else if (dimension === "ministry") key = p.ministry || "Nodal Ministry";
      else if (dimension === "agency") key = p.implementing_agency || p.agency || "Executing Agency";

      if (!map[key]) {
        map[key] = {
          name: key,
          projects: 0,
          totalProgress: 0,
          totalEscalation: 0,
          delayedCount: 0,
          totalRisk: 0,
        };
      }

      map[key].projects += 1;
      map[key].totalProgress += p.progress;
      map[key].totalEscalation += p.escalation;
      if (p.isDelayed) map[key].delayedCount += 1;
      map[key].totalRisk += p.riskScore;
    });

    return Object.values(map)
      .map((item) => ({
        ...item,
        avgProgress: item.projects > 0 ? item.totalProgress / item.projects : 0,
        avgEscalation: item.projects > 0 ? item.totalEscalation / item.projects : 0,
        delayRate: item.projects > 0 ? (item.delayedCount / item.projects) * 100 : 0,
        avgRisk: item.projects > 0 ? item.totalRisk / item.projects : 0,
      }))
      .sort((a, b) => b.avgProgress - a.avgProgress);
  }, [enriched, dimension]);

  const filteredBenchmarks = useMemo(() => {
    if (!searchQuery.trim()) return benchmarkData;
    const q = searchQuery.toLowerCase();
    return benchmarkData.filter((item) => item.name.toLowerCase().includes(q));
  }, [benchmarkData, searchQuery]);

  const bestCluster = benchmarkData[0];
  const lowestDelayCluster = useMemo(() => {
    if (!benchmarkData.length) return null;
    return [...benchmarkData].sort((a, b) => a.delayRate - b.delayRate)[0];
  }, [benchmarkData]);

  const lowestRiskCluster = useMemo(() => {
    if (!benchmarkData.length) return null;
    return [...benchmarkData].sort((a, b) => a.avgRisk - b.avgRisk)[0];
  }, [benchmarkData]);

  return (
    <div className="space-y-6 animate-slideUp">
      <PageHeader
        title="Cross-Portfolio Performance Benchmarking"
        subtitle="Comparative peer analytics evaluating delivery efficiency across Ministries, Sectors, and Executing Agencies."
      />

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        <div className="rounded-2xl border-l-4 border-l-emerald-500 border border-white/[0.06] bg-surface-card p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10.5px] font-bold uppercase tracking-widest text-emerald-400">Pacesetter Group</p>
            <Award size={14} className="text-emerald-400" />
          </div>
          <p className="mt-1.5 text-[20px] font-extrabold text-ink truncate">
            {loading ? "—" : bestCluster ? bestCluster.name : "—"}
          </p>
          <p className="mt-0.5 text-[11px] text-emerald-400 font-medium">
            {bestCluster ? `${bestCluster.avgProgress.toFixed(1)}% Avg. Completion` : "—"}
          </p>
        </div>

        <div className="rounded-2xl border-l-4 border-l-blue-500 border border-white/[0.06] bg-surface-card p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10.5px] font-bold uppercase tracking-widest text-blue-400">Highest Punctuality</p>
            <CheckCircle2 size={14} className="text-blue-400" />
          </div>
          <p className="mt-1.5 text-[20px] font-extrabold text-ink truncate">
            {loading ? "—" : lowestDelayCluster ? lowestDelayCluster.name : "—"}
          </p>
          <p className="mt-0.5 text-[11px] text-blue-400 font-medium">
            {lowestDelayCluster ? `${lowestDelayCluster.delayRate.toFixed(1)}% Delay Ratio` : "—"}
          </p>
        </div>

        <div className="rounded-2xl border-l-4 border-l-orange border border-white/[0.06] bg-surface-card p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10.5px] font-bold uppercase tracking-widest text-orange">Lowest Risk Profile</p>
            <Sparkles size={14} className="text-orange" />
          </div>
          <p className="mt-1.5 text-[20px] font-extrabold text-ink truncate">
            {loading ? "—" : lowestRiskCluster ? lowestRiskCluster.name : "—"}
          </p>
          <p className="mt-0.5 text-[11px] text-orange font-medium">
            {lowestRiskCluster ? `${lowestRiskCluster.avgRisk.toFixed(0)}/100 Risk Index` : "—"}
          </p>
        </div>

        <div className="rounded-2xl border-l-4 border-l-purple-500 border border-white/[0.06] bg-surface-card p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10.5px] font-bold uppercase tracking-widest text-purple-400">Benchmark Groups</p>
            <Layers size={14} className="text-purple-400" />
          </div>
          <p className="mt-1.5 text-[26px] font-extrabold tabular-nums text-purple-400">
            {loading ? "—" : benchmarkData.length}
          </p>
          <p className="mt-0.5 text-[11px] text-muted">Comparing {projects.length} projects</p>
        </div>
      </div>

      {/* DIMENSION PICKER & SEARCH CONTROLS */}
      <Card className="p-3.5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-semibold text-muted">Compare By:</span>
            <div className="flex rounded-full bg-white/[0.04] border border-white/[0.06] p-1">
              {[
                { label: "Sectors", key: "sector" },
                { label: "Ministries", key: "ministry" },
                { label: "Executing Agencies", key: "agency" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setDimension(tab.key)}
                  className={`rounded-full px-3.5 py-1 text-[11.5px] font-semibold transition-all ${
                    dimension === tab.key
                      ? "bg-orange text-white"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder={`Search ${dimension}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.05] pl-8 pr-3 py-1.5 text-[12px] text-ink placeholder:text-muted outline-none focus:border-orange/50 transition-all"
            />
          </div>
        </div>
      </Card>

      {/* MAIN BENCHMARK LEADERBOARD TABLE */}
      <Card className="overflow-hidden">
        <div className="border-b border-white/[0.06] bg-white/[0.02] px-5 py-3.5 flex items-center justify-between">
          <h3 className="text-[12px] font-bold uppercase tracking-wider text-ink">
            {dimension.toUpperCase()} EFFICIENCY LEADERBOARD <span className="ml-2 text-orange">({filteredBenchmarks.length} CLUSTERS)</span>
          </h3>
          <span className="text-[11px] text-muted font-medium">Sorted by Physical Completion Rate</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-muted">Loading benchmarking data…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-white/[0.06] bg-white/[0.02] text-[10.5px] uppercase tracking-widest text-muted">
                <tr>
                  <th className="px-5 py-3 font-bold text-center w-12">#</th>
                  <th className="px-5 py-3 font-bold">{dimension.charAt(0).toUpperCase() + dimension.slice(1)} Cluster</th>
                  <th className="px-5 py-3 font-bold text-center">Projects</th>
                  <th className="px-5 py-3 font-bold">Average Progress</th>
                  <th className="px-5 py-3 font-bold">Average Escalation</th>
                  <th className="px-5 py-3 font-bold">Slippage Rate</th>
                  <th className="px-5 py-3 font-bold text-center">Risk Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredBenchmarks.map((item, index) => (
                  <tr key={item.name} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-5 py-3.5 text-center font-bold text-muted">
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-ink text-[13px]">
                      {item.name}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className="rounded-full bg-white/[0.06] border border-white/[0.06] px-2.5 py-0.5 text-[11px] font-semibold text-muted">
                        {item.projects}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/[0.08]">
                          <div className="h-full rounded-full bg-gradient-to-r from-[#E85418] to-[#FF6B35]" style={{ width: `${Math.min(100, item.avgProgress)}%` }} />
                        </div>
                        <span className="font-bold text-ink text-[12px]">{item.avgProgress.toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-bold text-amber-400 text-[12px] font-mono">
                      +{item.avgEscalation.toFixed(1)}%
                    </td>
                    <td className="px-5 py-3 font-bold text-blue-400 text-[12px] font-mono">
                      {item.delayRate.toFixed(0)}%
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10.5px] font-bold ${
                        item.avgRisk >= 60
                          ? "bg-red-500/10 text-red-400 border border-red-500/20"
                          : item.avgRisk >= 35
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      }`}>
                        {item.avgRisk >= 60 ? "High" : item.avgRisk >= 35 ? "Moderate" : "Low"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}