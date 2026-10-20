import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  title: string;
  description?: string;
  /** يقبل مكوّن أيقونة أو عنصر JSX جاهز — كلا الاستخدامين مريح. */
  icon?: LucideIcon | React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  /** نسخة أضيق للبطاقات داخل الشاشات المزدحمة. */
  compact?: boolean;
  className?: string;
}

const renderIcon = (
  icon: LucideIcon | React.ReactNode | undefined,
  size: string
): React.ReactNode => {
  if (!icon) {
    const Icon = Inbox;
    return <Icon className={size} strokeWidth={1.75} />;
  }
  if (typeof icon === 'function') {
    const Icon = icon;
    return <Icon className={size} strokeWidth={1.75} />;
  }
  return icon;
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  compact = false,
  className = '',
}) => {
  const iconSize = compact ? 'w-5 h-5' : 'w-7 h-7';

  return (
    <div
      className={`flex flex-col items-center justify-center ${
        compact ? 'p-5' : 'p-8'
      } text-center bg-white rounded-2xl border border-slate-100 ${className}`}
      dir="rtl"
    >
      <div
        className={`${
          compact ? 'w-11 h-11 mb-2' : 'w-14 h-14 mb-4'
        } bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center border border-slate-100 shadow-inner`}
      >
        {renderIcon(icon, iconSize)}
      </div>
      <h3 className={`${compact ? 'text-sm' : 'text-base'} font-bold text-slate-800 mb-1`}>
        {title}
      </h3>
      {description && (
        <p className="text-xs text-slate-500 max-w-sm leading-relaxed">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction} className="mt-4">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
