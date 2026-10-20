import React, { useEffect, useState } from 'react';
import { Search, Users, School, ClipboardList, TrendingUp } from 'lucide-react';
import { staffService } from '@/services/staffService';
import { useAuthStore } from '@/store/useAuthStore';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { getApiErrorMessage } from '@/utils/formatters';
import type { DashboardStats, StudentListItem } from '@/types/staff';

/**
 * لوحة الإداري: إحصاءات + بحث سريع + اختصارات حسب الصلاحيات.
 * الوصول للطلاب مشروط بـ manage_students — الباقي اختصارات عرض قط.
 */
const StaffDashboard: React.FC = () => {
  const { hasPermission } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<StudentListItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  const canManageStudents = hasPermission('manage_students');
  const canViewReports = hasPermission('view_reports');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await staffService.getDashboard();
        if (!cancelled) setStats(data);
      } catch (err) {
        if (!cancelled) setError(getApiErrorMessage(err));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || !canManageStudents) return;

    setIsSearching(true);
    setSearchError('');
    setResults([]);
    try {
      const data = await staffService.getStudents(query.trim());
      setResults(Array.isArray(data) ? data : (data.data ?? []));
    } catch (err) {
      setSearchError(getApiErrorMessage(err));
    } finally {
      setIsSearching(false);
    }
  };

  if (error) {
    return <ErrorState title="تعذّر تحميل اللوحة" message={error} />;
  }

  const shortcuts: { label: string; desc: string; icon: React.ReactNode; permitted: boolean }[] = [
    {
      label: 'التلاميذ',
      desc: 'قوائم وبحث وإدارة ملات التلاميذ',
      icon: <Users className="w-5 h-5" />,
      permitted: canManageStudents,
    },
    {
      label: 'التسجيلات والأقسام',
      desc: 'متابعة التسجيلات وتوزيع الأقسام',
      icon: <School className="w-5 h-5" />,
      permitted: canManageStudents,
    },
    {
      label: 'المدوعات والتحصيل',
      desc: 'وصولات وتحصيل ومتابعة المعاليم',
      icon: <ClipboardList className="w-5 h-5" />,
      permitted: hasPermission('manage_payments'),
    },
    {
      label: 'التقارير',
      desc: 'تقارير مالية وتحليلية شاملة',
      icon: <TrendingUp className="w-5 h-5" />,
      permitted: canViewReports,
    },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      <header>
        <h1 className="text-2xl font-black text-slate-900">لوحة العمل الإداري</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {stats?.academic_year?.name
            ? `السنة الدراسية ${stats.academic_year.name}`
            : 'المهام اليومية والاختصارات'}
        </p>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-8 w-16" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard label="التلاميذ النشطون" value={stats?.total_active_students ?? '—'} />
          <StatCard label="تسجيلات بانتظار الخلاص" value={stats?.unpaid_registration_count ?? '—'} />
          <StatCard
            label="المتخلّد العام (دينة على المدرسة)"
            value={
              stats?.outstanding_balance !== undefined
                ? String(stats.outstanding_balance)
                : '—'
            }
          />
        </div>
      )}

      {/* البحث السريع — يظهر قط لمن يملك manage_students */}
      {canManageStudents && (
        <Card>
          <h2 className="text-sm font-black text-slate-900 mb-3">بحث سريع ي التلاميذ</h2>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="search"
              placeholder="اسم، رقم تسجيل، أو هات وليّ..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
            <button
              type="submit"
              disabled={!query.trim() || isSearching}
              className="shrink-0 px-5 rounded-xl bg-gradient-to-r from-orange-500 to-purple-600 text-white font-bold text-sm disabled:opacity-50"
            >
              {isSearching ? '...' : 'بحث'}
            </button>
          </form>

          {searchError && <p className="mt-3 text-xs text-red-600">{searchError}</p>}

          {isSearching && (
            <div className="mt-4 space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          )}

          {!isSearching && results.length > 0 && (
            <ul className="mt-4 divide-y divide-slate-100">
              {results.slice(0, 10).map((s) => (
                <li key={s.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-sm text-slate-800">
                      {s.first_name} {s.last_name}
                    </p>
                    <p className="text-xs text-slate-400">{s.student_code ?? '—'}</p>
                  </div>
                  <span className="text-xs text-slate-400">{s.guardian_phone ?? '—'}</span>
                </li>
              ))}
            </ul>
          )}

          {!isSearching && results.length === 0 && query && !searchError && (
            <p className="mt-4 text-xs text-slate-400 text-center">لا نتائج مطابقة.</p>
          )}
        </Card>
      )}

      {/* الاختصارات حسب الصلاحيات */}
      <div>
        <h2 className="text-sm font-black text-slate-900 mb-3">اختصارات العمل</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {shortcuts.map((s) => (
            <Card
              key={s.label}
              className={!s.permitted ? 'opacity-50' : 'hoverable'}
            >
              <div className="flex items-start gap-3">
                <span className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                  {s.icon}
                </span>
                <div>
                  <p className="font-bold text-sm text-slate-800">{s.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{s.desc}</p>
                  {!s.permitted && (
                    <p className="text-[10px] text-slate-400 mt-1">
                      غير متاح — يتطلب صلاحية إضاية
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">
        الاختصارات المعطّلة تتطلب صلاحيات لا يملكها حسابك. الإدارة الكاملة
        متاحة من المنصة الرئيسية حسب صلاحياتك العلية.
      </p>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <Card>
    <p className="text-xs font-bold text-slate-500">{label}</p>
    <p className="text-2xl font-black text-slate-900 mt-1">{value}</p>
  </Card>
);

export default StaffDashboard;
