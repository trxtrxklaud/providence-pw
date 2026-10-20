import apiClient from './api';
import type {
  AcademicYear,
  DashboardStats,
  EmployeeListItem,
  Level,
  Section,
  StudentListItem,
} from '@/types/staff';

export const staffService = {
  /**
   * جلب ملخص الإحصاءات العامة للوحة التحكم — GET /dashboard
   * الاستجابة مغلّفة: { success, message, data: DashboardStats }.
   * الجرد النقدي (financial_summary/cash/treasury_balance) حِكر على
   * أصحاب manage_treasury أو view_reports — نعرضه فقط إن ورد.
   */
  async getDashboard(): Promise<DashboardStats> {
    const response = await apiClient.get<{ data: DashboardStats }>('/dashboard');
    return response.data.data;
  },

  /**
   * جلب قائمة السنوات الدراسية.
   */
  async getAcademicYears(): Promise<AcademicYear[]> {
    const response = await apiClient.get<AcademicYear[]>('/academic-years');
    return response.data;
  },

  /**
   * جلب المستويات الدراسية.
   */
  async getLevels(): Promise<Level[]> {
    const response = await apiClient.get<Level[]>('/levels');
    return response.data;
  },

  /**
   * جلب الأقسام والفصول.
   */
  async getSections(): Promise<Section[]> {
    const response = await apiClient.get<Section[]>('/sections');
    return response.data;
  },

  /**
   * البحث في قائمة الطلاب.
   */
  async getStudents(search?: string): Promise<{ data: StudentListItem[] } | StudentListItem[]> {
    const response = await apiClient.get<{ data: StudentListItem[] } | StudentListItem[]>(
      '/students',
      {
        params: search ? { search } : undefined,
      }
    );
    return response.data;
  },

  /**
   * جلب قائمة الموظفين والمعلمين.
   */
  async getEmployees(): Promise<{ data: EmployeeListItem[] } | EmployeeListItem[]> {
    const response = await apiClient.get<{ data: EmployeeListItem[] } | EmployeeListItem[]>(
      '/employees'
    );
    return response.data;
  },
};
