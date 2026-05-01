import React, { useEffect } from "react";
import {
  useFormContext,
} from "react-hook-form";

import type { EmployeeFormValues } from "./EmployeeFormValues";


const AddressDetailsForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<EmployeeFormValues>();

  const watchSameAsPresent = watch(
    "sameAsPresentAddress"
  );

  const presentAddressValues = watch();

  useEffect(() => {
    if (watchSameAsPresent) {
      setValue(
        "permanentVillageRoadHouse",
        presentAddressValues.presentVillageRoadHouse || ""
      );

      setValue(
        "permanentPostOffice",
        presentAddressValues.presentPostOffice || ""
      );

      setValue(
        "permanentThanaUpazila",
        presentAddressValues.presentThanaUpazila || ""
      );

      setValue(
        "permanentDistrict",
        presentAddressValues.presentDistrict || ""
      );

      setValue(
        "permanentDivision",
        presentAddressValues.presentDivision || ""
      );

      setValue(
        "permanentAddressBangla",
        presentAddressValues.presentAddressBangla || ""
      );

      setValue(
        "permanentPostOfficeBangla",
        presentAddressValues.presentPostOfficeBangla || ""
      );

      setValue(
        "permanentThanaUpazilaBangla",
        presentAddressValues.presentThanaUpazilaBangla || ""
      );

      setValue(
        "permanentDistrictBangla",
        presentAddressValues.presentDistrictBangla || ""
      );

      setValue(
        "permanentDivisionBangla",
        presentAddressValues.presentDivisionBangla || ""
      );
    }
  }, [
    watchSameAsPresent,
    presentAddressValues,
    setValue,
  ]);

  const onSubmit = (
    data: EmployeeFormValues
  ) => {
    console.log("Address Details:", data);
  };

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  const disabledInputClass =
    "w-full border border-gray-200 bg-gray-100 rounded-lg px-3 py-2 text-sm";

  const labelClass =
    "block text-sm font-medium text-gray-700 mb-1";

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-6">
        {/* PRESENT ADDRESS */}
        <div className="bg-white border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-blue-700">
              Present Address (Current Address)
            </h2>

            <div className="text-sm text-red-500">
              * Marked fields are mandatory
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
            <div>
              <label className={labelClass}>
                Village / Road / House *
              </label>

              <input
                {...register(
                  "presentVillageRoadHouse",
                  {
                    required:
                      "Present address is required",
                  }
                )}
                className={inputClass}
              />

              {errors.presentVillageRoadHouse && (
                <p className="text-red-500 text-xs mt-1">
                  {
                    errors.presentVillageRoadHouse
                      .message
                  }
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>
                Post Office *
              </label>

              <input
                {...register("presentPostOffice")}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Thana / Upazila *
              </label>

              <input
                {...register(
                  "presentThanaUpazila"
                )}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                District *
              </label>

              <select
                {...register("presentDistrict")}
                className={inputClass}
              >
                <option value="">
                  Select District
                </option>

                <option value="Dhaka">
                  Dhaka
                </option>

                <option value="Narayanganj">
                  Narayanganj
                </option>
              </select>
            </div>

            <div>
              <label className={labelClass}>
                Division *
              </label>

              <select
                {...register("presentDivision")}
                className={inputClass}
              >
                <option value="">
                  Select Division
                </option>

                <option value="Dhaka">
                  Dhaka
                </option>

                <option value="Chittagong">
                  Chittagong
                </option>
              </select>
            </div>

            <div>
              <label className={labelClass}>
                Address (Bangla) *
              </label>

              <textarea
                {...register(
                  "presentAddressBangla"
                )}
                className={inputClass}
                rows={3}
              />
            </div>

            <div>
              <label className={labelClass}>
                Post Office (Bangla)
              </label>

              <input
                {...register(
                  "presentPostOfficeBangla"
                )}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Thana / Upazila (Bangla)
              </label>

              <input
                {...register(
                  "presentThanaUpazilaBangla"
                )}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                District (Bangla)
              </label>

              <input
                {...register(
                  "presentDistrictBangla"
                )}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Division (Bangla)
              </label>

              <input
                {...register(
                  "presentDivisionBangla"
                )}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* PERMANENT ADDRESS */}
        <div className="bg-white border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-blue-700">
              Permanent Address
            </h2>

            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                {...register(
                  "sameAsPresentAddress"
                )}
              />

              Same as Present Address
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
            <div>
              <label className={labelClass}>
                Village / Road / House *
              </label>

              <input
                {...register(
                  "permanentVillageRoadHouse"
                )}
                className={
                  watchSameAsPresent
                    ? disabledInputClass
                    : inputClass
                }
                disabled={watchSameAsPresent}
              />
            </div>

            <div>
              <label className={labelClass}>
                Post Office *
              </label>

              <input
                {...register(
                  "permanentPostOffice"
                )}
                className={
                  watchSameAsPresent
                    ? disabledInputClass
                    : inputClass
                }
                disabled={watchSameAsPresent}
              />
            </div>

            <div>
              <label className={labelClass}>
                Thana / Upazila *
              </label>

              <input
                {...register(
                  "permanentThanaUpazila"
                )}
                className={
                  watchSameAsPresent
                    ? disabledInputClass
                    : inputClass
                }
                disabled={watchSameAsPresent}
              />
            </div>

            <div>
              <label className={labelClass}>
                District *
              </label>

              <select
                {...register(
                  "permanentDistrict"
                )}
                className={
                  watchSameAsPresent
                    ? disabledInputClass
                    : inputClass
                }
                disabled={watchSameAsPresent}
              >
                <option value="">
                  Select District
                </option>

                <option value="Dhaka">
                  Dhaka
                </option>

                <option value="Narayanganj">
                  Narayanganj
                </option>
              </select>
            </div>

            <div>
              <label className={labelClass}>
                Division *
              </label>

              <select
                {...register(
                  "permanentDivision"
                )}
                className={
                  watchSameAsPresent
                    ? disabledInputClass
                    : inputClass
                }
                disabled={watchSameAsPresent}
              >
                <option value="">
                  Select Division
                </option>

                <option value="Dhaka">
                  Dhaka
                </option>

                <option value="Chittagong">
                  Chittagong
                </option>
              </select>
            </div>

            <div>
              <label className={labelClass}>
                Address (Bangla) *
              </label>

              <textarea
                {...register(
                  "permanentAddressBangla"
                )}
                className={
                  watchSameAsPresent
                    ? disabledInputClass
                    : inputClass
                }
                rows={3}
                disabled={watchSameAsPresent}
              />
            </div>

            <div>
              <label className={labelClass}>
                Post Office (Bangla)
              </label>

              <input
                {...register(
                  "permanentPostOfficeBangla"
                )}
                className={
                  watchSameAsPresent
                    ? disabledInputClass
                    : inputClass
                }
                disabled={watchSameAsPresent}
              />
            </div>

            <div>
              <label className={labelClass}>
                Thana / Upazila (Bangla)
              </label>

              <input
                {...register(
                  "permanentThanaUpazilaBangla"
                )}
                className={
                  watchSameAsPresent
                    ? disabledInputClass
                    : inputClass
                }
                disabled={watchSameAsPresent}
              />
            </div>

            <div>
              <label className={labelClass}>
                District (Bangla)
              </label>

              <input
                {...register(
                  "permanentDistrictBangla"
                )}
                className={
                  watchSameAsPresent
                    ? disabledInputClass
                    : inputClass
                }
                disabled={watchSameAsPresent}
              />
            </div>

            <div>
              <label className={labelClass}>
                Division (Bangla)
              </label>

              <input
                {...register(
                  "permanentDivisionBangla"
                )}
                className={
                  watchSameAsPresent
                    ? disabledInputClass
                    : inputClass
                }
                disabled={watchSameAsPresent}
              />
            </div>
          </div>
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
    </form>
  );
};

export default AddressDetailsForm;