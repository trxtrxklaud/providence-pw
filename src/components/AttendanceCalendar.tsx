import { useState } from 'react';

export interface AttendanceDay {
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
}

interface Props {
  attendances: AttendanceDay[];
  month: Date;
}

export default function AttendanceCalendar({ attendances, month }: Props) {
  const [selectedDay, setSelectedDay] = useState<AttendanceDay | null>(null);

  const daysInMonth = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0
  ).getDate();

  const getAttendanceStatus = (day: number) => {
    const dateStr = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return attendances.find((a) => a.date === dateStr);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-500';
      case 'absent':
        return 'bg-red-500';
      case 'late':
        return 'bg-amber-500';
      case 'excused':
        return 'bg-blue-500';
      default:
        return 'bg-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-4" dir="rtl">
      <h3 className="font-bold text-lg mb-4 text-slate-800 text-right">
        سجل الحضور والغياب — {month.toLocaleDateString('ar-TN', { month: 'long', year: 'numeric' })}
      </h3>

      {/* Days Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'].map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-gray-500 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const attendance = getAttendanceStatus(day);

          return (
            <button
              key={day}
              type="button"
              onClick={() => attendance && setSelectedDay(attendance)}
              className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                attendance
                  ? `${getStatusColor(attendance.status)} text-white hover:opacity-90 shadow-2xs cursor-pointer`
                  : 'bg-gray-50 text-gray-400'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-5 text-xs text-gray-700 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span>حاضر</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>غائب</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <span>متأخر</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span>مُعتذر</span>
        </div>
      </div>

      {/* Selected Day Details */}
      {selectedDay && (
        <div className="mt-4 p-3.5 bg-gray-50 rounded-xl border border-gray-100 text-right animate-fadeIn">
          <div className="font-bold text-sm text-gray-900 mb-1">
            {new Date(selectedDay.date).toLocaleDateString('ar-TN', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </div>
          <div className="text-xs text-gray-700">
            {selectedDay.notes ? `ملاحظة: ${selectedDay.notes}` : 'حالة الحضور مسجلة بشكل رسمي'}
          </div>
        </div>
      )}
    </div>
  );
}
