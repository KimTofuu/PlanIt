import React from "react";

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  variant?: "outlined" | "filled" | "standard";
}

export default function Field({
  label,
  error,
  helperText,
  fullWidth = false,
  variant = "outlined",
  className = "",
  id,
  ...props
}: FieldProps) {
  const inputId = id || `field-${Math.random().toString(36).substr(2, 9)}`;

  const baseStyles = "transition-colors focus:outline-none";

  const variantStyles = {
    outlined:
      "border border-neutral-300 dark:border-neutral-600 rounded-md px-3 py-2 bg-white dark:bg-neutral-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
    filled:
      "border-b-2 border-neutral-300 dark:border-neutral-600 px-3 py-2 bg-neutral-100 dark:bg-neutral-800 focus:border-blue-500",
    standard:
      "border-b border-neutral-300 dark:border-neutral-600 px-0 py-2 bg-transparent focus:border-blue-500",
  };

  const errorStyles = error
    ? "border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500"
    : "";

  const widthStyles = fullWidth ? "w-full" : "";

  const disabledStyles = props.disabled
    ? "opacity-60 cursor-not-allowed bg-neutral-100 dark:bg-neutral-800"
    : "";

  return (
    <div className={`${fullWidth ? "w-full" : ""}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
        >
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={`${baseStyles} ${variantStyles[variant]} ${errorStyles} ${widthStyles} ${disabledStyles} ${className} text-neutral-900 dark:text-neutral-100`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          {helperText}
        </p>
      )}
    </div>
  );
}