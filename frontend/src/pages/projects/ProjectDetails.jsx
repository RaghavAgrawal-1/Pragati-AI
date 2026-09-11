import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/common/Card";

export default function ProjectDetails() {
  return (
    <>
      <PageHeader title="Project Intelligence" subtitle="Everything known about one project, and what to do about it." />
      <Card className="border-dashed p-8">
        <p className="text-[13px] text-muted">This screen has not been built yet.</p>
        <ul className="mt-4 space-y-1.5 text-[13px] text-slate-600">
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />Header with risk badge and actions: run analysis, predictions, ask AI, create intervention</li>
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />Cost, expenditure, progress and completion cards</li>
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />Risk breakdown with contributing factors</li>
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />Recommended interventions</li>
        </ul>
      </Card>
    </>
  );
}
