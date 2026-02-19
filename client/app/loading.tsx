import { Skeleton } from '@/components/ui/Skeleton';

export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navbar Skeleton */}
      <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-20 rounded-lg" />
            <Skeleton className="h-10 w-24 rounded-lg" />
          </div>
        </div>
      </nav>

      {/* Hero Skeleton */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-6">
          <Skeleton className="h-14 w-3/4 mx-auto" />
          <Skeleton className="h-6 w-1/2 mx-auto" />
          <div className="flex items-center justify-center gap-4 pt-4">
            <Skeleton className="h-12 w-36 rounded-lg" />
            <Skeleton className="h-12 w-32 rounded-lg" />
          </div>
        </div>

        {/* Features Grid Skeleton */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 space-y-4">
              <Skeleton className="w-14 h-14 rounded-xl" />
              <Skeleton className="h-6 w-40" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
