"use client";

import { useCallback, useState } from "react";
import type { Resume, APIResponse } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ResumeState {
  resumes: Resume[];
  loading: boolean;
  uploading: boolean;
  error: string | null;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useResume() {
  const [state, setState] = useState<ResumeState>({
    resumes: [],
    loading: false,
    uploading: false,
    error: null,
  });

  const getResumes = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const res = await fetch("/api/resumes", { credentials: "include" });
      const json = (await res.json()) as APIResponse<Resume[]>;

      if (json.success && json.data) {
        setState((prev) => ({ ...prev, resumes: json.data!, loading: false }));
      } else {
        setState((prev) => ({ ...prev, loading: false, error: json.error ?? "Failed to load resumes" }));
      }
    } catch {
      setState((prev) => ({ ...prev, loading: false, error: "Network error" }));
    }
  }, []);

  const getResume = useCallback(async (id: string): Promise<Resume | null> => {
    try {
      const res = await fetch(`/api/resumes/${id}`, { credentials: "include" });
      const json = (await res.json()) as APIResponse<Resume>;

      if (json.success && json.data) {
        return json.data;
      }
      return null;
    } catch {
      return null;
    }
  }, []);

  const uploadResume = useCallback(async (file: File): Promise<Resume | null> => {
    setState((prev) => ({ ...prev, uploading: true, error: null }));
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/resumes", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const json = (await res.json()) as APIResponse<Resume>;

      if (json.success && json.data) {
        setState((prev) => ({
          ...prev,
          resumes: [json.data!, ...prev.resumes],
          uploading: false,
        }));
        return json.data;
      }

      setState((prev) => ({ ...prev, uploading: false, error: json.error ?? "Upload failed" }));
      return null;
    } catch {
      setState((prev) => ({ ...prev, uploading: false, error: "Network error" }));
      return null;
    }
  }, []);

  const updateResume = useCallback(async (
    id: string,
    data: Partial<Resume>
  ): Promise<Resume | null> => {
    try {
      const res = await fetch(`/api/resumes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const json = (await res.json()) as APIResponse<Resume>;

      if (json.success && json.data) {
        setState((prev) => ({
          ...prev,
          resumes: prev.resumes.map((r) => (r.id === id ? json.data! : r)),
        }));
        return json.data;
      }

      return null;
    } catch {
      return null;
    }
  }, []);

  return {
    ...state,
    getResumes,
    getResume,
    uploadResume,
    updateResume,
  };
}
