'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/services/api';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Briefcase,
  Award,
  BookOpen,
  GraduationCap,
  Globe,
  DollarSign,
  User,
  Stethoscope,
  Activity,
  Heart
} from 'lucide-react';
import { motion } from 'framer-motion';

interface WorkEntry {
  role: string;
  organization: string;
  duration: string;
}

interface EduEntry {
  degree: string;
  institution: string;
  year: string;
}

interface AwardEntry {
  name: string;
  year: string;
}

interface PubEntry {
  title: string;
  journalName: string;
}

interface DoctorProfileData {
  _id: string;
  userId: { _id: string; name: string; email: string; phone?: string };
  specialization: string;
  experience: number;
  feesPerConsultation: number;
  department: string;
  bio?: string;
  designation?: string;
  hospitalName?: string;
  opdTimings?: string;
  profilePicture?: string;
  workExperience?: WorkEntry[];
  education?: EduEntry[];
  specialityInterests?: string[];
  memberships?: string[];
  awards?: AwardEntry[];
  publications?: PubEntry[];
  languages?: string[];
}

export default function PublicDoctorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const doctorId = params.doctorId as string;

  const [profile, setProfile] = useState<DoctorProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/doctors/${doctorId}`);
        const data = res.data.data || res.data;
        setProfile(data);
      } catch (err: any) {
        console.error('Failed to load doctor profile:', err);
        setError('Doctor profile not found or server error.');
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      fetchProfile();
    }
  }, [doctorId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0f1117] flex flex-col justify-center items-center py-20 text-slate-400 dark:text-slate-500">
        <Activity className="animate-spin text-teal-400 mb-4" size={40} />
        <p className="text-sm font-semibold tracking-wide animate-pulse">Retrieving Specialist Profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0f1117] flex flex-col justify-center items-center py-20 text-slate-600 dark:text-slate-400">
        <div className="text-center p-8 max-w-md bg-white dark:bg-[#161b27] border border-slate-200 dark:border-white/5 rounded-3xl shadow-lg">
          <Heart size={48} className="text-red-500 mx-auto mb-4 animate-bounce" />
          <h2 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Profile Not Found</h2>
          <p className="text-sm mb-6">{error || 'This doctor profile is unavailable.'}</p>
          <button
            onClick={() => router.push('/')}
            className="flex items-center justify-center gap-2 px-5 py-3 w-full bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold transition"
          >
            <ArrowLeft size={16} /> Return to Home
          </button>
        </div>
      </div>
    );
  }

  // Animation Variant Helpers
  const itemVariant = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as any } }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f1117] text-neutral-900 dark:text-white transition-colors duration-300">
      
      {/* Top Navbar Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-[#0f1117]/90 border-b border-slate-200 dark:border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/#our-doctors')}
            className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition"
          >
            <ArrowLeft size={16} /> Back to Specialists
          </button>
          
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
              <Heart size={18} className="text-white" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-lg">HealthSync</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-6 py-12 space-y-8">
        
        {/* HEADER PANEL CARD */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative bg-white dark:bg-[#161b27] border border-slate-200 dark:border-white/5 rounded-3xl p-6 md:p-8 shadow-xl overflow-hidden"
        >
          {/* Accent lighting blobs */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/5 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
            {/* Avatar Photo */}
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-tr from-teal-500 to-teal-300 p-1 shadow-lg shrink-0 overflow-hidden">
              <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                {profile.profilePicture ? (
                  <img
                    src={profile.profilePicture}
                    alt={profile.userId?.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={64} className="text-slate-400 dark:text-slate-600" />
                )}
              </div>
            </div>

            {/* Profile Info Details */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <span className="px-3 py-1.5 text-xs font-bold rounded-full bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-200/50 dark:border-teal-500/20">
                  {profile.specialization}
                </span>
                <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-3.5">
                  Dr. {profile.userId?.name || 'Specialist'}
                </h1>
                <p className="text-teal-600 dark:text-teal-400 font-semibold text-base md:text-lg mt-1">
                  {profile.designation || profile.department}
                </p>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 pt-2 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-3 justify-center sm:justify-start">
                  <Briefcase size={18} className="text-teal-500 shrink-0" />
                  <span>
                    Experience: <strong className="text-slate-800 dark:text-slate-200 font-semibold">{profile.experience} Years</strong>
                  </span>
                </div>
                {profile.hospitalName && (
                  <div className="flex items-center gap-3 justify-center sm:justify-start">
                    <MapPin size={18} className="text-teal-500 shrink-0" />
                    <span>
                      Hospital: <strong className="text-slate-800 dark:text-slate-200 font-semibold">{profile.hospitalName}</strong>
                    </span>
                  </div>
                )}
                {profile.opdTimings && (
                  <div className="flex items-center gap-3 justify-center sm:justify-start">
                    <Clock size={18} className="text-teal-500 shrink-0" />
                    <span>
                      OPD Timings: <strong className="text-slate-800 dark:text-slate-200 font-semibold">{profile.opdTimings}</strong>
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3 justify-center sm:justify-start">
                  <DollarSign size={18} className="text-teal-500 shrink-0" />
                  <span>
                    Consultation Fee: <strong className="text-slate-800 dark:text-slate-200 font-semibold">Rs. {profile.feesPerConsultation}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* CTA Sidebar Box */}
            <div className="w-full md:w-auto bg-slate-50 dark:bg-[#1e2535] border border-slate-200/60 dark:border-white/5 p-6 rounded-2xl md:min-w-[240px] text-center shrink-0 space-y-4">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Consultation Cost</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">Rs. {profile.feesPerConsultation}</p>
              </div>
              
              <button className="w-full bg-teal-600 hover:bg-teal-700 active:scale-95 text-white text-sm font-bold py-3.5 px-4 rounded-xl transition-all shadow-md hover:shadow-teal-500/10 cursor-pointer">
                Book Appointment
              </button>
              
              <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1">
                <Clock size={12} /> Live schedule available
              </p>
            </div>
          </div>
        </motion.div>

        {/* DETAILS SECTION GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT PANELS (About, Work Experience, Education) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* ABOUT BIO */}
            <motion.div
              variants={itemVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white dark:bg-[#161b27] border border-slate-200 dark:border-white/5 rounded-3xl p-6 md:p-8 shadow-sm space-y-4"
            >
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-white/5">
                <User size={20} className="text-teal-500" /> Professional Overview
              </h3>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                {profile.bio || `Dr. ${profile.userId?.name} is a dedicated ${profile.specialization} specialist at ${profile.hospitalName || 'HealthSync Clinic'}. With ${profile.experience} years of clinical practice, Dr. ${profile.userId?.name} is deeply committed to delivering empathetic, high-standard patient care and managing specialized healthcare problems.`}
              </p>
            </motion.div>

            {/* WORK EXPERIENCE */}
            {profile.workExperience && profile.workExperience.length > 0 && (
              <motion.div
                variants={itemVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-white dark:bg-[#161b27] border border-slate-200 dark:border-white/5 rounded-3xl p-6 md:p-8 shadow-sm space-y-4"
              >
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-white/5">
                  <Briefcase size={20} className="text-teal-500" /> Work Experience
                </h3>
                <div className="space-y-6 pt-2">
                  {profile.workExperience.map((work, idx) => (
                    <div key={idx} className="flex gap-4 relative group">
                      {/* Left timeline line */}
                      {idx !== profile.workExperience!.length - 1 && (
                        <div className="absolute left-[9px] top-5 bottom-[-24px] w-0.5 bg-slate-100 dark:bg-white/5" />
                      )}
                      
                      <div className="w-5 h-5 rounded-full bg-teal-500/25 border-4 border-white dark:border-[#161b27] group-hover:bg-teal-500 transition-colors z-10 shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm md:text-base">{work.role}</h4>
                        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                          {work.organization} &middot; <span className="font-medium text-slate-400">{work.duration}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* EDUCATION & TRAINING */}
            {profile.education && profile.education.length > 0 && (
              <motion.div
                variants={itemVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-white dark:bg-[#161b27] border border-slate-200 dark:border-white/5 rounded-3xl p-6 md:p-8 shadow-sm space-y-4"
              >
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-white/5">
                  <GraduationCap size={20} className="text-teal-500" /> Education & Training
                </h3>
                <div className="space-y-6 pt-2">
                  {profile.education.map((edu, idx) => (
                    <div key={idx} className="flex gap-4 relative group">
                      {/* Left timeline line */}
                      {idx !== profile.education!.length - 1 && (
                        <div className="absolute left-[9px] top-5 bottom-[-24px] w-0.5 bg-slate-100 dark:bg-white/5" />
                      )}
                      
                      <div className="w-5 h-5 rounded-full bg-teal-500/25 border-4 border-white dark:border-[#161b27] group-hover:bg-teal-500 transition-colors z-10 shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm md:text-base">{edu.degree}</h4>
                        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                          {edu.institution} &middot; <span className="font-medium text-slate-400">{edu.year}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* RIGHT PANELS (Interests, Languages, Awards, Publications) */}
          <div className="space-y-8">
            
            {/* SPECIALITY INTERESTS */}
            {profile.specialityInterests && profile.specialityInterests.length > 0 && (
              <motion.div
                variants={itemVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-white dark:bg-[#161b27] border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm space-y-4"
              >
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-white/5 text-sm md:text-base">
                  <Stethoscope size={18} className="text-teal-500" /> Speciality Interests
                </h3>
                <div className="flex flex-wrap gap-2 pt-1">
                  {profile.specialityInterests.map((interest, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* LANGUAGES SPOKEN */}
            {profile.languages && profile.languages.length > 0 && (
              <motion.div
                variants={itemVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-white dark:bg-[#161b27] border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm space-y-4"
              >
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-white/5 text-sm md:text-base">
                  <Globe size={18} className="text-teal-500" /> Languages
                </h3>
                <div className="flex flex-wrap gap-2 pt-1">
                  {profile.languages.map((lang, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg bg-teal-50/50 dark:bg-teal-500/5 border border-teal-200/30 dark:border-teal-500/10 text-teal-600 dark:text-teal-400"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* AWARDS & RECOGNITIONS */}
            {profile.awards && profile.awards.length > 0 && (
              <motion.div
                variants={itemVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-white dark:bg-[#161b27] border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm space-y-4"
              >
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-white/5 text-sm md:text-base">
                  <Award size={18} className="text-teal-500" /> Awards
                </h3>
                <div className="space-y-3 pt-1">
                  {profile.awards.map((award, idx) => (
                    <div key={idx} className="flex gap-2.5 items-start">
                      <Award size={16} className="text-amber-500 shrink-0 mt-0.5 animate-pulse" />
                      <div className="text-xs md:text-sm">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{award.name}</span>{' '}
                        <span className="text-slate-400 dark:text-slate-500">({award.year})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* PUBLICATIONS */}
            {profile.publications && profile.publications.length > 0 && (
              <motion.div
                variants={itemVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-white dark:bg-[#161b27] border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm space-y-4"
              >
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-white/5 text-sm md:text-base">
                  <BookOpen size={18} className="text-teal-500" /> Publications
                </h3>
                <div className="space-y-3 pt-1">
                  {profile.publications.map((pub, idx) => (
                    <div key={idx} className="flex gap-2.5 items-start">
                      <BookOpen size={16} className="text-teal-500 shrink-0 mt-0.5" />
                      <div className="text-xs md:text-sm">
                        <span className="font-bold text-slate-800 dark:text-slate-200">"{pub.title}"</span>{' '}
                        <span className="text-slate-400 dark:text-slate-500 italic">in {pub.journalName}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </div>

        </div>

      </main>

    </div>
  );
}
