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
          <label className="block text-sm text-gray-400 mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full bg-[#2D2D2D] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFD700] placeholder-gray-500 ${
            error ? 'border border-red-500' : ''
          } ${className}`}
          {...props}
        />
        <FormError message={error} />
      </div>
    );
  }
); 