'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Tab {
    id: string;
    title: string;
}

interface TabsProps {
    tabs: Tab[];
    activeTab?: string;
    onTabChange?: (tabId: string) => void;
    className?: string;
}

const Tabs: React.FC<TabsProps> = ({
    tabs,
    activeTab,
    onTabChange,
    className = '',
}) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Read the "tab" query param from URL
    const queryTab = searchParams.get('tab');
    const currentTab = activeTab || queryTab || tabs[0]?.id;

    const handleTabClick = (tabId: string) => {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set('tab', tabId);

        // Push the same route but with ?tab=<tabId>
        router.push(`?${newParams.toString()}`);

        if (onTabChange) onTabChange(tabId);
    };

    return (
        <div className={`overflow-x-auto scrollbar-hide ${className}`}>
            <div className="flex items-center gap-8 min-w-max whitespace-nowrap">
                {tabs.map(({ id, title }) => (
                    <button
                        key={id}
                        onClick={() => handleTabClick(id)}
                        className={`px-4 py-2 text-base lg:text-lg font-medium transition-all duration-200 ${
                            currentTab?.toLowerCase() === id.toLowerCase()
                                ? 'border-b-2 border-primary text-primary'
                                : 'text-foreground hover:text-primary'
                        }`}
                    >
                        {title}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Tabs;
