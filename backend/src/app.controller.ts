import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { HealthResponseDto } from './dto/health-response.dto';
import { CorsTestResponseDto } from './dto/cors-test-response.dto';

@ApiTags('general')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @ApiOperation({ summary: 'Get welcome message' })
  @ApiResponse({ status: 200, description: 'Returns a welcome message' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiTags('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Returns health status including database connectivity',
    type: HealthResponseDto
  })
  getHealth(): Promise<HealthResponseDto> {
    return this.appService.getHealth();
  }

  @Get('cors-test')
  @ApiTags('cors')
  @ApiOperation({ summary: 'Test CORS configuration' })
  @ApiResponse({
    status: 200,
    description: 'Returns CORS test information',
    type: CorsTestResponseDto
  })
  getCorsTest(): CorsTestResponseDto {
    return {
      message: 'CORS is working correctly!',
      timestamp: new Date().toISOString(),
      allowedOrigins: [
        'https://huddleup-protocol.vercel.app',
        'https://huddleup-protocol-admin.vercel.app',
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002'
      ]
    };
  }
}
