import apiClient from './api';
import type {
  AnnouncementPayload,
  AttendanceSubmitPayload,
  MutationResponse,
  ResultSubmitPayload,
  SectionStudent,
  TeacherSection,
} from '@/types/teacher';
import type { Announcement } from '@/types/parent';

export const teacherService = {
  /** أقسام المعلّم المسندة إليه — GET /mobile/teacher/sections */
  async getSections(): Promise<TeacherSection[]> {
    const response = await apiClient.get<TeacherSection[]>('/mobile/teacher/sections');
    return response.data;
  },

  /** قائمة طلاب قسم — GET /mobile/teacher/sections/{id}/students */
  async getSectionStudents(sectionId: number): Promise<SectionStudent[]> {
    const response = await apiClient.get<SectionStudent[]>(
      `/mobile/teacher/sections/${sectionId}/students`
    );
    return response.data;
  },

  /** تسجيل حضور اليوم — POST /mobile/teacher/sections/{id}/attendance */
  async storeAttendance(sectionId: number, payload: AttendanceSubmitPayload): Promise<MutationResponse> {
    const response = await apiClient.post<MutationResponse>(
      `/mobile/teacher/sections/${sectionId}/attendance`,
      payload
    );
    return response.data;
  },

  /** إدخال نتائج/أعداد — POST /mobile/teacher/sections/{id}/results */
  async storeResults(sectionId: number, payload: ResultSubmitPayload): Promise<MutationResponse> {
    const response = await apiClient.post<MutationResponse>(
      `/mobile/teacher/sections/${sectionId}/results`,
      payload
    );
    return response.data;
  },

  /** نشر إعلان قسم — POST /mobile/teacher/sections/{id}/announcements */
  async storeAnnouncement(sectionId: number, payload: AnnouncementPayload): Promise<Announcement> {
    const response = await apiClient.post<Announcement>(
      `/mobile/teacher/sections/${sectionId}/announcements`,
      payload
    );
    return response.data;
  },
};
