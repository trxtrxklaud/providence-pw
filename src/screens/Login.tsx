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

  const handleSendOTP = async () => {
    setError('');
    setLoading(true);
    try {
      await authAPI.requestOTP(phone);
      setShowOTP(true);
    } catch (err: any) {
      console.warn('OTP request failed or not needed, attempting direct login:', err);
      handleDirectLogin();
    } finally {
      setLoading(false);
    }
  };

  const handleDirectLogin = async () => {
    try {
      const response = await authAPI.loginByPhone(phone);
      const data = response.data?.data;
      if (data?.access_token || data?.token) {
        login(data.access_token || data.token, data.user || data.profile);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'فشل تسجيل الدخول. يرجى التأكد من رقم الهاتف.');
    }
  };

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const response = await authAPI.loginByPhone(phone, otp);
      const data = response.data?.data;
      if (data?.access_token || data?.token) {
        login(data.access_token || data.token, data.user || data.profile);
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.response?.data?.message || 'رمز التحقق أو رقم الهاتف غير صحيح.');
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
          <p className="text-sm text-gray-500">نظام إدارة المدرسة - تطبيق الجوال</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg text-center">
            {error}
          </div>
        )}
        
        <input
          type="tel"
          placeholder="رقم الهاتف (مثال: 22123456)"
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
          onClick={showOTP ? handleLogin : handleSendOTP}
          disabled={loading || !phone.trim()}
          className="w-full bg-orange-600 text-white py-4 rounded-lg font-bold hover:bg-orange-700 disabled:opacity-50 transition-colors shadow-md shadow-orange-200 cursor-pointer"
        >
          {loading ? 'جاري التحميل...' : showOTP ? 'تسجيل الدخول' : 'متابعة'}
        </button>
      </div>
    </div>
  );
}
