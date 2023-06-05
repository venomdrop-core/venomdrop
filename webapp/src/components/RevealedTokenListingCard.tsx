import { FC } from "react";
import { RevealedTokenDto } from "../api/collections";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
// const DEFAU

export interface RevealedTokenListingCardProps {
  revealedToken: RevealedTokenDto;
}

export const RevealedTokenListingCard: FC<RevealedTokenListingCardProps> = ({
  revealedToken,
}) => {
  const { tokenId, imageUrl, name, address } = revealedToken;
  const backgroundUrl = imageUrl;
  const backgroundImage = backgroundUrl
    ? `linear-gradient(rgba(0, 0, 0, 0.60) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.60) 100%), url(${backgroundUrl})`
    : "";
  const viewUrl = `${import.meta.env.VITE_VENOMSCAN_BASE_URL}/accounts/${address}`;
  return (
    <div className="w-full bg-slate-950">
      <div
        className="w-full h-48 bg-cover bg-center bg-slate-950 rounded-t-lg"
        style={{ backgroundImage }}
      />
      <div className="p-8 border-t border-t-slate-900">
        <div className="font-bold text-gray-200">#{tokenId} - {name}</div>
        <div className="mt-4">
          <a href={viewUrl} target="_blank" className="text-primary flex items-center">
            View on VenomScan <ArrowTopRightOnSquareIcon className="w-4 h-4 ml-2" />
          </a>
        </div>
      </div>
    </div>
  );
};
