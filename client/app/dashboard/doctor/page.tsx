'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import { AppointmentCardSkeleton } from '@/components/ui/Skeleton';
import { Check, X, Calendar, Clock, Activity } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getDoctorIllustration } from '@/constants/doctorIllustrations';

interface Appointment {
  _id: string;
  patientId: {
    _id?: string;
    name: string;
    email: string;
  };
  date: string;
  status: string;
  reason: string;
}

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctorProfile, setDoctorProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchAppointments();
    const fetchProfile = async () => {
      try {
        const res = await api.get('/doctors/profile');
        setDoctorProfile(Array.isArray(res.data) ? res.data[0] : res.data?.data || res.data);
      } catch (err) {
        console.error('Failed to fetch doctor profile', err);
      }
    };
    fetchProfile();
  }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await api.put(`/appointments/${id}/status`, { status });
      fetchAppointments();
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Failed to update status");
    }
  };

  const appointmentsList = Array.isArray(appointments) ? appointments : [];

  const stats = {
    today: appointmentsList.filter(a => new Date(a.date).toDateString() === new Date().toDateString()).length,
    total: new Set(appointmentsList.map(a => a.patientId?._id || a.patientId?.name)).size,
    pending: appointmentsList.filter(a => a.status === 'pending').length
  };

  return (
    <div className="space-y-6">
      {/* Welcoming hero banner with doctor illustration */}
      <div className="relative bg-gradient-to-r from-teal-600/10 to-blue-600/5 dark:from-teal-600/20 dark:to-blue-600/10 border border-teal-200 dark:border-teal-500/10 rounded-2xl p-8 mb-8 overflow-hidden shadow-sm dark:shadow-lg dark:shadow-teal-500/5">
        {/* Animated doctor illustration based on specialization */}
        <div className="absolute right-6 bottom-0 animate-float hidden md:block opacity-90">
          {getDoctorIllustration(doctorProfile?.specialization || '')}
        </div>

        <div className="relative z-10 md:w-2/3">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Good Morning, Dr. {user?.name || 'Doctor'}! 👋</h2>
          <p className="text-slate-600 dark:text-neutral-400 text-lg max-w-xl">Here's a quick overview of what's happening with your patients today.</p>

          {/* Quick stats row */}
          <div className="flex flex-wrap gap-4 mt-8">
            <div className="bg-white/80 dark:bg-[#080c14]/40 backdrop-blur-md border border-slate-200 dark:border-white/5 rounded-xl px-5 py-3 flex items-center gap-4">
              <div className="p-3 bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-400 rounded-lg">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-neutral-400 font-medium">Today's Appointments</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.today}</p>
              </div>
            </div>
            
            <div className="bg-white/80 dark:bg-[#080c14]/40 backdrop-blur-md border border-slate-200 dark:border-white/5 rounded-xl px-5 py-3 flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 rounded-lg">
                <Activity size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-neutral-400 font-medium">Total Patients</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
              </div>
            </div>
            
            <div className="bg-white/80 dark:bg-[#080c14]/40 backdrop-blur-md border border-slate-200 dark:border-white/5 rounded-xl px-5 py-3 flex items-center gap-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 rounded-lg">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-neutral-400 font-medium">Pending Requests</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.pending}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm dark:shadow-xl">
        <div className="p-6 border-b border-slate-200 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-white/[0.02]">
          <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Recent Appointments</h3>
        </div>

        {loading ? (
          <div className="p-6 space-y-4">
            <AppointmentCardSkeleton />
            <AppointmentCardSkeleton />
            <AppointmentCardSkeleton />
          </div>
        ) : appointmentsList.length === 0 ? (
          <div className="text-center py-20 px-6">
            <div className="flex justify-center mb-6 opacity-80 animate-float">
              {/* Empty state animated SVG */}
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-teal-500/50">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <p className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No Appointments Yet</p>
            <p className="text-neutral-500 max-w-md mx-auto">Your schedule is currently completely clear. When patients book appointments, they will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 dark:text-neutral-400 uppercase bg-slate-50 dark:bg-black/20 border-b border-slate-200 dark:border-white/5">
                <tr>
                  <th className="px-6 py-4 font-medium tracking-wider">Patient</th>
                  <th className="px-6 py-4 font-medium tracking-wider">Date & Time</th>
                  <th className="px-6 py-4 font-medium tracking-wider">Reason</th>
                  <th className="px-6 py-4 font-medium tracking-wider">Status</th>
                  <th className="px-6 py-4 font-medium tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {appointmentsList.map((apt) => (
                  <tr key={apt._id} className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-teal-50 dark:bg-teal-500/20 border border-teal-100 dark:border-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-sm shadow-sm">
                          {apt.patientId?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{apt.patientId?.name || 'Unknown Patient'}</p>
                          <p className="text-xs text-slate-500 dark:text-neutral-500 mt-0.5">{apt.patientId?.email || 'No email provided'}</p>
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
                      <p className="text-slate-600 dark:text-neutral-300 max-w-[200px] truncate" title={apt.reason}>{apt.reason}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 w-fit ${
                        apt.status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-200 dark:border-green-500/20' :
                        apt.status === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-500/20' : 
                        'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          apt.status === 'approved' ? 'bg-green-600' :
                          apt.status === 'cancelled' ? 'bg-red-600' : 
                          'bg-yellow-600'
                        }`}></span>
                        {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {apt.status === 'pending' ? (
                        <div className="flex justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleStatusUpdate(apt._id, 'approved')} className="p-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-400 rounded-lg transition-all hover:scale-105" title="Approve">
                            <Check size={16} />
                          </button>
                          <button onClick={() => handleStatusUpdate(apt._id, 'cancelled')} className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg transition-all hover:scale-105" title="Decline">
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-neutral-600 text-sm italic">Processed</span>
                      )}
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
