"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Target } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OverallScore } from "@/components/analysis/OverallScore";
import { ATSAnalysis } from "@/components/analysis/ATSAnalysis";
import { SkillGapAnalysis } from "@/components/analysis/SkillGapAnalysis";
import { ContentAnalysis } from "@/components/analysis/ContentAnalysis";
import { ImprovementSuggestions } from "@/components/analysis/ImprovementSuggestions";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { ProjectRecommendation } from "@/components/resources/ProjectRecommendation";
import { RecommendedActions } from "@/components/dashboard/RecommendedActions";
import { LoadingState } from "@/components/common/LoadingState";
import type { Analysis, APIResponse } from "@/types";

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function AnalysisDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchAnalysis = async () => {
      try {
        const res = await fetch(`/api/analysis/${id}`, {
          credentials: "include",
        });
        const json = (await res.json()) as APIResponse<Analysis>;

        if (json.success && json.data) {
          setAnalysis(json.data);
        } else {
          setError(json.error ?? "Analysis not found");
        }
      } catch {
        setError("Failed to load analysis. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    void fetchAnalysis();
  }, [id]);

  if (loading) {
    return <LoadingState message="Loading analysis report..." showSteps={false} />;
  }

  if (error || !analysis) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
        <p className="text-destructive text-sm">{error ?? "Analysis not found"}</p>
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button + header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <Button variant="ghost" size="sm" className="w-fit gap-1.5" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analysis Report</h1>
          <div className="flex flex-wrap items-center gap-3 mt-1">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Target className="h-4 w-4" />
              <span>{analysis.targetRole}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(analysis.createdAt)}</span>
            </div>
          </div>
        </div>
        <Badge
          className="text-base px-4 py-1 shrink-0"
          variant={
            analysis.overallScore >= 70
              ? "default"
              : analysis.overallScore >= 50
              ? "secondary"
              : "destructive"
          }
        >
          {analysis.overallScore}/100
        </Badge>
      </div>

      {/* 6-tab layout */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto gap-1 p-1">
          <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
          <TabsTrigger value="ats" className="text-xs">ATS Report</TabsTrigger>
          <TabsTrigger value="skills" className="text-xs">Skill Gaps</TabsTrigger>
          <TabsTrigger value="content" className="text-xs">Content</TabsTrigger>
          <TabsTrigger value="improvements" className="text-xs">Improvements</TabsTrigger>
          <TabsTrigger value="resources" className="text-xs">Resources</TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <OverallScore
            overallScore={analysis.overallScore}
            atsScore={analysis.atsScore}
            jobMatchScore={analysis.jobMatchScore}
            skillsScore={analysis.skillsScore}
            contentScore={analysis.contentScore}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
              <h3 className="text-sm font-semibold text-emerald-400 mb-3">
                ✓ Strengths
              </h3>
              <ul className="space-y-2">
                {analysis.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <span className="text-emerald-400 mt-0.5 shrink-0">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
              <h3 className="text-sm font-semibold text-red-400 mb-3">
                ✗ Areas to Improve
              </h3>
              <ul className="space-y-2">
                {analysis.weaknesses.map((w, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <span className="text-red-400 mt-0.5 shrink-0">•</span>
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <RecommendedActions
            actions={analysis.careerActions.map((text) => ({ text }))}
            title="Recommended Next Steps"
          />
        </TabsContent>

        {/* Tab 2: ATS Report */}
        <TabsContent value="ats" className="mt-6">
          <ATSAnalysis checks={analysis.atsSuggestions} />
        </TabsContent>

        {/* Tab 3: Skill Gaps */}
        <TabsContent value="skills" className="mt-6">
          <SkillGapAnalysis skillGaps={analysis.skillGaps} />
        </TabsContent>

        {/* Tab 4: Content */}
        <TabsContent value="content" className="mt-6">
          <ContentAnalysis suggestions={analysis.contentSuggestions} />
        </TabsContent>

        {/* Tab 5: Improvements */}
        <TabsContent value="improvements" className="mt-6">
          <ImprovementSuggestions suggestions={analysis.contentSuggestions} />
        </TabsContent>

        {/* Tab 6: Resources */}
        <TabsContent value="resources" className="space-y-8 mt-6">
          {/* Resources grouped by skill */}
          <div>
            <h2 className="text-base font-semibold text-foreground mb-4">
              Learning Resources
            </h2>
            {analysis.resources.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {analysis.resources.map((resource, i) => (
                  <ResourceCard key={i} resource={resource} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No resources available for this analysis.
              </p>
            )}
          </div>

          {/* Project recommendations */}
          <div>
            <h2 className="text-base font-semibold text-foreground mb-4">
              Recommended Projects
            </h2>
            {analysis.projects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {analysis.projects.map((project, i) => (
                  <ProjectRecommendation key={i} project={project} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No project recommendations available.
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
