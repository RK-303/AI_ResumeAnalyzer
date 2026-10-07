"use client";

import React, { useState } from "react";
import { Copy, Check, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ContentSuggestion } from "@/types";
import { cn } from "@/lib/utils";

interface ImprovementSuggestionsProps {
  suggestions: ContentSuggestion[];
  className?: string;
}

type Priority = "high" | "medium" | "low";

const priorityOrder: Priority[] = ["high", "medium", "low"];

const priorityConfig = {
  high: {
    label: "High Priority",
    badgeVariant: "destructive" as const,
    headerClass: "text-red-400",
    bgClass: "bg-red-500/5 border-red-500/20",
  },
  medium: {
    label: "Medium Priority",
    badgeVariant: "secondary" as const,
    headerClass: "text-amber-400",
    bgClass: "bg-amber-500/5 border-amber-500/20",
  },
  low: {
    label: "Low Priority",
    badgeVariant: "outline" as const,
    headerClass: "text-blue-400",
    bgClass: "bg-blue-500/5 border-blue-500/20",
  },
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-7 w-7 shrink-0"
      onClick={handleCopy}
      aria-label="Copy suggested text"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-emerald-400" />
      ) : (
        <Copy className="h-3.5 w-3.5 text-muted-foreground" />
      )}
    </Button>
  );
}

export function ImprovementSuggestions({
  suggestions,
  className,
}: ImprovementSuggestionsProps) {
  const grouped = priorityOrder.reduce<Record<Priority, ContentSuggestion[]>>(
    (acc, priority) => {
      acc[priority] = suggestions.filter((s) => s.priority === priority);
      return acc;
    },
    { high: [], medium: [], low: [] }
  );

  return (
    <div className={cn("space-y-6", className)}>
      {priorityOrder.map((priority) => {
        const items = grouped[priority];
        if (items.length === 0) return null;
        const config = priorityConfig[priority];

        return (
          <div key={priority}>
            <div className="flex items-center gap-2 mb-3">
              <h3 className={cn("text-sm font-semibold", config.headerClass)}>
                {config.label}
              </h3>
              <Badge variant={config.badgeVariant} className="text-xs">
                {items.length}
              </Badge>
            </div>

            <div className="space-y-3">
              {items.map((item, i) => (
                <Card
                  key={i}
                  className={cn("border", config.bgClass)}
                >
                  <CardHeader className="pb-2 pt-4">
                    <CardTitle className="text-sm font-medium text-foreground">
                      {item.section}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pb-4">
                    {/* Diff view */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-3">
                      {/* Current */}
                      <div className="flex-1 rounded-md bg-muted/50 p-3">
                        <p className="text-xs font-semibold text-muted-foreground mb-1">
                          CURRENT
                        </p>
                        <p className="text-xs text-foreground leading-relaxed line-through decoration-red-400/60">
                          {item.current}
                        </p>
                      </div>

                      <div className="flex items-center justify-center shrink-0">
                        <ArrowRight className="h-4 w-4 text-muted-foreground rotate-90 sm:rotate-0" />
                      </div>

                      {/* Suggested */}
                      <div className="flex-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 p-3">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-semibold text-emerald-400">
                            SUGGESTED
                          </p>
                          <CopyButton text={item.suggested} />
                        </div>
                        <p className="text-xs text-foreground leading-relaxed">
                          {item.suggested}
                        </p>
                      </div>
                    </div>

                    {/* Reason */}
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      <span className="font-medium text-foreground">Why: </span>
                      {item.reason}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}

      {suggestions.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            No improvement suggestions available.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
