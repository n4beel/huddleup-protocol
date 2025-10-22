export class Event {
    id: string;
    title: string;
    description: string;
    eventDate: Date;
    location: string;
    eventType: string;
    status: 'draft' | 'funded' | 'completed' | 'cancelled';
    bannerImage?: string; // Cloudinary URL for event banner

    // Organizer fields
    organizerId: string;
    fundingRequired: number; // Amount in USD
    airdropAmount: number; // Per participant amount in USD

    // Calculated fields
    maxParticipants: number; // fundingRequired / airdropAmount
    currentParticipants: number;
    currentFunding: number;

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
    fundedAt?: Date;
    completedAt?: Date;

    // Optional sponsor fields
    sponsorId?: string;
    sponsorAmount?: number;
    sponsorFundedAt?: Date;
}

export interface CreateEventDto {
    title: string;
    description: string;
    eventDate: string; // ISO string
    location: string;
    eventType: string;
    fundingRequired: number;
    airdropAmount: number;
    bannerImage?: string; // Optional Cloudinary URL for event banner
}

export interface UpdateEventDto {
    title?: string;
    description?: string;
    eventDate?: string; // ISO string
    location?: string;
    eventType?: string;
    fundingRequired?: number;
    airdropAmount?: number;
    status?: 'draft' | 'funded' | 'completed' | 'cancelled';
    bannerImage?: string; // Optional Cloudinary URL for event banner
}

export interface EventParticipationDto {
    userId: string;
    eventId: string;
    joinedAt: Date;
    isActive: boolean;
}

export interface FundEventDto {
    sponsorId: string;
    amount: number;
}
