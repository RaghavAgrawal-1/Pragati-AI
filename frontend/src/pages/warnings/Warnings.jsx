import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/common/Card";

export default function Warnings() {
  return (
    <>
      <PageHeader title="Early Warning Center" subtitle="Emerging issues detected across the portfolio." />
      <Card className="border-dashed p-8">
        <p className="text-[13px] text-muted">This screen has not been built yet.</p>
        <ul className="mt-4 space-y-1.5 text-[13px] text-slate-600">
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />Counters: critical, high, medium, resolved</li>
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />Tabs and filters by severity, type, sector, ministry, date</li>
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />Alert cards with probability change and recommended action</li>
        </ul>
      </Card>
    </>
  );
}
