import EmptyState from './EmptyState';

export interface Exam {
  id: number;
  subject: string;
  type: 'فرض' | 'امتحان' | 'اختبار';
  date: string;
  time: string;
  duration: number;
  room: string;
  teacher: string;
}

interface Props {
  exams?: Exam[];
}

export default function ExamSchedule({ exams = [] }: Props) {
  if (!exams || exams.length === 0) {
    return (
      <EmptyState
        icon="📝"
        title="لا توجد امتحانات مبرمجة"
        message="لا توجد روزنامة امتحانات أو فروض مراقبة مسجلة حالياً."
      />
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ar-TN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'فرض':
        return 'bg-blue-500';
      case 'امتحان':
        return 'bg-red-500';
      case 'اختبار':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const isToday = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dateStr === today;
  };

  const isUpcoming = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dateStr > today;
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden" dir="rtl">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <span>📅</span>
          جدول الفروض والامتحانات
        </h2>
      </div>

      {/* Exams List */}
      <div className="divide-y divide-gray-100">
        {exams.map((exam) => (
          <div
            key={exam.id}
            className={`p-4 hover:bg-gray-50/80 transition-all ${
              isToday(exam.date) ? 'bg-green-50/80 border-r-4 border-green-500' : ''
            }`}
          >
            {/* Badge & Subject */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold text-white shadow-2xs ${getTypeColor(
                    exam.type
                  )}`}
                >
                  {exam.type}
                </div>
                {isToday(exam.date) && (
                  <div className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-500 text-white animate-pulse">
                    اليوم
                  </div>
                )}
                {isUpcoming(exam.date) && !isToday(exam.date) && (
                  <div className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                    قادم
                  </div>
                )}
              </div>
              <div className="text-xl">📚</div>
            </div>

            {/* Subject */}
            <h3 className="text-base font-bold text-slate-900 mb-2">{exam.subject}</h3>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <span>📅</span>
                <span>{formatDate(exam.date)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>⏰</span>
                <span>الساعة: {exam.time}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>⏱️</span>
                <span>المدة: {exam.duration} دقيقة</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>🚪</span>
                <span>القاعة: {exam.room}</span>
              </div>
            </div>

            {/* Teacher */}
            <div className="mt-2.5 pt-2 border-t border-gray-100 text-xs text-slate-500">
              👨‍🏫 الأستاذ(ة): {exam.teacher}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
