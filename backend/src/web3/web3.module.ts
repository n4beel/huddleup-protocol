import { Module } from '@nestjs/common';
import { Web3Service } from './web3.service';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [EventsModule],
  providers: [Web3Service]
})
export class Web3Module { }
