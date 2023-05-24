import { FC } from "react";
import { useVenomWallet } from "../../../hooks/useVenomWallet";
import { VenomWalletIcon } from "../../../components/icons/VenomWalletIcon";
import { getIdenticonSrc } from "../../../utils/getIdenticonSrc";
import { ArrowRightOnRectangleIcon, RectangleStackIcon } from "@heroicons/react/24/outline";

export const ProfileInfo: FC = () => {
  const { connect, disconnect, address } = useVenomWallet();
  return (
    <>
      {!address ? (
        <button className="btn md:btn-ghost btn-primary" onClick={connect}>
          <VenomWalletIcon className="h-5 w-5 text-gray-50 mr-2" />
          Connect Wallet
        </button>
      ) : (
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="avatar btn btn-circle">
            <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img src={getIdenticonSrc(address)} />
            </div>
          </label>

          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <button>
                <RectangleStackIcon className="w-5 h-5" />
                My Collections
              </button>
            </li>
            <li>
              <button onClick={disconnect}>
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                Disconnect
              </button>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};
