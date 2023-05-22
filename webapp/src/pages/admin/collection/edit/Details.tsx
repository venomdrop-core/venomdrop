import { FC } from "react";
import { AdminLayout } from "../../../../layouts/AdminLayout";
import { InputWrapper } from "../../../../components/InputWrapper";
import { CategorySelect } from "../../../../components/CategorySelect";

export interface DetailsProps {}

export const Details: FC<DetailsProps> = (props) => {
  return (
    <AdminLayout>
      <div className="mx-auto max-w-lg py-8">
        <form>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="font-semibold leading-7 text-2xl text-white mt-8">
                Collection Details
              </h2>

              <div className="mt-12">
                <InputWrapper label="Name" description="Set a project name">
                  <input
                    type="text"
                    name="slug"
                    className="input input-bordered w-full"
                  />
                </InputWrapper>
                <InputWrapper
                  label="Description"
                  description="Set a project name"
                >
                  <textarea
                    name="description"
                    className="textarea textarea-bordered w-full text-base"
                  ></textarea>
                </InputWrapper>
                <InputWrapper
                  label="URL"
                  description="Set a custom URL on VenomDrop"
                >
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
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};
