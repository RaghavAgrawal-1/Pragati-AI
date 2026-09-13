import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  Zap,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  ArrowRight,
  Gauge,
  Layers,
  Flag,
} from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/common/Card";
import { api } from "../../services/apiClient";

export default function Performance() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState("ALL");

  useEffect(() => {
    api
      .get("/api/projects", { params: { skip: 0, limit: 12 } })
      .then((data) => setProjects(Array.isArray(data) ? data : data.items ?? []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  // Compute Milestone & Velocity Metrics
  const metrics = useMemo(() => {
    const total = projects.length;
    let highVelocity = 0;
    let normalVelocity = 0;
    let stalled = 0;

    projects.forEach((p) => {
      const prog = Number(p.physical_progress ?? 0);
      const st = String(p.status ?? "").toLowerCase();
      if (st.includes("delay") || st.includes("stop") || prog < 25) {
        stalled++;
      } else if (prog >= 60) {
        highVelocity++;
      } else {
        normalVelocity++;
      }
    });

    const avgVelocityIndex = total > 0 ? Math.round(((highVelocity * 100 + normalVelocity * 65 + stalled * 20) / (total * 100)) * 100) : 0;

    return {
      total,
      highVelocity,
      normalVelocity,
      stalled,
      avgVelocityIndex,
    };
  }, [projects]);

  // Milestone Stages Definition for EPC Infrastructure
  const milestoneStages = [
    { name: "Detailed Project Report (DPR) & Surveys", avgCompletion: 96, targetDays: "Day 0–90", status: "Completed" },
    { name: "Land Acquisition & RoW Demarcation", avgCompletion: 74, targetDays: "Day 90–240", status: "Critical Bottleneck" },
    { name: "Statutory & MoEFCC Clearances", avgCompletion: 68, targetDays: "Day 180–300", status: "In Scrutiny" },
    { name: "Civil Earthwork & Foundation Structures", avgCompletion: 54, targetDays: "Day 300–600", status: "Active Execution" },
    { name: "Superstructure & Pavement / Track Laying", avgCompletion: 38, targetDays: "Day 600–900", status: "In Progress" },
    { name: "Signalling, Electrification & Commissioning", avgCompletion: 21, targetDays: "Day 900–1200", status: "Upcoming Phase" },
  ];

  const enriched = useMemo(() => {
    return projects.map((p) => {
      const progress = Number(p.physical_progress ?? 0);
      const status = String(p.status ?? "").toLowerCase();
      let velocityScore = Math.min(99, Math.round(progress * 0.9 + 12));
      if (status.includes("delay")) velocityScore = Math.max(15, velocityScore - 35);

      let currentMilestone = "Commissioning";
      if (progress < 15) currentMilestone = "Land Acquisition & RoW";
      else if (progress < 35) currentMilestone = "Foundation & Earthworks";
      else if (progress < 60) currentMilestone = "Sub-Structure Construction";
      else if (progress < 85) currentMilestone = "Superstructure & Track / Pavement";

      return {
        ...p,
        progress,
        velocityScore,
        currentMilestone,
        pace: velocityScore >= 65 ? "Accelerated" : velocityScore >= 40 ? "Steady" : "Critical Lag",
      };
    });
  }, [projects]);

  const filtered = useMemo(() => {
    return enriched.filter((p) => {
      if (stageFilter === "ACCELERATED" && p.pace !== "Accelerated") return false;
      if (stageFilter === "STEADY" && p.pace !== "Steady") return false;
      if (stageFilter === "LAG" && p.pace !== "Critical Lag") return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.project_name?.toLowerCase().includes(q) ||
          p.sector?.toLowerCase().includes(q) ||
          p.currentMilestone?.toLowerCase().includes(q)
        );
      }
      return true;
    }).sort((a, b) => b.velocityScore - a.velocityScore);
  }, [enriched, stageFilter, searchQuery]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="EPC Milestone Velocity & Delivery Cadence"
        subtitle="Real-time execution speed index, milestone burn-down rates, and contractor cadence across national corridors."
      />

      {/* SIGNATURE KPI METRICS */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        <Card className="p-4 border-l-4 border-l-primary-500">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Cadence Index
            </p>
            <Gauge className="h-4 w-4 text-primary-600" />
          </div>
          <p className="mt-1.5 text-2xl font-bold text-slate-900">
            {metrics.avgVelocityIndex}
            <span className="text-xs text-slate-400 font-normal">/100</span>
          </p>
          <p className="mt-0.5 text-xs text-slate-500">Portfolio execution velocity</p>
        </Card>

        <Card className="p-4 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600">
              High Velocity
            </p>
            <Zap className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-1.5 text-2xl font-bold text-emerald-600">
            {metrics.highVelocity}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">Ahead or on scheduled pace</p>
        </Card>

        <Card className="p-4 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-600">
              Steady Pace
            </p>
            <Activity className="h-4 w-4 text-blue-500" />
          </div>
          <p className="mt-1.5 text-2xl font-bold text-blue-600">
            {metrics.normalVelocity}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">Within acceptable baseline</p>
        </Card>

        <Card className="p-4 border-l-4 border-l-red-500">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-red-600">
              Critical Velocity Lag
            </p>
            <Clock className="h-4 w-4 text-red-500" />
          </div>
          <p className="mt-1.5 text-2xl font-bold text-red-600">
            {metrics.stalled}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">Immediate recovery needed</p>
        </Card>
      </div>

      {/* ORIGINAL FEATURE: EPC MILESTONE BURN-DOWN TRACKER */}
      <Card className="p-5 space-y-4">
        <div className="border-b border-slate-100 pb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
              <Flag className="h-4 w-4 text-primary-600" />
              National Standard Infrastructure Milestone Hierarchy
            </h3>
            <p className="text-[11px] text-slate-500">
              Average completion and bottleneck status across standard PM GatiShakti EPC project phases
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">
            Lifecycle Progress: 6 Key Stages
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 pt-1">
          {milestoneStages.map((stage, idx) => (
            <div
              key={stage.name}
              className="rounded-xl border border-slate-200 p-3.5 bg-slate-50/50 hover:bg-white hover:border-primary-300 transition"
            >
              <div className="flex items-start justify-between">
                <span className="rounded-full bg-primary-100 text-primary-800 text-[10px] font-bold px-2 py-0.5">
                  Stage 0{idx + 1}
                </span>
                <span
                  className={`text-[10px] font-semibold ${
                    stage.avgCompletion >= 70
                      ? "text-emerald-700"
                      : stage.avgCompletion >= 40
                      ? "text-blue-700"
                      : "text-amber-700"
                  }`}
                >
                  {stage.targetDays}
                </span>
              </div>
              <p className="mt-2 text-xs font-bold text-slate-900 line-clamp-1">{stage.name}</p>

              {/* Progress bar */}
              <div className="mt-2.5 flex items-center gap-2">
                <div className="h-1.5 flex-1 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      stage.avgCompletion >= 70
                        ? "bg-emerald-500"
                        : stage.avgCompletion >= 40
                        ? "bg-primary-600"
                        : "bg-amber-500"
                    }`}
                    style={{ width: `${stage.avgCompletion}%` }}
                  />
                </div>
                <span className="text-[11px] font-bold text-slate-800">{stage.avgCompletion}%</span>
              </div>

              <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                <span>Health:</span>
                <span
                  className={`font-semibold ${
                    stage.status.includes("Bottleneck")
                      ? "text-red-600 font-bold"
                      : "text-slate-700"
                  }`}
                >
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
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by project, sector, or current milestone stage..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 pl-9 pr-4 py-2 text-xs focus:border-primary-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-medium text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Pace Filter:
            </span>
            {[
              { label: "All Corridors", key: "ALL" },
              { label: "Accelerated Cadence", key: "ACCELERATED" },
              { label: "Steady Cadence", key: "STEADY" },
              { label: "Lagging Delivery", key: "LAG" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStageFilter(tab.key)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  stageFilter === tab.key
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

      {/* ORIGINAL VELOCITY BOARD TABLE */}
      <Card className="overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50 px-5 py-3.5 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            Project Delivery Velocity Ledger ({filtered.length} Corridors Tracked)
          </h3>
          <span className="text-[11px] text-slate-500 font-medium">
            Sorted by Execution Cadence Score
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50/50 text-[11px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Project Title</th>
                <th className="px-5 py-3 font-semibold">Sector</th>
                <th className="px-5 py-3 font-semibold">Current Active Milestone</th>
                <th className="px-5 py-3 font-semibold text-center">Velocity Score</th>
                <th className="px-5 py-3 font-semibold">Physical Completion</th>
                <th className="px-5 py-3 font-semibold">Cadence Status</th>
                <th className="px-5 py-3 font-semibold text-right">Audit</th>
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
                      {item.project_name || "Unnamed Project"}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-slate-600">
                    {item.sector || "Infrastructure"}
                  </td>
                  <td className="px-5 py-3">
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                      {item.currentMilestone}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span
                      className={`font-extrabold text-sm ${
                        item.velocityScore >= 65
                          ? "text-emerald-600"
                          : item.velocityScore >= 40
                          ? "text-primary-600"
                          : "text-red-600"
                      }`}
                    >
                      {item.velocityScore}
                    </span>
                    <span className="text-[10px] text-slate-400">/100</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-primary-600"
                          style={{ width: `${Math.min(item.progress, 100)}%` }}
                        />
                      </div>
                      <span className="font-semibold text-slate-800">{item.progress.toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        item.pace === "Accelerated"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.pace === "Steady"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.pace}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      to={`/projects/${item.id}`}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary-600 hover:text-primary-700"
                    >
                      Milestones <ArrowRight className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-5 py-10 text-center text-xs text-slate-500">
                    No corridors matching your search criteria.
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