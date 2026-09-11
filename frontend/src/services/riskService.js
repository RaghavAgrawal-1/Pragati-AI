import { api, withFallback } from "./apiClient";
import { MOCK_RISK } from "../mocks/risks";

export const riskService = {
  portfolio: (params) => withFallback(() => api.get("/risk", { params }), MOCK_RISK),
  forProject: (projectId) => withFallback(() => api.get(`/risk/${projectId}`), null),
};
