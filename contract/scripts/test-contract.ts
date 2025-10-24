import { createPublicClient, createWalletClient, http, parseEther } from "viem";
import { sepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

// Contract addresses (update these after deployment)
const HUDDLEUP_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; // Update after deployment
const PYUSD_TOKEN_ADDRESS = "0xcac524bca292aaade2df8a05cc58f0a65b1b3bb9";

async function main() {
    console.log("Testing HuddleUpProtocol contract...");

    // Create clients
    const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(),
    });

    const account = privateKeyToAccount(process.env.SEPOLIA_PRIVATE_KEY as `0x${string}`);

    const walletClient = createWalletClient({
        account,
        chain: sepolia,
        transport: http(),
    });

    // Get contract instance
    const contract = await hre.viem.getContractAt("HuddleUpProtocol", HUDDLEUP_CONTRACT_ADDRESS);

    console.log("Contract Information:");
    console.log(`Address: ${contract.address}`);
    console.log(`PYUSD Token: ${await contract.read.pyusdToken()}`);
    console.log(`Owner: ${await contract.read.owner()}`);
    console.log(`Next Event ID: ${await contract.read.nextEventId()}`);

    // Test basic functionality
    console.log("\nTesting basic functionality...");

    // Test funding an event
    const organizer = account.address;
    const fundingRequired = parseEther("10000"); // 10,000 PYUSD
    const airdropAmount = parseEther("100"); // 100 PYUSD per participant
    const eventDate = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days from now
    const fundingAmount = parseEther("10000"); // 10,000 PYUSD

    console.log("Funding event...");
    const tx = await contract.write.fundEvent([
        organizer,
        fundingRequired,
        airdropAmount,
        BigInt(eventDate),
        fundingAmount
    ]);

    console.log(`Transaction hash: ${tx}`);
    console.log("✅ Event funded successfully!");

    // Get the event details
    const eventId = await contract.read.nextEventId() - 1n;
    const eventData = await contract.read.getEvent([eventId]);

    console.log("\nEvent Details:");
    console.log(`Event ID: ${eventId}`);
    console.log(`Organizer: ${eventData.organizer}`);
    console.log(`Sponsor: ${eventData.sponsor}`);
    console.log(`Funding Required: ${eventData.fundingRequired}`);
    console.log(`Airdrop Amount: ${eventData.airdropAmount}`);
    console.log(`Event Date: ${new Date(Number(eventData.eventDate) * 1000)}`);
    console.log(`Total Funding: ${eventData.totalFunding}`);
    console.log(`Is Funded: ${eventData.isFunded}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
