'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, Calendar, Clock, Check, X, Loader2, AlertCircle, Plus, ChevronDown } from 'lucide-react';

interface Appointment {
  _id: string;
  patientId: { _id: string; name: string; email: string };
  doctorId: { _id: string; userId: { name: string }; specialization: string };
  date: string;
  status: string;
  reason: string;
}

interface Doctor {
  _id: string;
  userId: { name: string };
  specialization: string;
}

const inputCls = "w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition";

function BookModal({ onClose, onBooked }: { onClose: () => void; onBooked: () => void }) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [form, setForm] = useState({ doctorId: '', date: '', time: '09:00', reason: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/doctors').then(res => setDoctors(res.data.data || res.data || [])).catch(console.error);
  }, []);

  const submit = async () => {
    if (!form.doctorId || !form.date || !form.reason) { setError('All fields are required'); return; }
    setSaving(true); setError('');
    try {
      const dateTime = new Date(`${form.date}T${form.time}:00`);
      await api.post('/appointments', { doctorId: form.doctorId, date: dateTime.toISOString(), reason: form.reason });
      onBooked();
      onClose();
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to book appointment');
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#161b27] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/5">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Book Appointment</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Schedule a new appointment</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400"><X size={16} /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Select Doctor *</label>
            <div className="relative">
              <select className={inputCls + ' appearance-none pr-8'} value={form.doctorId} onChange={e => setForm(p => ({ ...p, doctorId: e.target.value }))}>
                <option value="">Choose a doctor</option>
                {doctors.map(d => (
                  <option key={d._id} value={d._id}>Dr. {d.userId?.name} - {d.specialization}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Date *</label>
              <input className={inputCls} type="date" min={new Date().toISOString().split('T')[0]} value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Time *</label>
              <input className={inputCls} type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Reason *</label>
            <textarea className={inputCls + ' resize-none'} rows={3} placeholder="Reason for appointment" value={form.reason} onChange={e => setForm(p => ({ ...p, reason: e.target.value }))} />
          </div>
          {error && <div className="px-3 py-2.5 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20"><p className="text-sm text-red-600 dark:text-red-400">{error}</p></div>}
        </div>
        <div className="flex gap-2 justify-end px-6 pb-5">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition">Cancel</button>
          <button onClick={submit} disabled={saving} className="px-5 py-2 text-sm rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium transition flex items-center gap-2 disabled:opacity-60">
            {saving && <Loader2 size={14} className="animate-spin" />}
            {saving ? 'Booking...' : 'Book appointment'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CustomAppointmentsPage() {
  const { can } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'cancelled'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [showBook, setShowBook] = useState(false);

  const canView = can('appointments.view') || can('appointments.approve') || can('appointments.cancel') || can('appointments.create');
  const canApprove = can('appointments.approve');
  const canCancel = can('appointments.cancel');
  const canCreate = can('appointments.create');

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const [r1, r2] = await Promise.allSettled([
        api.get('/admin/appointments/pending'),
        api.get('/admin/appointments/scheduled'),
      ]);
      const pending = r1.status === 'fulfilled' ? r1.value.data.data || [] : [];
      const scheduled = r2.status === 'fulfilled' ? r2.value.data.data || [] : [];
      setAppointments([...pending, ...scheduled]);
    } catch {
      try {
        const res = await api.get('/appointments/my');
        setAppointments(res.data.data || []);
      } catch (e) { console.error(e); }
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchAppointments(); }, []);

  const updateStatus = async (id: string, status: string) => {
    if (!confirm(`${status === 'approved' ? 'Approve' : 'Cancel'} this appointment?`)) return;
    setUpdatingId(id);
    try {
      await api.put(`/appointments/${id}/status`, { status });
      setAppointments(prev => prev.map(a => a._id === id ? { ...a, status } : a));
    } catch { alert('Failed to update appointment'); }
    finally { setUpdatingId(null); }
  };

  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);

  const STATUS_STYLE: Record<string, string> = {
    approved: 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400',
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400',
  };

  const counts = {
    all: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    approved: appointments.filter(a => a.status === 'approved').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  };

  if (!canView) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-3 text-slate-500 dark:text-slate-400">
        <AlertCircle size={40} className="opacity-30" />
        <p className="text-base font-semibold text-slate-700 dark:text-white">Access Denied</p>
        <p className="text-sm">You do not have permission to view appointments.</p>
        <Link href="/dashboard/custom" className="text-sm text-teal-600 dark:text-teal-400 hover:underline mt-2">Back to dashboard</Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {showBook && <BookModal onClose={() => setShowBook(false)} onBooked={fetchAppointments} />}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/custom">
            <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 transition-colors"><ArrowLeft size={16} /></button>
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Appointments</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {[canApprove && 'Approve', canCancel && 'Cancel', canCreate && 'Create'].filter(Boolean).join(' · ')}
            </p>
          </div>
        </div>
        {canCreate && (
          <button onClick={() => setShowBook(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition">
            <Plus size={15} /> Book Appointment
          </button>
        )}
      </div>

      <div className="flex gap-2 flex-wrap">
        {(['all', 'pending', 'approved', 'cancelled'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-sm rounded-lg font-medium transition capitalize flex items-center gap-1.5 ${filter === f ? 'bg-teal-600 text-white' : 'border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'}`}>
            {f === 'all' ? 'All' : f}
            <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${filter === f ? 'bg-white/20' : 'bg-slate-100 dark:bg-white/10'}`}>{counts[f]}</span>
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-sm">Loading appointments...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Calendar size={32} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
            <p className="text-sm text-slate-500 dark:text-slate-400">No {filter === 'all' ? '' : filter} appointments found</p>
            {canCreate && <button onClick={() => setShowBook(true)} className="mt-3 text-sm text-teal-600 dark:text-teal-400 hover:underline">Book first appointment</button>}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Patient</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Doctor</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date & Time</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Reason</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status / Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(apt => (
                <tr key={apt._id} className="border-t border-slate-100 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/[0.015] transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-900 dark:text-white">{apt.patientId?.name || 'Unknown'}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{apt.patientId?.email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-900 dark:text-white">Dr. {apt.doctorId?.userId?.name || 'Unknown'}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{apt.doctorId?.specialization}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-slate-900 dark:text-white">{new Date(apt.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5"><Clock size={11} /> {new Date(apt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </td>
                  <td className="px-5 py-4"><p className="text-slate-600 dark:text-slate-300 max-w-[150px] truncate text-xs">{apt.reason}</p></td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col items-end gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLE[apt.status] || STATUS_STYLE.pending}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${apt.status === 'approved' ? 'bg-green-600' : apt.status === 'cancelled' ? 'bg-red-600' : 'bg-yellow-600'}`}></span>
                        {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                      </span>
                      {canApprove && apt.status === 'pending' && (
                        <div className="flex gap-1.5">
                          <button onClick={() => updateStatus(apt._id, 'approved')} disabled={updatingId === apt._id}
                            className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-600 dark:text-green-400 transition disabled:opacity-50">
                            {updatingId === apt._id ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />} Approve
                          </button>
                          <button onClick={() => updateStatus(apt._id, 'cancelled')} disabled={updatingId === apt._id}
                            className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-600 dark:text-red-400 transition disabled:opacity-50">
                            <X size={11} /> Decline
                          </button>
                        </div>
                      )}
                      {canCancel && apt.status === 'approved' && (
                        <button onClick={() => updateStatus(apt._id, 'cancelled')} disabled={updatingId === apt._id}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition disabled:opacity-50">
                          {updatingId === apt._id ? <Loader2 size={11} className="animate-spin" /> : <X size={11} />} Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
