import React, { DragEventHandler, FC, useState } from "react";
import * as Papa from "papaparse";
import { validateVenomAddress } from "../utils/validateVenomAddress";
import { FileUploader } from "react-drag-drop-files";
import { UserGroupIcon, XCircleIcon } from "@heroicons/react/24/outline";

type CsvData = CsvDataRow[];

interface CsvDataRow {
  "Venom Wallet Address": string;
}

export interface AllowlistInputProps {
  allowlist: string[];
  setAllowlist: (addresses: string[]) => void;
}

export const AllowlistInput: FC<AllowlistInputProps> = ({
  allowlist,
  setAllowlist,
}) => {
  const [invalidCsv, setInvalidCsv] = useState(false);
  const downloadCsvTemplate = () => {
    const rows = [
      ["Venom Wallet Address"],
      ["0:0000000000000000000000000000000000000000000000000000000000000000"],
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "venomdrop_allowlist_template.csv");
    document.body.appendChild(link);
    link.click();
  };

  const onCsvParsed = (data: CsvData) => {
    console.log(data);
    const validAllowlist = data.every((row) =>
      validateVenomAddress(row["Venom Wallet Address"])
    );
    if (validAllowlist) {
      setInvalidCsv(false);
      setAllowlist(data.map((d) => d["Venom Wallet Address"]));
    } else {
      setInvalidCsv(true);
      setAllowlist([]);
    }
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const csvData = e.target!.result as string;
      Papa.parse(csvData, {
        complete: (results) => {
          onCsvParsed(results.data as unknown as CsvData);
        },
        header: true,
      });
    };

    reader.readAsText(file);
  };

  const handleDrag = function (e: any) {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop: DragEventHandler<any> = function (e) {
    e.preventDefault();
    e.stopPropagation();
    // setDragActive(false);
    if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  return (
    <div>
      {allowlist.length > 0 ? (
        <div className="bg-green-600 p-4 flex justify-between items-center text-white rounded-lg">
          <div className="flex">
            <UserGroupIcon className="h-6 w-6 mr-2" />
            {allowlist.length} Address{allowlist.length > 1 ? "es" : ""}
          </div>
          <div>
            <button
              className="btn btn-ghost btn-sm btn-circle"
              onClick={() => setAllowlist([])}
            >
              <XCircleIcon className="w-6 h-6"></XCircleIcon>
            </button>
          </div>
        </div>
      ) : (
        <>
          <FileUploader handleChange={handleFile} name="file" types={["CSV"]}>
            <div>
              <label
                onDrop={handleDrop}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                className="flex justify-center w-full h-32 px-4 transition bg-slate-950 border-2 border-gray-800 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-600 focus:outline-none"
              >
                <span className="flex items-center space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <span className="font-medium text-gray-600">
                    Drop here the CSV file or
                    <span className="text-primary underline ml-2">browse</span>
                  </span>
                </span>
              </label>
            </div>
          </FileUploader>

          {invalidCsv && (
            <div className="text-red-500 my-4">
              <strong>Invalid CSV: </strong> Please, select a CSV following the
              template with valid VENOM addresses
            </div>
          )}

          <div>
            <button
              className="btn btn-block mt-4"
              onClick={downloadCsvTemplate}
            >
              Download CSV template
            </button>
          </div>
        </>
      )}
    </div>
  );
};
