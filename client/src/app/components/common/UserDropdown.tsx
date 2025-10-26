"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Settings, LifeBuoy, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useWeb3Auth } from "@web3auth/modal/react";
import { useUserStore } from "@/app/store/useUserStore";
import { User } from "@/app/store/useUserStore";

interface UserDropdownProps {
  user: User;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // ✅ Hooks
  const { web3Auth } = useWeb3Auth();
  const { clearUser } = useUserStore();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // ✅ Logout handler
  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      // Web3Auth logout
      await web3Auth?.logout();

      // Clear app state
      clearUser();
      localStorage.removeItem("idToken");
      localStorage.removeItem("user");

      // Remove axios token if present
      delete (window as any).axios?.defaults?.headers?.common["Authorization"];
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar trigger */}
      <div
        className="w-10 h-10 rounded-full overflow-hidden cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <img
          src={user.profileImage || "/assets/user.png"}
          alt="User Avatar"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl border border-gray-200 flex flex-col divide-y divide-gray-100 text-base z-20">
          <Link
            href="/support"
            className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 transition"
          >
            <LifeBuoy size={18} /> Support
          </Link>
          <Link
            href="/settings"
            className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 transition"
          >
            <Settings size={18} /> Settings
          </Link>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-2 px-4 py-3 text-left hover:bg-gray-50 transition text-red-600 disabled:opacity-50"
          >
            <LogOut size={18} /> {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
