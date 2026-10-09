import type React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`rounded-xl border border-gray-800 bg-[#111827] p-6 ${className}`}>
      {children}
    </div>
  );
}
