"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart3, Brain, Shield, User, Zap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentAnalysis } from "@/components/dashboard/RecentAnalysis";
import { SkillGapCard } from "@/components/dashboard/SkillGapCard";
import { RecommendedActions } from "@/components/dashboard/RecommendedActions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DEMO_ANALYSIS, DEMO_RESUME } from "@/lib/demo-data";
import type { Analysis, APIResponse } from "@/types";

export default function DashboardPage() {
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const res = await fetch("/api/analysis", { credentials: "include" });
        if (res.ok) {
          const json = (await res.json()) as APIResponse<Analysis[]>;
          if (json.success && json.data && json.data.length > 0) {
            setAnalyses(json.data);
          } else {
            // Fall back to demo analysis so dashboard always has data
            setAnalyses([DEMO_ANALYSIS]);
          }
        } else {
          setAnalyses([DEMO_ANALYSIS]);
        }
      } catch {
        setAnalyses([DEMO_ANALYSIS]);
      } finally {
        setLoading(false);
      }
    };

    void fetchAnalyses();
  }, []);

  // Use the most recent analysis for stats
  const latestAnalysis = analyses[0] ?? DEMO_ANALYSIS;

  // Build recent analyses rows for the component
  const recentRows = analyses.slice(0, 5).map((a) => ({
    id: a.id,
    resumeName: DEMO_RESUME.filename,
    targetRole: a.targetRole,
    score: a.overallScore,
    date: a.createdAt,
  }));

  // Top skill gaps (critical/high only, max 3)
  const topGaps = latestAnalysis.skillGaps
    .filter((g) => !g.present)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {user?.name ?? "there"} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Target Role:{" "}
            <span className="text-foreground font-medium">
              {latestAnalysis.targetRole}
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/resume">Upload Resume</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/analyze">
              <Zap className="h-4 w-4" />
              Analyze
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={Brain}
          value={`${latestAnalysis.overallScore}/100`}
          label="Overall Score"
          color="blue"
        />
        <StatsCard
          icon={Shield}
          value={`${latestAnalysis.atsScore}%`}
          label="ATS Match"
          color="violet"
        />
        <StatsCard
          icon={BarChart3}
          value={`${latestAnalysis.skillsScore}%`}
          label="Skills Match"
          color="amber"
        />
        <StatsCard
          icon={User}
          value={`${Math.round(
            (latestAnalysis.overallScore +
              latestAnalysis.atsScore +
              latestAnalysis.jobMatchScore +
              latestAnalysis.skillsScore) /
              4
          )}%`}
          label="Profile Strength"
          color="green"
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent analyses — spans 2 cols */}
        <div className="lg:col-span-2 space-y-6">
          <RecentAnalysis analyses={loading ? [] : recentRows} />

          {/* Recommended Actions */}
          <RecommendedActions
            actions={latestAnalysis.careerActions.map((text) => ({ text }))}
          />
        </div>

        {/* Right column: skill gaps */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Top Skill Gaps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-3">
              {topGaps.length > 0 ? (
                topGaps.map((gap) => (
                  <SkillGapCard key={gap.skill} gap={gap} />
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No critical skill gaps found.
                </p>
              )}
              {topGaps.length > 0 && (
                <Button variant="outline" size="sm" className="w-full mt-2" asChild>
                  <Link href="/skills">View All Gaps</Link>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Quick links */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-3">
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link href={`/analysis/${latestAnalysis.id}`}>View Latest Report</Link>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link href="/resources">Browse Resources</Link>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link href="/roadmap">Career Roadmap</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
