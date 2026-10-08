"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, RefreshCw } from "lucide-react";
import { useResume } from "@/hooks/useResume";
import { ResumeUpload } from "@/components/resume/ResumeUpload";
import { ResumePreview } from "@/components/resume/ResumePreview";
import { ResumeEditor } from "@/components/resume/ResumeEditor";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/common/LoadingState";
import type { Resume, ResumeData } from "@/types";

type FlowState = "idle" | "uploading" | "uploaded" | "editing";

export default function ResumePage() {
  const router = useRouter();
  const { uploadResume, getResumes, resumes, updateResume } = useResume();

  const [flowState, setFlowState] = useState<FlowState>("idle");
  const [currentResume, setCurrentResume] = useState<Resume | null>(null);
  const [loadingExisting, setLoadingExisting] = useState(true);

  // Load existing resumes on mount
  useEffect(() => {
    const load = async () => {
      await getResumes();
      setLoadingExisting(false);
    };
    void load();
  }, [getResumes]);

  // When resumes load, show the latest one
  useEffect(() => {
    if (!loadingExisting && resumes.length > 0 && flowState === "idle") {
      setCurrentResume(resumes[0]);
      setFlowState("uploaded");
    }
  }, [loadingExisting, resumes, flowState]);

  const handleUpload = async (file: File) => {
    setFlowState("uploading");
    const resume = await uploadResume(file);
    if (resume) {
      setCurrentResume(resume);
      setFlowState("uploaded");
    } else {
      setFlowState("idle");
      throw new Error("Failed to parse resume. Please try again.");
    }
  };

  const handleSaveEdit = async (updatedData: ResumeData) => {
    if (!currentResume) return;
    const updated = await updateResume(currentResume.id, {
      parsedData: updatedData,
    });
    if (updated) {
      setCurrentResume(updated);
    }
    setFlowState("uploaded");
  };

  const handleReupload = () => {
    setCurrentResume(null);
    setFlowState("idle");
  };

  if (loadingExisting) {
    return <LoadingState message="Loading your resume..." showSteps={false} />;
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Resume</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Upload your resume to start the analysis process.
        </p>
      </div>

      {/* Upload flow */}
      {(flowState === "idle" || flowState === "uploading") && (
        <div className="max-w-xl">
          <ResumeUpload onUpload={handleUpload} />
        </div>
      )}

      {/* Uploaded state */}
      {(flowState === "uploaded" || flowState === "editing") &&
        currentResume && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Uploaded:{" "}
                  <span className="text-foreground font-medium">
                    {currentResume.filename}
                  </span>
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReupload}
                className="gap-1.5"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Re-upload
              </Button>
            </div>

            {flowState === "uploaded" && (
              <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold">Resume Preview</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFlowState("editing")}
                  >
                    Edit Details
                  </Button>
                </div>
                <ResumePreview data={currentResume.parsedData} />
              </div>
            )}

            {flowState === "editing" && (
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-base font-semibold mb-4">Edit Resume</h2>
                <div className="space-y-4">
                  <ResumeEditor
                    data={currentResume.parsedData}
                    onSave={handleSaveEdit}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFlowState("uploaded")}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Continue button */}
            {flowState === "uploaded" && (
              <div className="flex justify-end">
                <Button
                  size="lg"
                  onClick={() =>
                    router.push(`/analyze?resumeId=${currentResume.id}`)
                  }
                  className="gap-2"
                >
                  Continue to Analysis
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}
    </div>
  );
}
