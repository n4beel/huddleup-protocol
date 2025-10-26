'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface RouteProtectionProps {
    children: React.ReactNode;
}

const RouteProtection = ({ children }: RouteProtectionProps) => {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [hasRedirected, setHasRedirected] = useState(false);

    useEffect(() => {
        // Don't redirect while loading
        if (isLoading) return;

        // Prevent multiple redirects
        if (hasRedirected) return;

        // If user is authenticated and on home page, redirect to dashboard
        if (isAuthenticated && pathname === '/') {
            setHasRedirected(true);
            router.push('/dashboard');
            return;
        }

        // If user is not authenticated and trying to access protected routes, redirect to home
        if (!isAuthenticated && (pathname === '/dashboard' || pathname === '/profile')) {
            setHasRedirected(true);
            router.push('/');
            return;
        }
    }, [isAuthenticated, isLoading, pathname, router, hasRedirected]);

    // Reset redirect flag when pathname changes
    useEffect(() => {
        setHasRedirected(false);
    }, [pathname]);

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Don't render children if redirecting
    if (hasRedirected) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return <>{children}</>;
};

export default RouteProtection;
