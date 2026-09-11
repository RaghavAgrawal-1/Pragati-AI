import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/common/Card";

export default function Projects() {
  return (
    <>
      <PageHeader title="Projects Portfolio" subtitle="The central project database with search, filters and export." />
      <Card className="border-dashed p-8">
        <p className="text-[13px] text-muted">This screen has not been built yet.</p>
        <ul className="mt-4 space-y-1.5 text-[13px] text-slate-600">
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />Filter panel: ministry, sector, agency, risk, status, progress, dates</li>
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />Sortable, paginated table with filter chips and clear-all</li>
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />Card layout below md; loading, empty and error states</li>
        </ul>
      </Card>
    </>
  );
}
