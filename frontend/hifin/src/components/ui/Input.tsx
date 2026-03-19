import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-slate-600">
          {label}
        </label>
      )}
      <input
        className={`w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${error ? "border-rose-300" : ""} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-sm text-rose-600">{error}</p>
      )}
    </div>
  );
}
