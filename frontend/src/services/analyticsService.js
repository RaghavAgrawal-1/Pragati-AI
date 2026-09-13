import { api, withFallback } from "./apiClient";
import { MOCK_DASHBOARD, MOCK_PORTFOLIO } from "../mocks/analytics";

export const analyticsService = {
  /** Everything the executive dashboard needs, in one call where possible. */
  dashboard: (params) => withFallback(() => api.get("/api/dashboard/analytics", { params }), MOCK_DASHBOARD),
  portfolio: (params) => withFallback(() => api.get("/api/analytics/portfolio", { params }), MOCK_PORTFOLIO),
  costEscalation: (params) => withFallback(() => api.get("/api/analytics/cost", { params }), null),
  benchmark: (params) => withFallback(() => api.get("/api/analytics/benchmark", { params }), null),
};
