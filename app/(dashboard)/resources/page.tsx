"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { ProjectRecommendation } from "@/components/resources/ProjectRecommendation";
import { LoadingState } from "@/components/common/LoadingState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DEMO_ANALYSIS } from "@/lib/demo-data";
import type { Analysis, Resource, APIResponse } from "@/types";

type ResourceType = "all" | "course" | "article" | "video" | "book" | "practice";
type FreeFilter = "all" | "free" | "paid";

export default function ResourcesPage() {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);

  const [skillFilter, setSkillFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<ResourceType>("all");
  const [freeFilter, setFreeFilter] = useState<FreeFilter>("all");

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

  const data = analysis ?? DEMO_ANALYSIS;

  // Unique skills from resources
  const availableSkills = useMemo(() => {
    const skills = new Set<string>();
    data.resources.forEach((r) => skills.add(r.skill));
    return Array.from(skills);
  }, [data.resources]);

  // Filter resources
  const filteredResources = useMemo(() => {
    return data.resources.filter((r: Resource) => {
      if (skillFilter !== "all" && r.skill !== skillFilter) return false;
      if (typeFilter !== "all" && r.type !== typeFilter) return false;
      if (freeFilter === "free" && !r.free) return false;
      if (freeFilter === "paid" && r.free) return false;
      return true;
    });
  }, [data.resources, skillFilter, typeFilter, freeFilter]);

  if (loading) {
    return <LoadingState message="Loading resources..." showSteps={false} />;
  }

  const resourceTypes: ResourceType[] = ["all", "course", "article", "video", "book", "practice"];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Learning Resources</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Curated resources to close your skill gaps for{" "}
          <span className="text-foreground font-medium">{data.targetRole}</span>
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3">
        {/* Skill filter */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-xs text-muted-foreground font-medium">Skill:</span>
          <Button
            variant={skillFilter === "all" ? "default" : "outline"}
            size="sm"
            className="h-7 text-xs"
            onClick={() => setSkillFilter("all")}
          >
            All
          </Button>
          {availableSkills.map((skill) => (
            <Button
              key={skill}
              variant={skillFilter === skill ? "default" : "outline"}
              size="sm"
              className="h-7 text-xs"
              onClick={() => setSkillFilter(skill)}
            >
              {skill}
            </Button>
          ))}
        </div>

        {/* Type filter */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-xs text-muted-foreground font-medium">Type:</span>
          {resourceTypes.map((type) => (
            <Button
              key={type}
              variant={typeFilter === type ? "secondary" : "ghost"}
              size="sm"
              className="h-7 text-xs capitalize"
              onClick={() => setTypeFilter(type)}
            >
              {type}
            </Button>
          ))}
        </div>

        {/* Free/Paid */}
        <div className="flex gap-1.5 items-center">
          <span className="text-xs text-muted-foreground font-medium">Cost:</span>
          {(["all", "free", "paid"] as FreeFilter[]).map((f) => (
            <Button
              key={f}
              variant={freeFilter === f ? "secondary" : "ghost"}
              size="sm"
              className="h-7 text-xs capitalize"
              onClick={() => setFreeFilter(f)}
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="text-xs">
          {filteredResources.length} resource{filteredResources.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      {/* Resource grid */}
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((resource, i) => (
            <ResourceCard key={i} resource={resource} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-sm">No resources match the selected filters.</p>
          <Button
            variant="link"
            size="sm"
            className="mt-2"
            onClick={() => {
              setSkillFilter("all");
              setTypeFilter("all");
              setFreeFilter("all");
            }}
          >
            Clear filters
          </Button>
        </div>
      )}

      {/* Project recommendations */}
      {data.projects.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-foreground mb-4">
            Recommended Projects
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Build these projects to demonstrate the skills you&apos;re learning and
            strengthen your portfolio.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.projects.map((project, i) => (
              <ProjectRecommendation key={i} project={project} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
