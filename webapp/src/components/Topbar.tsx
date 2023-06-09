import { FC, useMemo, useState } from "react";
import { Dialog, Disclosure } from "@headlessui/react";
import {
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";
import VenomDropWhiteSrc from "../assets/venomdrop-logo-white.png";
import { CATEGORIES } from "../consts";
import { Link } from "react-router-dom";
import { ProfileInfo } from "./ProfileInfo";

// const MENU_LINKS = [
//   {
//     name: "About",
//     href: "/about",
//   },
//   {
//     name: "Guides",
//     href: "/guides",
//   },
// ];

interface TopbarProps {
  className?: string;
}

export const Topbar: FC<TopbarProps> = ({ className }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = useMemo(
    () =>
      CATEGORIES.map((c) => ({
        ...c,
        href: `/categories/${c.slug}`,
      })),
    []
  );

  return (
    <header className={className}>
      <nav
        className="container mx-auto flex items-center justify-between py-6"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <span className="sr-only">VenomDrop</span>
            <img className="h-8 w-auto" src={VenomDropWhiteSrc} alt="" />
          </Link>
        </div>
        <div className="flex lg:hidden">
          {/* <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button> */}
        </div>

        <div className="px-2 pt-2 pb-3 space-y-1 hidden md:inline-flex">
          <a
            href="https://dorahacks.io/buidl/5843"
            target="_blank"
            className="hidden md:inline-flex items-center text-white bg-gray-800 rounded-full p-1 pr-2 sm:text-base lg:text-sm xl:text-base hover:text-gray-200"
            rel="noreferrer"
          >
            <span className="px-3 py-0.5 text-white text-xs font-semibold leading-5 uppercase tracking-wide bg-primary rounded-full">
              BETA
            </span>
            <span className="ml-4 text-sm">
              This project was created for the Venom Hackathon
            </span>
            <ChevronRightIcon
              className="ml-2 w-5 h-5 text-gray-500"
              aria-hidden="true"
            />
          </a>
        </div>

        {/* <Popover.Group className="hidden lg:flex lg:gap-x-12">
          <Popover className="relative">
            <Popover.Button className="flex items-center gap-x-1 text-lg font-semibold leading-6 text-gray-100">
              Explore
              <ChevronDownIcon
                className="h-5 w-5 flex-none text-gray-400"
                aria-hidden="true"
              />
            </Popover.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-slate-950 shadow-lg ring-1 ring-gray-800">
                <div className="px-8 mt-8 text-lg text-gray-100">
                  Explore NFT Collections
                </div>
                <div className="p-4 grid grid-cols-2">
                  {categories.map((item) => (
                    <div
                      key={item.name}
                      className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-slate-900"
                    >
                      <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-slate-800 group-hover:bg-primary">
                        <item.icon
                          className="h-6 w-6 text-gray-400 group-hover:text-gray-50"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="flex-auto">
                        <a
                          href={item.href}
                          className="block font-semibold text-gray-100"
                        >
                          {item.name}
                          <span className="absolute inset-0" />
                        </a>
                        <p className="mt-1 text-gray-600"></p>
                      </div>
                    </div>
                  ))}
                </div>
              </Popover.Panel>
            </Transition>
          </Popover>

          {MENU_LINKS.map((link) => (
            <a
              href={link.href}
              className="text-lg font-semibold leading-6 text-gray-200"
            >
              {link.name}
            </a>
          ))}
        </Popover.Group> */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <ProfileInfo />
        </div>
      </nav>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-slate-950 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">VenomDrop</span>
              <img className="h-6 w-auto" src={VenomDropWhiteSrc} alt="" />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <Disclosure as="div" className="-mx-3">
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-100 hover:bg-gray-800">
                        Explore
                        <ChevronDownIcon
                          className={classNames(
                            open ? "rotate-180" : "",
                            "h-5 w-5 flex-none"
                          )}
                          aria-hidden="true"
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className="mt-2 space-y-2">
                        {categories.map((item) => (
                          <Disclosure.Button
                            key={item.name}
                            as="a"
                            href={item.href}
                            className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-200 hover:bg-gray-50"
                          >
                            <item.icon
                              className="h-5 w-5 flex-none text-gray-400 inline-flex mr-2"
                              aria-hidden="true"
                            />
                            {item.name}
                          </Disclosure.Button>
                        ))}
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
                {/* {MENU_LINKS.map((link) => (
                  <a
                    href={link.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-200 hover:bg-gray-50"
                  >
                    {link.name}
                  </a>
                ))} */}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
};
