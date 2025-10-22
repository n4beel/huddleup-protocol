import Image from 'next/image'
import React from 'react'

const UserCard = () => {
    return (
        <div
            className={`w-full p-3 bg-white shadow-xl rounded-lg border border-gray-300 overflow-hidden transition-all cursor-pointer`}
        >
            <div className="flex items-start gap-4">
                <Image
                    src='/assets/user.png'
                    alt='User'
                    width={70}
                    height={70}
                    className="object-cover rounded-full"
                />
                <div>
                    <h6 className="text-base lg:text-lg text-black">Hamza Khan</h6>
                    <div className="flex items-center justify-between gap-4 mt-1">
                        <div className='flex flex-col border-r border-gray-300 pe-2'>
                            <p className='text-base text-foreground'>Total Events</p>
                            <p className='text-base text-primary'>20k</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserCard