import { NetworkValue } from "locklift";


const LOCAL_NETWORK_ENDPOINT = process.env.NETWORK_ENDPOINT || "http://localhost/graphql";

export const local: NetworkValue =  {
  connection: {
    id: 1,
    group: "localnet",
    type: "graphql",
    data: {
      endpoints: [LOCAL_NETWORK_ENDPOINT],
      latencyDetectionInterval: 1000,
      local: true,
    },
  },
  giver: {
    // Check if you need provide custom giver
    address: "0:ece57bcc6c530283becbbd8a3b24d3c5987cdddc3c8b7b33be6e4a6312490415",
    key: "172af540e43a524763dd53b26a066d472a97c4de37d5498170564510608250c3",
  },
  tracing: {
    endpoint: LOCAL_NETWORK_ENDPOINT,
  },
  keys: {
    amount: 20,
  },
};
