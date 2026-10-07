import React from "react";
import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ActionItem {
  text: string;
  link?: string;
}

interface RecommendedActionsProps {
  actions: ActionItem[];
  title?: string;
  className?: string;
}

export function RecommendedActions({
  actions,
  title = "Recommended Actions",
  className,
}: RecommendedActionsProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => (
          <div key={index} className="flex items-start gap-3">
            {/* Number circle */}
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold mt-0.5">
              {index + 1}
            </div>

            {/* Action text */}
            <div className="flex-1 flex items-start justify-between gap-2">
              <p className="text-sm text-foreground leading-relaxed">
                {action.text}
              </p>
              {action.link && (
                <a
                  href={action.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-primary hover:text-primary/80 transition-colors"
                  aria-label={`Learn more: ${action.text}`}
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        ))}

        {actions.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No actions available yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
