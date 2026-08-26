import React from "react";

export type BadgeVariant =
  | "verified"
  | "active"
  | "invalid"
  | "revoked"
  | "pending"
  | "hackathon"
  | "internship"
  | "opensource"
  | "competition"
  | "workshop"
  | "event"
  | "default";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "md",
  className = "",
  dot = false,
}) => {
  const variantStyles: Record<BadgeVariant, { bg: string; text: string; border: string; dotColor: string }> = {
    verified: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/30",
      dotColor: "bg-emerald-400",
    },
    active: {
      bg: "bg-cyan-500/10",
      text: "text-cyan-400",
      border: "border-cyan-500/30",
      dotColor: "bg-cyan-400",
    },
    invalid: {
      bg: "bg-red-500/10",
      text: "text-red-400",
      border: "border-red-500/30",
      dotColor: "bg-red-400",
    },
    revoked: {
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      border: "border-amber-500/30",
      dotColor: "bg-amber-400",
    },
    pending: {
      bg: "bg-slate-500/10",
      text: "text-slate-400",
      border: "border-slate-500/30",
      dotColor: "bg-slate-400",
    },
    hackathon: {
      bg: "bg-cyan-500/15",
      text: "text-cyan-300",
      border: "border-cyan-500/40",
      dotColor: "bg-cyan-400",
    },
    internship: {
      bg: "bg-purple-500/15",
      text: "text-purple-300",
      border: "border-purple-500/40",
      dotColor: "bg-purple-400",
    },
    opensource: {
      bg: "bg-emerald-500/15",
      text: "text-emerald-300",
      border: "border-emerald-500/40",
      dotColor: "bg-emerald-400",
    },
    competition: {
      bg: "bg-amber-500/15",
      text: "text-amber-300",
      border: "border-amber-500/40",
      dotColor: "bg-amber-400",
    },
    workshop: {
      bg: "bg-blue-500/15",
      text: "text-blue-300",
      border: "border-blue-500/40",
      dotColor: "bg-blue-400",
    },
    event: {
      bg: "bg-pink-500/15",
      text: "text-pink-300",
      border: "border-pink-500/40",
      dotColor: "bg-pink-400",
    },
    default: {
      bg: "bg-slate-800",
      text: "text-slate-300",
      border: "border-slate-700",
      dotColor: "bg-slate-400",
    },
  };

  const style = variantStyles[variant] || variantStyles.default;
  const sizeClass = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs font-medium";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${style.bg} ${style.text} ${style.border} ${sizeClass} ${className}`}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${style.dotColor} animate-pulse`}
        />
      )}
      {children}
    </span>
  );
};
