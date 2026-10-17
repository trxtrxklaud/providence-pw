import { useNavigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function AdminLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const displayName = user?.first_name || (user as any)?.name || 'مدير النظام';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 shadow-xs sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-xl font-bold shadow-xs">
              🏫
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-slate-900 text-base">إدارة مجمع لا بروفيدانس</h1>
                <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[11px] font-bold rounded-md">
                  مدير
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
          <h2 className="text-base font-bold text-slate-800 mb-1">لوحة تحكم الإدارة</h2>
          <p className="text-xs text-slate-500 mb-4">نظرة عامة على شؤون التلاميذ، الموظفين، والمالية</p>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="p-4 border border-orange-100 rounded-xl bg-orange-50/40">
              <p className="text-xs text-slate-500 font-medium">قاعدة بيانات التلاميذ</p>
              <p className="text-lg font-black text-slate-800 mt-1">نشطة</p>
            </div>
            <div className="p-4 border border-purple-100 rounded-xl bg-purple-50/40">
              <p className="text-xs text-slate-500 font-medium">الهيئة التدريسية</p>
              <p className="text-lg font-black text-slate-800 mt-1">مكتملة</p>
            </div>
            <div className="p-4 border border-emerald-100 rounded-xl bg-emerald-50/40">
              <p className="text-xs text-slate-500 font-medium">استخلاص المعاليم</p>
              <p className="text-lg font-black text-slate-800 mt-1">محدث</p>
            </div>
          </div>
        </div>

        <Outlet />
      </main>
    </div>
  );
}
