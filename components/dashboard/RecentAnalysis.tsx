import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalysisRow {
  id: string;
  resumeName: string;
  targetRole: string;
  score: number;
  date: string;
}

interface RecentAnalysisProps {
  analyses: AnalysisRow[];
  className?: string;
}

function scoreBadgeVariant(score: number) {
  if (score >= 70) return "default";
  if (score >= 50) return "secondary";
  return "destructive";
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function RecentAnalysis({ analyses, className }: RecentAnalysisProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Recent Analyses</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {analyses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-6 gap-2">
            <FileText className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No analyses yet</p>
            <Button variant="outline" size="sm" asChild>
              <Link href="/analyze">Start Analysis</Link>
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {analyses.map((row) => (
              <div
                key={row.id}
                className="flex items-center justify-between px-6 py-3 gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {row.resumeName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {row.targetRole} · {formatDate(row.date)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={scoreBadgeVariant(row.score)}>
                    {row.score}/100
                  </Badge>
                  <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" asChild>
                    <Link href={`/analysis/${row.id}`}>
                      View
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
