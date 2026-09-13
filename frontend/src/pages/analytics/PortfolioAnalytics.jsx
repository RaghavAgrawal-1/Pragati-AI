import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, ArrowRight, Layers, Building2, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/common/Card";
import { api } from "../../services/apiClient";

function riskScore(project) {
  let score = 0;
  const approved = Number(project.approved_cost ?? 0);
  const revised  = Number(project.revised_cost  ?? 0);
  const progress = Number(project.physical_progress ?? 0);
  const status   = String(project.status ?? "").toLowerCase();

  if (approved > 0 && revised > approved) {
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

function riskLevel(score) {
  if (score >= 70) return "HIGH";
  if (score >= 40) return "MEDIUM";
  return "LOW";
}

export default function PortfolioAnalytics() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [ministry, setMinistry] = useState("ALL");
  const [sector, setSector] = useState("ALL");
  const [risk, setRisk] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await api.get("/api/projects", { params: { skip: 0, limit: 12 } });
        setProjects(Array.isArray(data) ? data : data.items ?? []);
      } catch (error) {
        console.error("Portfolio analytics error:", error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  const ministries = useMemo(
    () => [...new Set(projects.map((p) => p.ministry).filter(Boolean))].sort(),
    [projects]
  );

  const sectors = useMemo(
    () => [...new Set(projects.map((p) => p.sector).filter(Boolean))].sort(),
    [projects]
  );

  const enrichedProjects = useMemo(
    () =>
      projects.map((project) => ({
        ...project,
        score: riskScore(project),
        level: riskLevel(riskScore(project)),
      })),
    [projects]
  );

  const filteredProjects = useMemo(
    () =>
      enrichedProjects.filter((project) => {
        if (ministry !== "ALL" && project.ministry !== ministry) return false;
        if (sector !== "ALL" && project.sector !== sector) return false;
        if (risk !== "ALL" && project.level !== risk) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = project.project_name?.toLowerCase().includes(q);
          const matchMinistry = project.ministry?.toLowerCase().includes(q);
          const matchSector = project.sector?.toLowerCase().includes(q);
          if (!matchName && !matchMinistry && !matchSector) return false;
        }
        return true;
      }),
    [enrichedProjects, ministry, sector, risk, searchQuery]
  );

  const stats = useMemo(() => {
    if (!filteredProjects.length) {
      return { count: 0, approvedCost: 0, revisedCost: 0, progress: 0, delayed: 0, highRisk: 0 };
    }
    let approvedCost = 0, revisedCost = 0, totalProgress = 0, delayed = 0, highRisk = 0;

    filteredProjects.forEach((p) => {
      approvedCost += Number(p.approved_cost ?? 0);
      revisedCost += Number(p.revised_cost ?? p.approved_cost ?? 0);
      totalProgress += Number(p.physical_progress ?? 0);
      if (String(p.status ?? "").toLowerCase().includes("delay")) delayed += 1;
      if (p.level === "HIGH") highRisk += 1;
    });

    return {
      count: filteredProjects.length,
      approvedCost,
      revisedCost,
      progress: totalProgress / filteredProjects.length,
      delayed,
      highRisk,
    };
  }, [filteredProjects]);

  const sectorData = useMemo(() => {
    const map = {};
    filteredProjects.forEach((project) => {
      const key = project.sector || "Unknown";
      if (!map[key]) map[key] = { name: key, projects: 0, risk: 0 };
      map[key].projects += 1;
      map[key].risk += project.score;
    });
    return Object.values(map)
      .map((item) => ({ ...item, averageRisk: item.projects > 0 ? item.risk / item.projects : 0 }))
      .sort((a, b) => b.projects - a.projects)
      .slice(0, 5);
  }, [filteredProjects]);

  const ministryData = useMemo(() => {
    const map = {};
    filteredProjects.forEach((project) => {
      const key = project.ministry || "Unknown";
      if (!map[key]) map[key] = { name: key, projects: 0, risk: 0 };
      map[key].projects += 1;
      map[key].risk += project.score;
    });
    return Object.values(map)
      .map((item) => ({ ...item, averageRisk: item.projects > 0 ? item.risk / item.projects : 0 }))
      .sort((a, b) => b.projects - a.projects)
      .slice(0, 5);
  }, [filteredProjects]);

  return (
    <div className="space-y-6 animate-slideUp">
      <PageHeader
        title="Portfolio Analytics & Resource Allocation"
        subtitle="Multi-dimensional capital analysis by ministry, sector, and risk concentration."
      />

      {/* FILTER & SEARCH CONTROLS */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search by project, ministry or sector..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.05] pl-9 pr-3 py-2 text-[12.5px] text-ink placeholder:text-muted outline-none focus:border-orange/50 transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={ministry}
              onChange={(e) => setMinistry(e.target.value)}
              className="rounded-xl border border-white/[0.08] bg-surface-card px-3 py-2 text-[12px] text-ink outline-none focus:border-orange/50"
              style={{ backgroundColor: "#1A1B25", color: "#F0F2F8" }}
            >
              <option value="ALL" style={{ backgroundColor: "#1A1B25", color: "#F0F2F8" }}>All Ministries ({ministries.length})</option>
              {ministries.map((item) => (
                <option key={item} value={item} style={{ backgroundColor: "#1A1B25", color: "#F0F2F8" }}>{item}</option>
              ))}
            </select>

            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="rounded-xl border border-white/[0.08] bg-surface-card px-3 py-2 text-[12px] text-ink outline-none focus:border-orange/50"
              style={{ backgroundColor: "#1A1B25", color: "#F0F2F8" }}
            >
              <option value="ALL" style={{ backgroundColor: "#1A1B25", color: "#F0F2F8" }}>All Sectors ({sectors.length})</option>
              {sectors.map((item) => (
                <option key={item} value={item} style={{ backgroundColor: "#1A1B25", color: "#F0F2F8" }}>{item}</option>
              ))}
            </select>

            <select
              value={risk}
              onChange={(e) => setRisk(e.target.value)}
              className="rounded-xl border border-white/[0.08] bg-surface-card px-3 py-2 text-[12px] text-ink outline-none focus:border-orange/50"
              style={{ backgroundColor: "#1A1B25", color: "#F0F2F8" }}
            >
              <option value="ALL" style={{ backgroundColor: "#1A1B25", color: "#F0F2F8" }}>All Risk Levels</option>
              <option value="HIGH" style={{ backgroundColor: "#1A1B25", color: "#F0F2F8" }}>High Risk Only</option>
              <option value="MEDIUM" style={{ backgroundColor: "#1A1B25", color: "#F0F2F8" }}>Medium Risk Only</option>
              <option value="LOW" style={{ backgroundColor: "#1A1B25", color: "#F0F2F8" }}>Low Risk Only</option>
            </select>

            <button
              onClick={() => {
                setMinistry("ALL");
                setSector("ALL");
                setRisk("ALL");
                setSearchQuery("");
              }}
              className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-[12px] font-semibold text-ink hover:bg-white/[0.08] transition"
            >
              Reset
            </button>
          </div>
        </div>
      </Card>

      {/* KPI STATS */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-5">
        <div className="rounded-2xl border-l-4 border-l-orange border border-white/[0.06] bg-surface-card p-4">
          <p className="text-[10.5px] font-bold uppercase tracking-widest text-orange">Filtered Projects</p>
          <p className="mt-1.5 text-[26px] font-extrabold tabular-nums text-ink">{loading ? "—" : stats.count}</p>
          <p className="mt-0.5 text-[11px] text-muted">Matching criteria</p>
        </div>

        <div className="rounded-2xl border-l-4 border-l-blue-500 border border-white/[0.06] bg-surface-card p-4">
          <p className="text-[10.5px] font-bold uppercase tracking-widest text-blue-400">Avg. Progress</p>
          <p className="mt-1.5 text-[26px] font-extrabold tabular-nums text-blue-400">{loading ? "—" : `${stats.progress.toFixed(1)}%`}</p>
          <p className="mt-0.5 text-[11px] text-muted">Physical completion</p>
        </div>

        <div className="rounded-2xl border-l-4 border-l-amber-500 border border-white/[0.06] bg-surface-card p-4">
          <p className="text-[10.5px] font-bold uppercase tracking-widest text-amber-400">Delayed</p>
          <p className="mt-1.5 text-[26px] font-extrabold tabular-nums text-amber-400">{loading ? "—" : stats.delayed}</p>
          <p className="mt-0.5 text-[11px] text-muted">Projects with slippage</p>
        </div>

        <div className="rounded-2xl border-l-4 border-l-emerald-500 border border-white/[0.06] bg-surface-card p-4">
          <p className="text-[10.5px] font-bold uppercase tracking-widest text-emerald-400">Outlay</p>
          <p className="mt-1.5 text-[26px] font-extrabold tabular-nums text-emerald-400">
            {loading ? "—" : `₹${(stats.revisedCost / 1000).toFixed(1)}K Cr`}
          </p>
          <p className="mt-0.5 text-[11px] text-muted">Total capital revised</p>
        </div>

        <div className="rounded-2xl border-l-4 border-l-red-500 border border-white/[0.06] bg-surface-card p-4 col-span-2 sm:col-span-1">
          <p className="text-[10.5px] font-bold uppercase tracking-widest text-red-400">High Risk Concentration</p>
          <p className="mt-1.5 text-[26px] font-extrabold tabular-nums text-red-400">{loading ? "—" : stats.highRisk}</p>
          <p className="mt-0.5 text-[11px] text-muted">Priority monitoring</p>
        </div>
      </div>

      {/* SECTOR & MINISTRY BREAKDOWN CARDS */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-5 space-y-4">
          <div className="border-b border-white/[0.06] pb-3">
            <h3 className="text-[13.5px] font-semibold text-ink">Sector Concentration</h3>
            <p className="text-[11px] text-muted">Projects and average risk score by sector</p>
          </div>
          <div className="space-y-3">
            {sectorData.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex justify-between text-[12px]">
                  <span className="font-medium text-ink">{item.name}</span>
                  <span className="text-muted font-mono">{item.projects} projects · Risk Index {Math.round(item.averageRisk)}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.08]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#E85418] to-[#FF6B35]"
                    style={{ width: `${Math.min(100, item.averageRisk)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 space-y-4">
          <div className="border-b border-white/[0.06] pb-3">
            <h3 className="text-[13.5px] font-semibold text-ink">Ministry Concentration</h3>
            <p className="text-[11px] text-muted">Projects and average risk score by nodal ministry</p>
          </div>
          <div className="space-y-3">
            {ministryData.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex justify-between text-[12px]">
                  <span className="font-medium text-ink">{item.name}</span>
                  <span className="text-muted font-mono">{item.projects} projects · Risk Index {Math.round(item.averageRisk)}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.08]">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{ width: `${Math.min(100, item.averageRisk)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* PORTFOLIO PROJECTS TABLE */}
      <Card className="overflow-hidden">
        <div className="border-b border-white/[0.06] bg-white/[0.02] px-5 py-3.5 flex items-center justify-between">
          <h3 className="text-[12px] font-bold uppercase tracking-wider text-ink">
            Monitored Portfolio Ledger <span className="ml-2 text-orange">({filteredProjects.length} Corridors)</span>
          </h3>
          <span className="text-[11px] text-muted font-medium">Real-time resource allocation</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-muted">Loading portfolio analytics…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-white/[0.06] bg-white/[0.02] text-[10.5px] uppercase tracking-widest text-muted">
                <tr>
                  <th className="px-5 py-3 font-bold">Project</th>
                  <th className="px-5 py-3 font-bold">Ministry</th>
                  <th className="px-5 py-3 font-bold">Sector</th>
                  <th className="px-5 py-3 font-bold">Approved Cost</th>
                  <th className="px-5 py-3 font-bold">Revised Cost</th>
                  <th className="px-5 py-3 font-bold">Progress</th>
                  <th className="px-5 py-3 font-bold">Risk Level</th>
                  <th className="px-5 py-3 text-right font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-5 py-3.5">
                      <Link to={`/projects/${p.id}`} className="font-semibold text-ink hover:text-orange transition-colors text-[13px] block">
                        {p.project_name || p.name || "Unnamed Project"}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-muted text-[12px]">{p.ministry || "—"}</td>
                    <td className="px-5 py-3 text-muted text-[12px]">{p.sector || "—"}</td>
                    <td className="px-5 py-3 text-muted text-[12px] font-mono">₹{Number(p.approved_cost || 0).toLocaleString()} Cr</td>
                    <td className="px-5 py-3 text-ink text-[12px] font-bold font-mono">₹{Number(p.revised_cost || p.approved_cost || 0).toLocaleString()} Cr</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/[0.08]">
                          <div className="h-full rounded-full bg-gradient-to-r from-[#E85418] to-[#FF6B35]" style={{ width: `${Math.min(100, Number(p.physical_progress || 0))}%` }} />
                        </div>
                        <span className="text-[12px] font-bold text-ink">{Number(p.physical_progress || 0).toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10.5px] font-bold ${
                        p.level === "HIGH"
                          ? "bg-red-500/10 text-red-400 border border-red-500/20"
                          : p.level === "MEDIUM"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      }`}>
                        {p.level}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link to={`/projects/${p.id}`} className="inline-flex items-center gap-1 text-[12px] font-semibold text-orange hover:text-orange-light transition-colors">
                        Details <ArrowRight className="h-3 w-3" />
                      </Link>
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