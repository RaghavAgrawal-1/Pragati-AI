import { api } from "./apiClient";

export const contractorService = {
  list: (params) => api.get("/api/contractors", { params }),
  summary: () => api.get("/api/contractors/summary"),
  getSummary: () => api.get("/api/contractors/summary"),
  getById: (id) => api.get(`/api/contractors/${id}`),
  register: (payload) => api.post("/api/contractors/register", payload),
  updateWork: (id, payload) => api.post(`/api/contractors/${id}/update-work`, payload),
  submitReview: (id, payload) => api.post(`/api/contractors/${id}/review`, payload),
};
