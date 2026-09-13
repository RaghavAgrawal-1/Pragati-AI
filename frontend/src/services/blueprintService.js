import { api } from "./apiClient";

export const blueprintService = {
  generate: (payload) => api.post("/api/blueprint/generate", payload),
  enhance: (payload) => api.post("/api/blueprint/enhance", payload),
  matchContractors: (params) => api.get("/api/blueprint/contractor-match", { params }),
};
