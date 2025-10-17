import React from "react";
import clsx from "clsx";

interface InputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode; // 👈 optional icon
  iconPosition?: "left" | "right"; // 👈 where to place it
}

const Input: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  error,
  disabled = false,
  className = "",
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
        {/* 👇 Optional Icon */}
        {icon && (
          <span
            className={clsx(
              "absolute top-1/2 -translate-y-1/2 text-gray-500",
              iconPosition === "left" ? "left-3" : "right-3"
            )}
          >
            {icon}
          </span>
        )}

        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={clsx(
            "w-full h-[50px] rounded-lg border px-3 py-2 text-sm outline-none transition-all duration-200",
            icon && iconPosition === "left" && "pl-10", // 👈 add padding when icon on left
            icon && iconPosition === "right" && "pr-10", // 👈 add padding when icon on right
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

export default Input;
