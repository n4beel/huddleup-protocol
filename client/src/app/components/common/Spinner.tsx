import React from "react";
import clsx from "clsx";

type SpinnerProps = {
    size?: "sm" | "md" | "lg";
    variant?: "primary" | "secondary" | "white";
};

export const Spinner: React.FC<SpinnerProps> = ({ size = "md", variant = "primary" }) => {
    const sizeClasses = {
        sm: "w-6 h-6 border-2",
        md: "w-8 h-8 border-4",
        lg: "w-12 h-12 border-4",
    };

    const variantClasses = {
        primary: "border-t-primary border-gray-100",
        secondary: "border-t-secondary border-gray-100",
        white: "border-t-white border-gray-100",
    };

    return (
        <div
            className={clsx(
                "animate-spin rounded-full border-4 border-solid",
                sizeClasses[size],
                variantClasses[variant]
            )}
        />
    );
};
