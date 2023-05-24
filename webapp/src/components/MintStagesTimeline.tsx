import {
  UsersIcon,
  GlobeAmericasIcon,
  ArrowLongRightIcon,
} from "@heroicons/react/24/outline";
import classNames from "classnames";
import React, { FC } from "react";
import { MintStage } from "../types/mintStage";
import { VenomIcon } from "./icons/VenomIcon";

export interface MintStagesTimelineProps {
  mintStages: MintStage[];
}

export const MintStagesTimeline: FC<MintStagesTimelineProps> = ({
  mintStages,
}) => {
  return (
    <div>
      <ul role="list" className="-mb-8">
        {mintStages.map((mintStage, idx) => (
          <li key={idx}>
            <div className="relative pb-8">
              {idx !== mintStages.length - 1 ? (
                <span
                  className="absolute top-4 left-4 mt-4 -ml-px h-full w-0.5 bg-gray-800"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span
                    className={classNames(
                      mintStage.type === "public"
                        ? "bg-green-500"
                        : "bg-blue-500",
                      "h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-base-100 mt-4 mr-2 tooltip tooltip-left"
                    )}
                    data-tip={
                      mintStage.type === "public"
                        ? "Public Mint"
                        : "Allowlist Mint"
                    }
                  >
                    {mintStage.type === "public" ? (
                      <GlobeAmericasIcon
                        className="h-5 w-5 text-white"
                        aria-hidden="true"
                      />
                    ) : (
                      <UsersIcon
                        className="h-5 w-5 text-white"
                        aria-hidden="true"
                      />
                    )}
                  </span>
                </div>
                <div className="bg-base-300 w-full p-6 rounded-lg">
                  <div>
                    <div>
                      <strong className="text-base">{mintStage.name}</strong>
                      <div>
                        <div className="text-sm text-gray-500 mt-2">
                          22 May 22:30{" "}
                          <ArrowLongRightIcon className="w-4 h-4 inline" /> 23
                          May 22:30
                        </div>
                        <div className="text-sm text-gray-500 mt-2 inline-flex items-center tooltip tooltip-right" data-tip="Mint Price">
                          <VenomIcon className="w-3 h-3 inline mr-2" /> 155
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};