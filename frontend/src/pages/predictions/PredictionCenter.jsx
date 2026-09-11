import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/common/Card";

export default function PredictionCenter() {
  return (
    <>
      <PageHeader title="Prediction Center" subtitle="AI-powered forecasting across the infrastructure portfolio." />
      <Card className="border-dashed p-8">
        <p className="text-[13px] text-muted">This screen has not been built yet.</p>
        <ul className="mt-4 space-y-1.5 text-[13px] text-slate-600">
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />KPIs: cost overrun risk, time overrun risk, high-risk projects, predictions generated</li>
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />Prediction distribution charts</li>
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />High-risk table with confidence and model version</li>
        </ul>
      </Card>
    </>
  );
}
