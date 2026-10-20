import EmptyState from './EmptyState';

export interface Club {
  id: number;
  name: string;
  type: 'رياضي' | 'ثقافي' | 'فني' | 'علمي';
  schedule: string;
  teacher: string;
  location: string;
  fee?: number;
}

interface Props {
  clubs?: Club[];
}

export default function ClubsList({ clubs = [] }: Props) {
  if (!clubs || clubs.length === 0) {
    return (
      <EmptyState
        icon="🎯"
        title="لا توجد أنشطة مسجلة"
        message="التلميذ غير مسجل في أي نادٍ مدرسي أو نشاط لاصفي حالياً."
      />
    );
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'رياضي':
        return '⚽';
      case 'ثقافي':
        return '📚';
      case 'فني':
        return '🎨';
      case 'علمي':
        return '🔬';
      default:
        return '📌';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'رياضي':
        return 'bg-green-500';
      case 'ثقافي':
        return 'bg-blue-500';
      case 'فني':
        return 'bg-purple-500';
      case 'علمي':
        return 'bg-amber-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden" dir="rtl">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <span>🎯</span>
          النوادي والأنشطة اللاصفية
        </h2>
      </div>

      <div className="divide-y divide-gray-100">
        {clubs.map((club) => (
          <div key={club.id} className="p-4 hover:bg-gray-50/70 transition-all">
            <div className="flex items-start gap-3">
              <div className="text-3xl p-2 bg-indigo-50 rounded-xl shrink-0">
                {getTypeIcon(club.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <h3 className="font-bold text-slate-900 text-sm">{club.name}</h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold text-white shadow-2xs ${getTypeColor(
                      club.type
                    )}`}
                  >
                    {club.type}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-1 truncate">
                    <span>🕐</span>
                    <span className="truncate">{club.schedule}</span>
                  </div>
                  <div className="flex items-center gap-1 truncate">
                    <span>👨‍🏫</span>
                    <span className="truncate">{club.teacher}</span>
                  </div>
                  <div className="flex items-center gap-1 truncate">
                    <span>📍</span>
                    <span className="truncate">{club.location}</span>
                  </div>
                  {club.fee !== undefined && (
                    <div className="flex items-center gap-1 font-semibold text-emerald-700">
                      <span>💰</span>
                      <span>{club.fee.toFixed(3)} د.ت/شهر</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
