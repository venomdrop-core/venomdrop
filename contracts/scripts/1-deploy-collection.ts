async function main() {
  const signer = (await locklift.keystore.getSigner("0"))!;
  const nftArtifacts = locklift.factory.getContractArtifacts("Nft");

  const { contract: collection } = await locklift.factory.deployContract({
    contract: "Collection",
    publicKey: signer.publicKey,
    initParams: {},
    constructorParams: {
      codeNft: nftArtifacts.code,
    },
    value: locklift.utils.toNano(5),
  });

  console.log(`Collection deployed at: ${collection.address.toString()}`);
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.log(e);
    process.exit(1);
  });
