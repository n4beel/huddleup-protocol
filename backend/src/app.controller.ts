import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth() {
    return this.appService.getHealth();
  }

  @Get('cors-test')
  getCorsTest() {
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
