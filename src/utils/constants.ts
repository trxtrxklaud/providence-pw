export const BRAND = {
  name: 'Complexe Scolaire La Providence',
  shortName: 'Providence',
  city: 'Sidi Bouzid, Tunisie',
  tagline: 'التميز في التعليم والتأطير الأكاديمي',
  colors: {
    orange: '#F97316',
    purple: '#7C3AED',
    darkPurple: '#3B0764',
    black: '#111111',
  },
};

export const ROLES = {
  ADMIN: 'admin',
  STAFF: 'staff',
  TEACHER: 'teacher',
  PARENT: 'parent',
  CASHIER: 'cashier',
  ACCOUNTANT: 'accountant',
} as const;

export const ROLE_LABELS: Record<string, string> = {
  admin: 'مدير عام',
  staff: 'إداري مالي',
  cashier: 'قابض',
  accountant: 'محاسب',
  teacher: 'معلم / أستاذ',
  parent: 'ولي أمر',
};
