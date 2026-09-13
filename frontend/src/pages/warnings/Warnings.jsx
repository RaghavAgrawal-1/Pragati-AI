import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ShieldAlert,
  Search,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Filter,
  Layers,
  Sparkles,
  ArrowRight,
  Check,
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
        const response = await api.get("/api/warnings", {
          params: { limit: 12 },
        });

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
    else if (filter === "COST") result = result.filter((w) => (w.driver || "").toLowerCase().includes("cost"));
    else if (filter === "TIME") result = result.filter((w) => (w.driver || "").toLowerCase().includes("time") || (w.driver || "").toLowerCase().includes("delay") || (w.driver || "").toLowerCase().includes("schedule"));

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (w) =>
          w.project?.toLowerCase().includes(q) ||
          w.driver?.toLowerCase().includes(q) ||
          w.reason?.toLowerCase().includes(q) ||
          w.recommendation?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [warnings, filter, searchQuery, acknowledgedIds]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchQuery]);

  const totalPages = Math.ceil(filteredWarnings.length / pageSize) || 1;
  const paginatedWarnings = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredWarnings.slice(start, start + pageSize);
  }, [filteredWarnings, currentPage, pageSize]);

  return (
    <div className="space-y-6">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-xs font-medium text-white shadow-xl">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <PageHeader
        title="Early Warning & Risk Intelligence Center"
        subtitle="Real-time multi-dimensional risk signals, automated escalation triggers, and PM GatiShakti interventions."
      />

      {/* KPI METRIC CARDS WITH ONE-CLICK FILTERING */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        <Card
          onClick={() => setFilter(filter === "CRITICAL" ? "ALL" : "CRITICAL")}
          className={`cursor-pointer p-4 border-l-4 border-l-red-500 transition hover:shadow-md ${
            filter === "CRITICAL" ? "ring-2 ring-red-500 bg-red-50/20" : ""
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-red-600">
              Critical Urgency
            </p>
            <ShieldAlert className="h-4 w-4 text-red-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-red-600">
            {loading ? "—" : counts.critical}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">Immediate action required</p>
        </Card>

        <Card
          onClick={() => setFilter(filter === "HIGH" ? "ALL" : "HIGH")}
          className={`cursor-pointer p-4 border-l-4 border-l-amber-500 transition hover:shadow-md ${
            filter === "HIGH" ? "ring-2 ring-amber-500 bg-amber-50/20" : ""
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-600">
              High Priority
            </p>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-600">
            {loading ? "—" : counts.high}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">Accelerated escalation</p>
        </Card>

        <Card
          onClick={() => setFilter(filter === "MEDIUM" ? "ALL" : "MEDIUM")}
          className={`cursor-pointer p-4 border-l-4 border-l-blue-500 transition hover:shadow-md ${
            filter === "MEDIUM" ? "ring-2 ring-blue-500 bg-blue-50/20" : ""
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-600">
              Medium Warning
            </p>
            <Layers className="h-4 w-4 text-blue-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-blue-600">
            {loading ? "—" : counts.medium}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">Active monitoring</p>
        </Card>

        <Card
          onClick={() => setFilter(filter === "ACKNOWLEDGED" ? "ALL" : "ACKNOWLEDGED")}
          className={`cursor-pointer p-4 border-l-4 border-l-emerald-500 transition hover:shadow-md ${
            filter === "ACKNOWLEDGED" ? "ring-2 ring-emerald-500 bg-emerald-50/20" : ""
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600">
              Acknowledged
            </p>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-600">
            {counts.acknowledged}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">Addressed by nodal team</p>
        </Card>
      </div>

      {/* FILTER & SEARCH BAR */}
      <Card className="p-3.5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by project name, risk driver, or root cause..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 pl-9 pr-4 py-2 text-xs focus:border-primary-500 focus:outline-none"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-medium text-slate-400 mr-1 flex items-center gap-1">
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
                className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                  filter === tab.key
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

      {/* WARNINGS FEED */}
      <div className="space-y-3.5">
        {loading ? (
          <Card className="p-12 text-center text-xs text-slate-500">
            Scanning portfolio early-warning telemetry...
          </Card>
        ) : filteredWarnings.length === 0 ? (
          <Card className="p-12 text-center text-xs text-slate-500">
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
                className={`transition hover:shadow-md ${
                  isAck
                    ? "opacity-65 border-l-4 border-l-slate-300 bg-slate-50/50"
                    : isCrit
                    ? "border-l-4 border-l-red-500"
                    : isHigh
                    ? "border-l-4 border-l-amber-500"
                    : "border-l-4 border-l-blue-400"
                }`}
              >
                <div className="p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    {/* Left: Content */}
                    <div className="min-w-0 flex-1 space-y-2.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          to={`/projects/${warning.projectId || warning.id}`}
                          className="text-sm font-bold text-slate-900 hover:text-primary-600 hover:underline inline-flex items-center gap-1.5"
                        >
                          {warning.project}
                          <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                        </Link>

                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            isCrit
                              ? "bg-red-100 text-red-700"
                              : isHigh
                              ? "bg-amber-100 text-amber-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {warning.severity} SEVERITY
                        </span>

                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                          {warning.driver}
                        </span>

                        {isAck && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                            <Check className="h-3 w-3" /> ACKNOWLEDGED
                          </span>
                        )}
                      </div>

                      {/* Diagnostic Reason */}
                      <p className="text-xs leading-relaxed text-slate-600">
                        {warning.reason}
                      </p>

                      {/* Recommended Intervention */}
                      <div className="rounded-lg bg-amber-50/60 border border-amber-200/60 p-3">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-900">
                          <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                          Recommended PM GatiShakti Intervention
                        </div>
                        <p className="mt-1 text-xs text-amber-800 leading-normal">
                          {warning.recommendation}
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <button
                          onClick={() => handleAcknowledge(warning.id, warning.project)}
                          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                            isAck
                              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {isAck ? "Acknowledged" : "Acknowledge Signal"}
                        </button>

                        <Link
                          to={`/projects/${warning.projectId || warning.id}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                        >
                          Full Project Audit <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>

                    {/* Right: Metrics box */}
                    <div className="grid shrink-0 grid-cols-2 gap-2 lg:w-48">
                      <div className="rounded-lg border border-slate-200 p-2.5 bg-slate-50/60 text-center">
                        <p className="text-[10px] text-slate-500 font-medium">Risk Score</p>
                        <p className="mt-1 text-xl font-extrabold text-slate-900">
                          {warning.score}
                          <span className="text-xs text-slate-400 font-normal">/100</span>
                        </p>
                      </div>

                      <div className="rounded-lg border border-slate-200 p-2.5 bg-slate-50/60 text-center">
                        <p className="text-[10px] text-slate-500 font-medium">Cost Prob</p>
                        <p className="mt-1 text-xl font-extrabold text-amber-600">
                          {warning.costProbability ? Number(warning.costProbability).toFixed(0) : 0}%
                        </p>
                      </div>

                      <div className="col-span-2 rounded-lg border border-slate-200 p-2.5 bg-white">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500">Delay Risk</span>
                          <span className="font-bold text-blue-700">
                            {warning.timeProbability ? Number(warning.timeProbability).toFixed(0) : 0}%
                          </span>
                        </div>
                        <div className="mt-1.5 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-blue-600"
                            style={{ width: `${Math.min(warning.timeProbability || 0, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* COMPACT PAGINATION BAR */}
      {!loading && filteredWarnings.length > pageSize && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3.5 shadow-sm">
          <p className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-800">{(currentPage - 1) * pageSize + 1}</strong> to{" "}
            <strong className="text-slate-800">{Math.min(currentPage * pageSize, filteredWarnings.length)}</strong> of{" "}
            <strong className="text-slate-800">{filteredWarnings.length}</strong> active warnings
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

      {/* FOOTER EXPLANATION */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="p-4 bg-slate-50 border-slate-200">
          <p className="text-xs font-bold text-slate-800">1. Automated Telemetry</p>
          <p className="mt-1 text-xs text-slate-500">
            Real-time triggers evaluate expenditure curves against planned milestones.
          </p>
        </Card>
        <Card className="p-4 bg-slate-50 border-slate-200">
          <p className="text-xs font-bold text-slate-800">2. Root Cause Attribution</p>
          <p className="mt-1 text-xs text-slate-500">
            Distinguishes between contractor delays, RoW issues, and geological constraints.
          </p>
        </Card>
        <Card className="p-4 bg-slate-50 border-slate-200">
          <p className="text-xs font-bold text-slate-800">3. Actionable Mitigation</p>
          <p className="mt-1 text-xs text-slate-500">
            Generates turnkey escalation protocols for PM GatiShakti empowered groups.
          </p>
        </Card>
      </div>
    </div>
  );
}