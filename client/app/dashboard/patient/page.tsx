'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/services/api';
import { Button } from '@/components/ui/Button';
import { AppointmentCardSkeleton } from '@/components/ui/Skeleton';
import { Calendar, Plus, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface Appointment {
  _id: string;
  doctorId: {
    userId: { name: string };
    specialization: string;
  };
  date: string;
  status: string;
  reason: string;
}

export default function PatientDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.get('/appointments/my');
        const data = response.data.data || response.data;
        setAppointments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const appointmentsList = Array.isArray(appointments) ? appointments : [];
  const upcomingCount = appointmentsList.filter(a => a.status !== 'cancelled' && a.status !== 'completed').length;
  
  const stats = {
    total: appointmentsList.length,
    upcoming: upcomingCount
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Patient Dashboard</h1>
        <Link href="/dashboard/patient/book">
          <Button className="gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 border-none shadow-lg shadow-blue-500/20">
            <Plus size={16} /> Book Appointment
          </Button>
        </Link>
      </div>

      {/* Welcoming banner with patient illustration */}
      <div className="relative bg-gradient-to-r from-blue-600/10 to-purple-600/5 dark:from-blue-600/20 dark:to-purple-600/10 border border-blue-200 dark:border-blue-500/10 rounded-2xl p-8 mb-8 overflow-hidden shadow-sm dark:shadow-lg dark:shadow-blue-500/5">
        {/* Patient SVG — person sitting, relaxed */}
        <div className="absolute right-8 bottom-0 animate-float hidden md:block opacity-90">
          <svg width="110" height="130" viewBox="0 0 110 130" className="drop-shadow-2xl">
            <circle cx="55" cy="25" r="18" fill="#f5c5a3"/>
            <rect x="30" y="43" width="50" height="55" fill="#3b82f6" rx="5"/>
            <rect x="40" y="98" width="12" height="25" fill="#1d4ed8"/>
            <rect x="58" y="98" width="12" height="25" fill="#1d4ed8"/>
          </svg>
        </div>
        
        <div className="relative z-10 md:w-2/3">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome back, {user?.name || 'Guest'}! 🌟</h2>
          <p className="text-slate-600 dark:text-neutral-400 text-lg max-w-xl">Your health, your priority. Track your appointments and medical history here.</p>
          
          <div className="flex flex-wrap gap-4 mt-8">
            <div className="bg-white/80 dark:bg-[#080c14]/40 backdrop-blur-md border border-slate-200 dark:border-white/5 rounded-xl px-5 py-3 flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 rounded-lg">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-neutral-400 font-medium">My Appointments</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
              </div>
            </div>
            
            <div className="bg-white/80 dark:bg-[#080c14]/40 backdrop-blur-md border border-slate-200 dark:border-white/5 rounded-xl px-5 py-3 flex items-center gap-4">
              <div className="p-3 bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-400 rounded-lg">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-neutral-400 font-medium">Upcoming</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.upcoming}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm dark:shadow-xl">
        <div className="p-6 border-b border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
          <h3 className="font-semibold text-lg text-slate-900 dark:text-white">My Appointments</h3>
        </div>

        {loading ? (
          <div className="p-6 space-y-4">
            <AppointmentCardSkeleton />
            <AppointmentCardSkeleton />
          </div>
        ) : appointmentsList.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div className="flex justify-center mb-6 opacity-80 animate-float">
              {/* Empty state SVG */}
              <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-blue-500/50">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
                <path d="M8 14h.01" />
                <path d="M12 14h.01" />
                <path d="M16 14h.01" />
                <path d="M8 18h.01" />
                <path d="M12 18h.01" />
                <path d="M16 18h.01" />
              </svg>
            </div>
            <p className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No Appointments</p>
            <p className="text-neutral-500 max-w-sm mx-auto mb-6">You don't have any appointments scheduled yet. Book your first appointment to get started.</p>
            <Link href="/dashboard/patient/book">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white border-none">
                Book Appointment
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 dark:text-neutral-400 uppercase bg-slate-50 dark:bg-black/20 border-b border-slate-200 dark:border-white/5">
                <tr>
                  <th className="px-6 py-4 font-medium tracking-wider">Doctor</th>
                  <th className="px-6 py-4 font-medium tracking-wider">Date & Time</th>
                  <th className="px-6 py-4 font-medium tracking-wider">Reason</th>
                  <th className="px-6 py-4 font-medium tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {appointmentsList.map((apt) => (
                  <tr key={apt._id} className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-500/20 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm shadow-sm">
                          {apt.doctorId?.userId?.name?.charAt(0) || 'D'}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">Dr. {apt.doctorId?.userId?.name || 'Unknown'}</p>
                          <p className="text-xs text-slate-500 dark:text-neutral-500 mt-0.5">{apt.doctorId?.specialization || 'General'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-900 dark:text-white font-medium">{new Date(apt.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                      <p className="text-xs text-slate-500 dark:text-neutral-500 mt-0.5 flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(apt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-600 dark:text-neutral-300 max-w-[250px] truncate" title={apt.reason}>{apt.reason}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border items-center gap-1.5 w-fit ${
                        apt.status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-200 dark:border-green-500/20' :
                        apt.status === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-500/20' : 
                        apt.status === 'completed' ? 'bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-400 border-slate-200 dark:border-slate-500/20' :
                        'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          apt.status === 'approved' ? 'bg-green-600' :
                          apt.status === 'cancelled' ? 'bg-red-600' : 
                          apt.status === 'completed' ? 'bg-slate-600' :
                          'bg-yellow-600'
                        }`}></span>
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
    </div>
  );
}
