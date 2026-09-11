import { api, withFallback } from "./apiClient";
import { MOCK_PREDICTIONS } from "../mocks/predictions";

export const predictionService = {
  portfolio: (params) => withFallback(() => api.get("/predictions", { params }), MOCK_PREDICTIONS),
  cost: (projectId) => withFallback(() => api.get(`/predictions/cost/${projectId}`), null),
  time: (projectId) => withFallback(() => api.get(`/predictions/time/${projectId}`), null),
  run: (projectId) => api.post("/predictions/run", { project_id: projectId }),
};
