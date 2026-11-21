import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { backendRequest, errorResponse, jsonError, type BackendRequestOptions, type BackendResult } from "./backend";
import { AUTH_PATHS, extractTokens } from "./authContract";
import { clearSessionCookies, readSession, setSessionCookies, type TokenPair } from "./session";

type AuthedHandler<T> = (token: string) => Promise<BackendResult<T>>;

/**
 * Runs an authenticated backend call on behalf of the signed-in user.
 *
 *  1. Uses the access-token cookie if it is still valid.
 *  2. Otherwise (or on a 401 from the backend) rotates the refresh token once and retries.
 *  3. If the session cannot be recovered, clears the cookies and answers 401 so the browser
 *     can send the user back to sign-in.
 *
 * `onSuccess` receives the backend result and returns the response for the browser; any rotated
 * cookies are attached automatically.
 */
export async function withSession<T>(
  req: NextRequest,
  call: AuthedHandler<T>,
  onSuccess: (result: BackendResult<T>) => NextResponse
): Promise<NextResponse> {
  const session = readSession(req);
  let rotated: TokenPair | null = null;
  let token = session.accessToken;

  if (!token) {
    rotated = await rotate(session.refreshToken);
    if (!rotated) return sessionExpired();
    token = rotated.accessToken;
  }

  let result = await call(token);

  if (result.status === 401 && !rotated) {
    rotated = await rotate(session.refreshToken);
    if (!rotated) return sessionExpired();
    result = await call(rotated.accessToken);
  }

  if (result.status === 401) return sessionExpired();

  const response = result.ok ? onSuccess(result) : errorResponse(result);
  if (rotated) setSessionCookies(response, rotated);
  return response;
}

/**
 * Refresh tokens are single-use and reusing one revokes the whole token family (docs/02-architecture.md),
 * so simultaneous requests carrying the same refresh token share ONE backend refresh call.
 * The entry is removed as soon as the call settles: a token presented after that is a replay and
 * must reach the backend (which rejects it) rather than be handed freshly issued tokens.
 * Dedupes within one server instance only; across instances/tabs it is best-effort.
 */
const inFlightRotations = new Map<string, Promise<TokenPair | null>>();

function rotate(refreshToken: string | undefined): Promise<TokenPair | null> {
  if (!refreshToken) return Promise.resolve(null);
  const existing = inFlightRotations.get(refreshToken);
  if (existing) return existing;

  const pending = backendRequest(AUTH_PATHS.refresh, { method: "POST", body: { refreshToken } })
    .then((result) => (result.ok ? extractTokens(result.data) : null))
    .finally(() => inFlightRotations.delete(refreshToken));
  inFlightRotations.set(refreshToken, pending);
  return pending;
}

function sessionExpired(): NextResponse {
  const response = jsonError(401, "Your session has expired. Please sign in again.", "SESSION_EXPIRED");
  clearSessionCookies(response);
  return response;
}

/** Convenience for routes that simply forward a JSON body to an authenticated backend path. */
export function authedBackendCall<T>(path: string, options: Omit<BackendRequestOptions, "token"> = {}): AuthedHandler<T> {
  return (token) => backendRequest<T>(path, { ...options, token });
}
