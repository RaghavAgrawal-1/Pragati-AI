import { useMemo } from "react";
import { projectService } from "../services/projectService";
import { useApiResource } from "./useApiResource";

export function useProjects(params = {}) {
  const key = useMemo(() => JSON.stringify(params), [params]);
  const res = useApiResource(() => projectService.list(params), [key]);
  return {
    ...res,
    projects: res.data?.items ?? [],
    total: res.data?.total ?? 0,
  };
}
