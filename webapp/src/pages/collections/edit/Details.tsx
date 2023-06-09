import { FC, useEffect } from "react";
import { AdminLayout } from "../../../layouts/AdminLayout";
import { InputWrapper } from "../../../components/InputWrapper";
import { CategorySelect } from "../../../components/CategorySelect";
import { AdminForm } from "../../../components/AdminForm";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { updateCollection } from "../../../api/collections";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useCollection } from "../../../hooks/useCollection";
import { toast } from "react-toastify";
import { CollectionSlugInput } from "../../../components/CollectionSlugInput";

export interface DetailsProps {}

interface FormData {
  name: string;
  description: string;
  slug: string;
  categorySlug: string;
}

export const Details: FC<DetailsProps> = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: collection, refetch } = useCollection(slug);
  const updateMutation = useMutation({
    mutationFn: (data: FormData) => updateCollection(collection!.slug, data),
  });
  const form = useForm<FormData>();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: {
      errors,
      isValid
    }
  } = form;
  useEffect(() => {
    if (collection) {
      reset({
        name: collection?.name,
        description: collection?.description,
        slug: collection?.slug,
        categorySlug: collection?.category.slug || "art",
      });
    }
  }, [collection, reset]);
  const onSubmit = async (data: FormData) => {
    const res = await updateMutation.mutateAsync(data);
    navigate(`/collections/${res.slug}/edit/details`);
    refetch();
    toast("Collection Updated!");
  };
  return (
    <FormProvider {...form}>
      <AdminLayout>
        <AdminForm
          title="Collection Details"
          submitLabel="Save Collection"
          onSubmit={handleSubmit(onSubmit)}
          submitDisabled={Object.keys(errors).length > 0 || !isValid}
        >
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
            <CollectionSlugInput currentSlug={slug} />
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
                  onChange={(slug) => field.onChange({ target: { value: slug } })}
                  value={field.value}
                />
              )}
            />
          </InputWrapper>
        </AdminForm>
      </AdminLayout>
    </FormProvider>
  );
};
