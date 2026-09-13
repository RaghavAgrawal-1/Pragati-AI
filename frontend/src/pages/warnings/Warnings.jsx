import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle, ShieldAlert, Search, CheckCircle2, ExternalLink,
  ChevronRight, Filter, Layers, Sparkles, ArrowRight, Check,
} from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/common/Card";
import { api } from "../../services/apiClient";

export default function Warnings() {
  const [warnings, setWarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;
  const [acknowledgedIds, setAcknowledgedIds] = useState(new Set());
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    async function loadWarnings() {
      try {
        const response = await api.get("/api/warnings", { params: { limit: 12 } });
        const items = response?.items ?? [];
        setWarnings(items);
      } catch (err) {
        console.error("Failed to load warnings:", err);
        setWarnings([]);
      } finally {
        setLoading(false);
      }
    }
    loadWarnings();
  }, []);

  const handleAcknowledge = (id, projectName) => {
    setAcknowledgedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        setToastMessage(`Warning acknowledged for "${projectName}".`);
        setTimeout(() => setToastMessage(null), 3000);
      }
      return next;
    });
  };

  const counts = useMemo(
    () => ({
      total: warnings.length,
      critical: warnings.filter((w) => w.severity === "CRITICAL").length,
      high: warnings.filter((w) => w.severity === "HIGH").length,
      medium: warnings.filter((w) => w.severity === "MEDIUM").length,
      acknowledged: acknowledgedIds.size,
    }),
    [warnings, acknowledgedIds]
  );

  const filteredWarnings = useMemo(() => {
    let result = warnings;
    if (filter === "CRITICAL") result = result.filter((w) => w.severity === "CRITICAL");
    else if (filter === "HIGH") result = result.filter((w) => w.severity === "HIGH");
    else if (filter === "MEDIUM") result = result.filter((w) => w.severity === "MEDIUM");
    else if (filter === "ACKNOWLEDGED") result = result.filter((w) => acknowledgedIds.has(w.id));
    else if (filter === "COST") result = result.filter((w) => w.driver?.toLowerCase().includes("cost"));
    else if (filter === "TIME") result = result.filter((w) => w.driver?.toLowerCase().includes("time") || w.driver?.toLowerCase().includes("delay"));

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (w) =>
          w.project?.toLowerCase().includes(q) ||
          w.driver?.toLowerCase().includes(q) ||
          w.rootCause?.toLowerCase().includes(q) ||
          w.recommendation?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [warnings, filter, searchQuery, acknowledgedIds]);

  useEffect(() => { setCurrentPage(1); }, [filter, searchQuery]);

  const totalPages = Math.ceil(filteredWarnings.length / pageSize) || 1;
  const paginatedWarnings = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredWarnings.slice(start, start + pageSize);
  }, [filteredWarnings, currentPage, pageSize]);

  return (
    <div className="space-y-6 animate-slideUp">
      <PageHeader
        title="Active Early Warning Signals & Telemetry"
        subtitle="Automated threshold breach alerts, root cause diagnostics, and recommended intervention protocols."
      />

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-emerald-500 border border-emerald-400 px-4 py-3 text-[13px] font-semibold text-slate-950 shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
          <CheckCircle2 size={16} />
          {toastMessage}
        </div>
      )}

      {/* KPI METRICS */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        <div
          onClick={() => setFilter(filter === "CRITICAL" ? "ALL" : "CRITICAL")}
          className={`cursor-pointer rounded-2xl border-l-4 border-l-red-500 border border-white/[0.06] bg-surface-card p-4 transition-all hover:bg-white/[0.04] ${
            filter === "CRITICAL" ? "ring-1 ring-red-500/50" : ""
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10.5px] font-bold uppercase tracking-widest text-red-400">Critical Breach</p>
            <ShieldAlert size={14} className="text-red-400" />
          </div>
          <p className="text-[26px] font-extrabold tabular-nums text-red-400">{loading ? "—" : counts.critical}</p>
          <p className="mt-1 text-[11px] text-muted">Immediate action required</p>
        </div>

        <div
          onClick={() => setFilter(filter === "HIGH" ? "ALL" : "HIGH")}
          className={`cursor-pointer rounded-2xl border-l-4 border-l-amber-500 border border-white/[0.06] bg-surface-card p-4 transition-all hover:bg-white/[0.04] ${
            filter === "HIGH" ? "ring-1 ring-amber-500/50" : ""
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10.5px] font-bold uppercase tracking-widest text-amber-400">High Priority</p>
            <AlertTriangle size={14} className="text-amber-400" />
          </div>
          <p className="text-[26px] font-extrabold tabular-nums text-amber-400">{loading ? "—" : counts.high}</p>
          <p className="mt-1 text-[11px] text-muted">Accelerated escalation</p>
        </div>

        <div
          onClick={() => setFilter(filter === "MEDIUM" ? "ALL" : "MEDIUM")}
          className={`cursor-pointer rounded-2xl border-l-4 border-l-blue-500 border border-white/[0.06] bg-surface-card p-4 transition-all hover:bg-white/[0.04] ${
            filter === "MEDIUM" ? "ring-1 ring-blue-500/50" : ""
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10.5px] font-bold uppercase tracking-widest text-blue-400">Medium Warning</p>
            <Layers size={14} className="text-blue-400" />
          </div>
          <p className="text-[26px] font-extrabold tabular-nums text-blue-400">{loading ? "—" : counts.medium}</p>
          <p className="mt-1 text-[11px] text-muted">Active monitoring</p>
        </div>

        <div
          onClick={() => setFilter(filter === "ACKNOWLEDGED" ? "ALL" : "ACKNOWLEDGED")}
          className={`cursor-pointer rounded-2xl border-l-4 border-l-emerald-500 border border-white/[0.06] bg-surface-card p-4 transition-all hover:bg-white/[0.04] ${
            filter === "ACKNOWLEDGED" ? "ring-1 ring-emerald-500/50" : ""
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10.5px] font-bold uppercase tracking-widest text-emerald-400">Acknowledged</p>
            <CheckCircle2 size={14} className="text-emerald-400" />
          </div>
          <p className="text-[26px] font-extrabold tabular-nums text-emerald-400">{counts.acknowledged}</p>
          <p className="mt-1 text-[11px] text-muted">Addressed by nodal team</p>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <Card className="p-3.5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search by project name, risk driver, or root cause..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.05] pl-9 pr-4 py-2 text-[12.5px] text-ink placeholder:text-muted outline-none focus:border-orange/50 transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10.5px] font-bold uppercase tracking-widest text-muted mr-1 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Filter:
            </span>
            {[
              { label: "All", key: "ALL" },
              { label: "Critical", key: "CRITICAL" },
              { label: "High", key: "HIGH" },
              { label: "Medium", key: "MEDIUM" },
              { label: "Cost Risk", key: "COST" },
              { label: "Delay Risk", key: "TIME" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`rounded-full px-3 py-1 text-[11.5px] font-semibold transition-colors ${
                  filter === tab.key
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

      {/* WARNINGS FEED */}
      <div className="space-y-3.5">
        {loading ? (
          <Card className="p-12 text-center text-sm text-muted">Scanning portfolio early-warning telemetry…</Card>
        ) : filteredWarnings.length === 0 ? (
          <Card className="p-12 text-center text-sm text-muted">
            No warnings matching "{searchQuery || filter}". All projects operating within thresholds.
          </Card>
        ) : (
          paginatedWarnings.map((warning) => {
            const isAck = acknowledgedIds.has(warning.id);
            const isCrit = warning.severity === "CRITICAL";
            const isHigh = warning.severity === "HIGH";

            return (
              <Card
                key={warning.id}
                className={`transition-all ${
                  isAck
                    ? "opacity-60 border-l-4 border-l-slate-600 bg-white/[0.02]"
                    : isCrit
                    ? "border-l-4 border-l-red-500"
                    : isHigh
                    ? "border-l-4 border-l-amber-500"
                    : "border-l-4 border-l-blue-400"
                }`}
              >
                <div className="p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1 space-y-2.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          to={`/projects/${warning.projectId || warning.id}`}
                          className="text-[14px] font-bold text-ink hover:text-orange transition-colors inline-flex items-center gap-1.5"
                        >
                          {warning.project}
                          <ExternalLink className="h-3.5 w-3.5 text-muted" />
                        </Link>

                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10.5px] font-bold ${
                            isCrit
                              ? "bg-red-500/10 text-red-400 border border-red-500/20"
                              : isHigh
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          }`}
                        >
                          {warning.severity} SEVERITY
                        </span>

                        <span className="rounded-full bg-white/[0.06] border border-white/[0.06] px-2.5 py-0.5 text-[10.5px] font-semibold text-muted">
                          {warning.driver}
                        </span>

                        {isAck && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10.5px] font-bold text-emerald-400">
                            <Check size={12} /> Acknowledged
                          </span>
                        )}
                      </div>

                      {/* Root Cause & Diagnosis */}
                      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[12px] font-bold text-amber-400">
                          <AlertTriangle size={14} />
                          Root Cause Diagnostic
                        </div>
                        <p className="text-[12.5px] leading-relaxed text-slate-200">
                          {warning.rootCause || warning.message || "Threshold parameter exceeded normal baseline range."}
                        </p>
                      </div>

                      {/* AI Action Plan */}
                      <div className="rounded-xl border border-orange/20 bg-orange/[0.06] p-3 space-y-1">
                        <div className="flex items-center gap-1.5 text-[12px] font-bold text-orange">
                          <Sparkles size={14} />
                          Recommended Intervention Protocol
                        </div>
                        <p className="text-[12px] leading-relaxed text-slate-200">
                          {warning.recommendation || "Issue priority directive to nodal ministry and schedule site inspection."}
                        </p>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-wrap items-center gap-2 lg:flex-col lg:items-end">
                      <button
                        onClick={() => handleAcknowledge(warning.id, warning.project)}
                        className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-[12px] font-semibold transition-all ${
                          isAck
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                            : "border-white/[0.08] bg-white/[0.04] text-ink hover:bg-white/[0.08]"
                        }`}
                      >
                        {isAck ? <><Check size={14} /> Acknowledged</> : "Acknowledge Alert"}
                      </button>

                      <Link
                        to={`/projects/${warning.projectId || warning.id}`}
                        className="inline-flex items-center gap-1 text-[12px] font-semibold text-orange hover:text-orange-light transition-colors"
                      >
                        View Project Workspace <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* PAGINATION */}
      {!loading && filteredWarnings.length > pageSize && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/[0.06] bg-surface-card px-5 py-3.5">
          <p className="text-[12px] text-muted font-medium">
            Showing <strong className="text-ink">{(currentPage - 1) * pageSize + 1}</strong> to{" "}
            <strong className="text-ink">{Math.min(currentPage * pageSize, filteredWarnings.length)}</strong> of{" "}
            <strong className="text-ink">{filteredWarnings.length}</strong> alerts
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