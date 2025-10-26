'use client'

import { ChartColumn, History, House, User,  } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const Navbar = () => {
    const pathname = usePathname()

    const navItems = [
        { href: '/', label: 'Home', icon: House },
        { href: '/myevents?tab=created', label: 'My Events', icon: ChartColumn },
        { href: '/leaderboard', label: 'Leaderboard', icon: History },
        { href: '/profile/me', label: 'Profile', icon: User },
    ]

    return (
        <nav className='w-full lg:max-w-5xl mx-auto flex items-center justify-center p-2'>
            <div className='w-full bg-white p-2  flex items-center justify-between'>
                {navItems.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href
                    return (
                        <Link key={href} href={href}>
                            <div
                                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors ${
                                    isActive
                                        ? 'text-primary'
                                        : 'text-black'
                                }`}
                            >
                                <Icon
                                    className={`w-10 ${
                                        isActive ? 'text-primary' : 'text-black'
                                    }`}
                                />
                                <span className='text-xs'>{label}</span>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}

export default Navbar
