import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { getUserByEmail, createUser } from "@/lib/store";
import { signJWT, setAuthCookie } from "@/lib/auth";
import type { APIResponse, AuthUser } from "@/types";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      const response: APIResponse<never> = {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Validation failed",
      };
      return NextResponse.json(response, { status: 400 });
    }

    const { email, name, password } = parsed.data;

    // Check if email is already taken
    const existing = await getUserByEmail(email);
    if (existing) {
      const response: APIResponse<never> = {
        success: false,
        error: "An account with this email already exists",
      };
      return NextResponse.json(response, { status: 409 });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const userId = uuidv4();
    const user = await createUser(userId, email, name, passwordHash);

    // Sign JWT and set cookie
    const token = signJWT(user.id);
    const authUser: AuthUser = { id: user.id, email: user.email, name: user.name };

    const response: APIResponse<{ user: AuthUser }> = {
      success: true,
      data: { user: authUser },
    };

    const res = NextResponse.json(response, { status: 201 });
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
