'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/services/api';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AppointmentCardSkeleton } from '@/components/ui/Skeleton';
import { Calendar, ArrowLeft, Check, X, Users } from 'lucide-react';

interface Appointment {
  _id: string;
  patientId: {
    name: string;
    email: string;
  };
  date: string;
  status: string;
  reason: string;
}

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

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

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await api.put(`/appointments/${id}/status`, { status });
      fetchAppointments();
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const filteredAppointments = filter === 'all'
    ? appointments
    : appointments.filter(a => a.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/doctor">
          <Button variant="ghost" size="sm"><ArrowLeft size={16} /></Button>
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">All Appointments</h1>
      </div>

      <div className="flex gap-2">
        {['all', 'pending', 'approved', 'cancelled'].map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter(f)}
            className="capitalize"
          >
            {f}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-4">
          <AppointmentCardSkeleton />
          <AppointmentCardSkeleton />
          <AppointmentCardSkeleton />
          <AppointmentCardSkeleton />
        </div>
      ) : filteredAppointments.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12 text-slate-500">
            <Calendar className="mx-auto mb-3 opacity-20" size={48} />
            <p>No {filter !== 'all' ? filter : ''} appointments found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredAppointments.map((apt) => (
            <Card key={apt._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full">
                      <Users size={24} />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{apt.patientId?.name || 'Unknown Patient'}</p>
                      <p className="text-slate-600">{apt.reason}</p>
                      <p className="text-sm text-slate-500 mt-1">
                        {new Date(apt.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        {' at '}
                        {new Date(apt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${apt.status === 'approved' ? 'text-green-600 bg-green-50' :
                        apt.status === 'cancelled' ? 'text-red-600 bg-red-50' : 'text-yellow-600 bg-yellow-50'
                      }`}>
                      {apt.status}
                    </span>
                    {apt.status === 'pending' && (
                      <>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleStatusUpdate(apt._id, 'approved')}>
                          <Check size={16} className="mr-1" /> Accept
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 border-red-200" onClick={() => handleStatusUpdate(apt._id, 'cancelled')}>
                          <X size={16} className="mr-1" /> Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
