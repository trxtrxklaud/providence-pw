import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { School } from 'lucide-react';
import { ROLE_LABELS } from '@/utils/constants';

/**
 * موجّه الأدوار: كل مستخدم دوره واحد من التوكن (user.role.name).
 * إن كان مستخدماً متعدد المهام مستقبلاً ستظهر هنا شاشة اختيار.
 * الصلاحيات العلية ترض خادمياً — هذا توجيه عرض قط.
 */
const RoleRouter: React.FC = () => {
  const { user, activeRole } = useAuthStore();
  const navigate = useNavigate();

  const role = user?.role?.name;

  if (!role) {
    // لا دور معرو — عودة للدخول (لا جلسة صالحة بلا دور).
    return <Navigate to="/login" replace />;
  }

  // مسار الدور الواحد: توجيه مباشر إلى لوحته.
  const roleHome: Record<string, string> = {
    admin: '/admin',
    staff: '/staff',
    cashier: '/staff',
    accountant: '/staff',
    teacher: '/teacher',
    parent: '/parent',
  };

  const target = roleHome[activeRole ?? role] ?? roleHome[role];

  if (target) {
    return <Navigate to={target} replace />;
  }

  // دور غير معرو للتطبيق بعد — بطاقة توضيحية بدل شاشة ارغة.
  return (
    <div className="max-w-md mx-auto py-16" dir="rtl">
      <Card className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 to-purple-600 text-white flex items-center justify-center mx-auto mb-4">
          <School className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-black text-slate-900">دورك: {ROLE_LABELS[role] ?? role}</h2>
        <p className="mt-2 text-sm text-slate-500 leading-relaxed">
          هذا الدور لا توجد له لوحة مخصّصة بعد ي التطبيق. تابع من المنصة
          الرئيسية أو تواصل مع الإدارة.
        </p>
        <Button variant="outline" className="mt-5" onClick={() => navigate('/logout')}>
          تسجيل الخروج
        </Button>
      </Card>
    </div>
  );
};

export default RoleRouter;
