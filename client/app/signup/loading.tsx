import { Skeleton } from '@/components/ui/Skeleton';

export default function SignupLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 py-12 px-4">
      <div className="w-full max-w-lg p-8 bg-white rounded-2xl shadow-xl border border-slate-100 space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="w-16 h-1 rounded" />
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-11 w-full rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-11 w-full rounded-lg" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>
          <Skeleton className="h-12 w-full rounded-lg mt-6" />
        </div>

        {/* Footer */}
        <div className="text-center">
          <Skeleton className="h-4 w-52 mx-auto" />
        </div>
      </div>
    </div>
  );
}
