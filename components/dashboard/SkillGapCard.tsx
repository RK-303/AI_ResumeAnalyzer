import React from "react";
import { AlertCircle, AlertTriangle, Info, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SkillGap } from "@/types";
import { cn } from "@/lib/utils";

interface SkillGapCardProps {
  gap: SkillGap;
  className?: string;
}

const importanceConfig = {
  critical: {
    label: "Critical",
    badgeVariant: "destructive" as const,
    icon: AlertCircle,
    borderClass: "border-l-red-500",
    iconClass: "text-red-400",
  },
  high: {
    label: "High",
    badgeVariant: "secondary" as const,
    icon: AlertTriangle,
    borderClass: "border-l-amber-500",
    iconClass: "text-amber-400",
  },
  medium: {
    label: "Medium",
    badgeVariant: "outline" as const,
    icon: Info,
    borderClass: "border-l-blue-500",
    iconClass: "text-blue-400",
  },
};

export function SkillGapCard({ gap, className }: SkillGapCardProps) {
  const config = importanceConfig[gap.importance];
  const Icon = config.icon;

  return (
    <Card
      className={cn(
        "border-l-4",
        config.borderClass,
        className
      )}
    >
      <CardContent className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <Icon className={cn("h-4 w-4 shrink-0", config.iconClass)} />
            <span className="font-semibold text-foreground">{gap.skill}</span>
          </div>
          <Badge variant={config.badgeVariant} className="shrink-0">
            {config.label}
          </Badge>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="text-foreground font-medium">Why it matters: </span>
          {gap.reason}
        </p>

        <div className="flex items-start gap-1.5 bg-primary/5 rounded-md p-2">
          <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            {gap.whatToDo}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
