import classNames from "classnames";
import React, { FC } from "react";
import { Spinner } from "./Spinner";

export interface AdminFormProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  submitLabel?: string;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  loading?: boolean;
}

export const AdminForm: FC<AdminFormProps> = ({
  title,
  description,
  children,
  submitLabel = "Save",
  onSubmit,
  loading,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col h-screen">
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Spinner />
            </div>
          ) : (
            <div className="mx-auto max-w-lg py-8">
              <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                  <h2 className="font-semibold leading-7 text-2xl text-white mt-8">
                    {title}
                  </h2>
                  {description && <div className="mt-4">{description}</div>}

                  <div className="mt-12">{children}</div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-shrink-0 border-t border-gray-800 p-6 px-12 flex-row-reverse">
          <button
            className={classNames("btn btn-primary", { loading })}
            type="submit"
            disabled={loading}
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
};
