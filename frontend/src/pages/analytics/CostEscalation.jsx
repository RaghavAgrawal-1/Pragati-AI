import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp, AlertTriangle, Sliders, DollarSign, Search, Filter,
  ArrowRight, Layers, Sparkles, PieChart, BarChart3, Percent,
} from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/common/Card";
import { api } from "../../services/apiClient";

export default function CostEscalation() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [driverFilter, setDriverFilter] = useState("ALL");

  // Commodity Sensitivity Simulation State
  const [steelPriceVar, setSteelPriceVar] = useState(12); // %
  const [cementPriceVar, setCementPriceVar] = useState(8); // %
  const [bitumenPriceVar, setBitumenPriceVar] = useState(15); // %

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await api.get("/api/projects", { params: { skip: 0, limit: 12 } });
        setProjects(Array.isArray(data) ? data : data.items ?? []);
      } catch (error) {
        console.error("Cost escalation error:", error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  const costStats = useMemo(() => {
    let totalApproved = 0;
    let totalRevised = 0;
    let criticalEscCount = 0;

    projects.forEach((p) => {
      const app = Number(p.approved_cost ?? 0);
      const rev = Number(p.revised_cost ?? app);
      totalApproved += app;
      totalRevised += rev;
      if (app > 0 && ((rev - app) / app) * 100 > 20) {
        criticalEscCount++;
      }
    });

    const netEscalationCr = Math.max(0, totalRevised - totalApproved);
    const avgEscPct = totalApproved > 0 ? (netEscalationCr / totalApproved) * 100 : 0;

    return {
      totalApproved,
      totalRevised,
      netEscalationCr,
      avgEscPct,
      criticalEscCount,
    };
  }, [projects]);

  // Real-time Commodity Stress Impact Calculation
  const simulatedCommodityImpact = useMemo(() => {
    const totalCap = costStats.totalRevised || 100000;
    const steelImpact = Math.round(totalCap * 0.22 * (steelPriceVar / 100));
    const cementImpact = Math.round(totalCap * 0.16 * (cementPriceVar / 100));
    const bitumenImpact = Math.round(totalCap * 0.12 * (bitumenPriceVar / 100));
    const totalAdditionalCr = steelImpact + cementImpact + bitumenImpact;

    return {
      steelImpact,
      cementImpact,
      bitumenImpact,
      totalAdditionalCr,
    };
  }, [costStats, steelPriceVar, cementPriceVar, bitumenPriceVar]);

  // Categorize projects by escalation driver
  const enrichedEscalations = useMemo(() => {
    return projects.map((p) => {
      const approved = Number(p.approved_cost ?? 0);
      const revised = Number(p.revised_cost ?? approved);
      const varianceCr = Math.max(0, revised - approved);
      const variancePct = approved > 0 ? (varianceCr / approved) * 100 : 0;

      let primaryDriver = "Raw Material Inflation (Steel/Cement)";
      if (p.sector === "Highways" || p.sector === "Urban") {
        primaryDriver = "Land Acquisition & Utility Shifting";
      } else if (p.sector === "Railways") {
        primaryDriver = "Scope Change & Alignment Re-engineering";
      } else if (p.sector === "Power") {
        primaryDriver = "Equipment Import Tariffs & Forex";
      }

      return {
        ...p,
        approved,
        revised,
        varianceCr,
        variancePct,
        primaryDriver,
        isSevere: variancePct > 20,
      };
    });
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return enrichedEscalations.filter((p) => {
      if (driverFilter === "SEVERE" && !p.isSevere) return false;
      if (driverFilter === "MODERATE" && (p.variancePct <= 5 || p.variancePct > 20)) return false;
      if (driverFilter === "LAND" && !p.primaryDriver.includes("Land")) return false;
      if (driverFilter === "RAW_MAT" && !p.primaryDriver.includes("Material")) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.project_name?.toLowerCase().includes(q) ||
          p.sector?.toLowerCase().includes(q) ||
          p.primaryDriver.toLowerCase().includes(q)
        );
      }
      return true;
    }).sort((a, b) => b.variancePct - a.variancePct);
  }, [enrichedEscalations, driverFilter, searchQuery]);

  return (
    <div className="space-y-6 animate-slideUp">
      <PageHeader
        title="Capital Outlay Variance & Cost Escalation Analytics"
        subtitle="Granular breakdown of budget overruns, price variation clauses (PVC), and commodity inflation sensitivity."
      />

      {/* TOP MACRO SUMMARY CARDS */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        <div className="rounded-2xl border-l-4 border-l-orange border border-white/[0.06] bg-surface-card p-4">
          <p className="text-[10.5px] font-bold uppercase tracking-widest text-orange">Approved Outlay</p>
          <p className="mt-1.5 text-[24px] font-extrabold tabular-nums text-ink">
            ₹{Math.round(costStats.totalApproved).toLocaleString("en-IN")} Cr
          </p>
          <p className="mt-1 text-[11px] text-muted">Original DPR baseline</p>
        </div>

        <div className="rounded-2xl border-l-4 border-l-red-500 border border-white/[0.06] bg-surface-card p-4">
          <p className="text-[10.5px] font-bold uppercase tracking-widest text-red-400">Net Escalation</p>
          <p className="mt-1.5 text-[24px] font-extrabold tabular-nums text-red-400">
            +₹{Math.round(costStats.netEscalationCr).toLocaleString("en-IN")} Cr
          </p>
          <p className="mt-1 text-[11px] text-muted">Total cost overrun across portfolio</p>
        </div>

        <div className="rounded-2xl border-l-4 border-l-amber-500 border border-white/[0.06] bg-surface-card p-4">
          <p className="text-[10.5px] font-bold uppercase tracking-widest text-amber-400">Mean Variance Rate</p>
          <p className="mt-1.5 text-[24px] font-extrabold tabular-nums text-amber-400">
            +{costStats.avgEscPct.toFixed(1)}%
          </p>
          <p className="mt-1 text-[11px] text-muted">Average capital slippage</p>
        </div>

        <div className="rounded-2xl border-l-4 border-l-purple-500 border border-white/[0.06] bg-surface-card p-4">
          <p className="text-[10.5px] font-bold uppercase tracking-widest text-purple-400">Critical Overrun (&gt;20%)</p>
          <p className="mt-1.5 text-[24px] font-extrabold tabular-nums text-purple-400">
            {costStats.criticalEscCount} Projects
          </p>
          <p className="mt-1 text-[11px] text-muted">Require MoF/CCEA re-sanction</p>
        </div>
      </div>

      {/* COMMODITY SENSITIVITY STRESS TEST SECTION */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Sliders Card */}
        <Card className="p-5 lg:col-span-7 space-y-4">
          <div className="border-b border-white/[0.06] pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
                <Sliders size={16} />
              </div>
              <div>
                <h3 className="text-[13.5px] font-semibold text-ink">Commodity Inflation Sensitivity Simulator</h3>
                <p className="text-[11px] text-muted">Simulate raw material market shocks on active EPC contracts</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-1">
            <div>
              <div className="flex items-center justify-between text-[12px] font-medium mb-1">
                <span className="text-muted">Structural Steel & TMT Rebar Index</span>
                <span className="font-bold text-amber-400">+{steelPriceVar}% Inflation</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={steelPriceVar}
                onChange={(e) => setSteelPriceVar(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/[0.08] accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-muted mt-1 font-mono">
                <span>Stable (0%)</span>
                <span>Moderate (+20%)</span>
                <span>Severe Shock (+40%)</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-[12px] font-medium mb-1">
                <span className="text-muted">Grade 53 OPC Cement & Clinker Index</span>
                <span className="font-bold text-blue-400">+{cementPriceVar}% Inflation</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                value={cementPriceVar}
                onChange={(e) => setCementPriceVar(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/[0.08] accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-muted mt-1 font-mono">
                <span>Stable (0%)</span>
                <span>Normal (+15%)</span>
                <span>High (+30%)</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-[12px] font-medium mb-1">
                <span className="text-muted">Bitumen VG-30 & Quarry Aggregates</span>
                <span className="font-bold text-purple-400">+{bitumenPriceVar}% Inflation</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={bitumenPriceVar}
                onChange={(e) => setBitumenPriceVar(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/[0.08] accent-purple-500"
              />
              <div className="flex justify-between text-[10px] text-muted mt-1 font-mono">
                <span>Stable (0%)</span>
                <span>Normal (+20%)</span>
                <span>High (+40%)</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Projected Impact Output */}
        <Card className="p-5 lg:col-span-5 flex flex-col justify-between space-y-3 border-amber-500/20 bg-amber-500/[0.04]">
          <div>
            <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[10.5px] font-bold text-amber-400">
              SIMULATED FISCAL EXPOSURE
            </span>
            <p className="mt-2.5 text-[11px] text-muted font-bold uppercase tracking-wider">
              Projected Additional Capital Outlay
            </p>
            <p className="mt-1 text-3xl font-extrabold text-ink tabular-nums">
              +₹{simulatedCommodityImpact.totalAdditionalCr.toLocaleString("en-IN")} Cr
            </p>
            <p className="mt-1 text-[11.5px] text-muted leading-relaxed">
              Based on EPC standard bill of quantities (BoQ) material weightage across active projects.
            </p>

            <div className="mt-4 space-y-2 border-t border-white/[0.06] pt-3">
              <div className="flex justify-between text-[12px]">
                <span className="text-muted">Steel Price Exposure:</span>
                <strong className="text-ink font-mono">+₹{simulatedCommodityImpact.steelImpact.toLocaleString("en-IN")} Cr</strong>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-muted">Cement Price Exposure:</span>
                <strong className="text-ink font-mono">+₹{simulatedCommodityImpact.cementImpact.toLocaleString("en-IN")} Cr</strong>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-muted">Bitumen & Aggregates:</span>
                <strong className="text-ink font-mono">+₹{simulatedCommodityImpact.bitumenImpact.toLocaleString("en-IN")} Cr</strong>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 text-[11.5px] text-muted flex items-center gap-2">
            <Sparkles size={16} className="text-orange shrink-0" />
            Auto-calculated via standard Price Variation Formula (PVC) clauses.
          </div>
        </Card>
      </div>

      {/* FILTER & SEARCH BAR */}
      <Card className="p-3.5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search by project, sector, or overrun driver..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.05] pl-9 pr-4 py-2 text-[12.5px] text-ink placeholder:text-muted outline-none focus:border-orange/50 transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10.5px] font-bold uppercase tracking-widest text-muted mr-1 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Driver:
            </span>
            {[
              { label: "All Escalations",  key: "ALL" },
              { label: "Critical (>20%)",   key: "SEVERE" },
              { label: "Moderate (5-20%)", key: "MODERATE" },
              { label: "Land & RoW",       key: "LAND" },
              { label: "Raw Materials",    key: "RAW_MAT" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setDriverFilter(tab.key)}
                className={`rounded-full px-3 py-1 text-[11.5px] font-semibold transition-colors ${
                  driverFilter === tab.key
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

      {/* COST ESCALATION LEDGER TABLE */}
      <Card className="overflow-hidden">
        <div className="border-b border-white/[0.06] bg-white/[0.02] px-5 py-3.5 flex items-center justify-between">
          <h3 className="text-[12px] font-bold uppercase tracking-wider text-ink">
            Cost Escalation & Overrun Ledger <span className="ml-2 text-orange">({filteredProjects.length} Corridors Tracked)</span>
          </h3>
          <span className="text-[11px] text-muted font-medium">Sorted by Percentage Cost Overrun</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-muted">Loading cost escalation data…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-white/[0.06] bg-white/[0.02] text-[10.5px] uppercase tracking-widest text-muted">
                <tr>
                  <th className="px-5 py-3 font-bold">Project Name</th>
                  <th className="px-5 py-3 font-bold">Sector</th>
                  <th className="px-5 py-3 font-bold">Approved Cost</th>
                  <th className="px-5 py-3 font-bold">Revised Cost</th>
                  <th className="px-5 py-3 font-bold font-mono">Net Overrun</th>
                  <th className="px-5 py-3 font-bold">Variance %</th>
                  <th className="px-5 py-3 font-bold">Primary Driver</th>
                  <th className="px-5 py-3 text-right font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredProjects.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-5 py-3.5">
                      <Link to={`/projects/${item.id}`} className="font-semibold text-ink hover:text-orange transition-colors text-[13px] block">
                        {item.project_name || item.name || "Unnamed Project"}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-muted text-[12px]">{item.sector || "Infrastructure"}</td>
                    <td className="px-5 py-3 text-muted text-[12px] font-mono">
                      ₹{item.approved.toLocaleString("en-IN")} Cr
                    </td>
                    <td className="px-5 py-3 font-bold text-ink text-[12px] font-mono">
                      ₹{item.revised.toLocaleString("en-IN")} Cr
                    </td>
                    <td className="px-5 py-3 font-bold text-red-400 text-[12px] font-mono">
                      +₹{item.varianceCr.toLocaleString("en-IN")} Cr
                    </td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10.5px] font-bold ${
                        item.variancePct > 20
                          ? "bg-red-500/10 text-red-400 border border-red-500/20"
                          : item.variancePct > 5
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      }`}>
                        +{item.variancePct.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-5 py-3 text-muted text-[12px] max-w-[200px] truncate">
                      {item.primaryDriver}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link to={`/projects/${item.id}`} className="inline-flex items-center gap-1 text-[12px] font-semibold text-orange hover:text-orange-light transition-colors">
                        Details <ArrowRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}

                {!loading && filteredProjects.length === 0 && (
                  <tr>
                    <td colSpan="8" className="px-5 py-10 text-center text-sm text-muted">
                      No cost escalation records matching your filter.
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