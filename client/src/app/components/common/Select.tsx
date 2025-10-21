import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import clsx from "clsx";

type Option = {
  title: string;
  _id: string;
};

type SelectProps = {
  label?: string;
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
};

export const Select = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Select an option",
  error,
  disabled = false,
}: SelectProps) => {
  const [open, setOpen] = useState(false);

  const selectedOption = options.find((option) => option._id === value);

  return (
    <div className="relative w-full">
      {label && (
        <label className="text-dark text-sm font-medium mb-1 block">{label}</label>
      )}

      <button
        type="button"
        onClick={() => !disabled && setOpen((prev) => !prev)}
        disabled={disabled}
        className={clsx(
          "w-full h-12 md:h-[50px] flex items-center justify-between border rounded-lg px-4 py-2 bg-white transition",
          error ? "border-red-500" : "border-gray-300",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        )}
      >
        {selectedOption ? (
          <span className="text-dark text-sm md:text-base">
            {selectedOption.title}
          </span>
        ) : (
          <span className="text-gray text-sm md:text-base">{placeholder}</span>
        )}
        <ChevronDown className="w-5 h-5 text-gray" />
      </button>

      {open && !disabled && (
        <div className="absolute w-full h-auto mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10 py-2">
          {options.map((option) => (
            <div
              key={option._id}
              className={clsx(
                "flex items-center justify-between px-4 py-2 cursor-pointer transition hover:bg-gray-50",
                value === option._id && "font-medium text-primary"
              )}
              onClick={() => {
                onChange(option._id);
                setOpen(false);
              }}
            >
              <span>{option.title}</span>
              {value === option._id && (
                <Check className="w-5 h-5 text-primary" />
              )}
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};
