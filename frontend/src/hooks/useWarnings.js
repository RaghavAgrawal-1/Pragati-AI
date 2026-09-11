import { alertService } from "../services/alertService";
import { useApiResource } from "./useApiResource";

export function useWarnings(params = {}) {
  const key = JSON.stringify(params);
  const res = useApiResource(() => alertService.list(params), [key]);
  return { ...res, warnings: res.data?.items ?? [], counts: res.data?.counts ?? null };
}

export function useWarning(id) {
  const res = useApiResource(() => alertService.get(id), [id], { enabled: Boolean(id) });
  return { ...res, warning: res.data };
}
