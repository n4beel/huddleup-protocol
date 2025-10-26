import React from "react";
import clsx from "clsx";
import { Spinner } from "./Spinner";

type ButtonProps = {
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "danger" | "outline" | "light" | "dark";
    size?: "sm" | "md" | "lg" | "full";
    onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    className?: string;
    type?: "submit" | "reset" | "button";
    loading?: boolean;
};

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = "primary",
    size = "md",
    onClick,
    disabled = false,
    className,
    type,
    loading,
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={clsx(
                className,
                "font-space-grotesk cursor-pointer  rounded-lg font-medium transition duration-300 ease-in-out focus:outline-none flex items-center justify-center",
                "text-base lg:text-lg",
                {
                    // 🎨 Variant Styles
                    "bg-primary text-white hover:bg-white hover:text-primary border-primary hover:border hover:border-dark active:bg-primary":
                        variant === "primary",
                    "bg-dark text-white hover:bg-dark/90 hover:text-white border-dark hover:border hover:border-dark active:bg-dark/80":
                        variant === "dark",
                    "bg-secondary text-black hover:bg-secondary/70 active:bg-secondary/80":
                        variant === "secondary",
                    "bg-red-700 text-white hover:bg-red-600 active:bg-red-700":
                        variant === "danger",
                    "border border-primary text-primary bg-transparent hover:bg-primary hover:text-white":
                        variant === "outline",
                    "border border-dark text-dark bg-white hover:bg-gray-100 hover:text-primary active:bg-white":
                        variant === "light",
                        
                        
                    // 📏 Size Variations
                    "h-9 px-2 md:px-3": size === "sm",
                    "h-[50px] md:h-[55px] px-14 md:px-14 py-4 md:py-7 min-w-auto lg:min-w-[220px]": size === "md",
                    "h-[50px] px-4 md:px-5 py-2 md:py-3 min-w-[300px]": size === "lg",
                    "w-full h-[55px] py-2 md:py-3": size === "full",

                    // 🚫 Disabled State
                    "opacity-50 cursor-not-allowed": disabled,
                }
            )}
        >
            {loading ? <Spinner variant={variant === "outline" ? "primary" : "white"} size="sm" /> : children}
        </button>
    );
};
