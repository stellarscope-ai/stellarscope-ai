import type React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

export function Button({ variant = "primary", size = "md", className = "", ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded-lg font-semibold transition-colors";

  const variants = {
    primary: "bg-[#6366f1] text-white hover:bg-[#5558e6]",
    secondary: "bg-[#8b5cf6] text-white hover:bg-[#7c4fee]",
    outline: "border border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-3 text-base",
  };

  return <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />;
}
