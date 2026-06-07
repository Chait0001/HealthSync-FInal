'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, Calendar, Clock, Check, X, Loader2, AlertCircle } from 'lucide-react';

interface Appointment {
  _id: string;
  patientId: { _id: string; name: string; email: string };
  doctorId: { _id: string; userId: { name: string }; specialization: string };
  date: string;
  status: string;
  reason: string;
}

export default function CustomAppointmentsPage() {
  const { can } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'cancelled'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // What this user can do
  const canView = can('appointments.view') || can('appointments.approve') || can('appointments.cancel');
  const canApprove = can('appointments.approve');
  const canCancel = can('appointments.cancel');

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      // Fetch both pending and scheduled in parallel; each may 403 for limited roles
      const [pendingRes, scheduledRes] = await Promise.allSettled([
        api.get('/admin/appointments/pending'),
        api.get('/admin/appointments/scheduled'),
      ]);
      const pending =
        pendingRes.status === 'fulfilled'
          ? pendingRes.value.data?.data ?? []
          : [];
      const scheduled =
        scheduledRes.status === 'fulfilled'
          ? scheduledRes.value.data?.data ?? []
          : [];
      setAppointments([...pending, ...scheduled]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const label = status === 'approved' ? 'Approve' : 'Cancel';
    if (!confirm(`${label} this appointment?`)) return;
    setUpdatingId(id);
    try {
      await api.put(`/appointments/${id}/status`, { status });
      setAppointments(prev =>
        prev.map(a => (a._id === id ? { ...a, status } : a))
      );
    } catch {
      alert('Failed to update appointment. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered =
    filter === 'all'
      ? appointments
      : appointments.filter(a => a.status === filter);

  const counts = {
    all: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    approved: appointments.filter(a => a.status === 'approved').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  };

  const STATUS_STYLE: Record<string, string> = {
    approved: 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400',
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400',
  };

  const DOT_STYLE: Record<string, string> = {
    approved: 'bg-green-600',
    cancelled: 'bg-red-600',
    pending: 'bg-yellow-600',
  };

  // Access-denied guard
  if (!canView) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-3 text-slate-500 dark:text-slate-400">
        <AlertCircle size={40} className="opacity-30" />
        <p className="text-base font-semibold text-slate-700 dark:text-white">Access Denied</p>
        <p className="text-sm">You do not have permission to view appointments.</p>
        <Link
          href="/dashboard/custom"
          className="text-sm text-teal-600 dark:text-teal-400 hover:underline mt-2"
        >
          ← Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/custom">
            <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 transition-colors">
              <ArrowLeft size={16} />
            </button>
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Appointments</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {[canApprove && 'Approve', canCancel && 'Cancel']
                .filter(Boolean)
                .join(' · ') || 'View only'}
            </p>
          </div>
        </div>
        {/* Capability badges */}
        <div className="flex gap-1.5 text-xs">
          {canApprove && (
            <span className="px-2 py-1 rounded-full bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 font-medium border border-green-200 dark:border-green-500/20">
              Can Approve
            </span>
          )}
          {canCancel && (
            <span className="px-2 py-1 rounded-full bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 font-medium border border-red-200 dark:border-red-500/20">
              Can Cancel
            </span>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'pending', 'approved', 'cancelled'] as const).map(f => (
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
            <span
              className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                filter === f ? 'bg-white/20' : 'bg-slate-100 dark:bg-white/10'
              }`}
            >
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
            <Loader2 size={16} className="animate-spin" /> Loading appointments…
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Calendar size={32} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No {filter === 'all' ? '' : filter} appointments found
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-white/5">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Date &amp; Time
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Status / Actions
                  </th>
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
                        {apt.patientId?.name || 'Unknown'}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {apt.patientId?.email}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-900 dark:text-white">
                        Dr. {apt.doctorId?.userId?.name || 'Unknown'}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {apt.doctorId?.specialization}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-slate-900 dark:text-white">
                        {new Date(apt.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock size={11} />
                        {new Date(apt.date).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-slate-600 dark:text-slate-300 max-w-[150px] truncate text-xs">
                        {apt.reason}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col items-end gap-2">
                        {/* Status badge */}
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                            STATUS_STYLE[apt.status] ?? STATUS_STYLE.pending
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              DOT_STYLE[apt.status] ?? DOT_STYLE.pending
                            }`}
                          />
                          {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                        </span>

                        {/* Approve + Decline — only if user has appointments.approve */}
                        {canApprove && apt.status === 'pending' && (
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => updateStatus(apt._id, 'approved')}
                              disabled={updatingId === apt._id}
                              className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-600 dark:text-green-400 transition-all disabled:opacity-50"
                            >
                              {updatingId === apt._id ? (
                                <Loader2 size={11} className="animate-spin" />
                              ) : (
                                <Check size={11} />
                              )}
                              Approve
                            </button>
                            <button
                              onClick={() => updateStatus(apt._id, 'cancelled')}
                              disabled={updatingId === apt._id}
                              className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-600 dark:text-red-400 transition-all disabled:opacity-50"
                            >
                              <X size={11} /> Decline
                            </button>
                          </div>
                        )}

                        {/* Cancel — only if user has appointments.cancel */}
                        {canCancel && apt.status === 'approved' && (
                          <button
                            onClick={() => updateStatus(apt._id, 'cancelled')}
                            disabled={updatingId === apt._id}
                            className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all disabled:opacity-50"
                          >
                            {updatingId === apt._id ? (
                              <Loader2 size={11} className="animate-spin" />
                            ) : (
                              <X size={11} />
                            )}
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
