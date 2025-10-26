"use client";

import { Copy, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import UserDropdown from "./UserDropdown";
import { useUserStore } from "@/app/store/useUserStore";

const TopBar = () => {
    const { user } = useUserStore();
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        if (!user?.walletAddress) return;
        try {
            await navigator.clipboard.writeText(user.walletAddress);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500); // Reset icon after 1.5s
        } catch (err) {
            console.error("Failed to copy address:", err);
        }
    };

    // Shorten wallet address for UI (e.g. 0x42a1...64bA)
    const shortenAddress = (addr: string) =>
        `${addr.slice(0, 6)}...${addr.slice(-4)}`;

    return (
        <div className="w-full bg-white z-50 lg:max-w-5xl mx-auto flex items-center justify-between gap-4 p-4 border-b border-gray-100">
            <section className="flex items-center gap-2">
                <Image src="/assets/logo.jpeg" alt="Logo" width={60} height={60} />
            </section>

            <section className="flex items-center gap-4">
                {user?.walletAddress && (
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full">
                        <span className="font-mono text-sm text-gray-700">
                            {shortenAddress(user.walletAddress)}
                        </span>
                        <button
                            onClick={handleCopy}
                            className="text-gray-500 hover:text-primary transition-colors"
                            title={copied ? "Copied!" : "Copy address"}
                        >
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                    </div>
                )}

                {user ? (
                    <UserDropdown user={user} />
                ) : (
                    <Link
                        className="text-primary text-base font-medium hover:underline"
                        href="/login"
                    >
                        Login
                    </Link>
                )}
            </section>
        </div>
    );
};

export default TopBar;
