import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/common/Card";

export default function RiskIntelligence() {
  return (
    <>
      <PageHeader title="Risk Intelligence" subtitle="Portfolio-level risk composition and its drivers." />
      <Card className="border-dashed p-8">
        <p className="text-[13px] text-muted">This screen has not been built yet.</p>
        <ul className="mt-4 space-y-1.5 text-[13px] text-slate-600">
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />Risk distribution and overall score</li>
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />Cost, time, progress, milestone and execution risk</li>
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />Top risk drivers and trend</li>
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />High-risk project list with filters</li>
        </ul>
      </Card>
    </>
  );
}
