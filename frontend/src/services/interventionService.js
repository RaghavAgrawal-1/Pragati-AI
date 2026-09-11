import { api, withFallback } from "./apiClient";

export const interventionService = {
  list: (params) => withFallback(() => api.get("/interventions", { params }), { items: [] }),
  create: (payload) => api.post("/interventions", payload),
  update: (id, payload) => api.patch(`/interventions/${id}`, payload),
};
