'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/services/api';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton, TableRowSkeleton } from '@/components/ui/Skeleton';
import { PermissionGate } from '@/components/PermissionGate';
import { Users, ArrowLeft, Trash2, Mail, Shield, Plus, X, ChevronDown, Loader2, UserPlus, Eye, EyeOff } from 'lucide-react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const inputCls2 = "w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition";

const SPECIALIZATIONS = [
  'General Physician',
  'Cardiology',
  'Dermatology',
  'Neurology',
  'Pediatrics',
  'Orthopedics',
  'Ophthalmology',
  'Dentistry',
  'Psychology',
  'Psychiatry',
  'Gynecology',
  'Urology',
  'Oncology',
  'Pulmonology',
  'Endocrinology',
  'Gastroenterology',
  'Nephrology',
  'Rheumatology',
  'ENT (Ear, Nose, Throat)',
  'Internal Medicine',
];

function Field2({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function AddUserModal({ onClose, onCreated }: { onClose: () => void; onCreated: (u: User) => void }) {
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'patient',
    phone: '', gender: 'Male',
    specialization: '', experience: '', feesPerConsultation: '', department: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const submit = async () => {
    if (!form.name || !form.email || !form.password) {
      setError('Name, email and password are required'); return;
    }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setSaving(true); setError('');
    try {
      const res = await api.post('/admin/users', form);
      onCreated(res.data.data);
      onClose();
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to create user');
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-white dark:bg-[#161b27] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/5 sticky top-0 bg-white dark:bg-[#161b27] z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center">
              <UserPlus size={16} className="text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">Add new user</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Create a hospital staff or patient account</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field2 label="Full name" required>
              <input className={inputCls2} placeholder="John Doe" value={form.name} onChange={e => set('name', e.target.value)} />
            </Field2>
            <Field2 label="Role" required>
              <div className="relative">
                <select className={inputCls2 + ' appearance-none pr-8'} value={form.role} onChange={e => set('role', e.target.value)}>
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                  <option value="admin">Admin</option>
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </Field2>
          </div>
          <Field2 label="Email address" required>
            <input className={inputCls2} type="email" placeholder="user@hospital.com" value={form.email} onChange={e => set('email', e.target.value)} />
          </Field2>
          <Field2 label="Password" required>
            <div className="relative">
              <input className={inputCls2 + ' pr-10'} type={showPassword ? 'text' : 'password'} placeholder="Min. 6 characters" value={form.password} onChange={e => set('password', e.target.value)} />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </Field2>
          <div className="grid grid-cols-2 gap-3">
            <Field2 label="Phone">
              <input className={inputCls2} placeholder="+91 9999999999" value={form.phone} onChange={e => set('phone', e.target.value)} />
            </Field2>
            <Field2 label="Gender">
              <div className="relative">
                <select className={inputCls2 + ' appearance-none pr-8'} value={form.gender} onChange={e => set('gender', e.target.value)}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </Field2>
          </div>
          {form.role === 'doctor' && (
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-white/5">
              <p className="text-xs font-medium text-teal-600 dark:text-teal-400 uppercase tracking-wider">Doctor details</p>
              <div className="grid grid-cols-2 gap-3">
                <Field2 label="Specialization">
                  <div className="relative">
                    <select
                      className={inputCls2 + ' appearance-none pr-8'}
                      value={form.specialization}
                      onChange={e => set('specialization', e.target.value)}
                    >
                      <option value="" disabled>Select Specialization</option>
                      {SPECIALIZATIONS.map((spec) => (
                        <option key={spec} value={spec}>
                          {spec}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </Field2>
                <Field2 label="Department">
                  <input className={inputCls2} placeholder="e.g. ICU" value={form.department} onChange={e => set('department', e.target.value)} />
                </Field2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field2 label="Experience (years)">
                  <input className={inputCls2} placeholder="e.g. 8" value={form.experience} onChange={e => set('experience', e.target.value)} />
                </Field2>
                <Field2 label="Fees per consultation (₹)">
                  <input className={inputCls2} placeholder="e.g. 500" value={form.feesPerConsultation} onChange={e => set('feesPerConsultation', e.target.value)} />
                </Field2>
              </div>
            </div>
          )}
          {error && (
            <div className="px-3 py-2.5 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
        </div>
        <div className="flex gap-2 justify-end px-6 pb-5">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition">Cancel</button>
          <button onClick={submit} disabled={saving}
            className="px-5 py-2 text-sm rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium transition flex items-center gap-2 disabled:opacity-60">
            {saving && <Loader2 size={14} className="animate-spin" />}
            {saving ? 'Creating...' : 'Create user'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AllUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      const data = response.data.data || response.data;
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };

  const usersList = Array.isArray(users) ? users : [];
  const filteredUsers = filter === 'all'
    ? usersList
    : usersList.filter(u => u.role === filter);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-700';
      case 'doctor': return 'bg-green-100 text-green-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <div className="space-y-6">
      {showAdd && (
        <AddUserModal
          onClose={() => setShowAdd(false)}
          onCreated={user => { setUsers(prev => [user, ...prev]); }}
        />
      )}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/admin">
            <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 transition-colors">
              <ArrowLeft size={16} />
            </button>
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white">All Users</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">{users.length} total members</p>
          </div>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition">
          <Plus size={15} /> Add user
        </button>
      </div>

      <div className="flex gap-2">
        {['all', 'patient', 'doctor', 'admin'].map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter(f)}
            className="capitalize"
          >
            {f === 'all' ? 'All' : `${f}s`}
          </Button>
        ))}
      </div>

      <PermissionGate permission="users.view">
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-slate-600">User</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Email</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Role</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Joined</th>
                <th className="text-right p-4 text-sm font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                // Skeleton loading rows
                <>
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                </>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    <Users className="mx-auto mb-3 opacity-20" size={48} />
                    <p>No users found</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-medium text-sm">
                          {user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">{user.email}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 text-sm">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-4 text-right">
                      <PermissionGate permission="users.delete">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(user._id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </PermissionGate>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </PermissionGate>
    </div>
  );
}
