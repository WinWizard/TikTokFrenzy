const updatedSpan = document.querySelector(".updated");

// Function to initialize Web3 and fetch leaderboard
async function initializeLeaderboard() {
    if (typeof window.ethereum === 'undefined') {
        console.log('No wallet connected. Leaderboard will not load.');
        return; // Exit if no wallet is connected
    }

    web3 = new Web3(window.ethereum);
    contract = new web3.eth.Contract(abi, contractAddress);

    try {
        // Fetch and populate the leaderboard
        const leaderboardData = await fetchLeaderboard();
        displayLeaderboard(leaderboardData);
    } catch (error) {
        console.error('Error initializing leaderboard:', error);
    }
}

// Fetch leaderboard data
async function fetchLeaderboard() {
    try {
        const top10Addresses = await contract.methods.getTop10Influencers().call();
        const leaderboardData = [];

        for (const address of top10Addresses) {
            if (address === '0x0000000000000000000000000000000000000000') continue; // Skip empty slots

            // Fetch username and token balance for each address
            const username = await contract.methods.addressToUsername(address).call();
            const balance = BigInt(await contract.methods.balanceOf(address).call()); // Convert balance to BigInt

            leaderboardData.push({
                address,
                username: username || `0x...${address.slice(-4)}`, // Default to truncated wallet if no username
                score: balance, // Store as BigInt
            });
        }

        // Sort by score (BigInt comparison)
        leaderboardData.sort((a, b) => (b.score > a.score ? 1 : b.score < a.score ? -1 : 0));

        return leaderboardData;
    } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        return [];
    }
}

// Display leaderboard in the specified div
function displayLeaderboard(data) {
    const leaderboardDiv = document.getElementById('leaderboard');
    if (!leaderboardDiv) {
        console.error('Leaderboard container element not found.');
        return;
    }

    // Create the leaderboard table
    const table = document.createElement('table');
    table.classList.add('leaderboard-table');

    // Create table headers
    table.innerHTML = `
        <thead>
        </thead>
        <tbody></tbody>
    `;

    // Populate table with leaderboard data
    const tbody = table.querySelector('tbody');
    data.forEach((entry, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.username}</td>
            <td>0x...${entry.address.slice(-4)}</td>
            <td>${entry.score}</td>
        `;
        tbody.appendChild(row);
    });

    // Clear previous content and append the table
    leaderboardDiv.innerHTML = ''; // Clear any existing content
    leaderboardDiv.appendChild(table);
    updatedSpan.innerHTML = '';
    const currentTime = new Date().toLocaleTimeString([], { timeStyle: 'short' }); // Get the current time
    updatedSpan.textContent = `Leaderboard updated at ${currentTime}.`;
    showNotification(`Connected: ${accounts[0]}`);

}


// Event listener for wallet connection
window.addEventListener('DOMContentLoaded', () => {
    initializeLeaderboard(); // Initialize leaderboard on page load
});