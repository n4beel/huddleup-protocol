import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { Neo4jService } from '../database/neo4j.service';
import { Event, CreateEventDto, UpdateEventDto, FundEventDto } from './entities/event.entity';
import { QrService } from '../qr/qr.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class EventsService {
    constructor(
        private readonly neo4jService: Neo4jService,
        private readonly qrService: QrService
    ) { }

    /**
     * Create a new event
     */
    async createEvent(createEventDto: CreateEventDto & { organizerId: string }): Promise<Event> {
        const eventId = uuidv4();
        const now = new Date();

        // Calculate max participants
        const maxParticipants = Math.floor(createEventDto.fundingRequired / createEventDto.airdropAmount);

        if (maxParticipants < 1) {
            throw new BadRequestException('Funding required must be greater than airdrop amount');
        }

        const query = `
            CREATE (e:Event {
                id: $id,
                title: $title,
                description: $description,
                eventDate: datetime($eventDate),
                location: $location,
                eventType: $eventType,
                status: 'draft',
                organizerId: $organizerId,
                fundingRequired: $fundingRequired,
                airdropAmount: $airdropAmount,
                maxParticipants: $maxParticipants,
                currentParticipants: 0,
                currentFunding: 0,
                createdAt: datetime($createdAt),
                updatedAt: datetime($updatedAt)
            })
            RETURN e
        `;

        const parameters = {
            id: eventId,
            title: createEventDto.title,
            description: createEventDto.description,
            eventDate: createEventDto.eventDate,
            location: createEventDto.location,
            eventType: createEventDto.eventType,
            organizerId: createEventDto.organizerId,
            fundingRequired: createEventDto.fundingRequired,
            airdropAmount: createEventDto.airdropAmount,
            maxParticipants,
            bannerImage: createEventDto.bannerImage || null,
            createdAt: now.toISOString(),
            updatedAt: now.toISOString(),
        };

        const result = await this.neo4jService.runWriteRelationQuery(
            `MATCH (u:User {id: $organizerId})
             CREATE (u)-[:ORGANIZER_OF {createdAt: datetime($createdAt)}]->(e:Event {
                id: $id,
                title: $title,
                description: $description,
                eventDate: datetime($eventDate),
                location: $location,
                eventType: $eventType,
                status: 'draft',
                organizerId: $organizerId,
                fundingRequired: $fundingRequired,
                airdropAmount: $airdropAmount,
                maxParticipants: $maxParticipants,
                currentParticipants: 0,
                currentFunding: 0,
                bannerImage: $bannerImage,
                createdAt: datetime($createdAt),
                updatedAt: datetime($updatedAt)
             })
             RETURN e`,
            parameters
        );

        if (result.length === 0) {
            throw new Error('Failed to create event');
        }

        return this.mapNeo4jNodeToEvent(result[0].e);
    }

    /**
     * Get all events with optional filtering
     */
    async findAll(status?: string, isActive?: boolean, userId?: string): Promise<Event[]> {
        let query = `
            MATCH (e:Event)
        `;

        const parameters: any = {};
        const conditions: string[] = [];

        if (status) {
            conditions.push(`e.status = $status`);
            parameters.status = status;
        }

        if (isActive !== undefined) {
            if (isActive) {
                // Active events: eventDate >= today (including today)
                conditions.push(`e.eventDate >= datetime($now)`);
            } else {
                // Inactive events: eventDate < today
                conditions.push(`e.eventDate < datetime($now)`);
            }
            parameters.now = new Date().toISOString();
        }

        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')}`;
        }

        query += ` RETURN e ORDER BY e.createdAt DESC`;

        const result = await this.neo4jService.runQuery(query, parameters);
        return result.map(record => this.mapNeo4jNodeToEvent(record.e));
    }

    /**
     * Get events organized by a user
     */
    async findOrganizedByUser(userId: string, status?: string, isActive?: boolean): Promise<Event[]> {
        let query = `
            MATCH (u:User {id: $userId})-[:ORGANIZER_OF]->(e:Event)
        `;

        const parameters: any = { userId };
        const conditions: string[] = [];

        if (status) {
            conditions.push(`e.status = $status`);
            parameters.status = status;
        }

        if (isActive !== undefined) {
            if (isActive) {
                // Active events: eventDate >= today (including today)
                conditions.push(`e.eventDate >= datetime($now)`);
            } else {
                // Inactive events: eventDate < today
                conditions.push(`e.eventDate < datetime($now)`);
            }
            parameters.now = new Date().toISOString();
        }

        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')}`;
        }

        query += ` RETURN e ORDER BY e.createdAt DESC`;

        const result = await this.neo4jService.runQuery(query, parameters);
        return result.map(record => this.mapNeo4jNodeToEvent(record.e));
    }

    /**
     * Get events sponsored by a user
     */
    async findSponsoredByUser(userId: string, status?: string, isActive?: boolean): Promise<Event[]> {
        let query = `
            MATCH (u:User {id: $userId})-[:SPONSOR_OF]->(e:Event)
        `;

        const parameters: any = { userId };
        const conditions: string[] = [];

        if (status) {
            conditions.push(`e.status = $status`);
            parameters.status = status;
        }

        if (isActive !== undefined) {
            if (isActive) {
                // Active events: eventDate >= today (including today)
                conditions.push(`e.eventDate >= datetime($now)`);
            } else {
                // Inactive events: eventDate < today
                conditions.push(`e.eventDate < datetime($now)`);
            }
            parameters.now = new Date().toISOString();
        }

        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')}`;
        }

        query += ` RETURN e ORDER BY e.createdAt DESC`;

        const result = await this.neo4jService.runQuery(query, parameters);
        return result.map(record => this.mapNeo4jNodeToEvent(record.e));
    }

    /**
     * Get events a user is participating in
     */
    async findParticipatingByUser(userId: string, status?: string, isActive?: boolean): Promise<Event[]> {
        let query = `
            MATCH (u:User {id: $userId})-[r:PARTICIPANT_OF {isActive: true}]->(e:Event)
        `;

        const parameters: any = { userId };
        const conditions: string[] = [];

        if (status) {
            conditions.push(`e.status = $status`);
            parameters.status = status;
        }

        if (isActive !== undefined) {
            if (isActive) {
                // Active events: eventDate >= today (including today)
                conditions.push(`e.eventDate >= datetime($now)`);
            } else {
                // Inactive events: eventDate < today
                conditions.push(`e.eventDate < datetime($now)`);
            }
            parameters.now = new Date().toISOString();
        }

        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')}`;
        }

        query += ` RETURN e, r.qrCodeUrl as qrCodeUrl ORDER BY e.createdAt DESC`;

        const result = await this.neo4jService.runQuery(query, parameters);
        return result.map(record => {
            const event = this.mapNeo4jNodeToEvent(record.e);
            // Add QR code URL to the event object
            (event as any).qrCodeUrl = record.qrCodeUrl;
            return event;
        });
    }

    /**
     * Get event by ID
     */
    async findById(id: string): Promise<Event | null> {
        const query = `
            MATCH (e:Event {id: $id})
            RETURN e
        `;

        const result = await this.neo4jService.runQuery(query, { id });

        if (result.length === 0) {
            return null;
        }

        return this.mapNeo4jNodeToEvent(result[0].e);
    }

    /**
     * Update event (only if draft status)
     */
    async updateEvent(id: string, updateEventDto: UpdateEventDto, userId: string): Promise<Event> {
        // First check if event exists and user is organizer
        const event = await this.findById(id);
        if (!event) {
            throw new NotFoundException('Event not found');
        }

        if (event.organizerId !== userId) {
            throw new ForbiddenException('Only the organizer can update this event');
        }

        if (event.status !== 'draft') {
            throw new BadRequestException('Only draft events can be updated');
        }

        const setClauses: string[] = [];
        const parameters: any = { id };

        if (updateEventDto.title !== undefined) {
            setClauses.push('e.title = $title');
            parameters.title = updateEventDto.title;
        }
        if (updateEventDto.description !== undefined) {
            setClauses.push('e.description = $description');
            parameters.description = updateEventDto.description;
        }
        if (updateEventDto.eventDate !== undefined) {
            setClauses.push('e.eventDate = datetime($eventDate)');
            parameters.eventDate = updateEventDto.eventDate;
        }
        if (updateEventDto.location !== undefined) {
            setClauses.push('e.location = $location');
            parameters.location = updateEventDto.location;
        }
        if (updateEventDto.eventType !== undefined) {
            setClauses.push('e.eventType = $eventType');
            parameters.eventType = updateEventDto.eventType;
        }
        if (updateEventDto.fundingRequired !== undefined) {
            setClauses.push('e.fundingRequired = $fundingRequired');
            parameters.fundingRequired = updateEventDto.fundingRequired;
        }
        if (updateEventDto.airdropAmount !== undefined) {
            setClauses.push('e.airdropAmount = $airdropAmount');
            parameters.airdropAmount = updateEventDto.airdropAmount;
        }
        if (updateEventDto.status !== undefined) {
            setClauses.push('e.status = $status');
            parameters.status = updateEventDto.status;
        }
        if (updateEventDto.bannerImage !== undefined) {
            setClauses.push('e.bannerImage = $bannerImage');
            parameters.bannerImage = updateEventDto.bannerImage;
        }

        // Recalculate max participants if funding or airdrop changed
        if (updateEventDto.fundingRequired !== undefined || updateEventDto.airdropAmount !== undefined) {
            const fundingRequired = updateEventDto.fundingRequired ?? event.fundingRequired;
            const airdropAmount = updateEventDto.airdropAmount ?? event.airdropAmount;
            const maxParticipants = Math.floor(fundingRequired / airdropAmount);

            if (maxParticipants < 1) {
                throw new BadRequestException('Funding required must be greater than airdrop amount');
            }

            setClauses.push('e.maxParticipants = $maxParticipants');
            parameters.maxParticipants = maxParticipants;
        }

        setClauses.push('e.updatedAt = datetime($updatedAt)');
        parameters.updatedAt = new Date().toISOString();

        if (setClauses.length === 0) {
            throw new BadRequestException('No fields to update');
        }

        const query = `
            MATCH (e:Event {id: $id})
            SET ${setClauses.join(', ')}
            RETURN e
        `;

        const result = await this.neo4jService.runWriteQuery(query, parameters);

        if (result.length === 0) {
            throw new Error('Failed to update event');
        }

        return this.mapNeo4jNodeToEvent(result[0].e);
    }

    /**
     * Delete event (only if draft status)
     */
    async deleteEvent(id: string, userId: string): Promise<void> {
        const event = await this.findById(id);
        if (!event) {
            throw new NotFoundException('Event not found');
        }

        if (event.organizerId !== userId) {
            throw new ForbiddenException('Only the organizer can delete this event');
        }

        if (event.status !== 'draft') {
            throw new BadRequestException('Only draft events can be deleted');
        }

        const query = `
            MATCH (e:Event {id: $id})
            DETACH DELETE e
        `;

        await this.neo4jService.runWriteQuery(query, { id });
    }

    /**
     * Participate in an event
     */
    async participateInEvent(eventId: string, userId: string): Promise<void> {
        const event = await this.findById(eventId);
        if (!event) {
            throw new NotFoundException('Event not found');
        }

        if (event.status !== 'funded') {
            throw new BadRequestException('Event must be funded to participate');
        }

        if (event.currentParticipants >= event.maxParticipants) {
            throw new BadRequestException('Event is full');
        }

        // Check if user is already actively participating
        const activeParticipation = await this.neo4jService.runQuery(
            `MATCH (u:User {id: $userId})-[r:PARTICIPANT_OF {isActive: true}]->(e:Event {id: $eventId})
             RETURN r`,
            { userId, eventId }
        );

        if (activeParticipation.length > 0) {
            throw new BadRequestException('User is already participating in this event');
        }

        // Check if user has a previous (inactive) participation relationship
        const previousParticipation = await this.neo4jService.runQuery(
            `MATCH (u:User {id: $userId})-[r:PARTICIPANT_OF {isActive: false}]->(e:Event {id: $eventId})
             RETURN r
             ORDER BY r.joinedAt DESC
             LIMIT 1`,
            { userId, eventId }
        );

        // Generate QR code for participation verification
        console.log(`Generating QR code for user ${userId} participating in event ${eventId}`);
        const qrCodeUrl = await this.qrService.generateParticipationQR(userId, eventId);

        if (previousParticipation.length > 0) {
            // Reactivate existing relationship and update QR code
            console.log(`Reactivating previous participation for user ${userId} in event ${eventId}`);
            await this.neo4jService.runWriteRelationQuery(
                `MATCH (u:User {id: $userId})-[r:PARTICIPANT_OF {isActive: false}]->(e:Event {id: $eventId})
                 SET r.isActive = true, 
                     r.rejoinedAt = datetime($rejoinedAt),
                     r.qrCodeUrl = $qrCodeUrl,
                     r.leftAt = null
                 SET e.currentParticipants = e.currentParticipants + 1
                 SET e.updatedAt = datetime($updatedAt)
                 RETURN e`,
                {
                    userId,
                    eventId,
                    rejoinedAt: new Date().toISOString(),
                    qrCodeUrl,
                    updatedAt: new Date().toISOString(),
                }
            );
        } else {
            // Create new participation relationship
            console.log(`Creating new participation for user ${userId} in event ${eventId}`);
            await this.neo4jService.runWriteRelationQuery(
                `MATCH (u:User {id: $userId}), (e:Event {id: $eventId})
                 CREATE (u)-[:PARTICIPANT_OF {
                    joinedAt: datetime($joinedAt), 
                    isActive: true,
                    qrCodeUrl: $qrCodeUrl
                 }]->(e)
                 SET e.currentParticipants = e.currentParticipants + 1
                 SET e.updatedAt = datetime($updatedAt)
                 RETURN e`,
                {
                    userId,
                    eventId,
                    joinedAt: new Date().toISOString(),
                    qrCodeUrl,
                    updatedAt: new Date().toISOString(),
                }
            );
        }

        console.log(`User ${userId} successfully joined event ${eventId} with QR code: ${qrCodeUrl}`);
    }

    /**
     * Leave an event
     */
    async leaveEvent(eventId: string, userId: string): Promise<void> {
        const event = await this.findById(eventId);
        if (!event) {
            throw new NotFoundException('Event not found');
        }

        // Check if user is participating and get QR code URL
        const participation = await this.neo4jService.runQuery(
            `MATCH (u:User {id: $userId})-[r:PARTICIPANT_OF {isActive: true}]->(e:Event {id: $eventId})
             RETURN r.qrCodeUrl as qrCodeUrl`,
            { userId, eventId }
        );

        if (participation.length === 0) {
            throw new BadRequestException('User is not participating in this event');
        }

        // Delete QR code from Cloudinary if it exists
        const qrCodeUrl = participation[0]?.qrCodeUrl;
        if (qrCodeUrl) {
            try {
                console.log(`Deleting QR code for user ${userId} leaving event ${eventId}: ${qrCodeUrl}`);
                await this.qrService.deleteQRCode(qrCodeUrl);
            } catch (error) {
                console.error(`Failed to delete QR code: ${qrCodeUrl}`, error);
                // Don't throw error, just log it - user can still leave the event
            }
        }

        // Deactivate participation and update event
        await this.neo4jService.runWriteRelationQuery(
            `MATCH (u:User {id: $userId})-[r:PARTICIPANT_OF {isActive: true}]->(e:Event {id: $eventId})
             SET r.isActive = false, r.leftAt = datetime($leftAt), r.qrCodeUrl = null
             SET e.currentParticipants = e.currentParticipants - 1
             SET e.updatedAt = datetime($updatedAt)`,
            {
                userId,
                eventId,
                leftAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }
        );
    }

    /**
     * Fund an event
     */
    async fundEvent(eventId: string, fundEventDto: FundEventDto): Promise<Event> {
        const event = await this.findById(eventId);
        if (!event) {
            throw new NotFoundException('Event not found');
        }

        if (event.status !== 'draft') {
            throw new BadRequestException('Only draft events can be funded');
        }

        if (event.sponsorId) {
            throw new BadRequestException('Event is already funded');
        }

        if (fundEventDto.amount !== event.fundingRequired) {
            throw new BadRequestException('Funding amount must match the required amount');
        }

        // Create sponsorship relationship and update event
        const result = await this.neo4jService.runWriteRelationQuery(
            `MATCH (u:User {id: $sponsorId}), (e:Event {id: $eventId})
             CREATE (u)-[:SPONSOR_OF {amount: $amount, fundedAt: datetime($fundedAt)}]->(e)
             SET e.sponsorId = $sponsorId
             SET e.sponsorAmount = $amount
             SET e.sponsorFundedAt = datetime($fundedAt)
             SET e.currentFunding = $amount
             SET e.status = 'funded'
             SET e.fundedAt = datetime($fundedAt)
             SET e.updatedAt = datetime($updatedAt)
             RETURN e`,
            {
                sponsorId: fundEventDto.sponsorId,
                eventId,
                amount: fundEventDto.amount,
                fundedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }
        );

        if (result.length === 0) {
            throw new Error('Failed to fund event');
        }

        return this.mapNeo4jNodeToEvent(result[0].e);
    }

    /**
     * Get event participants
     */
    async getEventParticipants(eventId: string): Promise<any[]> {
        const query = `
            MATCH (u:User)-[r:PARTICIPANT_OF {isActive: true}]->(e:Event {id: $eventId})
            RETURN u.id as userId, u.walletAddress as walletAddress, u.connectionMethod as connectionMethod, u.firstName as firstName, u.lastName as lastName, u.email as email, u.profileImage as profileImage, u.createdAt as createdAt, u.lastLoginAt as lastLoginAt, u.isActive as isActive, r.joinedAt as joinedAt, r.qrCodeUrl as qrCodeUrl
            ORDER BY r.joinedAt DESC
        `;

        const result = await this.neo4jService.runQuery(query, { eventId });

        // Convert datetime objects to proper Date objects and include full user details
        return result.map(record => ({
            userId: record.userId,
            walletAddress: record.walletAddress,
            connectionMethod: record.connectionMethod,
            firstName: record.firstName,
            lastName: record.lastName,
            email: record.email,
            profileImage: record.profileImage,
            createdAt: this.convertNeo4jDateTime(record.createdAt),
            lastLoginAt: this.convertNeo4jDateTime(record.lastLoginAt),
            isActive: record.isActive,
            joinedAt: this.convertNeo4jDateTime(record.joinedAt),
            qrCodeUrl: record.qrCodeUrl
        }));
    }

    /**
     * Get event sponsor
     */
    async getEventSponsor(eventId: string): Promise<any | null> {
        const query = `
            MATCH (u:User)-[r:SPONSOR_OF]->(e:Event {id: $eventId})
            RETURN u.id as sponsorId, u.walletAddress as walletAddress, u.connectionMethod as connectionMethod, u.firstName as firstName, u.lastName as lastName, u.email as email, u.profileImage as profileImage, u.createdAt as createdAt, u.lastLoginAt as lastLoginAt, u.isActive as isActive, r.amount as amount, r.fundedAt as fundedAt
        `;

        const result = await this.neo4jService.runQuery(query, { eventId });

        if (result.length === 0) return null;

        const record = result[0];
        return {
            sponsorId: record.sponsorId,
            walletAddress: record.walletAddress,
            connectionMethod: record.connectionMethod,
            firstName: record.firstName,
            lastName: record.lastName,
            email: record.email,
            profileImage: record.profileImage,
            createdAt: this.convertNeo4jDateTime(record.createdAt),
            lastLoginAt: this.convertNeo4jDateTime(record.lastLoginAt),
            isActive: record.isActive,
            amount: this.convertNeo4jInteger(record.amount),
            fundedAt: this.convertNeo4jDateTime(record.fundedAt)
        };
    }

    /**
     * Map Neo4j node to Event entity
     */
    /**
     * Convert Neo4j integer to JavaScript number
     */
    private convertNeo4jInteger(value: any): number {
        if (value === null || value === undefined) return 0;
        if (typeof value === 'number') return value;
        if (typeof value === 'object' && value.low !== undefined) {
            return value.low;
        }
        return parseInt(value) || 0;
    }

    /**
     * Convert Neo4j datetime to JavaScript Date
     */
    private convertNeo4jDateTime(value: any): Date | undefined {
        if (!value) return undefined;
        if (value instanceof Date) return value;
        if (typeof value === 'string') return new Date(value);
        if (typeof value === 'object' && value.year) {
            // Neo4j datetime object
            const year = this.convertNeo4jInteger(value.year);
            const month = this.convertNeo4jInteger(value.month) - 1; // JavaScript months are 0-based
            const day = this.convertNeo4jInteger(value.day);
            const hour = this.convertNeo4jInteger(value.hour);
            const minute = this.convertNeo4jInteger(value.minute);
            const second = this.convertNeo4jInteger(value.second);
            return new Date(year, month, day, hour, minute, second);
        }
        return new Date(value);
    }

    private mapNeo4jNodeToEvent(node: any): Event {
        return {
            id: node.properties.id,
            title: node.properties.title,
            description: node.properties.description,
            eventDate: this.convertNeo4jDateTime(node.properties.eventDate) || new Date(),
            location: node.properties.location,
            eventType: node.properties.eventType,
            status: node.properties.status,
            bannerImage: node.properties.bannerImage,
            organizerId: node.properties.organizerId,
            fundingRequired: this.convertNeo4jInteger(node.properties.fundingRequired),
            airdropAmount: this.convertNeo4jInteger(node.properties.airdropAmount),
            maxParticipants: this.convertNeo4jInteger(node.properties.maxParticipants),
            currentParticipants: this.convertNeo4jInteger(node.properties.currentParticipants),
            currentFunding: this.convertNeo4jInteger(node.properties.currentFunding),
            createdAt: this.convertNeo4jDateTime(node.properties.createdAt) || new Date(),
            updatedAt: this.convertNeo4jDateTime(node.properties.updatedAt) || new Date(),
            fundedAt: this.convertNeo4jDateTime(node.properties.fundedAt),
            completedAt: this.convertNeo4jDateTime(node.properties.completedAt),
            sponsorId: node.properties.sponsorId,
            sponsorAmount: this.convertNeo4jInteger(node.properties.sponsorAmount),
            sponsorFundedAt: this.convertNeo4jDateTime(node.properties.sponsorFundedAt),
        };
    }

    /**
     * Clean up duplicate participation relationships
     * Keeps the most recent active relationship and removes duplicates
     */
    async cleanupDuplicateParticipations(): Promise<void> {
        try {
            console.log('Starting cleanup of duplicate participation relationships...');

            // Find users with multiple active participation relationships to the same event
            const duplicateQuery = `
                MATCH (u:User)-[r:PARTICIPANT_OF {isActive: true}]->(e:Event)
                WITH u, e, collect(r) as relationships
                WHERE size(relationships) > 1
                WITH u, e, relationships, max(relationships.joinedAt) as latestJoinedAt
                UNWIND relationships as rel
                WITH u, e, rel, latestJoinedAt
                WHERE rel.joinedAt < latestJoinedAt
                RETURN u.id as userId, e.id as eventId, rel.qrCodeUrl as qrCodeUrl
            `;

            const duplicates = await this.neo4jService.runQuery(duplicateQuery, {});

            console.log(`Found ${duplicates.length} duplicate participation relationships to clean up`);

            // Delete duplicate relationships and their QR codes
            for (const duplicate of duplicates) {
                try {
                    // Delete QR code from Cloudinary if it exists
                    if (duplicate.qrCodeUrl) {
                        await this.qrService.deleteQRCode(duplicate.qrCodeUrl);
                    }

                    // Delete the duplicate relationship
                    await this.neo4jService.runWriteQuery(
                        `MATCH (u:User {id: $userId})-[r:PARTICIPANT_OF {isActive: true}]->(e:Event {id: $eventId})
                         WHERE r.joinedAt < (SELECT max(r2.joinedAt) 
                                           FROM (u)-[r2:PARTICIPANT_OF {isActive: true}]->(e))
                         DELETE r`,
                        { userId: duplicate.userId, eventId: duplicate.eventId }
                    );

                    console.log(`Cleaned up duplicate participation for user ${duplicate.userId} in event ${duplicate.eventId}`);
                } catch (error) {
                    console.error(`Error cleaning up duplicate for user ${duplicate.userId} in event ${duplicate.eventId}:`, error);
                }
            }

            console.log('Duplicate participation cleanup completed');
        } catch (error) {
            console.error('Error during duplicate participation cleanup:', error);
        }
    }
}
