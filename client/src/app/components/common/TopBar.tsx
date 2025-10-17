import Image from 'next/image'
import React from 'react'
import Wallet from './Wallet'

const TopBar = () => {
    return (
        <div className='w-full bg-white z-50 lg:max-w-3xl mx-auto flex items-center justify-between gap-4 sticky top-0 left-0 right-0 p-4'>
            <section className='flex items-center gap-2' >
                <Image src='/assets/mock/user.png' alt='User' width={40} height={40} className='rounded-full' />
                <div className='flex flex-col'>
                    <p className='text-base text-foreground font-normal'>Hey,👋</p>
                    <h6 className='text-lg text-black font-normal'>Syed Mujtaba</h6>
                </div>
            </section>
            <section>
                <Wallet />
            </section>
        </div>
    )
}

export default TopBar