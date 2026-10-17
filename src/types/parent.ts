export interface EnrollmentInfo {
  enrollment_id: number;
  section?: string | null;
  level?: string | null;
  academic_year?: string | null;
}

/** مطابق لـ ParentController@children. */
export interface ChildStudent {
  id: number;
  name: string;
  student_code?: string;
  photo?: string | null;
  enrollments: EnrollmentInfo[];
}

/** مطابق لـ CollectionService@monthLedger: مصفوفة أقساط لكل شهر. */
export interface LedgerMonthEntry {
  payment_id: number;
  payment_date: string;
  method: string;
  amount: number;
  created_by?: string | null;
  items: { description?: string | null; amount: number }[];
}

export interface ChildLedgerResponse {
  enrollment_id?: number;
  ledger: Record<string, LedgerMonthEntry[]>;
  message?: string;
}

/** مطابق لـ ParentController@receipts. */
export interface ReceiptAllocation {
  amount: number;
  fee?: {
    id: number;
    description?: string | null;
    amount_due: number;
    due_date?: string | null;
    status?: string;
  } | null;
}

export interface Receipt {
  id: number;
  amount: number;
  payment_date?: string | null;
  months?: string[];
  method: string;
  reference?: string | null;
  cancelled_at?: string | null;
  allocations: ReceiptAllocation[];
}

/** مطابق لـ ParentController@announcements. */
export interface Announcement {
  id: number;
  scope?: string;
  section_id?: number | null;
  section?: { id: number; name: string } | null;
  title: string;
  body: string;
  published_at?: string | null;
}
