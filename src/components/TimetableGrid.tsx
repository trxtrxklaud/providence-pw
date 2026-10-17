import EmptyState from './EmptyState';

export interface Lesson {
  id: number;
  subject: string;
  teacher: string;
  room: string;
  day: number; // 0-6 (0=الأحد ... 6=السبت)
  period: number; // 1-8
  startTime: string;
  endTime: string;
}

interface Props {
  lessons?: Lesson[];
  currentDay?: number;
  currentPeriod?: number;
}

export default function TimetableGrid({
  lessons = [],
  currentDay = new Date().getDay(),
  currentPeriod = 0,
}: Props) {
  if (!lessons || lessons.length === 0) {
    return (
      <EmptyState
        icon="📅"
        title="لا توجد حصص مسجلة"
        message="لم يتم إدراج جدول الحصص الأسبوعي لهذا القسم بعد."
      />
    );
  }

  const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const periods = [1, 2, 3, 4, 5, 6, 7, 8];
  const times = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];

  const getLesson = (day: number, period: number) => {
    return lessons.find((l) => l.day === day && l.period === period);
  };

  const isCurrentSlot = (day: number, period: number) => {
    return day === currentDay && period === currentPeriod;
  };

  const isNow = (day: number, period: number) => {
    const now = new Date();
    const currentHour = now.getHours();
    const activeDay = now.getDay();
    const adjustedPeriod = currentHour - 7; // period 1 starts around 8:00
    return day === activeDay && period === adjustedPeriod;
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden" dir="rtl">
      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <th className="p-3 border-b border-l border-white/20 min-w-[80px] text-center font-bold">
                الحصة
              </th>
              {days.map((day, dayIdx) => (
                <th
                  key={day}
                  className={`p-3 border-b border-l border-white/20 min-w-[130px] text-center font-bold ${
                    dayIdx === currentDay ? 'bg-white/20' : ''
                  }`}
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {periods.map((period, idx) => (
              <tr key={period} className={idx % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}>
                <td className="p-2 border-b border-l border-gray-200 text-center font-medium">
                  <div className="text-slate-900 font-bold text-xs">{period}</div>
                  <div className="text-[11px] text-gray-500">{times[idx]}</div>
                </td>
                {days.map((day, dayIdx) => {
                  const lesson = getLesson(dayIdx, period);
                  const isCurrent = isCurrentSlot(dayIdx, period);
                  const isLive = isNow(dayIdx, period);

                  return (
                    <td
                      key={`${day}-${period}`}
                      className={`p-1.5 border-b border-l border-gray-200 align-top ${
                        isLive ? 'bg-green-100/60 animate-pulse' : ''
                      }`}
                    >
                      {lesson ? (
                        <div
                          className={`p-2 rounded-lg border-2 transition-all ${
                            isLive
                              ? 'bg-green-100 border-green-500 shadow-xs'
                              : isCurrent
                                ? 'bg-orange-100/80 border-orange-300'
                                : 'bg-blue-50/60 border-blue-200'
                          }`}
                        >
                          <div className="font-bold text-slate-900 text-xs mb-1">
                            {lesson.subject}
                          </div>
                          <div className="text-slate-600 text-[11px] truncate">
                            👨‍🏫 {lesson.teacher}
                          </div>
                          <div className="text-slate-500 text-[10px] mt-0.5">
                            🚪 {lesson.room}
                          </div>
                          <div className="text-slate-400 text-[10px] mt-0.5 dir-ltr text-right">
                            ⏰ {lesson.startTime} - {lesson.endTime}
                          </div>
                        </div>
                      ) : (
                        <div className="h-full min-h-[75px] bg-slate-50/30 rounded-lg border-2 border-dashed border-gray-100"></div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="p-3.5 bg-slate-50 border-t border-gray-100">
        <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-700">
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded bg-green-200 border-2 border-green-500"></div>
            <span>حصة الآن</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded bg-orange-100 border-2 border-orange-300"></div>
            <span>حصة اليوم</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded bg-blue-50 border-2 border-blue-200"></div>
            <span>حصة عادية</span>
          </div>
        </div>
      </div>
    </div>
  );
}
