import React from 'react'
import AppLayout from '../components/common/AppLayout'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, HelpCircle, LogOut, Settings } from 'lucide-react'
import EventPerformanceCard from '../components/Events/PerformanceChart'

// My Registered Events
// 2️⃣ Total Rewards Earned
// 3️⃣ Events Verified


const data = [
    { date: "2025-10-01", verified: 8 },
    { date: "2025-10-03", verified: 12 },
    { date: "2025-10-05", verified: 9 },
    { date: "2025-10-07", verified: 15 },
    { date: "2025-10-09", verified: 11 },
    { date: "2025-10-11", verified: 18 },
    { date: "2025-10-13", verified: 14 },
];

const Profile = () => {
    return (
        <AppLayout>
            <main className="w-full min-h-screen relative overflow-hidden p-4">
                <section className='w-full bg-white border border-gray-200 shadow-lg rounded-xl p-4'>
                    <div className='flex items-start gap-4'>
                        <Image src='/assets/user.png' alt='User' width={70} height={70} className='rounded-full' />
                        <div>
                            <h6 className='text-lg lg:text-xl font-medium'>Hamza khan</h6>
                            <p className='text-base text-foreground'>Organizer</p>

                        </div>
                    </div>
                </section>
                <section className='w-full grid grid-cols-12 gap-2 lg:gap-4 mt-6'>
                    <div className='col-span-6 flex flex-col items-center justify-center gap-2 bg-white border border-gray-200 shadow-lg rounded-xl p-4'>
                        <p className='text-sm lg:text-base text-foreground text-center'>
                            Total Events
                        </p>
                        <h6 className='text-lg lg:text-xl font-semibold text-center'>1500</h6>
                    </div>
                    <div className='col-span-6 flex flex-col items-center justify-center gap-2 bg-white border border-gray-200 shadow-lg rounded-xl p-4'>
                        <p className='text-sm lg:text-base text-foreground text-center'>
                            Participants Verified
                        </p>
                        <h6 className='text-lg lg:text-xl font-semibold text-center'>10,000</h6>
                    </div>
                    <div className='col-span-12 flex flex-col items-center justify-center gap-2 bg-white border border-gray-200 shadow-lg rounded-xl p-4'>
                        <p className='text-sm lg:text-base text-foreground text-center'>
                            Total PYUSD Funded
                        </p>
                        <h6 className='text-lg lg:text-xl font-semibold text-center'>
                            1,250 PYUSD
                        </h6>
                    </div>
                </section>
                <EventPerformanceCard
                    title="Event Performance"
                    subtitle="Mini graph via Envio"
                    data={data}
                    unit="participants"
                />
                <section className='w-full bg-white border border-gray-200 shadow-lg rounded-xl p-4 mt-6'>
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

            </main>
        </AppLayout>
    )
}

export default Profile