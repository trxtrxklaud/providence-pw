import React, { useEffect, useState } from 'react';
import { School, TrendingUp, Users, AlertCircle } from 'lucide-react';
import { staffService } from '@/services/staffService';
import { useAuthStore } from '@/store/useAuthStore';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { formatCurrency } from '@/utils/formatters';
import type { DashboardStats } from '@/types/staff';

/**
 * لوحة المدير: إحصاءات سريعة + الجرد النقدي (يَرد قط مع
 * manage_treasury أو view_reports — الباقي لا يرى ماتيحه أصلاً).
 */
const AdminDashboard: React.FC = () => {
  const { hasPermission } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const canSeeFinancials =
    hasPermission('manage_treasury') || hasPermission('view_reports');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await staffService.getDashboard();
        if (!cancelled) setStats(data);
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return <ErrorState title="تعذّر تحميل اللوحة" message={error} />;
  }

  const yearName = stats?.academic_year?.name;

  return (
    <div className="space-y-6" dir="rtl">
      <header className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900">لوحة الإدارة</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            نظرة عامة على المدرسة {yearName ? `— السنة الدراسية ${yearName}` : ''}
          </p>
        </div>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-4 w-20 mb-3" />
              <Skeleton className="h-8 w-14" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<Users className="w-5 h-5" />}
            label="التلاميذ النشطون"
            value={stats?.total_active_students?.toLocaleString('ar-TN') ?? '—'}
            tone="orange"
          />
          <StatCard
            icon={<School className="w-5 h-5" />}
            label="إجمالي التلاميذ"
            value={stats?.total_students?.toLocaleString('ar-TN') ?? '—'}
            tone="purple"
          />
          <StatCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="ذكور / إناث"
            value={`${stats?.total_males ?? '—'} / ${stats?.total_females ?? '—'}`}
            tone="purple"
          />
          <StatCard
            icon={<AlertCircle className="w-5 h-5" />}
            label="تسجيلات غير مخلّصة"
            value={stats?.unpaid_registration_count?.toLocaleString('ar-TN') ?? '—'}
            tone="orange"
          />
        </div>
      )}

      {/* الجرد النقدي — يظهر قط لمن يملك الصلاحية وردت البيانات */}
      {canSeeFinancials && stats?.treasury_balance !== undefined && (
        <Card className="bg-gradient-to-br from-slate-900 to-purple-950 border-none text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-orange-200">رصيد الخزينة الحالي</p>
              <p className="text-3xl font-black mt-1">
                {formatCurrency(stats.treasury_balance)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-300" />
            </div>
          </div>
        </Card>
      )}

      <p className="text-xs text-slate-400 leading-relaxed">
        إدارة المستخدمين والصلاحيات والتقارير التصيلية متاحة من المنصة الرئيسية.
        التطبيق يعرض هنا ما تسمح به صلاحياتك قط.
      </p>
    </div>
  );
};

type Tone = 'orange' | 'purple';

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; tone: Tone }> = ({
  icon,
  label,
  value,
  tone,
}) => (
  <Card className="hoverable">
    <div
      className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
        tone === 'orange'
          ? 'bg-orange-50 text-orange-600'
          : 'bg-purple-50 text-purple-600'
      }`}
    >
      {icon}
    </div>
    <p className="text-xs font-bold text-slate-500">{label}</p>
    <p className="text-2xl font-black text-slate-900 mt-0.5">{value}</p>
  </Card>
);

export default AdminDashboard;
