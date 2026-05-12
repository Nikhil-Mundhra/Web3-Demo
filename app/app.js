import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@6.13.5/+esm";

const messageBoardAbi = [
  "function message() view returns (string)",
  "function lastWriter() view returns (address)",
  "function updateMessage(string newMessage)",
  "event MessageUpdated(address indexed writer, string message)"
];

let provider;
let signer;
let address;

const $ = (id) => document.getElementById(id);

const elements = {
  connectWallet: $("connectWallet"),
  address: $("address"),
  network: $("network"),
  balance: $("balance"),
  signMessage: $("signMessage"),
  signature: $("signature"),
  sendSelfTx: $("sendSelfTx"),
  txStatus: $("txStatus"),
  contractAddress: $("contractAddress"),
  newMessage: $("newMessage"),
  loadMessage: $("loadMessage"),
  updateMessage: $("updateMessage"),
  contractStatus: $("contractStatus")
};

function requireWallet() {
  if (!window.ethereum) {
    throw new Error("No injected wallet found. Install MetaMask or another EIP-1193 wallet.");
  }
}

async function refreshAccount() {
  const network = await provider.getNetwork();
  const balance = await provider.getBalance(address);

  elements.address.textContent = address;
  elements.network.textContent = `${network.name} (${network.chainId})`;
  elements.balance.textContent = `${ethers.formatEther(balance)} ETH`;
}

function setConnectedControls(isConnected) {
  elements.signMessage.disabled = !isConnected;
  elements.sendSelfTx.disabled = !isConnected;
  elements.loadMessage.disabled = !isConnected;
  elements.updateMessage.disabled = !isConnected;
}

async function connectWallet() {
  try {
    requireWallet();

    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    address = await signer.getAddress();

    await refreshAccount();
    setConnectedControls(true);
  } catch (error) {
    elements.address.textContent = error.message;
  }
}

async function signMessage() {
  const message = `Web3 Demo login\nAddress: ${address}\nTime: ${new Date().toISOString()}`;
  const signature = await signer.signMessage(message);

  elements.signature.textContent = signature;
}

async function sendSelfTx() {
  elements.txStatus.textContent = "Waiting for wallet approval...";

  const tx = await signer.sendTransaction({
    to: address,
    value: 0n
  });

  elements.txStatus.textContent = `Submitted: ${tx.hash}\nWaiting for confirmation...`;

  const receipt = await tx.wait();
  elements.txStatus.textContent = `Confirmed in block ${receipt.blockNumber}\nHash: ${tx.hash}`;

  await refreshAccount();
}

function getContract() {
  const contractAddress = elements.contractAddress.value.trim();

  if (!ethers.isAddress(contractAddress)) {
    throw new Error("Enter a valid contract address.");
  }

  return new ethers.Contract(contractAddress, messageBoardAbi, signer);
}

async function loadContractMessage() {
  try {
    const contract = getContract();
    const [message, lastWriter] = await Promise.all([
      contract.message(),
      contract.lastWriter()
    ]);

    elements.contractStatus.textContent = `Message: ${message}\nLast writer: ${lastWriter}`;
  } catch (error) {
    elements.contractStatus.textContent = error.message;
  }
}

async function updateContractMessage() {
  try {
    const contract = getContract();
    const newMessage = elements.newMessage.value.trim();

    elements.contractStatus.textContent = "Waiting for wallet approval...";

    const tx = await contract.updateMessage(newMessage);
    elements.contractStatus.textContent = `Submitted: ${tx.hash}\nWaiting for confirmation...`;

    await tx.wait();
    await loadContractMessage();
  } catch (error) {
    elements.contractStatus.textContent = error.message;
  }
}

elements.connectWallet.addEventListener("click", connectWallet);
elements.signMessage.addEventListener("click", signMessage);
elements.sendSelfTx.addEventListener("click", sendSelfTx);
elements.loadMessage.addEventListener("click", loadContractMessage);
elements.updateMessage.addEventListener("click", updateContractMessage);

if (window.ethereum) {
  window.ethereum.on("accountsChanged", () => window.location.reload());
  window.ethereum.on("chainChanged", () => window.location.reload());
}

