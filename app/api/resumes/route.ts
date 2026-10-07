import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getUser, getUserResumes, createResume } from "@/lib/store";
import { verifyJWT, getAuthCookie } from "@/lib/auth";
import { parseResume, extractResumeData } from "@/lib/resume-parser";
import type { APIResponse, Resume } from "@/types";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/x-pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/docx",
  "application/msword",
  "text/plain",
];

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

    const resumes = await getUserResumes(payload.userId);
    return NextResponse.json<APIResponse<Resume[]>>({ success: true, data: resumes });
  } catch {
    return NextResponse.json<APIResponse<never>>({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

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

    const user = await getUser(payload.userId);
    if (!user) {
      return NextResponse.json<APIResponse<never>>({ success: false, error: "User not found" }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json<APIResponse<never>>({ success: false, error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json<APIResponse<never>>({ success: false, error: "File size must be 5 MB or less" }, { status: 400 });
    }

    const mimeType = file.type || "text/plain";
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      return NextResponse.json<APIResponse<never>>(
        { success: false, error: "Unsupported file type. Upload a PDF, DOCX, or TXT file." },
        { status: 400 }
      );
    }

    // Parse the resume
    const buffer = await file.arrayBuffer();
    const text = await parseResume(buffer, mimeType);
    const parsedData = extractResumeData(text);

    const resume: Resume = {
      id: uuidv4(),
      userId: user.id,
      filename: file.name,
      text,
      parsedData,
      createdAt: new Date().toISOString(),
    };

    await createResume(resume);

    return NextResponse.json<APIResponse<Resume>>({ success: true, data: resume }, { status: 201 });
  } catch (err) {
    console.error("Resume upload error:", err);
    return NextResponse.json<APIResponse<never>>({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
