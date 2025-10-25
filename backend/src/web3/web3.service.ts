import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ethers } from 'ethers';

@Injectable()
export class Web3Service implements OnModuleInit {
    private readonly logger = new Logger(Web3Service.name);
    private readonly contractAddress = '0xD4F25c861905DBe99f40A1361C167b404f4000A2';

    // !!! IMPORTANT !!!
    // 1. Paste your Contract ABI here (from Etherscan Step 3)
    private readonly contractABI = [{ "inputs": [{ "internalType": "address", "name": "_pyusdToken", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [], "name": "AlreadyParticipant", "type": "error" }, { "inputs": [], "name": "AlreadyReceivedAirdrop", "type": "error" }, { "inputs": [], "name": "EventAlreadyExists", "type": "error" }, { "inputs": [], "name": "EventDateInPast", "type": "error" }, { "inputs": [], "name": "EventDateNotReached", "type": "error" }, { "inputs": [], "name": "EventNotFound", "type": "error" }, { "inputs": [], "name": "EventNotFunded", "type": "error" }, { "inputs": [], "name": "InsufficientFunding", "type": "error" }, { "inputs": [], "name": "InvalidEventId", "type": "error" }, { "inputs": [], "name": "NotOrganizer", "type": "error" }, { "inputs": [], "name": "NotParticipant", "type": "error" }, { "inputs": [], "name": "NotSponsor", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }], "name": "OwnableInvalidOwner", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "OwnableUnauthorizedAccount", "type": "error" }, { "inputs": [], "name": "ReentrancyGuardReentrantCall", "type": "error" }, { "inputs": [], "name": "TransferFailed", "type": "error" }, { "inputs": [], "name": "WithdrawalNotAllowed", "type": "error" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "onchainEventId", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "organizer", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "fundingRequired", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "airdropAmount", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "eventDate", "type": "uint256" }], "name": "EventCreated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "eventId", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "sponsor", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "EventFunded", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "eventId", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "sponsor", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "FundsWithdrawn", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "eventId", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "participant", "type": "address" }], "name": "ParticipantJoined", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "eventId", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "participant", "type": "address" }], "name": "ParticipantLeft", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "eventId", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "participant", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "airdropAmount", "type": "uint256" }], "name": "ParticipantVerified", "type": "event" }, { "inputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }, { "internalType": "uint256", "name": "", "type": "uint256" }], "name": "eventParticipants", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "name": "events", "outputs": [{ "internalType": "address", "name": "organizer", "type": "address" }, { "internalType": "address", "name": "sponsor", "type": "address" }, { "internalType": "uint256", "name": "fundingRequired", "type": "uint256" }, { "internalType": "uint256", "name": "airdropAmount", "type": "uint256" }, { "internalType": "uint256", "name": "eventDate", "type": "uint256" }, { "internalType": "uint256", "name": "totalFunding", "type": "uint256" }, { "internalType": "bool", "name": "isFunded", "type": "bool" }, { "internalType": "bool", "name": "isCompleted", "type": "bool" }, { "internalType": "bool", "name": "exists", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "_onchainEventId", "type": "bytes32" }, { "internalType": "address", "name": "_organizer", "type": "address" }, { "internalType": "uint256", "name": "_fundingRequired", "type": "uint256" }, { "internalType": "uint256", "name": "_airdropAmount", "type": "uint256" }, { "internalType": "uint256", "name": "_eventDate", "type": "uint256" }, { "internalType": "uint256", "name": "_fundingAmount", "type": "uint256" }], "name": "fundEvent", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "_eventId", "type": "bytes32" }], "name": "getEvent", "outputs": [{ "components": [{ "internalType": "address", "name": "organizer", "type": "address" }, { "internalType": "address", "name": "sponsor", "type": "address" }, { "internalType": "uint256", "name": "fundingRequired", "type": "uint256" }, { "internalType": "uint256", "name": "airdropAmount", "type": "uint256" }, { "internalType": "uint256", "name": "eventDate", "type": "uint256" }, { "internalType": "uint256", "name": "totalFunding", "type": "uint256" }, { "internalType": "bool", "name": "isFunded", "type": "bool" }, { "internalType": "bool", "name": "isCompleted", "type": "bool" }, { "internalType": "bool", "name": "exists", "type": "bool" }], "internalType": "struct HuddleUpProtocol.Event", "name": "", "type": "tuple" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "_eventId", "type": "bytes32" }], "name": "getEventParticipants", "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "_eventId", "type": "bytes32" }, { "internalType": "address", "name": "_participant", "type": "address" }], "name": "getParticipant", "outputs": [{ "components": [{ "internalType": "bool", "name": "isActive", "type": "bool" }, { "internalType": "bool", "name": "hasReceivedAirdrop", "type": "bool" }, { "internalType": "uint256", "name": "joinedAt", "type": "uint256" }, { "internalType": "uint256", "name": "leftAt", "type": "uint256" }], "internalType": "struct HuddleUpProtocol.Participant", "name": "", "type": "tuple" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "_eventId", "type": "bytes32" }], "name": "joinEvent", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "_eventId", "type": "bytes32" }], "name": "leaveEvent", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }, { "internalType": "address", "name": "", "type": "address" }], "name": "participants", "outputs": [{ "internalType": "bool", "name": "isActive", "type": "bool" }, { "internalType": "bool", "name": "hasReceivedAirdrop", "type": "bool" }, { "internalType": "uint256", "name": "joinedAt", "type": "uint256" }, { "internalType": "uint256", "name": "leftAt", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "pyusdToken", "outputs": [{ "internalType": "contract IERC20", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "_eventId", "type": "bytes32" }, { "internalType": "address", "name": "_participant", "type": "address" }], "name": "verifyParticipant", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "_eventId", "type": "bytes32" }], "name": "withdrawRemainingFunds", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]

    // 2. Use a WebSocket (WSS) RPC URL for event listening.
    //    HTTP URLs do not support pub/sub and are inefficient (polling).
    //    Get a WSS URL from providers like Infura, Alchemy, or QuickNode.
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

                // The 'event' object contains all the event data
                // event.fragment.name contains the event name (e.g., "Transfer")
                // event.args contains the event arguments
                // event.log contains raw log data (topic, data, blockNumber, etc.)

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
        //
        // --- YOUR BUSINESS LOGIC GOES HERE ---
        //
        // Example:
        // if (event.fragment.name === 'PaymentReceived') {
        //   const [from, amount, message] = event.args;
        //   console.log(`Received ${amount} from ${from} with message: ${message}`);
        //   // this.myDatabaseService.savePayment(...);
        // }
        //
        // if (event.fragment.name === 'ItemSold') {
        //    // ...
        // }
    }
}