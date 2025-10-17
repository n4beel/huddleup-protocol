"use client"
import { ReactNode } from "react";
import clsx from "clsx";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  title: string;
  children: ReactNode;
  h?: number;
  p?: string;
  transparent?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  h = 30,
  p = "p-4",
  transparent = false
}) => {
  return (
    <div
      className={clsx(
        "fixed inset-0 z-50 transition-opacity duration-200",
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 transition-opacity"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className={clsx(
          "absolute w-full lg:w-full md:max-w-xl lg:max-w-2xl transform transition-all duration-300 ease-in-out",
          "bottom-0 lg:bottom-auto sm:top-1/2 sm:left-1/2",
          "sm:-translate-x-1/2 sm:-translate-y-1/2",
          isOpen
            ? "translate-y-0 sm:scale-100 sm:opacity-100"
            : "translate-y-full sm:scale-95 sm:opacity-0"
        )}
      >
        {/* Modal Box */}
        <div className={clsx(
          "rounded-t-4xl sm:rounded-lg  w-full overflow-hidden",
          transparent ? "bg-transparent" : "bg-white shadow-lg"
        )}>
          {/* Header */}
          {title && (
            <section className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h3 className="text-base lg:text-lg font-semibold">{title}</h3>
              {onClose && (
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
            </section>
          )}

          {/* Content */}
          <div
            className={`w-full min-h-[${h}vh] max-h-[80vh] overflow-y-auto ${p}`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
