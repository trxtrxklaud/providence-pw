import React, { type HTMLAttributes } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'orange' | 'neutral';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
  }[size];

  const variantClasses = {
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200/60',
    danger: 'bg-red-50 text-red-700 border border-red-200/60',
    info: 'bg-blue-50 text-blue-700 border border-blue-200/60',
    purple: 'bg-purple-50 text-purple-700 border border-purple-200/60',
    orange: 'bg-orange-50 text-orange-700 border border-orange-200/60',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1 font-bold rounded-full select-none ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
