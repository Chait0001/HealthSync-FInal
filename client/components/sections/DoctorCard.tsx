'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Clock, Calendar, Briefcase, ArrowRight, User } from 'lucide-react';

export interface Doctor {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  specialization: string;
  experience: number;
  feesPerConsultation: number;
  department: string;
  bio?: string;
  designation?: string;
  hospitalName?: string;
  opdTimings?: string;
  profilePicture?: string;
}

interface DoctorCardProps {
  doctor: Doctor;
}

// Helper to assign vibrant, cohesive theme colors based on doctor's specialty
const getSpecialityStyle = (spec: string) => {
  const normalized = spec.toLowerCase();
  if (normalized.includes('gastro')) {
    return {
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
      text: 'text-emerald-700 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-500/20'
    };
  }
  if (normalized.includes('cardio')) {
    return {
      bg: 'bg-rose-50 dark:bg-rose-500/10',
      text: 'text-rose-700 dark:text-rose-400 border-rose-200/50 dark:border-rose-500/20'
    };
  }
  if (normalized.includes('ortho')) {
    return {
      bg: 'bg-purple-50 dark:bg-purple-500/10',
      text: 'text-purple-700 dark:text-purple-400 border-purple-200/50 dark:border-purple-500/20'
    };
  }
  if (normalized.includes('pedi')) {
    return {
      bg: 'bg-amber-50 dark:bg-amber-500/10',
      text: 'text-amber-700 dark:text-amber-400 border-amber-200/50 dark:border-amber-500/20'
    };
  }
  if (normalized.includes('neuro')) {
    return {
      bg: 'bg-blue-50 dark:bg-blue-500/10',
      text: 'text-blue-700 dark:text-blue-400 border-blue-200/50 dark:border-blue-500/20'
    };
  }
  if (normalized.includes('onco')) {
    return {
      bg: 'bg-fuchsia-50 dark:bg-fuchsia-500/10',
      text: 'text-fuchsia-700 dark:text-fuchsia-400 border-fuchsia-200/50 dark:border-fuchsia-500/20'
    };
  }
  return {
    bg: 'bg-teal-50 dark:bg-teal-500/10',
    text: 'text-teal-700 dark:text-teal-400 border-teal-200/50 dark:border-teal-500/20'
  };
};

const normalizeSpecialty = (str: string): string => {
  if (!str) return '';
  const normalized = str.trim().toLowerCase();
  if (normalized === 'cardiologist' || normalized === 'cardiology') {
    return 'Cardiology';
  }
  if (normalized === 'gastroenterologist' || normalized === 'gastroenterology') {
    return 'Gastroenterology';
  }
  if (
    normalized === 'orthopedist' ||
    normalized === 'orthopaedics' ||
    normalized === 'orthopedic' ||
    normalized === 'ortho' ||
    normalized === 'orthopedic surgeon'
  ) {
    return 'Orthopedics';
  }
  if (normalized === 'pediatrician' || normalized === 'pediatrics') {
    return 'Pediatrics';
  }
  if (normalized === 'neurologist' || normalized === 'neurology') {
    return 'Neurology';
  }
  if (normalized === 'oncologist' || normalized === 'oncology') {
    return 'Oncology';
  }
  if (normalized === 'dermatologist' || normalized === 'dermatology') {
    return 'Dermatology';
  }
  return normalized
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  const normalizedSpecialty = normalizeSpecialty(doctor.specialization);
  const specStyle = getSpecialityStyle(normalizedSpecialty);

  return (
    <div className="group relative flex flex-col h-full bg-white dark:bg-[#111622] border border-slate-200 dark:border-white/5 hover:border-teal-500/50 dark:hover:border-teal-500/40 rounded-3xl p-6 shadow-sm hover:shadow-2xl dark:hover:shadow-teal-500/5 -translate-y-0 hover:-translate-y-2 transition-all duration-500 ease-out">
      {/* Subtle background glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-b from-teal-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-500 pointer-events-none" />

      {/* Card Header: Avatar & Specialty Badge */}
      <div className="flex items-start justify-between gap-4 z-10">
        <div className="relative">
          {/* Avatar Ring */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-teal-500/30 to-teal-400/10 p-0.5 shadow-md group-hover:from-teal-500 group-hover:to-teal-300 transition-all duration-500">
            <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
              {doctor.profilePicture ? (
                <img
                  src={doctor.profilePicture}
                  alt={doctor.userId?.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
              ) : (
                <User size={36} className="text-slate-400 dark:text-slate-600" />
              )}
            </div>
          </div>
        </div>

        {/* Speciality Badge */}
        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${specStyle.bg} ${specStyle.text}`}>
          {normalizedSpecialty}
        </span>
      </div>

      {/* Doctor Name & Designation */}
      <div className="mt-5 flex-1 z-10">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-300">
          Dr. {doctor.userId?.name || 'Specialist'}
        </h3>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
          {doctor.designation || doctor.department}
        </p>

        {/* Divider */}
        <div className="my-4 border-t border-slate-100 dark:border-white/5" />

        {/* Doctor Details (Experience, Hospital, OPD Timings) */}
        <div className="space-y-2.5 text-sm">
          <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-400">
            <Briefcase size={16} className="text-teal-500/80 group-hover:text-teal-500 transition-colors shrink-0" />
            <span className="text-xs font-medium">
              {doctor.experience} years of experience
            </span>
          </div>

          {doctor.hospitalName && (
            <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-400">
              <MapPin size={16} className="text-teal-500/80 group-hover:text-teal-500 transition-colors shrink-0" />
              <span className="text-xs font-medium line-clamp-1" title={doctor.hospitalName}>
                {doctor.hospitalName.split(',')[0]} {/* Show main hospital name, clip city */}
              </span>
            </div>
          )}

          {doctor.opdTimings && (
            <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-400">
              <Clock size={16} className="text-teal-500/80 group-hover:text-teal-500 transition-colors shrink-0" />
              <span className="text-xs font-medium line-clamp-1" title={doctor.opdTimings}>
                {doctor.opdTimings}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Actions (CTA & View Profile) */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 space-y-3 z-10">
        <button className="w-full bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white text-xs font-bold py-3 px-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-lg hover:shadow-teal-500/10 cursor-pointer">
          <Calendar size={14} />
          Book Appointment
        </button>

        <Link
          href={`/doctors/${doctor._id}`}
          className="flex items-center justify-center gap-1 text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 text-xs font-bold transition-colors py-1 cursor-pointer group/link"
        >
          View Full Profile
          <ArrowRight size={12} className="group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
