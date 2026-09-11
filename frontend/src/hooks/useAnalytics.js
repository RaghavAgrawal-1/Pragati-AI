import { analyticsService } from "../services/analyticsService";
import { useApiResource } from "./useApiResource";

export function useDashboard(params = {}) {
  const key = JSON.stringify(params);
  return useApiResource(() => analyticsService.dashboard(params), [key]);
}

export function usePortfolioAnalytics(params = {}) {
  const key = JSON.stringify(params);
  return useApiResource(() => analyticsService.portfolio(params), [key]);
}

export function useCostEscalation(params = {}) {
  const key = JSON.stringify(params);
  return useApiResource(() => analyticsService.costEscalation(params), [key]);
}

export function useBenchmark(params = {}) {
  const key = JSON.stringify(params);
  return useApiResource(() => analyticsService.benchmark(params), [key]);
}
