import React from "react";
import { HelpCircle, AlertCircle } from "lucide-react";

const problems = [
  {
    icon: HelpCircle,
    question: "Why am I not getting shortlisted?",
    detail: "Most rejections happen before a human ever reads your resume.",
  },
  {
    icon: AlertCircle,
    question: "Is my resume ATS-friendly?",
    detail: "75% of resumes are filtered out by ATS before reaching recruiters.",
  },
  {
    icon: HelpCircle,
    question: "Which skills am I missing?",
    detail: "Job descriptions change fast. Are you keeping up with what employers want?",
  },
  {
    icon: HelpCircle,
    question: "What should I learn next?",
    detail: "Without a clear direction, you risk wasting time on the wrong skills.",
  },
  {
    icon: AlertCircle,
    question: "Are my projects relevant?",
    detail: "Generic side projects rarely impress — role-specific ones do.",
  },
];

export function ProblemSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Sound familiar?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            These are the questions every job seeker struggles with. We built this tool
            to answer all of them — with specifics, not guesses.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {problems.map((problem, idx) => {
            const Icon = problem.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
              >
                {/* Icon */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                </div>

                {/* Question */}
                <h3 className="text-base font-semibold text-foreground mb-2 leading-snug">
                  {problem.question}
                </h3>

                {/* Detail */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {problem.detail}
                </p>

                {/* Hover border accent */}
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-b-xl scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </div>
            );
          })}

          {/* Closing statement card */}
          <div className="rounded-xl border border-primary/40 bg-primary/10 p-6 flex flex-col justify-center sm:col-span-2 lg:col-span-1">
            <p className="text-foreground font-semibold text-lg leading-snug mb-2">
              We have the answers.
            </p>
            <p className="text-muted-foreground text-sm">
              Stop guessing what&apos;s holding you back. Get a clear, actionable
              breakdown of exactly what to fix and what to learn.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
