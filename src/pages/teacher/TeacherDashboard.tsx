import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Users, Megaphone } from 'lucide-react';
import { teacherService } from '@/services/teacherService';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { getApiErrorMessage } from '@/utils/formatters';
import type { TeacherSection } from '@/types/teacher';

/**
 * لوحة المعلّم: أقسامه قط (النطاق يرض خادمياً عبر MobileScopeService).
 */
const TeacherDashboard: React.FC = () => {
  const [sections, setSections] = useState<TeacherSection[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await teacherService.getSections();
        if (!cancelled) setSections(data);
      } catch (err) {
        if (!cancelled) setError(getApiErrorMessage(err));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return <ErrorState title="تعذّر تحميل أقسامك" message={error} />;
  }

  const today = new Date().toLocaleDateString('ar-TN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="space-y-6" dir="rtl">
      <header>
        <h1 className="text-2xl font-black text-slate-900">دتر العمل</h1>
        <p className="text-sm text-slate-500 mt-0.5">{today}</p>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
            <GraduationCap className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-500">أقسامي</p>
          <p className="text-2xl font-black text-slate-900 mt-0.5">{sections.length}</p>
        </Card>
        <Card>
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-3">
            <Users className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-500">تلاميذي</p>
          <p className="text-2xl font-black text-slate-900 mt-0.5">
            {sections.reduce((sum, s) => sum + (s.students_count ?? 0), 0)}
          </p>
        </Card>
      </div>

      <div>
        <h2 className="text-sm font-black text-slate-900 mb-3">أقسامي الدراسية</h2>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(2)].map((_, i) => (
              <Card key={i}>
                <Skeleton className="h-5 w-24 mb-2" />
                <Skeleton className="h-4 w-16" />
              </Card>
            ))}
          </div>
        ) : sections.length === 0 ? (
          <EmptyState
            icon={<GraduationCap className="w-8 h-8" />}
            title="لا أقسام مسندة إليك"
            description="تواصل مع الإدارة لإسناد أقسامك الدراسية."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sections.map((section) => (
              <Link key={section.id} to={`/teacher/sections/${section.id}`} className="block">
                <Card hoverable className="group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-black text-slate-900">{section.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{section.level ?? '—'}</p>
                    </div>
                    <span className="text-xs font-bold bg-orange-50 text-orange-700 rounded-full px-3 py-1">
                      {section.students_count} تلميذ
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-slate-400 leading-relaxed flex items-center gap-1.5">
        <Megaphone className="w-3.5 h-3.5 shrink-0" />
        الحضور والنتائج والإعلانات تسجَّل لقسمك قط — البيانات المالية غير متاحة هنا.
      </p>
    </div>
  );
};

export default TeacherDashboard;
