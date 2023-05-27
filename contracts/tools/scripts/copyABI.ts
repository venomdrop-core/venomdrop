import fs from "fs";
import * as fsPath from "path";

const BUILD_PATH = './build';
const OUTPUT = '../webapp/src/contracts'

const getAbiFiles = (): Array<string> => {
  return fs.readdirSync(BUILD_PATH).filter(el => el.endsWith(".abi.json"));
};

const getContractAbi = (fileName: string): { abi: string; name: string } => {
  const contractAbi = fs.readFileSync(fsPath.join(BUILD_PATH, fileName), "utf8");
  const contractName = `${fileName.split(".abi.json")[0]}`;
  return {
    abi: contractAbi,
    name: contractName,
  };
};

const generateContractCode = ({
  abiSource,
  contractName,
}: {
  abiSource: string;
  contractName: string;
}): {
  abi: string;
  abiSourceName: string;
  typing: string;
  contractName: string;
} => {
  const abiSourceName = contractName.slice(0, 1).toLowerCase() + contractName.slice(1) + "Abi";

  return {
    abi: `const ${abiSourceName} = ${abiSource.replace(/\s/g, "")} as const`,
    abiSourceName,
    typing: `export type ${contractName}Abi = typeof ${abiSourceName}`,
    contractName,
  };
};

const main = () => {
  const generatedCode = getAbiFiles()
    .map(getContractAbi)
    .map(({ abi, name }) => ({
      contractName: name,
      code: generateContractCode({ abiSource: abi, contractName: name }),
    }));

    const abiSources = generatedCode.reduce((acc, { code: { abi } }) => acc + abi + "\n", "");

    const typingSources = generatedCode.reduce((acc, { code: { typing } }) => acc + typing + "\n", "");
    const factorySources = generatedCode.reduce(
      (acc, { code: { contractName, abiSourceName } }) => ({
        ...acc,
        [contractName]: abiSourceName,
      }),
      {},
    );
  
    const factorySourceObj = `export const abi = ${JSON.stringify(factorySources, null, 4).replace(
      /"/g,
      "",
    )} as const\n\nexport type ABI = typeof abi`;
  
    fs.writeFileSync(
      fsPath.join(OUTPUT, "./abi.ts"),
      abiSources + "\n" + factorySourceObj + "\n" + typingSources,
    );
}

main();
