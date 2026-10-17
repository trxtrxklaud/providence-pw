import apiClient from './api';
import type {
  EnvelopeLoginResponse,
  LoginResponse,
  OtpRequiredResponse,
  OtpSentResponse,
  User,
} from '@/types/auth';

export const authService = {
  /**
   * تسجيل الدخول الموحد بالهاتف.
   * - admin/teacher: يدخل مباشرة من هنا (لا OTP).
   * - parent: إن عاد 401 مع otp_required: true فلن يصله توكن إلا عبر
   *   requestOtp ثم loginByPhone مع الرمز. لا fallback بلا OTP إطلاقاً.
   */
  async loginByPhone(phone: string, otpCode?: string): Promise<LoginResponse | OtpRequiredResponse> {
    const response = await apiClient.post<LoginResponse | OtpRequiredResponse>(
      '/auth/login-by-phone',
      { phone, ...(otpCode ? { otp_code: otpCode } : {}) }
    );
    return response.data;
  },

  /** طلب رمز تحقق للوليّ — GET /auth/request-otp */
  async requestOtp(phone: string): Promise<OtpSentResponse> {
    const response = await apiClient.get<OtpSentResponse>('/auth/request-otp', {
      params: { phone },
    });
    return response.data;
  },

  /**
   * دخول الوليّ عبر verify-otp (المسار الرسمي الموازي) — يستعمل فقط حين
   * يعود login-by-phone بـ otp_required: true والعميل يفضّل مسار OTP الصريح.
   */
  async verifyOtp(phone: string, code: string): Promise<EnvelopeLoginResponse> {
    const response = await apiClient.post<EnvelopeLoginResponse>('/mobile/parent/verify-otp', {
      phone,
      code,
    });
    return response.data;
  },

  /** بيانات المستخدم الحالي والصلاحيات الفعالة — GET /user */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/user');
    return response.data;
  },

  /** تسجيل الخروج وإبطال التوكن — POST /logout (نتجاهل فشل الشبكة) */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/logout');
    } catch {
      // التوكن يُبطَل محلياً في كل الأحوال
    }
  },
};
