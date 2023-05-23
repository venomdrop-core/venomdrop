import { FC } from "react";
import { AdminLayout } from "../../../../layouts/AdminLayout";
import { InputWrapper } from "../../../../components/InputWrapper";
import { CategorySelect } from "../../../../components/CategorySelect";
import { AdminForm } from "../../../../components/AdminForm";
import { ImageUploadInput } from "../../../../components/ImageUploadInput";

export interface GraphicsProps {}

export const Graphics: FC<GraphicsProps> = (props) => {
  return (
    <AdminLayout>
      <AdminForm title="Graphics" submitLabel="Save Collection">
        <InputWrapper
          label="Logo Image"
          description="A squared image used to display across the VenomDrop pages"
          bottomLeftContent="Recommended Size: 800 x 800"
        >
          <ImageUploadInput />
        </InputWrapper>
        <InputWrapper
          label="Cover Image"
          description="This image will appear at the top of your collection page"
          bottomLeftContent="Recommended Size: 1400 x 350"
        >
          <ImageUploadInput
            displayWidth="700px"
            displayHeight="175px"
          />
        </InputWrapper>
        <InputWrapper
          label="Featured Image"
          description="This image will appear at the top of your collection page"
          bottomLeftContent="Recommended Size: 300 x 200"
        >
          <ImageUploadInput
            displayWidth="300px"
            displayHeight="200px"
          />
        </InputWrapper>
      </AdminForm>
    </AdminLayout>
  );
};
