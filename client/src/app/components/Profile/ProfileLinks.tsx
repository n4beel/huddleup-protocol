import React from 'react'
import { ChevronRight, HelpCircle, LogOut, Settings } from 'lucide-react'
import Link from 'next/link'
const ProfileLinks = () => {
    return (
        <section className='w-full h-full  bg-white border border-gray-200 shadow-lg rounded-xl p-4'>
            <div className="flex flex-col divide-y divide-gray-100">
                <Link
                    href="/settings"
                    className="flex items-center justify-between p-4 active:bg-gray-50 rounded-xl transition"
                >
                    <div className="flex items-center gap-3">
                        <Settings size={20} className="text-teal-600" />
                        <span className="text-foreground text-base font-medium">
                            Settings</span>
                    </div>
                    <span className="text-foreground text-xs">
                        <ChevronRight size={18} />
                    </span>
                </Link>

                <Link
                    href="/help"
                    className="flex items-center justify-between p-4 active:bg-gray-50 rounded-xl transition"
                >
                    <div className="flex items-center gap-3">
                        <HelpCircle size={20} className="text-blue-600" />
                        <span className="text-foreground text-base font-medium">
                            Help & Support
                        </span>
                    </div>
                    <span className="text-foreground text-xs">
                        <ChevronRight size={18} />
                    </span>
                </Link>

                <Link
                    href="/logout"
                    className="flex items-center justify-between p-4 active:bg-gray-50 rounded-xl transition"
                >
                    <div className="flex items-center gap-3">
                        <LogOut size={20} className="text-red-500" />
                        <span className="text-foreground text-base font-medium">
                            Logout</span>
                    </div>
                    <span className="text-foreground text-xs">
                        <ChevronRight size={18} />
                    </span>
                </Link>
            </div>
        </section>
    )
}

export default ProfileLinks