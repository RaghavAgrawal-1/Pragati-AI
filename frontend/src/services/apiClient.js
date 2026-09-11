import { env } from "../config/env";

const TOKEN_KEY = "pragati.token";

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export class ApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

async function request(path, { method = "GET", body, params, signal, auth = true } = {}) {
  const url = new URL(String(path).replace(/^\//, ""), env.apiBaseUrl.replace(/\/?$/, "/"));
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
    });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), env.requestTimeoutMs);
  signal?.addEventListener("abort", () => controller.abort());

  const headers = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const token = auth ? tokenStore.get() : null;
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(url, { method, headers, body: body === undefined ? undefined : JSON.stringify(body), signal: controller.signal });
  } catch (err) {
    clearTimeout(timer);
    throw new ApiError(err.name === "AbortError" ? "The request timed out." : "Unable to reach the server.", 0);
  }
  clearTimeout(timer);

  const payload = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status === 401) tokenStore.clear();
    const detail = payload?.detail ?? payload?.message;
    throw new ApiError(typeof detail === "string" ? detail : `Request failed (${res.status}).`, res.status, payload);
  }
  return payload;
}

export const api = {
  get: (p, o) => request(p, { ...o, method: "GET" }),
  post: (p, b, o) => request(p, { ...o, method: "POST", body: b }),
  put: (p, b, o) => request(p, { ...o, method: "PUT", body: b }),
  patch: (p, b, o) => request(p, { ...o, method: "PATCH", body: b }),
  delete: (p, o) => request(p, { ...o, method: "DELETE" }),
};

/**
 * DEMO FALLBACK — temporary.
 * Used only where the endpoint does not exist yet. The result is tagged
 * `__demo` so the UI can badge it; real data never carries that flag.
 * Removing these calls is all that is needed to go fully live.
 */
export async function withFallback(fn, demoData) {
  try {
    return await fn();
  } catch (err) {
    const missing = err?.status === 404 || err?.status === 501 || err?.status === 0;
    if (!missing || !env.useDemoData) throw err;
    return Array.isArray(demoData)
      ? Object.assign([...demoData], { __demo: true })
      : { ...demoData, __demo: true };
  }
}
