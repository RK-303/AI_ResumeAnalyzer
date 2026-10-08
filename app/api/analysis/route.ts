import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { getResume, createAnalysis, addProgressEntry, getUserAnalyses } from "@/lib/store";
import { verifyJWT, getAuthCookie } from "@/lib/auth";
import { analyzeResume } from "@/lib/mock-analyzer";
import type { APIResponse, Analysis } from "@/types";
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
    const analyses = await getUserAnalyses(payload.userId);
    return NextResponse.json<APIResponse<Analysis[]>>({ success: true, data: analyses });
  } catch (err) {
    console.error("GET /api/analysis error:", err);
    return NextResponse.json<APIResponse<never>>({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

const analysisSchema = z.object({
  resumeId: z.string().min(1, "Resume ID is required"),
  jobDescription: z.string().min(10, "Job description must be at least 10 characters"),
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
    const parsed = analysisSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json<APIResponse<never>>(
        { success: false, error: parsed.error.issues[0]?.message ?? "Validation failed" },
        { status: 400 }
      );
    }

    const { resumeId, jobDescription, targetRole } = parsed.data;

    // Fetch the resume
    const resume = await getResume(resumeId);
    if (!resume) {
      return NextResponse.json<APIResponse<never>>({ success: false, error: "Resume not found" }, { status: 404 });
    }

    if (resume.userId !== payload.userId) {
      return NextResponse.json<APIResponse<never>>({ success: false, error: "Forbidden" }, { status: 403 });
    }

    // Run the mock analyzer
    const analysis: Analysis = {
      ...analyzeResume(resume.text, jobDescription, targetRole, payload.userId, resumeId),
      id: uuidv4(),
      userId: payload.userId,
      resumeId,
    };

    await createAnalysis(analysis);

    // Record progress
    const progressEntry: ProgressEntry = {
      id: uuidv4(),
      userId: payload.userId,
      resumeId,
      analysisId: analysis.id,
      targetRole: analysis.targetRole,
      overallScore: analysis.overallScore,
      atsScore: analysis.atsScore,
      jobMatchScore: analysis.jobMatchScore,
      skillsScore: analysis.skillsScore,
      createdAt: analysis.createdAt,
    };

    await addProgressEntry(payload.userId, progressEntry);

    return NextResponse.json<APIResponse<{ analysisId: string }>>(
      { success: true, data: { analysisId: analysis.id } },
      { status: 201 }
    );
  } catch (err) {
    console.error("Analysis error:", err);
    return NextResponse.json<APIResponse<never>>({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
