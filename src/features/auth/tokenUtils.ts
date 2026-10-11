/**
 * Pure JWT helpers. Tokens come from the backend's /api/auth endpoints
 * (Keycloak-issued). They are only DECODED here - never trusted for
 * authorization; the backend re-validates every request.
 */

export interface JwtPayload {
  exp?: number;
  preferred_username?: string;
  name?: string;
  realm_access?: { roles?: string[] };
}

const base64UrlDecode = (segment: string): string => {
  const base64 = segment.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  const bytes = Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
  return new TextDecoder('utf-8').decode(bytes);
};

/** Decode the payload of a JWT (base64url). Returns null when undecodable. */
export const decodeJwt = (jwt: string | null | undefined): JwtPayload | null => {
  if (!jwt) return null;
  const parts = jwt.split('.');
  if (parts.length < 2) return null;
  try {
    return JSON.parse(base64UrlDecode(parts[1])) as JwtPayload;
  } catch {
    return null;
  }
};

/**
 * True when the access token is expired, expires within `marginSeconds`,
 * or cannot be decoded - i.e. it should be refreshed before use.
 */
export const isAccessTokenStale = (jwt: string | null, marginSeconds = 30): boolean => {
  const payload = decodeJwt(jwt);
  if (!payload?.exp) return true;
  return payload.exp * 1000 <= Date.now() + marginSeconds * 1000;
};

/** Role from the access token's realm_access.roles (ADMIN wins over CUSTOMER). */
export const roleFromToken = (jwt: string | null): 'ADMIN' | 'CUSTOMER' => {
  const roles = decodeJwt(jwt)?.realm_access?.roles ?? [];
  return roles.includes('ADMIN') ? 'ADMIN' : 'CUSTOMER';
};

/** preferred_username (fallback: name) from the access token. */
export const usernameFromToken = (jwt: string | null): string | null => {
  const payload = decodeJwt(jwt);
  return payload?.preferred_username ?? payload?.name ?? null;
};
