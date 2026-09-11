import { api } from "./apiClient";

export const aiService = {
  /** No demo fallback — a fabricated assistant reply would be indistinguishable from a real one. */
  send: ({ message, projectId, history = [] }) =>
    api.post("/assistant/chat", { message, project_id: projectId, history }),
};
