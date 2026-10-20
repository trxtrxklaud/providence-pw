import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Users, CalendarCheck, ClipboardList } from 'lucide-react';
import { teacherService } from '@/services/teacherService';
import { useAuthStore } from '@/store/useAuthStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { getApiErrorMessage } from '@/utils/formatters';
import type { AttendanceStatus, SectionStudent } from '@/types/teacher';

type Tab = 'roster' | 'attendance';

const ATTENDANCE_OPTIONS: { key: AttendanceStatus; label: string; classes: string }[] = [
  { key: 'present', label: 'حاضر', classes: 'bg-emerald-500 text-white border-emerald-500' },
  { key: 'absent', label: 'غائب', classes: 'bg-red-500 text-white border-red-500' },
  { key: 'late', label: 'متأخر', classes: 'bg-amber-500 text-white border-amber-500' },
  { key: 'excused', label: 'بعذر', classes: 'bg-purple-500 text-white border-purple-500' },
];

/** صحة القسم: القائمة + تسجيل حضور اليوم (النتائج ي المرحلة القادمة). */
const TeacherSectionPage: React.FC = () => {
  const { sectionId } = useParams<{ sectionId: string }>();
  const { hasPermission } = useAuthStore();

  const [tab, setTab] = useState<Tab>('roster');
  const [students, setStudents] = useState<SectionStudent[]>([]);
  const [sectionName, setSectionName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const canAttendance = hasPermission('manage_attendance');
  const canGrades = hasPermission('manage_grades');

  const today = new Date().toISOString().slice(0, 10);
  const [attendance, setAttendance] = useState<Record<number, AttendanceStatus>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await teacherService.getSectionStudents(Number(sectionId));
        if (!cancelled) setStudents(data);
        // اسم القسم من لوحة الأقسام (استعلام واحد خي).
        const sections = await teacherService.getSections();
        const found = sections.find((s) => s.id === Number(sectionId));
        if (!cancelled) setSectionName(found ? `${found.name} — ${found.level ?? ''}` : `قسم #${sectionId}`);
      } catch (err) {
        if (!cancelled) setError(getApiErrorMessage(err));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sectionId]);

  const markedCount = useMemo(
    () => Object.keys(attendance).length,
    [attendance]
  );

  const handleMark = (enrollmentId: number, status: AttendanceStatus) => {
    setAttendance((prev) => ({ ...prev, [enrollmentId]: status }));
    setSaveMsg('');
    setSaveError('');
  };

  const markAll = (status: AttendanceStatus) => {
    const all: Record<number, AttendanceStatus> = {};
    students.forEach((s) => {
      all[s.enrollment_id] = status;
    });
    setAttendance(all);
    setSaveMsg('');
    setSaveError('');
  };

  const saveAttendance = async () => {
    if (markedCount === 0) return;
    setIsSaving(true);
    setSaveMsg('');
    setSaveError('');
    try {
      const result = await teacherService.storeAttendance(Number(sectionId), {
        date: today,
        entries: Object.entries(attendance).map(([enrollmentId, status]) => ({
          enrollment_id: Number(enrollmentId),
          status,
        })),
      });
      setSaveMsg(`${result.message} (${result.saved})`);
    } catch (err) {
      setSaveError(getApiErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  if (error) {
    return <ErrorState title="تعذّر تحميل القسم" message={error} />;
  }

  return (
    <div className="space-y-6" dir="rtl">
      <header className="flex items-center gap-3">
        <Link
          to="/teacher"
          className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
          aria-label="عودة"
        >
          <ArrowRight className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900">{sectionName}</h1>
          <p className="text-sm text-slate-500 mt-0.5">{students.length} تلميذ</p>
        </div>
      </header>

      {/* التبويبات */}
      <div className="flex gap-2 border-b-2 border-slate-100">
        <TabButton active={tab === 'roster'} onClick={() => setTab('roster')} icon={<Users className="w-4 h-4" />}>
          القائمة
        </TabButton>
        {canAttendance && (
          <TabButton
            active={tab === 'attendance'}
            onClick={() => setTab('attendance')}
            icon={<CalendarCheck className="w-4 h-4" />}
          >
            حضور اليوم
          </TabButton>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : students.length === 0 ? (
        <EmptyState
          icon={<Users className="w-8 h-8" />}
          title="لا تلاميذ ي هذا القسم"
          description="قسم بلا تسجيلات نشطة حالياً."
        />
      ) : tab === 'roster' ? (
        <Card className="p-0 overflow-hidden">
          <ul className="divide-y divide-slate-100">
            {students.map((s, idx) => (
              <li key={s.enrollment_id} className="flex items-center gap-3 p-4">
                <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-purple-600 text-white text-xs font-black flex items-center justify-center">
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <p className="font-bold text-sm text-slate-800">{s.name}</p>
                  <p className="text-xs text-slate-400">{s.student_code ?? '—'}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-xs font-bold text-slate-500">
              تمّ تحديد {markedCount} من {students.length}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => markAll('present')}>
                الجميع حاضر
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {students.map((s) => (
              <Card key={s.enrollment_id} className="p-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <p className="font-bold text-sm text-slate-800">{s.name}</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {ATTENDANCE_OPTIONS.map((opt) => {
                      const active = attendance[s.enrollment_id] === opt.key;
                      return (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => handleMark(s.enrollment_id, opt.key)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all ${
                            active
                              ? opt.classes
                              : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {saveMsg && (
            <p className="text-sm font-bold text-emerald-600 bg-emerald-50 rounded-xl p-3 text-center">
              {saveMsg}
            </p>
          )}
          {saveError && (
            <p className="text-sm font-bold text-red-600 bg-red-50 rounded-xl p-3 text-center">
              {saveError}
            </p>
          )}

          <Button
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isSaving}
            disabled={markedCount === 0}
            onClick={saveAttendance}
          >
            حظ الحضور ({markedCount})
          </Button>
        </div>
      )}

      {canGrades && (
        <p className="text-xs text-slate-400 flex items-center gap-1.5">
          <ClipboardList className="w-3.5 h-3.5" />
          إدخال النتائج سيتاح ي التحديث القادم لهذا القسم.
        </p>
      )}
    </div>
  );
};

const TabButton: React.FC<{
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ active, onClick, icon, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-1.5 px-4 pb-2.5 text-sm font-bold transition-colors border-b-2 -mb-[2px] ${
      active
        ? 'text-orange-600 border-orange-500'
        : 'text-slate-400 border-transparent hover:text-slate-600'
    }`}
  >
    {icon}
    {children}
  </button>
);

export default TeacherSectionPage;
