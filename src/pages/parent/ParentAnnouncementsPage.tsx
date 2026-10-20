import React, { useEffect, useState } from 'react';
import { Megaphone } from 'lucide-react';
import { parentService } from '@/services/parentService';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { getApiErrorMessage, formatDate } from '@/utils/formatters';
import type { Announcement } from '@/types/parent';

/** كل إعلانات المدرسة وأقسام الأبناء — المنشورة قط. */
const ParentAnnouncementsPage: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await parentService.getAnnouncements();
        if (!cancelled) setAnnouncements(data);
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
    return <ErrorState title="تعذّر تحميل الإعلانات" message={error} />;
  }

  return (
    <div className="space-y-6" dir="rtl">
      <header>
        <h1 className="text-2xl font-black text-slate-900">الإعلانات</h1>
        <p className="text-sm text-slate-500 mt-0.5">إعلانات المدرسة وأقسام الأبناء</p>
      </header>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-4 w-2/3 mb-2" />
              <Skeleton className="h-3 w-1/3" />
            </Card>
          ))}
        </div>
      ) : announcements.length === 0 ? (
        <EmptyState
          icon={<Megaphone className="w-8 h-8" />}
          title="لا إعلانات حالياً"
          description="ستظهر هنا كل إعلانات المدرسة ور نشرها."
        />
      ) : (
        <div className="space-y-4">
          {announcements.map((a) => (
            <Card key={a.id}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <h2 className="font-black text-slate-900">{a.title}</h2>
                <span className="text-[10px] text-slate-400 shrink-0 pt-1">
                  {formatDate(a.published_at)}
                </span>
              </div>
              {a.section?.name && (
                <p className="text-[10px] text-orange-600 font-bold mb-2">
                  قسم: {a.section.name}
                </p>
              )}
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {a.body}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ParentAnnouncementsPage;
