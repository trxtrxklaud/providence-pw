import React, { useEffect, useState } from 'react';
import { CreditCard, CheckCircle2, Clock } from 'lucide-react';
import { parentService } from '@/services/parentService';
import type { ChildLedgerResponse } from '@/types/parent';
import { formatCurrency } from '@/utils/formatters';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';

export interface ChildLedgerTabProps {
  childId: number;
}

export const ChildLedgerTab: React.FC<ChildLedgerTabProps> = ({ childId }) => {
  const [data, setData] = useState<ChildLedgerResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLedger = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await parentService.getChildLedger(childId);
      setData(res);
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message || 'تعذر تحميل كشف الحساب المالي.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLedger();
  }, [childId]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchLedger} />;
  }

  // Flatten ledger items if grouped by month
  const rawLedger = data?.ledger;
  const items = Array.isArray(rawLedger)
    ? rawLedger
    : rawLedger && typeof rawLedger === 'object'
    ? Object.values(rawLedger).flat()
    : [];

  const totalDue = items.reduce((sum, it) => sum + (Number(it.amount_due) || 0), 0);
  const totalPaid = items.reduce((sum, it) => sum + (Number(it.amount_paid) || 0), 0);
  const totalBalance = Math.max(0, totalDue - totalPaid);

  return (
    <div className="space-y-4" dir="rtl">
      {/* Financial Overview Card */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 rounded-2xl p-5 text-white shadow-md">
        <span className="text-xs font-semibold text-orange-400 flex items-center gap-1.5">
          <CreditCard className="w-4 h-4" /> الوضع المالي للسنة الحالية
        </span>
        <div className="mt-3 grid grid-cols-2 gap-4">
          <div>
            <span className="text-[11px] text-slate-400">إجمالي المدفوع</span>
            <p className="text-lg font-black text-emerald-400">{formatCurrency(totalPaid)}</p>
          </div>
          <div>
            <span className="text-[11px] text-slate-400">المتخلّد بذمة الولي</span>
            <p className="text-lg font-black text-orange-400">{formatCurrency(totalBalance)}</p>
          </div>
        </div>
      </div>

      {/* Monthly Ledger Items */}
      <Card className="p-4">
        <h4 className="text-xs font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">
          جدول الأقساط والرسوم الشهرية
        </h4>

        {items.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">
            لا توجد مستحقات مسجلة حالياً لهذا الطالب.
          </p>
        ) : (
          <div className="space-y-2.5">
            {items.map((item, idx) => {
              const isPaid = (Number(item.balance) || 0) <= 0;
              return (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      {item.title || item.month || `قسط شهري #${idx + 1}`}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500">
                      <span>المبلغ: {formatCurrency(item.amount_due)}</span>
                      <span>المدفوع: {formatCurrency(item.amount_paid)}</span>
                    </div>
                  </div>

                  <div className="text-left flex flex-col items-end gap-1">
                    {isPaid ? (
                      <Badge variant="success" size="sm">
                        <CheckCircle2 className="w-3 h-3" /> تم الخلاص
                      </Badge>
                    ) : (
                      <Badge variant="warning" size="sm">
                        <Clock className="w-3 h-3" /> متبقي: {formatCurrency(item.balance)}
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};
