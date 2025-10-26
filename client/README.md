# HuddleUp Protocol Client

This is the Next.js client application for the HuddleUp Protocol.

## Setup

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_WEB3AUTH_CLIENT_ID=your_web3auth_client_id
NEXT_PUBLIC_WEB3AUTH_NETWORK=SAPPHIRE_MAINNET
NEXT_PUBLIC_BASE_URL=http://localhost:4000
NEXT_PUBLIC_MFA_LEVEL=OPTIONAL
```

### Web3Auth Configuration

**Important**: The Web3Auth setup uses **SAPPHIRE_MAINNET** which provides gasless transactions. This solves the "insufficient funds" error you were experiencing.

To switch networks, set `NEXT_PUBLIC_WEB3AUTH_NETWORK` to:
- `SAPPHIRE_MAINNET` - For production (recommended, has gasless transactions)
- `SAPPHIRE_DEVNET` - For development

### Fixed Issues

1. **Insufficient Funds Error**: Fixed by using Sapphire Mainnet which provides gasless transactions
2. **Contract Call Bug**: Fixed the `writeContract` function call in the event detail page

## Development

```bash
npm run dev
```

## Building

```bash
npm run build
npm start
```

## Key Features

- Web3Auth integration for social login and wallet connections
- Event creation and management
- PYUSD airdrop functionality
- On-chain event verification
- Real-time participant tracking
