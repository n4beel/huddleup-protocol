// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "../contracts/HuddleUpProtocol.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Mock PYUSD token for testing
contract MockPYUSD is ERC20 {
    constructor() ERC20("PayPal USD", "PYUSD") {
        _mint(msg.sender, 1000000 * 10**18); // Mint 1M PYUSD for testing
    }
    
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract HuddleUpProtocolTest is Test {
    HuddleUpProtocol public protocol;
    MockPYUSD public pyusd;
    
    address public owner = address(0x1);
    address public organizer = address(0x2);
    address public sponsor = address(0x3);
    address public participant1 = address(0x4);
    address public participant2 = address(0x5);
    address public participant3 = address(0x6);
    
    uint256 public constant AIRDROP_AMOUNT = 100 * 10**18; // 100 PYUSD
    uint256 public constant FUNDING_REQUIRED = 10000 * 10**18; // 10,000 PYUSD
    uint256 public constant FUNDING_AMOUNT = 10000 * 10**18; // 10,000 PYUSD
    
    function setUp() public {
        // Deploy mock PYUSD token
        pyusd = new MockPYUSD();
        
        // Deploy protocol contract
        vm.prank(owner);
        protocol = new HuddleUpProtocol(address(pyusd));
        
        // Distribute PYUSD to test accounts
        pyusd.transfer(sponsor, 50000 * 10**18);
        pyusd.transfer(participant1, 1000 * 10**18);
        pyusd.transfer(participant2, 1000 * 10**18);
        pyusd.transfer(participant3, 1000 * 10**18);
        
        // Approve protocol to spend PYUSD
        vm.prank(sponsor);
        pyusd.approve(address(protocol), type(uint256).max);
    }
    
    
    function testFundEvent() public {
        uint256 eventDate = block.timestamp + 7 days;
        
        vm.prank(sponsor);
        uint256 eventId = protocol.fundEvent(
            organizer,
            FUNDING_REQUIRED,
            AIRDROP_AMOUNT,
            eventDate,
            FUNDING_AMOUNT
        );
        
        assertEq(eventId, 1);
        
        HuddleUpProtocol.Event memory eventData = protocol.getEvent(eventId);
        assertEq(eventData.sponsor, sponsor);
        assertEq(eventData.totalFunding, FUNDING_AMOUNT);
        assertTrue(eventData.isFunded);
        
        // Check that PYUSD was transferred to contract
        assertEq(pyusd.balanceOf(address(protocol)), FUNDING_AMOUNT);
    }
    
    function testJoinEvent() public {
        // First create and fund an event
        uint256 eventDate = block.timestamp + 7 days;
        
        vm.prank(sponsor);
        uint256 eventId = protocol.fundEvent(
            organizer,
            FUNDING_REQUIRED,
            AIRDROP_AMOUNT,
            eventDate,
            FUNDING_AMOUNT
        );
        
        // Participant joins event
        vm.prank(participant1);
        protocol.joinEvent(eventId);
        
        HuddleUpProtocol.Participant memory participant = protocol.getParticipant(eventId, participant1);
        assertTrue(participant.isActive);
        assertEq(participant.joinedAt, block.timestamp);
        assertFalse(participant.hasReceivedAirdrop);
        
        address[] memory participants = protocol.getEventParticipants(eventId);
        assertEq(participants.length, 1);
        assertEq(participants[0], participant1);
    }
    
    function testLeaveEvent() public {
        // First create and fund an event
        uint256 eventDate = block.timestamp + 7 days;
        
        vm.prank(sponsor);
        uint256 eventId = protocol.fundEvent(
            organizer,
            FUNDING_REQUIRED,
            AIRDROP_AMOUNT,
            eventDate,
            FUNDING_AMOUNT
        );
        
        // Participant joins then leaves
        vm.prank(participant1);
        protocol.joinEvent(eventId);
        
        vm.prank(participant1);
        protocol.leaveEvent(eventId);
        
        HuddleUpProtocol.Participant memory participant = protocol.getParticipant(eventId, participant1);
        assertFalse(participant.isActive);
        assertEq(participant.leftAt, block.timestamp);
    }
    
    function testRejoinEvent() public {
        // First create and fund an event
        uint256 eventDate = block.timestamp + 7 days;
        
        vm.prank(sponsor);
        uint256 eventId = protocol.fundEvent(
            organizer,
            FUNDING_REQUIRED,
            AIRDROP_AMOUNT,
            eventDate,
            FUNDING_AMOUNT
        );
        
        // Participant joins, leaves, then rejoins
        vm.prank(participant1);
        protocol.joinEvent(eventId);
        
        vm.prank(participant1);
        protocol.leaveEvent(eventId);
        
        vm.prank(participant1);
        protocol.joinEvent(eventId);
        
        HuddleUpProtocol.Participant memory participant = protocol.getParticipant(eventId, participant1);
        assertTrue(participant.isActive);
        assertEq(participant.leftAt, 0); // Should be reset to 0
    }
    
    function testVerifyParticipant() public {
        // First create and fund an event
        uint256 eventDate = block.timestamp + 7 days;
        
        vm.prank(sponsor);
        uint256 eventId = protocol.fundEvent(
            organizer,
            FUNDING_REQUIRED,
            AIRDROP_AMOUNT,
            eventDate,
            FUNDING_AMOUNT
        );
        
        // Participant joins
        vm.prank(participant1);
        protocol.joinEvent(eventId);
        
        // Organizer verifies participant
        vm.prank(organizer);
        protocol.verifyParticipant(eventId, participant1);
        
        HuddleUpProtocol.Participant memory participant = protocol.getParticipant(eventId, participant1);
        assertTrue(participant.hasReceivedAirdrop);
        
        // Check that PYUSD was transferred to participant
        assertEq(pyusd.balanceOf(participant1), 1000 * 10**18 + AIRDROP_AMOUNT);
    }
    
    function testMultipleParticipants() public {
        // First create and fund an event
        uint256 eventDate = block.timestamp + 7 days;
        
        vm.prank(sponsor);
        uint256 eventId = protocol.fundEvent(
            organizer,
            FUNDING_REQUIRED,
            AIRDROP_AMOUNT,
            eventDate,
            FUNDING_AMOUNT
        );
        
        // Multiple participants join
        vm.prank(participant1);
        protocol.joinEvent(eventId);
        
        vm.prank(participant2);
        protocol.joinEvent(eventId);
        
        vm.prank(participant3);
        protocol.joinEvent(eventId);
        
        address[] memory participants = protocol.getEventParticipants(eventId);
        assertEq(participants.length, 3);
        
        // Verify all participants
        vm.prank(organizer);
        protocol.verifyParticipant(eventId, participant1);
        
        vm.prank(organizer);
        protocol.verifyParticipant(eventId, participant2);
        
        vm.prank(organizer);
        protocol.verifyParticipant(eventId, participant3);
        
        // Check balances
        assertEq(pyusd.balanceOf(participant1), 1000 * 10**18 + AIRDROP_AMOUNT);
        assertEq(pyusd.balanceOf(participant2), 1000 * 10**18 + AIRDROP_AMOUNT);
        assertEq(pyusd.balanceOf(participant3), 1000 * 10**18 + AIRDROP_AMOUNT);
    }
    
    function testWithdrawRemainingFunds() public {
        // First create and fund an event
        uint256 eventDate = block.timestamp + 1 days; // Event in 1 day
        
        vm.prank(sponsor);
        uint256 eventId = protocol.fundEvent(
            organizer,
            FUNDING_REQUIRED,
            AIRDROP_AMOUNT,
            eventDate,
            FUNDING_AMOUNT
        );
        
        // Participant joins and gets verified
        vm.prank(participant1);
        protocol.joinEvent(eventId);
        
        vm.prank(organizer);
        protocol.verifyParticipant(eventId, participant1);
        
        // Fast forward to after event date + 1 day
        vm.warp(eventDate + 1 days + 1);
        
        uint256 sponsorBalanceBefore = pyusd.balanceOf(sponsor);
        
        // Sponsor withdraws remaining funds
        vm.prank(sponsor);
        protocol.withdrawRemainingFunds(eventId);
        
        uint256 sponsorBalanceAfter = pyusd.balanceOf(sponsor);
        uint256 expectedRemaining = FUNDING_AMOUNT - AIRDROP_AMOUNT;
        
        assertEq(sponsorBalanceAfter - sponsorBalanceBefore, expectedRemaining);
    }
    
    
    function testFailJoinAlreadyJoined() public {
        // First create and fund an event
        uint256 eventDate = block.timestamp + 7 days;
        
        vm.prank(sponsor);
        uint256 eventId = protocol.fundEvent(
            organizer,
            FUNDING_REQUIRED,
            AIRDROP_AMOUNT,
            eventDate,
            FUNDING_AMOUNT
        );
        
        // Participant joins
        vm.prank(participant1);
        protocol.joinEvent(eventId);
        
        // Try to join again - should fail
        vm.prank(participant1);
        vm.expectRevert(HuddleUpProtocol.AlreadyParticipant.selector);
        protocol.joinEvent(eventId);
    }
    
    function testFailVerifyNonParticipant() public {
        // First create and fund an event
        uint256 eventDate = block.timestamp + 7 days;
        
        vm.prank(sponsor);
        uint256 eventId = protocol.fundEvent(
            organizer,
            FUNDING_REQUIRED,
            AIRDROP_AMOUNT,
            eventDate,
            FUNDING_AMOUNT
        );
        
        // Try to verify non-participant - should fail
        vm.prank(organizer);
        vm.expectRevert(HuddleUpProtocol.NotParticipant.selector);
        protocol.verifyParticipant(eventId, participant1);
    }
    
    function testFailVerifyTwice() public {
        // First create and fund an event
        uint256 eventDate = block.timestamp + 7 days;
        
        vm.prank(sponsor);
        uint256 eventId = protocol.fundEvent(
            organizer,
            FUNDING_REQUIRED,
            AIRDROP_AMOUNT,
            eventDate,
            FUNDING_AMOUNT
        );
        
        // Participant joins
        vm.prank(participant1);
        protocol.joinEvent(eventId);
        
        // Verify participant
        vm.prank(organizer);
        protocol.verifyParticipant(eventId, participant1);
        
        // Try to verify again - should fail
        vm.prank(organizer);
        vm.expectRevert(HuddleUpProtocol.AlreadyReceivedAirdrop.selector);
        protocol.verifyParticipant(eventId, participant1);
    }
    
    function testFailWithdrawTooEarly() public {
        // First create and fund an event
        uint256 eventDate = block.timestamp + 7 days;
        
        vm.prank(sponsor);
        uint256 eventId = protocol.fundEvent(
            organizer,
            FUNDING_REQUIRED,
            AIRDROP_AMOUNT,
            eventDate,
            FUNDING_AMOUNT
        );
        
        // Try to withdraw before event date + 1 day - should fail
        vm.prank(sponsor);
        vm.expectRevert(HuddleUpProtocol.WithdrawalNotAllowed.selector);
        protocol.withdrawRemainingFunds(eventId);
    }
    
    function testFailWithdrawNotSponsor() public {
        // First create and fund an event
        uint256 eventDate = block.timestamp + 1 days;
        
        vm.prank(sponsor);
        uint256 eventId = protocol.fundEvent(
            organizer,
            FUNDING_REQUIRED,
            AIRDROP_AMOUNT,
            eventDate,
            FUNDING_AMOUNT
        );
        
        // Fast forward to after event date + 1 day
        vm.warp(eventDate + 1 days + 1);
        
        // Try to withdraw as non-sponsor - should fail
        vm.prank(participant1);
        vm.expectRevert(HuddleUpProtocol.NotSponsor.selector);
        protocol.withdrawRemainingFunds(eventId);
    }
}
