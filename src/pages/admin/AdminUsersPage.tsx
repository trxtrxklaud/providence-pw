import React, { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { adminService, type AdminUserItem } from '@/services/adminService';
import { useAuthStore } from '@/store/useAuthStore';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import Unauthorized from '@/pages/Unauthorized';
import { getApiErrorMessage, formatPhone } from '@/utils/formatters';
import { ROLE_LABELS } from '@/utils/constants';

/** إدارة المستخدمين — عرض قط (التعديل من المنصة)، تتطلب manage_users. */
const AdminUsersPage: React.FC = () => {
  const { hasPermission } = useAuthStore();
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  if (!hasPermission('manage_users')) {
    return <Unauthorized />;
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await adminService.getUsers();
        const list = Array.isArray(data) ? data : (data.data ?? []);
        if (!cancelled) setUsers(list);
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
    return <ErrorState title="تعذّر تحميل المستخدمين" message={error} />;
  }

  return (
    <div className="space-y-6" dir="rtl">
      <header>
        <h1 className="text-2xl font-black text-slate-900">المستخدمون والصلاحيات</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {users.length} مستخدم — التعديل والإدارة من المنصة الرئيسية
        </p>
      </header>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <EmptyState
          icon={<ShieldCheck className="w-8 h-8" />}
          title="لا مستخدمين"
          description="ستظهر هنا قوائم المستخدمين."
        />
      ) : (
        <Card className="p-0 overflow-hidden">
          <ul className="divide-y divide-slate-100">
            {users.map((u) => (
              <li key={u.id} className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-9 h-9 rounded-xl bg-slate-100 text-slate-500 text-xs font-black flex items-center justify-center shrink-0">
                    {u.first_name?.charAt(0) ?? '?'}
                  </span>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-slate-800 truncate">
                      {u.first_name} {u.last_name}
                      <span className="text-xs font-normal text-slate-400"> @{u.username}</span>
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {formatPhone(u.phone)}
                      {u.email ? ` — ${u.email}` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="purple">{ROLE_LABELS[u.role?.name ?? ''] ?? u.role?.name ?? '—'}</Badge>
                  <Badge variant={u.is_active ? 'success' : 'neutral'}>
                    {u.is_active ? 'معّل' : 'موقو'}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
};

export default AdminUsersPage;
