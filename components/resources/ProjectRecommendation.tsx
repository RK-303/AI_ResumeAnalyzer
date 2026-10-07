import React from "react";
import { Clock, Zap, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ProjectRecommendation as ProjectRecommendationType } from "@/types";
import { cn } from "@/lib/utils";

interface ProjectRecommendationProps {
  project: ProjectRecommendationType;
  onAddToPlan?: (project: ProjectRecommendationType) => void;
  className?: string;
}

export function ProjectRecommendation({
  project,
  onAddToPlan,
  className,
}: ProjectRecommendationProps) {
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardContent className="p-4 flex flex-col gap-3 flex-1">
        {/* Title */}
        <div>
          <h3 className="text-sm font-semibold text-foreground">{project.title}</h3>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Tech stack */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1.5">
            Tech Stack
          </p>
          <div className="flex flex-wrap gap-1">
            {project.techStack.map((tech, i) => (
              <Badge key={i} variant="secondary" className="text-xs px-2 py-0">
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {project.estimatedTime}
          </span>
        </div>

        {/* Resume impact */}
        <div className="flex items-start gap-2 rounded-md bg-primary/5 border border-primary/10 p-2.5">
          <Zap className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="text-foreground font-medium">Resume impact: </span>
            {project.resumeImpact}
          </p>
        </div>

        {/* Add to Plan button */}
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-1.5 text-xs mt-auto"
          onClick={() => onAddToPlan?.(project)}
        >
          <Plus className="h-3.5 w-3.5" />
          Add to Plan
        </Button>
      </CardContent>
    </Card>
  );
}
