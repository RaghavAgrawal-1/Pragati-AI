import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardCheck, CheckCircle2, Clock, AlertCircle, Plus, Filter,
  Search, ArrowRight, ShieldAlert, Kanban, List, Sparkles, Building2,
} from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/common/Card";
import { api } from "../../services/apiClient";

export default function Interventions() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState("kanban"); // 'kanban' | 'list'
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const [formData, setFormData] = useState({
    project_name: "",
    issue: "",
    action: "",
    owner: "Nodal Planning Group (NPG)",
    priority: "High",
    deadline: "15 Oct 2026",
    bottleneck_category: "Land Acquisition",
  });

  const loadInterventions = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/interventions");
      setItems(res?.items || []);
    } catch (err) {
      console.error("Failed to load interventions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInterventions();
  }, []);

  const counts = useMemo(
    () => ({
      total: items.length,
      open: items.filter((i) => i.status === "Open" || !i.status).length,
      inProgress: items.filter((i) => i.status === "In Progress" || i.status === "Assigned").length,
      resolved: items.filter((i) => i.status === "Completed" || i.status === "Resolved").length,
    }),
    [items]
  );

  const updateStatus = async (id, newStatus) => {
    try {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
      await api.patch(`/api/interventions/${id}`, { status: newStatus });
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.project_name || !formData.action) return;

    try {
      const newItem = {
        ...formData,
        id: `INT-${Date.now().toString().slice(-4)}`,
        status: "Open",
        created_at: new Date().toISOString(),
      };

      setItems([newItem, ...items]);
      setShowForm(false);
      setFormData({
        project_name: "",
        issue: "",
        action: "",
        owner: "Nodal Planning Group (NPG)",
        priority: "High",
        deadline: "15 Oct 2026",
        bottleneck_category: "Land Acquisition",
      });

      await api.post("/api/interventions", newItem);
    } catch (err) {
      console.error("Failed to create intervention:", err);
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (categoryFilter !== "ALL" && item.bottleneck_category !== categoryFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.project_name?.toLowerCase().includes(q) ||
          item.issue?.toLowerCase().includes(q) ||
          item.action?.toLowerCase().includes(q) ||
          item.owner?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [items, categoryFilter, searchQuery]);

  // Kanban column grouping
  const kanbanColumns = useMemo(
    () => ({
      open: filteredItems.filter((i) => i.status === "Open" || !i.status),
      inProgress: filteredItems.filter((i) => i.status === "In Progress" || i.status === "Assigned"),
      resolved: filteredItems.filter((i) => i.status === "Completed" || i.status === "Resolved"),
    }),
    [filteredItems]
  );

  return (
    <div className="space-y-6 animate-slideUp">
      <PageHeader
        title="Inter-Agency Interventions & Directive Tracker"
        subtitle="PM GatiShakti Nodal Planning Group (NPG) action items, statutory clearance tracking, and bottleneck resolution directives."
      />

      {/* KPI STATS */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        <div className="rounded-2xl border-l-4 border-l-orange border border-white/[0.06] bg-surface-card p-4">
          <p className="text-[10.5px] font-bold uppercase tracking-widest text-orange">Total Mitigations</p>
          <p className="mt-1.5 text-[26px] font-extrabold tabular-nums text-ink">{loading ? "—" : counts.total}</p>
          <p className="mt-1 text-[11px] text-muted">Prescriptive directives generated</p>
        </div>

        <div className="rounded-2xl border-l-4 border-l-amber-500 border border-white/[0.06] bg-surface-card p-4">
          <p className="text-[10.5px] font-bold uppercase tracking-widest text-amber-400">Flagged & Pending</p>
          <p className="mt-1.5 text-[26px] font-extrabold tabular-nums text-amber-400">{loading ? "—" : counts.open}</p>
          <p className="mt-1 text-[11px] text-muted">Awaiting officer allocation</p>
        </div>

        <div className="rounded-2xl border-l-4 border-l-blue-500 border border-white/[0.06] bg-surface-card p-4">
          <p className="text-[10.5px] font-bold uppercase tracking-widest text-blue-400">NPG Active Scrutiny</p>
          <p className="mt-1.5 text-[26px] font-extrabold tabular-nums text-blue-400">{loading ? "—" : counts.inProgress}</p>
          <p className="mt-1 text-[11px] text-muted">Inter-agency review underway</p>
        </div>

        <div className="rounded-2xl border-l-4 border-l-emerald-500 border border-white/[0.06] bg-surface-card p-4">
          <p className="text-[10.5px] font-bold uppercase tracking-widest text-emerald-400">Resolved & Cleared</p>
          <p className="mt-1.5 text-[26px] font-extrabold tabular-nums text-emerald-400">{loading ? "—" : counts.resolved}</p>
          <p className="mt-1 text-[11px] text-muted">Bottlenecks expedited</p>
        </div>
      </div>

      {/* CONTROLS BAR */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search interventions by project, bottleneck, or action..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.05] pl-9 pr-4 py-2 text-[12.5px] text-ink placeholder:text-muted outline-none focus:border-orange/50 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="flex items-center rounded-xl border border-white/[0.08] bg-white/[0.04] p-1">
              <button
                onClick={() => setViewMode("kanban")}
                className={`rounded-lg p-1.5 transition ${viewMode === "kanban" ? "bg-orange text-white shadow-sm" : "text-muted hover:text-ink"}`}
                title="Kanban Board View"
              >
                <Kanban className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`rounded-lg p-1.5 transition ${viewMode === "list" ? "bg-orange text-white shadow-sm" : "text-muted hover:text-ink"}`}
                title="List Ledger View"
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-orange px-3.5 py-2 text-[12px] font-semibold text-white shadow-submit hover:bg-orange-light transition"
            >
              <Plus className="h-4 w-4" />
              New Intervention
            </button>
          </div>
        </div>

        {/* Bottleneck Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-white/[0.06]">
          <span className="text-[10.5px] font-bold uppercase tracking-widest text-muted mr-1 flex items-center gap-1">
            <Filter className="h-3 w-3" /> Bottleneck:
          </span>
          {[
            { label: "All Categories", key: "ALL" },
            { label: "Land Acquisition (RoW)", key: "Land Acquisition" },
            { label: "MoEFCC Forest Clearance", key: "Environmental Clearance" },
            { label: "Utility Shifting", key: "Utility Shifting" },
            { label: "Inter-Agency NPG", key: "Inter-Agency Coordination" },
            { label: "Contractor Liquidity", key: "Contractor Liquidity" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setCategoryFilter(tab.key)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                categoryFilter === tab.key
                  ? "bg-orange text-white"
                  : "bg-white/[0.06] text-muted hover:bg-white/[0.10] hover:text-ink"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </Card>

      {/* CREATE FORM DRAWER */}
      {showForm && (
        <Card className="p-5 border-2 border-orange/40 bg-orange/[0.04] space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <h3 className="text-[13.5px] font-bold text-ink flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-orange" />
              Draft PM GatiShakti Prescriptive Directive
            </h3>
            <button onClick={() => setShowForm(false)} className="text-[12px] text-muted hover:text-ink">
              Cancel
            </button>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="block text-[10.5px] font-bold uppercase tracking-widest text-muted mb-1">Target Project</label>
                <input
                  required
                  value={formData.project_name}
                  onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                  placeholder="e.g. Vadodara-Mumbai Expressway"
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.05] px-3 py-2 text-[12.5px] text-ink outline-none focus:border-orange/50"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-bold uppercase tracking-widest text-muted mb-1">Bottleneck Classification</label>
                <select
                  value={formData.bottleneck_category}
                  onChange={(e) => setFormData({ ...formData, bottleneck_category: e.target.value })}
                  className="w-full rounded-xl border border-white/[0.08] bg-surface-card px-3 py-2 text-[12.5px] text-ink outline-none focus:border-orange/50"
                  style={{ backgroundColor: "#1A1B25", color: "#F0F2F8" }}
                >
                  <option value="Land Acquisition">Land Acquisition (RoW)</option>
                  <option value="Environmental Clearance">MoEFCC Forest Clearance</option>
                  <option value="Utility Shifting">Utility Shifting (Power/Water)</option>
                  <option value="Inter-Agency Coordination">Inter-Agency Coordination</option>
                  <option value="Contractor Liquidity">Contractor Liquidity / Funding</option>
                </select>
              </div>

              <div>
                <label className="block text-[10.5px] font-bold uppercase tracking-widest text-muted mb-1">Assigned Nodal Body / Owner</label>
                <input
                  value={formData.owner}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                  placeholder="e.g. Ministry of Road Transport & Highways"
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.05] px-3 py-2 text-[12.5px] text-ink outline-none focus:border-orange/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10.5px] font-bold uppercase tracking-widest text-muted mb-1">Root Cause / Identified Impediment</label>
              <input
                value={formData.issue}
                onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                placeholder="Briefly describe the obstacle delaying physical execution..."
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.05] px-3 py-2 text-[12.5px] text-ink outline-none focus:border-orange/50"
              />
            </div>

            <div>
              <label className="block text-[10.5px] font-bold uppercase tracking-widest text-muted mb-1">Recommended Prescriptive Action</label>
              <textarea
                required
                rows={2}
                value={formData.action}
                onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                placeholder="State specific directive, expedited clearance pathway, or financial release requirement..."
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.05] px-3 py-2 text-[12.5px] text-ink outline-none focus:border-orange/50"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-[12px] font-semibold text-ink hover:bg-white/[0.08]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-orange px-5 py-2 text-[12px] font-semibold text-white shadow-submit hover:bg-orange-light"
              >
                Issue PM GatiShakti Directive
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* KANBAN BOARD OR LIST VIEW */}
      {loading ? (
        <Card className="p-12 text-center text-sm text-muted">Loading active directives…</Card>
      ) : viewMode === "kanban" ? (
        /* KANBAN VIEW */
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* OPEN COLUMN */}
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-amber-500/10 border border-amber-500/20 px-4 py-2.5">
              <span className="text-[12px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
                Pending Review ({kanbanColumns.open.length})
              </span>
            </div>

            <div className="space-y-3">
              {kanbanColumns.open.map((item) => (
                <Card key={item.id} className="p-4 space-y-3 border-l-4 border-l-amber-500 hover:border-amber-500/40">
                  <div className="flex items-start justify-between gap-2">
                    <span className="rounded-full bg-white/[0.06] border border-white/[0.06] px-2 py-0.5 text-[10px] font-medium text-muted">
                      {item.bottleneck_category || "Clearance"}
                    </span>
                    <span className="text-[10.5px] font-bold text-amber-400 uppercase font-mono">
                      {item.priority || "High"}
                    </span>
                  </div>

                  <p className="text-[13px] font-bold text-ink leading-snug">{item.project_name}</p>
                  <p className="text-[12px] text-muted line-clamp-2">{item.action || item.issue}</p>

                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px]">
                    <span className="text-muted font-mono">{item.owner || "NPG Cell"}</span>
                    <button
                      onClick={() => updateStatus(item.id, "In Progress")}
                      className="font-semibold text-orange hover:text-orange-light transition-colors"
                    >
                      Start Review →
                    </button>
                  </div>
                </Card>
              ))}
              {kanbanColumns.open.length === 0 && (
                <div className="rounded-xl border border-dashed border-white/[0.08] p-6 text-center text-[12px] text-muted">
                  No pending directives
                </div>
              )}
            </div>
          </div>

          {/* IN PROGRESS COLUMN */}
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-blue-500/10 border border-blue-500/20 px-4 py-2.5">
              <span className="text-[12px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-blue-400" />
                Under NPG Scrutiny ({kanbanColumns.inProgress.length})
              </span>
            </div>

            <div className="space-y-3">
              {kanbanColumns.inProgress.map((item) => (
                <Card key={item.id} className="p-4 space-y-3 border-l-4 border-l-blue-500 hover:border-blue-500/40">
                  <div className="flex items-start justify-between gap-2">
                    <span className="rounded-full bg-white/[0.06] border border-white/[0.06] px-2 py-0.5 text-[10px] font-medium text-muted">
                      {item.bottleneck_category || "Clearance"}
                    </span>
                    <span className="text-[10.5px] font-bold text-blue-400 uppercase font-mono">
                      {item.priority || "High"}
                    </span>
                  </div>

                  <p className="text-[13px] font-bold text-ink leading-snug">{item.project_name}</p>
                  <p className="text-[12px] text-muted line-clamp-2">{item.action || item.issue}</p>

                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px]">
                    <span className="text-muted font-mono">{item.owner || "NPG Cell"}</span>
                    <button
                      onClick={() => updateStatus(item.id, "Completed")}
                      className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      Mark Resolved ✓
                    </button>
                  </div>
                </Card>
              ))}
              {kanbanColumns.inProgress.length === 0 && (
                <div className="rounded-xl border border-dashed border-white/[0.08] p-6 text-center text-[12px] text-muted">
                  No active reviews
                </div>
              )}
            </div>
          </div>

          {/* RESOLVED COLUMN */}
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5">
              <span className="text-[12px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                Resolved & Cleared ({kanbanColumns.resolved.length})
              </span>
            </div>

            <div className="space-y-3">
              {kanbanColumns.resolved.map((item) => (
                <Card key={item.id} className="p-4 space-y-3 border-l-4 border-l-emerald-500 opacity-80">
                  <div className="flex items-start justify-between gap-2">
                    <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                      RESOLVED
                    </span>
                    <span className="text-[10.5px] font-bold text-muted font-mono">
                      {item.deadline || "Completed"}
                    </span>
                  </div>

                  <p className="text-[13px] font-bold text-ink leading-snug">{item.project_name}</p>
                  <p className="text-[12px] text-muted line-clamp-2">{item.action || item.issue}</p>

                  <div className="pt-2 border-t border-white/[0.06] text-[11px] text-emerald-400 font-medium">
                    ✓ Directive fully executed by NPG Nodal Officer
                  </div>
                </Card>
              ))}
              {kanbanColumns.resolved.length === 0 && (
                <div className="rounded-xl border border-dashed border-white/[0.08] p-6 text-center text-[12px] text-muted">
                  No resolved items yet
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* LIST LEDGER VIEW */
        <Card className="overflow-hidden">
          <div className="border-b border-white/[0.06] bg-white/[0.02] px-5 py-3.5 flex items-center justify-between">
            <h3 className="text-[12px] font-bold uppercase tracking-wider text-ink">
              Inter-Agency Prescriptive Directive Ledger ({filteredItems.length} Actions)
            </h3>
            <span className="text-[11px] text-muted font-medium">Official NPG Audit Feed</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-white/[0.06] bg-white/[0.02] text-[10.5px] uppercase tracking-widest text-muted">
                <tr>
                  <th className="px-5 py-3 font-bold">Target Project</th>
                  <th className="px-5 py-3 font-bold">Bottleneck Classification</th>
                  <th className="px-5 py-3 font-bold">Prescriptive Directive Action</th>
                  <th className="px-5 py-3 font-bold">Assigned Owner</th>
                  <th className="px-5 py-3 font-bold">Status</th>
                  <th className="px-5 py-3 text-right font-bold">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-5 py-3.5 font-bold text-ink text-[13px]">{item.project_name}</td>
                    <td className="px-5 py-3 text-muted text-[12px]">{item.bottleneck_category || "Clearance"}</td>
                    <td className="px-5 py-3 text-slate-200 text-[12.5px] max-w-[320px] leading-snug">{item.action || item.issue}</td>
                    <td className="px-5 py-3 text-muted text-[12px] font-mono">{item.owner || "NPG Cell"}</td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10.5px] font-bold ${
                        item.status === "Completed" || item.status === "Resolved"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : item.status === "In Progress" || item.status === "Assigned"
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}>
                        {item.status || "Open"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      {item.status !== "Completed" && item.status !== "Resolved" ? (
                        <button
                          onClick={() => updateStatus(item.id, item.status === "In Progress" ? "Completed" : "In Progress")}
                          className="text-[12px] font-semibold text-orange hover:text-orange-light transition-colors"
                        >
                          Advance Status →
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-400 font-semibold">✓ Cleared</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}