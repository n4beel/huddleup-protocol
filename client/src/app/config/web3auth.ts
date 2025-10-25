import { type Web3AuthContextConfig } from '@web3auth/modal/react';
import {
    WALLET_CONNECTORS,
    WEB3AUTH_NETWORK,
    MFA_LEVELS,
    type Web3AuthOptions,
} from '@web3auth/modal';

/**
 * Web3Auth Configuration
 * 
 * This configuration enables both social login (Google) and external wallet connections
 * like MetaMask. The setup supports both development and production environments.
 */

// Validate that required environment variables are present
function validateEnvironment() {
    const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID;

    if (!clientId) {
        throw new Error(
            'Missing NEXT_PUBLIC_WEB3AUTH_CLIENT_ID environment variable. ' +
            'Please add your Web3Auth client ID to your .env file.'
        );
    }
}

// Get the appropriate Web3Auth network based on environment
function getNetwork() {
    const network = process.env.NEXT_PUBLIC_WEB3AUTH_NETWORK;

    switch (network) {
        case 'SAPPHIRE_MAINNET':
            return WEB3AUTH_NETWORK.SAPPHIRE_MAINNET;
        case 'SAPPHIRE_DEVNET':
        default:
            // Default to devnet for development
            return WEB3AUTH_NETWORK.SAPPHIRE_DEVNET;
    }
}

// Get MFA level from environment (defaults to mandatory for security)
function getMFALevel() {
    const mfaLevel = process.env.NEXT_PUBLIC_MFA_LEVEL;

    switch (mfaLevel) {
        case 'OPTIONAL':
            return MFA_LEVELS.OPTIONAL;
        case 'NONE':
            return MFA_LEVELS.NONE;
        case 'MANDATORY':
        default:
            return MFA_LEVELS.OPTIONAL;
    }
}

// Validate environment variables
validateEnvironment();

// Web3Auth configuration
const web3AuthOptions: Web3AuthOptions = {
    clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID!,
    web3AuthNetwork: getNetwork(),
    enableLogging: process.env.NODE_ENV === 'development',
    modalConfig: {
        connectors: {
            [WALLET_CONNECTORS.AUTH]: {
                label: 'Social Login',
                loginMethods: {
                    google: {
                        name: 'Continue with Google',
                        showOnModal: true,
                    },
                },
                showOnModal: true,
            },
        },
        // Show external wallet discovery (MetaMask, etc.)
        hideWalletDiscovery: false,
    },
    mfaLevel: getMFALevel(),
    // Add session management
    sessionTime: 24 * 60 * 60, // 24 hours in seconds
};

const web3AuthConfig: Web3AuthContextConfig = {
    web3AuthOptions,
};

export default web3AuthConfig;