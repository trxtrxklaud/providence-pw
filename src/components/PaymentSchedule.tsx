export interface Installment {
  id: number;
  month: string;
  amount: number;
  due_date: string;
  status: 'paid' | 'partial' | 'unpaid';
  paid_amount: number;
  paid_date: string | null;
}

export interface Receipt {
  id: number;
  number: string;
  date: string;
  amount: number;
  method: 'cash' | 'card' | 'transfer' | string;
}

interface Props {
  totalDue: number;
  totalPaid: number;
  discount: number;
  installments: Installment[];
  receipts: Receipt[];
}

export default function PaymentSchedule({
  totalDue = 0,
  totalPaid = 0,
  discount = 0,
  installments = [],
  receipts = [],
}: Props) {
  const formatTND = (amount: number) => {
    return `${Number(amount || 0).toFixed(3)} د.ت`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500';
      case 'partial':
        return 'bg-amber-500';
      case 'unpaid':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'خالص';
      case 'partial':
        return 'دفع جزئي';
      case 'unpaid':
        return 'غير مدفوع';
      default:
        return status;
    }
  };

  const isOverdue = (dueDate: string, status: string) => {
    if (status === 'paid') return false;
    return new Date(dueDate) < new Date();
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'cash':
        return 'نقداً بالصندوق';
      case 'card':
        return 'بطاقة بنكية';
      case 'transfer':
        return 'تحويل بنكي';
      default:
        return method;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden" dir="rtl">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <span>💰</span>
          الأقساط المدرسية وسجل الوصولات
        </h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 border-b border-gray-100">
        <div className="text-center p-3 bg-white rounded-xl border border-red-100 shadow-2xs">
          <div className="text-xl font-black text-red-600">{formatTND(totalDue)}</div>
          <div className="text-xs text-gray-500 mt-1 font-semibold">المتخلّد بالذمة</div>
        </div>
        <div className="text-center p-3 bg-white rounded-xl border border-green-100 shadow-2xs">
          <div className="text-xl font-black text-green-600">{formatTND(totalPaid)}</div>
          <div className="text-xs text-gray-500 mt-1 font-semibold">إجمالي المدفوع</div>
        </div>
        <div className="text-center p-3 bg-white rounded-xl border border-blue-100 shadow-2xs">
          <div className="text-xl font-black text-blue-600">{formatTND(discount)}</div>
          <div className="text-xs text-gray-500 mt-1 font-semibold">التخفيض السنوي</div>
        </div>
      </div>

      {/* Installments List */}
      <div className="divide-y divide-gray-100">
        {installments.length === 0 ? (
          <div className="p-6 text-center text-gray-400 text-xs">لا توجد أقساط مسجلة حالياً</div>
        ) : (
          installments.map((installment) => (
            <div
              key={installment.id}
              className={`p-4 hover:bg-gray-50/70 transition-all ${
                isOverdue(installment.due_date, installment.status) ? 'bg-red-50/40' : ''
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${getStatusColor(installment.status)}`}
                  ></div>
                  <h3 className="font-bold text-slate-900 text-sm">{installment.month}</h3>
                </div>
                <div
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    installment.status === 'paid'
                      ? 'bg-green-100 text-green-700'
                      : installment.status === 'partial'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-red-100 text-red-700'
                  }`}
                >
                  {getStatusText(installment.status)}
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-slate-600">
                  <span className="text-slate-400 block text-[11px]">المبلغ المستحق:</span>
                  <span className="font-bold text-slate-800">{formatTND(installment.amount)}</span>
                </div>
                {installment.paid_amount > 0 && (
                  <div className="text-slate-600">
                    <span className="text-slate-400 block text-[11px]">المدفوع:</span>
                    <span className="font-bold text-green-600">
                      {formatTND(installment.paid_amount)}
                    </span>
                  </div>
                )}
                <div className="text-slate-600">
                  <span className="text-slate-400 block text-[11px]">آخر أجل للدفع:</span>
                  <span
                    className={`font-semibold ${
                      isOverdue(installment.due_date, installment.status)
                        ? 'text-red-600'
                        : 'text-slate-700'
                    }`}
                  >
                    {new Date(installment.due_date).toLocaleDateString('ar-TN')}
                  </span>
                </div>
                {installment.paid_date && (
                  <div className="text-slate-600">
                    <span className="text-slate-400 block text-[11px]">تاريخ الدفع:</span>
                    <span className="font-semibold text-green-600">
                      {new Date(installment.paid_date).toLocaleDateString('ar-TN')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Receipts */}
      {receipts.length > 0 && (
        <div className="border-t border-gray-100 bg-slate-50/60 p-4">
          <h3 className="font-bold text-slate-800 mb-3 text-xs flex items-center gap-1.5">
            <span>🧾</span>
            سجل وصولات الدفع المسجلة بالخزينة
          </h3>
          <div className="space-y-2">
            {receipts.map((receipt) => (
              <div
                key={receipt.id}
                className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200/70 shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-bold">
                    🧾
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-800 font-mono">
                      {receipt.number}
                    </div>
                    <div className="text-[11px] text-gray-500">
                      {new Date(receipt.date).toLocaleDateString('ar-TN')} —{' '}
                      {getMethodLabel(receipt.method)}
                    </div>
                  </div>
                </div>
                <div className="font-black text-xs text-emerald-700 font-mono">
                  {formatTND(receipt.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
