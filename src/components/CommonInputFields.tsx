import React from "react";
import type {
  FieldErrors,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
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

  type?:
    | "text"
    | "number"
    | "date"
    | "email"
    | "dropdown"
    | "radio";

  options?: Option[];

  rules?: RegisterOptions<T>;

  placeholder?: string;

  className?: string;
};

const CommonInputField = <T extends FieldValues>({
  label,
  name,
  register,
  errors,
  type = "text",
  options = [],
  rules,
  placeholder,
  className = "",
}: CommonInputFieldProps<T>) => {
  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  const labelClass =
    "block text-sm font-medium text-gray-700 mb-1";

  const errorMessage =
    errors?.[name]?.message as string | undefined;

  return (
    <div className={className}>
      <label className={labelClass}>
        {label}
      </label>

      {type === "dropdown" ? (
        <select
          {...register(name, rules)}
          className={inputClass}
        >
          <option value="">
            {placeholder || `Select ${label}`}
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
      ) : type === "radio" ? (
        <div className="flex gap-4">
          {options.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 text-sm"
            >
              <input
                type="radio"
                value={option.value}
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