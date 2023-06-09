import { Fragment, useMemo, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ChevronUpDownIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/20/solid";
import classNames from "classnames";
import { Modal } from "./Modal";
import { useParams } from "react-router-dom";
import { useCollection } from "../hooks/useCollection";
import { GlobeAltIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useMutation } from "@tanstack/react-query";
import { setPublishStatus } from "../api/collections";
import { toast } from "react-toastify";

const statusOptions = [
  {
    name: "Draft",
    type: "DRAFT",
    colorClass: "bg-yellow-600",
  },
  {
    name: "Published",
    type: "PUBLISHED",
    colorClass: "bg-green-600",
  },
];

interface ConfirmModal {
  status: string;
}

export const CollectionPublishStatus = () => {
  const { slug } = useParams();
  const { data: collection, refetch } = useCollection(slug);
  const [confirmModal, setConfirmModal] = useState<ConfirmModal | null>(null);
  // const [selected, setSelected] = useState(statusOptions[0]);
  const setPublishStatusMutation = useMutation({
    mutationFn: (status: "DRAFT" | "PUBLISHED") =>
      setPublishStatus(slug!, { status }),
  });

  const selected = useMemo(
    () => statusOptions.find((o) => o.type === collection?.publishStatus),
    [collection]
  );

  const publishErrors = useMemo(() => {
    const errors = [];
    if (!collection?.name) {
      errors.push("Collection Details: You collection should have a name");
    }
    if (!collection?.logoImageSrc) {
      errors.push("Graphics: You collection should have a logo");
    }
    if (!collection?.coverImageSrc) {
      errors.push("Graphics: You collection should have a cover image");
    }
    return errors;
  }, [collection]);

  const openConfirmModal = (option: (typeof statusOptions)[number]) => {
    setConfirmModal({
      status: option.type,
    });
  };

  const closeConfirmModal = () => setConfirmModal(null);

  const setStatus = async (status: "DRAFT" | "PUBLISHED") => {
    await setPublishStatusMutation.mutateAsync(status);
    await refetch();
    toast(status === 'PUBLISHED' ? 'Collection published!': 'Collection changed to draft');
    closeConfirmModal();
  };

  return (
    <div>
      <Modal open={!!confirmModal} setOpen={closeConfirmModal}>
        <div className="p-8 py-6 border-b border-b-slate-900 flex justify-between items-center">
          <div>
            {confirmModal?.status === "PUBLISHED" && <>Publish Collection</>}
            {confirmModal?.status === "DRAFT" && <>Change status to Draft</>}
          </div>
          <div>
            <button
              className="btn btn-sm btn-circle btn-ghost"
              onClick={closeConfirmModal}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
        {confirmModal?.status === "DRAFT" && (
          <>
            <div className="p-8">
              <p>
                By switching your collection to Draft your collection will no
                longer be visible on the VenomDrop website, but your smart
                contract will remain active and people will be able to mint NFTs
                if they are eligible for any Mint Stage.
              </p>
              <p className="mt-4">
                Do you really want to change the status to Draft?
              </p>
            </div>
            <div className="p-8 flex border-t border-t-slate-900  justify-end">
              <button
                className="btn btn-warning"
                onClick={() => setStatus("DRAFT")}
              >
                Confirm
              </button>
            </div>
          </>
        )}
        {confirmModal?.status === "PUBLISHED" &&
          (publishErrors.length === 0 ? (
            <>
              <div className="p-8">
                <p>
                  Your collection is ready to be published. Do you want to
                  publish it now?
                </p>
                <p className="mt-4">
                  Once published, the Drop Page will be accessible to
                  collectors, allowing them to explore and mint NFTs from your
                  collection.
                </p>
                <div className="mt-8">
                  {publishErrors.map((error) => (
                    <div className="flex items-center py-1">
                      <ExclamationCircleIcon className="w-4 h-4 text-yellow-400 mr-2" />
                      {error}
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-8 flex border-t border-t-slate-900  justify-end">
                <button
                  className="btn btn-primary"
                  onClick={() => setStatus("PUBLISHED")}
                >
                  <GlobeAltIcon className="w-5 h-5 mr-2" /> Publish
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="p-8">
                In order to publish your collection you need to meet the
                requirements below:
                <div className="mt-8">
                  {publishErrors.map((error) => (
                    <div className="flex items-center py-1">
                      <ExclamationCircleIcon className="w-4 h-4 text-yellow-400 mr-2" />
                      {error}
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-8 flex border-t border-t-slate-900  justify-end">
                <button className="btn" onClick={closeConfirmModal}>
                  Close
                </button>
              </div>
            </>
          ))}
      </Modal>
      <Listbox value={selected} onChange={openConfirmModal}>
        {({ open }) => (
          <>
            <div className="relative mt-2">
              <Listbox.Button className="relative w-full cursor-default rounded-md bg-slate-900 py-1.5 pl-3 pr-10 text-left text-white shadow-sm ring-1 ring-inset ring-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                <span className="flex items-center">
                  <div
                    className={classNames(
                      "h-3 w-3 rounded-full",
                      selected?.colorClass
                    )}
                  />
                  <span className="ml-3 block truncate">{selected?.name}</span>
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-slate-900 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {statusOptions.map((status) => (
                    <Listbox.Option
                      key={status.type}
                      className={({ active }) =>
                        classNames(
                          active ? "bg-indigo-600 text-white" : "text-gray-400",
                          "relative cursor-default select-none py-2 pl-3 pr-9"
                        )
                      }
                      value={status}
                    >
                      {({ selected }) => (
                        <>
                          <div className="flex items-center">
                            <div
                              className={classNames(
                                "h-3 w-3 rounded-full",
                                status.colorClass
                              )}
                            />
                            <span
                              className={classNames(
                                selected ? "font-semibold" : "font-normal",
                                "ml-3 block truncate"
                              )}
                            >
                              {status.name}
                            </span>
                          </div>

                          {selected ? (
                            <span
                              className={
                                "text-white absolute inset-y-0 right-0 flex items-center pr-4"
                              }
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
    </div>
  );
};
