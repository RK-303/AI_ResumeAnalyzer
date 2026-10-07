import React from "react";
import { cn } from "@/lib/utils";

interface SkillBarProps {
  skillName: string;
  current: number; // 0-100 current match
  required?: number; // 0-100 required level (defaults to 100)
  className?: string;
}

export function SkillBar({
  skillName,
  current,
  required = 100,
  className,
}: SkillBarProps) {
  const matchPercent = Math.min(current, required);
  const gapPercent = Math.max(0, required - current);
  const hasGap = gapPercent > 0;

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">{skillName}</span>
        <span
          className={cn(
            "text-xs font-semibold",
            current >= 80
              ? "text-emerald-400"
              : current >= 50
              ? "text-amber-400"
              : "text-red-400"
          )}
        >
          {current}%
        </span>
      </div>
      <div className="relative h-2 w-full rounded-full bg-muted overflow-hidden">
        {/* Match portion */}
        <div
          className={cn(
            "absolute left-0 top-0 h-full rounded-l-full transition-all duration-700",
            current >= 80
              ? "bg-emerald-500"
              : current >= 50
              ? "bg-amber-500"
              : "bg-red-500"
          )}
          style={{ width: `${matchPercent}%` }}
        />
        {/* Gap portion */}
        {hasGap && (
          <div
            className="absolute top-0 h-full bg-amber-500/30 border-l border-amber-500/50"
            style={{
              left: `${matchPercent}%`,
              width: `${gapPercent}%`,
            }}
          />
        )}
      </div>
      {hasGap && (
        <p className="text-xs text-amber-400">
          {gapPercent}% gap to required level
        </p>
      )}
    </div>
  );
}
