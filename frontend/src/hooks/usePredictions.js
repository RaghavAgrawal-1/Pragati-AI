import { predictionService } from "../services/predictionService";
import { useApiResource } from "./useApiResource";

export function usePredictions(params = {}) {
  const key = JSON.stringify(params);
  const res = useApiResource(() => predictionService.portfolio(params), [key]);
  return { ...res, predictions: res.data?.items ?? [], summary: res.data?.summary ?? null };
}

export function useCostPrediction(projectId) {
  const res = useApiResource(() => predictionService.cost(projectId), [projectId], { enabled: Boolean(projectId) });
  return { ...res, prediction: res.data };
}

export function useTimePrediction(projectId) {
  const res = useApiResource(() => predictionService.time(projectId), [projectId], { enabled: Boolean(projectId) });
  return { ...res, prediction: res.data };
}
