'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FileText, ArrowLeft, Heart, Activity, Pill } from 'lucide-react';

export default function MedicalHistoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/patient">
          <Button variant="ghost" size="sm"><ArrowLeft size={16} /></Button>
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Medical History</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-500 text-white rounded-lg">
                <Heart size={24} />
              </div>
              <div>
                <div className="text-red-700 font-medium">Blood Pressure</div>
                <div className="text-2xl font-bold text-red-900">120/80</div>
                <div className="text-xs text-red-600">Last checked: Today</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500 text-white rounded-lg">
                <Activity size={24} />
              </div>
              <div>
                <div className="text-blue-700 font-medium">Heart Rate</div>
                <div className="text-2xl font-bold text-blue-900">72 BPM</div>
                <div className="text-xs text-blue-600">Normal range</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500 text-white rounded-lg">
                <Pill size={24} />
              </div>
              <div>
                <div className="text-green-700 font-medium">Active Medications</div>
                <div className="text-2xl font-bold text-green-900">0</div>
                <div className="text-xs text-green-600">No prescriptions</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Past Visits</h2>
          <div className="text-center py-12 text-slate-500">
            <FileText className="mx-auto mb-3 opacity-20" size={48} />
            <p>No medical records found</p>
            <p className="text-sm mt-2">Your visit history will appear here after your appointments</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Allergies & Conditions</h2>
          <div className="text-center py-8 text-slate-500">
            <p>No allergies or conditions recorded</p>
            <Button variant="outline" className="mt-4">Add Medical Information</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
