import { useNavigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function SuperAdminLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const displayName = user?.first_name || (user as any)?.name || 'المدير العام';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 shadow-xs sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-bold shadow-xs">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-slate-900 text-base">لوحة المدير العام المركزية</h1>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[11px] font-bold rounded-md">
                  مدير عام
                </span>
              </div>
              <p className="text-xs text-slate-500">
                مرحباً، {displayName}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-lg font-medium transition-colors cursor-pointer"
          >
            تسجيل الخروج
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
          <h2 className="text-base font-bold text-slate-800 mb-1">الرقابة المركزية الشاملة</h2>
          <p className="text-xs text-slate-500 mb-4">كافة الصلاحيات، إعدادات الخادم، وإدارة المستخدمين والأذونات</p>

          <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl">
            <p className="text-sm font-bold text-emerald-900">حالة النظام: تشغيل ممتاز</p>
            <p className="text-xs text-emerald-700 mt-0.5">اتصال مباشر مع خادم الإنتاج وقاعدة بيانات Providence ERP</p>
          </div>
        </div>

        <Outlet />
      </main>
    </div>
  );
}
