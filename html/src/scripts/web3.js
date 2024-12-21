// Initialize variables
let web3;
let contract;
const contractAddress = '0x2163d419DD7bD13151b6E21Ef074abE019774Dd6';
const abi = [{
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [{
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "blockHeight",
                "type": "uint256"
            }
        ],
        "name": "ClaimTimerStarted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [{
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "username",
                "type": "string"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "influencer",
                "type": "address"
            }
        ],
        "name": "Joined",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [{
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "RemainingBNBTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [{
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "RewardClaimed",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [{
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [{
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "username",
                "type": "string"
            }
        ],
        "name": "UserAddedManually",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "CLAIM_BLOCKS",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
                "internalType": "string",
                "name": "username",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "userAddress",
                "type": "address"
            }
        ],
        "name": "addUserManually",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "address",
            "name": "",
            "type": "address"
        }],
        "name": "addressToUsername",
        "outputs": [{
            "internalType": "string",
            "name": "",
            "type": "string"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "address",
            "name": "account",
            "type": "address"
        }],
        "name": "balanceOf",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "address",
            "name": "",
            "type": "address"
        }],
        "name": "balances",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "claimReward",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "currentTopInfluencer",
        "outputs": [{
            "internalType": "address",
            "name": "",
            "type": "address"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "earlyDrawRequests",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "entryFee",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "address",
            "name": "_transferAddress",
            "type": "address"
        }],
        "name": "finalizeRemainingBNB",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getTop10Influencers",
        "outputs": [{
            "internalType": "address[10]",
            "name": "",
            "type": "address[10]"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "address",
            "name": "",
            "type": "address"
        }],
        "name": "hasClaimedReward",
        "outputs": [{
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "address",
            "name": "",
            "type": "address"
        }],
        "name": "hasRequestedEarlyDraw",
        "outputs": [{
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "highestTokens",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
                "internalType": "string",
                "name": "username",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "influencerUsername",
                "type": "string"
            }
        ],
        "name": "join",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "manualAddCount",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "manualAddLimit",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [{
            "internalType": "string",
            "name": "",
            "type": "string"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [{
            "internalType": "address",
            "name": "",
            "type": "address"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "ownerReward",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "address",
            "name": "",
            "type": "address"
        }],
        "name": "referral",
        "outputs": [{
            "internalType": "address",
            "name": "",
            "type": "address"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "referralReward",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "name": "registeredUsers",
        "outputs": [{
            "internalType": "address",
            "name": "",
            "type": "address"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "requestEarlyDraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "rewardTokens",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [{
            "internalType": "string",
            "name": "",
            "type": "string"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "name": "topInfluencers",
        "outputs": [{
            "internalType": "address",
            "name": "",
            "type": "address"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalBNB",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "transferAddress",
        "outputs": [{
            "internalType": "address",
            "name": "",
            "type": "address"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "transferBlockHeight",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "string",
            "name": "",
            "type": "string"
        }],
        "name": "usernameToAddress",
        "outputs": [{
            "internalType": "address",
            "name": "",
            "type": "address"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "usersClaimedReward",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    }
];

// Check if a wallet already has a username on page load
window.addEventListener('DOMContentLoaded', async() => {
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        contract = new web3.eth.Contract(abi, contractAddress);

        // Check if the wallet already has a username
        await existingUser();
    }
});

// Initialize Web3 when the user interacts with the wallet
async function initializeWeb3() {
    web3 = new Web3(window.ethereum);
    contract = new web3.eth.Contract(abi, contractAddress);

    // Event listener for wallet connection changes
    window.ethereum.on('accountsChanged', async(accounts) => {
        if (accounts.length > 0) {
            await existingUser();
        } else {
            // Refresh the page if no wallet is connected
            resetUI();
        }
    });

    // Event listener for wallet disconnection
    window.ethereum.on('disconnect', () => {
        // Refresh the page on wallet disconnection
        resetUI();
    });
}

// Function to check if a wallet already has a username and hide elements if true
async function existingUser() {
    try {
        // Get the connected accounts
        const accounts = await web3.eth.getAccounts();

        // If no wallet is connected, do nothing (script.js handles the UI)
        if (accounts.length === 0) return;

        const userAddress = accounts[0];
        const truncatedAddress = `0x...${userAddress.slice(-4)}`; // Correctly extract the last 4 digits

        // Check if the wallet already has a username
        const currentUsername = await contract.methods.addressToUsername(userAddress).call();

        if (currentUsername && currentUsername.trim() !== '') {
            // Hide the join button and wallet overlay
            document.querySelectorAll('.join-btn').forEach((btn) => {
                btn.classList.add('hidden');
            });
            document.getElementById('wallet-overlay').classList.add('hidden');

            // Show the user button and set its text to the truncated wallet address
            const userAddressSpan = document.querySelector('.user-address');
            userAddressSpan.textContent = truncatedAddress; // Set the correct truncated address
            document.querySelector('.user-btn').classList.remove('hidden');

            // Show welcome back notification
            showNotification(`Welcome back, ${currentUsername}`);
        } else {
            // Show the join button and wallet overlay
            document.querySelectorAll('.join-btn').forEach((btn) => {
                btn.classList.remove('hidden');
            });
            document.getElementById('wallet-overlay').classList.remove('hidden');

            // Hide the user button
            document.querySelector('.user-btn').classList.add('hidden');
        }
    } catch (error) {
        console.error('Error checking existing user:', error);
        // Fail gracefully (do not show errors to the user)
    }
}


// Function to reset the UI when a wallet is disconnected
function resetUI() {
    // Ensure the join button is visible
    document.querySelectorAll('.join-btn').forEach((btn) => {
        btn.classList.remove('hidden');
    });
    document.querySelector('.user-btn').classList.add('hidden');

    // Ensure the wallet overlay is visible
    document.getElementById('wallet-overlay').classList.remove('hidden');

    // Optionally reset any other UI elements to the default state
    showNotification('Wallet disconnected. Please reconnect.'); // TikTok pink
}

// Display notifications
function showNotification(message, color = '#FF3B5C') {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');

    if (!notification || !notificationMessage) {
        console.error('Notification elements are missing from the DOM.');
        return;
    }

    notificationMessage.textContent = message;
    notification.style.backgroundColor = color;
    notification.classList.remove('hidden'); // Ensure it is visible
    notification.classList.add('visible');

    setTimeout(() => {
        notification.classList.remove('visible');
        notification.classList.add('hidden'); // Hide it again
    }, 4000);
}

// Check username validity
async function checkUsername(fieldId, isInfluencer = false) {
    const inputField = document.getElementById(fieldId);
    const username = inputField.value.trim();

    if (!username) return;

    try {
        const address = await contract.methods.usernameToAddress(username).call();
        if (isInfluencer) {
            if (address === '0x0000000000000000000000000000000000000000') {
                inputField.style.color = '#FF3B5C'; // TikTok pink
                showNotification('Influencer does not exist.');
            } else {
                inputField.style.color = ''; // Reset color
            }
        } else {
            if (address !== '0x0000000000000000000000000000000000000000') {
                inputField.style.color = '#FF3B5C'; // TikTok pink
                showNotification('Username is already taken.');
            } else {
                inputField.style.color = ''; // Reset color
            }
        }
    } catch (error) {
        console.error(error);
        showNotification('Error checking username.');
    }
}

// Join functionality
async function joinGame() {
    const influencerField = document.getElementById('influencer-username');
    const usernameField = document.getElementById('your-username');
    const influencer = influencerField.value.trim();
    const username = usernameField.value.trim();

    if (!influencer || !username) {
        showNotification('Please fill in both usernames.');
        return;
    }

    try {
        const accounts = await web3.eth.getAccounts();
        const userAddress = accounts[0];

        // Verify influencer exists
        const influencerAddress = await contract.methods.usernameToAddress(influencer).call();
        if (influencerAddress === '0x0000000000000000000000000000000000000000') {
            showNotification('Influencer does not exist.');
            return;
        }

        // Verify username is free
        const usernameOwner = await contract.methods.usernameToAddress(username).call();
        if (usernameOwner !== '0x0000000000000000000000000000000000000000') {
            showNotification('Username is already taken.');
            return;
        }

        // Verify wallet address doesn't already have a username
        const currentUsername = await contract.methods.addressToUsername(userAddress).call();
        if (currentUsername) {
            showNotification('This wallet already has a username.');
            return;
        }

        // Get entry fee
        const entryFee = await contract.methods.entryFee().call();
        console.log(`Entry Fee: ${entryFee}`);

        // Specify max fee and priority fee
        const maxPriorityFeePerGas = web3.utils.toWei('3', 'gwei'); // Set to 3 Gwei
        const maxFeePerGas = web3.utils.toWei('3', 'gwei'); // Set to 3 Gwei

        // Send transaction with custom gas settings
        await contract.methods.join(username, influencer).send({
            from: userAddress,
            value: entryFee,
            maxPriorityFeePerGas,
            maxFeePerGas,
        });

        showNotification('You successfully joined the game!');
        document.getElementById('wallet-overlay').classList.add('hidden');
        document.querySelectorAll('.join-btn').forEach((btn) => {
            btn.classList.add('hidden');
        });
        document.querySelector('.user-btn').classList.remove('hidden');
    } catch (error) {
        console.error('Transaction failed:', error);
        if (error.data && error.data.message) {
            showNotification(`Transaction failed: ${error.data.message}`);
        } else {
            showNotification('Error joining the game. Check the console for details.');
        }
    }
}

// Event listeners
document.getElementById('influencer-username').addEventListener('blur', () => checkUsername('influencer-username', true));
document.getElementById('your-username').addEventListener('blur', () => checkUsername('your-username', false));
document.getElementById('joinButton').addEventListener('click', joinGame);

// Initialize web3 on button click
document.querySelectorAll('.join-btn').forEach((btn) => {
    btn.addEventListener('click', initializeWeb3);
});