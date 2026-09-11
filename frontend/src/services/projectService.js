import { api, withFallback } from "./apiClient";
import { MOCK_PROJECTS } from "../mocks/projects";

export const projectService = {
  list: (params) =>
    withFallback(() => api.get("/api/projects", { params }), {
      items: MOCK_PROJECTS,
      total: MOCK_PROJECTS.length,
      page: 1,
      page_size: 20,
    }),

  get: (id) =>
    withFallback(() => api.get(`/api/projects/${id}`), MOCK_PROJECTS.find((p) => p.project_id === id) ?? MOCK_PROJECTS[0]),

  create: (payload) => api.post("/projects", payload),
  update: (id, payload) => api.put(`/projects/${id}`, payload),
  remove: (id) => api.delete(`/projects/${id}`),
  analyze: (id) => api.post(`/projects/${id}/analyze`),
  timeline: (id) => withFallback(() => api.get(`/projects/${id}/timeline`), { milestones: [] }),
  performance: (id, params) => withFallback(() => api.get(`/projects/${id}/performance`, { params }), { series: [] }),
};
