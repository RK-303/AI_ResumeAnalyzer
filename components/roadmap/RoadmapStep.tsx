import React from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RoadmapTask {
  text: string;
  completed?: boolean;
}

interface RoadmapStepProps {
  stepNumber: number;
  stageName: string;
  tasks: RoadmapTask[];
  estimatedTimeline: string;
  isLast?: boolean;
  completed?: boolean;
  current?: boolean;
  className?: string;
}

export function RoadmapStep({
  stepNumber,
  stageName,
  tasks,
  estimatedTimeline,
  isLast = false,
  completed = false,
  current = false,
  className,
}: RoadmapStepProps) {
  return (
    <div className={cn("relative flex gap-4", className)}>
      {/* Left column: step number + connector line */}
      <div className="flex flex-col items-center">
        {/* Step circle */}
        <div
          className={cn(
            "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors",
            completed
              ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
              : current
              ? "border-primary bg-primary/20 text-primary"
              : "border-border bg-muted text-muted-foreground"
          )}
          aria-label={`Step ${stepNumber}: ${stageName}`}
        >
          {completed ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          ) : (
            <span>{stepNumber}</span>
          )}
        </div>

        {/* Connector line */}
        {!isLast && (
          <div
            className={cn(
              "mt-1 w-0.5 flex-1 min-h-[2rem]",
              completed ? "bg-emerald-500/40" : "bg-border"
            )}
          />
        )}
      </div>

      {/* Right column: content */}
      <div className={cn("pb-8 flex-1 min-w-0", isLast && "pb-0")}>
        {/* Stage header */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <h3
            className={cn(
              "text-sm font-semibold",
              completed
                ? "text-emerald-400"
                : current
                ? "text-primary"
                : "text-foreground"
            )}
          >
            {stageName}
          </h3>
          {current && (
            <Badge variant="default" className="text-xs h-5">
              Current
            </Badge>
          )}
          {completed && (
            <Badge
              variant="outline"
              className="text-xs h-5 border-emerald-500/40 text-emerald-400"
            >
              Done
            </Badge>
          )}
          <span className="ml-auto text-xs text-muted-foreground shrink-0">
            {estimatedTimeline}
          </span>
        </div>

        {/* Tasks list */}
        <ul className="space-y-2">
          {tasks.map((task, i) => (
            <li key={i} className="flex items-start gap-2.5">
              {task.completed ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <Circle
                  className={cn(
                    "h-4 w-4 shrink-0 mt-0.5",
                    current ? "text-primary/60" : "text-muted-foreground/40"
                  )}
                />
              )}
              <span
                className={cn(
                  "text-sm leading-relaxed",
                  task.completed
                    ? "line-through text-muted-foreground"
                    : "text-foreground"
                )}
              >
                {task.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
