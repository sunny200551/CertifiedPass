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
  inset?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "md",
  className = "",
  dot = false,
  inset = false,
}) => {
  const variantStyles: Record<
    BadgeVariant,
    { bg: string; text: string; dotColor: string }
  > = {
    verified: {
      bg: "bg-[var(--accent-green-bg)]",
      text: "text-[var(--accent-green)] font-semibold",
      dotColor: "bg-[var(--accent-green)]",
    },
    active: {
      bg: "bg-[var(--accent-blue-bg)]",
      text: "text-[var(--accent-blue)] font-semibold",
      dotColor: "bg-[var(--accent-blue)]",
    },
    invalid: {
      bg: "bg-red-500/10",
      text: "text-red-500 font-semibold",
      dotColor: "bg-red-500",
    },
    revoked: {
      bg: "bg-[var(--accent-amber-bg)]",
      text: "text-[var(--accent-amber)] font-semibold",
      dotColor: "bg-[var(--accent-amber)]",
    },
    pending: {
      bg: "bg-[var(--surface-bg)]",
      text: "text-[var(--text-secondary)] font-semibold",
      dotColor: "bg-[var(--text-secondary)]",
    },
    hackathon: {
      bg: "bg-[var(--accent-blue-bg)]",
      text: "text-[var(--accent-blue)] font-bold",
      dotColor: "bg-[var(--accent-blue)]",
    },
    internship: {
      bg: "bg-[var(--accent-cyan-bg)]",
      text: "text-[var(--accent-cyan)] font-bold",
      dotColor: "bg-[var(--accent-cyan)]",
    },
    opensource: {
      bg: "bg-[var(--accent-green-bg)]",
      text: "text-[var(--accent-green)] font-bold",
      dotColor: "bg-[var(--accent-green)]",
    },
    competition: {
      bg: "bg-[var(--accent-amber-bg)]",
      text: "text-[var(--accent-amber)] font-bold",
      dotColor: "bg-[var(--accent-amber)]",
    },
    workshop: {
      bg: "bg-[var(--accent-purple-bg)]",
      text: "text-[var(--accent-purple)] font-bold",
      dotColor: "bg-[var(--accent-purple)]",
    },
    event: {
      bg: "bg-[var(--accent-pink-bg)]",
      text: "text-[var(--accent-pink)] font-bold",
      dotColor: "bg-[var(--accent-pink)]",
    },
    default: {
      bg: "bg-[var(--surface-bg)]",
      text: "text-[var(--text-primary)] font-medium",
      dotColor: "bg-[var(--brand-indigo)]",
    },
  };

  const style = variantStyles[variant] || variantStyles.default;
  const sizeClass =
    size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs";
  const shadowClass = inset ? "neo-inset-sm" : "neo-raised-sm";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full ${shadowClass} ${style.bg} ${style.text} ${sizeClass} ${className} select-none transition-all`}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${style.dotColor} flex-shrink-0 animate-pulse-glow`}
        />
      )}
      {children}
    </span>
  );
};
