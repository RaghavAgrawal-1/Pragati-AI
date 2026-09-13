import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity, Zap, TrendingUp, Clock, CheckCircle2,
  AlertTriangle, Search, Filter, ArrowRight, Gauge, Layers, Flag,
} from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/common/Card";
import { api } from "../../services/apiClient";

export default function Performance() {
  const [projects,     setProjects]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [searchQuery,  setSearchQuery]  = useState("");
  const [stageFilter,  setStageFilter]  = useState("ALL");

  useEffect(() => {
    api
      .get("/api/projects", { params: { skip: 0, limit: 12 } })
      .then((data) => setProjects(Array.isArray(data) ? data : data.items ?? []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  const metrics = useMemo(() => {
    const total = projects.length;
    let highVelocity = 0, normalVelocity = 0, stalled = 0;
    projects.forEach((p) => {
      const prog = Number(p.physical_progress ?? 0);
      const st   = String(p.status ?? "").toLowerCase();
      if (st.includes("delay") || st.includes("stop") || prog < 25) stalled++;
      else if (prog >= 60) highVelocity++;
      else normalVelocity++;
    });
    const avgVelocityIndex = total > 0
      ? Math.round(((highVelocity * 100 + normalVelocity * 65 + stalled * 20) / (total * 100)) * 100) : 0;
    return { total, highVelocity, normalVelocity, stalled, avgVelocityIndex };
  }, [projects]);

  const milestoneStages = [
    { name: "Detailed Project Report (DPR) & Surveys",   avgCompletion: 96, targetDays: "Day 0–90",    status: "Completed" },
    { name: "Land Acquisition & RoW Demarcation",         avgCompletion: 74, targetDays: "Day 90–240",  status: "Critical Bottleneck" },
    { name: "Statutory & MoEFCC Clearances",              avgCompletion: 68, targetDays: "Day 180–300", status: "In Scrutiny" },
    { name: "Civil Earthwork & Foundation Structures",    avgCompletion: 54, targetDays: "Day 300–600", status: "Active Execution" },
    { name: "Superstructure & Pavement / Track Laying",   avgCompletion: 38, targetDays: "Day 600–900", status: "In Progress" },
    { name: "Signalling, Electrification & Commissioning",avgCompletion: 21, targetDays: "Day 900–1200",status: "Upcoming Phase" },
  ];

  const enriched = useMemo(() =>
    projects.map((p) => {
      const progress = Number(p.physical_progress ?? 0);
      const status   = String(p.status ?? "").toLowerCase();
      let velocityScore = Math.min(99, Math.round(progress * 0.9 + 12));
      if (status.includes("delay")) velocityScore = Math.max(15, velocityScore - 35);
      let currentMilestone = "Commissioning";
      if (progress < 15) currentMilestone = "Land Acquisition & RoW";
      else if (progress < 35) currentMilestone = "Foundation & Earthworks";
      else if (progress < 60) currentMilestone = "Sub-Structure Construction";
      else if (progress < 85) currentMilestone = "Superstructure & Track / Pavement";
      return { ...p, progress, velocityScore, currentMilestone,
        pace: velocityScore >= 65 ? "Accelerated" : velocityScore >= 40 ? "Steady" : "Critical Lag" };
    }), [projects]);

  const filtered = useMemo(() =>
    enriched.filter((p) => {
      if (stageFilter === "ACCELERATED" && p.pace !== "Accelerated") return false;
      if (stageFilter === "STEADY"      && p.pace !== "Steady")       return false;
      if (stageFilter === "LAG"         && p.pace !== "Critical Lag") return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return p.project_name?.toLowerCase().includes(q) ||
               p.sector?.toLowerCase().includes(q) ||
               p.currentMilestone?.toLowerCase().includes(q);
      }
      return true;
    }).sort((a, b) => b.velocityScore - a.velocityScore),
  [enriched, stageFilter, searchQuery]);

  /* pace badge colours */
  const paceChip = (pace) => ({
    Accelerated:  "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    Steady:       "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    "Critical Lag":"bg-red-500/10 text-red-400 border border-red-500/20",
  }[pace] ?? "bg-white/[0.06] text-muted border border-white/[0.06]");

  const velocityColor = (s) =>
    s >= 65 ? "text-emerald-400" : s >= 40 ? "text-orange" : "text-red-400";

  /* milestone bar colour */
  const mileBar = (pct) =>
    pct >= 70 ? "bg-emerald-500" : pct >= 40 ? "bg-orange/80" : "bg-amber-500";

  const mileText = (pct) =>
    pct >= 70 ? "text-emerald-400" : pct >= 40 ? "text-orange" : "text-amber-400";

  return (
    <div className="space-y-6 animate-slideUp">
      <PageHeader
        title="EPC Milestone Velocity & Delivery Cadence"
        subtitle="Real-time execution speed index, milestone burn-down rates, and contractor cadence across national corridors."
      />

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        {[
          { label: "Cadence Index",         value: `${metrics.avgVelocityIndex}`, sub: "Portfolio execution velocity", icon: Gauge,         accent: "border-orange/60",      text: "text-orange",       suffix: "/100" },
          { label: "High Velocity",          value: `${metrics.highVelocity}`,     sub: "Ahead or on scheduled pace",  icon: Zap,           accent: "border-emerald-500/60", text: "text-emerald-400"  },
          { label: "Steady Pace",            value: `${metrics.normalVelocity}`,   sub: "Within acceptable baseline",  icon: Activity,      accent: "border-blue-500/60",    text: "text-blue-400"     },
          { label: "Critical Velocity Lag",  value: `${metrics.stalled}`,          sub: "Immediate recovery needed",   icon: Clock,         accent: "border-red-500/60",     text: "text-red-400"      },
        ].map(({ label, value, sub, icon: Icon, accent, text, suffix }) => (
          <div key={label} className={`rounded-2xl border-l-4 ${accent} border border-white/[0.06] bg-surface-card p-4`}>
            <div className="flex items-center justify-between mb-1">
              <p className={`text-[10.5px] font-bold uppercase tracking-widest ${text}`}>{label}</p>
              <Icon size={14} className={text} />
            </div>
            <p className={`text-[26px] font-extrabold tabular-nums leading-none ${text}`}>
              {loading ? "—" : value}
              {suffix && <span className="text-[12px] font-normal text-muted">{suffix}</span>}
            </p>
            <p className="mt-1 text-[11px] text-muted">{sub}</p>
          </div>
        ))}
      </div>

      {/* MILESTONE BURN-DOWN TRACKER */}
      <Card className="p-5 space-y-4">
        <div className="border-b border-white/[0.06] pb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-[13.5px] font-semibold text-ink flex items-center gap-1.5">
              <Flag className="h-4 w-4 text-orange" />
              National Standard Infrastructure Milestone Hierarchy
            </h3>
            <p className="text-[11px] text-muted mt-0.5">
              Average completion and bottleneck status across standard PM GatiShakti EPC project phases
            </p>
          </div>
          <span className="rounded-full border border-white/[0.08] bg-white/[0.05] px-3 py-1 text-[11px] font-semibold text-muted">
            Lifecycle Progress: 6 Key Stages
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 pt-1">
          {milestoneStages.map((stage, idx) => (
            <div
              key={stage.name}
              className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3.5 hover:bg-white/[0.06] hover:border-orange/20 transition-all"
            >
              <div className="flex items-start justify-between">
                <span className="rounded-full bg-orange/10 text-orange text-[10px] font-bold px-2 py-0.5 border border-orange/20">
                  Stage 0{idx + 1}
                </span>
                <span className={`text-[10.5px] font-semibold ${mileText(stage.avgCompletion)}`}>
                  {stage.targetDays}
                </span>
              </div>
              <p className="mt-2 text-[12.5px] font-bold text-ink line-clamp-1">{stage.name}</p>

              <div className="mt-2.5 flex items-center gap-2">
                <div className="h-1.5 flex-1 rounded-full bg-white/[0.08] overflow-hidden">
                  <div
                    className={`h-full rounded-full ${mileBar(stage.avgCompletion)} transition-[width] duration-700`}
                    style={{ width: `${stage.avgCompletion}%` }}
                  />
                </div>
                <span className={`text-[11.5px] font-bold ${mileText(stage.avgCompletion)}`}>{stage.avgCompletion}%</span>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <span className="text-[10.5px] text-muted">Health:</span>
                <span className={`text-[10.5px] font-semibold ${stage.status.includes("Bottleneck") ? "text-red-400 font-bold" : "text-slate-300"}`}>
                  {stage.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* FILTER & SEARCH */}
      <Card className="p-3.5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search by project, sector, or current milestone stage..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.05] pl-9 pr-4 py-2 text-[12.5px] text-ink placeholder:text-muted outline-none focus:border-orange/50 focus:bg-white/[0.08] transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10.5px] font-bold uppercase tracking-widest text-muted mr-1 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Pace:
            </span>
            {[
              { label: "All Corridors",       key: "ALL" },
              { label: "Accelerated",         key: "ACCELERATED" },
              { label: "Steady",              key: "STEADY" },
              { label: "Lagging",             key: "LAG" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStageFilter(tab.key)}
                className={`rounded-full px-3 py-1 text-[11.5px] font-semibold transition-colors ${
                  stageFilter === tab.key
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

      {/* VELOCITY LEDGER TABLE */}
      <Card className="overflow-hidden">
        <div className="border-b border-white/[0.06] bg-white/[0.02] px-5 py-3.5 flex items-center justify-between">
          <h3 className="text-[12px] font-bold uppercase tracking-wider text-ink">
            Project Delivery Velocity Ledger
            <span className="ml-2 text-orange">({filtered.length} Corridors)</span>
          </h3>
          <span className="text-[11px] text-muted font-medium">Sorted by Execution Cadence Score</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-muted">Loading corridors…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-white/[0.06] bg-white/[0.02] text-[10.5px] uppercase tracking-widest text-muted">
                <tr>
                  {["Project Title", "Sector", "Current Active Milestone", "Velocity Score", "Physical Completion", "Cadence Status", ""].map((h) => (
                    <th key={h} className={`px-5 py-3 font-bold ${h === "" ? "text-right" : ""}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-5 py-3.5">
                      <Link to={`/projects/${item.id}`} className="font-semibold text-ink hover:text-orange transition-colors text-[13px] block">
                        {item.project_name || "Unnamed Project"}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-muted text-[12px]">{item.sector || "Infrastructure"}</td>
                    <td className="px-5 py-3">
                      <span className="rounded-lg bg-white/[0.06] border border-white/[0.06] px-2.5 py-1 text-[11px] font-medium text-slate-300">
                        {item.currentMilestone}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className={`font-extrabold text-[15px] ${velocityColor(item.velocityScore)}`}>
                        {item.velocityScore}
                      </span>
                      <span className="text-[10px] text-muted">/100</span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/[0.08]">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#E85418] to-[#FF6B35]"
                            style={{ width: `${Math.min(item.progress, 100)}%` }}
                          />
                        </div>
                        <span className="font-semibold text-ink text-[12px]">{item.progress.toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10.5px] font-bold ${paceChip(item.pace)}`}>
                        {item.pace}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link to={`/projects/${item.id}`} className="inline-flex items-center gap-1 text-[12px] font-semibold text-orange hover:text-orange-light transition-colors">
                        Milestones <ArrowRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}

                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-5 py-10 text-center text-sm text-muted">
                      No corridors matching your search criteria.
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