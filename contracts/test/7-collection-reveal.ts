import { Address, Contract, Signer, toNano } from "locklift";
import { FactorySource } from "../build/factorySource";
import { createAccounts, deployVenomCollection, newTimestamp, setOngoingMintStages, setOutdatedMintStages } from "./utils";
import { Account } from "everscale-standalone-client";
import { expect } from "chai";

type VenomDropCollectionContract = Contract<FactorySource["VenomDropCollection"]>;
type NftContract = Contract<FactorySource["Nft"]>;

describe('VenomDropCollection: reveal', async () => {
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

  describe('reveal token with a new metadata', () => {
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
    let nftContract: NftContract;
    const json = `{"type": "Basic NFT", "name": "NFT Not revealed yet"}`;
    before(async () => {
      collection = await deployVenomCollection(71, ownerSigner, owner.address);
      await configure(collection, { hasMaxSupply: true, maxSupply: 2, json });
      // Mint the first token (id=0)
      await locklift.tracing.trace(mint(collection, 1));
      const { nft: nftAddress } = await collection.methods.nftAddress({
        answerId: 0,
        id: 0,
      }).call();
      nftContract = locklift.factory.getDeployedContract('Nft', nftAddress);
    });
    describe('Reveal NFT', () => {
      it('Calling directly the NFT contract: Should revert', async () => {
        const { traceTree } = await locklift.tracing.trace(
          nftContract.methods.reveal({
            json: '{"type": "Basic NFT", "name": "Only the Collection contract can reveal"}',
          }).send({ from: owner.address, amount: toNano('0.1') }),
          {
            allowedCodes: {
              compute: [1060],
            }
          }
        );
        await expect(traceTree).to.have.error(1060);
      });
      it('Calling the collection from a non-owner address: Should revert', async () => {
        const { traceTree } = await locklift.tracing.trace(
          collection.methods.revealToken({
            tokenId: 0,
            json: '{"type": "Basic NFT", "name": "Test"}',
          }).send({ from: minter.address, amount: toNano('0.1') }),
          {
            allowedCodes: {
              compute: [1000],
            }
          }
        );
        await expect(traceTree).to.have.error(1000);
      });
      it('Calling the collection from the owner address: Should update the json successfully', async () => {
        const revealedJson = `{"type": "Basic NFT", "name": "NFT Revealed!!"}`;
        const { traceTree } = await locklift.tracing.trace(
          collection.methods.revealToken({
            tokenId: 0,
            json: revealedJson,
          }).send({ from: owner.address, amount: toNano('0.1') }),
        );
        await expect(traceTree).to.not.have.error(1000);
        await expectNftJson(collection, 0, revealedJson);
      });
    })
  });
})
