// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title HuddleUpProtocol
 * @dev Smart contract for managing event funding, participation, and airdrops
 * @notice This contract handles PYUSD funding, participant management, and airdrop distribution
 */
contract HuddleUpProtocol is ReentrancyGuard, Ownable {
    // PYUSD token contract
    IERC20 public immutable pyusdToken;
    
    // Event structure
    struct Event {
        string dbEventId;           // Database UUID for correlation
        address organizer;          // Event organizer address
        address sponsor;            // Event sponsor address
        uint256 fundingRequired;    // Total funding required
        uint256 airdropAmount;      // Airdrop amount per participant (100 PYUSD)
        uint256 eventDate;          // Event date timestamp
        uint256 totalFunding;       // Total funding received
        bool isFunded;              // Whether event is funded
        bool isCompleted;           // Whether event is completed
        bool exists;                // Whether event exists
    }
    
    // Participant structure
    struct Participant {
        bool isActive;              // Whether participant is currently active
        bool hasReceivedAirdrop;    // Whether participant has received airdrop
        uint256 joinedAt;           // Timestamp when joined
        uint256 leftAt;             // Timestamp when left (0 if still active)
    }
    
    // State variables
    uint256 public nextEventId = 1;  // Next event ID to assign
    mapping(uint256 => Event) public events;  // Event ID => Event data
    mapping(uint256 => mapping(address => Participant)) public participants;  // Event ID => Participant address => Participant data
    mapping(uint256 => address[]) public eventParticipants;  // Event ID => Array of participant addresses
    
    // Events
    event EventCreated(uint256 indexed eventId, string dbEventId, address indexed organizer, uint256 fundingRequired, uint256 airdropAmount, uint256 eventDate);
    event EventFunded(uint256 indexed eventId, address indexed sponsor, uint256 amount);
    event ParticipantJoined(uint256 indexed eventId, address indexed participant);
    event ParticipantLeft(uint256 indexed eventId, address indexed participant);
    event ParticipantVerified(uint256 indexed eventId, address indexed participant, uint256 airdropAmount);
    event FundsWithdrawn(uint256 indexed eventId, address indexed sponsor, uint256 amount);
    
    // Errors
    error EventNotFound();
    error EventAlreadyFunded();
    error EventNotFunded();
    error EventDateInPast();
    error EventDateNotReached();
    error NotOrganizer();
    error NotSponsor();
    error AlreadyParticipant();
    error NotParticipant();
    error AlreadyReceivedAirdrop();
    error InsufficientFunding();
    error TransferFailed();
    error WithdrawalNotAllowed();
    
    /**
     * @dev Constructor
     * @param _pyusdToken Address of the PYUSD token contract
     */
    constructor(address _pyusdToken) Ownable(msg.sender) {
        require(_pyusdToken != address(0), "Invalid PYUSD token address");
        pyusdToken = IERC20(_pyusdToken);
    }
    
    
    /**
     * @dev Fund an event (creates event on-chain and marks as funded)
     * @param _organizer Event organizer address
     * @param _fundingRequired Total funding required
     * @param _airdropAmount Airdrop amount per participant (100 PYUSD)
     * @param _eventDate Event date timestamp
     * @param _fundingAmount Amount to fund the event
     */
    function fundEvent(
        address _organizer,
        uint256 _fundingRequired,
        uint256 _airdropAmount,
        uint256 _eventDate,
        uint256 _fundingAmount
    ) external nonReentrant returns (uint256) {
        require(_organizer != address(0), "Invalid organizer address");
        require(_fundingRequired > 0, "Funding required must be greater than 0");
        require(_airdropAmount > 0, "Airdrop amount must be greater than 0");
        require(_eventDate > block.timestamp, "Event date must be in the future");
        require(_fundingAmount > 0, "Funding amount must be greater than 0");
        
        // Transfer PYUSD from sponsor to contract
        bool success = pyusdToken.transferFrom(msg.sender, address(this), _fundingAmount);
        if (!success) revert TransferFailed();
        
        uint256 eventId = nextEventId++;
        
        events[eventId] = Event({
            dbEventId: "", // Empty string for database correlation
            organizer: _organizer,
            sponsor: msg.sender,
            fundingRequired: _fundingRequired,
            airdropAmount: _airdropAmount,
            eventDate: _eventDate,
            totalFunding: _fundingAmount,
            isFunded: true,
            isCompleted: false,
            exists: true
        });
        
        emit EventCreated(eventId, "", _organizer, _fundingRequired, _airdropAmount, _eventDate);
        emit EventFunded(eventId, msg.sender, _fundingAmount);
        
        return eventId;
    }
    
    /**
     * @dev Join an event as a participant
     * @param _eventId Event ID
     */
    function joinEvent(uint256 _eventId) external {
        Event storage eventData = events[_eventId];
        if (!eventData.exists) revert EventNotFound();
        if (!eventData.isFunded) revert EventNotFunded();
        
        Participant storage participant = participants[_eventId][msg.sender];
        
        // If participant was previously active, reactivate them
        if (participant.isActive) revert AlreadyParticipant();
        
        // If participant left before, reactivate them
        if (participant.leftAt > 0) {
            participant.isActive = true;
            participant.leftAt = 0;
        } else {
            // New participant
            participant.isActive = true;
            participant.joinedAt = block.timestamp;
            participant.hasReceivedAirdrop = false;
            eventParticipants[_eventId].push(msg.sender);
        }
        
        emit ParticipantJoined(_eventId, msg.sender);
    }
    
    /**
     * @dev Leave an event
     * @param _eventId Event ID
     */
    function leaveEvent(uint256 _eventId) external {
        Event storage eventData = events[_eventId];
        if (!eventData.exists) revert EventNotFound();
        
        Participant storage participant = participants[_eventId][msg.sender];
        if (!participant.isActive) revert NotParticipant();
        
        participant.isActive = false;
        participant.leftAt = block.timestamp;
        
        emit ParticipantLeft(_eventId, msg.sender);
    }
    
    /**
     * @dev Verify participant and distribute airdrop (only organizer can call)
     * @param _eventId Event ID
     * @param _participant Participant address to verify
     */
    function verifyParticipant(uint256 _eventId, address _participant) external nonReentrant {
        Event storage eventData = events[_eventId];
        if (!eventData.exists) revert EventNotFound();
        if (msg.sender != eventData.organizer) revert NotOrganizer();
        if (!eventData.isFunded) revert EventNotFunded();
        
        Participant storage participant = participants[_eventId][_participant];
        if (!participant.isActive) revert NotParticipant();
        if (participant.hasReceivedAirdrop) revert AlreadyReceivedAirdrop();
        
        // Check if contract has enough PYUSD for airdrop
        if (pyusdToken.balanceOf(address(this)) < eventData.airdropAmount) {
            revert InsufficientFunding();
        }
        
        // Mark participant as having received airdrop
        participant.hasReceivedAirdrop = true;
        
        // Transfer airdrop to participant
        bool success = pyusdToken.transfer(_participant, eventData.airdropAmount);
        if (!success) revert TransferFailed();
        
        emit ParticipantVerified(_eventId, _participant, eventData.airdropAmount);
    }
    
    /**
     * @dev Withdraw remaining funds (only sponsor can call, 1 day after event date)
     * @param _eventId Event ID
     */
    function withdrawRemainingFunds(uint256 _eventId) external nonReentrant {
        Event storage eventData = events[_eventId];
        if (!eventData.exists) revert EventNotFound();
        if (msg.sender != eventData.sponsor) revert NotSponsor();
        if (block.timestamp < eventData.eventDate + 1 days) revert WithdrawalNotAllowed();
        
        // Calculate remaining funds
        uint256 totalAirdropsDistributed = 0;
        address[] memory participantsList = eventParticipants[_eventId];
        
        for (uint256 i = 0; i < participantsList.length; i++) {
            if (participants[_eventId][participantsList[i]].hasReceivedAirdrop) {
                totalAirdropsDistributed += eventData.airdropAmount;
            }
        }
        
        uint256 remainingFunds = eventData.totalFunding - totalAirdropsDistributed;
        
        if (remainingFunds > 0) {
            bool success = pyusdToken.transfer(eventData.sponsor, remainingFunds);
            if (!success) revert TransferFailed();
            
            emit FundsWithdrawn(_eventId, eventData.sponsor, remainingFunds);
        }
    }
    
    /**
     * @dev Get event details
     * @param _eventId Event ID
     */
    function getEvent(uint256 _eventId) external view returns (Event memory) {
        if (!events[_eventId].exists) revert EventNotFound();
        return events[_eventId];
    }
    
    /**
     * @dev Get participant details
     * @param _eventId Event ID
     * @param _participant Participant address
     */
    function getParticipant(uint256 _eventId, address _participant) external view returns (Participant memory) {
        if (!events[_eventId].exists) revert EventNotFound();
        return participants[_eventId][_participant];
    }
    
    /**
     * @dev Get all participants for an event
     * @param _eventId Event ID
     */
    function getEventParticipants(uint256 _eventId) external view returns (address[] memory) {
        if (!events[_eventId].exists) revert EventNotFound();
        return eventParticipants[_eventId];
    }
    
}
