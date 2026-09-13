import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Filter,
  Search,
  ArrowRight,
  ShieldAlert,
  Kanban,
  List,
  Sparkles,
  Building2,
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
      const created = await api.post("/api/interventions", formData);
      setItems((prev) => [created, ...prev]);
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
    } catch (err) {
      console.error("Failed to create intervention:", err);
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (categoryFilter !== "ALL" && item.bottleneck_category !== categoryFilter) return false;

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

  const kanbanColumns = [
    {
      title: "1. AI Flagged / Pending Review",
      key: "Open",
      filterFn: (i) => i.status === "Open" || !i.status,
      accent: "border-t-amber-500",
      badgeColor: "bg-amber-100 text-amber-800",
    },
    {
      title: "2. Under PM GatiShakti NPG Action",
      key: "In Progress",
      filterFn: (i) => i.status === "In Progress" || i.status === "Assigned",
      accent: "border-t-primary-500",
      badgeColor: "bg-primary-100 text-primary-800",
    },
    {
      title: "3. Inter-Ministerial Cleared / Resolved",
      key: "Completed",
      filterFn: (i) => i.status === "Completed" || i.status === "Resolved",
      accent: "border-t-emerald-500",
      badgeColor: "bg-emerald-100 text-emerald-800",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="PM GatiShakti Prescriptive Action Board"
        subtitle="Empowered Network Planning Group (NPG) operational workflow resolving statutory and cross-ministerial bottlenecks."
      />

      {/* KPI METRICS */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        <Card className="p-4 border-l-4 border-l-primary-500">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Total Mitigations
          </p>
          <p className="mt-1.5 text-2xl font-bold text-slate-900">
            {loading ? "—" : counts.total}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">Prescriptive directives generated</p>
        </Card>

        <Card className="p-4 border-l-4 border-l-amber-500">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-600">
            Flagged & Pending
          </p>
          <p className="mt-1.5 text-2xl font-bold text-amber-600">
            {loading ? "—" : counts.open}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">Awaiting officer allocation</p>
        </Card>

        <Card className="p-4 border-l-4 border-l-blue-500">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-600">
            NPG Active Scrutiny
          </p>
          <p className="mt-1.5 text-2xl font-bold text-blue-600">
            {loading ? "—" : counts.inProgress}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">Inter-agency review underway</p>
        </Card>

        <Card className="p-4 border-l-4 border-l-emerald-500">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600">
            Resolved & Cleared
          </p>
          <p className="mt-1.5 text-2xl font-bold text-emerald-600">
            {loading ? "—" : counts.resolved}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">Bottlenecks expedited</p>
        </Card>
      </div>

      {/* CONTROLS BAR */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search interventions by project, bottleneck, or action..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 pl-9 pr-4 py-2 text-xs focus:border-primary-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-1">
              <button
                onClick={() => setViewMode("kanban")}
                className={`rounded p-1.5 transition ${
                  viewMode === "kanban"
                    ? "bg-white text-primary-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
                title="Kanban Board View"
              >
                <Kanban className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`rounded p-1.5 transition ${
                  viewMode === "list"
                    ? "bg-white text-primary-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
                title="List Ledger View"
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-primary-700 transition shadow-sm"
            >
              <Plus className="h-4 w-4" />
              New Intervention
            </button>
          </div>
        </div>

        {/* Bottleneck Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100">
          <span className="text-[11px] font-medium text-slate-400 mr-1 flex items-center gap-1">
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
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                categoryFilter === tab.key
                  ? "bg-primary-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </Card>

      {/* CREATE FORM DRAWER */}
      {showForm && (
        <Card className="p-5 border-2 border-primary-500 bg-primary-50/20 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-primary-600" />
              Draft PM GatiShakti Prescriptive Directive
            </h3>
            <button
              onClick={() => setShowForm(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Target Project</label>
                <input
                  required
                  value={formData.project_name}
                  onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                  placeholder="e.g. Vadodara-Mumbai Expressway"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:border-primary-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Bottleneck Classification</label>
                <select
                  value={formData.bottleneck_category}
                  onChange={(e) => setFormData({ ...formData, bottleneck_category: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:border-primary-500 outline-none"
                >
                  <option value="Land Acquisition">Land Acquisition (RFCTLARR RoW)</option>
                  <option value="Environmental Clearance">MoEFCC Forest Clearance</option>
                  <option value="Utility Shifting">Utility Shifting (Power / Pipelines)</option>
                  <option value="Inter-Agency Coordination">Inter-Agency / NPG Escalation</option>
                  <option value="Contractor Liquidity">Contractor Cashflow & Claims</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Designated Nodal Officer</label>
                <input
                  value={formData.owner}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                  placeholder="e.g. Joint Secretary (Infrastructure)"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:border-primary-500 outline-none"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Specific Regulatory Bottleneck</label>
                <input
                  required
                  value={formData.issue}
                  onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                  placeholder="e.g. Section 19 notification pending across 12.4 km stretch"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:border-primary-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Mandated Action Directive</label>
                <input
                  required
                  value={formData.action}
                  onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                  placeholder="e.g. Convene joint review with State Chief Secretary within 10 days"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:border-primary-500 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-primary-600 px-4 py-2 text-xs font-semibold text-white hover:bg-primary-700"
              >
                Issue Directive
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* MAIN VIEW: KANBAN BOARD OR LIST */}
      {loading ? (
        <Card className="p-12 text-center text-xs text-slate-500">
          Loading active PM GatiShakti mitigation board...
        </Card>
      ) : viewMode === "kanban" ? (
        /* KANBAN BOARD VIEW */
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {kanbanColumns.map((col) => {
            const colItems = filteredItems.filter(col.filterFn);

            return (
              <div key={col.key} className="flex flex-col space-y-3">
                {/* Column Header */}
                <div className={`rounded-xl border border-slate-200 bg-white p-3.5 border-t-4 ${col.accent} shadow-sm flex items-center justify-between`}>
                  <h4 className="text-xs font-bold text-slate-900">{col.title}</h4>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${col.badgeColor}`}>
                    {colItems.length}
                  </span>
                </div>

                {/* Column Cards */}
                <div className="space-y-3 flex-1 min-h-[350px]">
                  {colItems.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-[11px] text-slate-400">
                      No actions in this stage.
                    </div>
                  ) : (
                    colItems.map((item) => (
                      <Card
                        key={item.id}
                        className="p-4 space-y-3 hover:shadow-md transition border-slate-200"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                            {item.bottleneck_category || "General Clearance"}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {item.deadline || "Due: 15 Oct"}
                          </span>
                        </div>

                        <div>
                          <h5 className="text-xs font-bold text-slate-900">
                            {item.project_name}
                          </h5>
                          <p className="mt-1 text-[11px] text-slate-500 font-medium">
                            {item.issue}
                          </p>
                        </div>

                        {/* Prescribed Action Box */}
                        <div className="rounded-lg bg-primary-50/70 border border-primary-100 p-2.5 text-[11px] text-primary-900 leading-normal">
                          <strong>Directive:</strong> {item.action}
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px]">
                          <span className="text-slate-500">
                            Owner: <strong className="text-slate-700">{item.owner || "NPG Lead"}</strong>
                          </span>

                          {/* Quick Workflow Action Button */}
                          {col.key === "Open" && (
                            <button
                              onClick={() => updateStatus(item.id, "In Progress")}
                              className="font-bold text-primary-600 hover:text-primary-800"
                            >
                              Assign to NPG →
                            </button>
                          )}
                          {col.key === "In Progress" && (
                            <button
                              onClick={() => updateStatus(item.id, "Completed")}
                              className="font-bold text-emerald-600 hover:text-emerald-800"
                            >
                              Mark Cleared ✓
                            </button>
                          )}
                          {col.key === "Completed" && (
                            <span className="font-bold text-emerald-700 flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" /> Resolved
                            </span>
                          )}
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST TABLE VIEW */
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Project Title</th>
                  <th className="px-5 py-3 font-semibold">Bottleneck Type</th>
                  <th className="px-5 py-3 font-semibold">Identified Constraint</th>
                  <th className="px-5 py-3 font-semibold">Mandated Directive</th>
                  <th className="px-5 py-3 font-semibold">Assigned Owner</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold text-right">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-5 py-3.5 font-bold text-slate-900">{item.project_name}</td>
                    <td className="px-5 py-3 text-slate-600">{item.bottleneck_category}</td>
                    <td className="px-5 py-3 text-slate-600 max-w-[200px] truncate">{item.issue}</td>
                    <td className="px-5 py-3 font-medium text-primary-900 max-w-[260px] truncate">{item.action}</td>
                    <td className="px-5 py-3 text-slate-600">{item.owner}</td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        item.status === "Completed"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.status === "In Progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-amber-100 text-amber-800"
                      }`}>
                        {item.status || "Open"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      {item.status !== "Completed" ? (
                        <button
                          onClick={() => updateStatus(item.id, "Completed")}
                          className="text-[11px] font-semibold text-primary-600 hover:underline"
                        >
                          Resolve
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-600 font-semibold">Cleared</span>
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