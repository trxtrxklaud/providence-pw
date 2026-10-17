import React, { type InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, hint, className = '', id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="w-full text-right" dir="rtl">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-bold text-slate-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute right-3.5 flex items-center pointer-events-none text-slate-400">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full bg-white border text-slate-900 text-sm rounded-xl transition-all duration-200 outline-none
              ${icon ? 'pr-11 pl-4' : 'px-4'} py-3
              ${
                error
                  ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                  : 'border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
              }
              placeholder:text-slate-400 shadow-sm
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1.5 text-xs font-semibold text-red-600 flex items-center gap-1">
            <span>â€¢</span> {error}
          </p>
        )}
        {!error && hint && (
          <p className="mt-1 text-xs text-slate-400">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
