"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { ProgressChart } from "@/components/dashboard/ProgressChart";
import { SkillBar } from "@/components/dashboard/SkillBar";
import { LoadingState } from "@/components/common/LoadingState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { APIResponse } from "@/types";

interface ProgressEntry {
  id: string;
  userId: string;
  resumeId: string;
  analysisId: string;
  targetRole: string;
  overallScore: number;
  atsScore: number;
  jobMatchScore: number;
  skillsScore: number;
  createdAt: string;
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function ProgressPage() {
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await fetch("/api/progress", { credentials: "include" });
        const json = (await res.json()) as APIResponse<ProgressEntry[]>;
        if (json.success && json.data) {
          setEntries(json.data);
        }
      } catch {
        // ignore — show empty state
      } finally {
        setLoading(false);
      }
    };

    void fetchProgress();
  }, []);

  if (loading) {
    return <LoadingState message="Loading progress..." showSteps={false} />;
  }

  // Build chart data
  const chartData = entries.map((e) => ({
    date: formatDate(e.createdAt),
    score: e.overallScore,
    atsScore: e.atsScore,
    skillsScore: e.skillsScore,
  }));

  // Calculate delta from previous analysis
  const delta =
    entries.length >= 2
      ? entries[entries.length - 1].overallScore -
        entries[entries.length - 2].overallScore
      : null;

  const latest = entries[entries.length - 1];
  const previous = entries[entries.length - 2];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Progress</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Track your resume score improvement over time.
        </p>
      </div>

      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 text-center">
          <TrendingUp className="h-12 w-12 text-muted-foreground" />
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              No progress data yet
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Complete an analysis to start tracking your improvement.
            </p>
          </div>
          <Button asChild>
            <Link href="/analyze">Start First Analysis</Link>
          </Button>
        </div>
      ) : (
        <>
          {/* Delta badge */}
          {delta !== null && (
            <div
              className={cn(
                "inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium",
                delta > 0
                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                  : delta < 0
                  ? "border-red-500/20 bg-red-500/10 text-red-400"
                  : "border-border bg-muted text-muted-foreground"
              )}
            >
              {delta > 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : delta < 0 ? (
                <TrendingDown className="h-4 w-4" />
              ) : (
                <Minus className="h-4 w-4" />
              )}
              {delta > 0 ? "+" : ""}
              {delta} points from last analysis
            </div>
          )}

          {/* Line chart */}
          <ProgressChart
            data={chartData}
            title="Score History"
          />

          {/* Comparison cards — only if 2+ analyses */}
          {entries.length >= 2 && latest && previous && (
            <div>
              <h2 className="text-base font-semibold text-foreground mb-4">
                Score Comparison
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    label: "Overall Score",
                    prev: previous.overallScore,
                    curr: latest.overallScore,
                  },
                  {
                    label: "ATS Score",
                    prev: previous.atsScore,
                    curr: latest.atsScore,
                  },
                  {
                    label: "Job Match",
                    prev: previous.jobMatchScore,
                    curr: latest.jobMatchScore,
                  },
                  {
                    label: "Skills Match",
                    prev: previous.skillsScore,
                    curr: latest.skillsScore,
                  },
                ].map((metric) => {
                  const d = metric.curr - metric.prev;
                  return (
                    <Card key={metric.label}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">{metric.label}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <SkillBar
                          skillName="Previous"
                          current={metric.prev}
                        />
                        <SkillBar
                          skillName="Current"
                          current={metric.curr}
                        />
                        <p
                          className={cn(
                            "text-xs font-medium",
                            d > 0
                              ? "text-emerald-400"
                              : d < 0
                              ? "text-red-400"
                              : "text-muted-foreground"
                          )}
                        >
                          {d > 0 ? "+" : ""}
                          {d} points
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Single analysis — encourage re-analysis */}
          {entries.length === 1 && (
            <Card>
              <CardContent className="py-8 text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  Complete a second analysis after improving your resume to see
                  your progress.
                </p>
                <Button asChild>
                  <Link href="/analyze">Analyze Again</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
