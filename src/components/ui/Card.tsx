import React, { type HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  bordered?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = false,
  bordered = true,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-2xl p-5 ${
        bordered ? 'border border-slate-100' : ''
      } shadow-sm shadow-slate-200/50 ${
        hoverable ? 'hover:shadow-md hover:border-slate-200 transition-all duration-200' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
