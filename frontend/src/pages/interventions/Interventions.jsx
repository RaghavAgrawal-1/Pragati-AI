import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/common/Card";

export default function Interventions() {
  return (
    <>
      <PageHeader title="Intervention Center" subtitle="Turning warnings into assigned, tracked actions." />
      <Card className="border-dashed p-8">
        <p className="text-[13px] text-muted">This screen has not been built yet.</p>
        <ul className="mt-4 space-y-1.5 text-[13px] text-slate-600">
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />Table: project, issue, action, owner, priority, deadline, status</li>
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />Create intervention modal</li>
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />Status flow: open, assigned, in progress, completed, dismissed</li>
        </ul>
      </Card>
    </>
  );
}
