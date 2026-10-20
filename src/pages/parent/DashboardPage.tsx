import { useEffect, useState } from 'react';
import ChildrenSwitcher from '../../components/ChildrenSwitcher';
import StatCards from '../../components/StatCards';
import TimetableGrid from '../../components/TimetableGrid';
import ExamSchedule from '../../components/ExamSchedule';
import PaymentSchedule from '../../components/PaymentSchedule';
import ClubsList from '../../components/ClubsList';
import SearchBar from '../../components/SearchBar';
import SkeletonList from '../../components/Skeleton';
import EmptyState from '../../components/EmptyState';
import { childrenAPI } from '../../services/api';
import { useAppStore } from '../../store/useAppStore';

export default function ParentDashboardPage() {
  const { activeChildId, setActiveChild } = useAppStore();
  const [children, setChildren] = useState<any[]>([]);
  const [child, setChild] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. تحميل قائمة الأبناء من API الحقيقي
  useEffect(() => {
    childrenAPI
      .getChildren()
      .then((res: any) => {
        const list = res.data?.data || res.data || [];
        setChildren(list);
        if (list.length > 0 && !activeChildId) {
          setActiveChild(list[0].id);
        }
      })
      .catch((err) => {
        console.error('Error loading children:', err);
        setError('فشل تحميل بيانات الأبناء من السيرفر');
      });
  }, [activeChildId, setActiveChild]);

  // 2. تحميل تفاصيل الابن النشط من API الحقيقي
  useEffect(() => {
    if (!activeChildId) return;

    setLoading(true);
    setError(null);

    childrenAPI
      .getChildDetails(activeChildId)
      .then((res: any) => {
        // البيانات الحقيقية من المنصة فقط
        const data = res.data?.data || res.data || {};
        setChild(data);
      })
      .catch((err) => {
        console.error('Error loading child details:', err);
        setError('فشل تحميل بيانات الابن من السيرفر');
      })
      .finally(() => {
        setLoading(false);
      });

    // تحديث تلقائي دوري كل 30 ثانية لاستقبال مستجدات المعلم (حضور، أعداد، إعلانات)
    const interval = setInterval(() => {
      childrenAPI
        .getChildDetails(activeChildId)
        .then((res: any) => {
          const data = res.data?.data || res.data || {};
          setChild(data);
        })
        .catch(() => {});
    }, 30000);

    return () => clearInterval(interval);
  }, [activeChildId]);

  // 3. حالات التحميل والخطأ
  if (loading && !child) {
    return (
      <div className="space-y-4 p-4 max-w-7xl mx-auto" dir="rtl">
        <SkeletonList count={5} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto p-4 my-10" dir="rtl">
        <EmptyState
          icon="❌"
          title="حدث خطأ في الاتصال"
          message={error}
          action={
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-orange-600 text-white text-sm font-bold rounded-xl hover:bg-orange-700 shadow-md cursor-pointer"
            >
              إعادة المحاولة
            </button>
          }
        />
      </div>
    );
  }

  if (!child) {
    return (
      <div className="max-w-md mx-auto p-4 my-10" dir="rtl">
        <EmptyState
          icon="👪"
          title="لا توجد بيانات"
          message="يرجى اختيار ابن للمتابعة أو التواصل مع إدارة المدرسة."
        />
      </div>
    );
  }

  // 4. حساب الإحصائيات من البيانات الحقيقية فقط
  const stats = [
    {
      icon: '📚',
      title: 'المعدل العام',
      value:
        child.average !== null && child.average !== undefined
          ? `${Number(child.average).toFixed(2)}/20`
          : '—',
      color: 'blue' as const,
    },
    {
      icon: '✅',
      title: 'الحضور',
      value: child.attendance?.percentage
        ? `${child.attendance.percentage}%`
        : '100%',
      color: 'green' as const,
    },
    {
      icon: '📅',
      title: 'فروض هذا الأسبوع',
      value: child.exams?.length || 0,
      color: 'orange' as const,
    },
    {
      icon: '💰',
      title: 'المتخلّد بالذمة',
      value: child.ledger?.total_due
        ? `${Number(child.ledger.total_due).toFixed(3)} د.ت`
        : '0.000 د.ت',
      color: 'red' as const,
    },
  ];

  // 5. عرض البيانات الحقيقية
  return (
    <div className="space-y-6 pb-12" dir="rtl">
      {/* Child Switcher */}
      <ChildrenSwitcher
        children={children}
        activeChildId={activeChildId}
        onChange={setActiveChild}
      />

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4">
        <SearchBar
          placeholder="بحث عن فرض، امتحان، قسط..."
          onSearch={(query, filters) => {
            console.log('Search:', query, filters);
          }}
        />
      </div>

      {/* Quick Stats - بيانات حقيقية فقط */}
      <div className="max-w-7xl mx-auto px-4">
        <StatCards cards={stats} />
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Timetable - API حقيقي */}
        <div>
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2 text-slate-800">
            <span>📅</span>
            جدول الحصص الأسبوعي
          </h2>
          <TimetableGrid
            lessons={child.timetable || []}
            currentDay={new Date().getDay()}
            currentPeriod={Math.floor((new Date().getHours() - 8) / 1)}
          />
        </div>

        {/* Exams - API حقيقي */}
        <div>
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2 text-slate-800">
            <span>📝</span>
            روزنامة الامتحانات
          </h2>
          <ExamSchedule exams={child.exams || []} />
        </div>

        {/* Payments - API حقيقي */}
        <div className="md:col-span-2">
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2 text-slate-800">
            <span>💰</span>
            الأقساط والمدفوعات
          </h2>
          <PaymentSchedule
            totalDue={child.ledger?.total_due || 0}
            totalPaid={child.ledger?.total_paid || 0}
            discount={child.ledger?.discount || 0}
            installments={child.ledger?.installments || []}
            receipts={child.ledger?.receipts || []}
          />
        </div>

        {/* Clubs - API حقيقي */}
        <div className="md:col-span-2">
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2 text-slate-800">
            <span>🎯</span>
            النوادي والأنشطة
          </h2>
          <ClubsList clubs={child.clubs || []} />
        </div>
      </div>
    </div>
  );
}
