'use client';

import { useAuth } from '@/context/AuthContext';
import {
  Calendar, FlaskConical, Users, Shield, ClipboardList,
  Activity, ChevronRight,
} from 'lucide-react';
import Link from 'next/link';

// One card per module — shown if the user has ANY permission in requiredAny
const MODULE_GROUPS: {
  key: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderHover: string;
  link: string;
  requiredAny: string[];
}[] = [
  {
    key: 'appointments',
    title: 'Appointments',
    description: 'View, approve, or cancel appointments based on your access level.',
    icon: Calendar,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-500/10',
    borderHover: 'hover:border-blue-300 dark:hover:border-blue-600/40',
    link: '/dashboard/custom/appointments',
    requiredAny: ['appointments.view', 'appointments.create', 'appointments.cancel', 'appointments.approve'],
  },
  {
    key: 'lab_reports',
    title: 'Lab Reports',
    description: 'Create, view, or approve laboratory test reports.',
    icon: FlaskConical,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-500/10',
    borderHover: 'hover:border-emerald-300 dark:hover:border-emerald-600/40',
    link: '/dashboard/custom/lab-reports',
    requiredAny: ['lab_reports.view', 'lab_reports.create', 'lab_reports.approve'],
  },
  {
    key: 'users',
    title: 'All Users',
    description: 'View and add patients and doctors to the system.',
    icon: Users,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-500/10',
    borderHover: 'hover:border-purple-300 dark:hover:border-purple-600/40',
    link: '/dashboard/custom/users',
    requiredAny: ['users.view', 'patients.view', 'patients.create', 'patients.update'],
  },
  {
    key: 'doctors',
    title: 'Doctors',
    description: 'View doctor profiles and manage assignments.',
    icon: Activity,
    color: 'text-teal-600 dark:text-teal-400',
    bgColor: 'bg-teal-50 dark:bg-teal-500/10',
    borderHover: 'hover:border-teal-300 dark:hover:border-teal-600/40',
    link: '/dashboard/custom/doctors',
    requiredAny: ['doctors.view', 'doctors.manage'],
  },
  {
    key: 'users',
    title: 'Users',
    description: 'View and manage system user accounts.',
    icon: ClipboardList,
    color: 'text-slate-600 dark:text-slate-400',
    bgColor: 'bg-slate-50 dark:bg-slate-500/10',
    borderHover: 'hover:border-slate-300 dark:hover:border-slate-600/40',
    link: '/dashboard/custom/users',
    requiredAny: ['users.view', 'users.delete'],
  },
  {
    key: 'roles',
    title: 'Role Permissions',
    description: 'Manage roles and permission assignments.',
    icon: Shield,
    color: 'text-violet-600 dark:text-violet-400',
    bgColor: 'bg-violet-50 dark:bg-violet-500/10',
    borderHover: 'hover:border-violet-300 dark:hover:border-violet-600/40',
    link: '/dashboard/admin/roles',
    requiredAny: ['roles.manage'],
  },
];

export default function CustomDashboard() {
  const { user, can } = useAuth();

  const permissions = user?.permissions_cache ?? [];
  const visibleModules = MODULE_GROUPS.filter(m => m.requiredAny.some(p => can(p)));
  const roleName =
    user?.role?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Staff';

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="border-l-2 border-teal-600 bg-slate-50 dark:bg-white/[0.02] pl-5 pr-6 py-4 rounded-r-xl">
        <p className="text-sm font-semibold text-slate-800 dark:text-white">
          Welcome, {user?.name || 'User'} 👋
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          You are logged in as{' '}
          <span className="font-medium text-teal-600 dark:text-teal-400">{roleName}</span>.
          Your dashboard shows only modules you have access to.
        </p>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border border-slate-200 dark:border-white/10 rounded-lg p-4">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">My Role</p>
          <p className="text-lg font-bold text-slate-900 dark:text-white">{roleName}</p>
        </div>
        <div className="border border-slate-200 dark:border-white/10 rounded-lg p-4">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Permissions</p>
          <p className="text-lg font-bold text-teal-600 dark:text-teal-400">{permissions.length}</p>
        </div>
        <div className="border border-slate-200 dark:border-white/10 rounded-lg p-4">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Active Modules</p>
          <p className="text-lg font-bold text-slate-900 dark:text-white">{visibleModules.length}</p>
        </div>
      </div>

      {/* Module cards */}
      {visibleModules.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-4">
            <Shield size={28} className="text-slate-300 dark:text-slate-600" />
          </div>
          <h3 className="text-base font-semibold text-slate-700 dark:text-white mb-1">
            No permissions assigned yet
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
            Ask your administrator to assign permissions to your role.
            Your tools will appear here automatically.
          </p>
        </div>
      ) : (
        <>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Your Modules
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleModules.map(mod => {
              const Icon = mod.icon as React.ComponentType<{ size?: number; className?: string }>;
              return (
                <Link key={mod.key} href={mod.link}>
                  <div
                    className={`group border border-slate-200 dark:border-white/10 ${mod.borderHover} rounded-xl p-5 bg-white dark:bg-[#161b27] transition-all hover:shadow-md cursor-pointer`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-lg ${mod.bgColor} flex items-center justify-center`}>
                        <Icon size={20} className={mod.color} />
                      </div>
                      <ChevronRight
                        size={16}
                        className="text-slate-300 dark:text-slate-600 group-hover:text-teal-500 transition-colors mt-1"
                      />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                      {mod.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {mod.description}
                    </p>
                    {/* Show which sub-permissions the user actually has */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {mod.requiredAny
                        .filter(p => can(p))
                        .map(p => (
                          <span
                            key={p}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 font-mono"
                          >
                            {p.split('.')[1]}
                          </span>
                        ))}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
