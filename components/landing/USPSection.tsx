import React from "react";
import Link from "next/link";
import { X, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function USPSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-3xl rounded-full pointer-events-none" />

      <div className="relative max-w-5xl mx-auto">
        {/* Headline */}
        <div className="text-center mb-14">
          <p className="text-primary text-sm font-medium mb-3 uppercase tracking-wider">
            The Difference
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight mb-6">
            Most tools tell you{" "}
            <span className="text-muted-foreground">what is wrong.</span>
            <br />
            We tell you{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              what to do next.
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            A resume score without an action plan is just a number. We give you
            the score — and the roadmap to improve it.
          </p>
        </div>

        {/* Comparison card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {/* Other tools side */}
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-7 w-7 rounded-full bg-destructive/20 flex items-center justify-center">
                <X className="h-4 w-4 text-destructive" />
              </div>
              <h3 className="font-semibold text-foreground">Other Tools</h3>
            </div>

            <div className="space-y-3">
              {[
                "You are missing SQL.",
                "Your resume score is 65/100.",
                "Add more keywords.",
                "You have formatting issues.",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <X className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-xs text-muted-foreground italic">
                &ldquo;…and that&apos;s it. Figure out the rest yourself.&rdquo;
              </p>
            </div>
          </div>

          {/* Our tool side */}
          <div className="rounded-2xl border border-primary/40 bg-primary/5 p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">AI Resume Analyzer</h3>
            </div>

            <div className="space-y-3">
              {[
                "SQL is required for your target Data Analyst role. It appears in 89% of postings.",
                "Your score is 65/100 because of 3 specific issues — here's how to fix each.",
                "Add these 7 exact keywords from the job description, in these specific sections.",
                "Your formatting issue is in the Experience section. Here's the corrected version.",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 p-3 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-xs text-primary font-medium">
                &ldquo;Learn SQL fundamentals (2 weeks), complete a SQL analysis
                project, then add it to your resume.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button size="lg" asChild className="text-base">
            <Link href="/register">
              See It In Action
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
