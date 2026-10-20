import apiClient from './api';

export interface AdminUserItem {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  is_active: boolean;
  role?: {
    id: number;
    name: string;
    display_name: string;
  };
}

export const adminService = {
  /**
   * جلب قائمة المستخدمين وإدارة الحسابات (Admin فقط).
   */
  async getUsers(): Promise<{ data: AdminUserItem[] } | AdminUserItem[]> {
    const response = await apiClient.get<{ data: AdminUserItem[] } | AdminUserItem[]>('/users');
    return response.data;
  },
};
