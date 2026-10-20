import React from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const NotFound: React.FC = () => (
  <div className="max-w-md mx-auto py-16" dir="rtl">
    <Card className="text-center">
      <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-4">
        <Compass className="w-7 h-7" />
      </div>
      <h1 className="text-lg font-black text-slate-900">الصحة غير موجودة</h1>
      <p className="mt-1 text-3xl font-black bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
        404
      </p>
      <p className="mt-2 text-sm text-slate-500">الرابط الذي تحته غير صحيح أو نقل.</p>
      <Link to="/">
        <Button variant="primary" className="mt-5">
          العودة للرئيسية
        </Button>
      </Link>
    </Card>
  </div>
);

export default NotFound;
