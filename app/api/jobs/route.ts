import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { createJob } from "@/lib/store";
import { verifyJWT, getAuthCookie } from "@/lib/auth";
import type { APIResponse } from "@/types";
import type { JobDescription } from "@/lib/store";

const jobSchema = z.object({
  description: z.string().min(10, "Job description must be at least 10 characters"),
  targetRole: z.string().min(2, "Target role is required"),
});

export async function POST(request: NextRequest) {
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
    const parsed = jobSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json<APIResponse<never>>(
        { success: false, error: parsed.error.issues[0]?.message ?? "Validation failed" },
        { status: 400 }
      );
    }

    const { description, targetRole } = parsed.data;

    const job: JobDescription = {
      id: uuidv4(),
      userId: payload.userId,
      description,
      targetRole,
      createdAt: new Date().toISOString(),
    };

    await createJob(job);

    return NextResponse.json<APIResponse<JobDescription>>({ success: true, data: job }, { status: 201 });
  } catch {
    return NextResponse.json<APIResponse<never>>({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
