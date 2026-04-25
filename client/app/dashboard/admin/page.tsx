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
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
      </div>

      {/* Admin banner with cartoon SVG */}
      <div className="relative bg-gradient-to-r from-purple-600/10 to-pink-600/5 dark:from-purple-600/20 dark:to-pink-600/10 border border-purple-200 dark:border-purple-500/10 rounded-2xl p-8 mb-8 overflow-hidden shadow-sm dark:shadow-lg dark:shadow-purple-500/5">
        {/* Admin cartoon SVG — person with clipboard/laptop */}
        <div className="absolute right-8 bottom-0 animate-float hidden md:block opacity-90">
          <svg width="140" height="160" viewBox="0 0 120 140" className="drop-shadow-2xl">
            <circle cx="60" cy="22" r="18" fill="#f5c5a3"/>
            <rect x="35" y="40" width="50" height="95" fill="#7c3aed" rx="5"/>
            <rect x="42" y="55" width="36" height="25" fill="#ddd6fe" rx="3"/> {/* laptop/clipboard */}
            <rect x="45" y="58" width="30" height="2" fill="#7c3aed"/>
            <rect x="45" y="63" width="22" height="2" fill="#7c3aed"/>
            <rect x="45" y="68" width="26" height="2" fill="#7c3aed"/>
          </svg>
        </div>
        
        <div className="relative z-10 md:w-2/3">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">Admin Control Center <Shield className="text-purple-600 dark:text-purple-400" size={28} /></h2>
          <p className="text-slate-600 dark:text-neutral-400 text-lg max-w-xl">Manage your entire healthcare ecosystem, monitor users, and oversee system health.</p>
          
          <div className="flex flex-wrap gap-4 mt-8">
            <div className="bg-white/80 dark:bg-[#080c14]/40 backdrop-blur-md border border-slate-200 dark:border-white/5 rounded-xl px-5 py-3 flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 rounded-lg">
                <Stethoscope size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-neutral-400 font-medium">Total Doctors</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.totalDoctors || 0}</p>
              </div>
            </div>
            
            <div className="bg-white/80 dark:bg-[#080c14]/40 backdrop-blur-md border border-slate-200 dark:border-white/5 rounded-xl px-5 py-3 flex items-center gap-4">
              <div className="p-3 bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-400 rounded-lg">
                <Users size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-neutral-400 font-medium">Total Patients</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.totalPatients || 0}</p>
              </div>
            </div>
            
            <div className="bg-white/80 dark:bg-[#080c14]/40 backdrop-blur-md border border-slate-200 dark:border-white/5 rounded-xl px-5 py-3 flex items-center gap-4">
              <div className="p-3 bg-pink-100 dark:bg-pink-500/20 text-pink-700 dark:text-pink-400 rounded-lg">
                <Activity size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-neutral-400 font-medium">Total Users</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.totalUsers || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm dark:shadow-xl">
        <div className="p-6 border-b border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] flex justify-between items-center">
          <h3 className="font-semibold text-lg text-slate-900 dark:text-white">System Users</h3>
          <span className="bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 text-xs px-3 py-1 rounded-full border border-purple-200 dark:border-purple-500/20 font-medium">Global Directory</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 dark:text-neutral-400 uppercase bg-slate-50 dark:bg-black/20 border-b border-slate-200 dark:border-white/5">
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
                    <td className="px-6 py-4 text-slate-600 dark:text-neutral-400">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 w-fit ${
                          u.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 border-purple-200 dark:border-purple-500/20' :
                          u.role === 'doctor' ? 'bg-teal-100 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400 border-teal-200 dark:border-teal-500/20' :
                          'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20'
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
