import { FC, Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  ArrowTopRightOnSquareIcon,
  Bars3Icon,
  ChartBarIcon,
  CubeIcon,
  CubeTransparentIcon,
  GiftIcon,
  PhotoIcon,
  RectangleGroupIcon,
  RectangleStackIcon,
  RocketLaunchIcon,
  SparklesIcon,
  Squares2X2Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import VenomDropLogoSrc from "../../assets/venomdrop-logo.svg";
import classNames from "classnames";
import { Link, useLocation, useParams } from "react-router-dom";
import { CollectionPublishStatus } from "../../components/CollectionPublishStatusSelect";
import { useCollection } from "../../hooks/useCollection";

const MenuLink: React.FC<{
  label: string;
  path: string;
  icon: React.FC<{ className?: string }>;
}> = ({ label, path, icon: Icon }) => {
  const location = useLocation();
  const { slug } = useParams();
  const to = `/collections/${slug}/edit${path}`;
  const active = to === location.pathname;
  return (
    <Link
      key={label}
      to={to}
      className={classNames(
        active
          ? "bg-gray-800 text-white"
          : "text-gray-400 hover:bg-gray-800 hover:text-gray-100",
        "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
      )}
      aria-active={active ? "page" : undefined}
    >
      <Icon
        className={classNames(
          active ? "text-white" : "text-gray-400 group-hover:text-white",
          "mr-3 flex-shrink-0 h-6 w-6"
        )}
        aria-hidden="true"
      />
      {label}
    </Link>
  );
};

interface AdminProps {
  children: React.ReactNode;
}

export const AdminLayout: FC<AdminProps> = ({ children }) => {
  const { slug } = useParams();
  const { data: collection } = useCollection(slug);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = {
    name: "Name Test",
    imageUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  };
  const navigation = [
    {
      label: "Collection Details",
      path: "/details",
      icon: RectangleStackIcon,
      active: false,
    },
    {
      label: "Graphics",
      path: "/graphics",
      icon: RectangleGroupIcon,
      active: false,
    },
    {
      label: "Drop Settings",
      path: "/drop-settings",
      icon: RocketLaunchIcon,
      active: false,
    },
    {
      label: "Pre-Reveal",
      path: "/pre-reveal",
      icon: GiftIcon,
      active: false,
    },
    {
      label: "Reveal",
      path: "/reveal",
      icon: SparklesIcon,
      active: false,
    },
  ];

  const dropPageLink = (
    <a
      className="text-gray-400 hover:bg-gray-800 hover:text-gray-100 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
      href={`/collections/${slug}`}
      target="_blank"
    >
      <ArrowTopRightOnSquareIcon
        className="text-gray-400 group-hover:text-white mr-3 flex-shrink-0 h-6 w-6"
        aria-hidden="true"
      />
      Drop Page
    </a>
  );

  return (
    <>
      <div className="flex h-full">
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-slate-950 focus:outline-none">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                      <button
                        type="button"
                        className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="h-0 flex-1 overflow-y-auto pt-5 pb-4">
                    <div className="flex flex-shrink-0 items-center px-4">
                      <img
                        className="h-7 w-auto"
                        src={VenomDropLogoSrc}
                        alt="VenomDrop"
                      />
                    </div>
                    <nav aria-label="Sidebar" className="mt-5">
                      <div className="space-y-1 px-2">
                        {navigation.map((item) => (
                          <MenuLink {...item} />
                        ))}
                      </div>
                      <hr
                        className="my-5 border-t border-slate-800"
                        aria-hidden="true"
                      />
                      <div className="space-y-1 px-2">{dropPageLink}</div>
                    </nav>
                  </div>
                  <div className="flex flex-shrink-0 border-t border-slate-800 p-4">
                    <a href="#" className="group block flex-shrink-0">
                      <div className="flex items-center">
                        <div>
                          <img
                            className="inline-block h-10 w-10 rounded-full"
                            src={user.imageUrl}
                            alt=""
                          />
                        </div>
                        <div className="ml-3">
                          <p className="text-base font-medium text-gray-700 group-hover:text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
                            View profile
                          </p>
                        </div>
                      </div>
                    </a>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className="w-14 flex-shrink-0" aria-hidden="true">
                {/* Force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:flex lg:flex-shrink-0 h-screen">
          <div className="flex w-64 flex-col">
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex min-h-0 flex-1 flex-col border-r border-gray-800 bg-slate-950">
              <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
                <div className="flex flex-shrink-0 items-center px-4 mb-4">
                  <img
                    className="h-7 w-auto"
                    src={VenomDropLogoSrc}
                    alt="VenomDrop"
                  />
                </div>
                <div className="space-y-1 p-4">
                  <div className="flex mb-4 items-center">
                    <div>
                      {collection?.logoImageSrc && (
                        <img src={collection?.logoImageSrc} className="w-8 h-8 rounded-sm border-slate-700 border mr-2" />
                      )}
                    </div>
                    <div className="truncate">
                      {collection?.name}
                    </div>
                  </div>
                  <CollectionPublishStatus />
                </div>
                <hr
                    className="my-3 border-t border-gray-800"
                    aria-hidden="true"
                  />
                <nav className="mt-5 flex-1" aria-label="Sidebar">
                  <div className="space-y-1 px-2">
                    {navigation.map((item) => (
                      <MenuLink {...item} />
                    ))}
                  </div>
                  <hr
                    className="my-3 border-t border-gray-800"
                    aria-hidden="true"
                  />
                  <div className="flex-1 space-y-1 px-2 mt-4">
                    {dropPageLink}
                  </div>
                </nav>
              </div>
              <div className="flex flex-shrink-0 border-t border-gray-800 px-4 py-7">
                <a href="#" className="group block w-full flex-shrink-0 pt-1">
                  <div className="flex items-center">
                    <div>
                      <img
                        className="inline-block h-9 w-9 rounded-full"
                        src={user.imageUrl}
                        alt=""
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-400 group-hover:text-gray-200">
                        {user.name}
                      </p>
                      <p className="text-xs font-medium text-gray-500 group-hover:text-gray-300">
                        View profile
                      </p>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="lg:hidden">
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-4 py-1.5">
              <div>
                <img
                  className="h-7 w-auto"
                  src={VenomDropLogoSrc}
                  alt="VenomDrop"
                />
              </div>
              <div>
                <button
                  type="button"
                  className="-mr-3 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pink-600"
                  onClick={() => setSidebarOpen(true)}
                >
                  <span className="sr-only">Open sidebar</span>
                  <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
          <div className="relative z-0 flex flex-1 overflow-hidden">
            <main className="relative z-0 flex-1 overflow-y-auto focus:outline-none xl:order-last bg-slate-950 bg-opacity-80 h-screen">
              {children}
            </main>
          </div>
        </div>
      </div>
    </>
  );
};
