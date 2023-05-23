import React, { FC } from "react";

export interface ImageUploadInputProps {
  displayWidth?: string;
  displayHeight?: string;
}
// TODO: Implement the Upload action
export const ImageUploadInput: FC<ImageUploadInputProps> = ({
  displayWidth = "240px",
  displayHeight = "240px",
}) => {
  return (
    <div>
      <div className="mt-1 flex items-center">
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
              <path fill="#d0d0d0" d="M13.591 66.639H193.71v139.794H13.591z" />
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
        <button type="button" className="btn btn-outline ml-5">
          Change
        </button>
      </div>
    </div>
  );
};
