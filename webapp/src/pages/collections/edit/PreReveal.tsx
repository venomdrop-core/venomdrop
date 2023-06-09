import { FC, useEffect, useState } from "react";
import { AdminLayout } from "../../../layouts/AdminLayout";
import { AdminForm } from "../../../components/AdminForm";
import { ImageUploadInput } from "../../../components/ImageUploadInput";
import { useCollectionContract } from "../../../hooks/useCollectionContract";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { InputWrapper } from "../../../components/InputWrapper";
import { useMutation } from "@tanstack/react-query";
import { uploadCollectionFile } from "../../../api/collections";
import { useVenomWallet } from "../../../hooks/useVenomWallet";
import { toNano } from "../../../utils/toNano";
import { waitFinalized } from "../../../utils/waitFinalized";
import { toast } from "react-toastify";

export interface PreRevealProps {}

interface Form {
  name: string;
  file?: FileList;
}

export const PreReveal: FC<PreRevealProps> = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<Form>({});
  const [loading, setLoading] = useState(true);
  const { accountInteraction, venomProvider } = useVenomWallet();
  const { slug } = useParams();
  const collection = useCollectionContract(slug);
  const [currentImageSrc, setCurrentImageSrc] = useState<string | undefined>();
  const uploadMutation = useMutation({
    mutationFn: (data: FormData) => uploadCollectionFile(slug!, data),
  });
  const fetchCurrentPreReveal = () => {
    if (collection) {
      collection.methods
      .getInitialMintJson()
      .call()
      .then(({ initialMintJson }) => {
        const metadata = JSON.parse(initialMintJson);
        setCurrentImageSrc(metadata.preview.source);
        reset({ name: metadata.name });
        setLoading(false);
      });
    }
  }
  useEffect(() => {
    fetchCurrentPreReveal();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection]);

  const onSubmit = async (data: Form) => {
    if (!collection || !venomProvider) {
      return;
    }
    setLoading(true);
    const formData = new FormData();
    if (data.file && data.file.length) {
      formData.append("file", data.file[0]);
    }
    try {
      const { url, mimetype } = await uploadMutation.mutateAsync(formData);

      const txn = collection.methods
        .setInitialMintJson({
          initialMintJson: JSON.stringify({
            type: "Basic NFT",
            name: data.name,
            preview: {
              source: url,
              mimetype,
            },
          }),
        })
        .send({ from: accountInteraction!.address, amount: toNano("0.1") });
      await waitFinalized(venomProvider, txn);
      toast("Pre-Reveal updated successfully");
      fetchCurrentPreReveal();
    } catch (error) {
      toast.error("Could not update Pre-Reveal");
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <AdminLayout>
      <AdminForm
        title="Pre-Reveal"
        description="Configure how your NFT will look like before it is revealed"
        submitLabel="Save Collection"
        onSubmit={handleSubmit(onSubmit)}
        loading={loading}
        submitDisabled={!isDirty}
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
