import dotenv from 'dotenv';
dotenv.config();

import { LockliftConfig } from "locklift";
import { FactorySource } from "./build/factorySource";
import { lockliftChai } from "locklift";
import chai from "chai";

// Networks
import { local } from "./networks/local";
import { devnet } from "./networks/devnet";


chai.use(lockliftChai);

declare global {
  const locklift: import("locklift").Locklift<FactorySource>;
}

const config: LockliftConfig = {
  compiler: {
    version: "0.62.0",
    externalContracts: {
      "./precompiled": ['Index', 'IndexBasis']
    }
  },
  linker: {
    version: "0.15.48",
  },
  networks: {
    local,
    devnet,
  },
  mocha: {
    timeout: 2000000,
  },
};

export default config;
