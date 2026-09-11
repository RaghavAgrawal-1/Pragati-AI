import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/common/Card";

export default function Assistant() {
  return (
    <>
      <PageHeader title="Pragati AI Assistant" subtitle="Ask questions about the portfolio in plain language." />
      <Card className="border-dashed p-8">
        <p className="text-[13px] text-muted">This screen has not been built yet.</p>
        <ul className="mt-4 space-y-1.5 text-[13px] text-slate-600">
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />Conversation view with distinct user and assistant styling</li>
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />Suggested prompts and thinking indicator</li>
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />Clickable project references that navigate to filtered views</li>
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />Project context carried in from Project Intelligence</li>
        </ul>
      </Card>
    </>
  );
}
