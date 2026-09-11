import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertTriangle, FolderKanban, IndianRupee, RefreshCw, ShieldAlert, Timer } from "lucide-react";

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
          <span className="font-medium text-risk-high">{escalation.toFixed(1)}% above</span> the approved figure across the portfolio.
        </p>
      )}
    </div>
  );
}

/** Only rendered when the model actually returns an insight. Never invented. */
function ExecutiveInsight({ insight }) {
  if (!insight) return null;
  return (
    <Card className="border-navy/15 bg-gradient-to-br from-[#F7F8FC] to-white p-5">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-navy text-white">
          <ShieldAlert size={15} aria-hidden="true" />
        </span>
        <div>
          <p className="text-[12px] font-medium uppercase tracking-wide text-muted">AI executive insight</p>
          <p className="mt-1.5 text-[14px] leading-relaxed text-ink">{insight.message}</p>
          {insight.filter && (
            <Link to={`/projects?${new URLSearchParams(insight.filter)}`} className="mt-3 inline-block text-[12.5px] font-medium text-navy hover:underline">
              View affected projects
            </Link>
          )}
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
          <Link to={`/warnings/${w.id}`} className="flex gap-3 px-5 py-3.5 hover:bg-slate-50">
            <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${RISK_LEVELS[w.severity]?.dot ?? "bg-slate-400"}`} aria-hidden="true" />
            <span className="min-w-0 flex-1">
              <span className="flex items-baseline justify-between gap-3">
                <span className="truncate text-[13px] font-medium text-ink">{w.project_name}</span>
                <span className="shrink-0 text-[11px] text-slate-400">{formatRelative(w.detected_at)}</span>
              </span>
              <span className="mt-0.5 block text-[12.5px] leading-snug text-muted">{w.message}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
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

  if (error && !data) {
    return (
      <>
        <PageHeader title="Infrastructure Portfolio Overview" />
        <Card><ErrorState error={error} onRetry={refetch} /></Card>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={`${greeting()}.`}
        subtitle="Portfolio-wide risk, cost and schedule signal across every monitored project."
        badge={isDemo && <DemoBadge />}
        meta={data?.updated_at ? `Last updated ${formatRelative(data.updated_at)}` : undefined}
        actions={<Button variant="secondary" size="sm" icon={RefreshCw} onClick={refetch}>Refresh</Button>}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <MetricCard
          loading={loading} label="Total projects" icon={FolderKanban}
          value={kpis?.total_projects?.toLocaleString("en-IN")}
          trend={kpis?.trends?.total_projects} supporting="monitored"
          onClick={() => navigate("/projects")}
        />
        <MetricCard
          loading={loading} label="High risk" icon={ShieldAlert} inverted
          value={kpis?.high_risk_projects?.toLocaleString("en-IN")}
          trend={kpis?.trends?.high_risk_projects} supporting="need review"
          onClick={() => navigate("/projects?risk=high")}
        />
        <MetricCard
          loading={loading} label="Cost risk" icon={IndianRupee} inverted
          value={kpis?.cost_risk_projects?.toLocaleString("en-IN")}
          trend={kpis?.trends?.cost_risk_projects} supporting="overrun likely"
          onClick={() => navigate("/predictions/cost")}
        />
        <MetricCard
          loading={loading} label="Time risk" icon={Timer} inverted
          value={kpis?.time_risk_projects?.toLocaleString("en-IN")}
          trend={kpis?.trends?.time_risk_projects} supporting="delay likely"
          onClick={() => navigate("/predictions/time")}
        />
        <MetricCard
          loading={loading} label="Critical alerts" icon={AlertTriangle} inverted
          value={kpis?.critical_alerts?.toLocaleString("en-IN")}
          trend={kpis?.trends?.critical_alerts} supporting="unresolved"
          onClick={() => navigate("/warnings?severity=critical")}
        />
      </div>

      {data?.executive_insight && (
        <div className="mt-4"><ExecutiveInsight insight={data.executive_insight} /></div>
      )}

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <ChartCard title="Risk distribution" subtitle="Projects by current risk level" loading={loading} isEmpty={riskData.length === 0}>
          <DonutChart data={riskData} centerValue={totalRisked.toLocaleString("en-IN")} centerLabel="projects scored" />
        </ChartCard>

        <ChartCard title="Risk trend" subtitle="High and critical counts by month" loading={loading} isEmpty={!data?.risk_trend?.length} className="lg:col-span-2">
          <LineChart
            data={data?.risk_trend ?? []}
            series={[
              { key: "high", label: "High", color: RISK_HEX.high },
              { key: "critical", label: "Critical", color: RISK_HEX.critical },
            ]}
          />
        </ChartCard>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <ChartCard title="Projects by sector" loading={loading} isEmpty={!data?.by_sector?.length}>
          <BarChart data={data?.by_sector ?? []} xKey="sector" yKey="count" onSelect={(d) => navigate(`/projects?sector=${encodeURIComponent(d.sector)}`)} />
        </ChartCard>

        <ChartCard title="Projects by ministry" loading={loading} isEmpty={!data?.by_ministry?.length}>
          <BarChart data={data?.by_ministry ?? []} xKey="ministry" yKey="count" color="#5C6B9E" onSelect={(d) => navigate(`/projects?ministry=${encodeURIComponent(d.ministry)}`)} />
        </ChartCard>

        <ChartCard title="Portfolio cost" subtitle="Approved against revised and spent" loading={loading} isEmpty={!data?.cost_overview}>
          <CostOverview cost={data?.cost_overview} />
        </ChartCard>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <div>
              <h3 className="text-[14px] font-semibold text-ink">Projects requiring attention</h3>
              <p className="mt-0.5 text-[12px] text-muted">Highest risk first</p>
            </div>
            <Link to="/projects?risk=high" className="text-[12.5px] font-medium text-navy hover:underline">View all</Link>
          </div>
          {loading ? (
            <SkeletonRows rows={4} />
          ) : (data?.critical_projects ?? []).length === 0 ? (
            <EmptyState title="No projects are currently flagged." description="Nothing in the portfolio is above the high-risk threshold." />
          ) : (
            <ProjectTable projects={data.critical_projects} compact />
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h3 className="text-[14px] font-semibold text-ink">Recent warnings</h3>
            <Link to="/warnings" className="text-[12.5px] font-medium text-navy hover:underline">All</Link>
          </div>
          <RecentWarnings warnings={warnings} loading={warningsLoading} />
        </Card>
      </div>
    </>
  );
}
