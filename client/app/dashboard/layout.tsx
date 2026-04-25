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
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar Skeleton */}
      <aside className="bg-card border-r border-border w-64 flex flex-col">
        <div className="p-4 border-b border-border">
          <Skeleton className="h-7 w-32" />
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
        </nav>
        <div className="p-4 border-t border-border space-y-3">
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
          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
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
    { href: '/dashboard/admin/appointments', label: 'Verify Appointments', icon: Calendar },
    { href: '/dashboard/admin/doctors', label: 'Manage Doctors', icon: Stethoscope },
    { href: '/dashboard/admin/users', label: 'All Users', icon: Users },
  ];

  let links = patientLinks;
  if (user.role === 'doctor') links = doctorLinks;
  if (user.role === 'admin') links = adminLinks;

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#080c14] text-slate-900 dark:text-white">
      {/* Sidebar */}
      <aside className={`bg-white dark:bg-[#0d1117] border-r border-slate-200 dark:border-white/5 shadow-sm dark:shadow-2xl transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col z-20`}>
        <div className="h-20 p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
          <Link href="/" className={`flex items-center gap-2 ${!isSidebarOpen && 'hidden'}`}>
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-lg shadow-teal-500/20">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">HealthSync</span>
          </Link>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-1.5 rounded-md hover:bg-slate-50 dark:hover:bg-white/5 text-slate-400 dark:text-neutral-400 hover:text-teal-600 dark:hover:text-white transition-colors lg:hidden">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-teal-50 dark:bg-teal-500/10 border-l-2 border-teal-600 dark:border-teal-400 text-teal-700 dark:text-teal-400 shadow-sm dark:shadow-[0_0_15px_rgba(20,184,166,0.1)]'
                    : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-teal-600 dark:hover:text-white'
                }`}
              >
                <link.icon size={20} className={isActive ? 'text-teal-600 dark:text-teal-400' : ''} />
                <span className={`${!isSidebarOpen && 'hidden'} font-medium`}>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-[#0a0f18]/50">
          <div className={`flex items-center gap-3 mb-4 ${!isSidebarOpen && 'justify-center'}`}>
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-500/20 border border-teal-100 dark:border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400 font-bold shadow-sm">
              {user.name?.charAt(0) || 'U'}
            </div>
            <div className={`${!isSidebarOpen && 'hidden'}`}>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{user.name || 'User'}</p>
              <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                user.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20' :
                user.role === 'doctor' ? 'bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-400 border border-teal-200 dark:border-teal-500/20' :
                'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20'
              }`}>
                {user.role}
              </span>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-colors px-4" onClick={logout}>
            <LogOut size={20} className="mr-3" />
            <span className={`${!isSidebarOpen && 'hidden'} font-medium`}>Logout</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
