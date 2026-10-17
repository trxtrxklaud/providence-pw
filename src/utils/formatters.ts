/**
 * تنسيق المبالغ المالية بالدينار التونسي TND.
 */
export function formatCurrency(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return '0.000 د.ت';
  }
  const val = Number(amount);
  return `${val.toLocaleString('fr-TN', { minimumFractionDigits: 3, maximumFractionDigits: 3 })} د.ت`;
}

/**
 * تنسيق التاريخ باللغة العربية.
 */
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ar-TN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * تنسيق رقم الهاتف التونسي.
 */
export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return '—';
  const clean = phone.replace(/\D/g, '');
  if (clean.length === 8) {
    return `${clean.slice(0, 2)} ${clean.slice(2, 5)} ${clean.slice(5)}`;
  }
  return phone;
}

/**
 * استخراج رسالة خطأ عربية واضحة من استجابة Axios — الرسائل الخادمية
 * عربية أصلاً، والبقية تُترجم إلى أسباب مفهومة للمستخدم.
 */
export function getApiErrorMessage(err: unknown): string {
  const axiosErr = err as {
    response?: { status?: number; data?: { message?: string } };
    code?: string;
  };

  if (axiosErr?.response) {
    const { status, data } = axiosErr.response;

    if (data?.message) return data.message;

    switch (status) {
      case 401:
        return 'انتهت صلاحية الجلسة أو بيانات الدخول غير صحيحة. سجّل الدخول من جديد.';
      case 403:
        return 'لا تملك صلاحية الوصول إلى هذا القسم.';
      case 404:
        return 'العنصر المطلوب غير موجود.';
      case 422:
        return 'تحقّق من صحة البيانات المُدخلة.';
      case 429:
        return 'محاولات كثيرة متتالية — انتظر قليلاً ثم أعد المحاولة.';
      default:
        return 'حدث خطأ في الخادم. أعد المحاولة لاحقاً.';
    }
  }

  if (axiosErr?.code === 'ERR_NETWORK' || !navigator.onLine) {
    return 'لا يوجد اتصال بالإنترنت. تحقّق من الشبكة وأعد المحاولة.';
  }

  return 'حدث خطأ غير متوقع. أعد المحاولة.';
}
