import React from 'react';

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-xl shadow border border-gray-200 p-6 mb-6 ${className}`}>
      {children}
    </div>
  );
} 