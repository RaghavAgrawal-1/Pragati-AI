import { riskService } from "../services/riskService";
import { useApiResource } from "./useApiResource";

export function usePortfolioRisk(params = {}) {
  const key = JSON.stringify(params);
  return useApiResource(() => riskService.portfolio(params), [key]);
}

export function useProjectRisk(projectId) {
  return useApiResource(() => riskService.forProject(projectId), [projectId], { enabled: Boolean(projectId) });
}
