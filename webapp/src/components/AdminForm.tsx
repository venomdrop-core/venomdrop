import React, { FC } from "react";

export interface AdminFormProps {
  title: string;
  children: React.ReactNode;
  submitLabel: string;
}

export const AdminForm: FC<AdminFormProps> = ({ title, children, submitLabel = 'Save' }) => {
  return (
    <form>
      <div className="flex flex-col h-screen">
        <div className="flex-1">
          <div className="mx-auto max-w-lg py-8">
            <div className="space-y-12">
              <div className="border-b border-gray-900/10 pb-12">
                <h2 className="font-semibold leading-7 text-2xl text-white mt-8">
                  {title}
                </h2>

                <div className="mt-12">{children}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-shrink-0 border-t border-gray-800 p-6 px-12 flex-row-reverse">
          <button className="btn btn-primary" type="submit">{submitLabel}</button>
        </div>
      </div>
    </form>
  );
};
