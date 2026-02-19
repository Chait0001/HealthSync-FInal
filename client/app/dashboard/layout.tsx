'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  LayoutDashboard,
  Calendar,
  Users,
  LogOut,
  FileText,
  Stethoscope
} from 'lucide-react';

// Skeleton Loading for the entire dashboard layout
function DashboardSkeleton() {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar Skeleton */}
      <aside className="bg-white border-r border-slate-200 w-64 flex flex-col">
        <div className="p-4 border-b border-slate-100">
          <Skeleton className="h-7 w-32" />
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
        </nav>
        <div className="p-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </aside>

      {/* Main Content Skeleton */}
      <main className="flex-1 overflow-auto p-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-9 w-56" />
            <Skeleton className="h-10 w-40 rounded-lg" />
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-slate-100 to-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-4">
                <Skeleton className="w-14 h-14 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-8 w-12" />
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-slate-100 to-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-4">
                <Skeleton className="w-14 h-14 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-8 w-12" />
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-slate-100 to-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-4">
                <Skeleton className="w-14 h-14 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-8 w-12" />
                </div>
              </div>
            </div>
          </div>

          {/* Content Cards */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <Skeleton className="h-6 w-40" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-3 w-36" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-20 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    // Role-based route protection
    if (!loading && user) {
      const isAdminRoute = pathname.startsWith('/dashboard/admin');
      const isDoctorRoute = pathname.startsWith('/dashboard/doctor');
      const isPatientRoute = pathname.startsWith('/dashboard/patient');

      // Redirect to correct dashboard based on role
      if (isAdminRoute && user.role !== 'admin') {
        router.replace(`/dashboard/${user.role}`);
      } else if (isDoctorRoute && user.role !== 'doctor') {
        router.replace(`/dashboard/${user.role}`);
      } else if (isPatientRoute && user.role !== 'patient') {
        router.replace(`/dashboard/${user.role}`);
      }
    }
  }, [user, loading, router, pathname]);

  // Show skeleton loading instead of plain text
  if (loading) return <DashboardSkeleton />;
  if (!user) return <DashboardSkeleton />;

  const patientLinks = [
    { href: '/dashboard/patient', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/patient/appointments', label: 'My Appointments', icon: Calendar },
    { href: '/dashboard/patient/history', label: 'Medical History', icon: FileText },
  ];

  const doctorLinks = [
    { href: '/dashboard/doctor', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/doctor/appointments', label: 'Appointments', icon: Calendar },
    { href: '/dashboard/doctor/patients', label: 'My Patients', icon: Users },
  ];

  const adminLinks = [
    { href: '/dashboard/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/admin/doctors', label: 'Manage Doctors', icon: Stethoscope },
    { href: '/dashboard/admin/users', label: 'All Users', icon: Users },
  ];

  let links = patientLinks;
  if (user.role === 'doctor') links = doctorLinks;
  if (user.role === 'admin') links = adminLinks;

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className={`bg-white border-r border-slate-200 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col`}>
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <span className={`font-bold text-xl text-blue-600 ${!isSidebarOpen && 'hidden'}`}>HealthSync</span>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-1 rounded hover:bg-slate-100 lg:hidden">
            {/* Mobile Toggle Placeholder */}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${pathname === link.href
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
            >
              <link.icon size={20} />
              <span className={`${!isSidebarOpen && 'hidden'}`}>{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className={`flex items-center gap-3 mb-4 ${!isSidebarOpen && 'justify-center'}`}>
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              {user.name?.charAt(0) || 'U'}
            </div>
            <div className={`${!isSidebarOpen && 'hidden'}`}>
              <p className="text-sm font-medium">{user.name || 'User'}</p>
              <p className="text-xs text-slate-500 capitalize">{user.role}</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600" onClick={logout}>
            <LogOut size={20} className="mr-2" />
            <span className={`${!isSidebarOpen && 'hidden'}`}>Logout</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  );
}
