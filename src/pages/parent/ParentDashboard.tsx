import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, GraduationCap, Megaphone, Bell } from 'lucide-react';
import { parentService } from '@/services/parentService';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { getApiErrorMessage, formatDate } from '@/utils/formatters';
import type { Announcement, ChildStudent } from '@/types/parent';

/** لوحة الوليّ: أبناؤه (بطاقة لكل ابن) + آخر الإعلانات. */
const ParentDashboard: React.FC = () => {
  const [children, setChildren] = useState<ChildStudent[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [kids, news] = await Promise.all([
          parentService.getChildren(),
          parentService.getAnnouncements().catch(() => [] as Announcement[]),
        ]);
        if (!cancelled) {
          setChildren(kids);
          setAnnouncements(news.slice(0, 5));
        }
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
    return <ErrorState title="تعذّر تحميل بيانات الأبناء" message={error} />;
  }

  return (
    <div className="space-y-6" dir="rtl">
      <header>
        <h1 className="text-2xl font-black text-slate-900">أبنائي</h1>
        <p className="text-sm text-slate-500 mt-0.5">متابعة دراسية ومالية شاملة</p>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-14 w-full" />
            </Card>
          ))}
        </div>
      ) : children.length === 0 ? (
        <EmptyState
          icon={<GraduationCap className="w-8 h-8" />}
          title="لا أبناء مرتبطين برقمك"
          description="تواصل مع إدارة المدرسة لربط أبنائك برقم هاتفك."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {children.map((child) => {
            const latest = child.enrollments[0];
            return (
              <Link key={child.id} to={`/parent/children/${child.id}`} className="block">
                <Card hoverable>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 to-purple-600 text-white flex items-center justify-center font-black text-xl shrink-0">
                      {child.name.trim().charAt(0) || '؟'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-slate-900 truncate">{child.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">
                        {latest
                          ? `${latest.level ?? ''} ${latest.section ?? ''} — ${latest.academic_year ?? ''}`
                          : 'لا تسجيل نشط'}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        رقم التسجيل: {child.student_code ?? '—'}
                      </p>
                    </div>
                    <ArrowLeft className="w-5 h-5 text-slate-300 shrink-0" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {/* آخر الإعلانات */}
      <div>
        <h2 className="text-sm font-black text-slate-900 mb-3 flex items-center gap-1.5">
          <Bell className="w-4 h-4 text-orange-500" />
          إعلانات المدرسة
        </h2>

        {isLoading ? (
          <Card>
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-3 w-1/2" />
          </Card>
        ) : announcements.length === 0 ? (
          <EmptyState
            icon={<Megaphone className="w-8 h-8" />}
            title="لا إعلانات حالياً"
            description="ستظهر هنا إعلانات المدرسة وأقسام الأبناء."
            compact
          />
        ) : (
          <div className="space-y-3">
            {announcements.map((a) => (
              <Link key={a.id} to="/parent/announcements" className="block">
                <Card hoverable className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-bold text-sm text-slate-800">{a.title}</p>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {formatDate(a.published_at)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                    {a.body}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentDashboard;
