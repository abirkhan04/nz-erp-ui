import React from "react";
import {
  useFormContext,
} from "react-hook-form";

import type { EmployeeFormValues } from "./EmployeeFormValues";
import {
  Upload,
  Trash2,
  FileText,
  CheckCircle,
} from "lucide-react";

const DocumentsUploadForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
  } = useFormContext<EmployeeFormValues>();

  const onSubmit = (
    data: EmployeeFormValues
  ) => {
    console.log("Uploaded Documents:", data);
  };

  const documentCards = [
    {
      id: 1,
      title: "NID / Birth Certificate",
      field: "nidBirthCertificate",
      required: true,
    },
    {
      id: 2,
      title: "Educational Document",
      field: "educationalDocument",
      required: true,
    },
    {
      id: 3,
      title: "Signature",
      field: "signature",
      required: true,
    },
    {
      id: 4,
      title: "Medical Certificate",
      field: "medicalCertificate",
      required: true,
    },
    {
      id: 5,
      title: "Character Certificate",
      field: "characterCertificate",
      required: false,
    },
    {
      id: 6,
      title: "Experience Certificate",
      field: "experienceCertificate",
      required: false,
    },
    {
      id: 7,
      title: "Women's Night Duty Concern",
      field: "womenNightDutyConcern",
      required: false,
    },
    {
      id: 8,
      title: "Others",
      field: "others",
      required: false,
    },
  ] as const;

  const inputClass = "hidden";

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* LEFT CONTENT */}
        <div className="lg:col-span-3 space-y-6">
          {/* HEADER */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center gap-3">
            <div className="text-blue-600">
              <Upload size={20} />
            </div>

            <p className="text-sm text-gray-700">
              Upload clear scanned copies of the
              following documents. Supported formats:
              JPG, PNG, PDF. Maximum file size per
              document: 2MB.
            </p>
          </div>

          {/* DOCUMENT GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {documentCards.map((doc) => {
              const fileValue = watch(doc.field);

              const uploadedFile =
                fileValue?.length > 0
                  ? fileValue[0]
                  : null;

              return (
                <div
                  key={doc.id}
                  className="border rounded-2xl p-4 bg-white relative"
                >
                  {/* NUMBER */}
                  <div className="absolute top-4 left-4 w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold">
                    {doc.id}
                  </div>

                  {/* VERIFIED ICON */}
                  {uploadedFile && (
                    <div className="absolute top-4 right-4 text-green-500">
                      <CheckCircle size={20} />
                    </div>
                  )}

                  {/* TITLE */}
                  <div className="mt-10 mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 leading-5">
                      {doc.title}

                      {doc.required && (
                        <span className="text-red-500">
                          {" "}
                          *
                        </span>
                      )}
                    </h3>
                  </div>

                  {/* PREVIEW */}
                  <div className="h-36 border rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden">
                    {uploadedFile ? (
                      uploadedFile.type.includes(
                        "image"
                      ) ? (
                        <img
                          src={URL.createObjectURL(
                            uploadedFile
                          )}
                          alt="preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <FileText size={40} />

                          <p className="text-xs mt-2">
                            PDF File
                          </p>
                        </div>
                      )
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <Upload size={35} />

                        <p className="text-xs mt-2">
                          Upload File
                        </p>
                      </div>
                    )}
                  </div>

                  {/* FILE NAME */}
                  <div className="mt-3 min-h-[40px]">
                    {uploadedFile ? (
                      <>
                        <p className="text-xs text-blue-600 break-all">
                          {uploadedFile.name}
                        </p>

                        <p className="text-[11px] text-gray-500 mt-1">
                          {(
                            uploadedFile.size / 1024
                          ).toFixed(0)}{" "}
                          KB
                        </p>
                      </>
                    ) : (
                      <p className="text-xs text-gray-400">
                        No file uploaded
                      </p>
                    )}
                  </div>

                  {/* FILE INPUT */}
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    {...register(doc.field, {
                      required: doc.required,
                    })}
                    id={doc.field}
                    className={inputClass}
                  />

                  {/* ACTION BUTTONS */}
                  <div className="flex gap-3 mt-4">
                    {/* UPLOAD BUTTON */}
                    <label
                      htmlFor={doc.field}
                      className="
                        flex-1
                        border border-blue-300
                        text-blue-600
                        rounded-lg
                        px-3 py-2
                        text-sm
                        flex items-center justify-center gap-2
                        hover:bg-blue-50
                        cursor-pointer
                      "
                    >
                      <Upload size={15} />

                      {uploadedFile
                        ? "Replace"
                        : "Upload"}
                    </label>

                    {/* REMOVE BUTTON */}
                    <button
                      type="button"
                      onClick={() => {
                        setValue(
                          doc.field,
                          undefined as any
                        );

                        const input =
                          document.getElementById(
                            doc.field
                          ) as HTMLInputElement;

                        if (input) {
                          input.value = "";
                        }
                      }}
                      className="
                        flex-1
                        border border-red-200
                        text-red-500
                        rounded-lg
                        px-3 py-2
                        text-sm
                        flex items-center justify-center gap-2
                        hover:bg-red-50
                      "
                    >
                      <Trash2 size={15} />
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="
                px-6 py-2
                border border-gray-300
                rounded-lg
                hover:bg-gray-50
              "
            >
              Save as Draft
            </button>

            <button
              type="submit"
              className="
                px-6 py-2
                bg-blue-600
                text-white
                rounded-lg
                hover:bg-blue-700
              "
            >
              Next
            </button>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-5">
          {/* GUIDELINES */}
          <div className="bg-white border rounded-2xl p-5">
            <h2 className="text-lg font-semibold text-blue-700 mb-5">
              Guidelines
            </h2>

            <div className="space-y-4">
              {[
                "All documents must be clear and readable.",
                "Ensure the document is not expired.",
                "File size should not exceed 2MB.",
                "Supported formats: JPG, PNG, PDF.",
                "Document will be verified during approval process.",
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3"
                >
                  <CheckCircle
                    size={18}
                    className="text-green-500 mt-0.5"
                  />

                  <p className="text-sm text-gray-600 leading-5">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* IMPORTANT NOTE */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
            <h2 className="text-lg font-semibold text-blue-700 mb-4">
              Important Note
            </h2>

            <p className="text-sm text-gray-600 leading-6">
              Photo and biometric information will
              be captured and verified by the IT
              Department after HR & Management
              approval.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
};

export default DocumentsUploadForm;