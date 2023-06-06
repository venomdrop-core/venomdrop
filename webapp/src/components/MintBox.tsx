import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { FC, useEffect, useMemo, useState } from "react";
import { MintStage } from "../types/mintStage";
import { fromNano } from "../utils/fromNano";
import { formatDate } from "../utils/dates";
import { useCollectionContract } from "../hooks/useCollectionContract";
import { useParams } from "react-router-dom";
import { useVenomWallet } from "../hooks/useVenomWallet";
import { toNano } from "../utils/toNano";
import { useQuery } from "@tanstack/react-query";
import { getMintProof } from "../api/collections";
import { MintProcess, MintedTokensResult } from "./MintedTokensResult";

// TODO: Increase it in case of error 37
const MINT_NFT_VALUE = toNano("1");

export interface MintBoxProps {
  mintStages: MintStage[];
  currentMintStage?: MintStage | null;
  info?: {
    hasMaxSupply: boolean;
    maxSupply: string;
    totalSupply: string;
  };
}

export const MintBox: FC<MintBoxProps> = ({
  currentMintStage,
  mintStages,
  info,
}) => {
  const { slug } = useParams();
  const contract = useCollectionContract(slug);
  const { accountInteraction, venomProvider } = useVenomWallet();
  const { data: mintProofRes } = useQuery({
    queryKey: [slug, accountInteraction?.address],
    queryFn: () =>
      getMintProof(slug || "", accountInteraction?.address?.toString() || ""),
    enabled: !!accountInteraction?.address && !!slug,
  });
  const [count, setCount] = useState(1);
  const [currentMintProcess, setCurrentMintProcess] =
    useState<MintProcess | null>(null);

  const increment = () => setCount((x) => x + 1);
  const decrement = () => setCount((x) => (x > 1 ? x - 1 : 1));

  const nextMintStage = useMemo(() => {
    const now = new Date();
    const nextMingStage = mintStages.findLast((ms) => ms.startTime > now);
    return nextMingStage;
  }, [mintStages]);

  useEffect(() => {
    if (venomProvider && contract && accountInteraction) {
      const sub = new venomProvider.Subscriber();
      const events = contract.events(sub);
      events.on((event) => {
        console.log({ event });
        if (
          event.event === "VenomDropNftMinted" &&
          event.data.owner.equals(accountInteraction.address)
        ) {
          setCurrentMintProcess((currentMintProcess) => ({
            txn: currentMintProcess?.txn,
            count: currentMintProcess?.count || count,
            minted: (currentMintProcess?.minted || 0) + 1,
            events: [...(currentMintProcess?.events || []), event],
          }));
        }
      });
    }
  }, [contract, venomProvider, accountInteraction]);

  const mint = () => {
    return new Promise((resolve, reject) => {
      if (
        !accountInteraction ||
        !currentMintStage ||
        !venomProvider ||
        !contract
      ) {
        return;
      }
      const amountTotal =
        (parseInt(MINT_NFT_VALUE) + parseInt(currentMintStage.price)) * count;

      // const sub = new venomProvider.Subscriber();
      // const events = contract.events(sub);
      // // const mintedTokenEvents: NftCreatedEvent[] = [];
      setCurrentMintProcess({
        count,
        minted: 0,
        events: [],
      });
      // events.on((event) => {
      //   if (
      //     event.event === "NftCreated" &&
      //     event.data.owner.equals(accountInteraction.address)
      //   ) {
      //     setCurrentMintProcess((currentMintProcess) => ({
      //       count: currentMintProcess?.count || count,
      //       minted: (currentMintProcess?.minted || 0) + 1,
      //       events: [...(currentMintProcess?.events || []), event],
      //     }));
      //   }
      // });
      contract.methods
        .mint({
          amount: count,
          proof:
            currentMintStage.type === "PUBLIC" ? [] : mintProofRes?.proof || [],
        })
        .send({
          from: accountInteraction.address,
          amount: amountTotal.toString(),
        })
        .then((txn) => {
          setCurrentMintProcess(p => {
            if (p) {
              return {
                ...p,
                txn,
              }
            }
            return null;
          });
          if (txn.aborted) {
            reject(new Error("Transaction Aborted"));
          }
        })
        .catch(() => {
          setCurrentMintProcess(null);
        });
    });
  };

  const onMintClick = async () => {
    const mintedTokens = await mint();
    console.log(mintedTokens);
  };

  const supplyPercent = useMemo(() => {
    if (!info || !info.hasMaxSupply) {
      return 0;
    }
    const current = parseInt(info.totalSupply);
    const max = parseInt(info.maxSupply);
    if (!current || current === 0 || !max || max === 0) {
      return 0;
    }
    return (100 * current) / max;
  }, [info]);

  const noCurrentMintStage = !currentMintStage;
  const accountNotEligible =
    currentMintStage?.type === "ALLOWLIST" && !mintProofRes?.eligible;

  const mintDisabled = noCurrentMintStage || accountNotEligible;

  const closeCurrentMintProcess = () => {
    setCurrentMintProcess(null);
  };

  return (
    <div className="border border-slate-800 p-8 rounded-lg bg-slate-900">
      <MintedTokensResult
        open={true}
        setOpen={closeCurrentMintProcess}
        mintProcess={currentMintProcess}
      />
      <div className="mb-6">
        {info && (
          <div>
            Supply
            {` (${info?.totalSupply} of ${
              info?.hasMaxSupply ? info.maxSupply : "Unlimited"
            })`}
          </div>
        )}
        {info?.hasMaxSupply && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
            <div
              className="bg-primary h-2.5 rounded-full"
              style={{ width: `${supplyPercent}%` }}
            ></div>
          </div>
        )}
      </div>
      {currentMintStage ? (
        <div className="text-gray-100 text-lg font-bold">
          {currentMintStage?.name}
        </div>
      ) : nextMintStage ? (
        <>
          <div className="text-gray-100 text-lg font-bold">
            {nextMintStage?.name}
          </div>
          <div className="mt-2">
            Starts on {formatDate(nextMintStage?.startTime)}
          </div>
        </>
      ) : null}
      {currentMintStage && (
        <div className="text-gray-300 mt-2 font-semibold">
          {fromNano(currentMintStage.price)} VENOM
        </div>
      )}
      <div className="flex items-center mt-8 ">
        <div className="inline-flex items-center border border-gray-800 rounded-lg">
          <button
            className="btn btn-ghost font-bold text-xl"
            onClick={() => decrement()}
            disabled={mintDisabled}
          >
            <MinusIcon className="w-4 h-4" />
          </button>
          <div className="px-4 text-center">{count}</div>
          <button
            className="btn btn-ghost font-bold text-xl"
            onClick={() => increment()}
            disabled={mintDisabled}
          >
            <PlusIcon className="w-4 h-4" />
          </button>
        </div>
        <button
          className="btn btn-primary ml-4 px-6"
          disabled={mintDisabled}
          onClick={() => onMintClick()}
        >
          Mint
        </button>
      </div>
      {!accountInteraction?.address && (
        <div className="mt-6 text-gray-500">Connect your wallet to mint</div>
      )}
      {accountInteraction?.address && accountNotEligible && (
        <div className="mt-6 text-yellow-600">
          You are not eligible to mint at this stage
        </div>
      )}
    </div>
  );
};
