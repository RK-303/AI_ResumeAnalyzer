import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingCTA() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

      {/* Decorative blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-3xl rounded-full pointer-events-none" />

      <div className="relative max-w-3xl mx-auto text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary/20 border border-primary/30 mb-6 mx-auto">
          <Sparkles className="h-7 w-7 text-primary" />
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-4 leading-tight">
          Ready to become a{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            stronger candidate?
          </span>
        </h2>

        <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
          Upload your resume, get your score, find your gaps, and walk away with
          a clear plan — in under 2 minutes.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button size="lg" asChild className="text-base px-8">
            <Link href="/register">
              Analyze Your Resume
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild className="text-base">
            <Link href="/register">Sign Up Free</Link>
          </Button>
        </div>

        {/* Fine print */}
        <p className="mt-4 text-xs text-muted-foreground">
          No credit card required · Free to start · Demo available
        </p>
      </div>
    </section>
  );
}
