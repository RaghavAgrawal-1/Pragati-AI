import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/common/Card";

export default function CostPrediction() {
  return (
    <>
      <PageHeader title="Cost Overrun Prediction" subtitle="Predicted cost outcome for a selected project." />
      <Card className="border-dashed p-8">
        <p className="text-[13px] text-muted">This screen has not been built yet.</p>
        <ul className="mt-4 space-y-1.5 text-[13px] text-slate-600">
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />Project selector</li>
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />Overrun probability, risk classification and model confidence</li>
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />Approved, revised and predicted final cost — predicted shown only when the model returns it</li>
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />Top contributing factors and historical cost chart</li>
        </ul>
      </Card>
    </>
  );
}
