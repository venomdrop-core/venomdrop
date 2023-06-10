![GitHub issues](https://img.shields.io/github/issues/venomdrop-core/venomdrop) ![GitHub last commit](https://img.shields.io/github/last-commit/venomdrop-core/venomdrop)
[![API Build and Deploy](https://github.com/venomdrop-core/venomdrop/actions/workflows/api.yml/badge.svg)](https://github.com/venomdrop-core/venomdrop/actions/workflows/api.yml)
[![Webapp Build and Deploy](https://github.com/venomdrop-core/venomdrop/actions/workflows/webapp.yml/badge.svg)](https://github.com/venomdrop-core/venomdrop/actions/workflows/webapp.yml)

# VenomDrop
Create and launch your NFT Drops effortlessly with VenomDrop, the platform built on the Venom Blockchain.


## Quick Link

[🌎 Live Demo (Devnet)](https://venomdrop.xyz)

[🎥 Video Pitch](https://youtu.be/3yQalLvOOpQ)

[🛣 Product Roadmap (Hackathon)](https://strandgeek.notion.site/d598c74a3f014b56a75d879c8569d43f?v=2ad073e52ad449f0b660f14d2d83543b&pvs=4)

[📄 API Documentation](https://api.venomdrop.xyz/api)

<img width="1909" alt="image" src="https://github.com/venomdrop-core/venomdrop/assets/101031495/9e2b8510-691f-4df0-ab9f-ccec2f1146de">




### Features (Live and Delivered on Hackathon)

- Create a NFT Collection
- Customize the Logo, Cover and Featured Images
- Define how mint stages you want that can be allowlist or public mint. The allowlist uses the MerkleTree algorithm which ensures the privacy of the address list that are stored offchain.
- Preview Mode: See how your drop page looks like before publish on draft mode
- Define the initial metadata (Image and name) for the Pre-Reveal step
- Reveal the token: When the token is minted you can reveal any NFT from the collection with a JSON metadata
- Bulk Minting: Users have the ability to mint multiple NFTs at once


### Coming Soon

- For Developers: VenomDrop SDK -  Reveal your tokens with a custom logic.
- Define how many tokens a address can mint on the allowlist
- Metrics & Analytics: See metrics and how you can optimize your NFT launch campaign
- Newsletter: Collectors will be able to follow the most liked topics/categories and receive emails with news.




## Development Quick Start


To start developing features on this project, follow the steps below.


### 1 - Install the Contract Dependencies

```
cd contracts
npm install
```

### 2 - Run the contract tests

Before proceed with the env setup, make sure the tests are passing.

2.1 - Run the local development node
```
docker run -it --name local-node -e USER_AGREEMENT=yes -p80:80 --rm tonlabs/local-node:0.29.1
```

2.2 - Run all the locklift tests:

```
npm run test
```

### 3 - Install the API dependencies

```
cd api
npm install
```

3.1 - Run the Postgres configured on the `docker-compose.yaml`

```
docker-compose up
```

3.2 - Generate the Prisma

```
npx prisma generate
```

3.3 - Copy the `.env.example` to a new `.env`

```
cp .env.example .env
```

> Change the env vars needed

3.4 - Run the API development server:

```
npm run start:dev
```


### 4 - Setup the Webapp

4.1 - Install the webapp dependencies

```
cd webapp
npm install
```

4.2 - Copy the `.env.example` to a new `.env`

```
cp .env.example .env
```

> Change the env vars needed

4.3 - Start the development server:

```
npm run dev
```



