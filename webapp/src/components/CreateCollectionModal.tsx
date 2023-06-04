/* eslint-disable react-hooks/rules-of-hooks */

import { FC, useMemo, useState } from "react";
import { Modal, ModalProps } from "./Modal";
import { useVenomWallet } from "../hooks/useVenomWallet";
import { abi } from "../contracts/abi";
import { getRandomNonce } from "../utils/getRandomNonce";
import { toNano } from "../utils/toNano";
import { Address } from "everscale-inpage-provider";
import { InputWrapper } from "./InputWrapper";
import { Controller, useForm } from "react-hook-form";
import { CategorySelect } from "./CategorySelect";
import { useMutation } from "@tanstack/react-query";
import { createCollection } from "../api/collections";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";

const FACTORY_ADDRESS = import.meta.env
  .VITE_VENOMDROP_COLLECTION_FACTORY_ADDRESS;

interface Form {
  name: string;
  description: string;
  slug: string;
  categorySlug: string;
}

export const CreateCollectionModal: FC<ModalProps> = (props) => {
  const [deploying, setDeploying] = useState(false);
  const navigate = useNavigate();
  const [collectionAddress, setCollectionAddress] = useState<string>();
  const { venomProvider, accountInteraction } = useVenomWallet();
  const createMutation = useMutation({
    mutationFn: (data: Form & { contractAddress: string }) =>
      createCollection(data),
  });
  const factory = useMemo(() => {
    return venomProvider
      ? new venomProvider.Contract(
          abi.VenomDropCollectionFactory,
          FACTORY_ADDRESS
        )
      : null;
  }, [venomProvider]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<Form>({});

  const deploy = async (): Promise<Address> => {
    return new Promise((resolve, reject) => {
      if (!accountInteraction || !venomProvider || !factory) {
        throw new Error("Wallet not connected");
      }
      // Subscribe for the factory events
      const sub = new venomProvider.Subscriber();
      const events = factory.events(sub);
      events.on((event) => {
        if (
          event.event === "VenomDropCollectionDeployed" &&
          event.data.creator.equals(accountInteraction.address)
        ) {
          sub.unsubscribe();
          resolve(event.data.collection);
        }
      });

      factory.methods
        .deployCollection({
          id: getRandomNonce(),
          owner: accountInteraction.address,
          initialMintJson: JSON.stringify({
            type: "Basic NFT",
            name: "VenomDrop Unrevealed NFT",
            preview: {
              source:
                "https://venomdrop-devnet.s3.amazonaws.com/defaults/venomdrop-pre-reveal.jpeg",
              mimetype: "image/jpeg",
            },
          }),
        })
        .send({
          from: accountInteraction.address,
          amount: toNano("6"),
        })
        .then((txn) => {
          if (txn.aborted) {
            sub.unsubscribe();
            reject(new Error("Deployment transaction aborted"));
          }
        });
      setTimeout(() => {
        sub.unsubscribe();
        reject(new Error("Could not retrieve the deployed contract"));
      }, 30000);
    });
  };

  const createCollectionDeployment = async () => {
    if (!accountInteraction || !venomProvider) {
      throw new Error("Wallet not connected");
    }
    try {
      setDeploying(true);
      const collectionAddress = await deploy();
      return collectionAddress.toString();
    } catch (error) {
      setDeploying(false);
      throw error;
    }
  };

  const onSubmit = async (data: Form) => {
    let address: string | undefined = collectionAddress;
    // Deploy collection if it was not deployed before
    if (!collectionAddress) {
      address = await createCollectionDeployment();
      setCollectionAddress(address);
    }
    if (!address) {
      // TODO: Show an error message
      return;
    }
    const collection = await createMutation.mutateAsync({
      ...data,
      contractAddress: address,
    });
    navigate(`/collections/${collection.slug}/edit/details`);
  };

  const isLoading = deploying || createMutation.isLoading;

  return (
    <Modal {...props}>
      <div className="p-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputWrapper label="Name" description="Set the collection name">
            <input
              type="text"
              className="input input-bordered w-full"
              {...register("name")}
            />
          </InputWrapper>
          <InputWrapper
            label="Description"
            description="Write a description for your collection"
          >
            <textarea
              className="textarea textarea-bordered w-full text-base"
              {...register("description")}
            ></textarea>
          </InputWrapper>
          <InputWrapper label="URL" description="Set a custom URL on VenomDrop">
            <div className="input input-bordered flex">
              <span className="flex select-none items-center pl-0 text-gray-400 text-base">
                https://venomdrop.xyz/collections/
              </span>
              <input
                type="text"
                className="input border-0 focus:border-0 focus:ring-0 focus:outline-none bg-transparent pl-0.5 text-white"
                {...register("slug")}
              />
            </div>
          </InputWrapper>
          <InputWrapper
            label="Category"
            description="Boost the visibility of your listings on VenomDrop by assigning them a relevant category"
          >
            <Controller
              name="categorySlug"
              control={control}
              rules={{ required: false }}
              render={({ field }) => (
                <CategorySelect
                  {...field}
                  onChange={(slug) =>
                    field.onChange({ target: { value: slug } })
                  }
                  value={field.value}
                />
              )}
            />
          </InputWrapper>
          <button
            type="submit"
            className={classNames("btn btn-primary btn-block", {
              loading: isLoading,
            })}
            disabled={isLoading}
          >
            Create Collection
          </button>
        </form>
      </div>
    </Modal>
  );
};
