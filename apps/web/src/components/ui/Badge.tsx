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
      bg: "bg-emerald-50",
      text: "text-emerald-700 font-medium",
      border: "border-emerald-200/90",
      dotColor: "bg-emerald-500",
    },
    active: {
      bg: "bg-sky-50",
      text: "text-sky-700 font-medium",
      border: "border-sky-200/90",
      dotColor: "bg-sky-500",
    },
    invalid: {
      bg: "bg-red-50",
      text: "text-red-700 font-medium",
      border: "border-red-200/90",
      dotColor: "bg-red-500",
    },
    revoked: {
      bg: "bg-amber-50",
      text: "text-amber-800 font-medium",
      border: "border-amber-200/90",
      dotColor: "bg-amber-500",
    },
    pending: {
      bg: "bg-slate-100",
      text: "text-slate-600 font-medium",
      border: "border-slate-200",
      dotColor: "bg-slate-400",
    },
    hackathon: {
      bg: "bg-indigo-50",
      text: "text-indigo-700 font-semibold",
      border: "border-indigo-200/90",
      dotColor: "bg-indigo-600",
    },
    internship: {
      bg: "bg-blue-50",
      text: "text-blue-700 font-semibold",
      border: "border-blue-200/90",
      dotColor: "bg-blue-600",
    },
    opensource: {
      bg: "bg-emerald-50",
      text: "text-emerald-700 font-semibold",
      border: "border-emerald-200/90",
      dotColor: "bg-emerald-600",
    },
    competition: {
      bg: "bg-amber-50",
      text: "text-amber-800 font-semibold",
      border: "border-amber-200/90",
      dotColor: "bg-amber-600",
    },
    workshop: {
      bg: "bg-purple-50",
      text: "text-purple-700 font-semibold",
      border: "border-purple-200/90",
      dotColor: "bg-purple-600",
    },
    event: {
      bg: "bg-teal-50",
      text: "text-teal-700 font-semibold",
      border: "border-teal-200/90",
      dotColor: "bg-teal-600",
    },
    default: {
      bg: "bg-slate-100",
      text: "text-slate-700",
      border: "border-slate-200",
      dotColor: "bg-slate-400",
    },
  };

  const style = variantStyles[variant] || variantStyles.default;
  const sizeClass = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${style.bg} ${style.text} ${style.border} ${sizeClass} ${className} select-none transition-colors`}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${style.dotColor} flex-shrink-0`}
        />
      )}
      {children}
    </span>
  );
};
