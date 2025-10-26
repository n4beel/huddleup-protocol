
export interface Event {
    id: string;
    title: string;
    description: string;
    eventDate: string;
    location: string;
    eventType: string;
    status: string;
    bannerImage: string;
    organizerId: string;
    fundingRequired: number;
    airdropAmount: number;
    maxParticipants: number;
    currentParticipants: number;
    currentFunding: number;
    createdAt: string;
    updatedAt: string;
    fundedAt?: string;
    sponsorId?: string;
    sponsorAmount?: number;
    sponsorFundedAt?: string;
    relationship? : string
}