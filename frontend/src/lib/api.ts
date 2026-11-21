import type { ApiErrorBody, SessionUser } from "./types";

/** Error thrown by `apiFetch` for any non-2xx response or network failure. */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
    public readonly fieldErrors?: Record<string, string>
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const LOGIN_PATH = "/auth/login";

export function redirectToLogin(): void {
  if (typeof window === "undefined") return;
  const next = window.location.pathname + window.location.search;
  const target = `${LOGIN_PATH}?expired=1&next=${encodeURIComponent(next)}`;
  window.location.assign(target);
}

/** Only same-site relative paths are accepted as post-login destinations (prevents open redirects). */
export function safeNextPath(candidate: string | null | undefined, fallback = "/dashboard"): string {
  if (!candidate || !candidate.startsWith("/") || candidate.startsWith("//") || candidate.startsWith("/\\")) {
    return fallback;
  }
  return candidate;
}

interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  json?: unknown;
  /** Set false for pages that handle a 401 themselves (login form, public navbar). Default true. */
  redirectOnUnauthorized?: boolean;
}

/**
 * The browser's single entry point to our Next.js route handlers (/api/*).
 * Returns parsed JSON, or throws ApiError with a message that is safe to show to the user.
 */
export async function apiFetch<T = unknown>(url: string, options: ApiFetchOptions = {}): Promise<T> {
  const { json, redirectOnUnauthorized = true, headers, ...init } = options;

  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      credentials: "same-origin",
      headers: { ...(json !== undefined ? { "Content-Type": "application/json" } : {}), ...headers },
      body: json !== undefined ? JSON.stringify(json) : undefined,
    });
  } catch {
    throw new ApiError("Could not reach the server. Please check your connection and try again.", 0, "NETWORK_ERROR");
  }

  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    /* empty or non-JSON body */
  }

  if (!res.ok) {
    const body = (data ?? {}) as Partial<ApiErrorBody>;
    if (res.status === 401 && redirectOnUnauthorized) redirectToLogin();
    throw new ApiError(body.error || "Something went wrong. Please try again.", res.status, body.code, body.fieldErrors);
  }
  return data as T;
}

/** Returns the signed-in user, or null when signed out. Never redirects. */
export async function fetchCurrentUser(): Promise<SessionUser | null> {
  try {
    const data = await apiFetch<{ user?: SessionUser }>("/api/auth/me", { redirectOnUnauthorized: false });
    return data.user ?? null;
  } catch {
    return null;
  }
}

export function errorMessage(err: unknown, fallback = "An unexpected error occurred."): string {
  return err instanceof Error && err.message ? err.message : fallback;
}
