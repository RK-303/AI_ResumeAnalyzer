import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login — AI Resume Analyzer",
  description: "Sign in to your AI Resume Analyzer account to access your resume analysis and career roadmap.",
};

export default function LoginPage() {
  return <LoginForm />;
}
