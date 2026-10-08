"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { RoadmapStep } from "@/components/roadmap/RoadmapStep";
import { LoadingState } from "@/components/common/LoadingState";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DEMO_ANALYSIS } from "@/lib/demo-data";
import type { Analysis, APIResponse } from "@/types";

export default function RoadmapPage() {
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
    return <LoadingState message="Building your roadmap..." showSteps={false} />;
  }

  const data = analysis ?? DEMO_ANALYSIS;

  // Build the 5-stage roadmap from analysis data
  const criticalGaps = data.skillGaps.filter(
    (g) => !g.present && g.importance === "critical"
  );
  const highGaps = data.skillGaps.filter(
    (g) => !g.present && g.importance === "high"
  );
  const mediumGaps = data.skillGaps.filter(
    (g) => !g.present && g.importance === "medium"
  );

  const stages = [
    {
      stepNumber: 1,
      stageName: "Foundation — Close Critical Gaps",
      tasks: [
        ...criticalGaps.slice(0, 3).map((g) => ({
          text: `Learn ${g.skill}: ${g.whatToDo.substring(0, 80)}...`,
          completed: false,
        })),
        {
          text: "Complete at least one hands-on project for each critical skill",
          completed: false,
        },
      ],
      estimatedTimeline: "2–4 weeks",
      current: true,
      completed: false,
    },
    {
      stepNumber: 2,
      stageName: "Skill Building — Address High-Priority Gaps",
      tasks: [
        ...highGaps.slice(0, 3).map((g) => ({
          text: `Learn ${g.skill}: ${g.whatToDo.substring(0, 80)}...`,
          completed: false,
        })),
        {
          text: "Earn a relevant certification (Coursera, LinkedIn Learning, etc.)",
          completed: false,
        },
        ...(mediumGaps.length > 0
          ? [{ text: `Start exploring: ${mediumGaps.map((g) => g.skill).join(", ")}`, completed: false }]
          : []),
      ],
      estimatedTimeline: "4–6 weeks",
      current: false,
      completed: false,
    },
    {
      stepNumber: 3,
      stageName: "Portfolio — Build Relevant Projects",
      tasks: data.projects.slice(0, 3).map((p) => ({
        text: `${p.title}: ${p.estimatedTime}`,
        completed: false,
      })),
      estimatedTimeline: "4–8 weeks",
      current: false,
      completed: false,
    },
    {
      stepNumber: 4,
      stageName: "Resume Update — Apply All Improvements",
      tasks: [
        {
          text: "Rewrite all experience bullets to start with strong action verbs",
          completed: false,
        },
        {
          text: "Add measurable achievements to each experience entry",
          completed: false,
        },
        {
          text: "Add completed projects and certifications to your resume",
          completed: false,
        },
        {
          text: "Run a second analysis to verify score improvement",
          completed: false,
        },
        {
          text: "Update your LinkedIn profile to match your resume",
          completed: false,
        },
      ],
      estimatedTimeline: "1–2 weeks",
      current: false,
      completed: false,
    },
    {
      stepNumber: 5,
      stageName: "Job Applications — Submit & Track",
      tasks: [
        {
          text: `Apply to 10–15 ${data.targetRole} positions per week`,
          completed: false,
        },
        {
          text: "Track applications in a spreadsheet or ATS tool",
          completed: false,
        },
        {
          text: "Practice behavioral and technical interview questions",
          completed: false,
        },
        {
          text: "Follow up on applications after 1 week",
          completed: false,
        },
        {
          text: "Iterate on your resume based on response rate",
          completed: false,
        },
      ],
      estimatedTimeline: "Ongoing",
      current: false,
      completed: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Career Roadmap</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Your personalized path to becoming a strong{" "}
            <span className="text-foreground font-medium">{data.targetRole}</span>{" "}
            candidate
          </p>
        </div>
        <Badge variant="outline" className="w-fit">
          Estimated total: 3–5 months
        </Badge>
      </div>

      {/* Timeline */}
      <div className="pl-2">
        {stages.map((stage, index) => (
          <RoadmapStep
            key={stage.stepNumber}
            {...stage}
            isLast={index === stages.length - 1}
          />
        ))}
      </div>

      {/* CTA */}
      <div className="flex gap-3 pt-2">
        <Button asChild>
          <Link href="/resources">Start Learning</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/analyze">Re-analyze Resume</Link>
        </Button>
      </div>
    </div>
  );
}
