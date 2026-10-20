import React, { useEffect, useState } from 'react';
import { Briefcase } from 'lucide-react';
import { staffService } from '@/services/staffService';
import { useAuthStore } from '@/store/useAuthStore';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import Unauthorized from '@/pages/Unauthorized';
import { getApiErrorMessage, formatPhone } from '@/utils/formatters';
import type { EmployeeListItem } from '@/types/staff';

/** الهيئة التدريسية والموظون — قراءة قط، تتطلب manage_employees. */
const EmployeesListPage: React.FC = () => {
  const { hasPermission } = useAuthStore();
  const [employees, setEmployees] = useState<EmployeeListItem[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  if (!hasPermission('manage_employees')) {
    return <Unauthorized />;
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await staffService.getEmployees();
        const list = Array.isArray(data) ? data : (data.data ?? []);
        if (!cancelled) setEmployees(list);
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

  if (error) {
    return <ErrorState title="تعذّر تحميل قائمة الموظفين" message={error} />;
  }

  return (
    <div className="space-y-6" dir="rtl">
      <header>
        <h1 className="text-2xl font-black text-slate-900">الهيئة التدريسية والموظون</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {employees.length} موظ — قراءة قط
        </p>
      </header>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : employees.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="w-8 h-8" />}
          title="لا موظين"
          description="ستظهر هنا قوائم الهيئة التدريسية."
        />
      ) : (
        <Card className="p-0 overflow-hidden">
          <ul className="divide-y divide-slate-100">
            {employees.slice(0, 50).map((e) => (
              <li key={e.id} className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 text-xs font-black flex items-center justify-center shrink-0">
                    {(e.full_name || '?').charAt(0)}
                  </span>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-slate-800 truncate">{e.full_name || '—'}</p>
                    <p className="text-xs text-slate-400 truncate">
                      {e.staff_type} — {formatPhone(e.phone)}
                    </p>
                  </div>
                </div>
                <Badge variant={e.is_active ? 'success' : 'neutral'}>
                  {e.is_active ? 'نشط' : 'غير نشط'}
                </Badge>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
};

export default EmployeesListPage;
