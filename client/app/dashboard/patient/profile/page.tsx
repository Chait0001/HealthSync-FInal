'use client';

import { useState } from 'react';
import Link from 'next/link';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import {
  User, Mail, Phone, MapPin, Droplets, Calendar,
  Edit3, Save, X, ArrowLeft, Shield, Clock
} from 'lucide-react';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const inputCls = "w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition";

export default function PatientProfilePage() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    phone: (user as any)?.phone || '',
    age: (user as any)?.age || '',
    gender: (user as any)?.gender || '',
    address: (user as any)?.address || '',
    bloodGroup: (user as any)?.bloodGroup || '',
  });

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const save = async () => {
    setSaving(true);
    try {
      await api.put('/auth/profile', form);
      
      // Update localStorage so it persists on reload/session
      const stored = localStorage.getItem('user');
      if (stored) {
        const parsed = JSON.parse(stored);
        const updatedUser = { ...parsed, ...form };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }

      setSuccess(true);
      setEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      alert('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const avatarColor = 'bg-teal-500';
  const initial = user?.name?.charAt(0)?.toUpperCase() || 'P';
  const joinDate = (user as any)?.createdAt
    ? new Date((user as any).createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—';

  return (
    <div className="max-w-2xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/patient">
          <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 transition-colors">
            <ArrowLeft size={16} />
          </button>
        </Link>
        <div>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white">My Profile</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">View and update your personal details</p>
        </div>
      </div>

      {/* Profile card */}
      <div className="bg-white dark:bg-[#161b27] border border-slate-200 dark:border-white/10 rounded-2xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className={`w-16 h-16 rounded-2xl ${avatarColor} flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
              {initial}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{user?.name || 'Patient'}</h2>
              <span className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-100 dark:border-teal-500/20">
                <Shield size={11} /> Patient
              </span>
            </div>
          </div>

          {/* Edit / Save / Cancel buttons */}
          {!editing ? (
            <button onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition font-medium">
              <Edit3 size={14} /> Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => setEditing(false)}
                className="p-2 rounded-lg border border-slate-200 dark:border-white/10 text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 transition">
                <X size={15} />
              </button>
              <button onClick={save} disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium transition disabled:opacity-60">
                <Save size={14} /> {saving ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          )}
        </div>

        {success && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-sm text-green-700 dark:text-green-400">
            ✓ Profile updated successfully
          </div>
        )}

        {/* Info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Email — always readonly */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <Mail size={12} /> Email
            </label>
            <p className="text-sm text-slate-900 dark:text-white px-3 py-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-transparent">
              {user?.email || '—'}
            </p>
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <Phone size={12} /> Phone
            </label>
            {editing ? (
              <input className={inputCls} placeholder="+91 9999999999" value={form.phone} onChange={e => set('phone', e.target.value)} />
            ) : (
              <p className="text-sm text-slate-900 dark:text-white px-3 py-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-transparent">
                {form.phone || <span className="text-slate-400 italic">Not set</span>}
              </p>
            )}
          </div>

          {/* Age */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <User size={12} /> Age
            </label>
            {editing ? (
              <input className={inputCls} type="number" placeholder="e.g. 28" value={form.age} onChange={e => set('age', e.target.value)} />
            ) : (
              <p className="text-sm text-slate-900 dark:text-white px-3 py-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-transparent">
                {form.age ? `${form.age} years` : <span className="text-slate-400 italic">Not set</span>}
              </p>
            )}
          </div>

          {/* Gender */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <User size={12} /> Gender
            </label>
            {editing ? (
              <select className={inputCls} value={form.gender} onChange={e => set('gender', e.target.value)}>
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <p className="text-sm text-slate-900 dark:text-white px-3 py-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-transparent">
                {form.gender || <span className="text-slate-400 italic">Not set</span>}
              </p>
            )}
          </div>

          {/* Blood Group */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <Droplets size={12} /> Blood Group
            </label>
            {editing ? (
              <select className={inputCls} value={form.bloodGroup} onChange={e => set('bloodGroup', e.target.value)}>
                <option value="">Select blood group</option>
                {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            ) : (
              <p className="text-sm font-semibold text-red-600 dark:text-red-400 px-3 py-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-transparent">
                {form.bloodGroup || <span className="text-slate-400 italic font-normal">Not set</span>}
              </p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <MapPin size={12} /> Address
            </label>
            {editing ? (
              <textarea className={inputCls + ' resize-none'} rows={2} placeholder="Your full address" value={form.address} onChange={e => set('address', e.target.value)} />
            ) : (
              <p className="text-sm text-slate-900 dark:text-white px-3 py-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-transparent">
                {form.address || <span className="text-slate-400 italic">Not set</span>}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Account info card */}
      <div className="bg-white dark:bg-[#161b27] border border-slate-200 dark:border-white/10 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Account Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1"><Clock size={11} /> Member since</p>
            <p className="text-sm font-medium text-slate-900 dark:text-white">{joinDate}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1"><Shield size={11} /> Account role</p>
            <p className="text-sm font-medium text-slate-900 dark:text-white capitalize">{user?.role || 'Patient'}</p>
          </div>
        </div>
      </div>

    </div>
  );
}
