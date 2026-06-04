'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/services/api';
import { ArrowLeft, Calendar, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface Appointment {
  _id: string;
  doctorId: { userId: { name: string }; specialization: string };
  date: string;
  status: string;
  reason: string;
  createdAt: string;
}

export default function AppointmentHistoryPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'approved' | 'cancelled' | 'pending'>('all');

  useEffect(() => {
    api.get('/appointments/my').then(res => {
      const data = res.data.data || res.data;
      setAppointments(Array.isArray(data) ? data : []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);

  const STATUS_ICON: Record<string, React.ReactNode> = {
    approved: <CheckCircle2 size={16} className="text-green-500" />,
    cancelled: <XCircle size={16} className="text-red-500" />,
    pending: <AlertCircle size={16} className="text-yellow-500" />,
  };

  const STATUS_STYLE: Record<string, string> = {
    approved: 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400',
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400',
  };

  const counts = {
    all: appointments.length,
    approved: appointments.filter(a => a.status === 'approved').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
    pending: appointments.filter(a => a.status === 'pending').length,
  };

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/patient">
          <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 transition-colors">
            <ArrowLeft size={16} />
          </button>
        </Link>
        <div>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Appointment History</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Full record of all your appointments</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'approved', 'cancelled', 'pending'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-sm rounded-lg font-medium transition capitalize flex items-center gap-1.5 ${
              filter === f
                ? 'bg-teal-600 text-white'
                : 'border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
            }`}
          >
            {f === 'all' ? 'All' : f}
            <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${filter === f ? 'bg-white/20' : 'bg-slate-100 dark:bg-white/10'}`}>
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center">
          <Calendar size={36} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No {filter === 'all' ? '' : filter} appointments found
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Doctor</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date &amp; Time</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Reason</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(apt => (
                <tr
                  key={apt._id}
                  className="border-t border-slate-100 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/[0.015] transition-colors"
                >
                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-900 dark:text-white">
                      Dr. {apt.doctorId?.userId?.name || 'Unknown'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {apt.doctorId?.specialization || 'General'}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-slate-900 dark:text-white">
                      {new Date(apt.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock size={11} />
                      {new Date(apt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-slate-600 dark:text-slate-300 max-w-[180px] truncate">{apt.reason}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLE[apt.status] || STATUS_STYLE.pending}`}>
                      {STATUS_ICON[apt.status]}
                      {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
