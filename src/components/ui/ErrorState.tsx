import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'حدث خطأ أثناء تحميل البيانات',
  message = 'يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.',
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center bg-red-50/50 rounded-2xl border border-red-100 ${className}`}
      dir="rtl"
    >
      <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-3">
        <AlertCircle className="w-6 h-6 stroke-[2]" />
      </div>
      <h3 className="text-sm font-bold text-red-800 mb-1">{title}</h3>
      <p className="text-xs text-red-600/80 max-w-sm mb-4 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          icon={<RotateCcw className="w-3.5 h-3.5" />}
          className="bg-white hover:bg-red-50 text-red-700 border-red-200"
        >
          إعادة المحاولة
        </Button>
      )}
    </div>
  );
};
