import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

// PYUSD token address on Sepolia
const PYUSD_TOKEN_ADDRESS = "0xcac524bca292aaade2df8a05cc58f0a65b1b3bb9";

export default buildModule("HuddleUpProtocolModule", (m) => {
    const huddleUpProtocol = m.contract("HuddleUpProtocol", [PYUSD_TOKEN_ADDRESS]);

    return { huddleUpProtocol };
});
