import { replaceEnvKeyValue } from "../utils/replaceEnvVar";


/**
 * Script used to to deploy a VenomDropFactory contract
 */
async function main() {
  const signer = (await locklift.keystore.getSigner("0"))!;
  const venomDropCollectionArtifacts = locklift.factory.getContractArtifacts("VenomDropCollection");
  const nftArtifacts = locklift.factory.getContractArtifacts("Nft");

  const { contract: collection } = await locklift.factory.deployContract({
    contract: "VenomDropCollectionFactory",
    publicKey: signer.publicKey,
    initParams: {
      _codeCollection: venomDropCollectionArtifacts.code,
      _codeNft: nftArtifacts.code,
    },
    constructorParams: {},
    value: locklift.utils.toNano(4),
  });

  const collectionAddress = collection.address.toString();

  console.log(`VenomDropCollectionFactory deployed at: ${collectionAddress}`);
  replaceEnvKeyValue('../webapp/.env', 'VITE_VENOMDROP_COLLECTION_FACTORY_ADDRESS', collectionAddress);
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.log(e);
    process.exit(1);
  });
