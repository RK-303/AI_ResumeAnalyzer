"use client";

import { useCallback, useState } from "react";
import type { Analysis, APIResponse } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AnalysisState {
  analyses: Analysis[];
  currentAnalysis: Analysis | null;
  loading: boolean;
  analyzing: boolean;
  error: string | null;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAnalysis() {
  const [state, setState] = useState<AnalysisState>({
    analyses: [],
    currentAnalysis: null,
    loading: false,
    analyzing: false,
    error: null,
  });

  const getAnalyses = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      // There is no GET /api/analysis list endpoint — fetch via progress or store locally
      // For now, return the current state
      setState((prev) => ({ ...prev, loading: false }));
    } catch {
      setState((prev) => ({ ...prev, loading: false, error: "Network error" }));
    }
  }, []);

  const getAnalysis = useCallback(async (id: string): Promise<Analysis | null> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const res = await fetch(`/api/analysis/${id}`, { credentials: "include" });
      const json = (await res.json()) as APIResponse<Analysis>;

      if (json.success && json.data) {
        setState((prev) => ({
          ...prev,
          currentAnalysis: json.data!,
          loading: false,
        }));
        return json.data;
      }

      setState((prev) => ({ ...prev, loading: false, error: json.error ?? "Analysis not found" }));
      return null;
    } catch {
      setState((prev) => ({ ...prev, loading: false, error: "Network error" }));
      return null;
    }
  }, []);

  const runAnalysis = useCallback(async (
    resumeId: string,
    jobDescription: string,
    targetRole: string
  ): Promise<string | null> => {
    setState((prev) => ({ ...prev, analyzing: true, error: null }));
    try {
      const res = await fetch("/api/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ resumeId, jobDescription, targetRole }),
      });

      const json = (await res.json()) as APIResponse<{ analysisId: string }>;

      if (json.success && json.data) {
        // Fetch the full analysis
        const fullRes = await fetch(`/api/analysis/${json.data.analysisId}`, {
          credentials: "include",
        });
        const fullJson = (await fullRes.json()) as APIResponse<Analysis>;

        if (fullJson.success && fullJson.data) {
          setState((prev) => ({
            ...prev,
            currentAnalysis: fullJson.data!,
            analyses: [fullJson.data!, ...prev.analyses],
            analyzing: false,
          }));
        } else {
          setState((prev) => ({ ...prev, analyzing: false }));
        }

        return json.data.analysisId;
      }

      setState((prev) => ({ ...prev, analyzing: false, error: json.error ?? "Analysis failed" }));
      return null;
    } catch {
      setState((prev) => ({ ...prev, analyzing: false, error: "Network error" }));
      return null;
    }
  }, []);

  return {
    ...state,
    getAnalyses,
    getAnalysis,
    runAnalysis,
  };
}
