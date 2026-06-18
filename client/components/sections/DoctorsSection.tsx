'use client';

import React, { useState, useEffect, useRef } from 'react';
import api from '@/services/api';
import { DoctorCard, Doctor } from './DoctorCard';
import { Search, Filter, SlidersHorizontal, Stethoscope, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const normalizeSpecialty = (str: string): string => {
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

export const DoctorsSection: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSpeciality, setSelectedSpeciality] = useState<string>('All');
  const [specialities, setSpecialities] = useState<string[]>(['All']);

  // Fetch doctors on mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get('/doctors');
        
        // Handle wrapper or direct array response
        const fetchedData = res.data.data || res.data;
        
        if (Array.isArray(fetchedData)) {
          setDoctors(fetchedData);
          
          // Extract unique specialities from data dynamically, normalizing synonyms and casing
          const specs = fetchedData.map((doc: Doctor) => normalizeSpecialty(doc.specialization));
          const uniqueSpecs = ['All', ...Array.from(new Set(specs))];
          setSpecialities(uniqueSpecs);
        } else {
          throw new Error('Received invalid data format from server');
        }
      } catch (err: any) {
        console.error('Failed to fetch doctors:', err);
        setError('Unable to load our specialists right now. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Filter logic: search query and specialty tag (case-insensitive matches)
  const filteredDoctors = doctors.filter((doc) => {
    const nameMatch = doc.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const specMatch =
      selectedSpeciality === 'All' ||
      normalizeSpecialty(doc.specialization) === selectedSpeciality;
    return nameMatch && specMatch;
  });

  // Animation variants for section content
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as any } }
  };

  const gridContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  // SSR-safe responsive exit/entrance card variants
  const cardAnimationVariants = {
    hidden: (index: number) => ({
      opacity: 0,
      y: 50,
      x: index % 2 === 0 ? -15 : 15 // subtle alternating slide from left/right
    }),
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.215, 0.61, 0.355, 1] as [number, number, number, number] // Out-Cubic curve for smooth decelerating snap
      }
    }
  };

  return (
    <section id="our-doctors" className="relative py-24 px-6 overflow-hidden bg-slate-50 dark:bg-[#0f1117] transition-colors duration-300">
      {/* Decorative colored blobs in the background */}
      <div className="absolute top-1/4 -left-64 w-96 h-96 bg-teal-500/10 dark:bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Heading */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={headerVariants}
          className="text-center mb-16 space-y-4"
        >
          <span className="text-teal-600 dark:text-teal-400 font-semibold text-sm uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Stethoscope size={16} /> Our Dedicated Care
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight relative inline-block">
            Meet Our Specialists
            <span className="block h-1 w-24 bg-teal-500 mx-auto mt-4 rounded-full animate-pulse" />
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Consult with top-rated, certified medical professionals across standard and advanced healthcare domains, committed to your well-being.
          </p>
        </motion.div>

        {/* Filter and Search Bar */}
        <div className="mb-12 space-y-6">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-white dark:bg-[#161b27]/80 backdrop-blur-md border border-slate-200/60 dark:border-white/5 p-4 rounded-2xl shadow-sm">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
              <input
                type="text"
                placeholder="Search doctors by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition-all duration-300"
              />
            </div>

            {/* Specialty Tag Selection Slider (desktop view, wraps neatly) */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 px-0.5">
              <SlidersHorizontal className="text-slate-400 shrink-0 hidden md:block" size={16} />
              <div className="flex gap-2 shrink-0">
                {specialities.map((spec) => (
                  <button
                    key={spec}
                    onClick={() => setSelectedSpeciality(spec)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-300 cursor-pointer ${
                      selectedSpeciality === spec
                        ? 'bg-teal-600 text-white border-transparent shadow-md shadow-teal-500/15 scale-105'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:border-slate-350 dark:hover:border-slate-700'
                    }`}
                  >
                    {spec}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Card Display */}
        {loading ? (
          /* SKELETON LOADER GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((idx) => (
              <div
                key={idx}
                className="animate-pulse bg-white dark:bg-[#111622] border border-slate-100 dark:border-white/5 rounded-3xl p-6 space-y-6 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-800" />
                  <div className="w-24 h-6 rounded-full bg-slate-200 dark:bg-slate-800" />
                </div>
                <div className="space-y-3">
                  <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-md" />
                  <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded-md" />
                </div>
                <div className="space-y-2 pt-2">
                  <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-800 rounded-md" />
                  <div className="h-4 w-4/5 bg-slate-200 dark:bg-slate-800 rounded-md" />
                  <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-800 rounded-md" />
                </div>
                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-white/5">
                  <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                  <div className="h-5 w-1/3 bg-slate-200 dark:bg-slate-800 rounded-md mx-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          /* ERROR BOUNDARY PANEL */
          <div className="text-center py-16 bg-white dark:bg-[#161b27]/40 border border-red-500/10 dark:border-red-500/5 rounded-3xl p-8 max-w-lg mx-auto">
            <p className="text-red-500 dark:text-red-400 font-medium mb-4">{error}</p>
            <button
              onClick={() => {
                setLoading(true);
                setError(null);
                // Trigger refresh
                window.location.reload();
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold transition shadow-md hover:shadow-teal-500/15"
            >
              <RefreshCcw size={16} /> Retry Fetching
            </button>
          </div>
        ) : filteredDoctors.length === 0 ? (
          /* EMPTY STATE */
          <div className="text-center py-20 bg-white dark:bg-[#161b27]/40 border border-slate-200/60 dark:border-white/5 rounded-3xl p-8 max-w-md mx-auto">
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-3">No specialists match your search criteria.</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">Try adjusting your filters or clearing the search box.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSpeciality('All');
              }}
              className="mt-5 text-sm font-bold text-teal-600 dark:text-teal-400 hover:underline"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          /* DOCTOR CARDS GRID WITH FILTER-AWARE ANIMATIONS */
          <motion.div
            key={`${selectedSpeciality}-${searchQuery}`}
            variants={gridContainerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {filteredDoctors.map((doc, idx) => (
                <motion.div
                  key={doc._id}
                  layout
                  custom={idx}
                  variants={cardAnimationVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  className="h-full"
                >
                  <DoctorCard doctor={doc} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

      </div>
      
      {/* Dynamic styling for custom hides */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};
