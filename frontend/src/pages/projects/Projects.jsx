import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  RefreshCw, Search, LayoutGrid, List, Filter, ArrowRight,
  TrendingUp, AlertTriangle, Building2, CheckCircle2, Layers,
} from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/common/Card";
import { projectService } from "../../services/projectService";

function formatCost(value) {
  if (value === null || value === undefined) return "—";
  const num = Number(value);
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K Cr`;
  return `₹${num.toFixed(1)} Cr`;
}

function getRisk(project) {
  const approved = Number(project.approved_cost || 0);
  const revised  = Number(project.revised_cost  || 0);
  const progress = Number(project.physical_progress || 0);
  const status   = String(project.status || "").toLowerCase();

  let score = 0;
  if (approved > 0 && revised > approved) {
    const inc = ((revised - approved) / approved) * 100;
    score += inc > 20 ? 40 : inc > 10 ? 30 : inc > 5 ? 20 : 10;
  }
  score += progress < 30 ? 40 : progress < 50 ? 30 : progress < 70 ? 15 : 5;
  if (["delayed", "stopped", "critical"].includes(status)) score += 30;
  else if (["running", "ongoing", "in progress"].includes(status)) score += 5;
  else score += 10;

  if (score >= 70) return { label: "Critical", badgeClass: "bg-red-500/10 text-red-400 border border-red-500/20" };
  if (score >= 40) return { label: "High",     badgeClass: "bg-orange-500/10 text-orange-400 border border-orange-500/20" };
  if (score >= 20) return { label: "Medium",   badgeClass: "bg-blue-500/10 text-blue-400 border border-blue-500/20" };
  return               { label: "Low",      badgeClass: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" };
}

export default function Projects() {
  const [projects,       setProjects]       = useState([]);
  const [search,         setSearch]         = useState("");
  const [selectedSector, setSelectedSector] = useState("ALL");
  const [riskFilter,     setRiskFilter]     = useState("ALL");
  const [viewMode,       setViewMode]       = useState("grid");
  const [currentPage,    setCurrentPage]    = useState(1);
  const pageSize = 6;
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  async function loadProjects() {
    try {
      setLoading(true); setError("");
      const data = await projectService.list({ skip: 0, limit: 18 });
      setProjects(Array.isArray(data) ? data : data?.items ?? []);
    } catch (err) {
      setError(err.message || "Unable to load projects.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { loadProjects(); }, []);

  const sectors = useMemo(() => {
    const set = new Set();
    projects.forEach((p) => { if (p.sector) set.add(p.sector); });
    return Array.from(set).slice(0, 6);
  }, [projects]);

  const summary = useMemo(() => {
    let totalOutlay = 0, delayedCount = 0, critCount = 0;
    projects.forEach((p) => {
      totalOutlay += Number(p.revised_cost || p.approved_cost || 0);
      if (String(p.status || "").toLowerCase().includes("delay")) delayedCount++;
      const r = getRisk(p);
      if (r.label === "Critical" || r.label === "High") critCount++;
    });
    return { total: projects.length, totalOutlay, delayedCount, critCount };
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      if (selectedSector !== "ALL" && project.sector !== selectedSector) return false;
      if (riskFilter !== "ALL") {
        const r = getRisk(project);
        if (riskFilter === "CRITICAL" && r.label !== "Critical" && r.label !== "High") return false;
        if (riskFilter === "DELAYED" && !String(project.status || "").toLowerCase().includes("delay")) return false;
        if (riskFilter === "ON_TRACK" && (r.label === "Critical" || String(project.status || "").toLowerCase().includes("delay"))) return false;
      }
      const q = search.trim().toLowerCase();
      if (!q) return true;
      return [project.project_name, project.project_id, project.ministry, project.sector, project.implementing_agency, project.status]
        .filter(Boolean).some((v) => String(v).toLowerCase().includes(q));
    });
  }, [projects, search, selectedSector, riskFilter]);

  useEffect(() => { setCurrentPage(1); }, [search, selectedSector, riskFilter]);

  const totalPages        = Math.ceil(filteredProjects.length / pageSize) || 1;
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProjects.slice(start, start + pageSize);
  }, [filteredProjects, currentPage, pageSize]);

  /* ── KPI card colours ── */
  const kpis = [
    { label: "Total Monitored",  value: loading ? "—" : summary.total,        sub: "Active national projects", accent: "border-orange/60",  text: "text-orange",    icon: Layers },
    { label: "Sanctioned Outlay",value: loading ? "—" : formatCost(summary.totalOutlay), sub: "Capital commitments", accent: "border-emerald-500/60", text: "text-emerald-400", icon: TrendingUp },
    { label: "Delayed Projects",  value: loading ? "—" : summary.delayedCount, sub: "Behind schedule",  accent: "border-amber-500/60",  text: "text-amber-400",   icon: AlertTriangle, clickKey: "DELAYED" },
    { label: "High / Critical",   value: loading ? "—" : summary.critCount,    sub: "Priority intervention",  accent: "border-red-500/60",    text: "text-red-400",     icon: Building2, clickKey: "CRITICAL" },
  ];

  return (
    <div className="space-y-6 animate-slideUp">
      <PageHeader
        title="National Projects Directory"
        subtitle="Comprehensive database of high-impact infrastructure corridors tracked under PM GatiShakti & MoSPI."
      />

      {/* KPI ROW */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        {kpis.map(({ label, value, sub, accent, text, icon: Icon, clickKey }) => (
          <div
            key={label}
            onClick={clickKey ? () => setRiskFilter(riskFilter === clickKey ? "ALL" : clickKey) : undefined}
            className={`rounded-2xl border-l-4 ${accent} border border-white/[0.06] bg-surface-card p-4 transition-all ${
              clickKey ? "cursor-pointer hover:bg-white/[0.04]" : ""
            } ${clickKey && riskFilter === clickKey ? "ring-1 ring-orange/30" : ""}`}
          >
            <div className="flex items-center justify-between mb-1">
              <p className={`text-[10.5px] font-bold uppercase tracking-widest ${text}`}>{label}</p>
              <Icon size={14} className={text} />
            </div>
            <p className={`text-[26px] font-extrabold tabular-nums leading-none ${text}`}>{value}</p>
            <p className="mt-1 text-[11px] text-muted">{sub}</p>
          </div>
        ))}
      </div>

      {/* CONTROLS BAR */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-lg">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by project name, agency, sector or state..."
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.05] pl-9 pr-4 py-2 text-[12.5px] text-ink placeholder:text-muted outline-none focus:border-orange/50 focus:bg-white/[0.08] transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* View mode toggle */}
            <div className="flex items-center rounded-xl border border-white/[0.08] bg-white/[0.04] p-1">
              <button
                onClick={() => setViewMode("grid")}
                title="Grid Card View"
                className={`rounded-lg p-1.5 transition ${viewMode === "grid" ? "bg-orange text-white shadow-sm" : "text-muted hover:text-ink"}`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                title="Table View"
                className={`rounded-lg p-1.5 transition ${viewMode === "table" ? "bg-orange text-white shadow-sm" : "text-muted hover:text-ink"}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={loadProjects}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-[12px] font-semibold text-ink hover:bg-white/[0.08] transition"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Sector filter pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-white/[0.06]">
          <span className="text-[10.5px] font-bold uppercase tracking-widest text-muted mr-1 flex items-center gap-1">
            <Filter className="h-3 w-3" /> Sector:
          </span>
          {["ALL", ...sectors].map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSector(sec)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                selectedSector === sec
                  ? "bg-orange text-white"
                  : "bg-white/[0.06] text-muted hover:bg-white/[0.10] hover:text-ink"
              }`}
            >
              {sec === "ALL" ? "All Sectors" : sec}
            </button>
          ))}
        </div>
      </Card>

      {/* LOADING / ERROR / EMPTY */}
      {loading ? (
        <Card className="p-12 text-center text-sm text-muted">Loading infrastructure projects…</Card>
      ) : error ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/[0.06] p-4 text-[12.5px] text-red-300">{error}</div>
      ) : filteredProjects.length === 0 ? (
        <Card className="p-12 text-center text-sm text-muted">No projects found matching the specified filters.</Card>
      ) : viewMode === "grid" ? (
        /* ── CARD GRID ── */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedProjects.map((project) => {
            const risk     = getRisk(project);
            const progress = Number(project.physical_progress || 0);
            return (
              <Card key={project.id ?? project.project_id} className="flex flex-col justify-between p-5 hover:border-orange/20 transition-all">
                <div>
                  {/* Tags row */}
                  <div className="flex items-start justify-between gap-2">
                    <span className="rounded-full bg-white/[0.07] border border-white/[0.06] px-2.5 py-0.5 text-[10.5px] font-semibold text-muted">
                      {project.sector || "Infrastructure"}
                    </span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10.5px] font-bold ${risk.badgeClass}`}>
                      {risk.label} Risk
                    </span>
                  </div>

                  {/* Name */}
                  <Link
                    to={`/projects/${project.id}`}
                    className="mt-3 block text-[13.5px] font-bold text-ink hover:text-orange transition-colors line-clamp-2"
                  >
                    {project.project_name || "Unnamed Project"}
                  </Link>
                  <p className="mt-1 text-[11.5px] text-muted truncate">
                    {project.implementing_agency || project.ministry || "MoSPI"}
                  </p>

                  {/* Outlay & Status */}
                  <div className="mt-4 grid grid-cols-2 gap-2 border-y border-white/[0.06] py-3">
                    <div>
                      <p className="text-[10px] text-muted uppercase tracking-widest font-bold">Outlay</p>
                      <p className="mt-0.5 text-[13px] font-bold text-ink">
                        {formatCost(project.revised_cost ?? project.approved_cost)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted uppercase tracking-widest font-bold">Status</p>
                      <p className="mt-0.5 text-[12.5px] font-semibold text-ink capitalize">
                        {project.status || "Ongoing"}
                      </p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] text-muted font-medium">Physical Progress</span>
                      <span className="text-[12px] font-bold text-ink">{progress.toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#E85418] to-[#FF6B35] transition-[width] duration-500"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-[10.5px] font-mono text-muted">
                    ID: {project.project_id || `PRJ-${project.id}`}
                  </span>
                  <Link
                    to={`/projects/${project.id}`}
                    className="inline-flex items-center gap-1 text-[12px] font-semibold text-orange hover:text-orange-light transition-colors"
                  >
                    Explore <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        /* ── TABLE VIEW ── */
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-white/[0.06] bg-white/[0.02] text-[10.5px] uppercase tracking-widest text-muted">
                <tr>
                  {["Project", "Agency / Ministry", "Sector", "Outlay", "Progress", "Status", "Risk Level", ""].map((h) => (
                    <th key={h} className={`px-5 py-3 font-bold ${h === "" ? "text-right" : ""}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {paginatedProjects.map((project) => {
                  const risk     = getRisk(project);
                  const progress = Number(project.physical_progress || 0);
                  return (
                    <tr key={project.id ?? project.project_id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="px-5 py-3.5">
                        <Link to={`/projects/${project.id}`} className="block font-semibold text-ink hover:text-orange transition-colors text-[13px]">
                          {project.project_name || "Unnamed Project"}
                        </Link>
                        <div className="text-[10.5px] font-mono text-muted">{project.project_id || `PRJ${project.id}`}</div>
                      </td>
                      <td className="px-5 py-3 text-muted text-[12px]">{project.implementing_agency || project.ministry || "—"}</td>
                      <td className="px-5 py-3 text-muted text-[12px]">{project.sector || "—"}</td>
                      <td className="px-5 py-3 font-semibold text-ink text-[12.5px] font-mono">{formatCost(project.revised_cost ?? project.approved_cost)}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/[0.08]">
                            <div className="h-full rounded-full bg-gradient-to-r from-[#E85418] to-[#FF6B35]" style={{ width: `${Math.min(progress, 100)}%` }} />
                          </div>
                          <span className="font-semibold text-ink text-[12px]">{progress.toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className="rounded-full bg-white/[0.07] border border-white/[0.06] px-2.5 py-0.5 text-[10.5px] font-medium text-muted capitalize">
                          {project.status || "Unknown"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-[10.5px] font-bold ${risk.badgeClass}`}>{risk.label}</span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Link to={`/projects/${project.id}`} className="inline-flex items-center gap-1 text-[12px] font-semibold text-orange hover:text-orange-light transition-colors">
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

      {/* PAGINATION */}
      {!loading && filteredProjects.length > pageSize && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/[0.06] bg-surface-card px-5 py-3.5">
          <p className="text-[12px] text-muted font-medium">
            Showing <strong className="text-ink">{(currentPage - 1) * pageSize + 1}</strong> to{" "}
            <strong className="text-ink">{Math.min(currentPage * pageSize, filteredProjects.length)}</strong> of{" "}
            <strong className="text-ink">{filteredProjects.length}</strong> projects
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-[12px] font-semibold text-ink disabled:opacity-40 hover:bg-white/[0.08] transition"
            >
              Previous
            </button>
            <span className="text-[12px] font-semibold text-muted px-2">Page {currentPage} of {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-[12px] font-semibold text-ink disabled:opacity-40 hover:bg-white/[0.08] transition"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}