import React, { useEffect, useState } from 'react';
import { Receipt as ReceiptIcon, FileCheck, Calendar } from 'lucide-react';
import { parentService } from '@/services/parentService';
import type { Receipt } from '@/types/parent';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';

export interface ChildReceiptsTabProps {
  childId: number;
}

export const ChildReceiptsTab: React.FC<ChildReceiptsTabProps> = ({ childId }) => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReceipts = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await parentService.getChildReceipts(childId);
      setReceipts(res || []);
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message || 'تعذر تحميل قائمة الوصولات.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, [childId]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchReceipts} />;
  }

  return (
    <div className="space-y-4" dir="rtl">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <ReceiptIcon className="w-4 h-4 text-purple-600" />
            سجل الوصولات والمدفوعات الموثقة
          </h4>
          <span className="text-[10px] text-slate-400">إجمالي: {receipts.length} وصل</span>
        </div>

        {receipts.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">
            لا توجد وصولات مسجلة حالياً لهذا الطالب.
          </p>
        ) : (
          <div className="space-y-3">
            {receipts.map((rcpt) => (
              <div
                key={rcpt.id}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                      #{rcpt.id}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        وصل خلاص نقدي ({rcpt.method || 'نقداً'})
                      </p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {formatDate(rcpt.payment_date)}
                      </p>
                    </div>
                  </div>

                  <div className="text-left">
                    <span className="text-sm font-black text-emerald-600 block">
                      +{formatCurrency(rcpt.amount)}
                    </span>
                    <Badge variant="success" size="sm">
                      <FileCheck className="w-3 h-3" /> معتمد
                    </Badge>
                  </div>
                </div>

                {rcpt.months && rcpt.months.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] text-slate-500">
                    <span className="font-semibold">الأشهر المغطاة:</span>
                    <span>{rcpt.months.join(', ')}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
