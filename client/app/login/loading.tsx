import { Skeleton } from '@/components/ui/Skeleton';

export default function LoginLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-slate-100 space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <Skeleton className="h-8 w-40 mx-auto" />
          <Skeleton className="h-4 w-56 mx-auto" />
        </div>

        {/* Form */}
        <div className="space-y-4">
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
          <Skeleton className="h-4 w-48 mx-auto" />
        </div>
      </div>
    </div>
  );
}
