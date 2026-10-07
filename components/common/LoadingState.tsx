"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

const ANALYSIS_STEPS = [
  "Parsing resume...",
  "Extracting skills...",
  "Running ATS checks...",
  "Matching job requirements...",
  "Generating recommendations...",
  "Building your report...",
];

interface LoadingStateProps {
  message?: string;
  showSteps?: boolean;
}

export function LoadingState({ message, showSteps = true }: LoadingStateProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!showSteps) return;
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < ANALYSIS_STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 1800);
    return () => clearInterval(interval);
  }, [showSteps]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] gap-6 py-12">
      {/* Spinner */}
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-primary/20" />
        <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>

      {/* Message */}
      {message && (
        <p className="text-muted-foreground text-sm text-center">{message}</p>
      )}

      {/* Step messages */}
      {showSteps && (
        <div className="h-8 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-sm font-medium text-foreground"
            >
              {ANALYSIS_STEPS[currentStep]}
            </motion.p>
          </AnimatePresence>
        </div>
      )}

      {/* Progress dots */}
      {showSteps && (
        <div className="flex items-center gap-2">
          {ANALYSIS_STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i <= currentStep
                  ? "bg-primary w-4"
                  : "bg-muted w-1.5"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
