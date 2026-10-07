import React from "react";
import { type LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  color?: "blue" | "green" | "amber" | "violet" | "red";
  trend?: number; // positive = up, negative = down, 0 = flat
  trendLabel?: string;
  className?: string;
}

const colorMap = {
  blue: "text-blue-400 bg-blue-400/10",
  green: "text-emerald-400 bg-emerald-400/10",
  amber: "text-amber-400 bg-amber-400/10",
  violet: "text-violet-400 bg-violet-400/10",
  red: "text-red-400 bg-red-400/10",
};

export function StatsCard({
  icon: Icon,
  value,
  label,
  color = "blue",
  trend,
  trendLabel,
  className,
}: StatsCardProps) {
  const colorClass = colorMap[color];

  return (
    <Card className={cn("", className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {trend !== undefined && (
              <div className="flex items-center gap-1 text-xs">
                {trend > 0 ? (
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                ) : trend < 0 ? (
                  <TrendingDown className="h-3.5 w-3.5 text-red-400" />
                ) : (
                  <Minus className="h-3.5 w-3.5 text-muted-foreground" />
                )}
                <span
                  className={cn(
                    "font-medium",
                    trend > 0
                      ? "text-emerald-400"
                      : trend < 0
                      ? "text-red-400"
                      : "text-muted-foreground"
                  )}
                >
                  {trend > 0 ? "+" : ""}
                  {trend}%
                </span>
                {trendLabel && (
                  <span className="text-muted-foreground">{trendLabel}</span>
                )}
              </div>
            )}
          </div>
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg shrink-0", colorClass)}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
