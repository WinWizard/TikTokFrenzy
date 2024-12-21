// Elements
const joinBtns = document.querySelectorAll(".join-btn");
const walletOverlay = document.getElementById("wallet-overlay");
const closeOverlayBtn = document.getElementById("close-overlay");
const notification = document.getElementById("notification");
const notificationMessage = document.getElementById("notification-message");
const modalTitle = document.getElementById("modal-title");
const modalDisclaimer = document.querySelector(".modal-disclaimer");


// Content Sections
const connectMetamaskContent = document.getElementById("connect-metamask-content");
const installMetamaskContent = document.getElementById("install-metamask-content");
const walletConnectedContent = document.getElementById("wallet-connected-content");

// Buttons
const connectMetamaskBtn = document.getElementById("connect-metamask");
const installMetamaskBtn = document.getElementById("install-metamask");

// Show notification
function showNotification(message) {
    notificationMessage.textContent = message;
    notification.classList.remove("hidden");
    notification.classList.add("visible");

    setTimeout(() => {
        notification.classList.remove("visible");
        notification.classList.add("hidden");
    }, 4000);
}

// Toggle overlay content and update disclaimer
function showOverlayContent(contentToShow, customDisclaimerText) {
    connectMetamaskContent.classList.add("hidden");
    installMetamaskContent.classList.add("hidden");
    walletConnectedContent.classList.add("hidden");

    modalDisclaimer.innerHTML = customDisclaimerText;

    contentToShow.classList.remove("hidden");
    walletOverlay.classList.remove("hidden");
    walletOverlay.classList.add("visible");
}

// Ensure correct network is selected
async function switchToBnb() {
    const bnbParams = {
        chainId: "0x38", // Mainnet Chain ID
        chainName: "Binance Smart Chain Mainnet",
        nativeCurrency: {
            name: "BNB",
            symbol: "BNB",
            decimals: 18,
        },
        rpcUrls: ["https://bsc-dataseed.binance.org/"],
        blockExplorerUrls: ["https://bscscan.com/"],
    };


    try {
        const currentChainId = await window.ethereum.request({ method: "eth_chainId" });
        if (currentChainId !== bnbParams.chainId) {
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: bnbParams.chainId }],
            });
            showNotification("Switched to Binance Smart Chain ");
        }
    } catch (error) {
        if (error.code === 4902) {
            try {
                await window.ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [bnbParams],
                });
                showNotification("Binance Smart Chain  added and switched");
            } catch (addError) {
                showNotification("Failed to add Binance Smart Chain : " + addError.message);
            }
        } else {
            showNotification("Failed to switch network: " + error.message);
        }
    }
}

// Attach event listener to each button
joinBtns.forEach((button) => {
    button.addEventListener("click", async() => {
        if (typeof window.ethereum !== "undefined" && window.ethereum.isMetaMask) {
            try {
                const accounts = await window.ethereum.request({ method: "eth_accounts" });
                if (accounts.length > 0) {
                    modalTitle.textContent = "Join the TikTok Frenzy";
                    showOverlayContent(walletConnectedContent, 'To join, you need to enter the username of an influencer who has already joined the frenzy. By doing so, you will increase the score of the influencer and automatically <span class="discl-pink">become part of their winning team!</span>');
                } else {
                    modalTitle.textContent = "Connect Wallet";
                    showOverlayContent(connectMetamaskContent, 'To interact with the TikTok Frenzy <a href="https://example.com" target="_blank">SmartContract</a>,<br>you need to connect with a wallet.');
                }
            } catch (error) {
                showNotification("Failed to check wallet connection");
            }
        } else {
            modalTitle.textContent = "Connect Wallet";
            showOverlayContent(installMetamaskContent, 'No wallet plugin detected.<br>Install <a href="https://metamask.io/download/" target="_blank">MetaMask</a> for your browser to continue.</a>');
        }
    });
});

// Close overlay
closeOverlayBtn.addEventListener("click", () => {
    walletOverlay.classList.add("hidden");
    walletOverlay.classList.remove("visible");
});

// MetaMask connection logic
connectMetamaskBtn.addEventListener("click", async() => {
    if (typeof window.ethereum !== "undefined") {
        try {
            await switchToBnb();
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            showNotification(`Connected: ${accounts[0]}`);

            modalTitle.textContent = "Join the TikTok Frenzy";
            showOverlayContent(walletConnectedContent, 'To join, you need to enter the username of an influencer who has already joined the frenzy. By doing so, you will increase the score of the influencer and automatically <span class="discl-pink">become part of their winning team!</span>');
        } catch (error) {
            if (error.code === 4001) {
                showNotification("Connection rejected by the user.");
            } else {
                showNotification("Failed to connect wallet: " + error.message);
            }
        }
    } else {
        showNotification("MetaMask is not installed. Please install it to continue.");
    }
});

// Install MetaMask button logic
installMetamaskBtn.addEventListener("click", () => {
    window.open("https://metamask.io/download/", "_blank");
});

// Hide notification on click
notification.addEventListener("click", () => {
    notification.classList.remove("visible");
    notification.classList.add("hidden");
});

// Close overlay on MetaMask disconnection or account change
if (typeof window.ethereum !== "undefined") {
    window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length === 0) {
            showNotification("Wallet disconnected");
            walletOverlay.classList.add("hidden");
            walletOverlay.classList.remove("visible");
        }
    });

    window.ethereum.on("disconnect", () => {
        showNotification("Wallet disconnected");
        walletOverlay.classList.add("hidden");
        walletOverlay.classList.remove("visible");
    });
}