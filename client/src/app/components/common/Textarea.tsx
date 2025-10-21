import React from "react";
import clsx from "clsx";

interface TextareaProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  rows?: number;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  value,
  onChange,
  onKeyDown,
  placeholder = "",
  error,
  disabled = false,
  className = "",
  rows = 4,
  icon,
  iconPosition = "left",
}) => {
  return (
    <div className={clsx("flex flex-col w-full", className)}>
      {label && (
        <label className="text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <div className="relative w-full">
        {/* Optional Icon */}
        {icon && (
          <span
            className={clsx(
              "absolute top-3 text-gray-500",
              iconPosition === "left" ? "left-3" : "right-3"
            )}
          >
            {icon}
          </span>
        )}

        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className={clsx(
            "w-full rounded-lg border px-3 py-2 text-sm outline-none resize-none transition-all duration-200",
            icon && iconPosition === "left" && "pl-10",
            icon && iconPosition === "right" && "pr-10",
            disabled && "bg-gray-100 cursor-not-allowed opacity-60",
            error
              ? "border-red-500 focus:border-red-500"
              : "border-gray-300 focus:border-primary",
            "focus:ring-1 focus:ring-primary"
          )}
        />
      </div>

      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};

export default Textarea;
