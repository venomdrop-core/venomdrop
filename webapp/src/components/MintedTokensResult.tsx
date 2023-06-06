import React, { FC, useEffect, useState } from "react";
import { Modal, ModalProps } from "./Modal";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { Address, Transaction } from "everscale-inpage-provider";
import { getShortAddress } from "../utils/getShortAddress";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { uploadCollectionFile } from "../api/collections";
import { useCollectionContract } from "../hooks/useCollectionContract";
import { useVenomWallet } from "../hooks/useVenomWallet";
import { usePreRevealInfo } from "../hooks/usePreRevealInfo";
import { Spinner } from "./Spinner";
import { getTransactionUrl, getAddressUrl } from '../utils/venomscan';

export interface NftCreatedEvent {
  event: string
  data: NftCreatedEventData
  transaction: Transaction
}

export interface NftCreatedEventData {
  id: string
  nftAddress: Address
  owner: Address
}


export interface MintProcess {
  count: number;
  minted: number;
  events: NftCreatedEvent[];
}

export interface MintedTokensResultProps extends ModalProps {
  mintProcess: MintProcess | null
}

// const mintProcess = {
//   count: 3,
//   minted: 6,
//   events: [
//     {
//       event: "NftCreated",
//       data: {
//         id: "24",
//         nft: "0:97a02be75b88a0f9385e713afc989832c23ebc9f8892d6c81bf0696acf45b903",
//         owner: "0:e39b3c712a8ff98ff154de73a25bca572189d5c7c958b28600c29cd7923247a4",
//         manager: "0:e18f1213519953f077ce1e4b28f1fe7cedabf75a4ed08ccd8babf07e11171831",
//         creator: "0:e18f1213519953f077ce1e4b28f1fe7cedabf75a4ed08ccd8babf07e11171831"
//       },
//       transaction: {
//         id: {
//           lt: "1105671000013",
//           hash: "3877e95e6414c32d29c956bb6bcd8b08eea60f71ae4e5659124ddd8971793d19"
//         },
//         prevTransactionId: {
//           lt: "1105671000009",
//           hash: "845241f667f2b01974cf1e166f15bc1bda35557c92899aa4817503f30b626ecc"
//         },
//         createdAt: 1686085668,
//         aborted: false,
//         exitCode: 0,
//         resultCode: 0,
//         origStatus: "active",
//         endStatus: "active",
//         totalFees: "6662500",
//         inMessage: {
//           hash: "f9d70ebcdf8e6b993244cf4b72b7ecdb07e53864bf393f3c9146f7171419f915",
//           src: "0:e18f1213519953f077ce1e4b28f1fe7cedabf75a4ed08ccd8babf07e11171831",
//           dst: "0:e18f1213519953f077ce1e4b28f1fe7cedabf75a4ed08ccd8babf07e11171831",
//           value: "2219692300",
//           bounce: true,
//           bounced: false,
//           body: "te6ccgEBAQEAMAAAWzg4OqOAHHNnjiVR/zH+KpvOdEt5SuQxOrj5KxZQwBhTmvJGSPSAAAAAYAAAAFA=",
//           bodyHash: "11e1bd8146fa1c005f05e76bc77d33a1e5f59491b57024c631df6d66d2c6eae7"
//         },
//         outMessages: [
//           {
//             hash: "70cd61de91398e1be339c137654ae314d672db88dd166b255cf2de1a845a99ac",
//             src: "0:e18f1213519953f077ce1e4b28f1fe7cedabf75a4ed08ccd8babf07e11171831",
//             dst: "0:97a02be75b88a0f9385e713afc989832c23ebc9f8892d6c81bf0696acf45b903",
//             value: "397368900",
//             bounce: true,
//             bounced: false,
//             body: "te6ccgECBQEAAToAAUtLQubBgBwx4kJqMyp+DvnDyWUeP8+dtX7rSdoRmbF1fg/CIuMGMAEBQ4Acc2eOJVH/Mf4qm850S3lK5DE6uPkrFlDAGFOa8kZI9JACAWOAHHNnjiVR/zH+KpvOdEt5SuQxOrj5KxZQwBhTmvJGSPSAAAAAAAAAAAAAAAACPDRgEAMB/nsidHlwZSI6IkJhc2ljIE5GVCIsIm5hbWUiOiJWZW5vbURyb3AgVW5yZXZlYWxlZCBORlQiLCJwcmV2aWV3Ijp7InNvdXJjZSI6Imh0dHBzOi8vdmVub21kcm9wLWRldm5ldC5zMy5hbWF6b25hd3MuY29tL2RlZmF1bHRzL3YEAGZlbm9tZHJvcC1wcmUtcmV2ZWFsLmpwZWciLCJtaW1ldHlwZSI6ImltYWdlL2pwZWcifX0=",
//             bodyHash: "4539b28bdfd2f2ece1ac1ba8848d9ddb0e9a0fd43b82cccacdbdf0cdd05cc168"
//           },
//           {
//             hash: "4c57e11eba85e0dce7d248eac37edc1bbf8ac0941ba0d6198ffc69d8d5121c2b",
//             src: "0:e18f1213519953f077ce1e4b28f1fe7cedabf75a4ed08ccd8babf07e11171831",
//             value: "0",
//             bounce: false,
//             bounced: false,
//             body: "te6ccgEBBAEAtwABiwEOXbcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGIAS9AV863EUHycLzidfkxMGWEfXk/ESWtkDfg0tWei3IHABAUOAHHNnjiVR/zH+KpvOdEt5SuQxOrj5KxZQwBhTmvJGSPSQAgFDgBwx4kJqMyp+DvnDyWUeP8+dtX7rSdoRmbF1fg/CIuMGMAMAQ4AcMeJCajMqfg75w8llHj/PnbV+60naEZmxdX4PwiLjBjA=",
//             bodyHash: "b41a4c1874ccab81613dbf060397ffcb489ff5e44e6188cc4903f58117cc852c"
//           },
//           {
//             hash: "a1b488d73c2acd7d5069186a6f648b589798fd1201707d6afd81de22f0824ab3",
//             src: "0:e18f1213519953f077ce1e4b28f1fe7cedabf75a4ed08ccd8babf07e11171831",
//             dst: "0:e39b3c712a8ff98ff154de73a25bca572189d5c7c958b28600c29cd7923247a4",
//             value: "1815660900",
//             bounce: false,
//             bounced: false
//           }
//         ]
//       }
//     },
//     {
//       event: "NftCreated",
//       data: {
//         id: "24",
//         nft: "0:97a02be75b88a0f9385e713afc989832c23ebc9f8892d6c81bf0696acf45b903",
//         owner: "0:e39b3c712a8ff98ff154de73a25bca572189d5c7c958b28600c29cd7923247a4",
//         manager: "0:e18f1213519953f077ce1e4b28f1fe7cedabf75a4ed08ccd8babf07e11171831",
//         creator: "0:e18f1213519953f077ce1e4b28f1fe7cedabf75a4ed08ccd8babf07e11171831"
//       },
//       transaction: {
//         id: {
//           lt: "1105671000013",
//           hash: "3877e95e6414c32d29c956bb6bcd8b08eea60f71ae4e5659124ddd8971793d19"
//         },
//         prevTransactionId: {
//           lt: "1105671000009",
//           hash: "845241f667f2b01974cf1e166f15bc1bda35557c92899aa4817503f30b626ecc"
//         },
//         createdAt: 1686085668,
//         aborted: false,
//         exitCode: 0,
//         resultCode: 0,
//         origStatus: "active",
//         endStatus: "active",
//         totalFees: "6662500",
//         inMessage: {
//           hash: "f9d70ebcdf8e6b993244cf4b72b7ecdb07e53864bf393f3c9146f7171419f915",
//           src: "0:e18f1213519953f077ce1e4b28f1fe7cedabf75a4ed08ccd8babf07e11171831",
//           dst: "0:e18f1213519953f077ce1e4b28f1fe7cedabf75a4ed08ccd8babf07e11171831",
//           value: "2219692300",
//           bounce: true,
//           bounced: false,
//           body: "te6ccgEBAQEAMAAAWzg4OqOAHHNnjiVR/zH+KpvOdEt5SuQxOrj5KxZQwBhTmvJGSPSAAAAAYAAAAFA=",
//           bodyHash: "11e1bd8146fa1c005f05e76bc77d33a1e5f59491b57024c631df6d66d2c6eae7"
//         },
//         outMessages: [
//           {
//             hash: "70cd61de91398e1be339c137654ae314d672db88dd166b255cf2de1a845a99ac",
//             src: "0:e18f1213519953f077ce1e4b28f1fe7cedabf75a4ed08ccd8babf07e11171831",
//             dst: "0:97a02be75b88a0f9385e713afc989832c23ebc9f8892d6c81bf0696acf45b903",
//             value: "397368900",
//             bounce: true,
//             bounced: false,
//             body: "te6ccgECBQEAAToAAUtLQubBgBwx4kJqMyp+DvnDyWUeP8+dtX7rSdoRmbF1fg/CIuMGMAEBQ4Acc2eOJVH/Mf4qm850S3lK5DE6uPkrFlDAGFOa8kZI9JACAWOAHHNnjiVR/zH+KpvOdEt5SuQxOrj5KxZQwBhTmvJGSPSAAAAAAAAAAAAAAAACPDRgEAMB/nsidHlwZSI6IkJhc2ljIE5GVCIsIm5hbWUiOiJWZW5vbURyb3AgVW5yZXZlYWxlZCBORlQiLCJwcmV2aWV3Ijp7InNvdXJjZSI6Imh0dHBzOi8vdmVub21kcm9wLWRldm5ldC5zMy5hbWF6b25hd3MuY29tL2RlZmF1bHRzL3YEAGZlbm9tZHJvcC1wcmUtcmV2ZWFsLmpwZWciLCJtaW1ldHlwZSI6ImltYWdlL2pwZWcifX0=",
//             bodyHash: "4539b28bdfd2f2ece1ac1ba8848d9ddb0e9a0fd43b82cccacdbdf0cdd05cc168"
//           },
//           {
//             hash: "4c57e11eba85e0dce7d248eac37edc1bbf8ac0941ba0d6198ffc69d8d5121c2b",
//             src: "0:e18f1213519953f077ce1e4b28f1fe7cedabf75a4ed08ccd8babf07e11171831",
//             value: "0",
//             bounce: false,
//             bounced: false,
//             body: "te6ccgEBBAEAtwABiwEOXbcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGIAS9AV863EUHycLzidfkxMGWEfXk/ESWtkDfg0tWei3IHABAUOAHHNnjiVR/zH+KpvOdEt5SuQxOrj5KxZQwBhTmvJGSPSQAgFDgBwx4kJqMyp+DvnDyWUeP8+dtX7rSdoRmbF1fg/CIuMGMAMAQ4AcMeJCajMqfg75w8llHj/PnbV+60naEZmxdX4PwiLjBjA=",
//             bodyHash: "b41a4c1874ccab81613dbf060397ffcb489ff5e44e6188cc4903f58117cc852c"
//           },
//           {
//             hash: "a1b488d73c2acd7d5069186a6f648b589798fd1201707d6afd81de22f0824ab3",
//             src: "0:e18f1213519953f077ce1e4b28f1fe7cedabf75a4ed08ccd8babf07e11171831",
//             dst: "0:e39b3c712a8ff98ff154de73a25bca572189d5c7c958b28600c29cd7923247a4",
//             value: "1815660900",
//             bounce: false,
//             bounced: false
//           }
//         ]
//       }
//     },
//     {
//       event: "NftCreated",
//       data: {
//         id: "23",
//         nft: "0:06a64dfb24a745de02fdce5bf27585178b5c1f52b79e4c8d0772391cc30077e1",
//         owner: "0:e39b3c712a8ff98ff154de73a25bca572189d5c7c958b28600c29cd7923247a4",
//         manager: "0:e18f1213519953f077ce1e4b28f1fe7cedabf75a4ed08ccd8babf07e11171831",
//         creator: "0:e18f1213519953f077ce1e4b28f1fe7cedabf75a4ed08ccd8babf07e11171831"
//       },
//       transaction: {
//         id: {
//           lt: "1105671000009",
//           hash: "845241f667f2b01974cf1e166f15bc1bda35557c92899aa4817503f30b626ecc"
//         },
//         prevTransactionId: {
//           lt: "1105671000005",
//           hash: "607a828620fc50cb130fb4ffc0d3b34ada78e128fe2117952df27e82a874c439"
//         },
//         createdAt: 1686085668,
//         aborted: false,
//         exitCode: 0,
//         resultCode: 0,
//         origStatus: "active",
//         endStatus: "active",
//         totalFees: "6778600",
//         inMessage: {
//           hash: "bd60bace9bc60d2e57a70883ef3fe46cfb0892a42e8ed0a4096812ad1b6486a7",
//           src: "0:e18f1213519953f077ce1e4b28f1fe7cedabf75a4ed08ccd8babf07e11171831",
//           dst: "0:e18f1213519953f077ce1e4b28f1fe7cedabf75a4ed08ccd8babf07e11171831",
//           value: "2623839800",
//           bounce: true,
//           bounced: false,
//           body: "te6ccgEBAQEAMAAAWzg4OqOAHHNnjiVR/zH+KpvOdEt5SuQxOrj5KxZQwBhTmvJGSPSAAAAAYAAAADA=",
//           bodyHash: "315ee9e90c7e092c3ffe711a4a58591a30b505c9bbdc9324ac70f7f42fce4a8d"
//         },
//         outMessages: [
//           {
//             hash: "69ddce9091c6d75dc0790888180dbae961fcadd20d0578b4bee20a3857ee17e2",
//             src: "0:e18f1213519953f077ce1e4b28f1fe7cedabf75a4ed08ccd8babf07e11171831",
//             dst: "0:06a64dfb24a745de02fdce5bf27585178b5c1f52b79e4c8d0772391cc30077e1",
//             value: "397368900",
//             bounce: true,
//             bounced: false,
//             body: "te6ccgECBQEAAToAAUtLQubBgBwx4kJqMyp+DvnDyWUeP8+dtX7rSdoRmbF1fg/CIuMGMAEBQ4Acc2eOJVH/Mf4qm850S3lK5DE6uPkrFlDAGFOa8kZI9JACAWOAHHNnjiVR/zH+KpvOdEt5SuQxOrj5KxZQwBhTmvJGSPSAAAAAAAAAAAAAAAACPDRgEAMB/nsidHlwZSI6IkJhc2ljIE5GVCIsIm5hbWUiOiJWZW5vbURyb3AgVW5yZXZlYWxlZCBORlQiLCJwcmV2aWV3Ijp7InNvdXJjZSI6Imh0dHBzOi8vdmVub21kcm9wLWRldm5ldC5zMy5hbWF6b25hd3MuY29tL2RlZmF1bHRzL3YEAGZlbm9tZHJvcC1wcmUtcmV2ZWFsLmpwZWciLCJtaW1ldHlwZSI6ImltYWdlL2pwZWcifX0=",
//             bodyHash: "4539b28bdfd2f2ece1ac1ba8848d9ddb0e9a0fd43b82cccacdbdf0cdd05cc168"
//           },
//           {
//             hash: "30214ae8ddd6760868a83e33d76d1bf0b35c3bdfd9c8d53fa21f3ee3c20bb6f0",
//             src: "0:e18f1213519953f077ce1e4b28f1fe7cedabf75a4ed08ccd8babf07e11171831",
//             value: "0",
//             bounce: false,
//             bounced: false,
//             body: "te6ccgEBBAEAtwABiwEOXbcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAF4AA1Mm/ZJTou8Bfuct+TrCi8WuD6lbzyZGg7kcjmGAO/DABAUOAHHNnjiVR/zH+KpvOdEt5SuQxOrj5KxZQwBhTmvJGSPSQAgFDgBwx4kJqMyp+DvnDyWUeP8+dtX7rSdoRmbF1fg/CIuMGMAMAQ4AcMeJCajMqfg75w8llHj/PnbV+60naEZmxdX4PwiLjBjA=",
//             bodyHash: "a628f430b3e4dd0bd5e11e5b17dcd543599f81226cb565299d24b85ac3af8328"
//           },
//           {
//             hash: "f9d70ebcdf8e6b993244cf4b72b7ecdb07e53864bf393f3c9146f7171419f915",
//             src: "0:e18f1213519953f077ce1e4b28f1fe7cedabf75a4ed08ccd8babf07e11171831",
//             dst: "0:e18f1213519953f077ce1e4b28f1fe7cedabf75a4ed08ccd8babf07e11171831",
//             value: "2219692300",
//             bounce: true,
//             bounced: false,
//             body: "te6ccgEBAQEAMAAAWzg4OqOAHHNnjiVR/zH+KpvOdEt5SuQxOrj5KxZQwBhTmvJGSPSAAAAAYAAAAFA=",
//             bodyHash: "11e1bd8146fa1c005f05e76bc77d33a1e5f59491b57024c631df6d66d2c6eae7"
//           }
//         ]
//       }
//     },
//     {
//       event: "NftCreated",
//       data: {
//         id: "23",
//         nft: "0:06a64dfb24a745de02fdce5bf27585178b5c1f52b79e4c8d0772391cc30077e1",
//         owner: "0:e39b3c712a8ff98ff154de73a25bca572189d5c7c958b28600c29cd7923247a4",
//         manager: "0:e18f1213519953f077ce1e4b28f1fe7cedabf75a4ed08ccd8babf07e11171831",
//         creator: "0:e18f1213519953f077ce1e4b28f1fe7cedabf75a4ed08ccd8babf07e11171831"
//       },
//       transaction: {
//         id: {
//           lt: "1105671000009",
//           hash: "845241f667f2b01974cf1e166f15bc1bda35557c92899aa4817503f30b626ecc"
//         },
//         prevTransactionId: {
//           lt: "1105671000005",
//           hash: "607a828620fc50cb130fb4ffc0d3b34ada78e128fe2117952df27e82a874c439"
//         },
//         createdAt: 1686085668,
//         aborted: false,
//         exitCode: 0,
//         resultCode: 0,
//         origStatus: "active",
//         endStatus: "active",
//         totalFees: "6778600",
//         inMessage: {
//           hash: "bd60bace9bc60d2e57a70883ef3fe46cfb0892a42e8ed0a4096812ad1b6486a7",
//           src: "0:e18f1213519953f077ce1e4b28f1fe7cedabf75a4ed08ccd8babf07e11171831",
//           dst: "0:e18f1213519953f077ce1e4b28f1fe7cedabf75a4ed08ccd8babf07e11171831",
//           value: "2623839800",
//           bounce: true,
//           bounced: false,
//           body: "te6ccgEBAQEAMAAAWzg4OqOAHHNnjiVR/zH+KpvOdEt5SuQxOrj5KxZQwBhTmvJGSPSAAAAAYAAAADA=",
//           bodyHash: "315ee9e90c7e092c3ffe711a4a58591a30b505c9bbdc9324ac70f7f42fce4a8d"
//         },
//         outMessages: [
//           {
//             hash: "69ddce9091c6d75dc0790888180dbae961fcadd20d0578b4bee20a3857ee17e2",
//             src: "0:e18f1213519953f077ce1e4b28f1fe7cedabf75a4ed08ccd8babf07e11171831",
//             dst: "0:06a64dfb24a745de02fdce5bf27585178b5c1f52b79e4c8d0772391cc30077e1",
//             value: "397368900",
//             bounce: true,
//             bounced: false,
//             body: "te6ccgECBQEAAToAAUtLQubBgBwx4kJqMyp+DvnDyWUeP8+dtX7rSdoRmbF1fg/CIuMGMAEBQ4Acc2eOJVH/Mf4qm850S3lK5DE6uPkrFlDAGFOa8kZI9JACAWOAHHNnjiVR/zH+KpvOdEt5SuQxOrj5KxZQwBhTmvJGSPSAAAAAAAAAAAAAAAACPDRgEAMB/nsidHlwZSI6IkJhc2ljIE5GVCIsIm5hbWUiOiJWZW5vbURyb3AgVW5yZXZlYWxlZCBORlQiLCJwcmV2aWV3Ijp7InNvdXJjZSI6Imh0dHBzOi8vdmVub21kcm9wLWRldm5ldC5zMy5hbWF6b25hd3MuY29tL2RlZmF1bHRzL3YEAGZlbm9tZHJvcC1wcmUtcmV2ZWFsLmpwZWciLCJtaW1ldHlwZSI6ImltYWdlL2pwZWcifX0=",
//             bodyHash: "4539b28bdfd2f2ece1ac1ba8848d9ddb0e9a0fd43b82cccacdbdf0cdd05cc168"
//           },
//           {
//             hash: "30214ae8ddd6760868a83e33d76d1bf0b35c3bdfd9c8d53fa21f3ee3c20bb6f0",
//             src: "0:e18f1213519953f077ce1e4b28f1fe7cedabf75a4ed08ccd8babf07e11171831",
//             value: "0",
//             bounce: false,
//             bounced: false,
//             body: "te6ccgEBBAEAtwABiwEOXbcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAF4AA1Mm/ZJTou8Bfuct+TrCi8WuD6lbzyZGg7kcjmGAO/DABAUOAHHNnjiVR/zH+KpvOdEt5SuQxOrj5KxZQwBhTmvJGSPSQAgFDgBwx4kJqMyp+DvnDyWUeP8+dtX7rSdoRmbF1fg/CIuMGMAMAQ4AcMeJCajMqfg75w8llHj/PnbV+60naEZmxdX4PwiLjBjA=",
//             bodyHash: "a628f430b3e4dd0bd5e11e5b17dcd543599f81226cb565299d24b85ac3af8328"
//           },
//           {
//             hash: "f9d70ebcdf8e6b993244cf4b72b7ecdb07e53864bf393f3c9146f7171419f915",
//             src: "0:e18f1213519953f077ce1e4b28f1fe7cedabf75a4ed08ccd8babf07e11171831",
//             dst: "0:e18f1213519953f077ce1e4b28f1fe7cedabf75a4ed08ccd8babf07e11171831",
//             value: "2219692300",
//             bounce: true,
//             bounced: false,
//             body: "te6ccgEBAQEAMAAAWzg4OqOAHHNnjiVR/zH+KpvOdEt5SuQxOrj5KxZQwBhTmvJGSPSAAAAAYAAAAFA=",
//             bodyHash: "11e1bd8146fa1c005f05e76bc77d33a1e5f59491b57024c631df6d66d2c6eae7"
//           }
//         ]
//       }
//     },
//     {
//       event: "NftCreated",
//       data: {
//         id: "22",
//         nft: "0:c7c6ea94aa8c88c17a0cc0e4057ff9f8abe52fabcf9ff21ff56b0dcc86013d41",
//         owner: "0:e39b3c712a8ff98ff154de73a25bca572189d5c7c958b28600c29cd7923247a4",
//         manager: "0:e18f1213519953f077ce1e4b28f1fe7cedabf75a4ed08ccd8babf07e11171831",
//         creator: "0:e18f1213519953f077ce1e4b28f1fe7cedabf75a4ed08ccd8babf07e11171831"
//       },
//       transaction: {
//         id: {
//           lt: "1105671000005",
//           hash: "607a828620fc50cb130fb4ffc0d3b34ada78e128fe2117952df27e82a874c439"
//         },
//         prevTransactionId: {
//           lt: "1105671000003",
//           hash: "89c15e95b8aade17e5dedf8905c919b467109a351f2f3ff7230f9cc53e4a4380"
//         },
//         createdAt: 1686085668,
//         aborted: false,
//         exitCode: 0,
//         resultCode: 0,
//         origStatus: "active",
//         endStatus: "active",
//         totalFees: "6778600",
//         inMessage: {
//           hash: "2d907b0d3cfb3f643ec32fb1d152b91552454ca93f9090bab0a525d24e93e88e",
//           src: "0:e18f1213519953f077ce1e4b28f1fe7cedabf75a4ed08ccd8babf07e11171831",
//           dst: "0:e18f1213519953f077ce1e4b28f1fe7cedabf75a4ed08ccd8babf07e11171831",
//           value: "3027987300",
//           bounce: true,
//           bounced: false,
//           body: "te6ccgEBAQEAMAAAWzg4OqOAHHNnjiVR/zH+KpvOdEt5SuQxOrj5KxZQwBhTmvJGSPSAAAAAYAAAABA=",
//           bodyHash: "44d7863e7bf1b28f7a9b24588c3c0789d5fa4dfd64c7e5b46f14bc39e784ef0d"
//         },
//         outMessages: [
//           {
//             hash: "5ee16e4d5b83a2b8e655f8af6bd9a1fe889172c63f29a3c5d92c047d9119a08c",
//             src: "0:e18f1213519953f077ce1e4b28f1fe7cedabf75a4ed08ccd8babf07e11171831",
//             dst: "0:c7c6ea94aa8c88c17a0cc0e4057ff9f8abe52fabcf9ff21ff56b0dcc86013d41",
//             value: "397368900",
//             bounce: true,
//             bounced: false,
//             body: "te6ccgECBQEAAToAAUtLQubBgBwx4kJqMyp+DvnDyWUeP8+dtX7rSdoRmbF1fg/CIuMGMAEBQ4Acc2eOJVH/Mf4qm850S3lK5DE6uPkrFlDAGFOa8kZI9JACAWOAHHNnjiVR/zH+KpvOdEt5SuQxOrj5KxZQwBhTmvJGSPSAAAAAAAAAAAAAAAACPDRgEAMB/nsidHlwZSI6IkJhc2ljIE5GVCIsIm5hbWUiOiJWZW5vbURyb3AgVW5yZXZlYWxlZCBORlQiLCJwcmV2aWV3Ijp7InNvdXJjZSI6Imh0dHBzOi8vdmVub21kcm9wLWRldm5ldC5zMy5hbWF6b25hd3MuY29tL2RlZmF1bHRzL3YEAGZlbm9tZHJvcC1wcmUtcmV2ZWFsLmpwZWciLCJtaW1ldHlwZSI6ImltYWdlL2pwZWcifX0=",
//             bodyHash: "4539b28bdfd2f2ece1ac1ba8848d9ddb0e9a0fd43b82cccacdbdf0cdd05cc168"
//           },
//           {
//             hash: "ff7202a05dc57de5bdc2666b72580f07fab392a689c54a402e4b7f5ca52ef355",
//             src: "0:e18f1213519953f077ce1e4b28f1fe7cedabf75a4ed08ccd8babf07e11171831",
//             value: "0",
//             bounce: false,
//             bounced: false,
//             body: "te6ccgEBBAEAtwABiwEOXbcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFoAY+N1SlVGRGC9BmByAr/8/FXyl9Xnz/kP+rWG5kMAnqDABAUOAHHNnjiVR/zH+KpvOdEt5SuQxOrj5KxZQwBhTmvJGSPSQAgFDgBwx4kJqMyp+DvnDyWUeP8+dtX7rSdoRmbF1fg/CIuMGMAMAQ4AcMeJCajMqfg75w8llHj/PnbV+60naEZmxdX4PwiLjBjA=",
//             bodyHash: "7ea3b77f741907b628a6c3ef5493b2a41952ce10b9caca0f76a9496ee2352c68"
//           },
//           {
//             hash: "bd60bace9bc60d2e57a70883ef3fe46cfb0892a42e8ed0a4096812ad1b6486a7",
//             src: "0:e18f1213519953f077ce1e4b28f1fe7cedabf75a4ed08ccd8babf07e11171831",
//             dst: "0:e18f1213519953f077ce1e4b28f1fe7cedabf75a4ed08ccd8babf07e11171831",
//             value: "2623839800",
//             bounce: true,
//             bounced: false,
//             body: "te6ccgEBAQEAMAAAWzg4OqOAHHNnjiVR/zH+KpvOdEt5SuQxOrj5KxZQwBhTmvJGSPSAAAAAYAAAADA=",
//             bodyHash: "315ee9e90c7e092c3ffe711a4a58591a30b505c9bbdc9324ac70f7f42fce4a8d"
//           }
//         ]
//       }
//     },
//     {
//       event: "NftCreated",
//       data: {
//         id: "22",
//         nft: "0:c7c6ea94aa8c88c17a0cc0e4057ff9f8abe52fabcf9ff21ff56b0dcc86013d41",
//         owner: "0:e39b3c712a8ff98ff154de73a25bca572189d5c7c958b28600c29cd7923247a4",
//         manager: "0:e18f1213519953f077ce1e4b28f1fe7cedabf75a4ed08ccd8babf07e11171831",
//         creator: "0:e18f1213519953f077ce1e4b28f1fe7cedabf75a4ed08ccd8babf07e11171831"
//       },
//       transaction: {
//         id: {
//           lt: "1105671000005",
//           hash: "607a828620fc50cb130fb4ffc0d3b34ada78e128fe2117952df27e82a874c439"
//         },
//         prevTransactionId: {
//           lt: "1105671000003",
//           hash: "89c15e95b8aade17e5dedf8905c919b467109a351f2f3ff7230f9cc53e4a4380"
//         },
//         createdAt: 1686085668,
//         aborted: false,
//         exitCode: 0,
//         resultCode: 0,
//         origStatus: "active",
//         endStatus: "active",
//         totalFees: "6778600",
//         inMessage: {
//           hash: "2d907b0d3cfb3f643ec32fb1d152b91552454ca93f9090bab0a525d24e93e88e",
//           src: "0:e18f1213519953f077ce1e4b28f1fe7cedabf75a4ed08ccd8babf07e11171831",
//           dst: "0:e18f1213519953f077ce1e4b28f1fe7cedabf75a4ed08ccd8babf07e11171831",
//           value: "3027987300",
//           bounce: true,
//           bounced: false,
//           body: "te6ccgEBAQEAMAAAWzg4OqOAHHNnjiVR/zH+KpvOdEt5SuQxOrj5KxZQwBhTmvJGSPSAAAAAYAAAABA=",
//           bodyHash: "44d7863e7bf1b28f7a9b24588c3c0789d5fa4dfd64c7e5b46f14bc39e784ef0d"
//         },
//         outMessages: [
//           {
//             hash: "5ee16e4d5b83a2b8e655f8af6bd9a1fe889172c63f29a3c5d92c047d9119a08c",
//             src: "0:e18f1213519953f077ce1e4b28f1fe7cedabf75a4ed08ccd8babf07e11171831",
//             dst: "0:c7c6ea94aa8c88c17a0cc0e4057ff9f8abe52fabcf9ff21ff56b0dcc86013d41",
//             value: "397368900",
//             bounce: true,
//             bounced: false,
//             body: "te6ccgECBQEAAToAAUtLQubBgBwx4kJqMyp+DvnDyWUeP8+dtX7rSdoRmbF1fg/CIuMGMAEBQ4Acc2eOJVH/Mf4qm850S3lK5DE6uPkrFlDAGFOa8kZI9JACAWOAHHNnjiVR/zH+KpvOdEt5SuQxOrj5KxZQwBhTmvJGSPSAAAAAAAAAAAAAAAACPDRgEAMB/nsidHlwZSI6IkJhc2ljIE5GVCIsIm5hbWUiOiJWZW5vbURyb3AgVW5yZXZlYWxlZCBORlQiLCJwcmV2aWV3Ijp7InNvdXJjZSI6Imh0dHBzOi8vdmVub21kcm9wLWRldm5ldC5zMy5hbWF6b25hd3MuY29tL2RlZmF1bHRzL3YEAGZlbm9tZHJvcC1wcmUtcmV2ZWFsLmpwZWciLCJtaW1ldHlwZSI6ImltYWdlL2pwZWcifX0=",
//             bodyHash: "4539b28bdfd2f2ece1ac1ba8848d9ddb0e9a0fd43b82cccacdbdf0cdd05cc168"
//           },
//           {
//             hash: "ff7202a05dc57de5bdc2666b72580f07fab392a689c54a402e4b7f5ca52ef355",
//             src: "0:e18f1213519953f077ce1e4b28f1fe7cedabf75a4ed08ccd8babf07e11171831",
//             value: "0",
//             bounce: false,
//             bounced: false,
//             body: "te6ccgEBBAEAtwABiwEOXbcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFoAY+N1SlVGRGC9BmByAr/8/FXyl9Xnz/kP+rWG5kMAnqDABAUOAHHNnjiVR/zH+KpvOdEt5SuQxOrj5KxZQwBhTmvJGSPSQAgFDgBwx4kJqMyp+DvnDyWUeP8+dtX7rSdoRmbF1fg/CIuMGMAMAQ4AcMeJCajMqfg75w8llHj/PnbV+60naEZmxdX4PwiLjBjA=",
//             bodyHash: "7ea3b77f741907b628a6c3ef5493b2a41952ce10b9caca0f76a9496ee2352c68"
//           },
//           {
//             hash: "bd60bace9bc60d2e57a70883ef3fe46cfb0892a42e8ed0a4096812ad1b6486a7",
//             src: "0:e18f1213519953f077ce1e4b28f1fe7cedabf75a4ed08ccd8babf07e11171831",
//             dst: "0:e18f1213519953f077ce1e4b28f1fe7cedabf75a4ed08ccd8babf07e11171831",
//             value: "2623839800",
//             bounce: true,
//             bounced: false,
//             body: "te6ccgEBAQEAMAAAWzg4OqOAHHNnjiVR/zH+KpvOdEt5SuQxOrj5KxZQwBhTmvJGSPSAAAAAYAAAADA=",
//             bodyHash: "315ee9e90c7e092c3ffe711a4a58591a30b505c9bbdc9324ac70f7f42fce4a8d"
//           }
//         ]
//       }
//     }
//   ]
// };


export const MintedTokensResult: FC<MintedTokensResultProps> = ({  mintProcess, ...props }) => {
  const { slug } = useParams();
  const { name, imageSrc } = usePreRevealInfo(slug);
  const finished = mintProcess && mintProcess.minted >= mintProcess.count ;
  if (!mintProcess) {
    return null;
  }
  return (
    <Modal open={props.open} setOpen={props.setOpen}>
      <div className="w-full p-2">
        <div className="p-4 border-b border-slate-900">
          <h2 className="text-2xl">
            {finished ? (
              <>
                Minted {mintProcess.minted} token{mintProcess.minted > 1 ? 's': ''}
              </>
            ): (
              <div className="flex items-center">
                {mintProcess.events.length > 0 && (
                  <Spinner />
                )}
                <div className="ml-2">
                  Minting {mintProcess.minted} of {mintProcess.count}..
                </div>
              </div>
            )}
          </h2>
        </div>
        {mintProcess.events.length === 0 && (
          <div className="flex items-center justify-center p-8">
            <Spinner />
          </div>
        )}
        {mintProcess?.events.map(mintEvent => (
          <div className="grid grid-cols-3 p-4">
            <div className="flex items-center space-x-3 col-span-2">
              <div className="avatar">
                <div className="w-12 h-12">
                  <img
                    src={imageSrc}
                  />
                </div>
              </div>
              <div>
                <div className="text-sm opacity-50">Token ID: {mintEvent.data.id}</div>
                <div className="font-bold text-sm">{name}</div>
              </div>
            </div>
            <div className="flex justify-end items-center">
              <a href={getAddressUrl(mintEvent?.data?.nftAddress.toString())} target="_blank" className="flex items-center text-primary-focus text-sm">
                {getShortAddress(mintEvent?.data?.nftAddress.toString())}
                <ArrowTopRightOnSquareIcon className="w-4 h-4 ml-2" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};
