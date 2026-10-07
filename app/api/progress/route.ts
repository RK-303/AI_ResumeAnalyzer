import { NextRequest, NextResponse } from "next/server";
import { getUserProgress } from "@/lib/store";
import { verifyJWT, getAuthCookie } from "@/lib/auth";
import type { APIResponse } from "@/types";
import type { ProgressEntry } from "@/lib/store";

export async function GET(request: NextRequest) {
  try {
    const token = getAuthCookie(request);
    if (!token) {
      return NextResponse.json<APIResponse<never>>({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    const payload = verifyJWT(token);
    if (!payload) {
      return NextResponse.json<APIResponse<never>>({ success: false, error: "Invalid token" }, { status: 401 });
    }

    const progress = await getUserProgress(payload.userId);

    return NextResponse.json<APIResponse<ProgressEntry[]>>({ success: true, data: progress });
  } catch {
    return NextResponse.json<APIResponse<never>>({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
