import React from 'react';
import { User, Phone, Mail, ShieldCheck, BadgeCheck } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatPhone } from '@/utils/formatters';
import { ROLE_LABELS } from '@/utils/constants';

/** المل الشخصي — موحّد لكل الأدوار (بيانات من الجلسة الحالية). */
const ProfilePage: React.FC = () => {
  const { user, profile } = useAuthStore();

  const displayName = profile?.name || (user ? `${user.first_name} ${user.last_name}` : 'مستخدم');
  const phone = profile?.phone ?? user?.phone ?? null;
  const email = profile?.email ?? user?.email ?? null;
  const roleLabel = ROLE_LABELS[user?.role?.name ?? ''] ?? user?.role?.name ?? '—';
  const permissions = user?.effective_permissions ?? [];

  return (
    <div className="max-w-2xl mx-auto space-y-6" dir="rtl">
      <header>
        <h1 className="text-2xl font-black text-slate-900">المل الشخصي</h1>
        <p className="text-sm text-slate-500 mt-0.5">بيانات حسابك وصلاحياتك العلية</p>
      </header>

      <Card>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-purple-600 text-white flex items-center justify-center font-black text-2xl shrink-0">
            {displayName.trim().charAt(0) || '؟'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-lg font-black text-slate-900 truncate">{displayName}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="orange">{roleLabel}</Badge>
              {user?.is_active && (
                <Badge variant="success">
                  <BadgeCheck className="w-3 h-3" />
                  حساب معّل
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <InfoRow icon={<Phone className="w-4 h-4" />} label="رقم الهاتف" value={formatPhone(phone)} />
          {email && <InfoRow icon={<Mail className="w-4 h-4" />} label="البريد الإلكتروني" value={email} />}
          {user?.username && (
            <InfoRow icon={<User className="w-4 h-4" />} label="اسم المستخدم" value={user.username} />
          )}
        </div>
      </Card>

      {permissions.length > 0 && (
        <Card>
          <h2 className="text-sm font-black text-slate-900 mb-3 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-orange-500" />
            صلاحياتك ({permissions.length})
          </h2>
          <div className="flex flex-wrap gap-2">
            {permissions.map((p) => (
              <span
                key={p}
                dir="ltr"
                className="text-[10px] font-bold font-mono bg-slate-100 text-slate-600 rounded-lg px-2.5 py-1"
              >
                {p}
              </span>
            ))}
          </div>
        </Card>
      )}

      <p className="text-xs text-slate-400 leading-relaxed text-center">
        هذه الصلاحيات هي المصدر — ما لا تراه هنا لا تستطيع الوصول إليه ي التطبيق أو المنصة.
      </p>
    </div>
  );
};

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({
  icon,
  label,
  value,
}) => (
  <div className="flex items-center gap-3 text-sm">
    <span className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center shrink-0">
      {icon}
    </span>
    <span className="text-slate-500 font-bold text-xs">{label}:</span>
    <span className="text-slate-800 font-bold truncate">{value}</span>
  </div>
);

export default ProfilePage;
