import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "warning";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 disabled:cursor-not-allowed";

  const variantStyles = {
    primary:
      "bg-[var(--semantic-azure)] text-white hover:bg-[#2563eb] active:bg-[#1d4ed8] focus-visible:ring-[rgba(59,130,246,0.35)] disabled:bg-[#93c5fd]",
    secondary:
      "bg-[var(--semantic-emerald)] text-white hover:bg-[#16a34a] active:bg-[#15803d] focus-visible:ring-[rgba(34,197,94,0.35)] disabled:bg-[#86efac]",
    warning:
      "bg-[var(--semantic-amber)] text-white hover:bg-[#d97706] active:bg-[#b45309] focus-visible:ring-[rgba(245,158,11,0.35)] disabled:bg-[#fcd34d]",
    outline:
      "border border-[var(--semantic-azure)] bg-transparent text-[var(--semantic-azure)] hover:bg-[rgba(59,130,246,0.08)] active:bg-[rgba(59,130,246,0.12)] focus-visible:ring-[rgba(59,130,246,0.2)] disabled:border-[rgba(59,130,246,0.35)] disabled:text-[rgba(59,130,246,0.35)]",
    danger:
      "bg-[var(--semantic-crimson)] text-white hover:bg-[#dc2626] active:bg-[#b91c1c] focus-visible:ring-[rgba(239,68,68,0.35)] disabled:bg-[#fca5a5]",
  } satisfies Record<NonNullable<ButtonProps["variant"]>, string>;

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const widthStyles = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
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
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}