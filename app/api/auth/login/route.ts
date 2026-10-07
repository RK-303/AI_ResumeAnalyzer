import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/lib/store";
import { signJWT, setAuthCookie } from "@/lib/auth";
import type { APIResponse, AuthUser } from "@/types";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      const response: APIResponse<never> = {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Validation failed",
      };
      return NextResponse.json(response, { status: 400 });
    }

    const { email, password } = parsed.data;

    // Look up user
    const user = await getUserByEmail(email);
    if (!user) {
      const response: APIResponse<never> = {
        success: false,
        error: "Invalid credentials",
      };
      return NextResponse.json(response, { status: 401 });
    }

    // Compare password
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      const response: APIResponse<never> = {
        success: false,
        error: "Invalid credentials",
      };
      return NextResponse.json(response, { status: 401 });
    }

    // Sign JWT and set cookie
    const token = signJWT(user.id);
    const authUser: AuthUser = { id: user.id, email: user.email, name: user.name };

    const response: APIResponse<{ user: AuthUser }> = {
      success: true,
      data: { user: authUser },
    };

    const res = NextResponse.json(response);
    setAuthCookie(res, token);
    return res;
  } catch {
    const response: APIResponse<never> = {
      success: false,
      error: "Internal server error",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
