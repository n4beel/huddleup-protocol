import React from "react";

interface SwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    className?: string;
}

const Switch: React.FC<SwitchProps> = ({
    checked,
    onChange,
    disabled = false,
    className = "",
}) => {
    return (
        <button
            type="button"
            onClick={() => !disabled && onChange(!checked)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none
        ${checked ? "bg-primary" : "bg-gray-300"}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300
          ${checked ? "translate-x-5" : "translate-x-1"}
        `}
            />
        </button>
    );
};

export default Switch;
