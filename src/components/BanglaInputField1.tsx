import {
  useRef,
  useState,
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
    OmicronLab: {
      Avro: {
        Phonetic: {
          parse: (
            text: string
          ) => string;
        };
      };
    };
  }
}

type BanglaInputFieldProps<
  T extends FieldValues
> = {
  label: string;
  name: Path<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
  rules?: RegisterOptions<T>;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
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
  className = "",
  disabled = false,
}: BanglaInputFieldProps<T>) => {
  const [
    romanBuffer,
    setRomanBuffer,
  ] = useState("");

  const inputRef =
    useRef<HTMLInputElement>(
      null
    );

  const inputClass = `
    w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
    focus:outline-none focus:ring-2 focus:ring-blue-500
    disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
  `;

  const errorMessage =
    errors?.[name]?.message as
      | string
      | undefined;

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field }) => (
          <input
            ref={inputRef}
            type="text"
            disabled={disabled}
            value={
              field.value || ""
            }
            placeholder={
              placeholder
            }
            className={
              inputClass
            }
            autoComplete="off"
            onKeyDown={(
              e
            ) => {
              if (
                disabled
              ) {
                return;
              }

              // Allow tab navigation
              if (
                e.key ===
                "Tab"
              ) {
                return;
              }

              // Handle Backspace
              if (
                e.key ===
                "Backspace"
              ) {
                e.preventDefault();

                const updatedRoman =
                  romanBuffer.slice(
                    0,
                    -1
                  );

                setRomanBuffer(
                  updatedRoman
                );

                field.onChange(
                  window
                    .OmicronLab
                    .Avro
                    .Phonetic
                    .parse(
                      updatedRoman
                    )
                );

                return;
              }

              // Handle Enter
              if (
                e.key ===
                "Enter"
              ) {
                return;
              }

              // Ignore modifiers
              if (
                e.ctrlKey ||
                e.altKey ||
                e.metaKey
              ) {
                return;
              }

              // Only process printable characters
              if (
                e.key.length !==
                1
              ) {
                return;
              }

              e.preventDefault();

              const updatedRoman =
                romanBuffer +
                e.key;

              setRomanBuffer(
                updatedRoman
              );

              const bangla =
                window
                  .OmicronLab
                  .Avro
                  .Phonetic
                  .parse(
                    updatedRoman
                  );

              field.onChange(
                bangla
              );
            }}
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

export default
  BanglaInputField;