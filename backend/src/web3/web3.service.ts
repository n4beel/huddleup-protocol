import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import { HUDDLEUP_ABI } from './contract-abi';
import { EventsService } from 'src/events/events.service';

@Injectable()
export class Web3Service implements OnModuleInit {
    private readonly logger = new Logger(Web3Service.name);
    private readonly contractAddress = process.env.HUDDLEUP_CONTRACT_ADDRESS as string;
    private readonly contractABI = HUDDLEUP_ABI;
    private readonly rpcUrl = `wss://sepolia.infura.io/ws/v3/${process.env.INFURA_API_KEY}`
    private readonly shouldProcessEvents = false;

    async onModuleInit() {
        this.logger.log('Connecting to Sepolia via WebSocket...');
        this.listenToAllEvents();
    }

    constructor(private readonly eventsService: EventsService) { }

    private listenToAllEvents() {
        try {
            const provider = new ethers.WebSocketProvider(this.rpcUrl);
            const contract = new ethers.Contract(
                this.contractAddress,
                this.contractABI,
                provider,
            );

            this.logger.log(
                `Attached listener to contract: ${this.contractAddress}`,
            );

            // Listen for *all* events emitted by the contract
            contract.on('*', (event) => {
                try {
                    this.logger.log('--- NEW EVENT RECEIVED ---');

                    this.logger.log(`Event Name: ${event.fragment.name}`);
                    this.logger.log(`Arguments: ${JSON.stringify(event.args, (key, value) =>
                        typeof value === 'bigint' ? value.toString() : value
                    )}`);
                    this.logger.log(`Block Number: ${event.log.blockNumber}`);
                    this.logger.log(`Transaction Hash: ${event.log.transactionHash}`);

                    if (this.shouldProcessEvents)
                        this.handleEvent(event);

                } catch (error) {
                    this.logger.error('Error processing event:', error);
                    this.logger.error('Event data:', JSON.stringify(event, (key, value) =>
                        typeof value === 'bigint' ? value.toString() : value, 2));
                }
            });

            // Handle provider errors (e.g., connection drops)
            provider.on('error', (error) => {
                this.logger.error('WebSocket Error:', error);
                // Implement reconnection logic if needed
            });

        } catch (error) {
            this.logger.error('Failed to connect or listen to events:', error);
        }
    }

    private handleEvent(event: ethers.EventLog) {
        try {
            this.logger.log(`Handling event: ${event.fragment.name}`);

            switch (event.fragment.name) {
                case 'EventCreated':
                    this.handleEventCreated(event);
                    break;

                case 'EventFunded':
                    this.handleEventFunded(event);
                    break;

                case 'ParticipantJoined':
                    this.handleParticipantJoined(event);
                    break;

                case 'ParticipantLeft':
                    this.handleParticipantLeft(event);
                    break;

                case 'ParticipantVerified':
                    this.handleParticipantVerified(event);
                    break;

                case 'FundsWithdrawn':
                    this.handleFundsWithdrawn(event);
                    break;

                default:
                    this.logger.warn(`Unhandled event type: ${event.fragment.name}`);
            }
        } catch (error) {
            this.logger.error(`Error handling event ${event.fragment.name}:`, error);
        }
    }

    private handleEventCreated(event: ethers.EventLog) {
        const { onchainEventId, organizer, fundingRequired, airdropAmount, eventDate } = event.args;

        // Normalize amounts: divide by 10^6 (assuming 6 decimal places for PYUSD)
        const normalizedFundingRequired = Number(fundingRequired) / 1000000;
        const normalizedAirdropAmount = Number(airdropAmount) / 1000000;

        this.logger.log(`EventCreated: ${onchainEventId} by ${organizer}`);
        this.logger.log(`Funding Required: ${normalizedFundingRequired}`);
        this.logger.log(`Airdrop Amount: ${normalizedAirdropAmount}`);
        this.logger.log(`Event Date: ${new Date(Number(eventDate) * 1000)}`);

        // TODO: Update database with event creation
        // await this.eventsService.updateEventStatus(onchainEventId, 'created');
    }

    private async handleEventFunded(event: ethers.EventLog) {
        try {
            const { eventId, sponsor, amount } = event.args;

            // Normalize amount: divide by 10^6 (assuming 6 decimal places for PYUSD)
            const normalizedAmount = Number(amount) / 1000000;

            this.logger.log(`EventFunded: ${eventId} by ${sponsor} with ${normalizedAmount}`);

            await this.eventsService.fundEvent(eventId, {
                sponsorWalletAddress: sponsor.toLowerCase(),
                amount: normalizedAmount,
            });
        } catch (error) {
            this.logger.error('Error in handleEventFunded:', error);
        }
    }

    private async handleParticipantJoined(event: ethers.EventLog) {
        const { eventId, participant } = event.args;

        this.logger.log(`ParticipantJoined: ${participant} to event ${eventId}`);

        // TODO: Update database with participant information
        await this.eventsService.participateInEvent(eventId, participant.toLowerCase());
    }

    private async handleParticipantLeft(event: ethers.EventLog) {
        const { eventId, participant } = event.args;

        this.logger.log(`ParticipantLeft: ${participant} from event ${eventId}`);

        // TODO: Update database to mark participant as left
        await this.eventsService.leaveEvent(eventId, participant.toLowerCase());
    }

    private async handleParticipantVerified(event: ethers.EventLog) {
        const { eventId, participant, airdropAmount } = event.args;

        // Normalize amount: divide by 10^6 (assuming 6 decimal places for PYUSD)
        const normalizedAirdropAmount = Number(airdropAmount) / 1000000;

        this.logger.log(`ParticipantVerified: ${participant} for event ${eventId} with airdrop ${normalizedAirdropAmount}`);

        // TODO: Update database with verification and airdrop information
        await this.eventsService.verifyParticipantInEvent(eventId, participant.toLowerCase(), normalizedAirdropAmount);
    }

    private handleFundsWithdrawn(event: ethers.EventLog) {
        const { eventId, sponsor, amount } = event.args;

        // Normalize amount: divide by 10^6 (assuming 6 decimal places for PYUSD)
        const normalizedAmount = Number(amount) / 1000000;

        this.logger.log(`FundsWithdrawn: ${normalizedAmount} by ${sponsor} for event ${eventId}`);

        // TODO: Update database with withdrawal information
        // await this.eventsService.recordWithdrawal(eventId, sponsor, normalizedAmount);
    }
}