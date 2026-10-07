import type { NextRequest, NextResponse } from "next/server";

// ─── Constants ────────────────────────────────────────────────────────────────

export const AUTH_COOKIE_NAME = "auth_token";

/** Token TTL: 7 days in milliseconds */
const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

// ─── Token Payload ────────────────────────────────────────────────────────────

interface TokenPayload {
  userId: string;
  exp: number;
}

// ─── Sign / Verify ────────────────────────────────────────────────────────────

/**
 * Create a lightweight base64url-encoded token.
 * NOT a real JWT — for MVP use only. Replace with jose/jsonwebtoken for prod.
 */
export function signJWT(userId: string): string {
  const payload: TokenPayload = {
    userId,
    exp: Date.now() + TOKEN_TTL_MS,
  };
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

/**
 * Decode and validate a token created by signJWT.
 * Returns { userId } on success, null if invalid or expired.
 */
export function verifyJWT(token: string): { userId: string } | null {
  try {
    const json = Buffer.from(token, "base64url").toString("utf-8");
    const payload = JSON.parse(json) as TokenPayload;

    if (typeof payload.userId !== "string" || typeof payload.exp !== "number") {
      return null;
    }

    if (Date.now() > payload.exp) {
      return null; // expired
    }

    return { userId: payload.userId };
  } catch {
    return null;
  }
}

// ─── Cookie Helpers ───────────────────────────────────────────────────────────

/**
 * Set the auth cookie on a NextResponse.
 * HttpOnly + SameSite=Lax keeps it safe for same-origin requests.
 */
export function setAuthCookie(response: NextResponse, token: string): void {
  response.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: TOKEN_TTL_MS / 1000, // seconds
    path: "/",
  });
}

/**
 * Clear the auth cookie by setting it to an expired value.
 */
export function clearAuthCookie(response: NextResponse): void {
  response.cookies.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}

/**
 * Read the auth cookie value from a NextRequest.
 * In Next.js 16, request.cookies is synchronous on NextRequest objects.
 */
export function getAuthCookie(request: NextRequest): string | null {
  return request.cookies.get(AUTH_COOKIE_NAME)?.value ?? null;
}
