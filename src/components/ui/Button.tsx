import React, { type ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-bold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed rounded-xl active:scale-[0.98] select-none';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5',
  }[size];

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-orange-500 via-orange-600 to-purple-600 text-white shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 hover:opacity-95',
    secondary:
      'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200/60 shadow-sm',
    outline:
      'border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm',
    ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
    danger:
      'bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-500/20 active:bg-red-700',
  }[variant];

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        icon && <span className="flex-shrink-0">{icon}</span>
      )}
      <span>{children}</span>
    </button>
  );
};
