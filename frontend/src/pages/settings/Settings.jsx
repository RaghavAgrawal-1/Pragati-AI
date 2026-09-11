import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/common/Card";

export default function Settings() {
  return (
    <>
      <PageHeader title="Settings" subtitle="Profile, notifications, appearance and security." />
      <Card className="border-dashed p-8">
        <p className="text-[13px] text-muted">This screen has not been built yet.</p>
        <ul className="mt-4 space-y-1.5 text-[13px] text-slate-600">
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />Profile: name, email, role, organisation</li>
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />Notification preferences per alert type</li>
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />Appearance: light, dark, system</li>
          <li className="flex gap-2.5"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-slate-400" />Security: change password, active sessions, log out</li>
        </ul>
      </Card>
    </>
  );
}
