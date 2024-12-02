import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-[#1A1A1A] rounded-xl p-6 ${className}`}>
      {children}
    </div>
  );
} 