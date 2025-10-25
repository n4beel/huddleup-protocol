import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import { HUDDLEUP_ABI } from './contract-abi';

@Injectable()
export class Web3Service implements OnModuleInit {
    private readonly logger = new Logger(Web3Service.name);
    private readonly contractAddress = process.env.HUDDLEUP_CONTRACT_ADDRESS as string;
    private readonly contractABI = HUDDLEUP_ABI;
    private readonly rpcUrl = `wss://sepolia.infura.io/ws/v3/${process.env.INFURA_API_KEY}`

    async onModuleInit() {
        this.logger.log('Connecting to Sepolia via WebSocket...');
        this.listenToAllEvents();
    }

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
                this.logger.log('--- NEW EVENT RECEIVED ---');

                this.logger.log(`Event Name: ${event.fragment.name}`);
                this.logger.log(`Arguments: ${JSON.stringify(event.args)}`);
                this.logger.log(`Block Number: ${event.log.blockNumber}`);
                this.logger.log(`Transaction Hash: ${event.log.transactionHash}`);

                // Add your business logic here
                // e.g., save to database, send a notification, etc.
                this.handleEvent(event);
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

            case 'OwnershipTransferred':
                this.handleOwnershipTransferred(event);
                break;

            default:
                this.logger.warn(`Unhandled event type: ${event.fragment.name}`);
        }
    }

    private handleEventCreated(event: ethers.EventLog) {
        const { onchainEventId, organizer, fundingRequired, airdropAmount, eventDate } = event.args;

        this.logger.log(`EventCreated: ${onchainEventId} by ${organizer}`);
        this.logger.log(`Funding Required: ${fundingRequired.toString()}`);
        this.logger.log(`Airdrop Amount: ${airdropAmount.toString()}`);
        this.logger.log(`Event Date: ${new Date(Number(eventDate) * 1000)}`);

        // TODO: Update database with event creation
        // await this.eventsService.updateEventStatus(onchainEventId, 'created');
    }

    private handleEventFunded(event: ethers.EventLog) {
        const { eventId, sponsor, amount } = event.args;

        this.logger.log(`EventFunded: ${eventId} by ${sponsor} with ${amount.toString()}`);

        // TODO: Update database with funding information
        // await this.eventsService.updateEventStatus(eventId, 'funded');
    }

    private handleParticipantJoined(event: ethers.EventLog) {
        const { eventId, participant } = event.args;

        this.logger.log(`ParticipantJoined: ${participant} to event ${eventId}`);

        // TODO: Update database with participant information
        // await this.eventsService.addParticipant(eventId, participant);
    }

    private handleParticipantLeft(event: ethers.EventLog) {
        const { eventId, participant } = event.args;

        this.logger.log(`ParticipantLeft: ${participant} from event ${eventId}`);

        // TODO: Update database to mark participant as left
        // await this.eventsService.removeParticipant(eventId, participant);
    }

    private handleParticipantVerified(event: ethers.EventLog) {
        const { eventId, participant, airdropAmount } = event.args;

        this.logger.log(`ParticipantVerified: ${participant} for event ${eventId} with airdrop ${airdropAmount.toString()}`);

        // TODO: Update database with verification and airdrop information
        // await this.eventsService.verifyParticipant(eventId, participant, airdropAmount);
    }

    private handleFundsWithdrawn(event: ethers.EventLog) {
        const { eventId, sponsor, amount } = event.args;

        this.logger.log(`FundsWithdrawn: ${amount.toString()} by ${sponsor} for event ${eventId}`);

        // TODO: Update database with withdrawal information
        // await this.eventsService.recordWithdrawal(eventId, sponsor, amount);
    }

    private handleOwnershipTransferred(event: ethers.EventLog) {
        const { previousOwner, newOwner } = event.args;

        this.logger.log(`OwnershipTransferred: from ${previousOwner} to ${newOwner}`);

        // TODO: Update database with ownership change
        // await this.eventsService.updateOwnership(previousOwner, newOwner);
    }
}