import type React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-gray-300">{label}</label>}
      <input
        className={`rounded-lg border border-gray-700 bg-[#0b0f1a] px-4 py-2.5 text-sm text-[#f8fafc] placeholder-gray-500 transition-colors focus:border-[#6366f1] focus:outline-none focus:ring-1 focus:ring-[#6366f1] ${className}`}
        {...props}
      />
    </div>
  );
}
