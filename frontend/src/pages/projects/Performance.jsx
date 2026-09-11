import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/common/Card";

export default function Performance() {
  return (
    <>
      <PageHeader title="Performance" subtitle="Delivery performance across the monitored portfolio." />
      <Card className="border-dashed p-8">
        <p className="text-[13px] text-muted">This screen has not been built yet.</p>
        <ul className="mt-4 space-y-1.5 text-[13px] text-slate-600">
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />Progress distribution and schedule adherence</li>
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />Slowest and fastest moving packages</li>
        </ul>
      </Card>
    </>
  );
}
