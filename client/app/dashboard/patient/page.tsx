'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/services/api';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton, AppointmentCardSkeleton, StatCardSkeleton } from '@/components/ui/Skeleton';
import { Calendar, Plus } from 'lucide-react';

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
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await api.get('/appointments/my');
        setAppointments(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      case 'completed': return 'text-slate-600 bg-slate-50';
      default: return 'text-yellow-600 bg-yellow-50';
    }
  };

  const upcomingCount = appointments.filter(a => a.status !== 'cancelled' && a.status !== 'completed').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Patient Dashboard</h1>
        <Link href="/dashboard/patient/book">
          <Button className="gap-2">
            <Plus size={16} /> Book Appointment
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {loading ? (
          <StatCardSkeleton />
        ) : (
          <Card className="bg-blue-500 text-white border-none">
            <CardContent className="pt-6">
              <div className="text-blue-100 mb-2">Upcoming Appointments</div>
              <div className="text-4xl font-bold">{upcomingCount}</div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">My Appointments</h2>

        {loading ? (
          <div className="space-y-4">
            <AppointmentCardSkeleton />
            <AppointmentCardSkeleton />
            <AppointmentCardSkeleton />
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Calendar className="mx-auto mb-3 opacity-20" size={48} />
            <p>No appointments scheduled</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((apt) => (
              <div key={apt._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="font-semibold">Dr. {apt.doctorId?.userId?.name || 'Unknown'}</p>
                    <p className="text-sm text-slate-600">{apt.doctorId?.specialization || 'General'}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(apt.date).toLocaleDateString()} at {new Date(apt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(apt.status)}`}>
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
