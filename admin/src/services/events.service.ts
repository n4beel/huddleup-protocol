/**
 * Events Service
 * 
 * Handles communication with the backend events APIs
 */

interface Event {
    id: string;
    title: string;
    description: string;
    eventDate: string; // ISO string format
    location: string;
    eventType: string;
    fundingRequired: number; // Amount in USD
    airdropAmount: number; // Per participant amount in USD
    currentParticipants: number;
    maxParticipants: number;
    status: 'draft' | 'funded' | 'completed' | 'cancelled';
    bannerImage?: string;
    organizerName: string;
    sponsorName?: string;
    currentFunding?: number;
    onchainEventId: string; // Required for smart contract
    organizerId: string;
    organizerWalletAddress: string; // Required for smart contract
    createdAt?: string;
    updatedAt?: string;
}

interface EventsResponse {
    success: boolean;
    data: Event[];
    message?: string;
}

class EventsService {
    private baseURL: string;

    constructor() {
        // Use environment variable or default to localhost
        this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    }

    /**
     * Get events that need sponsorship (draft status)
     */
    async getEventsNeedingSponsorship(): Promise<Event[]> {
        try {
            const response = await fetch(`${this.baseURL}/events?status=draft&isActive=true`);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return data.data || data; // Handle different response formats
        } catch (error) {
            console.error('Failed to fetch events needing sponsorship:', error);
            throw error;
        }
    }

    /**
     * Get events sponsored by a specific user (active)
     */
    async getSponsoredEvents(userId: string): Promise<Event[]> {
        try {
            const response = await fetch(`${this.baseURL}/events/sponsored-by/${userId}?isActive=true`);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return data.data || data; // Handle different response formats
        } catch (error) {
            console.error('Failed to fetch sponsored events:', error);
            throw error;
        }
    }

    /**
     * Get past events sponsored by a specific user (completed)
     */
    async getPastSponsoredEvents(userId: string): Promise<Event[]> {
        try {
            const response = await fetch(`${this.baseURL}/events/sponsored-by/${userId}?isActive=false`);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return data.data || data; // Handle different response formats
        } catch (error) {
            console.error('Failed to fetch past sponsored events:', error);
            throw error;
        }
    }

    /**
     * Get all events for a user (both active and past)
     */
    async getAllSponsoredEvents(userId: string): Promise<{ active: Event[]; past: Event[] }> {
        try {
            const [activeEvents, pastEvents] = await Promise.all([
                this.getSponsoredEvents(userId),
                this.getPastSponsoredEvents(userId)
            ]);

            return {
                active: activeEvents,
                past: pastEvents
            };
        } catch (error) {
            console.error('Failed to fetch all sponsored events:', error);
            throw error;
        }
    }

    /**
     * Sponsor an event
     */
    async sponsorEvent(eventId: string, amount: number, idToken: string): Promise<{ success: boolean; message: string }> {
        try {
            const response = await fetch(`${this.baseURL}/events/${eventId}/sponsor`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
            }

            return response.json();
        } catch (error) {
            console.error('Failed to sponsor event:', error);
            throw error;
        }
    }
}

// Export singleton instance
export const eventsService = new EventsService();
export type { Event, EventsResponse };
