"use client";

import React, { useState } from "react";
import { CheckCircle2, XCircle, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SkillGapCard } from "@/components/dashboard/SkillGapCard";
import type { SkillGap } from "@/types";
import { cn } from "@/lib/utils";

interface SkillGapAnalysisProps {
  skillGaps: SkillGap[];
  className?: string;
}

type FilterType = "all" | "missing" | "present";

export function SkillGapAnalysis({ skillGaps, className }: SkillGapAnalysisProps) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [importanceFilter, setImportanceFilter] = useState<string>("all");

  const presentSkills = skillGaps.filter((g) => g.present);
  const missingSkills = skillGaps.filter((g) => !g.present);

  const filteredGaps = skillGaps
    .filter((g) => {
      if (filter === "missing") return !g.present;
      if (filter === "present") return g.present;
      return true;
    })
    .filter((g) => {
      if (importanceFilter === "all") return true;
      return g.importance === importanceFilter;
    });

  return (
    <div className={cn("space-y-6", className)}>
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{presentSkills.length}</p>
              <p className="text-xs text-muted-foreground">Skills Present</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-red-500/10 flex items-center justify-center">
              <XCircle className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{missingSkills.length}</p>
              <p className="text-xs text-muted-foreground">Skills Missing</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Filter className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">
                {skillGaps.length > 0
                  ? Math.round((presentSkills.length / skillGaps.length) * 100)
                  : 0}%
              </p>
              <p className="text-xs text-muted-foreground">Match Rate</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All skills overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">All Role Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {skillGaps.map((gap) => (
              <div key={gap.skill} className="flex items-center gap-1.5">
                {gap.present ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="h-3.5 w-3.5 text-red-400 shrink-0" />
                )}
                <Badge
                  variant={gap.present ? "outline" : "destructive"}
                  className={cn("text-xs", gap.present && "border-emerald-500/40 text-emerald-400")}
                >
                  {gap.skill}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skill gap cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">Skill Gaps</h3>
          <div className="flex items-center gap-2">
            {/* Filter buttons */}
            <div className="flex gap-1">
              {(["all", "missing", "present"] as FilterType[]).map((f) => (
                <Button
                  key={f}
                  variant={filter === f ? "default" : "outline"}
                  size="sm"
                  className="h-7 text-xs capitalize"
                  onClick={() => setFilter(f)}
                >
                  {f}
                </Button>
              ))}
            </div>
            <div className="flex gap-1">
              {["all", "critical", "high", "medium"].map((imp) => (
                <Button
                  key={imp}
                  variant={importanceFilter === imp ? "secondary" : "ghost"}
                  size="sm"
                  className="h-7 text-xs capitalize"
                  onClick={() => setImportanceFilter(imp)}
                >
                  {imp}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredGaps.map((gap) => (
            <SkillGapCard key={gap.skill} gap={gap} />
          ))}
          {filteredGaps.length === 0 && (
            <p className="text-sm text-muted-foreground col-span-2 text-center py-8">
              No skills match the selected filters.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
