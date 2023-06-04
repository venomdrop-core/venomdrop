import React, { FC, useEffect, useState } from "react";
import { AdminLayout } from "../../../layouts/AdminLayout";
import { AdminForm } from "../../../components/AdminForm";
import { ImageUploadInput } from "../../../components/ImageUploadInput";
import { useCollectionContract } from "../../../hooks/useCollectionContract";
import { useForm } from "react-hook-form";
import { json, useParams } from "react-router-dom";
import { InputWrapper } from "../../../components/InputWrapper";
import { useMutation } from "@tanstack/react-query";
import { uploadCollectionFile } from "../../../api/collections";
import { useVenomWallet } from "../../../hooks/useVenomWallet";
import { toNano } from "../../../utils/toNano";

export interface PreRevealProps {}

interface Form {
  name: string;
  file?: FileList;
}

export const PreReveal: FC<PreRevealProps> = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<Form>({});
  const { accountInteraction } = useVenomWallet();
  const { slug } = useParams();
  const collection = useCollectionContract(slug);
  const [currentImageSrc, setCurrentImageSrc] = useState<string | undefined>();
  const uploadMutation = useMutation({
    mutationFn: (data: FormData) => uploadCollectionFile(slug!, data),
  });
  useEffect(() => {
    if (collection) {
      collection.methods
        .getInitialMintJson()
        .call()
        .then(({ initialMintJson }) => {
          const metadata = JSON.parse(initialMintJson);
          setCurrentImageSrc(metadata.preview.source);
          reset({ name: metadata.name });
        });
    }
  }, [collection]);

  const onSubmit = async (data: Form) => {
    const formData = new FormData();
    if (data.file && data.file.length) {
      formData.append("file", data.file[0]);
    }
    const { url, mimetype } = await uploadMutation.mutateAsync(formData);
    console.log(url);

    await collection?.methods.setInitialMintJson({
      initialMintJson: JSON.stringify({
        type: "Basic NFT",
        name: data.name,
        preview: {
          source: url,
          mimetype,
        },
      })
    }).send({ from: accountInteraction!.address, amount: toNano('0.1') })
  }

  return (
    <AdminLayout>
      <AdminForm
        title="Pre-Reveal"
        description="Configure how your NFT will look like before it is revealed"
        submitLabel="Save Collection"
        onSubmit={handleSubmit(onSubmit)}
      >
        <InputWrapper label="Image" description="Upload a image">
          <ImageUploadInput src={currentImageSrc} {...register("file")} />
        </InputWrapper>
        <InputWrapper label="Name" description="Set a name">
          <input
            type="text"
            className="input input-bordered w-full"
            {...register("name")}
          />
        </InputWrapper>
      </AdminForm>
    </AdminLayout>
  );
};
