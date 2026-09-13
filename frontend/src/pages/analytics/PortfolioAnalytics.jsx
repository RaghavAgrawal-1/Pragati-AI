import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, ArrowRight, Layers, Building2, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/common/Card";
import { api } from "../../services/apiClient";

function riskScore(project) {
  let score = 0;
  const approved = Number(project.approved_cost ?? 0);
  const revised = Number(project.revised_cost ?? 0);
  const progress = Number(project.physical_progress ?? 0);
  const status = String(project.status ?? "").toLowerCase();

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

  if (["delayed", "stopped", "critical"].includes(status)) {
    score += 30;
  } else if (["running", "ongoing", "in progress"].includes(status)) {
    score += 5;
  } else {
    score += 10;
  }

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
        const data = await api.get("/api/projects", {
          params: { skip: 0, limit: 12 },
        });

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
    () =>
      [...new Set(projects.map((p) => p.ministry).filter(Boolean))].sort(),
    [projects]
  );

  const sectors = useMemo(
    () =>
      [...new Set(projects.map((p) => p.sector).filter(Boolean))].sort(),
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
          const match =
            project.project_name?.toLowerCase().includes(q) ||
            project.sector?.toLowerCase().includes(q) ||
            project.ministry?.toLowerCase().includes(q) ||
            project.implementing_agency?.toLowerCase().includes(q);
          if (!match) return false;
        }

        return true;
      }),
    [enrichedProjects, ministry, sector, risk, searchQuery]
  );

  const stats = useMemo(() => {
    const count = filteredProjects.length;
    const progress =
      count > 0
        ? filteredProjects.reduce(
            (sum, p) => sum + Number(p.physical_progress ?? 0),
            0
          ) / count
        : 0;

    const delayed = filteredProjects.filter((p) =>
      String(p.status ?? "").toLowerCase().includes("delay")
    ).length;

    const approved = filteredProjects.reduce(
      (sum, p) => sum + Number(p.approved_cost ?? 0),
      0
    );

    const revised = filteredProjects.reduce(
      (sum, p) => sum + Number(p.revised_cost ?? p.approved_cost ?? 0),
      0
    );

    const escalation =
      approved > 0 ? Math.max(0, ((revised - approved) / approved) * 100) : 0;

    return {
      count,
      progress,
      delayed,
      approved,
      revised,
      escalation,
    };
  }, [filteredProjects]);

  const sectorData = useMemo(() => {
    const map = {};
    filteredProjects.forEach((project) => {
      const key = project.sector || "Unknown";
      if (!map[key]) {
        map[key] = { name: key, projects: 0, risk: 0 };
      }
      map[key].projects += 1;
      map[key].risk += project.score;
    });

    return Object.values(map)
      .map((item) => ({
        ...item,
        averageRisk: item.projects > 0 ? item.risk / item.projects : 0,
      }))
      .sort((a, b) => b.projects - a.projects)
      .slice(0, 5);
  }, [filteredProjects]);

  const ministryData = useMemo(() => {
    const map = {};
    filteredProjects.forEach((project) => {
      const key = project.ministry || "Unknown";
      if (!map[key]) {
        map[key] = { name: key, projects: 0, risk: 0 };
      }
      map[key].projects += 1;
      map[key].risk += project.score;
    });

    return Object.values(map)
      .map((item) => ({
        ...item,
        averageRisk: item.projects > 0 ? item.risk / item.projects : 0,
      }))
      .sort((a, b) => b.projects - a.projects)
      .slice(0, 5);
  }, [filteredProjects]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Portfolio Analytics & Resource Allocation"
        subtitle="Multi-dimensional capital analysis by ministry, sector, and risk concentration."
      />

      {/* FILTER & SEARCH CONTROLS */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by project, ministry or sector..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-2 text-xs focus:border-primary-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={ministry}
              onChange={(e) => setMinistry(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:border-primary-500"
            >
              <option value="ALL">All Ministries ({ministries.length})</option>
              {ministries.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:border-primary-500"
            >
              <option value="ALL">All Sectors ({sectors.length})</option>
              {sectors.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={risk}
              onChange={(e) => setRisk(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:border-primary-500"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="HIGH">High Risk Only</option>
              <option value="MEDIUM">Medium Risk Only</option>
              <option value="LOW">Low Risk Only</option>
            </select>

            <button
              onClick={() => {
                setMinistry("ALL");
                setSector("ALL");
                setRisk("ALL");
                setSearchQuery("");
              }}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Reset
            </button>
          </div>
        </div>
      </Card>

      {/* KPI STATS */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-5">
        <Card className="p-4 border-l-4 border-l-primary-500">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Filtered Projects
          </p>
          <p className="mt-1.5 text-2xl font-bold text-slate-900">
            {loading ? "—" : stats.count}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">Matching criteria</p>
        </Card>

        <Card className="p-4 border-l-4 border-l-blue-500">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-600">
            Avg. Progress
          </p>
          <p className="mt-1.5 text-2xl font-bold text-blue-600">
            {loading ? "—" : `${stats.progress.toFixed(1)}%`}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">Physical completion</p>
        </Card>

        <Card className="p-4 border-l-4 border-l-amber-500">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-600">
            Delayed
          </p>
          <p className="mt-1.5 text-2xl font-bold text-amber-600">
            {loading ? "—" : stats.delayed}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">Projects with slippage</p>
        </Card>

        <Card className="p-4 border-l-4 border-l-emerald-500">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600">
            Total Capital Outlay
          </p>
          <p className="mt-1.5 text-2xl font-bold text-emerald-600">
            {loading ? "—" : `₹${Math.round(stats.revised).toLocaleString("en-IN")} Cr`}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">Sanctioned capital</p>
        </Card>

        <Card className="p-4 border-l-4 border-l-red-500">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-red-600">
            Cost Escalation
          </p>
          <p className="mt-1.5 text-2xl font-bold text-red-600">
            {loading ? "—" : `+${stats.escalation.toFixed(1)}%`}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">Over original sanction</p>
        </Card>
      </div>

      {/* SECTOR + MINISTRY BREAKDOWN */}
      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="p-5">
          <div className="border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Top Sectors by Volume & Risk
            </h3>
            <p className="text-[11px] text-slate-500">
              Sector concentration and average vulnerability score
            </p>
          </div>

          <div className="space-y-4">
            {sectorData.map((item) => (
              <div key={item.name}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">{item.name}</span>
                  <span className="text-slate-500">
                    <strong className="text-slate-900">{item.projects}</strong> projects ·{" "}
                    <span className="font-semibold text-primary-700">{item.averageRisk.toFixed(0)}/100 risk</span>
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary-600"
                    style={{
                      width: `${Math.min((item.projects / Math.max(stats.count, 1)) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Top Ministries by Project Count
            </h3>
            <p className="text-[11px] text-slate-500">
              Ministry concentration across active corridor investments
            </p>
          </div>

          <div className="space-y-4">
            {ministryData.map((item) => (
              <div key={item.name}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">{item.name}</span>
                  <span className="text-slate-500">
                    <strong className="text-slate-900">{item.projects}</strong> projects ·{" "}
                    <span className="font-semibold text-blue-700">{item.averageRisk.toFixed(0)}/100 risk</span>
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{
                      width: `${Math.min((item.projects / Math.max(stats.count, 1)) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* PROJECT TABLE */}
      <Card className="overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50 px-5 py-3.5 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            Portfolio Project Analysis ({filteredProjects.length} Projects)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50/50 text-[11px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Project</th>
                <th className="px-5 py-3 font-semibold">Sector</th>
                <th className="px-5 py-3 font-semibold">Ministry</th>
                <th className="px-5 py-3 font-semibold">Physical Progress</th>
                <th className="px-5 py-3 font-semibold">Cost Escalation</th>
                <th className="px-5 py-3 font-semibold">Risk Level</th>
                <th className="px-5 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProjects.map((project) => {
                const approved = Number(project.approved_cost ?? 0);
                const revised = Number(project.revised_cost ?? approved);
                const escalation = approved > 0 ? Math.max(0, ((revised - approved) / approved) * 100) : 0;

                return (
                  <tr key={project.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-5 py-3.5 font-medium text-slate-900">
                      <Link
                        to={`/projects/${project.id}`}
                        className="hover:text-primary-600 hover:underline"
                      >
                        {project.project_name || "Unnamed Project"}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      {project.sector || "—"}
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      {project.ministry || "—"}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full bg-primary-600"
                            style={{ width: `${Math.min(Number(project.physical_progress ?? 0), 100)}%` }}
                          />
                        </div>
                        <span className="font-semibold text-slate-800">
                          {Number(project.physical_progress ?? 0).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`font-semibold ${
                          escalation > 15
                            ? "text-red-600"
                            : escalation > 5
                            ? "text-amber-600"
                            : "text-emerald-600"
                        }`}
                      >
                        +{escalation.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          project.level === "HIGH"
                            ? "bg-red-100 text-red-700"
                            : project.level === "MEDIUM"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {project.score}/100 · {project.level}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        to={`/projects/${project.id}`}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary-600 hover:text-primary-700"
                      >
                        Detail <ArrowRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}

              {!loading && filteredProjects.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-5 py-10 text-center text-xs text-slate-500">
                    No projects match the selected filters.
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