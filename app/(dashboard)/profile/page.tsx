"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScoreRing } from "@/components/dashboard/ScoreRing";
import { DEMO_ANALYSIS } from "@/lib/demo-data";
import type { APIResponse, Analysis } from "@/types";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  targetRole: z.string(),
  linkedinUrl: z.string().url("Invalid URL").or(z.literal("")).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, refresh } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      targetRole: "",
      linkedinUrl: "",
    },
  });

  // Load latest analysis and pre-fill target role
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/analysis", { credentials: "include" });
        const json = (await res.json()) as APIResponse<Analysis[]>;
        const latest = json.success && json.data?.[0] ? json.data[0] : DEMO_ANALYSIS;
        setAnalysis(latest);

        // Re-fetch profile to get saved targetRole
        const profileRes = await fetch("/api/profile", { credentials: "include" });
        const profileJson = (await profileRes.json()) as APIResponse<{
          name: string;
          email: string;
          targetRole?: string;
        }>;

        reset({
          name: profileJson.data?.name ?? user?.name ?? "",
          email: profileJson.data?.email ?? user?.email ?? "",
          targetRole: profileJson.data?.targetRole ?? latest.targetRole,
          linkedinUrl: "",
        });
      } catch {
        reset({
          name: user?.name ?? "",
          email: user?.email ?? "",
          targetRole: DEMO_ANALYSIS.targetRole,
          linkedinUrl: "",
        });
      }
    };

    void fetchData();
  }, [user, reset]);

  const onSubmit = async (values: ProfileFormValues) => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: values.name,
          targetRole: values.targetRole,
        }),
      });

      if (res.ok) {
        await refresh();
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } finally {
      setSaving(false);
    }
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage your account details and career settings.
        </p>
      </div>

      {/* Profile card */}
      <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-lg font-semibold text-foreground">
            {user?.name ?? "—"}
          </p>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>

        {analysis && (
          <div className="ml-auto hidden sm:block">
            <ScoreRing score={analysis.overallScore} size={80} strokeWidth={8} label="Score" />
          </div>
        )}
      </div>

      {/* Edit form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Edit Profile</CardTitle>
          <CardDescription>
            Update your name, target role, and career details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" {...register("name")} />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  disabled
                  className="opacity-60 cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed in this demo.
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="targetRole">Target Role</Label>
              <Input
                id="targetRole"
                placeholder="e.g. Data Analyst, Software Engineer"
                {...register("targetRole")}
              />
              {errors.targetRole && (
                <p className="text-xs text-destructive">{errors.targetRole.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
              <Input
                id="linkedinUrl"
                type="url"
                placeholder="https://linkedin.com/in/yourprofile"
                {...register("linkedinUrl")}
              />
              {errors.linkedinUrl && (
                <p className="text-xs text-destructive">{errors.linkedinUrl.message}</p>
              )}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                type="submit"
                disabled={saving || !isDirty}
                className="gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : saved ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-400" />
                    Saved!
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Analysis summary */}
      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Current Analysis Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              {[
                { label: "Overall", value: analysis.overallScore },
                { label: "ATS", value: analysis.atsScore },
                { label: "Job Match", value: analysis.jobMatchScore },
                { label: "Skills", value: analysis.skillsScore },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <p className="text-2xl font-bold text-foreground">
                    {item.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
