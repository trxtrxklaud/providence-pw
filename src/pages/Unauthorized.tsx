import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

/** 403 — لا يستعمل بديلاً عن حماية الـBackend، قط عرض واضح للمستخدم. */
const Unauthorized: React.FC = () => (
  <div className="max-w-md mx-auto py-16" dir="rtl">
    <Card className="text-center">
      <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
        <ShieldAlert className="w-7 h-7" />
      </div>
      <h1 className="text-lg font-black text-slate-900">لا تملك صلاحية الوصول</h1>
      <p className="mt-2 text-sm text-slate-500 leading-relaxed">
        حسابك لا يسمح بالوصول إلى هذا القسم. إن كان هذا خطأً تواصل مع
        إدارة المدرسة.
      </p>
      <Button variant="outline" className="mt-5" onClick={() => history.back()}>
        عودة
      </Button>
    </Card>
  </div>
);

export default Unauthorized;
