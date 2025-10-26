"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Input from "../common/Input";

const EventSearch = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    // initialize from existing ?search=
    const initialSearch = searchParams.get("search") || "";
    const [search, setSearch] = useState(initialSearch);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();

            const params = new URLSearchParams(searchParams.toString());

            if (search.trim()) {
                params.set("search", search.trim());
            } else {
                params.delete("search");
            }

            router.push(`?${params.toString()}`);
        }
    };

    return (
        <div className="w-full">
            <Input
                value={search}
                onChange={(e) => setSearch(e)}
                onKeyDown={handleKeyDown}
                placeholder="Search Events"
            />
        </div>
    );
};

export default EventSearch;
