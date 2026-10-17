import type { ReactNode } from 'react';

interface Props {
  icon: string | ReactNode;
  title: string;
  message: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, message, action }: Props) {
  return (
    <div className="text-center py-12 px-4 bg-white rounded-2xl border border-gray-100 shadow-xs" dir="rtl">
      <div className="text-5xl mb-3 flex items-center justify-center">
        {typeof icon === 'string' ? <span>{icon}</span> : icon}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-gray-500 mb-5 max-w-sm mx-auto leading-relaxed">
        {message}
      </p>
      {action && <div className="inline-block">{action}</div>}
    </div>
  );
}
