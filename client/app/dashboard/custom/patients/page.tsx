'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, Users, AlertCircle, Plus, X, ChevronDown, Loader2, UserPlus } from 'lucide-react';

interface Patient {
  _id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  bloodGroup: string;
  age: number;
  createdAt: string;
}

const inputCls = "w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition";
const AVATAR_COLORS = ['bg-violet-500','bg-teal-500','bg-blue-500','bg-rose-500','bg-amber-500','bg-indigo-500'];

function AddPatientModal({ onClose, onCreated }: { onClose: () => void; onCreated: (u: Patient) => void }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'patient', phone: '', gender: 'Male' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const submit = async () => {
    if (!form.name || !form.email || !form.password) { setError('Name, email and password are required'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setSaving(true); setError('');
    try {
      const res = await api.post('/admin/users', form);
      onCreated(res.data.data);
      onClose();
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to create patient');
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#161b27] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center">
              <UserPlus size={16} className="text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">Add new patient</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Register a patient account</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400"><X size={16} /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full name *</label>
            <input className={inputCls} placeholder="Patient name" value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email *</label>
            <input className={inputCls} type="email" placeholder="patient@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password *</label>
            <input className={inputCls} type="password" placeholder="Min. 6 characters" value={form.password} onChange={e => set('password', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Phone</label>
              <input className={inputCls} placeholder="+91 9999999999" value={form.phone} onChange={e => set('phone', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Gender</label>
              <div className="relative">
                <select className={inputCls + ' appearance-none pr-8'} value={form.gender} onChange={e => set('gender', e.target.value)}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
          {error && <div className="px-3 py-2.5 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20"><p className="text-sm text-red-600 dark:text-red-400">{error}</p></div>}
        </div>
        <div className="flex gap-2 justify-end px-6 pb-5">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition">Cancel</button>
          <button onClick={submit} disabled={saving} className="px-5 py-2 text-sm rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium transition flex items-center gap-2 disabled:opacity-60">
            {saving && <Loader2 size={14} className="animate-spin" />}
            {saving ? 'Creating...' : 'Add patient'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CustomPatientsPage() {
  const { can } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');

  const canView = can('patients.view') || can('patients.create') || can('patients.update');
  const canAdd = can('patients.create');

  useEffect(() => {
    if (!canView) { setLoading(false); return; }
    api.get('/admin/users')
      .then(res => {
        const all = res.data.data || res.data || [];
        setPatients(all.filter((u: any) => u.role === 'patient'));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (!canView) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-3 text-slate-500 dark:text-slate-400">
        <AlertCircle size={40} className="opacity-30" />
        <p className="text-base font-semibold text-slate-700 dark:text-white">Access Denied</p>
        <p className="text-sm">You do not have permission to view patients.</p>
        <Link href="/dashboard/custom" className="text-sm text-teal-600 dark:text-teal-400 hover:underline mt-2">Back to dashboard</Link>
      </div>
    );
  }

  const filtered = patients.filter(p =>
    !search ||
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {showAdd && <AddPatientModal onClose={() => setShowAdd(false)} onCreated={p => setPatients(prev => [p, ...prev])} />}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/custom">
            <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 transition-colors"><ArrowLeft size={16} /></button>
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Patients</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">{patients.length} registered patients</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 w-48 transition" placeholder="Search patients..." value={search} onChange={e => setSearch(e.target.value)} />
          {canAdd && (
            <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 text-sm bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition">
              <Plus size={15} /> Add patient
            </button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-[#0d1117] rounded-xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 dark:border-white/5">
              <th className="text-left p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Patient</th>
              <th className="text-left p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</th>
              <th className="text-left p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Phone</th>
              <th className="text-left p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Gender</th>
              <th className="text-left p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Joined</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="py-16 text-center text-sm text-slate-400">Loading patients...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="py-16 text-center"><Users size={32} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" /><p className="text-sm text-slate-500">No patients found</p></td></tr>
            ) : (
              filtered.map((p, i) => (
                <tr key={p._id} className="border-t border-slate-100 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/[0.015] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-white font-semibold text-sm shrink-0`}>
                        {p.name?.charAt(0)?.toUpperCase() || 'P'}
                      </div>
                      <span className="font-medium text-slate-900 dark:text-white">{p.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-500 dark:text-slate-400">{p.email}</td>
                  <td className="p-4 text-slate-500 dark:text-slate-400">{p.phone || '-'}</td>
                  <td className="p-4 text-slate-500 dark:text-slate-400">{p.gender || '-'}</td>
                  <td className="p-4 text-slate-400 dark:text-slate-500">{p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
