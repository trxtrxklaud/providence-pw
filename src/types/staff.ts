export interface AcademicYear {
  id: number;
  name: string;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
}

export interface Level {
  id: number;
  name: string;
  code?: string;
}

export interface Section {
  id: number;
  name: string;
  level_id?: number;
  level?: Level;
  capacity?: number;
}

export interface StudentListItem {
  id: number;
  first_name: string;
  last_name: string;
  student_code?: string;
  gender?: string;
  guardian_phone?: string;
  mother_phone?: string;
  is_active?: boolean;
}

export interface EmployeeListItem {
  id: number;
  full_name: string;
  staff_type: string;
  phone?: string;
  is_active: boolean;
}

export interface DashboardStats {
  current_date?: string;
  academic_year?: { id: number; name: string; is_active?: boolean } | null;
  total_students?: number;
  total_active_students?: number;
  active_students_count?: number;
  paid_registration_count?: number;
  unpaid_registration_count?: number;
  registration_rate?: number;
  new_students_this_year?: number;
  total_males?: number;
  total_females?: number;
  outstanding_balance?: number;
  upcoming_events?: unknown[];
  // الجرد النقدي — يَرد فقط لمن يملك manage_treasury أو view_reports:
  financial_summary?: Record<string, number>;
  cash?: Record<string, number>;
  treasury_balance?: number;
  [key: string]: unknown;
}
