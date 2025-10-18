import { ApiProperty } from '@nestjs/swagger';

export class HealthResponseDto {
    @ApiProperty({
        description: 'Health status of the application',
        example: 'healthy',
        enum: ['healthy', 'unhealthy']
    })
    status: string;

    @ApiProperty({
        description: 'Timestamp of the health check',
        example: '2024-10-18T18:30:00.000Z'
    })
    timestamp: string;

    @ApiProperty({
        description: 'Database connection status',
        example: 'connected',
        enum: ['connected', 'disconnected']
    })
    database: string;

    @ApiProperty({
        description: 'Application version',
        example: '1.0.0'
    })
    version: string;

    @ApiProperty({
        description: 'Error message if unhealthy',
        example: 'Database connection failed',
        required: false
    })
    error?: string;
}
