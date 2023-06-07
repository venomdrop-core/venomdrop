import { FC } from "react";
import { AdminLayout } from "../../../layouts/AdminLayout";
import { InputWrapper } from "../../../components/InputWrapper";
import { AdminForm } from "../../../components/AdminForm";
import { ImageUploadInput } from "../../../components/ImageUploadInput";
import { FileInputButton } from "../../../components/FileInputButton";
import { useCollection } from "../../../hooks/useCollection";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { updateCollectionGraphics } from "../../../api/collections";
import { toast } from "react-toastify";

export interface GraphicsProps {}


interface Form {
  logo?: FileList;
  cover?: FileList;
  featured?: FileList;
}

export const Graphics: FC<GraphicsProps> = (props) => {
  const { slug } = useParams();
  const { data: collection, refetch } = useCollection(slug);
  const updateMutation = useMutation({
    mutationFn: (data: FormData) => updateCollectionGraphics(collection!.slug, data),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<Form>({});
  const onSubmit = async (data: Form) => {
    const formData = new FormData();
    if (data.logo && data.logo.length) {
      formData.append("logo", data.logo[0]);
    }
    if (data.cover && data.cover.length) {
      formData.append("cover", data.cover[0]);
    }
    if (data.featured && data.featured.length) {
      formData.append("featured", data.featured[0]);
    }
    await updateMutation.mutateAsync(formData);
    refetch();
    toast('Collection Updated!');
  }
  return (
    <AdminLayout>
      <AdminForm title="Graphics" submitLabel="Save Collection" onSubmit={handleSubmit(onSubmit)} loading={updateMutation.isLoading}>
        <InputWrapper
          label="Logo Image"
          description="A squared image used to display across the VenomDrop pages"
          bottomLeftContent="Recommended Size: 800 x 800"
        >
          <ImageUploadInput
            src={collection?.logoImageSrc}
            {...register('logo')}
          />
        </InputWrapper>
        <InputWrapper
          label="Cover Image"
          description="This image will appear at the top of your collection page"
          bottomLeftContent="Recommended Size: 1400 x 350"
        >
          <ImageUploadInput
            src={collection?.coverImageSrc}
            displayWidth="700px"
            displayHeight="175px"
            {...register('cover')}
          />
        </InputWrapper>
        <InputWrapper
          label="Featured Image"
          description="This image will appear at the top of your collection page"
          bottomLeftContent="Recommended Size: 300 x 200"
        >
          <ImageUploadInput
            src={collection?.featuredImageSrc}
            displayWidth="300px"
            displayHeight="200px"
            {...register('featured')}
          />
        </InputWrapper>
      </AdminForm>
    </AdminLayout>
  );
};
