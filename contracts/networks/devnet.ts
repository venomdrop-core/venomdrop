import { NetworkValue } from "locklift";

const VENOM_DEVNET_ENDPOINT = process.env.VENOM_DEVNET_ENDPOINT || "https://jrpc-devnet.venom.foundation";
const VENOM_DEVNET_TRACE_ENDPOINT = process.env.VENOM_DEVNET_TRACE_ENDPOINT || 'https://gql-devnet.venom.network/graphql';
const VENOM_DEVNET_GIVER_ADDRESS = process.env.VENOM_DEVNET_GIVER_ADDRESS || '0:0000000000000000000000000000000000000000000000000000000000000000';
const VENOM_DEVNET_GIVER_PHRASE = process.env.VENOM_DEVNET_GIVER_PHRASE || '';
const VENOM_DEVNET_KEYS_PHRASE = process.env.VENOM_DEVNET_KEYS_PHRASE || '';


export const devnet: NetworkValue = {
  connection: {
    id: 1002,
    type: "jrpc",
    group: "dev",
    data: {
      endpoint: VENOM_DEVNET_ENDPOINT,
    },
  },
  giver: {
    address: VENOM_DEVNET_GIVER_ADDRESS,
    phrase: VENOM_DEVNET_GIVER_PHRASE,
    accountId: 0,
  },
  tracing: {
    endpoint: VENOM_DEVNET_TRACE_ENDPOINT,
  },
  keys: {
    phrase: VENOM_DEVNET_KEYS_PHRASE,
    amount: 20,
  },
};
