import React from "react";
import { StepNavigation } from "@/features/navigation/components/StepNavigation";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen items-center justify-center py-12">
      <StepNavigation />
    </main>
  );
}