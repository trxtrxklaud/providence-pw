import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      // محاولة تسجيل دخول مباشر
      const response = await authAPI.loginByPhone(phone, showOTP ? otp : undefined);
      const data = response.data?.data;

      if (data?.access_token || data?.token) {
        // استخراج الدور بدقة
        const role = data.role 
          || (typeof data.user?.role === 'string' ? data.user?.role : data.user?.role?.name)
          || data.profile?.role
          || 'parent';

        // حفظ التوكن والمستخدم والدور
        login(data.access_token || data.token, data.user || data.profile, data.profile, role);

        // التوجيه حسب الدور
        if (role === 'parent') {
          navigate('/parent/dashboard');
        } else if (role === 'teacher') {
          navigate('/teacher/dashboard');
        } else if (role === 'admin') {
          navigate('/admin/dashboard');
        } else if (role === 'super-admin') {
          navigate('/super-admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      console.error('Login error:', err);

      // إذا API تطلب OTP
      if (err.response?.data?.otp_required) {
        setShowOTP(true);
        setError('يرجى إدخال رمز التحقق المُرسل إلى هاتفك');
      } else {
        setError(err.response?.data?.message || 'فشل تسجيل الدخول. تأكد من رقم الهاتف.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4" dir="rtl">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">🏫</span>
          </div>
          <h1 className="text-3xl font-bold text-orange-600 mb-1">
            Providence
          </h1>
          <p className="text-sm text-gray-500">نظام إدارة المدرسة</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg text-center">
            {error}
          </div>
        )}

        <input
          type="tel"
          placeholder="رقم الهاتف (مثال: 20123456)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-4 border-2 border-gray-200 rounded-lg mb-4 focus:border-orange-500 outline-none text-right transition-all"
        />

        {showOTP && (
          <input
            type="text"
            placeholder="رمز التحقق"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-4 border-2 border-gray-200 rounded-lg mb-4 focus:border-orange-500 outline-none text-right transition-all"
          />
        )}

        <button
          onClick={handleLogin}
          disabled={loading || !phone.trim()}
          className="w-full bg-orange-600 text-white py-4 rounded-lg font-bold hover:bg-orange-700 disabled:opacity-50 transition-colors shadow-md shadow-orange-200 cursor-pointer"
        >
          {loading ? 'جاري التحميل...' : 'تسجيل الدخول'}
        </button>

        {/* اختيار الدور (للتطوير) */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center mb-3">
            للتطوير: اختر الدور يدوياً
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                login('dev-token', { role: 'parent', first_name: 'ولي أمر' } as any, undefined, 'parent');
                navigate('/parent/dashboard');
              }}
              className="px-3 py-2 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 font-medium cursor-pointer"
            >
              ولي أمر
            </button>
            <button
              onClick={() => {
                login('dev-token', { role: 'teacher', first_name: 'معلم' } as any, undefined, 'teacher');
                navigate('/teacher/dashboard');
              }}
              className="px-3 py-2 bg-purple-100 text-purple-700 rounded text-sm hover:bg-purple-200 font-medium cursor-pointer"
            >
              معلم
            </button>
            <button
              onClick={() => {
                login('dev-token', { role: 'admin', first_name: 'مدير' } as any, undefined, 'admin');
                navigate('/admin/dashboard');
              }}
              className="px-3 py-2 bg-orange-100 text-orange-700 rounded text-sm hover:bg-orange-200 font-medium cursor-pointer"
            >
              مدير
            </button>
            <button
              onClick={() => {
                login('dev-token', { role: 'super-admin', first_name: 'مدير عام' } as any, undefined, 'super-admin');
                navigate('/super-admin/dashboard');
              }}
              className="px-3 py-2 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 font-medium cursor-pointer"
            >
              مدير عام
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
