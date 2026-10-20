import { useAppStore } from '../store/useAppStore';

export interface Child {
  id: number;
  name: string;
  section: string;
  level?: string;
  photo_url?: string;
}

interface Props {
  children?: Child[];
  activeChildId?: number | null;
  onChange?: (id: number) => void;
}

export default function ChildrenSwitcher({
  children: propChildren,
  activeChildId: propActiveChildId,
  onChange,
}: Props = {}) {
  const store = useAppStore();

  const childrenList = propChildren || store.children;
  const currentActiveId = propActiveChildId !== undefined ? propActiveChildId : store.activeChildId;

  const handleSelect = (id: number) => {
    if (onChange) {
      onChange(id);
    }
    store.setActiveChild(id);
  };

  if (!childrenList || childrenList.length === 0) return null;

  return (
    <div className="bg-white border-b border-gray-200 py-3.5" dir="rtl">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-xs font-bold text-gray-500 mb-2.5 text-right">
          اختر الابن للمتابعة
        </h2>

        {/* Horizontal Scroll */}
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {childrenList.map((child: Child) => (
            <button
              key={child.id}
              type="button"
              onClick={() => handleSelect(child.id)}
              className={`flex-shrink-0 flex items-center gap-3 px-3.5 py-2.5 rounded-xl border-2 transition-all cursor-pointer ${
                currentActiveId === child.id
                  ? 'border-orange-500 bg-orange-50/80 shadow-xs'
                  : 'border-gray-200 bg-white hover:border-orange-300'
              }`}
            >
              {/* Photo */}
              <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden shrink-0 border border-slate-200">
                {child.photo_url ? (
                  <img
                    src={child.photo_url}
                    alt={child.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-lg">👦</span>
                )}
              </div>

              {/* Info */}
              <div className="text-right">
                <div className="font-bold text-slate-900 text-xs">{child.name}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  القسم: {child.section} {child.level ? `(${child.level})` : ''}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
