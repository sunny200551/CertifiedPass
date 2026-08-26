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
    cyan: "hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10",
    purple: "hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10",
    emerald: "hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10",
    amber: "hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10",
  }[glow];

  return (
    <div
      className={`rounded-xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md p-6 text-slate-100 transition-all duration-300 ${
        hover ? "hover:-translate-y-0.5 hover:bg-slate-900/80" : ""
      } ${glowStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
