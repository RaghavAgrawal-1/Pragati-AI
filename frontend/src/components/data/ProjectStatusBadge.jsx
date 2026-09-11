import Badge from "../common/Badge";
import { statusOf } from "../../constants/projectStatuses";

export default function ProjectStatusBadge({ status }) {
  const meta = statusOf(status);
  return <Badge className={meta.chip}>{meta.label}</Badge>;
}
