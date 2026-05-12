# Web3 Demo

This repo is a hands-on Web3 lesson. It starts with the browser wallet, then moves toward smart contracts.

## What Web3 Means

Web3 apps usually have three layers:

1. **Wallet**: proves who the user is and asks them to approve actions.
2. **Frontend**: a normal web app that talks to the wallet and blockchain.
3. **Smart contract**: code deployed to a blockchain, with state everyone can verify.

In this repo:

- [app/index.html](/Users/nikhilmundhra/Documents/Web3-Demo/app/index.html) is the demo UI.
- [app/app.js](/Users/nikhilmundhra/Documents/Web3-Demo/app/app.js) is where the frontend talks to the wallet and chain.
- [contracts/MessageBoard.sol](/Users/nikhilmundhra/Documents/Web3-Demo/contracts/MessageBoard.sol) is a tiny smart contract.

## Lesson 1: Wallets Are Accounts

A wallet such as MetaMask stores private keys. Your public address is derived from those keys.

When a dapp calls:

```js
await window.ethereum.request({ method: "eth_requestAccounts" });
```

the wallet asks the user for permission. The app receives an address, but never receives the private key.

Try it:

1. Install MetaMask.
2. Open [app/index.html](/Users/nikhilmundhra/Documents/Web3-Demo/app/index.html) in a browser.
3. Click **Connect Wallet**.

## Lesson 2: Reading Chain State Is Usually Free

The app can read your balance and current network without creating a transaction.

In [app/app.js](/Users/nikhilmundhra/Documents/Web3-Demo/app/app.js), look for:

```js
provider.getBalance(address)
provider.getNetwork()
```

Reads do not change blockchain state, so there is no gas fee.

## Lesson 3: Signatures Prove Control

Signing a message proves the wallet owner approved that exact message.

This is commonly used for login:

1. App gives the wallet a message.
2. Wallet signs it.
3. Backend verifies the signature came from the address.

No blockchain transaction is needed.

## Lesson 4: Transactions Change State

A transaction is a signed request sent to the chain. It can transfer value or call contract code.

Transactions cost gas because validators must execute and record them.

The demo includes a safe example: sending `0 ETH` to your own address. It still creates a real transaction if you approve it, so use a test network.

## Lesson 5: Smart Contracts Are Shared Backends

[contracts/MessageBoard.sol](/Users/nikhilmundhra/Documents/Web3-Demo/contracts/MessageBoard.sol) stores one message on-chain.

The important parts:

- `message` is public state.
- `updateMessage(...)` changes state and costs gas.
- `MessageUpdated(...)` is an event, useful for indexing and UI updates.

## Suggested Path

1. Read this file once.
2. Open the app and connect a wallet.
3. Sign a message.
4. Switch MetaMask to a test network.
5. Try the self transaction.
6. Deploy `MessageBoard.sol` in Remix.
7. Paste the deployed address into the app and call `loadMessage` / `updateMessage`.

## Deploy The Contract With Remix

1. Go to [https://remix.ethereum.org](https://remix.ethereum.org).
2. Create a file named `MessageBoard.sol`.
3. Paste the contents of [contracts/MessageBoard.sol](/Users/nikhilmundhra/Documents/Web3-Demo/contracts/MessageBoard.sol).
4. Compile with Solidity `0.8.24` or newer.
5. Deploy using MetaMask on a test network.
6. Copy the deployed contract address into the demo app.

Use a testnet. Real mainnet transactions cost real money.

