"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Settings, LifeBuoy, LogOut } from "lucide-react";

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar trigger */}
      <div
        className="w-10 h-10 rounded-full overflow-hidden cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <img
          src="/assets/user.png"
          alt="User Avatar"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl border border-gray-200 flex flex-col divide-y divide-gray-100 text-base z-20">
          <Link href="/support" className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 transition">
            <LifeBuoy size={18} /> Support
          </Link>
          <Link href="/settings" className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 transition">
            <Settings size={18} /> Settings
          </Link>
          <Link href="/logout" className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 transition">
            <LogOut size={18} /> Logout
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
