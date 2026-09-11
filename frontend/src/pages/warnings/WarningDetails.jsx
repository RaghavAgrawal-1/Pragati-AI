import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/common/Card";

export default function WarningDetails() {
  return (
    <>
      <PageHeader title="Alert Details" subtitle="What happened, why it fired, and what to do." />
      <Card className="border-dashed p-8">
        <p className="text-[13px] text-muted">This screen has not been built yet.</p>
        <ul className="mt-4 space-y-1.5 text-[13px] text-slate-600">
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />Severity, type, project and detection time</li>
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />Previous against current probability</li>
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />Supporting factors and recommended action</li>
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />Acknowledge, assign, resolve, view project</li>
        </ul>
      </Card>
    </>
  );
}
