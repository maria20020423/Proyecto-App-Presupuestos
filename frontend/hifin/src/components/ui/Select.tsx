import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string | number; label: string }[];
}

export function Select({ label, error, options, className = "", ...props }: SelectProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-slate-600">
          {label}
        </label>
      )}
      <select
        className={`w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${error ? "border-rose-300" : ""} ${className}`}
        {...props}
      >
        <option value="">Selecciona una opción</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-rose-600">{error}</p>
      )}
    </div>
  );
}
