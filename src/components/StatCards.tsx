export interface StatCard {
  icon: string;
  title: string;
  value: string | number;
  color: 'orange' | 'blue' | 'green' | 'red' | 'purple';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

interface Props {
  cards: StatCard[];
}

export default function StatCards({ cards = [] }: Props) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'orange':
        return 'bg-gradient-to-br from-orange-500 to-orange-600 shadow-orange-100';
      case 'blue':
        return 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-100';
      case 'green':
        return 'bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-100';
      case 'red':
        return 'bg-gradient-to-br from-rose-500 to-rose-600 shadow-rose-100';
      case 'purple':
        return 'bg-gradient-to-br from-purple-500 to-purple-600 shadow-purple-100';
      default:
        return 'bg-gradient-to-br from-slate-600 to-slate-700 shadow-slate-100';
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5" dir="rtl">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${getColorClasses(
            card.color
          )} rounded-2xl shadow-md p-4 text-white transition-all hover:shadow-lg hover:-translate-y-0.5`}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="text-2xl">{card.icon}</div>
            {card.trend && (
              <div
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  card.trend.isPositive ? 'bg-white/20 text-white' : 'bg-black/20 text-white'
                }`}
              >
                {card.trend.isPositive ? '↑' : '↓'} {card.trend.value}%
              </div>
            )}
          </div>
          <div className="text-2xl font-black mb-1 truncate font-mono">{card.value}</div>
          <div className="text-xs text-white/90 font-medium truncate">{card.title}</div>
        </div>
      ))}
    </div>
  );
}
