import {
  useEffect,
  useRef,
} from "react";

import {
  Controller,
} from "react-hook-form";

import type {
  Control,
  FieldErrors,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";

declare global {
  interface Window {
    $: any;
    jQuery: any;
  }
}

type Props<T extends FieldValues> = {
  label: string;
  name: Path<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
  rules?: RegisterOptions<T>;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

const BanglaInputField = <
  T extends FieldValues
>({
  label,
  name,
  control,
  errors,
  rules,
  placeholder,
  disabled = false,
  className = "",
}: Props<T>) => {
  const isRequired =
    typeof rules?.required === "object"
      ? rules.required.value
      : !!rules?.required;
  const inputRef =
    useRef<HTMLInputElement>(
      null
    );

  useEffect(() => {
    if (
      inputRef.current &&
      window.$
    ) {
      window.$(
        inputRef.current
      ).avro();
    }

    return () => {
      if (
        inputRef.current &&
        window.$
      ) {
        window.$(
          inputRef.current
        ).avro(
          "destroy"
        );
      }
    };
  }, []);

  const errorMessage =
    errors?.[name]?.message as
    | string
    | undefined;

  return (
    <div className={className}>
      <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
        <span>{label}</span>
        {isRequired && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field }) => (
          <input
            ref={(
              element
            ) => {
              inputRef.current =
                element;

              field.ref(
                element
              );
            }}
            type="text"
            value={
              field.value || ""
            }
            disabled={disabled}
            placeholder={placeholder}
            className={`
              w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500
             ${disabled
                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                : ""
              }
            `}
            onChange={(e) =>
              field.onChange(
                e.target.value
              )
            }
          />
        )}
      />

      {errorMessage && (
        <p className="text-red-500 text-xs mt-1">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default BanglaInputField;
