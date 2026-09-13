import { useState } from "react";
import { MapPin, AlertTriangle, ShieldCheck, Activity, Layers, ExternalLink } from "lucide-react";
import Card from "../common/Card";

const REGIONAL_CLUSTERS = [
  {
    region: "Northern Economic Corridor",
    states: "Delhi NCR, UP, Haryana, Punjab",
    projects: 142,
    highRisk: 38,
    delayMonthsAvg: 7.2,
    dominantBottleneck: "MoEFCC Forest Clearance & RoW",
    primaryAgency: "NHAI / Northern Railways",
  },
  {
    region: "Western Freight & Port Corridor",
    states: "Maharashtra, Gujarat, Rajasthan",
    projects: 188,
    highRisk: 44,
    delayMonthsAvg: 8.5,
    dominantBottleneck: "Utility Shifting & Land Cost Variance",
    primaryAgency: "DFCCIL / MoRTH",
  },
  {
    region: "Eastern Mineral Belt",
    states: "Odisha, Jharkhand, West Bengal, Chhattisgarh",
    projects: 96,
    highRisk: 29,
    delayMonthsAvg: 9.1,
    dominantBottleneck: "Environmental Clearances & Local Resistance",
    primaryAgency: "South Eastern Railway / Coal India",
  },
  {
    region: "Southern Transit & Energy Grid",
    states: "Tamil Nadu, Karnataka, Telangana, AP",
    projects: 114,
    highRisk: 22,
    delayMonthsAvg: 4.8,
    dominantBottleneck: "Contractor Liquidity & State Approvals",
    primaryAgency: "NHAI / K-RIDE / RVNL",
  },
];

export default function GeospatialRiskMap() {
  const [selectedCluster, setSelectedCluster] = useState(REGIONAL_CLUSTERS[0]);

  return (
    <Card className="p-5">
      <div className="flex flex-col justify-between gap-2 border-b border-white/[0.06] pb-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Layers size={17} className="text-orange" />
            <h3 className="text-[13.5px] font-bold text-ink">
              PM GatiShakti Geospatial Risk Hotspots
            </h3>
            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10.5px] font-bold text-emerald-400">
              Active GIS Signal
            </span>
          </div>
          <p className="mt-1 text-[11.5px] text-muted">
            Regional infrastructure clusters and administrative delay hotspots mapped across monitored projects.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-[11.5px] text-muted">
          <Activity size={14} className="text-orange" />
          <span>Real-time Corridor Telemetry</span>
        </div>
      </div>

      <div className="mt-4 grid gap-5 lg:grid-cols-12">
        {/* CORRIDOR CARDS SELECTOR */}
        <div className="space-y-2.5 lg:col-span-5">
          {REGIONAL_CLUSTERS.map((cluster) => {
            const isSelected = selectedCluster.region === cluster.region;
            return (
              <div
                key={cluster.region}
                onClick={() => setSelectedCluster(cluster)}
                className={`cursor-pointer rounded-xl border p-3.5 transition-all ${
                  isSelected
                    ? "border-orange/50 bg-orange/10 ring-1 ring-orange/30"
                    : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.05]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin size={15} className={isSelected ? "text-orange" : "text-muted"} />
                    <h4 className="text-[12.5px] font-bold text-ink">{cluster.region}</h4>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      cluster.highRisk > 35
                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {cluster.highRisk} Critical
                  </span>
                </div>
                <p className="mt-1.5 truncate text-[11px] text-muted">{cluster.states}</p>
                <div className="mt-2.5 flex items-center justify-between border-t border-white/[0.06] pt-2 text-[11px] text-muted">
                  <span>{cluster.projects} Total Projects</span>
                  <span className="font-bold text-ink">
                    Avg Delay: +{cluster.delayMonthsAvg} Mo
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* DETAILED REGIONAL INTELLIGENCE PANEL */}
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div>
                <p className="text-[10.5px] font-bold uppercase tracking-widest text-orange">Corridor Intelligence</p>
                <h4 className="text-[14.5px] font-bold text-ink">{selectedCluster.region}</h4>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-semibold text-muted">Covered States:</span>
                <p className="text-[11.5px] text-ink font-medium">{selectedCluster.states}</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                <p className="text-[10.5px] font-bold uppercase tracking-widest text-muted">Monitored</p>
                <p className="mt-1 text-xl font-extrabold text-ink tabular-nums">{selectedCluster.projects}</p>
              </div>

              <div className="rounded-xl border border-red-500/20 bg-red-500/[0.06] p-3 text-center">
                <p className="text-[10.5px] font-bold uppercase tracking-widest text-red-400">High Risk</p>
                <p className="mt-1 text-xl font-extrabold text-red-400 tabular-nums">{selectedCluster.highRisk}</p>
              </div>

              <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-3 text-center">
                <p className="text-[10.5px] font-bold uppercase tracking-widest text-amber-400">Avg Slippage</p>
                <p className="mt-1 text-xl font-extrabold text-amber-400 tabular-nums">+{selectedCluster.delayMonthsAvg} Mo</p>
              </div>
            </div>

            <div className="mt-4 space-y-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-[12.5px]">
              <div className="flex justify-between">
                <span className="text-muted">Primary Bottleneck:</span>
                <span className="font-bold text-red-400 text-right">{selectedCluster.dominantBottleneck}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Nodal Agency:</span>
                <span className="font-bold text-ink">{selectedCluster.primaryAgency}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[12px]">
            <span className="text-muted">PM GatiShakti GIS Layer Data</span>
            <span className="font-semibold text-orange flex items-center gap-1 cursor-pointer hover:underline">
              Inspect Layer GIS Map <ExternalLink size={13} />
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
