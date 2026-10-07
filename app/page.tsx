import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Hero } from "@/components/landing/Hero";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { USPSection } from "@/components/landing/USPSection";
import { LandingCTA } from "@/components/landing/LandingCTA";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "AI Resume Analyzer — Turn Your Resume Into Your Career Roadmap",
  description:
    "AI-powered resume analysis, ATS checking, skill-gap detection and personalized recommendations — all in one place. Don't just fix your resume. Become a stronger candidate.",
};

function LandingNav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-transparent bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-foreground">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="hidden sm:inline text-sm font-semibold">
              AI Resume Analyzer
            </span>
          </Link>

          {/* Right side buttons */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function HomePage() {
  return (
    <>
      <LandingNav />
      {/* pt-16 to offset the fixed navbar */}
      <main className="pt-16">
        <Hero />
        <ProblemSection />
        <HowItWorks />
        <Features />
        <USPSection />
        <LandingCTA />
      </main>
      <Footer />
    </>
  );
}
