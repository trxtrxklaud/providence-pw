export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-4 animate-pulse" dir="rtl">
      <div className="h-4 bg-gray-200 rounded-md w-3/4 mb-3"></div>
      <div className="h-3 bg-gray-200 rounded-md w-1/2 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded-md w-2/3"></div>
    </div>
  );
}

export function SkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3" dir="rtl">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden animate-pulse" dir="rtl">
      <div className="p-4 border-b border-gray-100">
        <div className="h-5 bg-gray-200 rounded-md w-1/3"></div>
      </div>
      <div className="p-4 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full shrink-0"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded-md w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded-md w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkeletonList;
