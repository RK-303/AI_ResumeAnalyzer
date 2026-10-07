import { NextRequest, NextResponse } from "next/server";
import { getAnalysis } from "@/lib/store";
import { verifyJWT, getAuthCookie } from "@/lib/auth";
import type { APIResponse, Analysis } from "@/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const token = getAuthCookie(request);
    if (!token) {
      return NextResponse.json<APIResponse<never>>({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    const payload = verifyJWT(token);
    if (!payload) {
      return NextResponse.json<APIResponse<never>>({ success: false, error: "Invalid token" }, { status: 401 });
    }

    const analysis = await getAnalysis(id);
    if (!analysis) {
      return NextResponse.json<APIResponse<never>>({ success: false, error: "Analysis not found" }, { status: 404 });
    }

    if (analysis.userId !== payload.userId) {
      return NextResponse.json<APIResponse<never>>({ success: false, error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json<APIResponse<Analysis>>({ success: true, data: analysis });
  } catch {
    return NextResponse.json<APIResponse<never>>({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
