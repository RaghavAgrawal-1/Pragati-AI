import { api, withFallback } from "./apiClient";
import { MOCK_WARNINGS } from "../mocks/warnings";

export const alertService = {
  list: (params) => withFallback(() => api.get("/warnings", { params }), MOCK_WARNINGS),
  get: (id) => withFallback(() => api.get(`/warnings/${id}`), MOCK_WARNINGS.items.find((w) => w.id === id) ?? null),
  acknowledge: (id) => api.post(`/warnings/${id}/acknowledge`),
  resolve: (id, note) => api.post(`/warnings/${id}/resolve`, { note }),
};
