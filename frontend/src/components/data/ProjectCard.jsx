import { Link } from "react-router-dom";
import Card from "../common/Card";
import RiskBadge from "./RiskBadge";
import ProjectStatusBadge from "./ProjectStatusBadge";
import ProgressBar from "./ProgressBar";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatPercentage } from "../../utils/formatPercentage";
import { projectId } from "../../utils/projectUtils";

/** The table row, restated for small screens. */
export default function ProjectCard({ project }) {
  const id = projectId(project);
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] tabular-nums text-muted">{id}</p>
          <Link to={`/projects/${id}`} className="mt-0.5 block truncate text-[13.5px] font-medium text-ink hover:underline">
            {project.project_name}
          </Link>
          <p className="mt-0.5 truncate text-[12px] text-muted">{project.sector} · {project.implementing_agency}</p>
        </div>
        <RiskBadge level={project.risk?.level} score={project.risk?.score} />
      </div>

      <div className="mt-3.5 flex items-center gap-2 text-[12px] text-muted">
        <span className="tabular-nums">{formatPercentage(project.physical_progress)}</span>
        <ProgressBar value={project.physical_progress} className="flex-1" />
        <ProjectStatusBadge status={project.status} />
      </div>

      <div className="mt-3 flex justify-between text-[12px]">
        <span className="text-muted">Approved <span className="text-ink">{formatCurrency(project.approved_cost)}</span></span>
        <span className="text-muted">Revised <span className="text-ink">{formatCurrency(project.revised_cost)}</span></span>
      </div>
    </Card>
  );
}
