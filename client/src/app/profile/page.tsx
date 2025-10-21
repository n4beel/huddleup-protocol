import React from 'react'
import AppLayout from '../components/common/AppLayout'
import Image from 'next/image'
import EventPerformanceCard from '../components/Events/PerformanceChart'
import ProfileLinks from '../components/Profile/ProfileLinks'

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
                <div className='w-full grid grid-cols-12 gap-4'>
                    <div className='col-span-12 lg:col-span-4 flex flex-col gap-6'>
                        <section className='w-full bg-white border border-gray-200 shadow-lg rounded-xl p-4'>
                            <div className='flex items-start gap-4'>
                                <Image src='/assets/user.png' alt='User' width={70} height={70} className='rounded-full' />
                                <div>
                                    <h6 className='text-lg lg:text-xl font-medium'>Hamza khan</h6>
                                    <p className='text-base text-foreground'>Organizer</p>

                                </div>
                            </div>
                        </section>
                        <div className='hidden lg:block h-full'>
                            <ProfileLinks />
                        </div>
                    </div>
                    <div className='col-span-12 lg:col-span-8 flex flex-col gap-6'>
                        <section className='w-full grid grid-cols-12 gap-2 lg:gap-4'>
                            <div className='col-span-6 lg:col-span-4 flex flex-col items-center justify-center gap-4 bg-white border border-gray-200 shadow-lg rounded-xl p-4'>
                                <p className='text-sm lg:text-base text-foreground text-center'>
                                    Total Events
                                </p>
                                <h6 className='text-lg lg:text-xl font-semibold text-center'>1500</h6>
                            </div>
                            <div className='col-span-6 lg:col-span-4 flex flex-col items-center justify-center gap-2 bg-white border border-gray-200 shadow-lg rounded-xl p-4'>
                                <p className='text-sm lg:text-base text-foreground text-center'>
                                    Participants Verified
                                </p>
                                <h6 className='text-lg lg:text-xl font-semibold text-center'>10,000</h6>
                            </div>
                            <div className='col-span-12 lg:col-span-4 flex flex-col items-center justify-center gap-2 bg-white border border-gray-200 shadow-lg rounded-xl p-4'>
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
                    </div>
                </div>
                <div className='block lg:hidden h-full mt-6'>
                    <ProfileLinks />
                </div>
            </main>
        </AppLayout>
    )
}

export default Profile