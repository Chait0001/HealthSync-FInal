'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/services/api';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AppointmentCardSkeleton, StatCardSkeleton } from '@/components/ui/Skeleton';
import { Calendar, ArrowLeft, Plus } from 'lucide-react';

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

export default function MyAppointmentsPage() {
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
      case 'completed': return 'text-slate-600 bg-slate-100';
      default: return 'text-yellow-600 bg-yellow-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/patient">
            <Button variant="ghost" size="sm"><ArrowLeft size={16} /></Button>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">My Appointments</h1>
        </div>
        <Link href="/dashboard/patient/book">
          <Button className="gap-2"><Plus size={16} /> Book New</Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-4">
          <AppointmentCardSkeleton />
          <AppointmentCardSkeleton />
          <AppointmentCardSkeleton />
          <AppointmentCardSkeleton />
        </div>
      ) : appointments.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12 text-slate-500">
            <Calendar className="mx-auto mb-3 opacity-20" size={48} />
            <p>No appointments found</p>
            <Link href="/dashboard/patient/book">
              <Button className="mt-4">Book Your First Appointment</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {appointments.map((apt) => (
            <Card key={apt._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                      <Calendar size={24} />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">Dr. {apt.doctorId?.userId?.name || 'Unknown'}</p>
                      <p className="text-slate-600">{apt.doctorId?.specialization || 'General'}</p>
                      <p className="text-sm text-slate-500 mt-1">
                        {new Date(apt.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        {' at '}
                        {new Date(apt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-sm text-slate-400 mt-1">Reason: {apt.reason}</p>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${getStatusColor(apt.status)}`}>
                    {apt.status}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
