import React from "react";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ContentSuggestion } from "@/types";
import { cn } from "@/lib/utils";

interface ContentAnalysisProps {
  suggestions: ContentSuggestion[];
  className?: string;
}

const priorityConfig = {
  high: { label: "High", variant: "destructive" as const },
  medium: { label: "Medium", variant: "secondary" as const },
  low: { label: "Low", variant: "outline" as const },
};

export function ContentAnalysis({ suggestions, className }: ContentAnalysisProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Content Improvements</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No content suggestions available.
          </p>
        ) : (
          suggestions.map((suggestion, i) => {
            const config = priorityConfig[suggestion.priority];
            return (
              <div
                key={i}
                className="rounded-lg border border-border p-4 space-y-3"
              >
                {/* Header */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-foreground">
                    {suggestion.section}
                  </span>
                  <Badge variant={config.variant} className="text-xs shrink-0">
                    {config.label} Priority
                  </Badge>
                </div>

                {/* Current → Suggested */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* Current */}
                  <div className="flex-1 rounded-md bg-amber-500/10 border border-amber-500/20 p-3">
                    <p className="text-xs font-semibold text-amber-400 mb-1 uppercase tracking-wider">
                      Current
                    </p>
                    <p className="text-xs text-foreground leading-relaxed">
                      {suggestion.current}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center justify-center shrink-0">
                    <ArrowRight className="h-4 w-4 text-muted-foreground sm:block hidden" />
                    <ArrowRight className="h-4 w-4 text-muted-foreground rotate-90 sm:hidden block" />
                  </div>

                  {/* Suggested */}
                  <div className="flex-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 p-3">
                    <p className="text-xs font-semibold text-emerald-400 mb-1 uppercase tracking-wider">
                      Suggested
                    </p>
                    <p className="text-xs text-foreground leading-relaxed">
                      {suggestion.suggested}
                    </p>
                  </div>
                </div>

                {/* Reason */}
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <span className="font-medium text-foreground">Why: </span>
                  {suggestion.reason}
                </p>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
