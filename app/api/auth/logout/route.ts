import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";
import type { APIResponse } from "@/types";

export async function POST(_request: NextRequest) {
  const response: APIResponse<null> = {
    success: true,
    data: null,
  };
  const res = NextResponse.json(response);
  clearAuthCookie(res);
  return res;
}
