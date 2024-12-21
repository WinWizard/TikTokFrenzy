// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

// To interact with this contract please go to https://tiktokfrenzy.com

contract TikTokFrenzy {
    // Basic Token Data
    string public name = "TikTok Frenzy";
    string public symbol = "FRNZ";
    uint256 public decimals = 0; // FRNZ tokes are not transferable points 
    uint256 public totalSupply = 40000000; // Limited supply, scores go in steps of 100

    // Game Data
    uint256 public entryFee = 0.015 ether; // Entry fee that directly contribute to the prize pot
    uint256 public rewardTokens = 100; // Amount of points rewarded to new users and influencers
    uint256 public referralReward = 20; // 20% of entry fee
    uint256 public ownerReward = 10; // 10% of entry fee

    address public owner; // Contract owner
    uint256 public totalBNB; // Total amount of BNB in the contract
    uint256 public manualAddCount; // Tracks how many users have been added manually
    uint256 public manualAddLimit = 100; // Limit for manual user addition
    uint256 public usersClaimedReward = 0; // Total users that claimed the reward

    uint256 public earlyDrawRequests = 0; // Count of users requesting an early draw

    // Current Top Influencer
    address public currentTopInfluencer;
    uint256 public highestTokens;

    // Declare variables for the claim timer
    address public transferAddress;
    uint256 public transferBlockHeight;
    uint256 public constant CLAIM_BLOCKS = (30 * 24 * 60 * 60) / 3; // Approximate blocks in 30 days on BSC (3 sec/block on average)

    // Mappings
    mapping(address => uint256) public balances; // ERC-20 compatible balances
    mapping(string => address) public usernameToAddress;
    mapping(address => string) public addressToUsername;
    mapping(address => address) public referral; // Maps users to their influencers
    mapping(address => bool) public hasClaimedReward; // Tracks if a user has claimed their reward
    mapping(address => bool) public hasRequestedEarlyDraw; // Tracks users who requested an early draw

    // Array to store all registered addresses
    address[] public registeredUsers;

    // Top 10 Leaderboard
    address[10] public topInfluencers;

    // Events
    event Joined(
        address indexed user,
        string username,
        address indexed influencer
    );
    event UserAddedManually(address indexed user, string username);
    event RewardClaimed(address indexed user, uint256 amount);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event ClaimTimerStarted(address indexed to, uint256 blockHeight);
    event RemainingBNBTransferred(address indexed to, uint256 amount);

    constructor() {
        // Initializes the contract,
        // sets the owner as the deployer,
        // and assigns the total supply to the contract.
        owner = msg.sender;
        balances[address(this)] = totalSupply;
    }

    modifier onlyOwner() {
        // Provide a error for some unauthorized interactions
        require(msg.sender == owner, "Not authorized");
        _;
    }

    function balanceOf(address account) public view returns (uint256) {
        // Retrieves the token balance of a specific address
        // - Takes an address as input
        // - Returns the balance of the address
        return balances[account];
    }

    function join(string memory username, string memory influencerUsername) public payable {
        // Allows a user to join the game by:
        // 1. Paying the entry fee
        // 2. Providing a unique username
        // 3. Referencing an influencer by username

        // Requirements
        require(balances[address(this)] >= 200, "No more entries available");
        require(msg.value == entryFee, "Incorrect entry fee");
        require(bytes(username).length > 0, "Username cannot be empty");
        require(
            usernameToAddress[username] == address(0),
            "Username already taken"
        );

        // Resolve influencer username and address
        address influencer = usernameToAddress[influencerUsername];
        require(influencer != address(0), "Influencer does not exist");

        // Ensure the contract has enough tokens to distribute
        require(
            balances[address(this)] >= (rewardTokens * 2),
            "Not enough tokens left to distribute"
        );

        // Set mappings
        usernameToAddress[username] = msg.sender;
        addressToUsername[msg.sender] = username;
        referral[msg.sender] = influencer;
        registeredUsers.push(msg.sender);

        // Distribute tokens
        balances[msg.sender] += rewardTokens; // Add tokens to user balance
        balances[address(this)] -= rewardTokens; // Deduct from contract
        emit Transfer(address(this), msg.sender, rewardTokens); // Emit Transfer event

        balances[influencer] += rewardTokens; // Add tokens to referred influencer balance
        balances[address(this)] -= rewardTokens; // Deduct from contract
        emit Transfer(address(this), influencer, rewardTokens); // Emit Transfer event

        // Update currentTopInfluencer if influencer's balance surpasses the current leader
        if (balances[influencer] > highestTokens) {
            highestTokens = balances[influencer];
            currentTopInfluencer = influencer;
        }

        // Update leaderboard
        updateTopInfluencers(influencer);
        updateTopInfluencers(msg.sender); // Ensure the joining user is considered as well

        // Distribute BNB
        uint256 influencerReward = (msg.value * referralReward) / 100; // Calculate Influencer share
        uint256 ownerRewardAmount = (msg.value * ownerReward) / 100; // Calculate Contract owner share
        uint256 contractAmount = msg.value -
            influencerReward -
            ownerRewardAmount; // Update contract token balance
        totalBNB += contractAmount; // Update contract BNB balance

        // Transfer BNB
        payable(influencer).transfer(influencerReward);
        payable(owner).transfer(ownerRewardAmount);

        // Emit that a new user joined
        emit Joined(msg.sender, username, influencer);
    }

    function updateTopInfluencers(address influencer) internal {
        // Updates the top 10 leaderboard with influencers based on token balance
        // - Compares the balance of a given influencer with others on the leaderboard
        // - Rearranges the leaderboard if necessary

        for (uint256 i = 0; i < 10; i++) {
            if (topInfluencers[i] == influencer) {
                // Already in leaderboard, update the leaderboard position if necessary
                for (
                    uint256 j = i;
                    j > 0 &&
                        balances[topInfluencers[j]] >
                        balances[topInfluencers[j - 1]];
                    j--
                ) {
                    // Swap positions
                    (topInfluencers[j], topInfluencers[j - 1]) = (
                        topInfluencers[j - 1],
                        topInfluencers[j]
                    );
                }
                return;
            }
        }

        // Not in leaderboard, add influencer if eligible
        for (uint256 i = 0; i < 10; i++) {
            if (
                topInfluencers[i] == address(0) ||
                balances[influencer] > balances[topInfluencers[i]]
            ) {
                // Shift the lower scores down
                for (uint256 j = 9; j > i; j--) {
                    topInfluencers[j] = topInfluencers[j - 1];
                }
                // Insert the new influencer
                topInfluencers[i] = influencer;
                break;
            }
        }
    }

    function getTop10Influencers() public view returns (address[10] memory) {
        // Retrieves the current top 10 influencers
        // - Returns an array of the addresses on the leaderboard
        return topInfluencers;
    }

    function claimReward() public {
        // Ensure the game has ended
        require(balances[address(this)] == 0, "Game is not finished yet");

        // Ensure user is part of the winning team
        address winningTeamLeader = currentTopInfluencer;
        require(
            referral[msg.sender] == winningTeamLeader,
            "You are not part of the winning team"
        );

        // Check if the user has already claimed their reward
        require(!hasClaimedReward[msg.sender], "Reward already claimed");

        // Calculate the reward
        uint256 totalTeamSize = 0;
        for (uint256 i = 0; i < registeredUsers.length; i++) {
            if (referral[registeredUsers[i]] == winningTeamLeader) {
                totalTeamSize++;
            }
        }
        require(totalTeamSize > 0, "No members in the winning team");

        uint256 reward = address(this).balance /
            (totalTeamSize - usersClaimedReward);

        // Update states
        hasClaimedReward[msg.sender] = true; // Mark the reward as claimed
        usersClaimedReward++; // Increment the claimed rewards counter
        totalBNB -= reward; // Deduct the reward from the total BNB

        // Transfer the reward
        payable(msg.sender).transfer(reward);

        // Emit the reward claimed event
        emit RewardClaimed(msg.sender, reward);
    }

    function addUserManually(string memory username, address userAddress) public onlyOwner {
        // Allows the contract owner to manually add (max 100) users
        // Used to trigger organic promotion for a selected few
        require(manualAddCount < manualAddLimit, "Manual user limit reached");
        require(bytes(username).length > 0, "Username cannot be empty");
        require(userAddress != address(0) && !isContract(userAddress), "Invalid address");
        require(
            usernameToAddress[username] == address(0),
            "Username already taken"
        );
        require(
            bytes(addressToUsername[userAddress]).length == 0,
            "Address already registered"
        );

        require(
            balances[address(this)] >= (rewardTokens),
            "Not enough tokens left to distribute"
        );

        // Set mappings
        usernameToAddress[username] = userAddress;
        addressToUsername[userAddress] = username;
        registeredUsers.push(userAddress);

        // Assign tokens
        balances[userAddress] += rewardTokens;
        balances[address(this)] -= rewardTokens; // Deduct from contract
        emit Transfer(address(this), userAddress, rewardTokens); // Emit Transfer event

        // Update leaderboard
        updateTopInfluencers(userAddress);

        // Increment manual add count
        manualAddCount++;

        emit UserAddedManually(userAddress, username);
    }

    function isContract(address addr) internal view returns (bool) {
        uint256 size;
        assembly {
            size := extcodesize(addr)
            }
        return size > 0;
    }


    function requestEarlyDraw() public {
        // Allows active users to request an early draw of rewards
        // - Ensures only eligible users with tokens can request
        // - Counts the requests and triggers an early draw if more than 50% of users agree
        // - Burns leftover tokens in the contract to signal game end
        require(balances[address(this)] != 0, "Game already finished");
        require(balances[msg.sender] > 0, "Only active users can request");
        require(!hasRequestedEarlyDraw[msg.sender], "Already requested");
        require(
            balances[address(this)] < (totalSupply * 75) / 100,
            "Contract still holds more than 75% of the tokens"
        );

        hasRequestedEarlyDraw[msg.sender] = true;
        earlyDrawRequests++;

        // If more than 50% of active users request, burn leftover tokens
        if (earlyDrawRequests > registeredUsers.length / 2) {
            uint256 leftoverTokens = balances[address(this)];
            balances[address(this)] = 0;
            totalSupply -= leftoverTokens;

            emit Transfer(address(this), address(0), leftoverTokens); // Burn tokens
        }
    }

    function finalizeRemainingBNB(address _transferAddress) external onlyOwner {
        // Handles the transfer of remaining unclaimed BNB
        // - Sets a timer for finalizing the remaining BNB transfer
        // - Transfers the remaining balance to a new address after the timer expires
        // This function can be used to transfer the remainings to a future project.

        // Function requires that at least one reward is claimed.
        require(usersClaimedReward > 0, "No rewards claimed yet");

        if (transferAddress == address(0)) {
            // First time setting the address
            require(transferBlockHeight == 0, "Timer already started");
            require(_transferAddress != address(0), "Invalid address");
            transferAddress = _transferAddress;
            transferBlockHeight = block.number;

            // Emit that the timer is started to inform winners to claim their reward.
            emit ClaimTimerStarted(transferAddress, transferBlockHeight);
        } else {
            // Subsequent calls to finalize transfer
            require(
                block.number >= transferBlockHeight + CLAIM_BLOCKS,
                "Timer not expired"
            );
            uint256 remainingBalance = address(this).balance;
            require(remainingBalance > 0, "No remaining balance to transfer");

            payable(transferAddress).transfer(remainingBalance);
            emit RemainingBNBTransferred(transferAddress, remainingBalance);
        }
    }
}