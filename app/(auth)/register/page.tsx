import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create Account — AI Resume Analyzer",
  description: "Create your free AI Resume Analyzer account. Get your resume score, skill gap analysis, and personalized career roadmap in minutes.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
