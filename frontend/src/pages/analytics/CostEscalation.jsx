import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/common/Card";

export default function CostEscalation() {
  return (
    <>
      <PageHeader title="Cost Escalation Analysis" subtitle="Where cost is growing, and what is driving it." />
      <Card className="border-dashed p-8">
        <p className="text-[13px] text-muted">This screen has not been built yet.</p>
        <ul className="mt-4 space-y-1.5 text-[13px] text-slate-600">
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />Average escalation, highest sector, highest agency</li>
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />Escalation trend and driver impact ranking</li>
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />Affected projects, filterable by driver</li>
        </ul>
      </Card>
    </>
  );
}
