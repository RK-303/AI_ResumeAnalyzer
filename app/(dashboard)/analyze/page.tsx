"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Zap } from "lucide-react";
import { useAnalysis } from "@/hooks/useAnalysis";
import { useResume } from "@/hooks/useResume";
import { LoadingState } from "@/components/common/LoadingState";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEMO_RESUME } from "@/lib/demo-data";

const ROLES = [
  "Data Analyst",
  "AI/ML Engineer",
  "Software Developer",
  "Web Developer",
  "Data Scientist",
  "Business Analyst",
  "Custom",
];

export default function AnalyzePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { runAnalysis, analyzing } = useAnalysis();
  const { getResumes, resumes } = useResume();

  const [selectedRole, setSelectedRole] = useState("Data Analyst");
  const [customRole, setCustomRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [resumeId, setResumeId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Load resumes on mount
  useEffect(() => {
    const load = async () => {
      await getResumes();
    };
    void load();
  }, [getResumes]);

  // Set resumeId from URL param or first loaded resume
  useEffect(() => {
    const paramId = searchParams.get("resumeId");
    if (paramId) {
      setResumeId(paramId);
    } else if (resumes.length > 0 && !resumeId) {
      setResumeId(resumes[0].id);
    } else if (!resumeId) {
      // Fall back to demo resume
      setResumeId(DEMO_RESUME.id);
    }
  }, [searchParams, resumes, resumeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!jobDescription.trim()) {
      setError("Please paste a job description.");
      return;
    }

    const finalRole = selectedRole === "Custom" ? customRole.trim() : selectedRole;

    if (!finalRole) {
      setError("Please enter a custom role name.");
      return;
    }

    const activeResumeId = resumeId || DEMO_RESUME.id;
    const analysisId = await runAnalysis(activeResumeId, jobDescription, finalRole);

    if (analysisId) {
      router.push(`/analysis/${analysisId}`);
    } else {
      setError("Analysis failed. Please try again.");
    }
  };

  if (analyzing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <LoadingState
          message="Running AI analysis on your resume..."
          showSteps={true}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analyze Resume</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Select your target role and paste the job description for the most
          accurate analysis.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Role selector */}
        <div className="space-y-2">
          <Label htmlFor="role">Target Role</Label>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger id="role" className="w-full">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Custom role input */}
        {selectedRole === "Custom" && (
          <div className="space-y-2">
            <Label htmlFor="customRole">Custom Role Name</Label>
            <Input
              id="customRole"
              placeholder="e.g. Product Manager, DevOps Engineer"
              value={customRole}
              onChange={(e) => setCustomRole(e.target.value)}
            />
          </div>
        )}

        {/* Job description */}
        <div className="space-y-2">
          <Label htmlFor="jobDescription">Job Description</Label>
          <Textarea
            id="jobDescription"
            placeholder="Paste the full job description here for the most accurate analysis..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={12}
            className="resize-y"
          />
          <p className="text-xs text-muted-foreground">
            Paste the complete job description including responsibilities,
            requirements, and skills for the best match.
          </p>
        </div>

        {/* Resume info */}
        {resumeId && (
          <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm">
            <span className="text-muted-foreground">Using resume: </span>
            <span className="text-foreground font-medium">
              {resumes.find((r) => r.id === resumeId)?.filename ??
                DEMO_RESUME.filename}
            </span>
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 ml-2 text-xs"
              type="button"
              onClick={() => router.push("/resume")}
            >
              Change
            </Button>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        {/* Submit */}
        <Button type="submit" size="lg" className="w-full gap-2">
          <Zap className="h-4 w-4" />
          Analyze My Resume
        </Button>
      </form>
    </div>
  );
}
