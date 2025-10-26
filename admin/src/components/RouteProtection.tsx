'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface RouteProtectionProps {
    children: React.ReactNode;
}

const RouteProtection = ({ children }: RouteProtectionProps) => {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Don't redirect while loading
        if (isLoading) return;

        // If user is authenticated and on home page, redirect to dashboard
        if (isAuthenticated && pathname === '/') {
            router.push('/dashboard');
            return;
        }

        // If user is not authenticated and trying to access protected routes, redirect to home
        if (!isAuthenticated && (pathname === '/dashboard' || pathname === '/profile')) {
            router.push('/');
            return;
        }
    }, [isAuthenticated, isLoading, pathname, router]);

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Don't render children if redirecting
    if (isAuthenticated && pathname === '/') {
        return null;
    }

    if (!isAuthenticated && (pathname === '/dashboard' || pathname === '/profile')) {
        return null;
    }

    return <>{children}</>;
};

export default RouteProtection;
