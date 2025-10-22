import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { UploadModule } from './upload/upload.module';
import { QrModule } from './qr/qr.module';
import { QrController } from './qr/qr.controller';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      envFilePath: '.env',
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    EventsModule,
    UploadModule,
    QrModule,
  ],
  controllers: [AppController, QrController],
  providers: [AppService],
})
export class AppModule { }
