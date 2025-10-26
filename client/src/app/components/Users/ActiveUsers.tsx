
import Link from 'next/link'
import React from 'react'
import UserCard from './UserCard'

const ActiveUsers = () => {
    return (
        <div className='w-full h-auto relative'>
            <section className='flex items-center justify-between'>
                <h4 className='text-lg lg:text-xl font-semibold text-dark'>
                    Active Organizer
                </h4>
                <Link href='/events/all' className='text-primary text-base'>
                    See More
                </Link>
            </section>
            <section className='flex flex-col lg:flex-row gap-4 my-6'>
                {Array(3).fill(0).map((u, i) => (
                    <UserCard key={i} />
                ))}
            </section>
        </div>
    )
}

export default ActiveUsers