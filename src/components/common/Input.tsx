import React, { forwardRef } from 'react';
import { FormError } from './FormError';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-gray-400 text-sm mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full bg-[#1A1A1A] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00A3B4] ${
            error ? 'border border-red-500' : ''
          } ${className}`}
          {...props}
        />
        <FormError message={error} />
      </div>
    );
  }
); 