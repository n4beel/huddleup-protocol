import { Wallet2 } from 'lucide-react'
import React from 'react'

const Wallet = () => {
    return (
        <div className='relative'>
            <button className='flex items-center gap-2 px-4 py-2 bg-primary-dark rounded-lg text-white font-semibold shadow-[0px_15px_28px_0px_#9DFFF4]'>
                <Wallet2 size={15} />
                Connect
            </button>
        </div>
    )
}

export default Wallet