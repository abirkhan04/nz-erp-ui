import {
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  Control,
  FieldErrors,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

import {
  Controller,
} from "react-hook-form";

type Option = {
  label: string;
  value: string | number;
};

type CommonInputFieldProps<T extends FieldValues> = {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  control?: Control<T>;

  type?:
    | "text"
    | "number"
    | "date"
    | "email"
    | "dropdown"
    | "searchable-dropdown"
    | "radio";

  options?: Option[];

  rules?: RegisterOptions<T>;

  placeholder?: string;

  className?: string;

  disabled?: boolean;

  onSearchChange?: (
    searchText: string
  ) => void;

  onOptionSelect?: (
    option: Option
  ) => void;
};

const CommonInputField = <T extends FieldValues>({
  label,
  name,
  register,
  errors,
  control,
  type = "text",
  options = [],
  rules,
  placeholder,
  className = "",
  disabled = false,
  onSearchChange,
  onOptionSelect,
}: CommonInputFieldProps<T>) => {
  const [searchText, setSearchText] =
    useState("");

  const [showDropdown, setShowDropdown] =
    useState(false);

  const wrapperRef =
    useRef<HTMLDivElement>(null);

  const inputClass = `
    w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
    focus:outline-none focus:ring-2 focus:ring-blue-500
    disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
  `;

  const labelClass =
    "block text-sm font-medium text-gray-700 mb-1";

  const errorMessage =
    errors?.[name]?.message as
      | string
      | undefined;

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(
          event.target as Node
        )
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <div className={className}>
      <label className={labelClass}>
        {label}
      </label>

      {type === "dropdown" ? (
        <select
          {...register(name, rules)}
          disabled={disabled}
          className={inputClass}
        >
          <option value="">
            {placeholder ||
              `Select ${label}`}
          </option>

          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      ) : type ===
          "searchable-dropdown" &&
        control ? (
        <Controller
          control={control}
          name={name}
          rules={rules}
          render={({ field }) => (
            <div
              ref={wrapperRef}
              className="relative"
            >
              <input
                type="text"
                value={searchText}
                disabled={disabled}
                placeholder={
                  placeholder ||
                  `Search ${label}`
                }
                className={inputClass}
                onFocus={() => {
                  if (!disabled) {
                    setShowDropdown(true);
                  }
                }}
                onChange={(e) => {
                  if (disabled) return;

                  const value =
                    e.target.value;

                  setSearchText(value);

                  setShowDropdown(true);

                  onSearchChange?.(
                    value
                  );
                }}
              />

              {!disabled &&
                showDropdown &&
                options.length > 0 && (
                  <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {options.map(
                      (option) => (
                        <div
                          key={
                            option.value
                          }
                          className="px-3 py-2 text-sm hover:bg-blue-100 cursor-pointer"
                          onClick={() => {
                            field.onChange(
                              option.value
                            );

                            setSearchText(
                              option.label
                            );

                            setShowDropdown(
                              false
                            );

                            onOptionSelect?.(
                              option
                            );
                          }}
                        >
                          {option.label}
                        </div>
                      )
                    )}
                  </div>
                )}
            </div>
          )}
        />
      ) : type === "radio" ? (
        <div className="flex gap-4">
          {options.map((option) => (
            <label
              key={option.value}
              className={`flex items-center gap-2 text-sm ${
                disabled
                  ? "opacity-60 cursor-not-allowed"
                  : ""
              }`}
            >
              <input
                type="radio"
                value={option.value}
                disabled={disabled}
                {...register(name, rules)}
              />
              {option.label}
            </label>
          ))}
        </div>
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          {...register(name, rules)}
          className={inputClass}
        />
      )}

      {errorMessage && (
        <p className="text-red-500 text-xs mt-1">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default CommonInputField;