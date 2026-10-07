"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Mock Dashboard Preview ───────────────────────────────────────────────────

function MockDashboard() {
  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-3xl" />

      <div
        className="relative rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
        style={{ background: "oklch(12% 0.04 252)" }}
      >
        {/* Card header */}
        <div className="px-5 pt-5 pb-3 border-b border-border">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              Resume Score
            </span>
            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">
              Data Analyst
            </span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-primary">78</span>
            <span className="text-muted-foreground text-sm mb-1">/100</span>
          </div>
        </div>

        {/* Metric bars */}
        <div className="px-5 py-4 space-y-3">
          {[
            { label: "ATS Match", value: 72, color: "#22c55e" },
            { label: "Skills Match", value: 68, color: "#f59e0b" },
            { label: "Job Match", value: 81, color: "#3b82f6" },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-semibold" style={{ color: item.color }}>
                  {item.value}%
                </span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${item.value}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Skill gaps */}
        <div className="px-5 pb-4">
          <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">
            Missing Skills
          </p>
          <div className="flex flex-wrap gap-1.5">
            {["SQL", "Power BI", "Statistics", "Tableau"].map((skill) => (
              <span
                key={skill}
                className="text-xs px-2 py-0.5 rounded-full border border-destructive/40 text-destructive bg-destructive/10"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Action items */}
        <div
          className="px-5 py-3 border-t border-border"
          style={{ background: "oklch(10% 0.04 252)" }}
        >
          <p className="text-xs text-muted-foreground mb-2 font-medium">
            Top Recommendations
          </p>
          <div className="space-y-1.5">
            {[
              "Learn SQL fundamentals",
              "Add measurable achievements",
              "Include a data analysis project",
            ].map((action) => (
              <div key={action} className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle className="h-3 w-3 text-primary shrink-0" />
                {action}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 blur-3xl rounded-full pointer-events-none" />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: text content */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              AI-Powered Career Intelligence
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-foreground mb-6">
              Turn Your Resume Into Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Career Roadmap.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl">
              AI-powered resume analysis, ATS checking, skill-gap detection and
              personalized recommendations — all in one place.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" asChild className="text-base">
                <Link href="/register">
                  Analyze My Resume
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="text-base">
                <a href="#how-it-works">See How It Works</a>
              </Button>
            </div>

            {/* Social proof */}
            <div className="mt-8 flex items-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">10k+</p>
                <p className="text-xs text-muted-foreground">Resumes Analyzed</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">94%</p>
                <p className="text-xs text-muted-foreground">Interview Rate</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">4.9★</p>
                <p className="text-xs text-muted-foreground">User Rating</p>
              </div>
            </div>
          </motion.div>

          {/* Right: mock dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="hidden lg:block"
          >
            <MockDashboard />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
