'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/services/api';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { Users, ArrowLeft } from 'lucide-react';

interface PatientFromAppointment {
  _id: string;
  name: string;
  email: string;
}

export default function MyPatientsPage() {
  const [patients, setPatients] = useState<PatientFromAppointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data: appointments } = await api.get('/appointments/my');
        const uniquePatients = new Map<string, PatientFromAppointment>();
        appointments.forEach((apt: any) => {
          if (apt.patientId && apt.patientId._id && !uniquePatients.has(apt.patientId._id)) {
            uniquePatients.set(apt.patientId._id, {
              _id: apt.patientId._id,
              name: apt.patientId.name || 'Unknown',
              email: apt.patientId.email || ''
            });
          }
        });
        setPatients(Array.from(uniquePatients.values()));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/doctor">
          <Button variant="ghost" size="sm"><ArrowLeft size={16} /></Button>
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">My Patients</h1>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : patients.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12 text-slate-500">
            <Users className="mx-auto mb-3 opacity-20" size={48} />
            <p>No patients yet</p>
            <p className="text-sm mt-2">Patients will appear here after they book appointments with you</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {patients.map((patient) => (
            <Card key={patient._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                    {patient.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold">{patient.name}</p>
                    <p className="text-sm text-slate-500">{patient.email}</p>
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
