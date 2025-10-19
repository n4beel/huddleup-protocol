'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import WalletConnection from './WalletConnection';
import WalletInfo from './WalletInfo';

const Navigation = () => {
    const pathname = usePathname();

    const navItems = [
        { href: '/', label: 'Home' },
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/profile', label: 'Profile' },
        { href: '/social', label: 'Social' },
        { href: '/settings', label: 'Settings' },
    ];

    return (
        <nav className="bg-white shadow-sm border-b">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-8">
                        <Link href="/" className="text-xl font-bold text-blue-600">
                            HuddleUp
                        </Link>
                        <div className="hidden md:flex space-x-6">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === item.href
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <WalletConnection className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                            Connect Wallet
                        </WalletConnection>
                        <WalletInfo />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
