import React from "react";
import { ExternalLink, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Resource } from "@/types";
import { cn } from "@/lib/utils";

interface ResourceCardProps {
  resource: Resource;
  className?: string;
}

const typeColorMap: Record<Resource["type"], string> = {
  course: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  article: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  video: "bg-red-500/10 text-red-400 border-red-500/20",
  book: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  practice: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

const difficultyColorMap: Record<Resource["difficulty"], string> = {
  beginner: "bg-emerald-500/10 text-emerald-400",
  intermediate: "bg-amber-500/10 text-amber-400",
  advanced: "bg-red-500/10 text-red-400",
};

export function ResourceCard({ resource, className }: ResourceCardProps) {
  const typeStyle = typeColorMap[resource.type];
  const diffStyle = difficultyColorMap[resource.difficulty];

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardContent className="p-4 flex flex-col gap-3 flex-1">
        {/* Header badges */}
        <div className="flex flex-wrap gap-1.5">
          <span
            className={cn(
              "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium capitalize",
              typeStyle
            )}
          >
            {resource.type}
          </span>
          <span
            className={cn(
              "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium capitalize",
              diffStyle
            )}
          >
            {resource.difficulty}
          </span>
          <span
            className={cn(
              "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
              resource.free
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-muted text-muted-foreground"
            )}
          >
            {resource.free ? "Free" : "Paid"}
          </span>
        </div>

        {/* Title & provider */}
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-foreground leading-snug">
            {resource.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">{resource.provider}</p>
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between gap-2">
          {resource.duration && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {resource.duration}
            </span>
          )}
          <Badge variant="outline" className="text-xs ml-auto">
            {resource.skill}
          </Badge>
        </div>

        {/* Link button */}
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-1.5 text-xs"
          asChild
        >
          <a href={resource.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-3.5 w-3.5" />
            View Resource
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
