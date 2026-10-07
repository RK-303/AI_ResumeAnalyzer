import { NextRequest, NextResponse } from "next/server";
import { getResume, updateResume } from "@/lib/store";
import { verifyJWT, getAuthCookie } from "@/lib/auth";
import type { APIResponse, Resume } from "@/types";

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

    const resume = await getResume(id);
    if (!resume) {
      return NextResponse.json<APIResponse<never>>({ success: false, error: "Resume not found" }, { status: 404 });
    }

    if (resume.userId !== payload.userId) {
      return NextResponse.json<APIResponse<never>>({ success: false, error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json<APIResponse<Resume>>({ success: true, data: resume });
  } catch {
    return NextResponse.json<APIResponse<never>>({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
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

    const resume = await getResume(id);
    if (!resume) {
      return NextResponse.json<APIResponse<never>>({ success: false, error: "Resume not found" }, { status: 404 });
    }

    if (resume.userId !== payload.userId) {
      return NextResponse.json<APIResponse<never>>({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const updates = await request.json() as Partial<Resume>;

    // Don't allow changing ownership
    delete (updates as Record<string, unknown>).userId;
    delete (updates as Record<string, unknown>).id;

    const updated = await updateResume(id, updates);

    return NextResponse.json<APIResponse<Resume>>({ success: true, data: updated! });
  } catch {
    return NextResponse.json<APIResponse<never>>({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
