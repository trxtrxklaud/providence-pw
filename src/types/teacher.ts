export interface TeacherSection {
  id: number;
  name: string;
  level?: string;
  students_count: number;
}

export interface SectionStudent {
  enrollment_id: number;
  student_id: number;
  name: string;
  student_code?: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceEntryPayload {
  enrollment_id: number;
  status: AttendanceStatus;
  note?: string;
}

/** مطابق لـ TeacherController@storeAttendance: date + entries[]. */
export interface AttendanceSubmitPayload {
  date: string;
  entries: AttendanceEntryPayload[];
}

export interface ResultEntryPayload {
  enrollment_id: number;
  score: number;
  max_score?: number;
}

/** مطابق لـ TeacherController@storeResults: subject + term + publish + entries[]. */
export interface ResultSubmitPayload {
  subject: string;
  term?: string;
  publish?: boolean;
  entries: ResultEntryPayload[];
}

export interface AnnouncementPayload {
  title: string;
  body: string;
  publish?: boolean;
}

export interface MutationResponse {
  message: string;
  saved: number;
}
