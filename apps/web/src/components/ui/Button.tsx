import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost" | "cyan";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  className = "",
  disabled,
  ...props
}) => {
  const base =
    "relative inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5",
  }[size];

  const variantClasses = {
    primary:
      "bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-apple-sm hover:shadow-apple-md focus:ring-slate-900 focus:ring-offset-white",
    cyan:
      "bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-apple-sm hover:shadow-apple-md focus:ring-indigo-600 focus:ring-offset-white",
    secondary:
      "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200/80 focus:ring-slate-400 focus:ring-offset-white",
    outline:
      "bg-white hover:bg-slate-50 text-slate-700 border border-slate-300/90 shadow-apple-sm focus:ring-indigo-500 focus:ring-offset-white",
    danger:
      "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 focus:ring-red-500 focus:ring-offset-white",
    ghost:
      "bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 focus:ring-slate-400 focus:ring-offset-white",
  }[variant];

  return (
    <button
      className={`${base} ${sizeClasses} ${variantClasses} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
