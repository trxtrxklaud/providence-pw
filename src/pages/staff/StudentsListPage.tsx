import React, { useEffect, useState } from 'react';
import { GraduationCap, Search } from 'lucide-react';
import { staffService } from '@/services/staffService';
import { useAuthStore } from '@/store/useAuthStore';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import Unauthorized from '@/pages/Unauthorized';
import { getApiErrorMessage, formatPhone } from '@/utils/formatters';
import type { StudentListItem } from '@/types/staff';

/** قاعدة بيانات التلاميذ — قراءة قط، تتطلب manage_students. */
const StudentsListPage: React.FC = () => {
  const { hasPermission } = useAuthStore();
  const [students, setStudents] = useState<StudentListItem[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState('');

  const canAccess = hasPermission('manage_students') || hasPermission('view_students');

  useEffect(() => {
    if (!canAccess) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await staffService.getStudents();
        const list = Array.isArray(data) ? data : (data.data ?? []);
        if (!cancelled) setStudents(list);
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

  const filtered = query.trim()
    ? students.filter((s) => {
        const q = query.trim();
        const name = `${s.first_name} ${s.last_name}`;
        return (
          name.includes(q) ||
          (s.student_code ?? '').includes(q) ||
          (s.guardian_phone ?? '').includes(q)
        );
      })
    : students;

  if (!canAccess) {
    return <Unauthorized />;
  }

  if (error) {
    return <ErrorState title="تعذّر تحميل قائمة التلاميذ" message={error} />;
  }

  return (
    <div className="space-y-6" dir="rtl">
      <header>
        <h1 className="text-2xl font-black text-slate-900">قاعدة بيانات التلاميذ</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {filtered.length} تلميذ — قراءة قط، التعديل من المنصة الرئيسية
        </p>
      </header>

      <Input
        type="search"
        placeholder="بحث بالاسم أو رقم التسجيل أو هات الوليّ..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        icon={<Search className="w-4 h-4" />}
      />

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<GraduationCap className="w-8 h-8" />}
          title={query ? 'لا نتائج مطابقة' : 'لا تلاميذ'}
          description={query ? 'جرّب كلمة بحث أخرى.' : 'ستظهر هنا قوائم التلاميذ.'}
        />
      ) : (
        <Card className="p-0 overflow-hidden">
          <ul className="divide-y divide-slate-100">
            {filtered.slice(0, 50).map((s) => (
              <li key={s.id} className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-purple-600 text-white text-xs font-black flex items-center justify-center shrink-0">
                    {s.first_name.charAt(0)}
                  </span>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-slate-800 truncate">
                      {s.first_name} {s.last_name}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {s.student_code ?? '—'} — هات الوليّ: {formatPhone(s.guardian_phone)}
                    </p>
                  </div>
                </div>
                {s.is_active !== undefined && (
                  <Badge variant={s.is_active ? 'success' : 'neutral'}>
                    {s.is_active ? 'نشط' : 'غير نشط'}
                  </Badge>
                )}
              </li>
            ))}
          </ul>
          {filtered.length > 50 && (
            <p className="p-3 text-center text-xs text-slate-400">
              تعرض أول 50 نتيجة — استعمل البحث لتضييق القائمة.
            </p>
          )}
        </Card>
      )}
    </div>
  );
};

export default StudentsListPage;
