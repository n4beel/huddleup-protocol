'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { eventsService, type Event } from '@/services/events.service';
import EventCard from '@/components/EventCard';


export default function Dashboard() {
    const [activeTab, setActiveTab] = useState<'needing-sponsorship' | 'my-sponsored' | 'past-sponsored'>('needing-sponsorship');
    const [eventsNeedingSponsorship, setEventsNeedingSponsorship] = useState<Event[]>([]);
    const [mySponsoredEvents, setMySponsoredEvents] = useState<Event[]>([]);
    const [pastSponsoredEvents, setPastSponsoredEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { user, isAuthenticated } = useAuth();

    // Fetch events based on active tab
    const fetchEvents = async () => {
        if (!isAuthenticated || !user?.id) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const [needingSponsorship, sponsoredEvents] = await Promise.all([
                eventsService.getEventsNeedingSponsorship(),
                eventsService.getAllSponsoredEvents(user.id)
            ]);

            setEventsNeedingSponsorship(needingSponsorship);
            setMySponsoredEvents(sponsoredEvents.active);
            setPastSponsoredEvents(sponsoredEvents.past);
        } catch (err) {
            console.error('Failed to fetch events:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch events');
        } finally {
            setLoading(false);
        }
    };

    // Fetch events when component mounts or user changes
    useEffect(() => {
        fetchEvents();
    }, [isAuthenticated, user?.id]);

    // Event handlers
    const handleSponsorEvent = (eventId: string) => {
        console.log('Sponsor event:', eventId);
        // TODO: Implement sponsorship flow
    };

    const handleViewDetails = (eventId: string) => {
        console.log('View details:', eventId);
        // TODO: Navigate to event details
    };

    const handleTrackProgress = (eventId: string) => {
        console.log('Track progress:', eventId);
        // TODO: Navigate to progress tracking
    };

    const handleViewReport = (eventId: string) => {
        console.log('View report:', eventId);
        // TODO: Navigate to event report
    };

    const handleShareResults = (eventId: string) => {
        console.log('Share results:', eventId);
        // TODO: Implement sharing functionality
    };


    const getCurrentEvents = () => {
        switch (activeTab) {
            case 'needing-sponsorship':
                return eventsNeedingSponsorship;
            case 'my-sponsored':
                return mySponsoredEvents;
            case 'past-sponsored':
                return pastSponsoredEvents;
            default:
                return [];
        }
    };

    // Show loading state
    if (loading) {
        return (
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Event Dashboard</h1>
                    <p className="text-gray-600">Manage and discover social impact events on HuddleUp Protocol</p>
                </div>
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Loading events...</span>
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Event Dashboard</h1>
                    <p className="text-gray-600">Manage and discover social impact events on HuddleUp Protocol</p>
                </div>
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading events</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={fetchEvents}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Event Dashboard</h1>
                <p className="text-gray-600">Manage and discover social impact events on HuddleUp Protocol</p>
            </div>

            {/* Tab Navigation */}
            <div className="mb-8">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('needing-sponsorship')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'needing-sponsorship'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Events Needing Sponsorship ({eventsNeedingSponsorship.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('my-sponsored')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'my-sponsored'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            My Sponsored Events ({mySponsoredEvents.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('past-sponsored')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'past-sponsored'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Past Sponsored Events ({pastSponsoredEvents.length})
                        </button>
                    </nav>
                </div>
            </div>

            {/* Tab Content */}
            <div>
                {getCurrentEvents().length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {getCurrentEvents().map((event) => (
                            <EventCard
                                key={event.id}
                                event={event}
                                activeTab={activeTab}
                                onSponsorEvent={handleSponsorEvent}
                                onViewDetails={handleViewDetails}
                                onTrackProgress={handleTrackProgress}
                                onViewReport={handleViewReport}
                                onShareResults={handleShareResults}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                        <p className="text-gray-600">
                            {activeTab === 'needing-sponsorship' && 'No events are currently seeking sponsorship.'}
                            {activeTab === 'my-sponsored' && 'You haven\'t sponsored any events yet.'}
                            {activeTab === 'past-sponsored' && 'You haven\'t completed any sponsored events yet.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
