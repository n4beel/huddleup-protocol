import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createPublicClient, http, parseAbi } from 'viem';
import { sepolia } from 'viem/chains';
import { EventsService } from '../events/events.service';
import { UsersService } from '../users/users.service';

// Contract ABI for event decoding
const HUDDLEUP_ABI = parseAbi([
    'event EventCreated(uint256 indexed eventId, string dbEventId, address indexed organizer, uint256 fundingRequired, uint256 airdropAmount, uint256 eventDate)',
    'event EventFunded(uint256 indexed eventId, address indexed sponsor, uint256 amount)',
    'event ParticipantJoined(uint256 indexed eventId, address indexed participant)',
    'event ParticipantLeft(uint256 indexed eventId, address indexed participant)',
    'event ParticipantVerified(uint256 indexed eventId, address indexed participant, uint256 airdropAmount)',
    'event FundsWithdrawn(uint256 indexed eventId, address indexed sponsor, uint256 amount)',
]);

interface AlchemyWebhookPayload {
    block: {
        hash: string;
        number: number;
        timestamp: number;
        logs: Array<{
            data: string;
            topics: string[];
            index: number;
            account: {
                address: string;
            };
            transaction: {
                hash: string;
                nonce: number;
                index: number;
                from: { address: string };
                to: { address: string };
                value: string;
                gasPrice: string;
                maxFeePerGas: string;
                maxPriorityFeePerGas: string;
                gas: string;
                status: number;
                gasUsed: string;
                cumulativeGasUsed: string;
                effectiveGasPrice: string;
                createdContract?: { address: string };
            };
        }>;
    };
}

@Injectable()
export class WebhookHandlerService {
    private readonly logger = new Logger(WebhookHandlerService.name);
    private publicClient;

    constructor(
        private readonly configService: ConfigService,
        private readonly eventsService: EventsService,
        private readonly usersService: UsersService,
    ) {
        this.publicClient = createPublicClient({
            chain: sepolia,
            transport: http(this.configService.get<string>('SEPOLIA_RPC_URL')),
        });
    }

    async handleWebhook(payload: AlchemyWebhookPayload) {
        this.logger.log(`Processing webhook for block ${payload.block.number}`);

        try {
            // Process each log in the block
            for (const log of payload.block.logs) {
                await this.processLog(log, payload.block);
            }

            this.logger.log(`Successfully processed ${payload.block.logs.length} logs from block ${payload.block.number}`);
        } catch (error) {
            this.logger.error(`Error processing webhook for block ${payload.block.number}:`, error);
            throw error; // Re-throw to trigger webhook retry
        }
    }

    private async processLog(log: any, block: any) {
        try {
            // Decode the event log
            const decoded = this.publicClient.decodeEventLog({
                abi: HUDDLEUP_ABI,
                data: log.data as `0x${string}`,
                topics: log.topics as `0x${string}`[],
            });

            this.logger.log(`Processing ${decoded.eventName} event`);

            // Process based on event type
            switch (decoded.eventName) {
                case 'EventCreated':
                    await this.handleEventCreated(decoded.args, log, block);
                    break;
                case 'EventFunded':
                    await this.handleEventFunded(decoded.args, log, block);
                    break;
                case 'ParticipantJoined':
                    await this.handleParticipantJoined(decoded.args, log, block);
                    break;
                case 'ParticipantLeft':
                    await this.handleParticipantLeft(decoded.args, log, block);
                    break;
                case 'ParticipantVerified':
                    await this.handleParticipantVerified(decoded.args, log, block);
                    break;
                case 'FundsWithdrawn':
                    await this.handleFundsWithdrawn(decoded.args, log, block);
                    break;
                default:
                    this.logger.warn(`Unknown event type: ${decoded.eventName}`);
            }
        } catch (error) {
            this.logger.error(`Error processing log:`, error);
            // Don't throw here to avoid failing the entire webhook
        }
    }

    private async handleEventCreated(args: any, log: any, block: any) {
        const { eventId, organizer, fundingRequired, airdropAmount, eventDate } = args;

        this.logger.log(`EventCreated: ${eventId} by ${organizer}`);

        // Find the corresponding event in your database
        // You'll need to correlate this with your database event
        // For now, we'll log the details
        this.logger.log(`Event details:`, {
            eventId: eventId.toString(),
            organizer,
            fundingRequired: fundingRequired.toString(),
            airdropAmount: airdropAmount.toString(),
            eventDate: new Date(Number(eventDate) * 1000),
        });
    }

    private async handleEventFunded(args: any, log: any, block: any) {
        const { eventId, sponsor, amount } = args;

        this.logger.log(`EventFunded: ${eventId} by ${sponsor} with ${amount}`);

        // Update event status to 'funded' in database
        // You'll need to find the event by eventId and update its status
    }

    private async handleParticipantJoined(args: any, log: any, block: any) {
        const { eventId, participant } = args;

        this.logger.log(`ParticipantJoined: ${participant} to event ${eventId}`);

        // Update participant status in database
        // Find the event and add/update participant
    }

    private async handleParticipantLeft(args: any, log: any, block: any) {
        const { eventId, participant } = args;

        this.logger.log(`ParticipantLeft: ${participant} from event ${eventId}`);

        // Update participant status in database
        // Mark participant as left
    }

    private async handleParticipantVerified(args: any, log: any, block: any) {
        const { eventId, participant, airdropAmount } = args;

        this.logger.log(`ParticipantVerified: ${participant} for event ${eventId} with airdrop ${airdropAmount}`);

        // Update participant verification status and airdrop amount in database
        // Mark participant as verified and record airdrop amount
    }

    private async handleFundsWithdrawn(args: any, log: any, block: any) {
        const { eventId, sponsor, amount } = args;

        this.logger.log(`FundsWithdrawn: ${amount} by ${sponsor} for event ${eventId}`);

        // Update event completion status in database
        // Mark event as completed
    }
}
