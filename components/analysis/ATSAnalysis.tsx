import React from "react";
import { CheckCircle2, XCircle, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ATSCheck } from "@/types";
import { cn } from "@/lib/utils";

interface ATSAnalysisProps {
  checks: ATSCheck[];
  className?: string;
}

function groupByCategory(checks: ATSCheck[]): Record<string, ATSCheck[]> {
  return checks.reduce<Record<string, ATSCheck[]>>((acc, check) => {
    const key = check.category || "General";
    if (!acc[key]) acc[key] = [];
    acc[key].push(check);
    return acc;
  }, {});
}

export function ATSAnalysis({ checks, className }: ATSAnalysisProps) {
  const grouped = groupByCategory(checks);
  const passCount = checks.filter((c) => c.passed).length;
  const total = checks.length;

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">ATS Analysis</CardTitle>
          <Badge
            variant={passCount === total ? "default" : passCount >= total / 2 ? "secondary" : "destructive"}
            className="text-xs"
          >
            {passCount}/{total} passed
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(grouped).map(([category, categoryChecks]) => (
          <div key={category}>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              {category}
            </h4>
            <div className="space-y-2">
              {categoryChecks.map((check, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-start gap-3 rounded-lg p-3 border",
                    check.passed
                      ? "border-emerald-500/20 bg-emerald-500/5"
                      : "border-red-500/20 bg-red-500/5"
                  )}
                >
                  {/* Icon */}
                  <div className="shrink-0 mt-0.5">
                    {check.passed ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-400" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      {check.message}
                    </p>
                    {!check.passed && check.suggestion && (
                      <div className="flex items-start gap-1.5 text-xs text-amber-400">
                        <ChevronRight className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                        <span>{check.suggestion}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {checks.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No ATS checks available.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
