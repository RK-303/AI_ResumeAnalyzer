"use client";

import React from "react";
import { ScoreRing } from "@/components/dashboard/ScoreRing";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DimensionScore {
  label: string;
  score: number;
  color?: string;
}

interface OverallScoreProps {
  overallScore: number;
  atsScore: number;
  jobMatchScore: number;
  skillsScore: number;
  contentScore: number;
  className?: string;
}

function scoreColor(score: number): string {
  if (score < 50) return "bg-red-500";
  if (score < 70) return "bg-amber-500";
  return "bg-emerald-500";
}

function scoreLabel(score: number): string {
  if (score < 50) return "Needs Work";
  if (score < 70) return "Fair";
  if (score < 85) return "Good";
  return "Excellent";
}

export function OverallScore({
  overallScore,
  atsScore,
  jobMatchScore,
  skillsScore,
  contentScore,
  className,
}: OverallScoreProps) {
  const dimensions: DimensionScore[] = [
    { label: "ATS Compatibility", score: atsScore },
    { label: "Job Match", score: jobMatchScore },
    { label: "Skills Coverage", score: skillsScore },
    { label: "Content Quality", score: contentScore },
  ];

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Overall Score</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center gap-8">
          {/* Ring */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            <ScoreRing score={overallScore} size={140} strokeWidth={12} />
            <span
              className={cn(
                "text-sm font-semibold",
                overallScore < 50
                  ? "text-red-400"
                  : overallScore < 70
                  ? "text-amber-400"
                  : "text-emerald-400"
              )}
            >
              {scoreLabel(overallScore)}
            </span>
          </div>

          {/* Dimension bars */}
          <div className="flex-1 w-full space-y-4">
            {dimensions.map((dim) => (
              <div key={dim.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{dim.label}</span>
                  <span
                    className={cn(
                      "font-semibold tabular-nums",
                      dim.score < 50
                        ? "text-red-400"
                        : dim.score < 70
                        ? "text-amber-400"
                        : "text-emerald-400"
                    )}
                  >
                    {dim.score}%
                  </span>
                </div>
                <Progress
                  value={dim.score}
                  className="h-2"
                  indicatorClassName={scoreColor(dim.score)}
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
