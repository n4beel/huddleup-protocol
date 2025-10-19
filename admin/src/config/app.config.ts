// Application configuration from environment variables

interface AppConfig {
    app: {
        name: string;
        url: string;
    };
    api: {
        url: string;
    };
    web3auth?: {
        clientId?: string;
        network?: string;
    };
}

// Validate and get environment variables
const getEnvVar = (name: string, defaultValue?: string): string => {
    const value = process.env[name];
    if (!value && !defaultValue) {
        throw new Error(`Environment variable ${name} is required but not set`);
    }
    return value || defaultValue!;
};

const appConfig: AppConfig = {
    app: {
        name: getEnvVar('NEXT_PUBLIC_APP_NAME', 'HuddleUp Admin'),
        url: getEnvVar('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),
    },
    api: {
        url: getEnvVar('NEXT_PUBLIC_API_URL', 'http://localhost:3000'),
    },
    // Web3Auth config is optional and only included if variables are set
    web3auth: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID ? {
        clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID,
        network: process.env.NEXT_PUBLIC_WEB3AUTH_NETWORK || 'SAPPHIRE_DEVNET',
    } : undefined,
};

export default appConfig;
