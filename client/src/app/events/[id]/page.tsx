import AppLayout from '@/app/components/common/AppLayout'
import { Button } from '@/app/components/common/Button'
import { Calendar, Clock, DollarSign, MapPin, Users } from 'lucide-react'
import Image from 'next/image'
import React from 'react'


const event = {
    id: 3,
    name: "Tree Planting Marathon",
    cause: "Climate Action",
    location: "Portland, OR",
    date: "2025-11-20",
    reward: "6 PYUSD",
    image: "/assets/event.jpeg", // example image
}

const EventDetail = () => {
    return (
        <AppLayout>
            <main className="w-full min-h-[calc(100vh-220px)] overflow-y-scroll relative overflow-hidden p-4">
                <div className='w-full relative grid grid-cols-12 gap-4'>
                    <div className='col-span-12 lg:col-span-5'>
                        <span className='absolute top-2 left-2 px-4 py-2 text-base rounded-xl border text-primary bg-white min-w-[150px]'>
                            {event.cause}
                        </span>
                        <Image src={event.image} alt='Event' width={800} height={400} className='rounded-xl mx-auto' />
                    </div>
                    <div className='col-span-12 lg:col-span-7 p-2'>
                        <h1 className='text-2xl lg:text-4xl font-bold text-black'>
                            {event.name}
                        </h1>
                        <p className='text-base text-foreground mt-2'>
                            Lorem ipsum is a dummy or placeholder text commonly used in graphic design, publishing, and web development.
                        </p>
                        <div className="flex items-center justify-between gap-4 mt-4">
                            <p className="flex items-center gap-2 text-foreground text-base"><Calendar size={20} /> 1 Jan 2025</p>
                            <p className="flex items-center gap-2 text-foreground text-base"><Clock size={20} /> 7PM</p>
                            <p className="flex items-center gap-2 text-foreground text-base"><Users size={20} /> 40K Participants</p>
                        </div>
                        <hr className='my-6 border-b border-gray-200' />
                        <div className="flex items-center gap-4 mt-4">
                            <span className="w-9 h-9 rounded-xl bg-success/20 flex items-center justify-center">
                                <MapPin size={18} className="text-black" />
                            </span>
                            <p className="text-base text-black">{event.location}</p>
                        </div>
                        <div className="flex items-center gap-4 mt-4">
                            <span className="w-9 h-9 rounded-xl bg-secondary/50 flex items-center justify-center">
                                <DollarSign size={18} className="text-black" />
                            </span>
                            <p className="text-base text-black">20 PYUD</p>
                        </div>
                    </div>
                </div>
                <hr className='my-6 border-b border-gray-200' />
                <div className='w-full my-4 flex flex-col lg:flex-row items-start gap-4 lg:items-center justify-between'>
                    <div className='flex items-start gap-4'>
                        <Image src='/assets/user.png' alt='User' width={50} height={50} className='rounded-full' />
                        <div>
                            <h6 className='text-lg lg:text-xl font-medium'>Hamza khan</h6>
                            <p className='text-base text-foreground'>Organizer</p>
                        </div>
                    </div>
                    <Button variant='dark' size='lg' className='mt-4 w-full lg:w-auto'>
                        Interested
                    </Button>
                </div>
            </main>
        </AppLayout>
    )
}

export default EventDetail