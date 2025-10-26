"use client";
import React from 'react';
import { Button } from './Button';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/app/store/useUserStore';

const CTA = () => {
  const router = useRouter();
  const { user } = useUserStore();

  const handleClick = () => {
    if (user) {
      router.push('/events/create'); // ✅ go to create event page
    } else {
      router.push('/login'); // ✅ go to login page
    }
  };

  return (
    <div className='w-full lg:max-w-md mx-auto rounded-xl border border-dashed border-gray-300 p-4 flex flex-col items-center justify-center'>
      <h3 className='text-xl text-dark'>
        Host a Social Cause Event
      </h3>
      <p className='text-base text-foreground text-center'>
        Empower your community — fund impact using PYUSD
      </p>
      <Button
        variant='dark'
        size='full'
        className='mt-4'
        onClick={handleClick}
      >
        {user ? 'Create Event' : 'Register'}
      </Button>
    </div>
  );
};

export default CTA;
