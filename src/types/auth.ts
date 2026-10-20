export type UserRole = 'admin' | 'staff' | 'teacher' | 'parent' | 'cashier' | 'accountant';

export interface Role {
  id: number;
  name: string;
  display_name: string;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email?: string | null;
  phone?: string | null;
  role_id?: number;
  role?: Role | null;
  is_active: boolean;
  effective_permissions?: string[];
  [key: string]: unknown;
}

export interface UserProfile {
  id: number;
  name: string;
  phone?: string | null;
  role: string;
  email?: string | null;
  children_count?: number;
  children_ids?: number[];
  employee_id?: number;
}

export interface LoginResponseData {
  access_token: string;
  token_type: string;
  role: UserRole | string;
  user: User;
  profile: UserProfile;
}

/** استجابة login-by-phone الناجحة (مغلّفة بـ success/message/data). */
export interface LoginResponse {
  success: boolean;
  message: string;
  data: LoginResponseData;
}

/** 401 من login-by-phone عند غياب/خطأ OTP الخاص بوليّ الأمر. */
export interface OtpRequiredResponse {
  success: false;
  otp_required: true;
  message: string;
  data: null;
}

/** استجابة request-otp — لا تحمل الرمز نصاً في وضع SMS. */
export interface OtpSentResponse {
  message: string;
  dev_code?: string; // يَرد فقط في وضع الإطلاق manual — لا يُعرض في الواجهة أبداً
}

/** استجابة mobile/parent/verify-otp (بنية مسطّحة، ملف مختلف عن login-by-phone). */
export interface EnvelopeLoginResponse {
  message: string;
  access_token: string;
  token_type: string;
  user: User;
}
