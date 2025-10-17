'use client'

import { ChartColumn, History, House, Plus, Wallet2 } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const BottomNav = () => {
    const pathname = usePathname()

    const navItems = [
        { href: '/', label: 'Home', icon: House },
        { href: '/active', label: 'Active', icon: ChartColumn },
        { href: '/create', label: 'Build', icon: Plus },
        { href: '/history', label: 'History', icon: History },
        { href: '/wallet', label: 'Wallet', icon: Wallet2 },
    ]

    return (
        <nav className='w-full lg:max-w-3xl mx-auto flex items-center justify-center fixed bottom-0 left-0 right-0 p-4'>
            <div className='w-full max-w-[100%] bg-dark p-2 rounded-xl flex items-center justify-around'>
                {navItems.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href
                    return (
                        <Link key={href} href={href}>
                            <div
                                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors ${
                                    isActive
                                        ? 'bg-secondary text-black'
                                        : 'text-white'
                                }`}
                            >
                                <Icon
                                    className={`w-5 ${
                                        isActive ? 'text-black' : 'text-white'
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

export default BottomNav
