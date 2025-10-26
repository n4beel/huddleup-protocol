import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    HttpCode,
    HttpStatus,
    Req
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiQuery,
    ApiParam
} from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { FundEventDto } from './dto/fund-event.dto';
import { Event } from './entities/event.entity';
import { AuthenticatedUser } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('events')
@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new event (organizer ID extracted from JWT)' })
    @ApiBearerAuth()
    @ApiResponse({ status: 201, description: 'Event created successfully', type: Event })
    @ApiResponse({ status: 400, description: 'Bad request - invalid data' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async createEvent(
        @Body() createEventDto: CreateEventDto,
        @Req() req: any
    ): Promise<Event> {
        const user: AuthenticatedUser = req.user;
        // Override organizerId from JWT instead of request body
        const eventData = { ...createEventDto, organizerId: user.id };
        return this.eventsService.createEvent(eventData);
    }

    @Get()
    @ApiOperation({ summary: 'Get all events with optional filtering' })
    @ApiQuery({ name: 'status', required: false, description: 'Filter by event status (draft, funded, completed, cancelled)' })
    @ApiQuery({ name: 'isActive', required: false, description: 'Filter by event date: true for future events (including today), false for past events' })
    @ApiResponse({ status: 200, description: 'Events retrieved successfully', type: [Event] })
    async findAll(
        @Query('status') status?: string,
        @Query('isActive') isActive?: string
    ): Promise<Event[]> {
        const isActiveBoolean = isActive === undefined ? undefined : isActive === 'true';
        return this.eventsService.findAll(status, isActiveBoolean);
    }

    @Get('organized-by/:userId')
    @ApiOperation({ summary: 'Get events organized by a specific user' })
    @ApiParam({ name: 'userId', description: 'User ID' })
    @ApiQuery({ name: 'status', required: false, description: 'Filter by event status (draft, funded, completed, cancelled)' })
    @ApiQuery({ name: 'isActive', required: false, description: 'Filter by event date: true for future events (including today), false for past events' })
    @ApiResponse({ status: 200, description: 'Events retrieved successfully', type: [Event] })
    async findOrganizedByUser(
        @Param('userId') userId: string,
        @Query('status') status?: string,
        @Query('isActive') isActive?: string
    ): Promise<Event[]> {
        const isActiveBoolean = isActive === undefined ? undefined : isActive === 'true';
        return this.eventsService.findOrganizedByUser(userId, status, isActiveBoolean);
    }

    @Get('sponsored-by/:userId')
    @ApiOperation({ summary: 'Get events sponsored by a specific user' })
    @ApiParam({ name: 'userId', description: 'User ID' })
    @ApiQuery({ name: 'status', required: false, description: 'Filter by event status (draft, funded, completed, cancelled)' })
    @ApiQuery({ name: 'isActive', required: false, description: 'Filter by event date: true for future events (including today), false for past events' })
    @ApiResponse({ status: 200, description: 'Events retrieved successfully', type: [Event] })
    async findSponsoredByUser(
        @Param('userId') userId: string,
        @Query('status') status?: string,
        @Query('isActive') isActive?: string
    ): Promise<Event[]> {
        const isActiveBoolean = isActive === undefined ? undefined : isActive === 'true';
        return this.eventsService.findSponsoredByUser(userId, status, isActiveBoolean);
    }

    @Get('participating/:userId')
    @ApiOperation({ summary: 'Get events a user is participating in' })
    @ApiParam({ name: 'userId', description: 'User ID' })
    @ApiQuery({ name: 'status', required: false, description: 'Filter by event status (draft, funded, completed, cancelled)' })
    @ApiQuery({ name: 'isActive', required: false, description: 'Filter by event date: true for future events (including today), false for past events' })
    @ApiResponse({ status: 200, description: 'Events retrieved successfully', type: [Event] })
    async findParticipatingByUser(
        @Param('userId') userId: string,
        @Query('status') status?: string,
        @Query('isActive') isActive?: string
    ): Promise<Event[]> {
        const isActiveBoolean = isActive === undefined ? undefined : isActive === 'true';
        return this.eventsService.findParticipatingByUser(userId, status, isActiveBoolean);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get event by ID' })
    @ApiParam({ name: 'id', description: 'Event ID' })
    @ApiQuery({ name: 'userId', required: false, description: 'Optional user ID for contextual queries (e.g. participation etc)' })
    @ApiResponse({ status: 200, description: 'Event retrieved successfully', type: Event })
    @ApiResponse({ status: 404, description: 'Event not found' })
    async findById(
        @Param('id') id: string,
        @Query('userId') userId?: string
    ): Promise<Event & { relationship?: any }> {
        // Optionally, you may consider passing userId to the service for future context-aware feature
        const event = await this.eventsService.findById(id);

        if (!event) {
            throw new Error('Event not found');
        }

        if (userId) {
            const relationship = await this.eventsService.findRelationshipByEventIdAndUserId(id, userId);
            return { ...event, relationship };
        }
        return event;
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update event (only if draft status)' })
    @ApiParam({ name: 'id', description: 'Event ID' })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Event updated successfully', type: Event })
    @ApiResponse({ status: 400, description: 'Bad request - invalid data or status' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - not the organizer' })
    @ApiResponse({ status: 404, description: 'Event not found' })
    async updateEvent(
        @Param('id') id: string,
        @Body() updateEventDto: UpdateEventDto,
        @Req() req: any
    ): Promise<Event> {
        const user: AuthenticatedUser = req.user;
        return this.eventsService.updateEvent(id, updateEventDto, user.id);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete event (only if draft status)' })
    @ApiParam({ name: 'id', description: 'Event ID' })
    @ApiBearerAuth()
    @ApiResponse({ status: 204, description: 'Event deleted successfully' })
    @ApiResponse({ status: 400, description: 'Bad request - cannot delete funded/completed event' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - not the organizer' })
    @ApiResponse({ status: 404, description: 'Event not found' })
    async deleteEvent(@Param('id') id: string, @Req() req: any): Promise<void> {
        const user: AuthenticatedUser = req.user;
        return this.eventsService.deleteEvent(id, user.id);
    }

    // @Post(':id/participate')
    // @HttpCode(HttpStatus.OK)
    // @ApiOperation({ summary: 'Participate in an event' })
    // @ApiParam({ name: 'id', description: 'Event ID' })
    // @ApiBearerAuth()
    // @ApiResponse({ status: 200, description: 'Successfully joined the event' })
    // @ApiResponse({ status: 400, description: 'Bad request - event not funded or full' })
    // @ApiResponse({ status: 401, description: 'Unauthorized' })
    // @ApiResponse({ status: 404, description: 'Event not found' })
    // async participateInEvent(@Param('id') eventId: string, @Req() req: any): Promise<{ message: string }> {
    //     const user: AuthenticatedUser = req.user;
    //     await this.eventsService.participateInEvent(eventId, user.id);
    //     return { message: 'Successfully joined the event' };
    // }

    // @Delete(':id/participate')
    // @HttpCode(HttpStatus.OK)
    // @ApiOperation({ summary: 'Leave an event' })
    // @ApiParam({ name: 'id', description: 'Event ID' })
    // @ApiBearerAuth()
    // @ApiResponse({ status: 200, description: 'Successfully left the event' })
    // @ApiResponse({ status: 400, description: 'Bad request - not participating' })
    // @ApiResponse({ status: 401, description: 'Unauthorized' })
    // @ApiResponse({ status: 404, description: 'Event not found' })
    // async leaveEvent(@Param('id') eventId: string, @Req() req: any): Promise<{ message: string }> {
    //     const user: AuthenticatedUser = req.user;
    //     await this.eventsService.leaveEvent(eventId, user.id);
    //     return { message: 'Successfully left the event' };
    // }

    // @Post(':id/fund')
    // @HttpCode(HttpStatus.OK)
    // @ApiOperation({ summary: 'Fund an event' })
    // @ApiParam({ name: 'id', description: 'Event ID' })
    // @ApiResponse({ status: 200, description: 'Event funded successfully', type: Event })
    // @ApiResponse({ status: 400, description: 'Bad request - invalid funding amount or event already funded' })
    // @ApiResponse({ status: 404, description: 'Event not found' })
    // async fundEvent(
    //     @Param('id') eventId: string,
    //     @Body() fundEventDto: FundEventDto
    // ): Promise<Event> {
    //     return this.eventsService.fundEvent(eventId, fundEventDto);
    // }

    @Get(':id/participants')
    @ApiOperation({ summary: 'Get event participants' })
    @ApiParam({ name: 'id', description: 'Event ID' })
    @ApiResponse({ status: 200, description: 'Participants retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Event not found' })
    async getEventParticipants(@Param('id') eventId: string): Promise<any[]> {
        return this.eventsService.getEventParticipants(eventId);
    }

    @Get(':id/sponsor')
    @ApiOperation({ summary: 'Get event sponsor information' })
    @ApiParam({ name: 'id', description: 'Event ID' })
    @ApiResponse({ status: 200, description: 'Sponsor information retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Event not found or not funded' })
    async getEventSponsor(@Param('id') eventId: string): Promise<any> {
        return this.eventsService.getEventSponsor(eventId);
    }

    @Post('cleanup-duplicates')
    @ApiOperation({ summary: 'Clean up duplicate participation relationships' })
    @ApiResponse({ status: 200, description: 'Duplicate participations cleaned up successfully' })
    async cleanupDuplicateParticipations(): Promise<{ message: string }> {
        await this.eventsService.cleanupDuplicateParticipations();
        return { message: 'Duplicate participation relationships cleaned up successfully' };
    }
}
