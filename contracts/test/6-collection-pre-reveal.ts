import { Address, Contract, Signer, toNano } from "locklift";
import { FactorySource } from "../build/factorySource";
import { createAccounts, deployVenomCollection, newTimestamp, setOngoingMintStages, setOutdatedMintStages } from "./utils";
import { Account } from "everscale-standalone-client";
import { expect } from "chai";

type VenomDropCollectionContract = Contract<FactorySource["VenomDropCollection"]>;

describe('VenomDropCollection: pre-reveal', async () => {
  let signers: Signer[];
  let accounts: Account[];
  // Owner
  let ownerSigner: Signer;
  let owner: Account;
  // Owner
  let minterSigner: Signer;
  let minter: Account;
  before(async () => {
    ({ signers, accounts } = await createAccounts(0, 3));
    [ownerSigner, minterSigner] = signers;
    [owner, minter] = accounts;
  });

  describe('mint with initial metadata', () => {
    const configure = async (collection: VenomDropCollectionContract, { hasMaxSupply, maxSupply, json }: { hasMaxSupply: boolean, maxSupply: number, json: string }) => {
      await collection.methods.multiconfigure({
        options: {
          hasMaxSupply,
          maxSupply,
          mintStages: [
            {
              name: 'Test',
              merkleTreeRoot: 0,
              startTime: 1,
              endTime: newTimestamp("2099-01-01 00:00:00"),
              price: 10,
            }
          ],
        }
      }).send({ from: owner.address, amount: toNano('6') });
      await collection.methods.setInitialMintJson({
        initialMintJson: json,
      }).send({ from: owner.address, amount: toNano('6') });
    }
    const mint = async (collection: VenomDropCollectionContract, amount: number) => {
      return collection.methods.mint({ amount, proof: [] }).send({ from: minter.address, amount: toNano(6 * amount) });
    }
    const expectTotalSupply = async (collection: VenomDropCollectionContract, expectedTotalSupply: number) => {
      const { count: totalSupply } = await collection.methods.totalSupply({ answerId: 0 }).call();
      expect(parseInt(totalSupply)).to.be.equal(expectedTotalSupply);
    }
    const expectNftJson = async (collection: VenomDropCollectionContract, nftId: number, expectedJson: string) => {
      const { nft: nftAddress } = await collection.methods.nftAddress({
        answerId: 0,
        id: nftId,
      }).call();
      const nftContract = locklift.factory.getDeployedContract('Nft', nftAddress);
      const { json: nftJson } = await nftContract.methods.getJson({
        answerId: 0,
      }).call();
      expect(nftJson).to.be.equal(expectedJson);
    }
    let collection: VenomDropCollectionContract;
    const json = `{"type": "Basic NFT", "name": "NFT Not revealed yet"}`;
    before(async () => {
      collection = await deployVenomCollection(61, ownerSigner, owner.address);
      await configure(collection, { hasMaxSupply: true, maxSupply: 2, json });
    });
    it('should mint NFT properly with the configured pre-reveal JSON metadata', async () => {
      // Mint 2 tokens
      await locklift.tracing.trace(mint(collection, 1));
      await locklift.tracing.trace(mint(collection, 1));
      await expectTotalSupply(collection, 2);
      const { info } = await collection.methods.getInfo().call();
      expect(info.hasMaxSupply).to.be.equal(true);
      expect(+info.maxSupply).to.be.equal(2);
      expect(+info.totalSupply).to.be.equal(2);
      // Expect NFTs were minted with the initial json configured previously
      await expectNftJson(collection, 0, json);
      await expectNftJson(collection, 1, json);
    });
  });
})
