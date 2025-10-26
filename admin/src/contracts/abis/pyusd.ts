/**
 * PYUSD ERC20 Token ABI
 * 
 * Contract Address: 0xcac524bca292aaade2df8a05cc58f0a65b1b3bb9
 * Network: Sepolia Testnet
 * Decimals: 6
 * 
 * Instructions:
 * 1. Replace this array with the actual PYUSD ABI from the contract
 * 2. You can get the ABI from: https://sepolia.etherscan.io/token/0xcac524bca292aaade2df8a05cc58f0a65b1b3bb9#code
 * 3. Copy the JSON ABI array and replace the empty array below
 */

export const PYUSD_ABI = [
    // Standard ERC20 ABI - only including functions we need
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
] as const;

export const PYUSD_CONTRACT_ADDRESS = "0xcac524bca292aaade2df8a05cc58f0a65b1b3bb9" as const;
export const PYUSD_DECIMALS = 6;
