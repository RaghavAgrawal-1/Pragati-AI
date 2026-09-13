import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  RefreshCw,
  Search,
  LayoutGrid,
  List,
  Filter,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Building2,
  CheckCircle2,
  Layers,
} from "lucide-react";

import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/common/Card";
import { projectService } from "../../services/projectService";

function formatCost(value) {
  if (value === null || value === undefined) return "—";
  const num = Number(value);
  if (num >= 1000) {
    return `₹${(num / 1000).toFixed(1)}K Cr`;
  }
  return `₹${num.toFixed(1)} Cr`;
}

function getRisk(project) {
  const approved = Number(project.approved_cost || 0);
  const revised = Number(project.revised_cost || 0);
  const progress = Number(project.physical_progress || 0);
  const status = String(project.status || "").toLowerCase();

  let score = 0;
  if (approved > 0 && revised > approved) {
    const increase = ((revised - approved) / approved) * 100;
    if (increase > 20) score += 40;
    else if (increase > 10) score += 30;
    else if (increase > 5) score += 20;
    else score += 10;
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

  if (score >= 70) {
    return { label: "Critical", badgeClass: "bg-red-100 text-red-700 border border-red-200" };
  }
  if (score >= 40) {
    return { label: "High", badgeClass: "bg-amber-100 text-amber-700 border border-amber-200" };
  }
  if (score >= 20) {
    return { label: "Medium", badgeClass: "bg-blue-100 text-blue-700 border border-blue-200" };
  }
  return { label: "Low", badgeClass: "bg-emerald-100 text-emerald-700 border border-emerald-200" };
}

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedSector, setSelectedSector] = useState("ALL");
  const [riskFilter, setRiskFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'table'
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadProjects() {
    try {
      setLoading(true);
      setError("");

      const data = await projectService.list({
        skip: 0,
        limit: 18,
      });

      setProjects(Array.isArray(data) ? data : data?.items ?? []);
    } catch (err) {
      setError(err.message || "Unable to load projects.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  const sectors = useMemo(() => {
    const set = new Set();
    projects.forEach((p) => {
      if (p.sector) set.add(p.sector);
    });
    return Array.from(set).slice(0, 6);
  }, [projects]);

  const summary = useMemo(() => {
    let totalOutlay = 0;
    let delayedCount = 0;
    let critCount = 0;

    projects.forEach((p) => {
      totalOutlay += Number(p.revised_cost || p.approved_cost || 0);
      const st = String(p.status || "").toLowerCase();
      if (st.includes("delay")) delayedCount++;
      const r = getRisk(p);
      if (r.label === "Critical" || r.label === "High") critCount++;
    });

    return {
      total: projects.length,
      totalOutlay,
      delayedCount,
      critCount,
    };
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      if (selectedSector !== "ALL" && project.sector !== selectedSector) {
        return false;
      }

      if (riskFilter !== "ALL") {
        const r = getRisk(project);
        if (riskFilter === "CRITICAL" && r.label !== "Critical" && r.label !== "High") return false;
        if (riskFilter === "DELAYED" && !String(project.status || "").toLowerCase().includes("delay")) return false;
        if (riskFilter === "ON_TRACK" && (r.label === "Critical" || String(project.status || "").toLowerCase().includes("delay"))) return false;
      }

      const query = search.trim().toLowerCase();
      if (!query) return true;

      return [
        project.project_name,
        project.project_id,
        project.ministry,
        project.sector,
        project.implementing_agency,
        project.status,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    });
  }, [projects, search, selectedSector, riskFilter]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedSector, riskFilter]);

  const totalPages = Math.ceil(filteredProjects.length / pageSize) || 1;
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProjects.slice(start, start + pageSize);
  }, [filteredProjects, currentPage, pageSize]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="National Projects Directory"
        subtitle="Comprehensive database of high-impact infrastructure corridors tracked under PM GatiShakti & MoSPI."
      />

      {/* KPI METRICS */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        <Card className="p-4 border-l-4 border-l-primary-500">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Total Monitored
          </p>
          <p className="mt-1.5 text-2xl font-bold text-slate-900">
            {loading ? "—" : summary.total}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">Active national projects</p>
        </Card>

        <Card className="p-4 border-l-4 border-l-emerald-500">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600">
            Sanctioned Outlay
          </p>
          <p className="mt-1.5 text-2xl font-bold text-emerald-600">
            {loading ? "—" : formatCost(summary.totalOutlay)}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">Capital commitments</p>
        </Card>

        <Card
          onClick={() => setRiskFilter(riskFilter === "DELAYED" ? "ALL" : "DELAYED")}
          className={`cursor-pointer p-4 border-l-4 border-l-amber-500 transition hover:shadow-md ${
            riskFilter === "DELAYED" ? "ring-2 ring-amber-500 bg-amber-50/20" : ""
          }`}
        >
          <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-600">
            Delayed Projects
          </p>
          <p className="mt-1.5 text-2xl font-bold text-amber-600">
            {loading ? "—" : summary.delayedCount}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">Behind schedule</p>
        </Card>

        <Card
          onClick={() => setRiskFilter(riskFilter === "CRITICAL" ? "ALL" : "CRITICAL")}
          className={`cursor-pointer p-4 border-l-4 border-l-red-500 transition hover:shadow-md ${
            riskFilter === "CRITICAL" ? "ring-2 ring-red-500 bg-red-50/20" : ""
          }`}
        >
          <p className="text-[11px] font-semibold uppercase tracking-wider text-red-600">
            High / Critical Risk
          </p>
          <p className="mt-1.5 text-2xl font-bold text-red-600">
            {loading ? "—" : summary.critCount}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">Priority intervention</p>
        </Card>
      </div>

      {/* CONTROLS BAR: SEARCH, SECTOR PILLS, & VIEW SWITCHER */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-lg">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by project name, agency, sector or state..."
              className="w-full rounded-lg border border-slate-200 pl-9 pr-4 py-2 text-xs focus:border-primary-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`rounded p-1.5 transition ${
                  viewMode === "grid"
                    ? "bg-white text-primary-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
                title="Grid Card View"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`rounded p-1.5 transition ${
                  viewMode === "table"
                    ? "bg-white text-primary-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
                title="Table View"
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={loadProjects}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100">
          <span className="text-[11px] font-medium text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="h-3 w-3" /> Sector:
          </span>
          <button
            onClick={() => setSelectedSector("ALL")}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
              selectedSector === "ALL"
                ? "bg-primary-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Sectors
          </button>
          {sectors.map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSector(sec)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                selectedSector === sec
                  ? "bg-primary-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      </Card>

      {/* MAIN VIEW: CARDS OR TABLE */}
      {loading ? (
        <Card className="p-12 text-center text-xs text-slate-500">
          Loading infrastructure projects...
        </Card>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-xs text-red-700">
          {error}
        </div>
      ) : filteredProjects.length === 0 ? (
        <Card className="p-12 text-center text-xs text-slate-500">
          No projects found matching the specified filters.
        </Card>
      ) : viewMode === "grid" ? (
        /* CARD GRID VIEW */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedProjects.map((project) => {
            const risk = getRisk(project);
            const progress = Number(project.physical_progress || 0);

            return (
              <Card
                key={project.id ?? project.project_id}
                className="flex flex-col justify-between p-5 transition hover:shadow-md hover:border-slate-300"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600">
                      {project.sector || "Infrastructure"}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${risk.badgeClass}`}
                    >
                      {risk.label} Risk
                    </span>
                  </div>

                  <Link
                    to={`/projects/${project.id}`}
                    className="mt-3 block text-sm font-bold text-slate-900 hover:text-primary-600 transition"
                  >
                    {project.project_name || "Unnamed Project"}
                  </Link>
                  <p className="mt-1 text-xs text-slate-500">
                    {project.implementing_agency || project.ministry || "MoSPI"}
                  </p>

                  {/* Outlay & Progress */}
                  <div className="mt-4 grid grid-cols-2 gap-2 border-y border-slate-100 py-3 text-xs">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">Outlay</p>
                      <p className="mt-0.5 font-bold text-slate-900">
                        {formatCost(project.revised_cost ?? project.approved_cost)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">Status</p>
                      <p className="mt-0.5 font-semibold text-slate-700 capitalize">
                        {project.status || "Ongoing"}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-500 font-medium">Physical Progress</span>
                      <span className="font-bold text-slate-900">{progress.toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-primary-600"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    ID: {project.project_id || `PRJ-${project.id}`}
                  </span>
                  <Link
                    to={`/projects/${project.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700"
                  >
                    Explore <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Project</th>
                  <th className="px-5 py-3 font-semibold">Agency / Ministry</th>
                  <th className="px-5 py-3 font-semibold">Sector</th>
                  <th className="px-5 py-3 font-semibold">Outlay</th>
                  <th className="px-5 py-3 font-semibold">Progress</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Risk Level</th>
                  <th className="px-5 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedProjects.map((project) => {
                  const risk = getRisk(project);
                  const progress = Number(project.physical_progress || 0);

                  return (
                    <tr key={project.id ?? project.project_id} className="hover:bg-slate-50/60 transition">
                      <td className="px-5 py-3.5 font-medium text-slate-900">
                        <Link
                          to={`/projects/${project.id}`}
                          className="hover:text-primary-600 hover:underline"
                        >
                          {project.project_name || "Unnamed Project"}
                        </Link>
                        <div className="text-[10px] text-slate-400">
                          {project.project_id || `PRJ${project.id}`}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-slate-600">
                        {project.implementing_agency || project.ministry || "—"}
                      </td>
                      <td className="px-5 py-3 text-slate-600">
                        {project.sector || "—"}
                      </td>
                      <td className="px-5 py-3 font-semibold text-slate-800">
                        {formatCost(project.revised_cost ?? project.approved_cost)}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-200">
                            <div
                              className="h-full rounded-full bg-primary-600"
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                          </div>
                          <span className="font-semibold text-slate-700">{progress.toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 capitalize">
                          {project.status || "Unknown"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${risk.badgeClass}`}
                        >
                          {risk.label}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Link
                          to={`/projects/${project.id}`}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary-600 hover:text-primary-700"
                        >
                          View <ArrowRight className="h-3 w-3" />
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

      {/* COMPACT PAGINATION BAR */}
      {!loading && filteredProjects.length > pageSize && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3.5 shadow-sm">
          <p className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-800">{(currentPage - 1) * pageSize + 1}</strong> to{" "}
            <strong className="text-slate-800">{Math.min(currentPage * pageSize, filteredProjects.length)}</strong> of{" "}
            <strong className="text-slate-800">{filteredProjects.length}</strong> featured mega projects
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:opacity-40 hover:bg-slate-50 transition"
            >
              Previous
            </button>
            <span className="text-xs font-semibold text-slate-700 px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:opacity-40 hover:bg-slate-50 transition"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}