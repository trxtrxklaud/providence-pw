import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { childrenAPI } from '../services/api';

export default function Dashboard() {
  const { user, logout, token } = useAuthStore();
  const navigate = useNavigate();
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    if (user?.role === 'parent') {
      setLoading(true);
      childrenAPI.getChildren()
        .then((res) => setChildren(res.data?.data || []))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [token, user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Top Navbar */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏫</span>
            <div>
              <h1 className="text-xl font-bold text-orange-600">Providence PWA</h1>
              <p className="text-xs text-gray-400">مرحباً بك، {user?.first_name || user?.name || 'مستخدم'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            تسجيل الخروج
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-800">بيانات الحساب</h2>
              <p className="text-sm text-gray-500">الدور الحالي: <span className="font-semibold text-orange-600">{user?.role || 'مستخدم'}</span></p>
              {user?.phone && <p className="text-sm text-gray-500">رقم الهاتف: {user.phone}</p>}
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
              متصل بنجاح
            </span>
          </div>
        </div>

        {user?.role === 'parent' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">قائمة الأبناء</h2>
            {loading ? (
              <p className="text-gray-400 text-sm">جاري تحميل البيانات...</p>
            ) : children.length > 0 ? (
              <div className="grid gap-3">
                {children.map((child: any) => (
                  <div key={child.id} className="p-4 border border-gray-100 rounded-xl bg-orange-50/50 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-gray-800">{child.first_name} {child.last_name}</p>
                      <p className="text-xs text-gray-500">القسم: {child.section?.name || 'غير محدد'}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">لا توجد بيانات مسجلة للأبناء حالياً.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
