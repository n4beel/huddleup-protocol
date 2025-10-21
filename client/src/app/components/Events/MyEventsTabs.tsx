'use client';
import React from 'react'
import Tabs from '../common/Tabs';


const tabs = [
    { id: 'active', title: 'Active' },
    { id: 'past', title: 'Past' },
];

const MyEventsTabs = () => {
    return (
        <div className="p-2">
            <Tabs
                tabs={tabs}
                className="mb-6"
            />
        </div>
    )
}

export default MyEventsTabs