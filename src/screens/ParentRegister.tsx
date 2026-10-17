import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';

export default function ParentRegister() {
  const [step, setStep] = useState<1 | 2>(1);
  const [pseudo, setPseudo] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [devCode, setDevCode] = useState('');
  const [studentNames, setStudentNames] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuthStore();
  const navigate = useNavigate();

  // 1. طلب رمز التفعيل
  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!pseudo.trim() || !email.trim() || !phone.trim()) {
      setError('يرجى ملء جميع الحقول المطلوبة.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/parent/request-code', {
        pseudo: pseudo.trim(),
        email: email.trim(),
        phone: phone.trim(),
      });

      const data = response.data;
      if (data?.success) {
        setDevCode(data.dev_code || '');
        setStudentNames(data.students_names || []);
        setSuccessMessage(data.message || 'تم إرسال رمز التحقق إلى بريدك الإلكتروني.');
        setStep(2);
      }
    } catch (err: any) {
      console.error('Request code error:', err);
      setError(
        err.response?.data?.message || 'تعذر إرسال رمز التحقق. يرجى التأكد من صحة رقم الهاتف والبريد.'
      );
    } finally {
      setLoading(false);
    }
  };

  // 2. التحقق من الرمز وتفعيل الحساب
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!code.trim()) {
      setError('يرجى إدخال رمز التحقق المكون من 6 أرقام.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/parent/verify-code', {
        phone: phone.trim(),
        code: code.trim(),
        pseudo: pseudo.trim(),
        email: email.trim(),
      });

      const resData = response.data?.data;
      if (resData?.access_token) {
        // حفظ التوكن وبيانات الولي في المتجر
        login(resData.access_token, resData.user, undefined, 'parent');

        // التوجيه الفوري لبوابة أولياء الأمور
        navigate('/parent/dashboard');
      }
    } catch (err: any) {
      console.error('Verify code error:', err);
      setError(
        err.response?.data?.message || 'رمز التحقق غير صحيح أو انتهت صلاحيته.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4" dir="rtl">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-xs">
            <span className="text-2xl">👨‍👩‍👧</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">
            إنشاء حساب ولي أمر
          </h1>
          <p className="text-xs text-gray-500">
            مجمع لا بروفيدانس المدرسي - بوابة المتابعة الرقمية
          </p>
        </div>

        {/* تنبيه الخطأ */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl text-center leading-relaxed">
            {error}
          </div>
        )}

        {/* تنبيه النجاح */}
        {successMessage && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl text-center leading-relaxed">
            {successMessage}
          </div>
        )}

        {/* الخطوة 1: إدخال البيانات */}
        {step === 1 && (
          <form onSubmit={handleRequestCode} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 text-right">
                اسم المستخدم (Pseudo)
              </label>
              <input
                type="text"
                placeholder="مثال: abou_ali"
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
                className="w-full p-3.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none text-right transition-all text-sm font-medium"
                required
              />
              <p className="text-[11px] text-gray-400 mt-1 text-right">
                الاسم الذي ستستخدمه لتسجيل الدخول لاحقاً
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 text-right">
                البريد الإلكتروني (Gmail)
              </label>
              <input
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none text-left transition-all text-sm font-mono"
                dir="ltr"
                required
              />
              <p className="text-[11px] text-gray-400 mt-1 text-right">
                سنرسل إليه رمز التفعيل والتنبيهات المدرسية
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 text-right">
                رقم الهاتف المسجل لدى المدرسة (كلمة السر)
              </label>
              <input
                type="tel"
                placeholder="مثال: 20123456"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none text-left transition-all text-sm font-mono"
                dir="ltr"
                required
              />
              <p className="text-[11px] text-gray-400 mt-1 text-right">
                رقم الهاتف الذي سجلته في ملف التلميذ (سيكون كلمة السر دائماً)
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !pseudo.trim() || !email.trim() || !phone.trim()}
              className="w-full mt-2 bg-orange-600 hover:bg-orange-700 text-white py-3.5 rounded-xl font-bold disabled:opacity-50 transition-colors shadow-md shadow-orange-100 cursor-pointer text-sm"
            >
              {loading ? 'جاري التحقق وإرسال الرمز...' : 'إرسال رمز التفعيل إلى Gmail'}
            </button>
          </form>
        )}

        {/* الخطوة 2: إدخال رمز التحقق */}
        {step === 2 && (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            
            {/* بطاقة معلومات التلاميذ المكتشفين */}
            {studentNames.length > 0 && (
              <div className="p-3.5 bg-blue-50 border border-blue-100 rounded-xl text-right">
                <p className="text-xs font-bold text-blue-900 mb-1">
                  🎓 تم التعرف على ملفات الأبناء:
                </p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {studentNames.map((name, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-white border border-blue-200 text-blue-800 text-xs rounded-md font-medium">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 text-right">
                رمز التحقق المكون من 6 أرقام
              </label>
              <input
                type="text"
                placeholder="• • • • • •"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full p-4 border-2 border-orange-300 rounded-xl focus:border-orange-500 outline-none text-center font-mono text-2xl tracking-widest font-bold text-slate-800"
                dir="ltr"
                autoFocus
                required
              />
              <p className="text-[11px] text-gray-400 mt-1.5 text-center">
                أدخل الرمز الذي تم إرساله إلى {email}
              </p>
            </div>

            {/* مساعد رمز التطوير السريع */}
            {devCode && (
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-center">
                <span className="text-xs text-amber-800">رمز التفعيل للتجربة: <strong>{devCode}</strong></span>
                <button
                  type="button"
                  onClick={() => setCode(devCode)}
                  className="mr-2 text-xs text-orange-600 font-bold hover:underline cursor-pointer"
                >
                  [تعبئة الرمز تلقائياً]
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || code.length < 6}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3.5 rounded-xl font-bold disabled:opacity-50 transition-colors shadow-md shadow-orange-100 cursor-pointer text-sm"
            >
              {loading ? 'جاري تفعيل الحساب...' : 'تأكيد وتفعيل الحساب والدخول'}
            </button>

            <button
              type="button"
              onClick={() => { setStep(1); setError(''); }}
              className="w-full text-xs text-slate-500 hover:text-slate-800 text-center block pt-1 cursor-pointer"
            >
              ← تعديل البيانات أو رقم الهاتف
            </button>
          </form>
        )}

        {/* رابط الدخول لمن يملك حساباً مسبقاً */}
        <div className="mt-6 pt-5 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500">
            لديك حساب مسبقاً؟{' '}
            <Link to="/login" className="text-orange-600 font-bold hover:underline">
              تسجيل الدخول هنا
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
