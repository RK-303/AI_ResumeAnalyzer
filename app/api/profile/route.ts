import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getUser, updateUser } from "@/lib/store";
import { verifyJWT, getAuthCookie } from "@/lib/auth";
import type { APIResponse, User } from "@/types";

const profileUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  targetRole: z.string().min(2, "Target role must be at least 2 characters").optional(),
});

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

    const user = await getUser(payload.userId);
    if (!user) {
      return NextResponse.json<APIResponse<never>>({ success: false, error: "User not found" }, { status: 404 });
    }

    const profile: User = {
      id: user.id,
      email: user.email,
      name: user.name,
      targetRole: user.targetRole,
      createdAt: user.createdAt,
    };

    return NextResponse.json<APIResponse<User>>({ success: true, data: profile });
  } catch {
    return NextResponse.json<APIResponse<never>>({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = getAuthCookie(request);
    if (!token) {
      return NextResponse.json<APIResponse<never>>({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    const payload = verifyJWT(token);
    if (!payload) {
      return NextResponse.json<APIResponse<never>>({ success: false, error: "Invalid token" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = profileUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json<APIResponse<never>>(
        { success: false, error: parsed.error.issues[0]?.message ?? "Validation failed" },
        { status: 400 }
      );
    }

    const updated = await updateUser(payload.userId, parsed.data);
    if (!updated) {
      return NextResponse.json<APIResponse<never>>({ success: false, error: "User not found" }, { status: 404 });
    }

    const profile: User = {
      id: updated.id,
      email: updated.email,
      name: updated.name,
      targetRole: updated.targetRole,
      createdAt: updated.createdAt,
    };

    return NextResponse.json<APIResponse<User>>({ success: true, data: profile });
  } catch {
    return NextResponse.json<APIResponse<never>>({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
