import React from 'react'
import BottomNav from './BottomNav';
import TopBar from './TopBar';

interface AppLayoutProps {
    children: React.ReactNode;
    showTopbar?: boolean;
}
const AppLayout: React.FC<AppLayoutProps> = ({ children, showTopbar = true }) => {
    return (
        <div className='w-full h-auto relative pb-12 lg:pb-20'>
            {showTopbar ? (
                <TopBar />
            ) : ''}
            {children}
            <BottomNav />
        </div>
    )
}

export default AppLayout