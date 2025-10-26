'use client';

interface EventCardProps {
    event: {
        id: string;
        title: string;
        description: string;
        eventDate: string;
        location: string;
        eventType: string;
        fundingRequired: number;
        airdropAmount: number;
        currentParticipants: number;
        maxParticipants: number;
        status: 'draft' | 'funded' | 'completed' | 'cancelled';
        bannerImage?: string;
        organizerName: string;
        sponsorName?: string;
        currentFunding?: number;
        onchainEventId?: string;
        organizerId?: string;
        createdAt?: string;
        updatedAt?: string;
    };
    activeTab: 'needing-sponsorship' | 'my-sponsored' | 'past-sponsored';
    onSponsorEvent?: (eventId: string) => void;
    onViewDetails?: (eventId: string) => void;
    onTrackProgress?: (eventId: string) => void;
    onViewReport?: (eventId: string) => void;
    onShareResults?: (eventId: string) => void;
}

export default function EventCard({
    event,
    activeTab,
    onSponsorEvent,
    onViewDetails,
    onTrackProgress,
    onViewReport,
    onShareResults
}: EventCardProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'draft':
                return 'bg-yellow-100 text-yellow-800';
            case 'funded':
                return 'bg-green-100 text-green-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getEventTypeIcon = (eventType: string) => {
        switch (eventType) {
            case 'Environmental':
                return '🌱';
            case 'Education':
                return '📚';
            case 'Social Impact':
                return '🤝';
            case 'Health':
                return '🏥';
            case 'Professional':
                return '💼';
            case 'Conference':
                return '🎯';
            default:
                return '🎯';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow overflow-hidden">
            {/* Top Section - Image and Event Info */}
            <div className="flex">
                {/* Event Image */}
                <div className="w-32 h-32 flex-shrink-0">
                    {event.bannerImage ? (
                        <img
                            src={event.bannerImage}
                            alt={event.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-4xl">{getEventTypeIcon(event.eventType)}</span>
                        </div>
                    )}
                </div>

                {/* Event Details */}
                <div className="flex-1 p-4">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{event.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </span>
                    </div>

                    {/* Date and Time */}
                    <div className="flex items-center space-x-4 mb-2">
                        <div className="flex items-center space-x-1 text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm">{new Date(event.eventDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm">{new Date(event.eventDate).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })}</span>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">{event.description}</p>

                    {/* Organizer */}
                    <p className="text-xs text-gray-500">by {event.organizerName}</p>
                </div>
            </div>

            {/* Bottom Section - Location and Sponsorship */}
            <div className="px-4 pb-4">
                <div className="flex justify-between items-center">
                    {/* Location */}
                    <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">{event.location}</span>
                    </div>

                    {/* Sponsorship Amount */}
                    <div className="bg-orange-500 text-white px-3 py-1 rounded-full">
                        <span className="text-sm font-bold">{event.airdropAmount} PYUSD</span>
                    </div>
                </div>

                {/* Additional Info for Admin */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                        <div>
                            <span className="font-medium">Funding Required:</span> {formatCurrency(event.fundingRequired)}
                        </div>
                        <div>
                            <span className="font-medium">Participants:</span> {event.currentParticipants}/{event.maxParticipants}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4">
                    {activeTab === 'needing-sponsorship' && (
                        <button
                            onClick={() => onSponsorEvent?.(event.id)}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                            Sponsor Event
                        </button>
                    )}

                    {activeTab === 'my-sponsored' && (
                        <div className="flex space-x-2">
                            <button
                                onClick={() => onViewDetails?.(event.id)}
                                className="flex-1 bg-green-600 text-white py-2 px-3 rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                            >
                                View Details
                            </button>
                            <button
                                onClick={() => onTrackProgress?.(event.id)}
                                className="flex-1 bg-gray-600 text-white py-2 px-3 rounded-md hover:bg-gray-700 transition-colors text-sm font-medium"
                            >
                                Track Progress
                            </button>
                        </div>
                    )}

                    {activeTab === 'past-sponsored' && (
                        <div className="flex space-x-2">
                            <button
                                onClick={() => onViewReport?.(event.id)}
                                className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                                View Report
                            </button>
                            <button
                                onClick={() => onShareResults?.(event.id)}
                                className="flex-1 bg-gray-600 text-white py-2 px-3 rounded-md hover:bg-gray-700 transition-colors text-sm font-medium"
                            >
                                Share Results
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
