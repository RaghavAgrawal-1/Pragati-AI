import { interventionService } from "../services/interventionService";
import { useApiResource } from "./useApiResource";

export function useInterventions(params = {}) {
  const key = JSON.stringify(params);
  const res = useApiResource(() => interventionService.list(params), [key]);
  return { ...res, interventions: res.data?.items ?? [] };
}
