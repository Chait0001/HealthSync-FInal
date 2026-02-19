'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/services/api';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DoctorCardSkeleton } from '@/components/ui/Skeleton';
import { Stethoscope, ArrowLeft, Trash2, Mail, DollarSign } from 'lucide-react';

interface Doctor {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  specialization: string;
  experience: number;
  feesPerConsultation: number;
  phone: string;
  department: string;
}

export default function ManageDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDoctors = async () => {
    try {
      const { data } = await api.get('/admin/doctors');
      setDoctors(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this doctor?')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      fetchDoctors();
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/admin">
          <Button variant="ghost" size="sm"><ArrowLeft size={16} /></Button>
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Manage Doctors</h1>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <DoctorCardSkeleton />
          <DoctorCardSkeleton />
          <DoctorCardSkeleton />
          <DoctorCardSkeleton />
          <DoctorCardSkeleton />
          <DoctorCardSkeleton />
        </div>
      ) : doctors.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12 text-slate-500">
            <Stethoscope className="mx-auto mb-3 opacity-20" size={48} />
            <p>No doctors registered yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.map((doctor) => (
            <Card key={doctor._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-lg">
                      {doctor.userId?.name?.charAt(0) || 'D'}
                    </div>
                    <div>
                      <p className="font-semibold">Dr. {doctor.userId?.name}</p>
                      <p className="text-sm text-blue-600">{doctor.specialization}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:bg-red-50"
                    onClick={() => handleDelete(doctor.userId?._id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Mail size={14} /> {doctor.userId?.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign size={14} /> ${doctor.feesPerConsultation}/consultation
                  </div>
                  <div className="flex items-center gap-2">
                    <Stethoscope size={14} /> {doctor.experience} years experience
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
