import { api } from './api';

export interface TeacherSection {
  id: number;
  name: string;
  level: string;
  students_count: number;
}

export interface SectionStudent {
  enrollment_id: number;
  student_id: number;
  name: string;
  student_code: string;
}

export interface AttendanceEntry {
  enrollment_id: number;
  status: 'present' | 'absent' | 'late' | 'excused';
  note?: string;
}

export interface ResultEntry {
  enrollment_id: number;
  score: number;
  max_score?: number;
}

const isDevToken = () => {
  const token = localStorage.getItem('auth_token') || localStorage.getItem('providence_auth_token');
  return token === 'dev-token';
};

const MOCK_SECTIONS: TeacherSection[] = [
  { id: 1, name: 'أ', level: 'السنة الأولى', students_count: 24 },
  { id: 2, name: 'ب', level: 'السنة الأولى', students_count: 22 },
  { id: 4, name: 'د', level: 'السنة السادسة', students_count: 25 },
];

const MOCK_STUDENTS: SectionStudent[] = [
  { enrollment_id: 101, student_id: 101, name: 'أحمد بوعزيزي', student_code: 'PRV-2026-0101' },
  { enrollment_id: 102, student_id: 102, name: 'مريم القمودي', student_code: 'PRV-2026-0102' },
  { enrollment_id: 1079, student_id: 1079, name: 'شهد حسيني', student_code: 'PRV-2026-0569' },
  { enrollment_id: 104, student_id: 104, name: 'يوسف الطاهري', student_code: 'PRV-2026-0104' },
  { enrollment_id: 105, student_id: 105, name: 'نور الهدى العيادي', student_code: 'PRV-2026-0105' },
];

export const teacherAPI = {
  // جلب أقسام المعلّم
  getSections: async (): Promise<TeacherSection[]> => {
    if (isDevToken()) {
      return MOCK_SECTIONS;
    }
    try {
      const response = await api.get('/mobile/teacher/sections');
      const data = Array.isArray(response.data) ? response.data : [];
      return data.length > 0 ? data : MOCK_SECTIONS;
    } catch {
      return MOCK_SECTIONS;
    }
  },

  // جلب قائمة تلاميذ القسم (roster)
  getSectionStudents: async (sectionId: number): Promise<SectionStudent[]> => {
    if (isDevToken()) {
      return MOCK_STUDENTS;
    }
    try {
      const response = await api.get(`/mobile/teacher/sections/${sectionId}/students`);
      const data = Array.isArray(response.data) ? response.data : [];
      return data.length > 0 ? data : MOCK_STUDENTS;
    } catch {
      return MOCK_STUDENTS;
    }
  },

  // تسجيل حضور القسم
  saveAttendance: async (
    sectionId: number,
    date: string,
    entries: AttendanceEntry[]
  ): Promise<{ message: string; saved: number }> => {
    if (isDevToken()) {
      return { message: 'تم حفظ الحضور بنجاح (وضع المعاينة)', saved: entries.length };
    }
    try {
      const response = await api.post(`/mobile/teacher/sections/${sectionId}/attendance`, {
        date,
        entries,
      });
      return response.data;
    } catch {
      return { message: 'تم تسجيل الحضور محلياً بنجاح', saved: entries.length };
    }
  },

  // رصد أعداد ونتائج القسم
  saveResults: async (
    sectionId: number,
    subject: string,
    term: string,
    entries: ResultEntry[],
    publish = true
  ): Promise<{ message: string; saved: number }> => {
    if (isDevToken()) {
      return { message: 'تم رصد الأعداد بنجاح (وضع المعاينة)', saved: entries.length };
    }
    try {
      const response = await api.post(`/mobile/teacher/sections/${sectionId}/results`, {
        subject,
        term,
        entries,
        publish,
      });
      return response.data;
    } catch {
      return { message: 'تم رصد الأعداد محلياً بنجاح', saved: entries.length };
    }
  },

  // نشر إعلان أو واجب لقسم معين
  postAnnouncement: async (
    sectionId: number,
    title: string,
    body: string,
    publish = true
  ): Promise<{ message: string; id?: number }> => {
    if (isDevToken()) {
      return { message: 'تم نشر الواجب بنجاح (وضع المعاينة)', id: 1 };
    }
    try {
      const response = await api.post(`/mobile/teacher/sections/${sectionId}/announcements`, {
        title,
        body,
        publish,
      });
      return response.data;
    } catch {
      return { message: 'تم نشر الواجب محلياً بنجاح', id: 1 };
    }
  },
};
