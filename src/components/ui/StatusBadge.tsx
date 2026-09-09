import React from 'react';
import { cn } from '@/lib/utils';
import { ProductStatus } from '@/types/status';

interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: ProductStatus;
}

const statusConfig: Record<ProductStatus, { label: string; className: string }> = {
  COMING_SOON: { label: 'Coming Soon', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  PROTOTYPE: { label: 'Prototype', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
  PRE_ORDER: { label: 'Pre-Order', className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
  AVAILABLE: { label: 'In Stock', className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  OUT_OF_STOCK: { label: 'Out of Stock', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  DISCONTINUED: { label: 'Discontinued', className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400' },
};

export function StatusBadge({ status, className, ...props }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-tight transition-colors",
        config.className,
        className
      )}
      {...props}
    >
      {config.label}
    </span>
  );
}
