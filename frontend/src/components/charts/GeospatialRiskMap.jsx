import { useState } from "react";
import { MapPin, ShieldAlert, Layers, Activity } from "lucide-react";
import Card from "../common/Card";

const REGIONAL_CLUSTERS = [
  {
    region: "Northern Corridor",
    states: "Delhi, UP, Haryana, Punjab",
    projects: 142,
    highRisk: 48,
    delayMonthsAvg: 6.4,
    primaryBottleneck: "Right of Way & Land Acquisition (RFCTLARR)",
    gatiShaktiLayer: "Multimodal Logistics Parks & Rail Hubs",
    hotspots: ["Delhi-Varanasi HSR", "Eastern DFC (Dadri)", "Delhi-Mumbai Expressway Pkg 1-4"],
  },
  {
    region: "Western Corridor",
    states: "Maharashtra, Gujarat, Rajasthan",
    projects: 118,
    highRisk: 39,
    delayMonthsAvg: 5.1,
    primaryBottleneck: "Utility Shifting & Coastal Zone Approvals",
    gatiShaktiLayer: "Port Connectivity & Industrial Corridors",
    hotspots: ["Mumbai-Ahmedabad Bullet Train", "JNPT Connectivity Rail", "Coastal Road Pkg 2"],
  },
  {
    region: "Southern Corridor",
    states: "Karnataka, Tamil Nadu, Andhra Pradesh, Telangana",
    projects: 96,
    highRisk: 22,
    delayMonthsAvg: 3.8,
    primaryBottleneck: "Forest Land Diversion (Stage-II MoEFCC)",
    gatiShaktiLayer: "Renewable Energy Green Corridors",
    hotspots: ["Bengaluru Suburban Rail", "Chennai-Bengaluru Expressway", "Kalyandurg Line"],
  },
  {
    region: "Eastern Corridor",
    states: "West Bengal, Odisha, Jharkhand, Bihar",
    projects: 84,
    highRisk: 36,
    delayMonthsAvg: 7.2,
    primaryBottleneck: "Coal Evacuation & Mining Zone RoW",
    gatiShaktiLayer: "Inland Waterways & Heavy Freight Rail",
    hotspots: ["Khurda Road-Bolangir Line", "Paradip Port Expansion", "Ganga Waterway NW-1"],
  },
  {
    region: "Central & North-East",
    states: "Madhya Pradesh, Chhattisgarh, Assam, Arunachal",
    projects: 60,
    highRisk: 28,
    delayMonthsAvg: 8.5,
    primaryBottleneck: "Ecological Clearances & Geological Surprises",
    gatiShaktiLayer: "Border Roads (BRO) & Hydropower Transmission",
    hotspots: ["Sivok-Rangpo Rail Project", "Subansiri Hydroelectric", "Dibrugarh Bypass"],
  },
];

export default function GeospatialRiskMap() {
  const [selectedCluster, setSelectedCluster] = useState(REGIONAL_CLUSTERS[0]);

  return (
    <Card className="p-5">
      <div className="flex flex-col justify-between gap-2 border-b border-slate-100 pb-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Layers size={17} className="text-navy" />
            <h3 className="text-sm font-semibold text-slate-900">
              PM GatiShakti Geospatial Risk Hotspots
            </h3>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10.5px] font-medium text-emerald-700">
              Active GIS Signal
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Regional infrastructure clusters and administrative delay hotspots mapped across 500 monitored projects.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Activity size={14} className="text-orange-500" />
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
                    ? "border-navy bg-navy/5 shadow-sm ring-1 ring-navy/20"
                    : "border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin size={15} className={isSelected ? "text-navy" : "text-slate-400"} />
                    <h4 className="text-xs font-semibold text-slate-800">{cluster.region}</h4>
                  </div>
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                      cluster.highRisk > 35
                        ? "bg-red-50 text-red-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {cluster.highRisk} Critical
                  </span>
                </div>
                <p className="mt-1.5 truncate text-[11px] text-slate-500">{cluster.states}</p>
                <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-600">
                  <span>{cluster.projects} Total Projects</span>
                  <span className="font-semibold text-slate-900">
                    Avg Delay: +{cluster.delayMonthsAvg} Mo
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* DETAILED REGIONAL INTELLIGENCE PANEL */}
        <div className="rounded-xl border border-slate-200/90 bg-slate-50/70 p-5 lg:col-span-7">
          <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-500">Corridor Intelligence</p>
              <h4 className="text-sm font-bold text-slate-900">{selectedCluster.region}</h4>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-slate-700">Covered States:</span>
              <p className="text-xs text-slate-500">{selectedCluster.states}</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-white p-3 shadow-xs">
              <p className="text-[11px] text-slate-500">Total Projects</p>
              <p className="mt-1 text-lg font-bold text-slate-900">{selectedCluster.projects}</p>
            </div>
            <div className="rounded-lg bg-white p-3 shadow-xs">
              <p className="text-[11px] text-slate-500">High Risk Count</p>
              <p className="mt-1 text-lg font-bold text-red-600">{selectedCluster.highRisk}</p>
            </div>
            <div className="rounded-lg bg-white p-3 shadow-xs">
              <p className="text-[11px] text-slate-500">Avg Schedule Delay</p>
              <p className="mt-1 text-lg font-bold text-orange-600">+{selectedCluster.delayMonthsAvg} Mo</p>
            </div>
          </div>

          {/* BOTTLENECK & GATISHAKTI LAYER */}
          <div className="mt-4 space-y-3">
            <div className="rounded-lg border border-amber-200/70 bg-amber-50/60 p-3">
              <div className="flex items-center gap-2 text-amber-800">
                <ShieldAlert size={15} />
                <span className="text-xs font-semibold">Primary Administrative Bottleneck:</span>
              </div>
              <p className="mt-1 text-xs text-amber-900">{selectedCluster.primaryBottleneck}</p>
            </div>

            <div className="rounded-lg border border-blue-200/70 bg-blue-50/60 p-3">
              <div className="flex items-center gap-2 text-blue-800">
                <Layers size={15} />
                <span className="text-xs font-semibold">Associated PM GatiShakti Layer:</span>
              </div>
              <p className="mt-1 text-xs text-blue-900">{selectedCluster.gatiShaktiLayer}</p>
            </div>
          </div>

          {/* KEY PROJECT HOTSPOTS */}
          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-700">Monitored Critical Hotspots in this Corridor:</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedCluster.hotspots.map((spot) => (
                <span
                  key={spot}
                  className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 shadow-2xs"
                >
                  📍 {spot}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
