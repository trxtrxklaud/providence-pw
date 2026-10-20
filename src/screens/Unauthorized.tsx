import { useNavigate } from 'react-router-dom';

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4" dir="rtl">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-slate-100 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
          ⛔
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">غير مصرح بالدخول</h1>
        <p className="text-sm text-slate-500 mb-6">
          ليس لديك الصلاحيات الكافية للوصول إلى هذه الواجهة.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors cursor-pointer"
        >
          العودة لتسجيل الدخول
        </button>
      </div>
    </div>
  );
}
