import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, ShieldCheck, Briefcase, X } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export interface RoleSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleSelectorModal: React.FC<RoleSelectorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, activeRole, setActiveRole } = useAuthStore();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const roles = [
    {
      id: 'parent',
      name: 'بوابة ولي الأمر',
      description: 'متابعة الأبناء، الدفعات، الحضور والغياب، والإعلانات',
      icon: Users,
      color: 'from-orange-500 to-amber-600',
      path: '/parent',
    },
    {
      id: 'teacher',
      name: 'بوابة المعلم',
      description: 'إدارة الفصول، تسجيل الحضور، ورصد نتائج وتقييمات الطلاب',
      icon: BookOpen,
      color: 'from-purple-600 to-indigo-600',
      path: '/teacher',
    },
    {
      id: 'staff',
      name: 'بوابة الإدارة والموظفين',
      description: 'متابعة شؤون الطلاب، التسجيلات، والأقسام الدراسية',
      icon: Briefcase,
      color: 'from-blue-600 to-cyan-600',
      path: '/staff',
    },
    {
      id: 'admin',
      name: 'لوحة القيادة الإشرافية',
      description: 'الإحصاءات الشاملة، إدارة الحسابات، وصلاحيات النظام',
      icon: ShieldCheck,
      color: 'from-slate-800 to-slate-950',
      path: '/admin',
    },
  ];

  const handleSelectRole = (roleId: string, path: string) => {
    setActiveRole(roleId);
    onClose();
    navigate(path);
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      dir="rtl"
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              اختيار بوابة العمل
            </h3>
            <p className="text-xs text-slate-500">
              مرحباً بك، {user?.first_name || 'مستخدم'}. اختر الواجهة المناسبة:
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {roles.map((r) => {
            const Icon = r.icon;
            const isSelected = activeRole === r.id;

            return (
              <button
                key={r.id}
                onClick={() => handleSelectRole(r.id, r.path)}
                className={`w-full p-4 rounded-2xl border text-right transition-all duration-200 flex items-center gap-4 cursor-pointer ${
                  isSelected
                    ? 'border-orange-500 bg-orange-50/40 ring-2 ring-orange-200 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${r.color} text-white flex items-center justify-center shadow-md flex-shrink-0`}
                >
                  <Icon className="w-6 h-6 stroke-[2]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900">
                      {r.name}
                    </h4>
                    {isSelected && (
                      <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                        النشط حالياً
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    {r.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
