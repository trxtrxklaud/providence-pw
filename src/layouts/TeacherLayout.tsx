import { useNavigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function TeacherLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const displayName = user?.first_name || (user as any)?.name || 'معلم';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 shadow-xs sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl font-bold shadow-xs">
              📚
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-slate-900 text-base">بوابة المعلمين والأساتذة</h1>
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[11px] font-bold rounded-md">
                  معلم
                </span>
              </div>
              <p className="text-xs text-slate-500">
                الأستاذ(ة): {displayName}
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
      <main className="max-w-4xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
