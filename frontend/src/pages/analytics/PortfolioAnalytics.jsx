import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/common/Card";

export default function PortfolioAnalytics() {
  return (
    <>
      <PageHeader title="Portfolio Analytics" subtitle="Cross-cutting analysis by ministry, sector and agency." />
      <Card className="border-dashed p-8">
        <p className="text-[13px] text-muted">This screen has not been built yet.</p>
        <ul className="mt-4 space-y-1.5 text-[13px] text-slate-600">
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />Filters: date range, ministry, sector, agency, risk</li>
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />Projects and risk by sector and ministry</li>
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />Average progress, delayed projects, escalation, expenditure</li>
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />Chart categories drill through to filtered projects</li>
        </ul>
      </Card>
    </>
  );
}
