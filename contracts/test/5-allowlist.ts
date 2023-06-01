import { MerkleTree } from 'merkletreejs'
import CryptoJS, { SHA256 } from 'crypto-js';
import { Address, Contract, toNano } from 'locklift';
import { FactorySource } from '../build/factorySource';
import { Account, Signer } from 'everscale-standalone-client';
import { createAccounts, deployVenomCollection, newTimestamp } from './utils';
import { expect } from 'chai';


function Sha256FromAddress(address: Address) {
  const addr = address.toString();
  const uint256 = BigInt(addr.replace('0:', '0x'));
  const hex = uint256.toString(16).padStart(64, "0");
  const hash = CryptoJS.SHA256(CryptoJS.enc.Hex.parse(hex));
  const hex2 = hash.toString(CryptoJS.enc.Hex);
  return BigInt("0x" + hex2);
}

function Sha256FromBuffer(buffer: Buffer) {
  const hex = buffer.toString('hex');
  const hash = CryptoJS.SHA256(CryptoJS.enc.Hex.parse(hex));
  const hex2 = hash.toString(CryptoJS.enc.Hex);
  return BigInt("0x" + hex2);
}

function getAddrHex(address: Address): string {
  const addr = address.toString();
  const uint256 = BigInt(addr.replace('0:', '0x'));
  const hex = uint256.toString(16).padStart(64, "0");
  return hex;
}

function concatAndHashFn(addr1: Address, addr2: Address): bigint {
  const concat = Buffer.concat([
    Buffer.from(getAddrHex(addr1), 'hex'),
    Buffer.from(getAddrHex(addr2), 'hex'),
  ]);
  return Sha256FromBuffer(concat);
}

const createAllowlistMerkleTree = (addresses: Address[]): MerkleTree => {
  const leaves = addresses.map(getAddrHex).map(hex => Buffer.from(hex, 'hex'));
  return new MerkleTree(leaves, SHA256, {
    hashLeaves: false,
    sortLeaves: true,
    sortPairs: true,
  });
}


describe('VenomDropCollectionFactory: deploy a collection contract', async () => {
  let merkleContract: Contract<FactorySource["TestMerkleTreeProof"]>;
  let signers: Signer[];
  let accounts: Account[];
  // Owner
  let ownerSigner: Signer;
  let owner: Account;
  before(async () => {
    ({ signers, accounts } = await createAccounts(0, 1));
    [ownerSigner] = signers;
    [owner] = accounts;
    ({ contract: merkleContract } = await locklift.factory.deployContract({
      contract: "TestMerkleTreeProof",
      publicKey: ownerSigner.publicKey,
      initParams: {},
      constructorParams: {},
      value: locklift.utils.toNano(1),
    }));
  });

  describe("MerkleTree", async function () {
    it("Hash address: The hash generated on contract should be the same as the hash from js", async function () {
      const address = new Address('0:e39b3c712a8ff98ff154de73a25bca572189d5c7c958b28600c29cd7923247a4');
      const { res } = await merkleContract.methods.hashAddress({
        addr: address,
      }).call();
      expect(res).to.be.equal(Sha256FromAddress(address).toString());
    });

    it('concatHashFn', async () => {
      const addr1 = new Address('0:e39b3c712a8ff98ff154de73a25bca572189d5c7c958b28600c29cd7923247a4');
      const addr2 = new Address('0:fc2ebfa6b7cbeb78157b38fb185e9c3345cb0ea9294f8eec0361c6fb786959f2');
      const expectedHash = concatAndHashFn(addr1, addr2);

      const { res } = await merkleContract.methods.concatHashFn({
        addr1,
        addr2,
      }).call();

      expect(res).to.be.equal(expectedHash.toString());
    });

    it('concatHashFn returning bytes32', async () => {
      const addr1 = new Address('0:e39b3c712a8ff98ff154de73a25bca572189d5c7c958b28600c29cd7923247a4');
      const addr2 = new Address('0:fc2ebfa6b7cbeb78157b38fb185e9c3345cb0ea9294f8eec0361c6fb786959f2');
      const expectedHash = concatAndHashFn(addr1, addr2);

      const { res } = await merkleContract.methods.concatHashFnReturnsBytes32({
        addr1,
        addr2,
      }).call();

      expect(res).to.be.equal(expectedHash.toString());
    });

    describe('MerkleTree Algorithm', async () => {
      const addr1 = new Address('0:e39b3c712a8ff98ff154de73a25bca572189d5c7c958b28600c29cd7923247a4');
      const addr2 = new Address('0:fc2ebfa6b7cbeb78157b38fb185e9c3345cb0ea9294f8eec0361c6fb786959f2');
      const notAllowedAddr = new Address('0:d2a6949bac51921b2f4d2ee3fd32e2107b0ae5f378184d9e22f24ee6cbd39e6e')
      const tree = createAllowlistMerkleTree([addr1, addr2]);
      describe('MerkleTree.JS', () => {
        const root = tree.getRoot().toString('hex');
        it('Should return verified=true with an allowed address', () => {
          const leaf = Buffer.from(getAddrHex(addr1), 'hex');
          const proof = tree.getProof(leaf);
          expect(tree.verify(proof, leaf, root)).to.be.true;
        });
        it('Should return verified=false with a NOT allowed address', () => {
          const leaf = Buffer.from(getAddrHex(notAllowedAddr), 'hex');
          const proof = tree.getProof(leaf);
          expect(tree.verify(proof, leaf, root)).to.be.false;
        });
      })
      describe('Contract', () => {
        const root = tree.getHexRoot()
        const leaf = Buffer.from(getAddrHex(addr1), 'hex');
        const proof = tree.getHexProof(leaf);
        it('Should return verified=true with an allowed address', async () => {
          const { verified } = await merkleContract.methods.verify({
            proof,
            root,
            addr: addr1,
          }).call();

          expect(verified).to.be.true;
        });
        it('Should return verified=false with a NOT allowed address', async () => {
          const { verified } = await merkleContract.methods.verify({
            proof,
            root,
            addr: notAllowedAddr,
          }).call();

          expect(verified).to.be.false;
        });
      });
    });
  });

  describe("Contracts", async function () {
    let collection: Contract<FactorySource["VenomDropCollection"]>;
    let tree: MerkleTree;
    let signers: Signer[];
    let accounts: Account[];
    // Owner
    let ownerSigner: Signer;
    let owner: Account;
    // Allowed 1
    let allowed1Signer: Signer;
    let allowed1: Account;
    // Allowed 2
    let allowed2Signer: Signer;
    let allowed2: Account;
    // Not-Allowed
    let notAllowedSigner: Signer;
    let notAllowed: Account;
    before(async () => {
      ({ signers, accounts } = await createAccounts(0, 3));
      [ownerSigner, allowed1Signer, allowed2Signer, notAllowedSigner] = signers;
      [owner, allowed1, allowed2, notAllowed] = accounts;
      collection = await deployVenomCollection(5, ownerSigner, owner.address);
      tree = createAllowlistMerkleTree([
        allowed1.address,
        allowed2.address,
      ]);
    });
    const configureCollectionWithMerkleRoot = async (root: string) => {
      await collection.methods.multiconfigure({
        options: {
          hasMaxSupply: true,
          maxSupply: 100,
          mintStages: [
            {
              name: "Mint Stage Test 1",
              startTime: 1,
              endTime: newTimestamp("2099-01-01 00:00:00"),
              price: toNano(6),
              merkleTreeRoot: root,
            },
          ],
        }
      }).send({ from: owner.address, amount: toNano(1) });
    }
    describe('Mint from a Mint Stage with Allowlist', () => {
      const expectMintFromAddress = async (
        address: Address,
        opts: {
          success: boolean,
          senderAddress?: Address,
          proofAddress?: Address,
        } = { success: true }
      ) => {
        const root = tree.getHexRoot();
        const leaf = Buffer.from(getAddrHex(opts.proofAddress || address), 'hex');
        const proof = tree.getHexProof(leaf);
        await configureCollectionWithMerkleRoot(root);
        const { traceTree } = await locklift.tracing.trace(
          collection.methods.mint({ amount: 1, proof }).send({ from: opts.senderAddress || address, amount: toNano(7) }),
          {
            allowedCodes: {
              compute: [1080],
            },
          }
        );
        if (opts.success) {
          await expect(traceTree).to.not.have.error(1080);
        } else {
          await expect(traceTree).to.have.error(1080);
        }
      }
      it('When addresses is allowed: Should mint successfully', async () => {
        await expectMintFromAddress(allowed1.address, { success: true });
        await expectMintFromAddress(allowed2.address, { success: true });
      });
      it('When address is not allowed: Should NOT mint (reverts 1080)', async () => {
        await expectMintFromAddress(notAllowed.address, { success: false });
      });
      it('When msg.sender is allowed but proof is from other address: Should NOT mint (reverts 1080)', async () => {
        await expectMintFromAddress(allowed1.address, { proofAddress: notAllowed.address, success: false });
      });
      it('When msg.sender is not allowed but uses a proof from an allowed address: Should NOT mint (reverts 1080)', async () => {
        await expectMintFromAddress(notAllowed.address, { proofAddress: allowed1.address, success: false });
      });
    });
    it("Deploy a VenomCollection by calling the deployCollection", async function () {
    });
  });
})
