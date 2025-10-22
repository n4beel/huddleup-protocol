import { Wallet2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import UserDropdown from './UserDropdown'

const TopBar = () => {
    return (
        <div className='w-full bg-white z-50 lg:max-w-5xl mx-auto flex items-center justify-between gap-4 p-4 relative'>
            <section className='flex items-center gap-2' >
                <Image src='/assets/logo.svg' alt='Logo' width={70} height={70} />
            </section>
            <section className='flex items-center gap-4'>
                <button>
                    <Wallet2 size={20} />
                </button>
                <Link className='text-primary text-base' href='/login'>Login</Link>
                <UserDropdown/>
            </section>
        </div>
    )
}

export default TopBar