"use client";

import React, { useState } from "react";
import { Download, Trash2, Moon, Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ToggleRowProps {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}

function ToggleRow({ label, description, enabled, onToggle }: ToggleRowProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-0.5">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={onToggle}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          enabled ? "bg-primary" : "bg-muted"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform",
            enabled ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    analysisComplete: true,
    weeklyTips: false,
    progressReminders: true,
    newResources: false,
  });

  const handleExport = () => {
    // UI placeholder — no backend in MVP
    alert("Export feature coming soon. Data export will be available in the full version.");
  };

  const handleDeleteAccount = () => {
    // UI placeholder — no backend in MVP
    alert("Account deletion is not available in the demo version.");
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage your preferences and account settings.
        </p>
      </div>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Moon className="h-4 w-4 text-primary" />
            Appearance
          </CardTitle>
          <CardDescription>
            Control how the app looks and feels.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Theme</p>
              <p className="text-xs text-muted-foreground">
                Dark mode is the default for MVP.
              </p>
            </div>
            <Badge variant="secondary">Dark (Fixed)</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            Notifications
          </CardTitle>
          <CardDescription>
            Choose what updates you want to receive. (UI only — no backend in MVP)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ToggleRow
            label="Analysis Complete"
            description="Get notified when your resume analysis finishes"
            enabled={notifications.analysisComplete}
            onToggle={() =>
              setNotifications((p) => ({
                ...p,
                analysisComplete: !p.analysisComplete,
              }))
            }
          />
          <Separator />
          <ToggleRow
            label="Weekly Career Tips"
            description="Receive weekly tips to improve your job search"
            enabled={notifications.weeklyTips}
            onToggle={() =>
              setNotifications((p) => ({ ...p, weeklyTips: !p.weeklyTips }))
            }
          />
          <Separator />
          <ToggleRow
            label="Progress Reminders"
            description="Get reminders to re-analyze your resume after improvements"
            enabled={notifications.progressReminders}
            onToggle={() =>
              setNotifications((p) => ({
                ...p,
                progressReminders: !p.progressReminders,
              }))
            }
          />
          <Separator />
          <ToggleRow
            label="New Resources"
            description="Be notified when new learning resources are added for your target role"
            enabled={notifications.newResources}
            onToggle={() =>
              setNotifications((p) => ({ ...p, newResources: !p.newResources }))
            }
          />

          <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
            <BellOff className="h-3.5 w-3.5" />
            Notification delivery is not yet implemented in this MVP version.
          </div>
        </CardContent>
      </Card>

      {/* Data & Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Data & Privacy</CardTitle>
          <CardDescription>
            Export or delete your data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">Export Data</p>
              <p className="text-xs text-muted-foreground">
                Download all your analyses, resumes, and progress data as JSON.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 shrink-0"
              onClick={handleExport}
            >
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
          </div>

          <Separator />

          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">Delete Account</p>
              <p className="text-xs text-muted-foreground">
                Permanently delete your account and all associated data. This
                action cannot be undone.
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              className="gap-1.5 shrink-0"
              onClick={handleDeleteAccount}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Version info */}
      <div className="text-xs text-muted-foreground text-center">
        AI Resume Analyzer v1.0.0 — MVP
      </div>
    </div>
  );
}
