import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { Neo4jService } from '../database/neo4j.service';
import { Event, CreateEventDto, UpdateEventDto, FundEventDto } from './entities/event.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class EventsService {
    constructor(private readonly neo4jService: Neo4jService) { }

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
    async findAll(status?: string, userId?: string): Promise<Event[]> {
        let query = `
            MATCH (e:Event)
        `;

        const parameters: any = {};

        if (status) {
            query += ` WHERE e.status = $status`;
            parameters.status = status;
        }

        query += ` RETURN e ORDER BY e.createdAt DESC`;

        const result = await this.neo4jService.runQuery(query, parameters);
        return result.map(record => this.mapNeo4jNodeToEvent(record.e));
    }

    /**
     * Get events organized by a user
     */
    async findOrganizedByUser(userId: string): Promise<Event[]> {
        const query = `
            MATCH (u:User {id: $userId})-[:ORGANIZER_OF]->(e:Event)
            RETURN e
            ORDER BY e.createdAt DESC
        `;

        const result = await this.neo4jService.runQuery(query, { userId });
        return result.map(record => this.mapNeo4jNodeToEvent(record.e));
    }

    /**
     * Get events sponsored by a user
     */
    async findSponsoredByUser(userId: string): Promise<Event[]> {
        const query = `
            MATCH (u:User {id: $userId})-[:SPONSOR_OF]->(e:Event)
            RETURN e
            ORDER BY e.createdAt DESC
        `;

        const result = await this.neo4jService.runQuery(query, { userId });
        return result.map(record => this.mapNeo4jNodeToEvent(record.e));
    }

    /**
     * Get events a user is participating in
     */
    async findParticipatingByUser(userId: string): Promise<Event[]> {
        const query = `
            MATCH (u:User {id: $userId})-[:PARTICIPANT_OF {isActive: true}]->(e:Event)
            RETURN e
            ORDER BY e.createdAt DESC
        `;

        const result = await this.neo4jService.runQuery(query, { userId });
        return result.map(record => this.mapNeo4jNodeToEvent(record.e));
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

        // Check if user is already participating
        const existingParticipation = await this.neo4jService.runQuery(
            `MATCH (u:User {id: $userId})-[r:PARTICIPANT_OF {isActive: true}]->(e:Event {id: $eventId})
             RETURN r`,
            { userId, eventId }
        );

        if (existingParticipation.length > 0) {
            throw new BadRequestException('User is already participating in this event');
        }

        // Create participation relationship and update event
        await this.neo4jService.runWriteRelationQuery(
            `MATCH (u:User {id: $userId}), (e:Event {id: $eventId})
             CREATE (u)-[:PARTICIPANT_OF {joinedAt: datetime($joinedAt), isActive: true}]->(e)
             SET e.currentParticipants = e.currentParticipants + 1
             SET e.updatedAt = datetime($updatedAt)
             RETURN e`,
            {
                userId,
                eventId,
                joinedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }
        );
    }

    /**
     * Leave an event
     */
    async leaveEvent(eventId: string, userId: string): Promise<void> {
        const event = await this.findById(eventId);
        if (!event) {
            throw new NotFoundException('Event not found');
        }

        // Check if user is participating
        const participation = await this.neo4jService.runQuery(
            `MATCH (u:User {id: $userId})-[r:PARTICIPANT_OF {isActive: true}]->(e:Event {id: $eventId})
             RETURN r`,
            { userId, eventId }
        );

        if (participation.length === 0) {
            throw new BadRequestException('User is not participating in this event');
        }

        // Deactivate participation and update event
        await this.neo4jService.runWriteRelationQuery(
            `MATCH (u:User {id: $userId})-[r:PARTICIPANT_OF {isActive: true}]->(e:Event {id: $eventId})
             SET r.isActive = false, r.leftAt = datetime($leftAt)
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
            RETURN u.id as userId, u.firstName, u.lastName, u.email, r.joinedAt as joinedAt
            ORDER BY r.joinedAt DESC
        `;

        return await this.neo4jService.runQuery(query, { eventId });
    }

    /**
     * Get event sponsor
     */
    async getEventSponsor(eventId: string): Promise<any | null> {
        const query = `
            MATCH (u:User)-[r:SPONSOR_OF]->(e:Event {id: $eventId})
            RETURN u.id as sponsorId, u.firstName, u.lastName, u.email, r.amount, r.fundedAt
        `;

        const result = await this.neo4jService.runQuery(query, { eventId });
        return result.length > 0 ? result[0] : null;
    }

    /**
     * Map Neo4j node to Event entity
     */
    private mapNeo4jNodeToEvent(node: any): Event {
        return {
            id: node.properties.id,
            title: node.properties.title,
            description: node.properties.description,
            eventDate: new Date(node.properties.eventDate),
            location: node.properties.location,
            eventType: node.properties.eventType,
            status: node.properties.status,
            organizerId: node.properties.organizerId,
            fundingRequired: node.properties.fundingRequired,
            airdropAmount: node.properties.airdropAmount,
            maxParticipants: node.properties.maxParticipants,
            currentParticipants: node.properties.currentParticipants || 0,
            currentFunding: node.properties.currentFunding || 0,
            createdAt: new Date(node.properties.createdAt),
            updatedAt: new Date(node.properties.updatedAt),
            fundedAt: node.properties.fundedAt ? new Date(node.properties.fundedAt) : undefined,
            completedAt: node.properties.completedAt ? new Date(node.properties.completedAt) : undefined,
            sponsorId: node.properties.sponsorId,
            sponsorAmount: node.properties.sponsorAmount,
            sponsorFundedAt: node.properties.sponsorFundedAt ? new Date(node.properties.sponsorFundedAt) : undefined,
        };
    }
}
