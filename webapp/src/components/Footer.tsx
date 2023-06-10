import { FC } from "react";
import VenomDropWhiteSrc from "../assets/venomdrop-logo-white.png";
import { Link } from "react-router-dom";

export interface FooterProps {}

export const Footer: FC<FooterProps> = () => {
  return (
    <footer className="rounded-lg shadow  m-4">
      <div className="container mx-auto md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <Link
            to="/"
            className="flex items-center mb-4 sm:mb-0"
          >
            <img
              src={VenomDropWhiteSrc}
              className="h-8 mr-3"
              alt="VenomDrop Logo"
            />
          </Link>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-400">
            <li>
              <Link to="/" className="mr-4 hover:underline md:mr-6 ">
                Home
              </Link>
            </li>
            <li>
              <a href="https://github.com/venomdrop-core/venomdrop" target="_blank" className="mr-4 hover:underline md:mr-6 ">
                GitHub
              </a>
            </li>
          </ul>
        </div>
        <hr className="my-6  sm:mx-auto border-gray-700 lg:my-8" />
        <span className="block text-sm  sm:text-center text-gray-400">
          © 2023{" "}
          <Link to="https://venomdrop.xyz" className="hover:underline">
            VenomDrop
          </Link>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};
