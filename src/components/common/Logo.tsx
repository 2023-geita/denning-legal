import React from 'react';

interface LogoProps {
  className?: string;
}

export default function Logo({ className = '' }: LogoProps) {
  return (
    <svg 
      className={className}
      width="32" 
      height="32" 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M50 0C22.4 0 0 22.4 0 50C0 77.6 22.4 100 50 100C77.6 100 100 77.6 100 50C100 22.4 77.6 0 50 0ZM50 90C27.9 90 10 72.1 10 50C10 27.9 27.9 10 50 10C72.1 10 90 27.9 90 50C90 72.1 72.1 90 50 90Z" 
        fill="currentColor"
      />
      <path 
        d="M65 25L50 40L35 25L25 35L40 50L25 65L35 75L50 60L65 75L75 65L60 50L75 35L65 25Z" 
        fill="currentColor"
      />
    </svg>
  );
} 