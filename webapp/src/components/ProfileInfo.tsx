import { FC } from "react";
import { useVenomWallet } from "../hooks/useVenomWallet";
import { VenomWalletIcon } from "./icons/VenomWalletIcon";
import { getIdenticonSrc } from "../utils/getIdenticonSrc";
import { ArrowRightOnRectangleIcon, RectangleStackIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

export const ProfileInfo: FC = () => {
  const { connect, disconnect, address } = useVenomWallet();
  return (
    <>
      {!address ? (
        <button className="btn border-[rgba(166,173,187,0.2)] bg-[rgba(166,173,187,0.2)] hover:bg-[rgba(166,173,187,0.4)] hover:border-[rgba(166,173,187,0.4)]" onClick={connect}>
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
              <Link to="/collections">
                <RectangleStackIcon className="w-5 h-5" />
                My Collections
              </Link>
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
