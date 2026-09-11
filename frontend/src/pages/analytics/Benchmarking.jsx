import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/common/Card";

export default function Benchmarking() {
  return (
    <>
      <PageHeader title="Comparative Analytics" subtitle="Benchmarking across ministries, sectors, agencies and periods." />
      <Card className="border-dashed p-8">
        <p className="text-[13px] text-muted">This screen has not been built yet.</p>
        <ul className="mt-4 space-y-1.5 text-[13px] text-slate-600">
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />Metric comparison: escalation, delay, progress, risk share</li>
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />Prediction accuracy and warning performance where the backend reports it</li>
        </ul>
      </Card>
    </>
  );
}
