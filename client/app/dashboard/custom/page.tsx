'use client';

import { useAuth } from '@/context/AuthContext';
import {
  Calendar, CheckCircle, XCircle, FlaskConical, Users, Shield,
  Settings, Plus, ClipboardList, TestTube, Activity, LayoutDashboard,
} from 'lucide-react';
import Link from 'next/link';

// Maps every known permission key to a UI card
const PERMISSION_CARDS: Record<string, {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  link?: string;
}> = {
  'appointments.view': {
    title: 'View Appointments',
    description: 'See all scheduled appointments and their status.',
    icon: Calendar,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-500/10',
  },
  'appointments.create': {
    title: 'Book Appointments',
    description: 'Schedule new appointments for patients.',
    icon: Plus,
    color: 'text-teal-600 dark:text-teal-400',
    bgColor: 'bg-teal-50 dark:bg-teal-500/10',
  },
  'appointments.cancel': {
    title: 'Cancel Appointments',
    description: 'Cancel or reschedule existing appointments.',
    icon: XCircle,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-500/10',
  },
  'appointments.approve': {
    title: 'Approve Appointments',
    description: 'Review and approve pending appointment requests.',
    icon: CheckCircle,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-500/10',
  },
  'patients.view': {
    title: 'View Patients',
    description: 'Access patient records and medical information.',
    icon: Users,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-500/10',
  },
  'patients.create': {
    title: 'Add Patients',
    description: 'Register new patients into the system.',
    icon: Plus,
    color: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-50 dark:bg-indigo-500/10',
  },
  'patients.update': {
    title: 'Update Patients',
    description: 'Edit and update patient information and records.',
    icon: ClipboardList,
    color: 'text-cyan-600 dark:text-cyan-400',
    bgColor: 'bg-cyan-50 dark:bg-cyan-500/10',
  },
  'doctors.view': {
    title: 'View Doctors',
    description: 'See available doctors and their specializations.',
    icon: Activity,
    color: 'text-teal-600 dark:text-teal-400',
    bgColor: 'bg-teal-50 dark:bg-teal-500/10',
  },
  'doctors.manage': {
    title: 'Manage Doctors',
    description: 'Add, edit, and manage doctor profiles.',
    icon: Settings,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-50 dark:bg-orange-500/10',
  },
  'lab_reports.view': {
    title: 'View Lab Reports',
    description: 'Access and review patient laboratory test results.',
    icon: FlaskConical,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-500/10',
    link: '/dashboard/custom/lab-reports',
  },
  'lab_reports.create': {
    title: 'Create Lab Reports',
    description: 'Add new laboratory test results for patients.',
    icon: TestTube,
    color: 'text-lime-600 dark:text-lime-400',
    bgColor: 'bg-lime-50 dark:bg-lime-500/10',
    link: '/dashboard/custom/lab-reports',
  },
  'lab_reports.approve': {
    title: 'Approve Lab Reports',
    description: 'Review and approve lab reports before release.',
    icon: CheckCircle,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-500/10',
    link: '/dashboard/custom/lab-reports',
  },
  'users.view': {
    title: 'View Users',
    description: 'See all registered users in the system.',
    icon: Users,
    color: 'text-slate-600 dark:text-slate-400',
    bgColor: 'bg-slate-50 dark:bg-white/5',
  },
  'users.delete': {
    title: 'Delete Users',
    description: 'Remove user accounts from the system.',
    icon: XCircle,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-500/10',
  },
  'roles.manage': {
    title: 'Manage Roles',
    description: 'Create and configure roles and permissions.',
    icon: Shield,
    color: 'text-violet-600 dark:text-violet-400',
    bgColor: 'bg-violet-50 dark:bg-violet-500/10',
    link: '/dashboard/admin/roles',
  },
};

export default function CustomDashboard() {
  const { user } = useAuth();

  const permissions = user?.permissions_cache ?? [];

  // Only show cards for permissions that exist in the map
  const availableCards = permissions
    .filter(p => PERMISSION_CARDS[p])
    .map(p => ({ key: p, ...PERMISSION_CARDS[p] }));

  // Convert role key to a human-readable name: "lab_assistant" → "Lab Assistant"
  const roleName = user?.role
    ? user.role.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    : 'Staff';

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="border-l-2 border-teal-500 bg-slate-50 dark:bg-white/[0.02] pl-5 pr-6 py-4 rounded-r-xl">
        <p className="text-sm font-semibold text-slate-800 dark:text-white">
          Welcome, {user?.name || 'User'} 👋
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          You are logged in as{' '}
          <span className="font-medium text-teal-600 dark:text-teal-400 capitalize">{roleName}</span>.
          {' '}Your dashboard shows only the features you have access to.
        </p>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border border-slate-200 dark:border-white/10 rounded-xl p-4">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
            My Role
          </p>
          <p className="text-lg font-bold text-slate-900 dark:text-white capitalize">{roleName}</p>
        </div>
        <div className="border border-slate-200 dark:border-white/10 rounded-xl p-4">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
            Permissions
          </p>
          <p className="text-lg font-bold text-teal-600 dark:text-teal-400">{permissions.length}</p>
        </div>
        <div className="border border-slate-200 dark:border-white/10 rounded-xl p-4">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
            Active Modules
          </p>
          <p className="text-lg font-bold text-slate-900 dark:text-white">{availableCards.length}</p>
        </div>
      </div>

      {/* Permission cards */}
      {availableCards.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-4">
            <Shield size={28} className="text-slate-300 dark:text-slate-600" />
          </div>
          <h3 className="text-base font-semibold text-slate-700 dark:text-white mb-1">
            No permissions assigned yet
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
            Ask your administrator to assign permissions to your role in the Role Permissions page. 
            Once assigned, your tools will appear here on next login.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <LayoutDashboard size={15} className="text-slate-400" />
            <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Your Tools
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableCards.map(card => {
              const Icon = card.icon as React.ComponentType<{ size?: number; className?: string }>;
              const cardEl = (
                <div className="group border border-slate-200 dark:border-white/10 rounded-xl p-5 bg-white dark:bg-[#0d1117] hover:border-teal-300 dark:hover:border-teal-500/40 hover:shadow-md transition-all">
                  <div className={`w-10 h-10 rounded-lg ${card.bgColor} flex items-center justify-center mb-3`}>
                    <Icon size={20} className={card.color} />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {card.description}
                  </p>
                  {card.link && (
                    <span className="inline-block mt-3 text-xs font-medium text-teal-600 dark:text-teal-400 group-hover:underline">
                      Open →
                    </span>
                  )}
                </div>
              );

              return card.link ? (
                <Link key={card.key} href={card.link}>
                  {cardEl}
                </Link>
              ) : (
                <div key={card.key}>{cardEl}</div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
