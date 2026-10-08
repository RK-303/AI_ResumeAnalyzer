"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { SkillGapCard } from "@/components/dashboard/SkillGapCard";
import { SkillBar } from "@/components/dashboard/SkillBar";
import { ScoreRing } from "@/components/dashboard/ScoreRing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingState } from "@/components/common/LoadingState";
import { DEMO_ANALYSIS } from "@/lib/demo-data";
import type { Analysis, APIResponse } from "@/types";

export default function SkillsPage() {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch("/api/analysis", { credentials: "include" });
        const json = (await res.json()) as APIResponse<Analysis[]>;
        if (json.success && json.data && json.data.length > 0) {
          setAnalysis(json.data[0]);
        } else {
          setAnalysis(DEMO_ANALYSIS);
        }
      } catch {
        setAnalysis(DEMO_ANALYSIS);
      } finally {
        setLoading(false);
      }
    };

    void fetchLatest();
  }, []);

  if (loading) {
    return <LoadingState message="Loading skill profile..." showSteps={false} />;
  }

  const data = analysis ?? DEMO_ANALYSIS;
  const criticalGaps = data.skillGaps.filter(
    (g) => !g.present && g.importance === "critical"
  );
  const allGaps = data.skillGaps;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Skill Profile</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Skills analysis for{" "}
            <span className="text-foreground font-medium">{data.targetRole}</span>
          </p>
        </div>
        <Button size="sm" asChild>
          <Link href="/resources">Start Learning</Link>
        </Button>
      </div>

      {/* Overall skill match */}
      <div className="flex flex-col sm:flex-row items-center gap-6 rounded-xl border border-border bg-card p-6">
        <ScoreRing
          score={data.skillsScore}
          size={120}
          strokeWidth={10}
          label="Skills Match"
        />
        <div className="flex-1 space-y-1">
          <h2 className="text-lg font-semibold text-foreground">
            {data.skillsScore}% Skill Match
          </h2>
          <p className="text-sm text-muted-foreground">
            You have {data.skillGaps.filter((g) => g.present).length} of{" "}
            {data.skillGaps.length} required skills for a{" "}
            {data.targetRole} role.
          </p>
          <p className="text-sm text-muted-foreground">
            {criticalGaps.length > 0
              ? `${criticalGaps.length} critical skill${criticalGaps.length > 1 ? "s" : ""} need immediate attention.`
              : "No critical skill gaps detected."}
          </p>
        </div>
      </div>

      {/* All skills with bars */}
      {allGaps.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Skill Coverage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {allGaps.map((gap) => (
              <SkillBar
                key={gap.skill}
                skillName={gap.skill}
                current={gap.present ? gap.matchPercentage || 80 : 0}
                required={100}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Critical gaps detail */}
      {criticalGaps.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-foreground mb-4">
            Critical Gaps — Fix These First
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {criticalGaps.map((gap) => (
              <SkillGapCard key={gap.skill} gap={gap} />
            ))}
          </div>
        </div>
      )}

      {/* High priority gaps */}
      {data.skillGaps.filter((g) => !g.present && g.importance === "high")
        .length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-foreground mb-4">
            High Priority Gaps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.skillGaps
              .filter((g) => !g.present && g.importance === "high")
              .map((gap) => (
                <SkillGapCard key={gap.skill} gap={gap} />
              ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/resources">Browse Learning Resources</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/roadmap">View Career Roadmap</Link>
        </Button>
      </div>
    </div>
  );
}
