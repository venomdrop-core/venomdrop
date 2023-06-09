import React, { FC } from "react";

export interface InputWrapperProps {
  htmlFor?: string;
  label?: string;
  description?: React.ReactNode | string;
  children?: React.ReactNode;
  bottomLeftContent?: React.ReactNode | string;
  bottomRightContent?: React.ReactNode | string;
  error?: string;
}

export const InputWrapper: FC<InputWrapperProps> = ({
  htmlFor,
  label,
  description,
  children,
  bottomLeftContent,
  bottomRightContent,
  error,
}) => {
  return (
    <div className="mb-8 form-control">
      {label ? (
        <label
          htmlFor={htmlFor}
          className="block text-lg font-medium leading-6 text-gray-200"
        >
          {label}
        </label>
      ): null}
      {description ? (
        <div className="py-2 text-base">
          {description}
        </div>
      ): null}
      <div className="mt-2">
        {children}
      </div>
      {error && (
        <div className="text text-error text-sm">
          {error}
        </div>
      )}
      {bottomLeftContent || bottomRightContent ? (
        <label className="label">
          <span className="label-text-alt">{bottomLeftContent}</span>
          <span className="label-text-alt">{bottomRightContent}</span>
        </label>
      ): null}
    </div>
  );
};
