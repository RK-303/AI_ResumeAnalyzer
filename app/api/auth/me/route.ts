import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/store";
import { verifyJWT, getAuthCookie } from "@/lib/auth";
import type { APIResponse, AuthUser } from "@/types";

export async function GET(request: NextRequest) {
  try {
    // Read auth cookie from NextRequest (synchronous in Next.js 16)
    const token = getAuthCookie(request);

    if (!token) {
      const response: APIResponse<never> = {
        success: false,
        error: "Not authenticated",
      };
      return NextResponse.json(response, { status: 401 });
    }

    const payload = verifyJWT(token);
    if (!payload) {
      const response: APIResponse<never> = {
        success: false,
        error: "Invalid or expired token",
      };
      return NextResponse.json(response, { status: 401 });
    }

    const user = await getUser(payload.userId);
    if (!user) {
      const response: APIResponse<never> = {
        success: false,
        error: "User not found",
      };
      return NextResponse.json(response, { status: 404 });
    }

    const authUser: AuthUser = { id: user.id, email: user.email, name: user.name };
    const response: APIResponse<{ user: AuthUser }> = {
      success: true,
      data: { user: authUser },
    };
    return NextResponse.json(response);
  } catch {
    const response: APIResponse<never> = {
      success: false,
      error: "Internal server error",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
