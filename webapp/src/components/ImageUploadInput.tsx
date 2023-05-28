import React, { forwardRef, useState } from "react";

export interface ImageUploadInputProps extends React.HTMLProps<HTMLInputElement> {
  src?: string;
  displayWidth?: string;
  displayHeight?: string;
}

export const ImageUploadInput = forwardRef<HTMLInputElement, ImageUploadInputProps>(({
  src,
  displayWidth = "240px",
  displayHeight = "240px",
  ...props
}, ref) => {
  const [previewSrc, setPreviewSrc] = useState<string>();
  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const previewSrc = URL.createObjectURL(e.target.files![0]);
    setPreviewSrc(previewSrc);
    props.onChange && props.onChange(e);
  }
  return (
    <div>
      <div className="mt-1 flex items-center">
        {(previewSrc || src) ? (
          <img
            src={previewSrc || src}
            className="object-cover object-center border border-gray-800"
            style={{
              width: displayWidth,
              height: displayHeight,
            }}
          />
        ) : (
          <span
            className="overflow-hidden bg-[#d0d0d0] p-8"
            style={{
              width: displayWidth,
              height: displayHeight,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={680.764}
              height={528.354}
              viewBox="0 0 180.119 139.794"
              className="h-full w-full text-gray-300"
            >
              <g
                paintOrder="fill markers stroke"
                transform="translate(-13.59 -66.639)"
              >
                <path
                  fill="#d0d0d0"
                  d="M13.591 66.639H193.71v139.794H13.591z"
                />
                <path
                  fill="#fff"
                  d="m118.507 133.514-34.249 34.249-15.968-15.968-41.938 41.937h152.374z"
                  opacity={0.675}
                />
                <circle
                  cx={58.217}
                  cy={108.555}
                  r={11.773}
                  fill="#fff"
                  opacity={0.675}
                />
                <path fill="none" d="M26.111 77.634h152.614v116.099H26.111z" />
              </g>
            </svg>
          </span>
        )}
        <div className="ml-5">
        <label
          htmlFor={props.name}
          className="btn"
        >
          <input id={props.name} type="file" className="hidden" ref={ref} {...props} onChange={onChange} />
          Change
        </label>
        </div>
      </div>
    </div>
  );
});
