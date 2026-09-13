/** Every environment-dependent value in the app comes from here. */
export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? "https://pragati-ai-backend-5y8a.onrender.com",
  useDemoData: import.meta.env.VITE_USE_DEMO_DATA !== "false",
  requestTimeoutMs: 15000,
};
