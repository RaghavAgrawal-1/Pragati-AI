import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  TrendingUp,
  AlertTriangle,
  Search,
  Building2,
  Layers,
  ArrowRight,
  Sparkles,
  BarChart2,
  CheckCircle2,
} from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/common/Card";
import { api } from "../../services/apiClient";

function getRiskScore(project) {
  let score = 0;
  const approved = Number(project.approved_cost ?? 0);
  const revised = Number(project.revised_cost ?? 0);
  const progress = Number(project.physical_progress ?? 0);
  const status = String(project.status ?? "").toLowerCase();

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

  if (["delayed", "stopped", "critical"].includes(status)) {
    score += 30;
  } else if (["running", "ongoing", "in progress"].includes(status)) {
    score += 5;
  } else {
    score += 10;
  }

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
        const data = await api.get("/api/projects", {
          params: { skip: 0, limit: 100 },
        });

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
        const revised = Number(project.revised_cost ?? 0);
        const progress = Number(project.physical_progress ?? 0);
        const escalation = approved > 0 ? Math.max(0, ((revised - approved) / approved) * 100) : 0;

        return {
          ...project,
          risk: getRiskScore(project),
          progress,
          escalation,
        };
      }),
    [projects]
  );

  const benchmarkData = useMemo(() => {
    const groups = {};

    enriched.forEach((project) => {
      let key = "Unknown";
      if (dimension === "ministry") key = project.ministry || "Other Ministries";
      else if (dimension === "agency") key = project.implementing_agency || "Other Agencies";
      else key = project.sector || "Other Sectors";

      if (!groups[key]) {
        groups[key] = {
          name: key,
          projects: 0,
          progress: 0,
          escalation: 0,
          risk: 0,
          delayed: 0,
          totalOutlay: 0,
        };
      }

      groups[key].projects += 1;
      groups[key].progress += project.progress;
      groups[key].escalation += project.escalation;
      groups[key].risk += project.risk;
      groups[key].totalOutlay += Number(project.revised_cost || project.approved_cost || 0);

      if (String(project.status ?? "").toLowerCase().includes("delay")) {
        groups[key].delayed += 1;
      }
    });

    return Object.values(groups)
      .map((item) => ({
        ...item,
        avgProgress: item.progress / item.projects,
        avgEscalation: item.escalation / item.projects,
        avgRisk: item.risk / item.projects,
        delayRate: (item.delayed / item.projects) * 100,
      }))
      .sort((a, b) => b.avgProgress - a.avgProgress);
  }, [enriched, dimension]);

  const filteredBenchmarks = useMemo(() => {
    if (!searchQuery.trim()) return benchmarkData;
    const q = searchQuery.toLowerCase();
    return benchmarkData.filter((b) => b.name.toLowerCase().includes(q));
  }, [benchmarkData, searchQuery]);

  const bestCluster = benchmarkData.length > 0 ? benchmarkData[0] : null;
  const lowestDelayCluster =
    benchmarkData.length > 0
      ? [...benchmarkData].sort((a, b) => a.delayRate - b.delayRate)[0]
      : null;
  const lowestRiskCluster =
    benchmarkData.length > 0
      ? [...benchmarkData].sort((a, b) => a.avgRisk - b.avgRisk)[0]
      : null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cross-Portfolio Performance Benchmarking"
        subtitle="Comparative peer analytics evaluating delivery efficiency across Ministries, Sectors, and Executing Agencies."
      />

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        <Card className="p-4 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
              Pacesetter Group
            </p>
            <Award className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="mt-1.5 text-xl font-bold text-slate-900 truncate">
            {bestCluster ? bestCluster.name : "—"}
          </p>
          <p className="mt-0.5 text-xs text-emerald-700 font-medium">
            {bestCluster ? `${bestCluster.avgProgress.toFixed(1)}% Avg. Completion` : "—"}
          </p>
        </Card>

        <Card className="p-4 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-700">
              Highest Punctuality
            </p>
            <CheckCircle2 className="h-4 w-4 text-blue-600" />
          </div>
          <p className="mt-1.5 text-xl font-bold text-slate-900 truncate">
            {lowestDelayCluster ? lowestDelayCluster.name : "—"}
          </p>
          <p className="mt-0.5 text-xs text-blue-700 font-medium">
            {lowestDelayCluster ? `${lowestDelayCluster.delayRate.toFixed(1)}% Delay Ratio` : "—"}
          </p>
        </Card>

        <Card className="p-4 border-l-4 border-l-primary-500">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-primary-700">
              Lowest Risk Profile
            </p>
            <Sparkles className="h-4 w-4 text-primary-600" />
          </div>
          <p className="mt-1.5 text-xl font-bold text-slate-900 truncate">
            {lowestRiskCluster ? lowestRiskCluster.name : "—"}
          </p>
          <p className="mt-0.5 text-xs text-primary-700 font-medium">
            {lowestRiskCluster ? `${lowestRiskCluster.avgRisk.toFixed(0)}/100 Risk Index` : "—"}
          </p>
        </Card>

        <Card className="p-4 border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-purple-700">
              Benchmark Groups
            </p>
            <Layers className="h-4 w-4 text-purple-600" />
          </div>
          <p className="mt-1.5 text-2xl font-bold text-slate-900">
            {benchmarkData.length}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">Comparing {projects.length} projects</p>
        </Card>
      </div>

      {/* DIMENSION PICKER & SEARCH CONTROLS */}
      <Card className="p-3.5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">Compare By:</span>
            <div className="flex rounded-lg bg-slate-100 p-1">
              {[
                { label: "Sectors", key: "sector" },
                { label: "Ministries", key: "ministry" },
                { label: "Executing Agencies", key: "agency" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setDimension(tab.key)}
                  className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition ${
                    dimension === tab.key
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={`Search ${dimension}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 pl-8 pr-3 py-1.5 text-xs focus:border-primary-500 focus:outline-none"
            />
          </div>
        </div>
      </Card>

      {/* MAIN BENCHMARK LEADERBOARD TABLE */}
      <Card className="overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50 px-5 py-3.5 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            {dimension.toUpperCase()} EFFICIENCY LEADERBOARD ({filteredBenchmarks.length} CLUSTERS)
          </h3>
          <span className="text-[11px] text-slate-500 font-medium">
            Sorted by Physical Completion Rate
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50/50 text-[11px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold text-center w-12">#</th>
                <th className="px-5 py-3 font-semibold">{dimension.charAt(0).toUpperCase() + dimension.slice(1)} Cluster</th>
                <th className="px-5 py-3 font-semibold text-center">Projects</th>
                <th className="px-5 py-3 font-semibold">Average Progress</th>
                <th className="px-5 py-3 font-semibold">Average Escalation</th>
                <th className="px-5 py-3 font-semibold">Slippage Rate</th>
                <th className="px-5 py-3 font-semibold text-center">Risk Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBenchmarks.map((item, index) => (
                <tr key={item.name} className="hover:bg-slate-50/60 transition">
                  <td className="px-5 py-3.5 text-center font-bold text-slate-500">
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                  </td>
                  <td className="px-5 py-3.5 font-bold text-slate-900">
                    {item.name}
                  </td>
                  <td className="px-5 py-3 text-center font-medium text-slate-600">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">
                      {item.projects}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-primary-600"
                          style={{ width: `${Math.min(item.avgProgress, 100)}%` }}
                        />
                      </div>
                      <span className="font-bold text-slate-800">
                        {item.avgProgress.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`font-semibold ${
                        item.avgEscalation > 15
                          ? "text-red-600"
                          : item.avgEscalation > 5
                          ? "text-amber-600"
                          : "text-emerald-600"
                      }`}
                    >
                      +{item.avgEscalation.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        item.delayRate > 40
                          ? "bg-red-50 text-red-700"
                          : item.delayRate > 20
                          ? "bg-amber-50 text-amber-700"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {item.delayRate.toFixed(0)}% delayed
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span
                      className={`font-extrabold ${
                        item.avgRisk >= 60
                          ? "text-red-600"
                          : item.avgRisk >= 40
                          ? "text-amber-600"
                          : "text-emerald-600"
                      }`}
                    >
                      {item.avgRisk.toFixed(0)}/100
                    </span>
                  </td>
                </tr>
              ))}

              {!loading && filteredBenchmarks.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-5 py-10 text-center text-xs text-slate-500">
                    No benchmark clusters match your search query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* LEADERS VS LAGGARDS COMPARATIVE CALLOUT */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="p-5 border-t-4 border-t-emerald-500">
          <div className="flex items-center gap-2 mb-3">
            <Award className="h-4 w-4 text-emerald-600" />
            <h3 className="text-sm font-semibold text-slate-900">
              Top 3 Delivery Leaders ({dimension})
            </h3>
          </div>
          <div className="divide-y divide-slate-100">
            {benchmarkData.slice(0, 3).map((item, i) => (
              <div key={item.name} className="flex items-center justify-between py-2.5 text-xs">
                <div>
                  <span className="font-bold text-slate-900 mr-2">#{i + 1}</span>
                  <span className="font-medium text-slate-700">{item.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-emerald-700">{item.avgProgress.toFixed(1)}% progress</span>
                  <span className="text-[10px] text-slate-400">({item.projects} proj)</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 border-t-4 border-t-red-500">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <h3 className="text-sm font-semibold text-slate-900">
              Top 3 Lagging Groups Requiring Support ({dimension})
            </h3>
          </div>
          <div className="divide-y divide-slate-100">
            {[...benchmarkData].reverse().slice(0, 3).map((item, i) => (
              <div key={item.name} className="flex items-center justify-between py-2.5 text-xs">
                <div>
                  <span className="font-bold text-red-700 mr-2">#{i + 1}</span>
                  <span className="font-medium text-slate-700">{item.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-red-600">{item.avgProgress.toFixed(1)}% progress</span>
                  <span className="text-[10px] text-slate-400">({item.delayRate.toFixed(0)}% delayed)</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}