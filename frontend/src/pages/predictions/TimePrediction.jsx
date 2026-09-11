import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/common/Card";

export default function TimePrediction() {
  return (
    <>
      <PageHeader title="Time Overrun Prediction" subtitle="Predicted completion and expected delay." />
      <Card className="border-dashed p-8">
        <p className="text-[13px] text-muted">This screen has not been built yet.</p>
        <ul className="mt-4 space-y-1.5 text-[13px] text-slate-600">
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />Original, revised and predicted completion</li>
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />Expected delay and overrun probability</li>
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />Contributing factors and timeline visualisation</li>
        </ul>
      </Card>
    </>
  );
}
