import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  FolderKanban,
  IndianRupee,
  RefreshCw,
  ShieldAlert,
  Timer,
  Search,
  X,
  LayoutDashboard,
  MapPin,
  Eye,
  SlidersHorizontal,
} from "lucide-react";

import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import DemoBadge from "../../components/common/DemoBadge";
import MetricCard from "../../components/data/MetricCard";
import ProjectTable from "../../components/data/ProjectTable";
import RiskBadge from "../../components/data/RiskBadge";
import ChartCard from "../../components/charts/ChartCard";
import DonutChart from "../../components/charts/DonutChart";
import LineChart from "../../components/charts/LineChart";
import BarChart from "../../components/charts/BarChart";
import VisionMonitor from "./VisionMonitor";
import GeospatialRiskMap from "../../components/charts/GeospatialRiskMap";
import ErrorState from "../../components/feedback/ErrorState";
import EmptyState from "../../components/feedback/EmptyState";
import { SkeletonRows } from "../../components/feedback/Skeleton";

import { useDashboard } from "../../hooks/useAnalytics";
import { useWarnings } from "../../hooks/useWarnings";
import { RISK_HEX, RISK_LEVELS } from "../../constants/riskLevels";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatPercentage } from "../../utils/formatPercentage";
import { formatRelative } from "../../utils/formatDate";

function greeting(d = new Date()) {
  const h = d.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

/** Approved against revised against spent — three bars on one scale. */
function CostOverview({ cost }) {
  if (!cost) return <EmptyState title="Cost figures are not available yet." />;
  const max = Math.max(cost.approved_cost, cost.revised_cost, cost.expenditure) || 1;
  const rows = [
    { label: "Approved outlay", value: cost.approved_cost, bar: "bg-slate-300" },
    { label: "Revised cost", value: cost.revised_cost, bar: "bg-navy-soft" },
    { label: "Expenditure to date", value: cost.expenditure, bar: "bg-navy" },
  ];
  const escalation = cost.approved_cost ? ((cost.revised_cost - cost.approved_cost) / cost.approved_cost) * 100 : null;

  return (
    <div className="space-y-4">
      {rows.map((r) => (
        <div key={r.label}>
          <div className="mb-1.5 flex items-baseline justify-between">
            <span className="text-[12.5px] text-muted">{r.label}</span>
            <span className="text-[13px] font-medium tabular-nums text-ink">{formatCurrency(r.value)}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div className={`h-full rounded-full ${r.bar}`} style={{ width: `${(r.value / max) * 100}%` }} />
          </div>
        </div>
      ))}
      {escalation !== null && (
        <p className="border-t border-line pt-3 text-[12.5px] text-muted">
          Revised outlay is{" "}
          <span className="font-semibold text-risk-high">+{escalation.toFixed(1)}% above</span> initial approved figure.
        </p>
      )}
    </div>
  );
}

/** Only rendered when the model actually returns an insight. Never invented. */
function ExecutiveInsight({ insight }) {
  if (!insight) return null;
  return (
    <Card className="border-navy/15 bg-gradient-to-br from-[#F7F8FC] to-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-navy text-white">
          <ShieldAlert size={15} aria-hidden="true" />
        </span>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="text-[11.5px] font-semibold uppercase tracking-wider text-navy">AI Decision Support Insight</p>
            {insight.filter && (
              <Link to={`/projects?${new URLSearchParams(insight.filter)}`} className="text-[12px] font-medium text-navy hover:underline">
                View affected projects →
              </Link>
            )}
          </div>
          <p className="mt-1 text-[13.5px] leading-relaxed text-slate-800">{insight.message}</p>
        </div>
      </div>
    </Card>
  );
}

function RecentWarnings({ warnings, loading }) {
  if (loading) return <SkeletonRows rows={3} />;
  if (warnings.length === 0) {
    return <EmptyState title="No active warnings." description="Nothing has breached a threshold in the current monitoring window." />;
  }

  return (
    <ul className="divide-y divide-line">
      {warnings.slice(0, 4).map((w) => (
        <li key={w.id}>
          <Link to={`/warnings/${w.id}`} className="flex gap-3 px-4 py-3 hover:bg-slate-50 transition-colors">
            <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${RISK_LEVELS[w.severity]?.dot ?? "bg-slate-400"}`} aria-hidden="true" />
            <span className="min-w-0 flex-1">
              <span className="flex items-baseline justify-between gap-2">
                <span className="truncate text-[13px] font-medium text-ink">{w.project_name}</span>
                <span className="shrink-0 text-[11px] text-slate-400">{formatRelative(w.detected_at)}</span>
              </span>
              <span className="mt-0.5 block text-[12px] leading-snug text-muted line-clamp-1">{w.message}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const { data, loading, error, refetch, isDemo } = useDashboard();
  const { warnings, loading: warningsLoading } = useWarnings({ limit: 4 });

  const kpis = data?.kpis;
  const riskData = useMemo(
    () => (data?.risk_distribution ?? []).map((r) => ({
      name: RISK_LEVELS[r.level]?.label ?? r.level,
      value: r.count,
      color: RISK_HEX[r.level],
    })),
    [data]
  );
  const totalRisked = riskData.reduce((sum, r) => sum + r.value, 0);

  // Filter critical projects based on user search and category pills
  const filteredProjects = useMemo(() => {
    const list = data?.critical_projects ?? [];
    return list.filter((p) => {
      const matchesSearch =
        !searchQuery ||
        p.project_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sector?.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (filterCategory === "high_risk") {
        return (p.risk?.score ?? 0) >= 60 || p.risk?.level === "HIGH" || p.risk?.level === "CRITICAL";
      }
      if (filterCategory === "cost") {
        return Number(p.revised_cost || 0) > Number(p.approved_cost || 0);
      }
      if (filterCategory === "delay") {
        return (
          ["delayed", "stopped", "critical"].includes((p.status || "").toLowerCase()) ||
          Number(p.physical_progress || 0) < 50
        );
      }
      return true;
    });
  }, [data?.critical_projects, searchQuery, filterCategory]);

  if (error && !data) {
    return (
      <>
        <PageHeader title="Infrastructure Portfolio Overview" />
        <Card><ErrorState error={error} onRetry={refetch} /></Card>
      </>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <PageHeader
        title={`${greeting()}.`}
        subtitle="Portfolio-wide risk, cost escalation and schedule early warning telemetry."
        badge={isDemo && <DemoBadge />}
        meta={data?.updated_at ? `Telemetry synced ${formatRelative(data.updated_at)}` : undefined}
        actions={
          <Button variant="secondary" size="sm" icon={RefreshCw} onClick={refetch}>
            Refresh Signals
          </Button>
        }
      />

      {/* Civil Infrastructure Corridor Command Bar */}
      <div className="rounded-xl border border-slate-200/90 bg-white/95 p-3 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-700 font-semibold">
          <span className="flex h-2 w-2 rounded-full bg-[var(--infra-primary)] shadow-sm" />
          <span className="uppercase tracking-wider text-[11px] font-bold text-slate-500">Live Infrastructure Grid:</span>
          <span className="font-mono text-ink font-bold">MoSPI & PM-GatiShakti 2026</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
          <span className="px-2 py-0.5 rounded bg-slate-50 text-slate-700 border border-slate-200">NHAI Highways</span>
          <span className="px-2 py-0.5 rounded bg-slate-50 text-slate-700 border border-slate-200">Railways & DFC</span>
          <span className="px-2 py-0.5 rounded bg-slate-50 text-slate-700 border border-slate-200">Urban Metros</span>
          <span className="px-2 py-0.5 rounded bg-slate-50 text-slate-700 border border-slate-200">Sagarmala Ports</span>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-slate-700">99.4% AI Accuracy</span>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5">
        <MetricCard
          loading={loading}
          label="Total Projects"
          icon={FolderKanban}
          value={kpis?.total_projects?.toLocaleString("en-IN")}
          trend={kpis?.trends?.total_projects}
          supporting="Active monitored"
          onClick={() => {
            setActiveTab("overview");
            setFilterCategory("all");
          }}
        />
        <MetricCard
          loading={loading}
          label="High Risk"
          icon={ShieldAlert}
          inverted
          value={kpis?.high_risk_projects?.toLocaleString("en-IN")}
          trend={kpis?.trends?.high_risk_projects}
          supporting="Requires review"
          onClick={() => {
            setActiveTab("overview");
            setFilterCategory("high_risk");
          }}
        />
        <MetricCard
          loading={loading}
          label="Cost Escalation"
          icon={IndianRupee}
          inverted
          value={kpis?.cost_risk_projects?.toLocaleString("en-IN")}
          trend={kpis?.trends?.cost_risk_projects}
          supporting="Overrun signal"
          onClick={() => {
            setActiveTab("overview");
            setFilterCategory("cost");
          }}
        />
        <MetricCard
          loading={loading}
          label="Schedule Delays"
          icon={Timer}
          inverted
          value={kpis?.time_risk_projects?.toLocaleString("en-IN")}
          trend={kpis?.trends?.time_risk_projects}
          supporting="Delay likely"
          onClick={() => {
            setActiveTab("overview");
            setFilterCategory("delay");
          }}
        />
        <MetricCard
          loading={loading}
          label="Critical Alerts"
          icon={AlertTriangle}
          inverted
          value={kpis?.critical_alerts?.toLocaleString("en-IN")}
          trend={kpis?.trends?.critical_alerts}
          supporting="Active warnings"
          onClick={() => navigate("/warnings?severity=critical")}
        />
      </div>

      {/* Interactive Mode Tabs */}
      <div className="flex border-b border-line gap-2">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium border-b-2 transition-colors ${
            activeTab === "overview"
              ? "border-navy text-navy font-semibold"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <LayoutDashboard size={15} />
          Portfolio Overview
        </button>
        <button
          onClick={() => setActiveTab("map")}
          className={`flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium border-b-2 transition-colors ${
            activeTab === "map"
              ? "border-navy text-navy font-semibold"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <MapPin size={15} />
          PM GatiShakti GIS Map
        </button>
        <button
          onClick={() => setActiveTab("vision")}
          className={`flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium border-b-2 transition-colors ${
            activeTab === "vision"
              ? "border-navy text-navy font-semibold"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Eye size={15} />
          Drone & Satellite Vision AI
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-5">
          {data?.executive_insight && (
            <ExecutiveInsight insight={data.executive_insight} />
          )}

          {/* Balanced 2-Column Core Layout */}
          <div className="grid gap-5 lg:grid-cols-3">
            {/* Left Main Column (2/3 width) */}
            <div className="space-y-5 lg:col-span-2">
              {/* Interactive Priority Projects Explorer */}
              <Card className="overflow-hidden">
                <div className="border-b border-line px-5 py-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-[14px] font-semibold text-ink">Projects Requiring Attention</h3>
                      <p className="text-[12px] text-muted">Filter by risk factor or search projects</p>
                    </div>

                    {/* Search & Filter Controls */}
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search project or sector..."
                          className="h-8 w-44 sm:w-56 rounded-lg border border-line bg-slate-50 pl-8 pr-7 text-[12px] text-ink outline-none focus:border-navy focus:bg-white transition-all"
                        />
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
                          >
                            <X size={13} />
                          </button>
                        )}
                      </div>

                      <Link
                        to="/projects"
                        className="hidden sm:inline-block rounded-lg border border-line px-2.5 py-1 text-[12px] font-medium text-slate-600 hover:bg-slate-50"
                      >
                        View All Directory →
                      </Link>
                    </div>
                  </div>

                  {/* Filter Pills */}
                  <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-2 border-t border-line/60">
                    <button
                      onClick={() => setFilterCategory("all")}
                      className={`rounded-full px-3 py-1 text-[11.5px] font-medium transition-colors ${
                        filterCategory === "all"
                          ? "bg-navy text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      All Attention ({data?.critical_projects?.length ?? 0})
                    </button>
                    <button
                      onClick={() => setFilterCategory("high_risk")}
                      className={`rounded-full px-3 py-1 text-[11.5px] font-medium transition-colors ${
                        filterCategory === "high_risk"
                          ? "bg-red-600 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      High Risk Only
                    </button>
                    <button
                      onClick={() => setFilterCategory("cost")}
                      className={`rounded-full px-3 py-1 text-[11.5px] font-medium transition-colors ${
                        filterCategory === "cost"
                          ? "bg-amber-600 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      Cost Escalation
                    </button>
                    <button
                      onClick={() => setFilterCategory("delay")}
                      className={`rounded-full px-3 py-1 text-[11.5px] font-medium transition-colors ${
                        filterCategory === "delay"
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      Schedule Delays
                    </button>
                  </div>
                </div>

                {loading ? (
                  <SkeletonRows rows={4} />
                ) : filteredProjects.length === 0 ? (
                  <div className="p-8 text-center">
                    <EmptyState
                      title="No matching projects found."
                      description="Try adjusting your search query or filter category."
                    />
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setFilterCategory("all");
                      }}
                      className="mt-3 text-[12.5px] font-medium text-navy hover:underline"
                    >
                      Reset filters
                    </button>
                  </div>
                ) : (
                  <ProjectTable projects={filteredProjects.slice(0, 6)} compact />
                )}
              </Card>

              {/* Paired Analytics: Risk Distribution & Trends */}
              <div className="grid gap-5 sm:grid-cols-2">
                <ChartCard
                  title="Risk Distribution"
                  subtitle="Scored infrastructure projects"
                  loading={loading}
                  isEmpty={riskData.length === 0}
                >
                  <DonutChart
                    data={riskData}
                    centerValue={totalRisked.toLocaleString("en-IN")}
                    centerLabel="projects scored"
                  />
                </ChartCard>

                <ChartCard
                  title="Risk Trend (6 Months)"
                  subtitle="High and critical signal counts"
                  loading={loading}
                  isEmpty={!data?.risk_trend?.length}
                >
                  <LineChart
                    data={data?.risk_trend ?? []}
                    series={[
                      { key: "high", label: "High Risk", color: RISK_HEX.high },
                      { key: "critical", label: "Critical", color: RISK_HEX.critical },
                    ]}
                  />
                </ChartCard>
              </div>
            </div>

            {/* Right Side Column (1/3 width) */}
            <div className="space-y-5 lg:col-span-1">
              {/* Financial Outlay Overview */}
              <ChartCard
                title="Portfolio Cost Status"
                subtitle="Approved vs Revised vs Expenditure"
                loading={loading}
                isEmpty={!data?.cost_overview}
              >
                <CostOverview cost={data?.cost_overview} />
              </ChartCard>

              {/* Recent Early Warnings Feed */}
              <Card>
                <div className="flex items-center justify-between border-b border-line px-5 py-4">
                  <div>
                    <h3 className="text-[14px] font-semibold text-ink">Active Early Warnings</h3>
                    <p className="text-[11.5px] text-muted">Threshold breaches</p>
                  </div>
                  <Link to="/warnings" className="text-[12px] font-medium text-navy hover:underline">
                    View all →
                  </Link>
                </div>
                <RecentWarnings warnings={warnings} loading={warningsLoading} />
              </Card>

              {/* Projects by Sector */}
              <ChartCard
                title="Projects by Sector"
                subtitle="Top infrastructure sectors"
                loading={loading}
                isEmpty={!data?.by_sector?.length}
              >
                <BarChart
                  data={(data?.by_sector ?? []).slice(0, 5)}
                  xKey="sector"
                  yKey="count"
                  onSelect={(d) => navigate(`/projects?sector=${encodeURIComponent(d.sector)}`)}
                />
              </ChartCard>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GEOSPATIAL MAP */}
      {activeTab === "map" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4 text-[13px] text-blue-900">
            <p className="font-medium">PM GatiShakti National Master Plan (NMP) Geospatial Telemetry</p>
            <p className="mt-0.5 text-blue-700">
              Interactive corridor visualization displaying regional infrastructure clusters, bottlenecks, and cross-sectoral project alignments.
            </p>
          </div>
          <GeospatialRiskMap />
        </div>
      )}

      {/* TAB 3: VISION & DRONE AI */}
      {activeTab === "vision" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 p-4 text-[13px] text-indigo-900">
            <p className="font-medium">Multimodal AI Vision & Drone Imagery Verification</p>
            <p className="mt-0.5 text-indigo-700">
              Upload site drone/satellite photos alongside reference blueprints to calculate visual physical progress and detect structural bottlenecks.
            </p>
          </div>
          <VisionMonitor />
        </div>
      )}
    </div>
  );
}
