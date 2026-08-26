import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glow?: "cyan" | "purple" | "emerald" | "amber" | "none";
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  glow = "none",
  hover = true,
  className = "",
  ...props
}) => {
  const glowStyles = {
    none: "",
    cyan: "hover:border-sky-300 hover:shadow-apple-md",
    purple: "hover:border-purple-300 hover:shadow-apple-md",
    emerald: "hover:border-emerald-300 hover:shadow-apple-md",
    amber: "hover:border-amber-300 hover:shadow-apple-md",
  }[glow];

  return (
    <div
      className={`rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-md p-6 text-slate-900 shadow-apple-sm transition-all duration-300 ${
        hover ? "hover:-translate-y-0.5 hover:shadow-apple-md hover:border-slate-300" : ""
      } ${glowStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
