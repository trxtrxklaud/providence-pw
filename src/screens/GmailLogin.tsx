import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import { Sparkles, UserCheck, GraduationCap, ShieldCheck, School } from 'lucide-react';

export default function GmailLogin() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e?: React.FormEvent, customEmail?: string, customPhone?: string) => {
    if (e) e.preventDefault();
    const targetEmail = (customEmail || email).trim();
    const targetPhone = (customPhone || phone).trim();

    if (!targetEmail || !targetPhone) return;

    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/gmail-login', {
        email: targetEmail,
        phone: targetPhone,
      });

      const data = response.data?.data;

      if (data?.access_token) {
        const role = data.user?.role || 'parent';
        const determinedRole = typeof role === 'string' ? role : role?.name || 'parent';

        login(data.access_token, data.user, undefined, determinedRole);

        if (determinedRole === 'parent') {
          navigate('/parent/dashboard');
        } else if (determinedRole === 'teacher') {
          navigate('/teacher/dashboard');
        } else if (determinedRole === 'super-admin') {
          navigate('/super-admin/dashboard');
        } else {
          navigate('/admin/dashboard');
        }
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message || 'فشل تسجيل الدخول. تأكد من الإيميل ورقم الهاتف.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQuickParentLogin = () => {
    setEmail('chahd.parent@gmail.com');
    setPhone('20054625');
    handleLogin(undefined, 'chahd.parent@gmail.com', '20054625');
  };

  const handlePreview = (role: 'parent' | 'teacher' | 'admin') => {
    if (role === 'parent') {
      login(
        'dev-token',
        { id: 6, first_name: 'ولي أمر', last_name: 'حسيني', role: 'parent' } as any,
        undefined,
        'parent'
      );
      navigate('/parent/dashboard');
    } else if (role === 'teacher') {
      login(
        'dev-token',
        { id: 10, first_name: 'الأستاذ(ة)', last_name: 'الرابحي', role: 'teacher' } as any,
        undefined,
        'teacher'
      );
      navigate('/teacher/dashboard');
    } else {
      login(
        'dev-token',
        { id: 1, first_name: 'مدير النظام', last_name: 'الإدارة', role: 'admin' } as any,
        undefined,
        'admin'
      );
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4" dir="rtl">
      <div className="max-w-md w-full bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-100">
        
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-tr from-orange-500 to-amber-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md shadow-orange-500/20">
            <School className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-1">
            مجمع لا بروفيدانس
          </h1>
          <p className="text-xs text-slate-500 font-medium">المنظومة الذكية الموحدة لإدارة المدرسة</p>
        </div>

        {/* Quick Access Card - Direct One-Click Navigation */}
        <div className="mb-6 p-4 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 border border-purple-200/70 rounded-2xl shadow-xs">
          <div className="flex items-center gap-2 mb-2.5 text-purple-900 font-bold text-xs">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>تجربة ومعاينة الواجهات مباشرة (بنقرة واحدة):</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handlePreview('parent')}
              className="p-2.5 bg-white hover:bg-orange-50 text-orange-700 border border-orange-200 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 shadow-2xs cursor-pointer text-center"
            >
              <UserCheck className="w-4 h-4 text-orange-600" />
              <span>ولي أمر</span>
            </button>

            <button
              type="button"
              onClick={() => handlePreview('teacher')}
              className="p-2.5 bg-white hover:bg-purple-50 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 shadow-2xs cursor-pointer text-center"
            >
              <GraduationCap className="w-4 h-4 text-purple-600" />
              <span>معلم</span>
            </button>

            <button
              type="button"
              onClick={() => handlePreview('admin')}
              className="p-2.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 shadow-2xs cursor-pointer text-center"
            >
              <ShieldCheck className="w-4 h-4 text-slate-700" />
              <span>إدارة</span>
            </button>
          </div>

          {/* Real Live Account One-Click */}
          <button
            type="button"
            onClick={handleQuickParentLogin}
            className="w-full mt-3 py-2 px-3 bg-white/90 hover:bg-white text-indigo-700 border border-indigo-200 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <span>دخول فوري بحساب الولي الفعلي (شهد حسيني) ➔</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl text-center font-medium">
            {error}
          </div>
        )}

        {/* Regular Login Form */}
        <form onSubmit={(e) => handleLogin(e)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 text-right">
              البريد الإلكتروني (Gmail)
            </label>
            <input
              type="text"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-orange-500 focus:bg-white outline-none transition-all text-left dir-ltr"
              dir="ltr"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 text-right">
              كلمة السر (رقم الهاتف)
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-orange-500 focus:bg-white outline-none transition-all text-left dir-ltr"
              dir="ltr"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email.trim() || !phone.trim()}
            className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-orange-500/20 cursor-pointer"
          >
            {loading ? 'جاري التحقق والاتصال...' : 'تسجيل الدخول'}
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-5 text-center">
          <Link
            to="/register"
            className="text-xs text-orange-600 hover:text-orange-700 font-bold transition-colors"
          >
            ولي أمر جديد؟ إنشاء وتفعيل حساب بالهاتف ➔
          </Link>
        </div>

      </div>
    </div>
  );
}
