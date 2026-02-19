'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, Users, Stethoscope, Calendar, Trash2 } from 'lucide-react';
import { Skeleton, TableRowSkeleton } from '@/components/ui/Skeleton';

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
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error("Failed to fetch admin data", error);
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
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <Users size={24} />
              </div>
              <div>
                <div className="text-blue-100">Total Users</div>
                <div className="text-3xl font-bold">{stats.totalUsers}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-none">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <Stethoscope size={24} />
              </div>
              <div>
                <div className="text-green-100">Total Doctors</div>
                <div className="text-3xl font-bold">{stats.totalDoctors}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-none">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <Calendar size={24} />
              </div>
              <div>
                <div className="text-purple-100">Total Patients</div>
                <div className="text-3xl font-bold">{stats.totalPatients}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold">All Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Name</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Email</th>
                <th className="text-left p-4 text-sm font-medium text-slate-600">Role</th>
                <th className="text-right p-4 text-sm font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <>
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                </>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="p-4">{u.name}</td>
                    <td className="p-4 text-slate-600">{u.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${u.role === 'admin' ? 'bg-red-100 text-red-700' :
                          u.role === 'doctor' ? 'bg-green-100 text-green-700' :
                            'bg-blue-100 text-blue-700'
                        }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteUser(u._id)}
                      >
                        <Trash2 size={16} />
                      </Button>
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
