import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  IndianRupee, TrendingUp, AlertTriangle, CheckCircle2,
  Building2, ArrowRight, RefreshCw, BarChart3, Layers, Flame,
} from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import { api } from "../../services/apiClient";

// ── Helpers ──────────────────────────────────────────────────────────
function formatCr(v) {
  const n = Number(v ?? 0);
  if (n >= 100_000) return `₹${(n / 100_000).toFixed(1)}L Cr`;
  if (n >= 1_000)   return `₹${(n / 1_000).toFixed(1)}K Cr`;
  return `₹${n.toFixed(0)} Cr`;
}

function pct(a, b) {
  if (!a || !b || b === 0) return 0;
  return ((a - b) / b) * 100;
}

function overrunLevel(p) {
  if (p > 25) return { label: "Critical", cls: "text-red-400 bg-red-500/10 border-red-500/20" };
  if (p > 10) return { label: "High", cls: "text-orange-400 bg-orange/10 border-orange/20" };
  if (p > 0)  return { label: "Moderate", cls: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
  return { label: "On Budget", cls: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
}

// ── Sub-components ────────────────────────────────────────────────────

function HeroStat({ label, value, sub, accent }) {
  return (
    <div className={`rounded-2xl border p-5 ${accent ? "bg-[#E85418]/10 border-[#E85418]/30" : "bg-surface-card border-white/[0.06]"}`}>
      <p className="text-[11px] uppercase tracking-widest font-bold text-muted">{label}</p>
      <p className={`mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight ${accent ? "text-orange" : "text-ink"}`}>
        {value}
      </p>
      {sub && <p className="mt-1 text-[11.5px] text-muted">{sub}</p>}
    </div>
  );
}

function SectorBar({ sector, value, max, color = "#E85418" }) {
  const w = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 shrink-0 text-[11.5px] font-medium text-muted truncate">{sector}</span>
      <div className="flex-1 h-2.5 rounded-full bg-white/[0.05] overflow-hidden">
        <div
          className="h-full rounded-full glow-bar transition-all duration-700"
          style={{ width: `${w}%`, background: color, boxShadow: `0 0 8px ${color}60` }}
        />
      </div>
      <span className="w-20 shrink-0 text-right text-[11.5px] font-mono text-ink">{formatCr(value)}</span>
    </div>
  );
}

function OverrunRow({ project, rank }) {
  const revised   = Number(project.revised_cost ?? 0);
  const approved  = Number(project.approved_cost ?? 0);
  const overrunPct = pct(revised, approved);
  const lvl = overrunLevel(overrunPct);

  return (
    <tr className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
      <td className="px-4 py-3 text-[11px] font-mono text-muted">{String(rank).padStart(2, "0")}</td>
      <td className="px-4 py-3">
        <Link to={`/projects/${project.id}`} className="text-[13px] font-medium text-ink hover:text-orange transition-colors line-clamp-1">
          {project.project_name || project.name}
        </Link>
        <span className="text-[10.5px] text-muted">{project.sector || "—"}</span>
      </td>
      <td className="px-4 py-3 text-right text-[12.5px] font-mono text-muted">{formatCr(approved)}</td>
      <td className="px-4 py-3 text-right text-[12.5px] font-mono text-ink">{formatCr(revised)}</td>
      <td className="px-4 py-3 text-right">
        <span className={`inline-block rounded-md border px-2 py-0.5 text-[11px] font-semibold ${lvl.cls}`}>
          {overrunPct > 0 ? `+${overrunPct.toFixed(1)}%` : "0%"}
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        <span className={`inline-block rounded-md border px-2 py-0.5 text-[10.5px] font-semibold ${lvl.cls}`}>{lvl.label}</span>
      </td>
    </tr>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────
export default function Budget() {
  const [projects, setProjects]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [sortBy, setSortBy]       = useState("overrun"); // 'overrun' | 'approved' | 'revised'
  const [filterSector, setFilterSector] = useState("ALL");

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get("/api/projects", { params: { skip: 0, limit: 50 } });
        setProjects(Array.isArray(data) ? data : (data?.items ?? []));
      } catch {
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Aggregate KPIs
  const kpis = useMemo(() => {
    const totalApproved  = projects.reduce((s, p) => s + Number(p.approved_cost ?? 0), 0);
    const totalRevised   = projects.reduce((s, p) => s + Number(p.revised_cost ?? 0), 0);
    const totalSpent     = projects.reduce((s, p) => s + Number(p.expenditure ?? p.revised_cost * 0.6 ?? 0), 0);
    const overrunCount   = projects.filter(p => Number(p.revised_cost ?? 0) > Number(p.approved_cost ?? 0)).length;
    const onBudgetCount  = projects.length - overrunCount;
    const totalOverrun   = totalRevised - totalApproved;
    return { totalApproved, totalRevised, totalSpent, overrunCount, onBudgetCount, totalOverrun };
  }, [projects]);

  // Sector breakdown
  const sectorData = useMemo(() => {
    const map = {};
    projects.forEach(p => {
      const sec = p.sector || "Other";
      if (!map[sec]) map[sec] = { sector: sec, approved: 0, revised: 0, count: 0 };
      map[sec].approved += Number(p.approved_cost ?? 0);
      map[sec].revised  += Number(p.revised_cost ?? 0);
      map[sec].count    += 1;
    });
    return Object.values(map).sort((a, b) => b.revised - a.revised);
  }, [projects]);

  const maxSectorValue = sectorData.reduce((m, s) => Math.max(m, s.revised), 0);
  const sectors = ["ALL", ...sectorData.map(s => s.sector)];

  const sorted = useMemo(() => {
    let list = filterSector === "ALL" ? projects : projects.filter(p => p.sector === filterSector);
    if (sortBy === "overrun") {
      list = [...list].sort((a, b) => pct(b.revised_cost, b.approved_cost) - pct(a.revised_cost, a.approved_cost));
    } else if (sortBy === "approved") {
      list = [...list].sort((a, b) => Number(b.approved_cost) - Number(a.approved_cost));
    } else {
      list = [...list].sort((a, b) => Number(b.revised_cost) - Number(a.revised_cost));
    }
    return list;
  }, [projects, sortBy, filterSector]);

  const SECTOR_COLORS = ["#E85418", "#F59E0B", "#06B6D4", "#22C55E", "#A855F7", "#EC4899"];

  return (
    <div className="space-y-6 animate-slideUp">
      <PageHeader
        title="Budget Intelligence"
        subtitle="Portfolio cost allocation, overrun analytics & fiscal health across all monitored projects."
      />

      {/* Hero KPI Cards */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5">
        <HeroStat label="Total Approved Outlay" value={formatCr(kpis.totalApproved)} sub={`${projects.length} projects`} accent />
        <HeroStat label="Total Revised Cost"    value={formatCr(kpis.totalRevised)}  sub="Latest estimates" />
        <HeroStat label="Total Cost Overrun"    value={formatCr(kpis.totalOverrun)}  sub="Revised − Approved" />
        <HeroStat label="Overrun Projects"      value={kpis.overrunCount}            sub="Above approved cost" />
        <HeroStat label="On Budget"             value={kpis.onBudgetCount}           sub="Within approved cost" />
      </div>

      {/* Sector Budget Allocation */}
      <div className="rounded-2xl border border-white/[0.06] bg-surface-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[14px] font-semibold text-ink">Sector Budget Allocation</h3>
            <p className="text-[11.5px] text-muted">Revised cost breakdown by infrastructure sector</p>
          </div>
          <BarChart3 size={18} className="text-muted" />
        </div>
        {loading ? (
          <div className="space-y-3">
            {[1,2,3,4].map(i => <div key={i} className="h-5 rounded-full skeleton-dark" />)}
          </div>
        ) : (
          <div className="space-y-3.5">
            {sectorData.slice(0, 8).map((s, i) => (
              <SectorBar key={s.sector} sector={s.sector} value={s.revised} max={maxSectorValue} color={SECTOR_COLORS[i % SECTOR_COLORS.length]} />
            ))}
          </div>
        )}
      </div>

      {/* Cost Overrun Table */}
      <div className="rounded-2xl border border-white/[0.06] bg-surface-card overflow-hidden">
        <div className="border-b border-white/[0.06] px-5 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-[14px] font-semibold text-ink flex items-center gap-2">
                <Flame size={16} className="text-orange" />
                Cost Overrun Heatmap
              </h3>
              <p className="text-[11.5px] text-muted">Projects ranked by cost escalation %</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {/* Sector filter */}
              <select
                value={filterSector}
                onChange={e => setFilterSector(e.target.value)}
                className="input-dark text-[11.5px] py-1.5 pr-6"
              >
                {sectors.map(s => <option key={s} value={s}>{s === "ALL" ? "All Sectors" : s}</option>)}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="input-dark text-[11.5px] py-1.5"
              >
                <option value="overrun">Sort: Overrun %</option>
                <option value="approved">Sort: Approved Cost</option>
                <option value="revised">Sort: Revised Cost</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {[1,2,3,4,5].map(i => <div key={i} className="h-10 rounded-xl skeleton-dark" />)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/[0.05]">
                  <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-bold text-muted">#</th>
                  <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-bold text-muted">Project</th>
                  <th className="px-4 py-3 text-right text-[10px] uppercase tracking-widest font-bold text-muted">Approved</th>
                  <th className="px-4 py-3 text-right text-[10px] uppercase tracking-widest font-bold text-muted">Revised</th>
                  <th className="px-4 py-3 text-right text-[10px] uppercase tracking-widest font-bold text-muted">Overrun</th>
                  <th className="px-4 py-3 text-right text-[10px] uppercase tracking-widest font-bold text-muted">Status</th>
                </tr>
              </thead>
              <tbody>
                {sorted.slice(0, 20).map((p, i) => (
                  <OverrunRow key={p.id} project={p} rank={i + 1} />
                ))}
                {sorted.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-10 text-center text-muted text-[13px]">No projects found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Critical Alerts Panel */}
      {!loading && (() => {
        const critical = sorted.filter(p => pct(p.revised_cost, p.approved_cost) > 20);
        if (!critical.length) return null;
        return (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.05] p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={18} className="text-red-400" />
              <h3 className="text-[14px] font-semibold text-red-300">Critical Cost Overrun Alerts ({critical.length} projects)</h3>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {critical.slice(0, 6).map(p => {
                const op = pct(p.revised_cost, p.approved_cost);
                return (
                  <Link
                    key={p.id}
                    to={`/projects/${p.id}`}
                    className="flex items-center justify-between rounded-xl border border-red-500/15 bg-red-500/[0.04] px-4 py-3 hover:bg-red-500/[0.08] transition-colors"
                  >
                    <span className="text-[12.5px] font-medium text-ink line-clamp-1">{p.project_name || p.name}</span>
                    <span className="shrink-0 ml-3 text-[12px] font-bold text-red-400 font-mono">+{op.toFixed(1)}%</span>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
