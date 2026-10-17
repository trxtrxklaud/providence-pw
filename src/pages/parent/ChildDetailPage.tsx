import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Receipt as ReceiptIcon, CalendarDays, Bell } from 'lucide-react';
import { parentService } from '@/services/parentService';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { getApiErrorMessage, formatCurrency, formatDate } from '@/utils/formatters';
import type { ChildLedgerResponse, ChildStudent, Receipt } from '@/types/parent';

const MONTH_LABELS: Record<string, string> = {
  '01': 'جاني', '02': 'يري', '03': 'مارس', '04': 'أريل',
  '05': 'ماي', '06': 'جوان', '07': 'جويلية', '08': 'أوت',
  '09': 'سبتمبر', '10': 'أكتوبر', '11': 'نومبر', '12': 'ديسمبر',
};

const monthLabel = (key: string): string => {
  const [y, m] = key.split('-');
  return `${MONTH_LABELS[m] ?? m} ${y}`;
};

/**
 * تاصيل ابن: الدتر الشهري (ما خلص) + آخر الوصولات.
 * الحضور والنتائج ستنضا حين تتوّر endpoints الخاصة بالوليّ.
 */
const ChildDetailPage: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const numericId = Number(childId);

  const [child, setChild] = useState<ChildStudent | null>(null);
  const [ledger, setLedger] = useState<ChildLedgerResponse | null>(null);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [kids, led, recs] = await Promise.all([
          parentService.getChildren(),
          parentService.getChildLedger(numericId).catch(() => null),
          parentService.getChildReceipts(numericId).catch(() => [] as Receipt[]),
        ]);
        if (!cancelled) {
          setChild(kids.find((k) => k.id === numericId) ?? null);
          setLedger(led);
          setReceipts(recs);
        }
      } catch (err) {
        if (!cancelled) setError(getApiErrorMessage(err));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [numericId]);

  if (error) {
    return <ErrorState title="تعذّر تحميل بيانات الابن" message={error} />;
  }

  if (isLoading) {
    return (
      <div className="space-y-4" dir="rtl">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!child) {
    return (
      <ErrorState
        title="هذا الابن غير مدرج ي قائمة أبنائك"
        message="يمكنك الاطلاع على بيانات أبنائك المسجّلين برقم هاتفك فقط."
      />
    );
  }

  const ledgerMonths = ledger ? Object.entries(ledger.ledger ?? {}) : [];
  const paidTotal = receipts
    .filter((r) => !r.cancelled_at)
    .reduce((sum, r) => sum + Number(r.amount ?? 0), 0);

  const latest = child.enrollments[0];

  return (
    <div className="space-y-6" dir="rtl">
      <header className="flex items-center gap-3">
        <Link
          to="/parent"
          className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
          aria-label="عودة"
        >
          <ArrowRight className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-purple-600 text-white flex items-center justify-center font-black text-lg shrink-0">
            {child.name.trim().charAt(0) || '؟'}
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">{child.name}</h1>
            <p className="text-xs text-slate-500">
              {latest ? `${latest.level ?? ''} ${latest.section ?? ''}` : 'لا تسجيل نشط'}
              {child.student_code ? ` — رقم ${child.student_code}` : ''}
            </p>
          </div>
        </div>
      </header>

      {/* ملخص الوصولات */}
      <Card className="bg-gradient-to-br from-slate-900 to-purple-950 border-none text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-orange-200">إجمالي ما خلّص هذه السنة</p>
            <p className="text-3xl font-black mt-1">{formatCurrency(paidTotal)}</p>
            <p className="text-[11px] text-slate-300 mt-1">
              {receipts.filter((r) => !r.cancelled_at).length} وصل معّل
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center">
            <ReceiptIcon className="w-6 h-6 text-orange-300" />
          </div>
        </div>
      </Card>

      {/* كش الأشهر المخلّصة */}
      <div>
        <h2 className="text-sm font-black text-slate-900 mb-3 flex items-center gap-1.5">
          <CalendarDays className="w-4 h-4 text-orange-500" />
          كش الأقساط المخلّصة
        </h2>

        {ledgerMonths.length === 0 ? (
          <EmptyState
            icon={<CalendarDays className="w-8 h-8" />}
            title="لا أقساط مسجّلة بعد"
            description="ستظهر هنا الأشهر المخلّصة ور تسجيلها من قبل القابض."
            compact
          />
        ) : (
          <div className="space-y-3">
            {ledgerMonths.map(([month, entries]) => (
              <Card key={month} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-black text-sm text-slate-800">{monthLabel(month)}</p>
                  <Badge variant="success">{entries.length} دعة</Badge>
                </div>
                <ul className="divide-y divide-slate-100">
                  {entries.map((e, i) => (
                    <li key={`${e.payment_id}-${i}`} className="py-2 flex items-center justify-between gap-2">
                      <div>
                        <p className="text-xs font-bold text-slate-700">
                          {formatCurrency(e.amount)}
                          <span className="font-normal text-slate-400"> — {e.method}</span>
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {formatDate(e.payment_date)}
                          {e.created_by ? ` — بواسطة ${e.created_by}` : ''}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* الوصولات التصيلية */}
      <div>
        <h2 className="text-sm font-black text-slate-900 mb-3 flex items-center gap-1.5">
          <ReceiptIcon className="w-4 h-4 text-orange-500" />
          سجل الوصولات
        </h2>

        {receipts.length === 0 ? (
          <EmptyState
            icon={<ReceiptIcon className="w-8 h-8" />}
            title="لا وصولات بعد"
            description="ستظهر هنا وصولات الدع ور تسجيلها."
            compact
          />
        ) : (
          <div className="space-y-3">
            {receipts.map((r) => (
              <Card key={r.id} className={r.cancelled_at ? 'opacity-60' : ''}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-black text-slate-900">{formatCurrency(r.amount)}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {formatDate(r.payment_date)} — {r.method}
                      {r.reference ? ` — مرجع ${r.reference}` : ''}
                    </p>
                    {r.months && r.months.length > 0 && (
                      <p className="text-[10px] text-slate-400 mt-1">
                        أشهر: {r.months.map(monthLabel).join('، ')}
                      </p>
                    )}
                  </div>
                  {r.cancelled_at ? (
                    <Badge variant="danger">ملغى</Badge>
                  ) : (
                    <Badge variant="success">معّل</Badge>
                  )}
                </div>

                {r.allocations.length > 0 && (
                  <ul className="mt-3 pt-3 border-t border-slate-100 space-y-1">
                    {r.allocations.map((a, i) => (
                      <li key={i} className="flex justify-between text-[11px] text-slate-500">
                        <span>{a.fee?.description ?? 'قسط'}</span>
                        <span className="font-bold">{formatCurrency(a.amount)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-slate-400 flex items-center gap-1.5">
        <Bell className="w-3.5 h-3.5 shrink-0" />
        الحضور والنتائج ستضا هنا ور تورها لأولياء الأمور.
      </p>
    </div>
  );
};

export default ChildDetailPage;
