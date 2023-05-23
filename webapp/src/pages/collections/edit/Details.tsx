import { FC } from "react";
import { AdminLayout } from "../../../layouts/AdminLayout";
import { InputWrapper } from "../../../components/InputWrapper";
import { CategorySelect } from "../../../components/CategorySelect";
import { AdminForm } from "../../../components/AdminForm";

export interface DetailsProps {}

export const Details: FC<DetailsProps> = (props) => {
  return (
    <AdminLayout>
      <AdminForm title="Collection Details" submitLabel="Save Collection">
        <InputWrapper label="Name" description="Set a project name">
          <input
            type="text"
            name="slug"
            className="input input-bordered w-full"
          />
        </InputWrapper>
        <InputWrapper label="Description" description="Set a project name">
          <textarea
            name="description"
            className="textarea textarea-bordered w-full text-base"
          ></textarea>
        </InputWrapper>
        <InputWrapper label="URL" description="Set a custom URL on VenomDrop">
          <div className="input input-bordered flex">
            <span className="flex select-none items-center pl-0 text-gray-400 text-base">
              https://venomdrop.xyz/collections/
            </span>
            <input
              type="text"
              name="slug"
              className="input border-0 focus:border-0 focus:ring-0 focus:outline-none bg-transparent pl-0.5 text-white"
            />
          </div>
        </InputWrapper>
        <InputWrapper
          label="Category"
          description="Boost the visibility of your listings on VenomDrop by assigning them a relevant category"
        >
          <CategorySelect />
        </InputWrapper>
      </AdminForm>
    </AdminLayout>
  );
};
