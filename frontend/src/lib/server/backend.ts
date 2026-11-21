import "server-only";
import { NextResponse } from "next/server";
import type { ApiErrorBody } from "@/lib/types";
import { ConfigError, backendTimeouts, getBackendBaseUrl } from "./config";

/** Prefix of every backend route (see backend/app/main.py). */
const API_PREFIX = "/api/v1";

export interface BackendRequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  /** Access token (JWT). Sent as `Authorization: Bearer`. */
  token?: string;
  timeoutMs?: number;
}

export interface BackendResult<T = unknown> {
  ok: boolean;
  status: number;
  data: T | null;
  /** Normalised, user-presentable message when `ok` is false. */
  error?: ApiErrorBody;
}

/**
 * The single place the frontend talks to the Python backend.
 * - Base URL comes from BACKEND_API_URL.
 * - Never throws for HTTP errors or network failures; returns a normalised result instead.
 */
export async function backendRequest<T = unknown>(
  path: string,
  options: BackendRequestOptions = {}
): Promise<BackendResult<T>> {
  let baseUrl: string;
  try {
    baseUrl = getBackendBaseUrl();
  } catch (err) {
    if (err instanceof ConfigError) {
      console.error("[backend] configuration error");
      return fail(503, "SERVICE_MISCONFIGURED", "The service is temporarily unavailable. Please try again later.");
    }
    throw err;
  }

  const headers: Record<string, string> = { Accept: "application/json" };
  if (options.body !== undefined) headers["Content-Type"] = "application/json";
  if (options.token) headers.Authorization = `Bearer ${options.token}`;

  try {
    const res = await fetch(`${baseUrl}${API_PREFIX}${path}`, {
      method: options.method ?? "GET",
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      cache: "no-store",
      signal: AbortSignal.timeout(options.timeoutMs ?? backendTimeouts.default()),
    });

    const data = await readJson<T>(res);
    if (res.ok) return { ok: true, status: res.status, data };
    return { ok: false, status: res.status, data, error: normaliseError(res.status, data) };
  } catch (err) {
    const timedOut = err instanceof DOMException && (err.name === "TimeoutError" || err.name === "AbortError");
    console.error(`[backend] ${timedOut ? "timeout" : "network error"} on ${options.method ?? "GET"} ${path}`);
    return timedOut
      ? fail(504, "UPSTREAM_TIMEOUT", "The request took too long. Please try again.")
      : fail(503, "UPSTREAM_UNREACHABLE", "We couldn't reach the server. Please try again shortly.");
  }
}

async function readJson<T>(res: Response): Promise<T | null> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

function fail(status: number, code: string, error: string): BackendResult<never> {
  return { ok: false, status, data: null, error: { error, code } };
}

/**
 * Backend errors arrive in two shapes (backend/app/main.py):
 *   - problem JSON: { code, title, detail, errors: [{ field, message }] }  (validation / internal)
 *   - FastAPI/AI:   { detail: "message" }
 */
function normaliseError(status: number, data: unknown): ApiErrorBody {
  const body = (data ?? {}) as {
    code?: string;
    detail?: unknown;
    errors?: Array<{ field?: string; message?: string }>;
  };
  const detail = typeof body.detail === "string" ? body.detail : undefined;

  if (Array.isArray(body.errors) && body.errors.length > 0) {
    const fieldErrors: Record<string, string> = {};
    for (const item of body.errors) {
      if (item.field) fieldErrors[item.field] = item.message ?? "Invalid value";
    }
    return {
      error: "Please check the highlighted details and try again.",
      code: body.code ?? "VALIDATION_ERROR",
      fieldErrors,
    };
  }

  switch (status) {
    case 400:
    case 422:
      return { error: detail ?? "The request was not valid.", code: body.code ?? "BAD_REQUEST" };
    case 401:
      return { error: detail ?? "Your session has expired. Please sign in again.", code: "UNAUTHENTICATED" };
    case 403:
      return { error: "You don't have permission to do that.", code: "FORBIDDEN" };
    case 404:
    case 405:
      // For auth/profile routes this means the backend has not shipped the endpoint yet.
      return { error: "This feature isn't available yet.", code: "NOT_IMPLEMENTED" };
    case 409:
      return { error: detail ?? "That conflicts with an existing record.", code: "CONFLICT" };
    case 429:
      return { error: "Too many requests. Please wait a moment and try again.", code: "RATE_LIMITED" };
    default:
      return status >= 500
        ? { error: "The service is temporarily unavailable. Please try again later.", code: "UPSTREAM_ERROR" }
        : { error: detail ?? "Something went wrong.", code: "ERROR" };
  }
}

/** Convert a failed backend result into the JSON response sent to the browser. */
export function errorResponse(result: BackendResult<unknown>): NextResponse<ApiErrorBody> {
  const body = result.error ?? { error: "Something went wrong.", code: "ERROR" };
  // A missing backend endpoint is a server-side gap, not a client error.
  const status = body.code === "NOT_IMPLEMENTED" ? 501 : result.status >= 400 ? result.status : 500;
  return NextResponse.json(body, { status });
}

export function jsonError(status: number, error: string, code?: string, fieldErrors?: Record<string, string>) {
  return NextResponse.json<ApiErrorBody>({ error, code, fieldErrors }, { status });
}
