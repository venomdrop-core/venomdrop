import { FC, useEffect } from "react";
import { AdminLayout } from "../../../layouts/AdminLayout";
import { InputWrapper } from "../../../components/InputWrapper";
import { CategorySelect } from "../../../components/CategorySelect";
import { AdminForm } from "../../../components/AdminForm";
import { Controller, useForm } from "react-hook-form";
import { getCollection, updateCollection } from "../../../api/collections";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";

export interface DetailsProps {}

interface FormData {
  name: string;
  description: string;
  slug: string;
  categorySlug: string;
}

export const Details: FC<DetailsProps> = (props) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: collection } = useQuery({
    queryKey: ["collections", slug],
    queryFn: () => getCollection(slug || ""),
    enabled: !!slug,
  });
  const updateMutation = useMutation({
    mutationFn: (data: FormData) => updateCollection(collection!.slug, data),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<FormData>({
  });
  useEffect(() => {
    if (collection) {
      reset({
        name: collection?.name,
        description: collection?.description,
        slug: collection?.slug,
        categorySlug: collection?.category.slug || 'art',
      });
    }
  }, [collection, reset]);
  const onSubmit = async (data: FormData) => {
    const res = await updateMutation.mutateAsync(data);
    navigate(`/collections/${res.slug}/edit/details`);
  };
  return (
    <AdminLayout>
      <AdminForm
        title="Collection Details"
        submitLabel="Save Collection"
        onSubmit={handleSubmit(onSubmit)}
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
                onChange={(slug) => field.onChange({ target: { value: slug } })}
                value={field.value}
              />
            )}
          />
        </InputWrapper>
      </AdminForm>
    </AdminLayout>
  );
};
