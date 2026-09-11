import { projectService } from "../services/projectService";
import { useApiResource } from "./useApiResource";

export function useProject(id) {
  const res = useApiResource(() => projectService.get(id), [id], { enabled: Boolean(id) });
  return { ...res, project: res.data };
}
