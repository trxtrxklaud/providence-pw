import React, { type HTMLAttributes } from 'react';

export const Skeleton: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  ...props
}) => {
  return (
    <div
      className={`animate-pulse bg-slate-200/80 rounded-xl ${className}`}
      {...props}
    />
  );
};
