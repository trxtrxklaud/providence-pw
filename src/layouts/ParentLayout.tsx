import { useEffect, useState } from 'react';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useAppStore } from '../store/useAppStore';
import { childrenAPI } from '../services/api';

export default function ParentLayout() {
  const { user, logout } = useAuthStore();
  const { setChildren, setActiveChild } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    childrenAPI
      .getChildren()
      .then((res: any) => {
        const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
        const formatted = list.map((c: any) => {
          const activeEnrollment = c.enrollments?.[0];
          return {
            id: c.id,
            name: c.name || `${c.first_name || ''} ${c.last_name || ''}`.trim() || 'تلميذ',
            section: activeEnrollment?.section || c.section?.name || 'القسم الأساسي',
            level: activeEnrollment?.level || c.level?.name || 'السنة الدراسية',
            photo_url: c.photo || undefined,
          };
        });
        setChildren(formatted);
        if (formatted.length > 0 && !useAppStore.getState().activeChildId) {
          setActiveChild(formatted[0].id);
        }
      })
      .catch((err: any) => console.error(err))
      .finally(() => setLoading(false));
  }, [setChildren, setActiveChild]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const displayName = user?.name || user?.first_name || (user as any)?.name || 'ولي أمر';
  const isAnnouncements = location.pathname.includes('/announcements');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 shadow-xs sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-xl font-bold shadow-xs">
              👨‍👩‍👧
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-slate-900 text-base">بوابة أولياء الأمور</h1>
                <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[11px] font-bold rounded-md">
                  مجمع لا بروفيدانس
                </span>
              </div>
              <p className="text-xs text-slate-500">
                مرحباً، {displayName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/parent/announcements"
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                isAnnouncements ? 'bg-orange-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              📢 الإعلانات
            </Link>
            <button
              onClick={handleLogout}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer"
            >
              خروج
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="min-h-[calc(100vh-80px)]">
        <Outlet />
      </main>
    </div>
  );
}
