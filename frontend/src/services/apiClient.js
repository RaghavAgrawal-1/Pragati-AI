import { env } from "../config/env";

const TOKEN_KEY = "pragati.token";

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),

  set: (token) => localStorage.setItem(TOKEN_KEY, token),

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


async function request(
  path,
  {
    method = "GET",
    body,
    params,
    signal,
    auth = true,
  } = {}
) {
  const baseUrl = env.apiBaseUrl.replace(/\/+$/, "");
  const cleanPath = String(path).replace(/^\/+/, "");

  const url = new URL(`${baseUrl}/${cleanPath}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        url.searchParams.set(key, value);
      }
    });
  }

  const controller = new AbortController();

  const timer = setTimeout(
    () => controller.abort(),
    env.requestTimeoutMs
  );

  signal?.addEventListener(
    "abort",
    () => controller.abort(),
    { once: true }
  );

  const headers = {
    Accept: "application/json",
  };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const token = auth ? tokenStore.get() : null;

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(url, {
      method,
      headers,
      body:
        body === undefined
          ? undefined
          : JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (error) {
    clearTimeout(timer);

    throw new ApiError(
      error.name === "AbortError"
        ? "The request timed out."
        : "Unable to reach the server.",
      0
    );
  }

  clearTimeout(timer);

  const payload =
    response.status === 204
      ? null
      : await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401) {
      tokenStore.clear();
    }

    const detail =
      payload?.detail ?? payload?.message;

    throw new ApiError(
      typeof detail === "string"
        ? detail
        : `Request failed (${response.status}).`,
      response.status,
      payload
    );
  }

  return payload;
}


export const api = {
  get: (path, options) =>
    request(path, {
      ...options,
      method: "GET",
    }),

  post: (path, body, options) =>
    request(path, {
      ...options,
      method: "POST",
      body,
    }),

  put: (path, body, options) =>
    request(path, {
      ...options,
      method: "PUT",
      body,
    }),

  patch: (path, body, options) =>
    request(path, {
      ...options,
      method: "PATCH",
      body,
    }),

  delete: (path, options) =>
    request(path, {
      ...options,
      method: "DELETE",
    }),
};


/**
 * DEMO FALLBACK — temporary.
 *
 * Used only where the endpoint does not exist yet.
 * The result is tagged with __demo so the UI can identify it.
 */
export async function withFallback(fn, demoData) {
  try {
    return await fn();
  } catch (error) {
    const missing =
      error?.status === 404 ||
      error?.status === 501 ||
      error?.status === 0;

    if (!missing || !env.useDemoData) {
      throw error;
    }

    return Array.isArray(demoData)
      ? Object.assign([...demoData], {
          __demo: true,
        })
      : {
          ...demoData,
          __demo: true,
        };
  }
}