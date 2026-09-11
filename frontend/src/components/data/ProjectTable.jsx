import { Link } from "react-router-dom";
import RiskBadge from "./RiskBadge";
import ProjectStatusBadge from "./ProjectStatusBadge";
import ProgressBar from "./ProgressBar";
import ProjectCard from "./ProjectCard";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatPercentage } from "../../utils/formatPercentage";
import { projectId } from "../../utils/projectUtils";

/**
 * Table above md, cards below — the same data, never a squashed grid.
 * `columns` lets the dashboard show a shorter version than the portfolio page.
 */
export default function ProjectTable({ projects = [], compact = false }) {
  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-line text-[11.5px] uppercase tracking-wide text-muted">
              <th className="px-5 py-2.5 font-medium">Project</th>
              {!compact && <th className="px-3 py-2.5 font-medium">Ministry</th>}
              <th className="px-3 py-2.5 font-medium">Sector</th>
              <th className="px-3 py-2.5 font-medium">Progress</th>
              {!compact && <th className="px-3 py-2.5 font-medium">Approved</th>}
              <th className="px-3 py-2.5 font-medium">Revised</th>
              <th className="px-3 py-2.5 font-medium">Status</th>
              <th className="px-3 py-2.5 font-medium">Risk</th>
              <th className="px-5 py-2.5 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => {
              const id = projectId(p);
              return (
                <tr key={id} className="border-b border-line/70 text-[13px] last:border-0 hover:bg-slate-50/70">
                  <td className="max-w-[300px] px-5 py-3">
                    <Link to={`/projects/${id}`} className="block truncate font-medium text-ink hover:underline">
                      {p.project_name}
                    </Link>
                    <span className="text-[11.5px] tabular-nums text-muted">{id}</span>
                  </td>
                  {!compact && <td className="px-3 py-3 text-slate-600">{p.ministry}</td>}
                  <td className="px-3 py-3 text-slate-600">{p.sector}</td>
                  <td className="px-3 py-3">
                    <div className="flex w-32 items-center gap-2">
                      <span className="w-9 shrink-0 tabular-nums text-slate-600">{formatPercentage(p.physical_progress)}</span>
                      <ProgressBar value={p.physical_progress} />
                    </div>
                  </td>
                  {!compact && <td className="px-3 py-3 tabular-nums text-slate-600">{formatCurrency(p.approved_cost)}</td>}
                  <td className="px-3 py-3 tabular-nums text-slate-600">{formatCurrency(p.revised_cost)}</td>
                  <td className="px-3 py-3"><ProjectStatusBadge status={p.status} /></td>
                  <td className="px-3 py-3"><RiskBadge level={p.risk?.level} score={p.risk?.score} /></td>
                  <td className="px-5 py-3 text-right">
                    <Link to={`/projects/${id}`} className="text-[12.5px] font-medium text-navy hover:underline">View</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 p-4 md:hidden">
        {projects.map((p) => <ProjectCard key={projectId(p)} project={p} />)}
      </div>
    </>
  );
}
