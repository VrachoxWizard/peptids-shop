import React from "react";

export interface FormFieldInputProps {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  type?: string;
  icon?: React.ReactNode;
  helperText?: string;
  className?: string;
  readOnly?: boolean;
}

export default function FormFieldInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  type = "text",
  icon,
  helperText,
  className = "",
  readOnly = false,
}: FormFieldInputProps) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block text-xs font-semibold text-slate-700 mb-1"
      >
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-3 top-2.5 text-slate-400">
            {icon}
          </div>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`w-full rounded-lg border bg-white py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 shadow-xs ${
            icon ? "pl-9 pr-3" : "px-3.5"
          } ${
            readOnly
              ? "border-slate-200 bg-slate-50 text-slate-600 cursor-not-allowed"
              : error
              ? "border-red-400 focus:border-red-500"
              : "border-slate-300 focus:border-sky-700"
          }`}
        />
      </div>
      {helperText && !error && (
        <p className="text-[11px] text-slate-500 mt-1">{helperText}</p>
      )}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
