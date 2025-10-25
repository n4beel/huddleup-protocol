# Alchemy Webhook Setup Guide

## 1. Configure Alchemy Webhook

### Webhook Configuration:
- **Webhook type:** Custom
- **Name:** HuddleUp Protocol
- **Chain:** Ethereum
- **Network:** Sepolia
- **Query Template:** All events for a contract
- **Webhook URL:** `https://your-backend-url.com/webhook/alchemy`

### GraphQL Query:
```graphql
{
  block {
    hash,
    number,
    timestamp,
    # Replace with your deployed contract address
    logs(filter: {addresses: ["YOUR_CONTRACT_ADDRESS"]}) { 
      data,
      topics,
      index,
      account {
        address
      },
      transaction {
        hash,
        nonce,
        index,
        from {
          address
        },
        to {
          address
        },
        value,
        gasPrice,
        maxFeePerGas,
        maxPriorityFeePerGas,
        gas,
        status,
        gasUsed,
        cumulativeGasUsed,
        effectiveGasPrice,
        createdContract {
          address
        }
      }
    }
  }
}
```

## 2. Environment Variables

Add these to your `.env` file:

```env
# Contract Configuration
HUDDLEUP_CONTRACT_ADDRESS=0x... # Your deployed contract address
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY

# Optional: Webhook Security
ALCHEMY_WEBHOOK_SECRET=your_webhook_secret
```

## 3. Webhook Endpoint

The webhook will be available at:
```
POST /webhook/alchemy
```

## 4. Event Processing

The webhook handler will automatically process these events:

- **EventCreated**: When an event is funded
- **EventFunded**: When funding is received
- **ParticipantJoined**: When someone joins an event
- **ParticipantLeft**: When someone leaves an event
- **ParticipantVerified**: When organizer verifies a participant
- **FundsWithdrawn**: When sponsor withdraws remaining funds

## 5. Testing

1. Deploy your contract to Sepolia
2. Update the contract address in the GraphQL query
3. Test the webhook by funding an event
4. Check your backend logs for event processing

## 6. Monitoring

- Check `/webhook/alchemy` endpoint for webhook delivery
- Monitor backend logs for event processing
- Use Alchemy dashboard to monitor webhook delivery status

## 7. Benefits of Webhook Approach

✅ **Real-time**: Events processed immediately when emitted
✅ **Reliable**: Alchemy handles delivery and retries
✅ **Efficient**: No polling required
✅ **Scalable**: Handles high event volumes automatically
✅ **Cost-effective**: No continuous RPC calls needed
