import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { DatabaseModule } from '../database/database.module';
import { AuthMiddleware } from '../auth/auth.middleware';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [DatabaseModule, AuthModule],
    controllers: [EventsController],
    providers: [EventsService],
    exports: [EventsService],
})
export class EventsModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .forRoutes(
                { path: 'events', method: RequestMethod.POST },      // Create event
                { path: 'events/:id', method: RequestMethod.PUT },   // Update event
                { path: 'events/:id', method: RequestMethod.DELETE }, // Delete event
                { path: 'events/:id/participate', method: RequestMethod.POST },   // Join event
                { path: 'events/:id/participate', method: RequestMethod.DELETE }  // Leave event
            );
    }
}
