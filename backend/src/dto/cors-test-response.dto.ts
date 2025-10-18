import { ApiProperty } from '@nestjs/swagger';

export class CorsTestResponseDto {
    @ApiProperty({
        description: 'CORS test message',
        example: 'CORS is working correctly!'
    })
    message: string;

    @ApiProperty({
        description: 'Timestamp of the CORS test',
        example: '2024-10-18T18:30:00.000Z'
    })
    timestamp: string;

    @ApiProperty({
        description: 'List of allowed origins',
        example: ['https://huddleup-protocol.vercel.app', 'http://localhost:3000'],
        type: [String]
    })
    allowedOrigins: string[];
}
