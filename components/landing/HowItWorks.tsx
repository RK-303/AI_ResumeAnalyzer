import React from "react";
import { Upload, Briefcase, Brain, TrendingUp } from "lucide-react";

const steps = [
  {
    number: 1,
    icon: Upload,
    title: "Upload Resume",
    description:
      "Upload your resume in PDF, DOCX, or TXT format. We'll parse and extract all key information automatically.",
  },
  {
    number: 2,
    icon: Briefcase,
    title: "Add Target Job",
    description:
      "Paste a job description or select a target role. This gives us the benchmark to compare your resume against.",
  },
  {
    number: 3,
    icon: Brain,
    title: "Get AI Analysis",
    description:
      "Our AI checks ATS compatibility, skill gaps, content quality, and keyword alignment — in seconds.",
  },
  {
    number: 4,
    icon: TrendingUp,
    title: "Improve & Re-analyze",
    description:
      "Follow the personalized action plan, update your resume, and re-analyze to track your score improvement.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            From upload to action plan in four simple steps. No fluff, just
            results.
          </p>
        </div>

        {/* Desktop: horizontal with arrows */}
        <div className="hidden lg:grid grid-cols-4 gap-0 items-start">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isLast = idx === steps.length - 1;
            return (
              <div key={step.number} className="relative flex flex-col items-center text-center px-4">
                {/* Connecting arrow */}
                {!isLast && (
                  <div className="absolute top-8 left-[calc(50%+2.5rem)] w-[calc(100%-5rem)] h-px bg-gradient-to-r from-primary/50 to-primary/10 z-0" />
                )}

                {/* Number + icon circle */}
                <div className="relative z-10 flex flex-col items-center mb-4">
                  <div className="relative h-16 w-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-2 shadow-lg shadow-primary/10">
                    <Icon className="h-7 w-7 text-primary" />
                    <div className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                      {step.number}
                    </div>
                  </div>
                </div>

                <h3 className="text-base font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Mobile: vertical list */}
        <div className="lg:hidden space-y-0">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isLast = idx === steps.length - 1;
            return (
              <div key={step.number} className="flex gap-4">
                {/* Left: number + vertical line */}
                <div className="flex flex-col items-center">
                  <div className="relative h-12 w-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                    <div className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                      {step.number}
                    </div>
                  </div>
                  {!isLast && <div className="w-px flex-1 bg-border my-2" />}
                </div>

                {/* Right: content */}
                <div className="pb-8">
                  <h3 className="text-base font-semibold text-foreground mb-1 mt-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
