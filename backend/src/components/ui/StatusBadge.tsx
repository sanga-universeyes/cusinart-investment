import React from 'react';

interface StatusBadgeProps {
  status: 'pending' | 'completed' | 'failed' | 'active' | 'cancelled';
  children: React.ReactNode;
}

export function StatusBadge({ status, children }: StatusBadgeProps) {
  const variants = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
    failed: 'bg-red-100 text-red-800 border-red-200',
    active: 'bg-blue-100 text-blue-800 border-blue-200',
    cancelled: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[status]}`}>
      {children}
    </span>
  );
}