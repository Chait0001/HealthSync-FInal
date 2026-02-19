import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

// Enhanced shimmer with gradient animation
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-slate-200",
        "before:absolute before:inset-0",
        "before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent",
        "before:animate-[shimmer_1.5s_infinite]",
        className
      )}
    />
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="border-t border-slate-100">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="h-4 w-28" />
        </div>
      </td>
      <td className="p-4">
        <Skeleton className="h-4 w-44" />
      </td>
      <td className="p-4">
        <Skeleton className="h-6 w-18 rounded-full" />
      </td>
      <td className="p-4">
        <Skeleton className="h-4 w-24" />
      </td>
      <td className="p-4 text-right">
        <Skeleton className="h-8 w-8 ml-auto rounded-md" />
      </td>
    </tr>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-sm">
      <div className="flex items-center gap-4">
        <Skeleton className="w-14 h-14 rounded-full" />
        <div className="space-y-3 flex-1">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
      <div className="space-y-2 pt-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>
    </div>
  );
}

export function AppointmentCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="w-14 h-14 rounded-full" />
          <div className="space-y-3">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
        <Skeleton className="h-9 w-24 rounded-full" />
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-gradient-to-r from-slate-100 to-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <Skeleton className="w-14 h-14 rounded-xl" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-9 w-16" />
        </div>
      </div>
    </div>
  );
}

export function DoctorCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="w-14 h-14 rounded-full" />
          <div className="space-y-3">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
      <div className="space-y-3 pt-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-44" />
        <Skeleton className="h-4 w-36" />
      </div>
    </div>
  );
}

export function PageHeaderSkeleton() {
  return (
    <div className="flex items-center justify-between mb-6">
      <Skeleton className="h-9 w-56" />
      <Skeleton className="h-10 w-36 rounded-lg" />
    </div>
  );
}

export function FullPageSkeleton() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <div className="grid md:grid-cols-3 gap-6">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
      <div className="space-y-4">
        <AppointmentCardSkeleton />
        <AppointmentCardSkeleton />
        <AppointmentCardSkeleton />
      </div>
    </div>
  );
}
