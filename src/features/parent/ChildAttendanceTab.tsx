import React from 'react';
import { Calendar, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export interface ChildAttendanceTabProps {
  childName: string;
}

export const ChildAttendanceTab: React.FC<ChildAttendanceTabProps> = ({ childName }) => {
  // Mock recent attendance history for display
  const records = [
    { date: '2026-09-08', status: 'present', label: 'حاضر', note: 'انتظام كامل في الحصص' },
    { date: '2026-09-07', status: 'present', label: 'حاضر', note: 'حضور في الموعد' },
    { date: '2026-09-05', status: 'late', label: 'تأخير 15 دقيقة', note: 'حصة الصباح الأولى' },
    { date: '2026-09-04', status: 'present', label: 'حاضر', note: '' },
    { date: '2026-09-03', status: 'excused', label: 'غياب مبرر', note: 'شهادة طبية معتمدة' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return (
          <Badge variant="success" size="sm">
            <CheckCircle2 className="w-3 h-3" /> حاضر
          </Badge>
        );
      case 'late':
        return (
          <Badge variant="warning" size="sm">
            <Clock className="w-3 h-3" /> متأخر
          </Badge>
        );
      case 'excused':
        return (
          <Badge variant="info" size="sm">
            <AlertCircle className="w-3 h-3" /> غياب مبرر
          </Badge>
        );
      case 'absent':
      default:
        return (
          <Badge variant="danger" size="sm">
            <XCircle className="w-3 h-3" /> غائب
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-4" dir="rtl">
      {/* Attendance Summary */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="text-center p-3.5 bg-emerald-50/50 border-emerald-100">
          <span className="text-xl font-black text-emerald-700">96%</span>
          <p className="text-[11px] font-bold text-emerald-800/80 mt-0.5">نسبة الانضباط</p>
        </Card>
        <Card className="text-center p-3.5 bg-amber-50/50 border-amber-100">
          <span className="text-xl font-black text-amber-700">1</span>
          <p className="text-[11px] font-bold text-amber-800/80 mt-0.5">مرات التأخير</p>
        </Card>
        <Card className="text-center p-3.5 bg-purple-50/50 border-purple-100">
          <span className="text-xl font-black text-purple-700">1</span>
          <p className="text-[11px] font-bold text-purple-800/80 mt-0.5">غياب مبرر</p>
        </Card>
      </div>

      {/* Attendance Log List */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-orange-500" />
            سجل الحضور الأخير لـ {childName}
          </h4>
          <span className="text-[10px] text-slate-400">سبتمبر 2026</span>
        </div>

        <div className="divide-y divide-slate-100">
          {records.map((rec, index) => (
            <div key={index} className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono text-slate-600 font-semibold">{rec.date}</span>
                {rec.note && <span className="text-[11px] text-slate-400">({rec.note})</span>}
              </div>
              <div>{getStatusBadge(rec.status)}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
