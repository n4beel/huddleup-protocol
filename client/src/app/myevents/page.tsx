// pages/myevents.tsx (or app/myevents/page.tsx)
"use client";
import React, { Suspense } from "react"; // Only need Suspense from React
import AppLayout from "../components/common/AppLayout";
import MyEventsContent from "../components/Events/MyEventsContent"; // Import the new component
import { Spinner } from "../components/common/Spinner"; // For the fallback

const MyEvents = () => {
    return (
        <AppLayout>
            <main className="w-full min-h-screen relative overflow-hidden p-4">
                {/* Wrap the component that uses useSearchParams in Suspense */}
                <Suspense fallback={<div className="flex justify-center items-center h-screen"><Spinner /></div>}>
                    <MyEventsContent />
                </Suspense>
            </main>
        </AppLayout>
    );
};

export default MyEvents;