import { Address, Contract, Signer, toNano } from "locklift";
import { FactorySource } from "../build/factorySource";
import { createAccounts, deployVenomCollection, newTimestamp, setOngoingMintStages, setOutdatedMintStages } from "./utils";
import { Account } from "everscale-standalone-client";
import { expect } from "chai";

type VenomDropCollectionContract = Contract<FactorySource["VenomDropCollection"]>;
type NftContract = Contract<FactorySource["Nft"]>;

describe('VenomDropCollection: withdraw', async () => {
  let signers: Signer[];
  let accounts: Account[];
  // Owner
  let ownerSigner: Signer;
  let owner: Account;
  // Other
  let minterSigner: Signer;
  let minter: Account;
  let collection: VenomDropCollectionContract;
  // Recipient
  let recipientSigner: Signer;
  let recipient: Account;
  before(async () => {
    ({ signers, accounts } = await createAccounts(0, 3));
    [ownerSigner, minterSigner, recipientSigner] = signers;
    [owner, minter, recipient] = accounts;
    collection = await deployVenomCollection(81, ownerSigner, owner.address);
    await locklift.giver.sendTo(collection.address, toNano('100'));
  });

  it('When caller is not the collection owner: Should revert', async () => {
    const { traceTree } = await locklift.tracing.trace(
      collection.methods.withdraw({
        toAccount: owner.address,
        amount: toNano('50'),
      }).send({ from: minter.address, amount: toNano('0.1') }),
      {
        allowedCodes: {
          compute: [1000],
        }
      }
    );
    await expect(traceTree).to.have.error(1000);
  });

  it('When caller is the collection owner: Should withdraw successfully', async () => {
    const { traceTree } = await locklift.tracing.trace(
      collection.methods.withdraw({
        toAccount: owner.address,
        amount: toNano('50'),
      }).send({ from: owner.address, amount: toNano('0.1') }),
      {
        allowedCodes: {
          compute: [1000],
        }
      }
    );
    await expect(traceTree).to.not.have.error(1000);
    const diff = traceTree!.getBalanceDiff(owner.address);
    expect(diff > toNano('49') && diff < toNano('50')).to.be.true;
  });

  it('When caller is the collection owner but there is no enough balance: Should revert', async () => {
    const { traceTree } = await locklift.tracing.trace(
      collection.methods.withdraw({
        toAccount: owner.address,
        amount: toNano('200'),
      }).send({ from: owner.address, amount: toNano('0.1') }),
      {
        allowedCodes: {
          compute: [1090],
        }
      }
    );
    await expect(traceTree).to.have.error(1090);
  });
})
