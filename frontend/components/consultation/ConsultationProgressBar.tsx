"use client";

import React from "react";

interface ConsultationProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const ConsultationProgressBar: React.FC<ConsultationProgressBarProps> = ({
  currentStep,
  totalSteps,
}) => {
  const pct = Math.min(Math.round((currentStep / totalSteps) * 100), 100);

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          {currentStep >= totalSteps ? "Consultation Complete" : `Question ${currentStep + 1} of ${totalSteps}`}
        </span>
        <span className="text-[11px] font-bold text-indigo-400">{pct}%</span>
      </div>
      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};
