import apiClient from './api';
import type {
  Announcement,
  ChildLedgerResponse,
  ChildStudent,
  Receipt,
} from '@/types/parent';

export const parentService = {
  /**
   * جلب قائمة الأبناء المسجلين للوليّ الحالي.
   */
  async getChildren(): Promise<ChildStudent[]> {
    const response = await apiClient.get<ChildStudent[]>('/mobile/parent/children');
    return response.data;
  },

  /**
   * جلب كشف الدفعات والأقساط الشهرية لابن محدد.
   */
  async getChildLedger(childId: number): Promise<ChildLedgerResponse> {
    const response = await apiClient.get<ChildLedgerResponse>(
      `/mobile/parent/children/${childId}/ledger`
    );
    return response.data;
  },

  /**
   * جلب وصولات وسجل دفعات ابن محدد.
   */
  async getChildReceipts(childId: number): Promise<Receipt[]> {
    const response = await apiClient.get<Receipt[]>(
      `/mobile/parent/children/${childId}/receipts`
    );
    return response.data;
  },

  /**
   * جلب إعلانات المدرسة وأقسام الأبناء.
   */
  async getAnnouncements(): Promise<Announcement[]> {
    const response = await apiClient.get<Announcement[]>('/mobile/parent/announcements');
    return response.data;
  },

  /**
   * جلب مركز الإشعارات الموحد (إعلانات + غيابات + نتائج جديدة).
   */
  async getNotifications(): Promise<any[]> {
    const response = await apiClient.get<any[]>('/mobile/parent/notifications');
    return response.data;
  },
};
