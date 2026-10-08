import React from "react";

export default function RootLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-4 border-primary/20" />
        <div className="absolute inset-0 h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    </div>
  );
}
