import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { QrService } from './qr.service';

@Module({
    imports: [ConfigModule],
    providers: [QrService],
    exports: [QrService],
})
export class QrModule { }
