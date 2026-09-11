import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/common/Card";

export default function ProjectPerformance() {
  return (
    <>
      <PageHeader title="Project Performance" subtitle="Historical trajectory for this project." />
      <Card className="border-dashed p-8">
        <p className="text-[13px] text-muted">This screen has not been built yet.</p>
        <ul className="mt-4 space-y-1.5 text-[13px] text-slate-600">
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />Expected against actual physical progress</li>
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />Monthly expenditure and approved against revised cost</li>
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />Risk score trend with time range selector</li>
        </ul>
      </Card>
    </>
  );
}
