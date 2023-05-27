# VenomDrop Contracts

This project contains the Venom contracts written in TON-Solidity. It utilizes the locklift framework for development and deployment.

## Contracts

- **VenomDropCollection**: This contract extends the TIP-4 standard and includes additional features for airdrops that can be managed on the VenomDrop platform.
- **Nft**: The NFT contract is deployed as part of the collection mint process.
- **VenomDropCollectionFactory**: A smart contract used to deploy a VenomDropCollection contract.

## Quick Start

1 - Install the npm dependencies:

```
npm i
```

2 - Running tests

```
npm run test
```

> Note: You will need a local node running


3 - Deploy the Factory Smart Contract

```
npm run deploy --network <local|devnet>
```
