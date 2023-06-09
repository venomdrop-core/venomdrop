import { FC, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { getSlugAvailability } from "../api/collections";

export interface CollectionSlugInputProps {
  currentSlug?: string;
}

export const CollectionSlugInput: FC<CollectionSlugInputProps> = ({ currentSlug }) => {
  const { control, setError, clearErrors, formState, setValue } =
    useFormContext<{ slug: string }>();
  const [suggestedSlugs, setSuggestedSlugs] = useState<string[]>([]);

  const checkSlugAvailability = async (slug: string) => {
    if (currentSlug === slug) {
      clearErrors("slug");
      setSuggestedSlugs([]);
      return;
    }
    try {
      const res = await getSlugAvailability(slug);
      if (res.status) {
        clearErrors("slug");
        setSuggestedSlugs([]);
      } else {
        setError("slug", { message: "URL already taken" });
        setSuggestedSlugs(res.suggestions);
      }
    } catch (error) {
      /* empty */
    }
  };

  return (
    <div>
      <div className="input input-bordered flex">
        <span className="flex select-none items-center pl-0 text-gray-400 text-base">
          https://venomdrop.xyz/collections/
        </span>

        <Controller
          name="slug"
          control={control}
          rules={{ required: false }}
          render={({ field }) => (
            <input
              type="text"
              className="input border-0 focus:border-0 focus:ring-0 focus:outline-none bg-transparent pl-0.5 text-white"
              onChange={(e) => {
                checkSlugAvailability(e.target.value);
                field.onChange(e);
              }}
              value={field.value}
            />
          )}
        />
      </div>
      <div className="text text-error mt-4">
        {formState?.errors?.slug?.message}
      </div>
      {suggestedSlugs.length > 0 && (
        <div className="mt-4">
          Suggested Slugs:
          <div className="mt-2">
            {suggestedSlugs.map((slug) => (
              <div>
                <a
                  role="button"
                  className="text text-primary"
                  onClick={() => {
                    setValue("slug", slug);
                    checkSlugAvailability(slug);
                  }}
                >
                  {slug}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
