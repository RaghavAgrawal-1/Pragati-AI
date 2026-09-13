// Dark-mode ProjectTable — full contrast text, dark row hover, dark borders
import { Link } from "react-router-dom";
import RiskBadge from "./RiskBadge";
import ProjectStatusBadge from "./ProjectStatusBadge";
import ProgressBar from "./ProgressBar";
import ProjectCard from "./ProjectCard";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatPercentage } from "../../utils/formatPercentage";
import { projectId } from "../../utils/projectUtils";

export default function ProjectTable({ projects = [], compact = false }) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-white/[0.06] text-[10.5px] uppercase tracking-widest text-muted font-bold">
              <th className="px-5 py-3 font-semibold">Project</th>
              {!compact && <th className="px-3 py-3 font-semibold">Ministry</th>}
              <th className="px-3 py-3 font-semibold">Sector</th>
              <th className="px-3 py-3 font-semibold">Progress</th>
              {!compact && <th className="px-3 py-3 font-semibold">Approved</th>}
              <th className="px-3 py-3 font-semibold">Revised</th>
              <th className="px-3 py-3 font-semibold">Status</th>
              <th className="px-3 py-3 font-semibold">Risk</th>
              <th className="px-5 py-3 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => {
              const id = projectId(p);
              return (
                <tr key={id} className="border-b border-white/[0.04] text-[12.5px] last:border-0 hover:bg-white/[0.03] transition-colors">
                  <td className="max-w-[260px] px-5 py-3">
                    <Link to={`/projects/${id}`} className="block truncate font-semibold text-ink hover:text-orange transition-colors">
                      {p.project_name}
                    </Link>
                    <span className="text-[10.5px] font-mono tabular-nums text-muted">{id}</span>
                  </td>
                  {!compact && <td className="px-3 py-3 text-muted text-[12px]">{p.ministry || "—"}</td>}
                  <td className="px-3 py-3 text-muted text-[12px]">{p.sector || "—"}</td>
                  <td className="px-3 py-3">
                    <div className="flex w-32 items-center gap-2">
                      <span className="w-9 shrink-0 font-mono tabular-nums text-ink text-[12px]">{formatPercentage(p.physical_progress)}</span>
                      <ProgressBar value={p.physical_progress} />
                    </div>
                  </td>
                  {!compact && <td className="px-3 py-3 tabular-nums text-muted text-[12px] font-mono">{formatCurrency(p.approved_cost)}</td>}
                  <td className="px-3 py-3 tabular-nums text-ink text-[12px] font-mono">{formatCurrency(p.revised_cost)}</td>
                  <td className="px-3 py-3"><ProjectStatusBadge status={p.status} /></td>
                  <td className="px-3 py-3"><RiskBadge level={p.risk?.level} score={p.risk?.score} /></td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      to={`/projects/${id}`}
                      className="text-[12px] font-semibold text-orange hover:text-orange-light transition-colors"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 p-4 md:hidden">
        {projects.map((p) => <ProjectCard key={projectId(p)} project={p} />)}
      </div>
    </>
  );
}
