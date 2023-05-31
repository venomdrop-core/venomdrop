import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { FC, useMemo, useState } from "react";
import { MintStage } from "../types/mintStage";
import { fromNano } from "../utils/fromNano";
import { formatDate } from "../utils/dates";
import { useCollectionContract } from "../hooks/useCollectionContract";
import { useParams } from "react-router-dom";
import { useVenomWallet } from "../hooks/useVenomWallet";
import { toNano } from "../utils/toNano";

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
  const { accountInteraction } = useVenomWallet();
  const [count, setCount] = useState(0);

  const increment = () => setCount((x) => x + 1);
  const decrement = () => setCount((x) => (x > 1 ? x - 1 : 0));

  const nextMintStage = useMemo(() => {
    const now = new Date();
    const nextMingStage = mintStages.findLast((ms) => ms.startTime > now);
    return nextMingStage;
  }, [mintStages]);

  const onMintClick = async () => {
    if (!accountInteraction) {
      return;
    }
    const txn = await contract?.methods
      .mint({
        amount: count,
      })
      .send({
        from: accountInteraction.address,
        amount: toNano("1"), // FIXME: Send the mint price
      });
    console.log(txn);
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
    return 100*current/max;
  }, [info]);

  return (
    <div className="border border-slate-800 p-8 rounded-lg bg-slate-900">
      <div className="mb-6">
        <div>
          Supply{" "}
          {info?.hasMaxSupply
            ? `(${info.totalSupply}/${info.maxSupply})`
            : "(Unlimited)"}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
          <div className="bg-primary h-2.5 rounded-full" style={{ width: `${supplyPercent}%` }}></div>
        </div>
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
            disabled={!currentMintStage}
          >
            <MinusIcon className="w-4 h-4" />
          </button>
          <div className="px-4 text-center">{count}</div>
          <button
            className="btn btn-ghost font-bold text-xl"
            onClick={() => increment()}
            disabled={!currentMintStage}
          >
            <PlusIcon className="w-4 h-4" />
          </button>
        </div>
        <button
          className="btn btn-primary ml-4 px-6"
          disabled={!currentMintStage}
          onClick={() => onMintClick()}
        >
          Mint
        </button>
      </div>
    </div>
  );
};
