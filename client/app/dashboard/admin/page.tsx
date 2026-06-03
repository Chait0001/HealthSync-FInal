'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Users, Stethoscope, Trash2, Shield, Activity } from 'lucide-react';
import { TableRowSkeleton } from '@/components/ui/Skeleton';

interface Stats {
  totalUsers: number;
  totalDoctors: number;
  totalPatients: number;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, totalDoctors: 0, totalPatients: 0 });
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Role protection - redirect non-admins
  useEffect(() => {
    if (!authLoading && user && user.role !== 'admin') {
      router.replace(`/dashboard/${user.role}`);
    }
  }, [user, authLoading, router]);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users')
      ]);
      const statsData = statsRes.data.data || statsRes.data;
      const usersData = usersRes.data.data || usersRes.data;
      
      setStats(statsData || { totalUsers: 0, totalDoctors: 0, totalPatients: 0 });
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (error) {
      console.error("Failed to fetch admin data", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchData();
    }
  }, [user]);

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      fetchData();
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  };

  // Show nothing while checking auth or if not admin
  if (authLoading || !user || user.role !== 'admin') {
    return <div className="flex items-center justify-center h-64"><div className="animate-pulse flex items-center gap-2"><Shield className="text-purple-500 animate-spin" /><span className="text-muted-foreground">Verifying Admin Access...</span></div></div>;
  }

  const usersList = Array.isArray(users) ? users : [];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Wednesday, {new Date().toLocaleDateString('en-IN', {day:'numeric', month:'long', year:'numeric'})}</p>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] p-6 mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Shield size={20} className="text-slate-600 dark:text-slate-400" />
          <h2 className="font-semibold text-slate-800 dark:text-white">Admin Dashboard</h2>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage users, appointments, and system permissions.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <div className="border border-slate-200 dark:border-white/10 rounded-lg p-4">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Total Doctors</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.totalDoctors || 0}</p>
        </div>
        <div className="border border-slate-200 dark:border-white/10 rounded-lg p-4">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Patients</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.totalPatients || 0}</p>
        </div>
        <div className="border border-slate-200 dark:border-white/10 rounded-lg p-4">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Total Users</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.totalUsers || 0}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm dark:shadow-xl">
        <div className="p-6 border-b border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] flex justify-between items-center">
          <h3 className="font-semibold text-lg text-slate-900 dark:text-white">System Users</h3>
          <span className="bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 text-xs px-3 py-1 rounded-full border border-purple-200 dark:border-purple-500/20 font-medium">Global Directory</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-black/20 border-b border-slate-200 dark:border-white/5">
              <tr>
                <th className="px-6 py-4 font-medium tracking-wider">User</th>
                <th className="px-6 py-4 font-medium tracking-wider">Email</th>
                <th className="px-6 py-4 font-medium tracking-wider">Role</th>
                <th className="px-6 py-4 font-medium tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <>
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                </>
              ) : (
                usersList.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${
                          u.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20' :
                          u.role === 'doctor' ? 'bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-400 border border-teal-200 dark:border-teal-500/20' :
                          'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20'
                        }`}>
                          {u.name.charAt(0)}
                        </div>
                        <p className="font-medium text-slate-900 dark:text-white">{u.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 w-fit ${
                          u.role === 'admin' ? 'bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-400 border-slate-200 dark:border-white/10' :
                          u.role === 'doctor' ? 'bg-teal-100 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400 border-teal-200 dark:border-teal-500/20' :
                          'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/20'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          u.role === 'admin' ? 'bg-purple-600' :
                          u.role === 'doctor' ? 'bg-teal-600' :
                          'bg-blue-600'
                        }`}></span>
                        {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {u.role !== 'admin' && (
                        <div className="flex justify-end opacity-50 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 bg-transparent border border-transparent hover:border-red-500/20 h-8 px-2"
                            onClick={() => handleDeleteUser(u._id)}
                            title="Delete User"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
