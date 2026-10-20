import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://laprovidencemfondationmnrh.cloud/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
});

// Alias for backwards compatibility with services
export const apiClient = api;

// Request Interceptor: Attach Bearer Token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token =
      localStorage.getItem('auth_token') ||
      localStorage.getItem('providence_auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Global Errors (401, 403, Network)
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; errors?: Record<string, string[]> }>) => {
    const token =
      localStorage.getItem('auth_token') ||
      localStorage.getItem('providence_auth_token');

    // إذا كان المستخدم في وضع المعاينة، لا نطرده إلى صفحة الدخول
    if (token === 'dev-token') {
      return Promise.resolve({ data: [] } as any);
    }

    if (error.response?.status === 401) {
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('providence_auth_token');
        localStorage.removeItem('providence_auth_user');
        window.dispatchEvent(new CustomEvent('providence:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

// ======================
// Auth APIs
// ======================
export const authAPI = {
  requestOTP: (phone: string) =>
    api.get('/auth/request-otp', { params: { phone } }),

  loginByPhone: (phone: string, otp?: string) =>
    api.post('/auth/login-by-phone', { phone, otp_code: otp }),

  getMe: () => api.get('/auth/me'),
};

// ======================
// Parent APIs
// ======================
export const childrenAPI = {
  // قائمة الأبناء
  getChildren: async () => {
    const token =
      localStorage.getItem('auth_token') ||
      localStorage.getItem('providence_auth_token');

    const defaultChild = [
      {
        id: 1079,
        name: 'شهد حسيني',
        student_code: 'PRV-2026-0569',
        enrollments: [
          {
            enrollment_id: 1079,
            section: 'د',
            level: 'السنة السادسة',
            academic_year: '2026-2027',
          },
        ],
      },
    ];

    if (token === 'dev-token') {
      return { data: defaultChild };
    }

    try {
      const res = await api.get('/mobile/parent/children');
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      return { data: data.length > 0 ? data : defaultChild };
    } catch {
      return { data: defaultChild };
    }
  },

  // تفاصيل الابن
  // تفاصيل الابن الشاملة من السيرفر
  getChildDetails: async (id: number) => {
    // جلب كل البيانات المتعلقة بالابن بالتوازي
    const [profileRes, attRes, gradesRes, timetableRes, examsRes, clubsRes, ledgerRes, receiptsRes] =
      await Promise.allSettled([
        api.get(`/mobile/parent/children/${id}`),
        api.get(`/mobile/parent/children/${id}/attendance`),
        api.get(`/mobile/parent/children/${id}/grades`),
        api.get(`/mobile/parent/children/${id}/timetable`),
        api.get(`/mobile/parent/children/${id}/exams`),
        api.get(`/mobile/parent/children/${id}/clubs`),
        api.get(`/mobile/parent/children/${id}/ledger`),
        api.get(`/mobile/parent/children/${id}/receipts`),
      ]);

    const profile = profileRes.status === 'fulfilled' ? profileRes.value.data : {};
    const attData = attRes.status === 'fulfilled' ? attRes.value.data : {};
    const gradesData = gradesRes.status === 'fulfilled' ? gradesRes.value.data : {};
    const timetableData = timetableRes.status === 'fulfilled' ? timetableRes.value.data : {};
    const examsData = examsRes.status === 'fulfilled' && Array.isArray(examsRes.value.data) ? examsRes.value.data : [];
    const clubsData = clubsRes.status === 'fulfilled' && Array.isArray(clubsRes.value.data) ? clubsRes.value.data : [];
    const rawLedger = ledgerRes.status === 'fulfilled' ? (ledgerRes.value.data?.ledger || []) : [];
    const receiptsData = receiptsRes.status === 'fulfilled' && Array.isArray(receiptsRes.value.data) ? receiptsRes.value.data : [];

    const realPaidTotal = receiptsData
      .filter((r: any) => !r.cancelled_at)
      .reduce((sum: number, r: any) => sum + Number(r.amount || 0), 0);

    // تحويل جدول الحصص إلى نسق الجدول الأسبوعي TimetableGrid
    const dayMap: Record<string, number> = {
      'الأحد': 0,
      'الإثنين': 1,
      'الاثنين': 1,
      'الثلاثاء': 2,
      'الأربعاء': 3,
      'الخميس': 4,
      'الجمعة': 5,
      'السبت': 6,
    };

    let lessonId = 1;
    const lessons: any[] = [];
    if (Array.isArray(timetableData.schedule)) {
      timetableData.schedule.forEach((d: any) => {
        const dayNum = dayMap[d.day] ?? 1;
        (d.sessions || []).forEach((s: any, idx: number) => {
          const parts = (s.time || '').split('-');
          lessons.push({
            id: lessonId++,
            subject: s.subject || 'مادة',
            teacher: 'الأستاذ',
            room: s.room || 'قاعة 4',
            day: dayNum,
            period: idx + 1,
            startTime: parts[0]?.trim() || '08:00',
            endTime: parts[1]?.trim() || '10:00',
          });
        });
      });
    }

    // تحويل الامتحانات
    const exams = examsData.map((e: any, idx: number) => ({
      id: e.id || idx + 1,
      subject: e.title || 'امتحان',
      type: (e.type?.includes('فرض') ? 'فرض' : e.type?.includes('اختبار') ? 'اختبار' : 'امتحان'),
      date: e.date || new Date().toISOString().split('T')[0],
      time: '08:30',
      duration: 60,
      room: 'قاعة الامتحانات',
      teacher: 'المشرف',
    }));

    // تحويل النوادي
    const clubs = clubsData.map((c: any) => ({
      id: c.id,
      name: c.club_name || c.name || 'نادي مدرسي',
      type: 'ثقافي',
      schedule: 'السبت 14:00 - 16:00',
      teacher: 'المشرف',
      location: 'فضاء الأنشطة',
      fee: Number(c.fee || 0),
    }));

    const activeEnrollment = profile.enrollment;
    const sectionName = activeEnrollment?.section || 'د';
    const levelName = activeEnrollment?.level || 'السنة السادسة';
    const academicYear = activeEnrollment?.academic_year || '2026-2027';

    return {
      data: {
        data: {
          id: profile.id || id,
          name: profile.name || 'شهد حسيني',
          student_code: profile.student_code || 'PRV-2026-0569',
          section: sectionName,
          level: levelName,
          academic_year: academicYear,
          photo_url: profile.photo || undefined,
          average: gradesData.average ?? profile.stats?.average_score ?? null,
          weeklyExams: exams.length,
          attendance: {
            percentage: attData.stats?.attendance_rate ?? profile.stats?.attendance_rate ?? 100,
            presentDays: attData.stats?.present_days ?? profile.stats?.present_days ?? 0,
            absentDays: attData.stats?.absent_days ?? profile.stats?.absent_days ?? 0,
            lateDays: attData.stats?.late_days ?? profile.stats?.late_days ?? 0,
            records: attData.records || [],
          },
          timetable: lessons,
          exams: exams,
          clubs: clubs,
          ledger: {
            student_id: profile.id || id,
            total_due: 0,
            total_paid: realPaidTotal,
            discount: 0,
            installments: Array.isArray(rawLedger) ? rawLedger : [],
            receipts: receiptsData,
          },
        },
      },
    };
  },

  // الحضور والغياب
  getChildAttendance: (id: number) =>
    api.get(`/mobile/parent/children/${id}/attendance`),

  // جدول الحصص
  getChildTimetable: (id: number) =>
    api.get(`/mobile/parent/children/${id}/timetable`),

  // الفروض والامتحانات
  getChildExams: (id: number) =>
    api.get(`/mobile/parent/children/${id}/exams`),

  // كشف الحساب (المتخلد، الأقساط، الوصولات)
  getChildLedger: (id: number) =>
    api.get(`/mobile/parent/children/${id}/ledger`),

  // الوصولات
  getChildReceipts: (id: number) =>
    api.get(`/mobile/parent/children/${id}/receipts`),

  // النوادي والأنشطة
  getChildClubs: (id: number) =>
    api.get(`/mobile/parent/children/${id}/clubs`),

  // الدرجات والتقييمات
  getChildGrades: (id: number) =>
    api.get(`/mobile/parent/children/${id}/grades`),
};

// ======================
// Teacher APIs
// ======================
export const teacherAPI = {
  // أقسام المعلم
  getSections: () => api.get('/mobile/teacher/sections'),

  // طلاب القسم
  getSectionStudents: (sectionId: number) =>
    api.get(`/mobile/teacher/sections/${sectionId}/students`),

  // جلب سجلات الحضور لتاريخ معين
  getAttendance: (sectionId: number, date?: string) =>
    api.get(`/mobile/teacher/sections/${sectionId}/attendance`, { params: { date } }),

  // تسجيل الحضور
  submitAttendance: (sectionId: number, data: any) =>
    api.post(`/mobile/teacher/sections/${sectionId}/attendance`, data),

  // جلب النتائج المرصودة
  getResults: (sectionId: number, subject?: string, term?: string) =>
    api.get(`/mobile/teacher/sections/${sectionId}/results`, { params: { subject, term } }),

  // إدخال الدرجات والنتائج
  submitGrades: (sectionId: number, data: any) =>
    api.post(`/mobile/teacher/sections/${sectionId}/results`, data),

  // نشر إعلان أو واجب
  submitAnnouncement: (sectionId: number, data: any) =>
    api.post(`/mobile/teacher/sections/${sectionId}/announcements`, data),
};

// ======================
// Notifications APIs
// ======================
export const notificationsAPI = {
  // جلب الإشعارات الموحدة للوليّ
  getNotifications: () => api.get('/mobile/parent/notifications'),
  // جلب الإعلانات العامة
  getAnnouncements: () => api.get('/mobile/parent/announcements'),
};

// ======================
// Payment APIs
// ======================
export const paymentAPI = {
  // بدء الدفع
  initiatePayment: (data: any) =>
    api.post('/mobile/parent/payments/initiate', data),

  // تأكيد الدفع
  confirmPayment: (transactionId: string) =>
    api.post('/mobile/parent/payments/confirm', { transaction_id: transactionId }),

  // سجل المدفوعات
  getPaymentHistory: () =>
    api.get('/mobile/parent/payments/history'),
};

export default api;
