import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/common/Card";

export default function ProjectTimeline() {
  return (
    <>
      <PageHeader title="Project Timeline" subtitle="Planned against actual, with milestone slippage called out." />
      <Card className="border-dashed p-8">
        <p className="text-[13px] text-muted">This screen has not been built yet.</p>
        <ul className="mt-4 space-y-1.5 text-[13px] text-slate-600">
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />Timeline band: start, original, revised, predicted, today</li>
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />Milestone table with planned date, actual date, delay, status</li>
        </ul>
      </Card>
    </>
  );
}
