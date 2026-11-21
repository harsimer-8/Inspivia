import "server-only";

/**
 * Server-side configuration. Nothing here is prefixed NEXT_PUBLIC_, so none of it
 * is ever bundled into browser code.
 */

const DEFAULT_TIMEOUT_MS = 15_000;
const DEFAULT_AI_TIMEOUT_MS = 45_000;

function parsePositiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function getBackendBaseUrl(): string {
  const url = process.env.BACKEND_API_URL?.trim();
  if (!url) {
    // Fail loudly in production; allow the documented local default only in development.
    if (process.env.NODE_ENV === "production") {
      throw new ConfigError("BACKEND_API_URL is not configured.");
    }
    return "http://localhost:8080";
  }
  return url.replace(/\/+$/, "");
}

export const backendTimeouts = {
  default: () => parsePositiveInt(process.env.BACKEND_TIMEOUT_MS, DEFAULT_TIMEOUT_MS),
  ai: () => parsePositiveInt(process.env.BACKEND_AI_TIMEOUT_MS, DEFAULT_AI_TIMEOUT_MS),
};

export class ConfigError extends Error {}
