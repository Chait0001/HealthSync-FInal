'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, Activity, AlertCircle } from 'lucide-react';

interface Doctor {
  _id: string;
  userId: { name: string; email: string };
  specialization: string;
  experience: string;
  feesPerConsultation: string;
  department: string;
}

const AVATAR_COLORS = ['bg-teal-500','bg-blue-500','bg-violet-500','bg-rose-500','bg-amber-500','bg-indigo-500'];

export default function CustomDoctorsPage() {
  const { can } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const canView = can('doctors.view') || can('doctors.manage');

  useEffect(() => {
    api.get('/doctors')
      .then(res => setDoctors(res.data.data || res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (!canView) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-3 text-slate-500 dark:text-slate-400">
        <AlertCircle size={40} className="opacity-30" />
        <p className="text-base font-semibold text-slate-700 dark:text-white">Access Denied</p>
        <p className="text-sm">You do not have permission to view doctors.</p>
        <Link href="/dashboard/custom" className="text-sm text-teal-600 dark:text-teal-400 hover:underline mt-2">Back to dashboard</Link>
      </div>
    );
  }

  const filtered = doctors.filter(d => !search || d.userId?.name?.toLowerCase().includes(search.toLowerCase()) || d.specialization?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/custom">
            <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 transition-colors"><ArrowLeft size={16} /></button>
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Doctors</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">{doctors.length} doctors in the system</p>
          </div>
        </div>
        <input className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 w-52 transition" placeholder="Search doctors..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="py-16 text-center text-sm text-slate-400">Loading doctors...</div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center"><Activity size={32} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" /><p className="text-sm text-slate-500 dark:text-slate-400">No doctors found</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((doc, i) => (
            <div key={doc._id} className="bg-white dark:bg-[#161b27] border border-slate-200 dark:border-white/10 rounded-xl p-5 hover:border-teal-300 dark:hover:border-teal-600/40 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-full ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-white font-semibold text-sm`}>
                  {doc.userId?.name?.charAt(0)?.toUpperCase() || 'D'}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">Dr. {doc.userId?.name || 'Unknown'}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{doc.userId?.email}</p>
                </div>
              </div>
              <div className="space-y-1.5">
                {doc.specialization && <div className="flex items-center justify-between"><span className="text-xs text-slate-400">Specialization</span><span className="text-xs font-medium text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 px-2 py-0.5 rounded-full">{doc.specialization}</span></div>}
                {doc.department && <div className="flex items-center justify-between"><span className="text-xs text-slate-400">Department</span><span className="text-xs font-medium text-slate-700 dark:text-slate-300">{doc.department}</span></div>}
                {doc.experience && <div className="flex items-center justify-between"><span className="text-xs text-slate-400">Experience</span><span className="text-xs font-medium text-slate-700 dark:text-slate-300">{doc.experience} yrs</span></div>}
                {doc.feesPerConsultation && <div className="flex items-center justify-between"><span className="text-xs text-slate-400">Fees</span><span className="text-xs font-medium text-slate-700 dark:text-slate-300">Rs. {doc.feesPerConsultation}</span></div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
