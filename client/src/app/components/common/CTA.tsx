import React from 'react'
import { Button } from './Button'

const CTA = () => {
    return (
        <div className='w-full  lg:max-w-md mx-auto rounded-xl border border-dashed border-gray-300 p-4 flex flex-col items-center justify-center'>
            <h3 className='text-xl text-dark'>
                Host a Social Cause Event
            </h3>
            <p className='text-base text-foreground text-center'>
                Empower your community — fund impact using PYUSD
            </p>
            <Button variant='dark' size='full' className='mt-4' >
                Signup
            </Button>
        </div>
    )
}

export default CTA