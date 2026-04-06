'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Loader2, HeartPulse, Sparkles, Calendar as CalendarIcon, FileText, CheckCircle2, ChevronRight, UserRound, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Doctor {
  _id: string;
  userId: {
    _id: string;
    name: string;
  };
  specialization: string;
  feesPerConsultation: number;
}

const CONCERN_MAPPING: Record<string, string[]> = {
  'Fever': ['General', 'Physician', 'Pediatric'],
  'Headache': ['Neurolog', 'General', 'Physician'],
  'Cold & Cough': ['General', 'Physician', 'Pediatric'],
  'Skin Rash': ['Dermatolog', 'Dermatalog', 'Skin'],
  'Toothache': ['Dentist', 'Dental'],
  'Blurry Vision': ['Ophthalmolog', 'Eye', 'Vision'],
  'Chest Pain': ['Cardiolog', 'General', 'Heart'],
  'Joint Pain': ['Orthopedic', 'Ortho', 'Bone'],
  'Stress / Anxiety': ['Psycholog', 'Psychiat', 'Therapy']
};

const SUGGESTIONS = Object.keys(CONCERN_MAPPING);

export default function BookAppointmentPage() {
  const router = useRouter();
  
  // Data
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form State
  const [step, setStep] = useState(1);
  const [concern, setConcern] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await api.get('/doctors');
        setDoctors(data);
      } catch (error) {
        console.error("Failed to fetch doctors", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  // AI Matching Logic
  const recommendedDoctors = useMemo(() => {
    if (!concern) return [];
    
    const possibleSpecs = CONCERN_MAPPING[concern] || ['General'];
    
    // Find all doctors matching specialization
    const matches = doctors.filter(doc => 
      possibleSpecs.some(spec => doc.specialization.toLowerCase().includes(spec.toLowerCase()))
    );
    
    // If no exact matches, fallback to all doctors (or return empty array to show "no specialized doctors")
    // Let's just return the matches (even if empty) so the user sees "No specialized doctors"
    return matches;
  }, [concern, doctors]);

  // Handle Step Progression
  const handleNextStep = () => {
    if (step === 1 && concern) {
      if (recommendedDoctors.length > 0) setSelectedDoctorId(recommendedDoctors[0]._id);
      setStep(2);
    } else if (step === 2 && selectedDoctorId) {
      setStep(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctorId || !date || !concern) {
      alert("Please complete all steps");
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/appointments', {
        doctorId: selectedDoctorId,
        date: date,
        reason: `${concern} - ${symptoms}`
      });
      router.push('/dashboard/patient');
    } catch (error) {
      console.error("Booking failed", error);
      alert("Failed to book appointment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Book an Appointment</h1>
        <p className="text-muted-foreground mt-2">Intelligent matching for your health needs.</p>
      </div>

      {/* Modern Stepper */}
      <div className="flex items-center justify-between relative px-2 mb-10">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-border rounded-full z-0"></div>
        
        {/* Step 1 */}
        <div className="flex flex-col items-center relative z-10 gap-2">
          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md transition-colors", 
            step >= 1 ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground border-2 border-border"
          )}>
            1
          </div>
          <span className={cn("text-xs font-semibold", step >= 1 ? "text-primary" : "text-muted-foreground")}>Concern</span>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col items-center relative z-10 gap-2">
          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md transition-colors", 
            step >= 2 ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground border-2 border-border"
          )}>
            2
          </div>
          <span className={cn("text-xs font-semibold", step >= 2 ? "text-primary" : "text-muted-foreground")}>Matching</span>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col items-center relative z-10 gap-2">
          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md transition-colors", 
            step >= 3 ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground border-2 border-border"
          )}>
            3
          </div>
          <span className={cn("text-xs font-semibold", step >= 3 ? "text-primary" : "text-muted-foreground")}>Schedule</span>
        </div>
      </div>

      {/* Main Form Content */}
      <Card className="p-8 shadow-xl border-border bg-card">
        
        {/* Step 1: Health Concern */}
        {step === 1 && (
          <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-lg font-semibold mb-4">
                <HeartPulse className="text-primary" /> Select Your Health Concern
              </div>
              
              {/* Suggestion Chips */}
              <div className="flex flex-wrap gap-2 mb-6">
                {SUGGESTIONS.map(sug => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => setConcern(sug)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
                      concern === sug 
                        ? "bg-primary text-primary-foreground border-primary shadow-md scale-105" 
                        : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                    )}
                  >
                    {sug}
                  </button>
                ))}
              </div>
              
              {/* Custom Reason Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Or Search Custom Concern</label>
                <Input 
                  placeholder="e.g. Back pain for 3 days"
                  value={concern}
                  onChange={(e) => setConcern(e.target.value)}
                  className="bg-background text-foreground border-border focus:ring-primary/20"
                />
              </div>

              {/* Textarea */}
              <div className="space-y-2 pt-4">
                <label className="text-sm font-medium flex items-center gap-2 text-foreground">
                  <FileText size={16}/> Describe Your Symptoms (Optional)
                </label>
                <textarea
                  className="flex min-h-[100px] w-full rounded-md border border-border bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-inner"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Any additional details..."
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={handleNextStep} disabled={!concern} className="gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 hover:scale-[1.02] transition-all shadow-lg text-white">
                Find Best Doctor <ChevronRight size={18} />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Doctor Match */}
        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
            <div className="flex items-center justify-between mb-2">
               <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
                 <Sparkles className="text-indigo-500" /> AI Recommended Match
               </div>
               <button onClick={() => setStep(1)} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"><ArrowLeft size={14}/> Back</button>
            </div>
            
            <p className="text-sm text-muted-foreground mb-6">Based on <span className="font-semibold text-foreground">"{concern}"</span>, we’ll match you with the best specialist.</p>
            
            {recommendedDoctors.length > 0 ? (
              <div className="space-y-4 mb-6">
                {recommendedDoctors.map(doc => (
                  <div 
                    key={doc._id}
                    onClick={() => setSelectedDoctorId(doc._id)}
                    className={cn(
                      "p-6 border-2 rounded-xl flex items-start gap-4 shadow-sm cursor-pointer transition-all",
                      selectedDoctorId === doc._id 
                        ? "border-indigo-500 bg-indigo-500/10" 
                        : "border-border bg-card hover:border-indigo-300"
                    )}
                  >
                     <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-300 shrink-0">
                        <UserRound size={28} />
                     </div>
                     <div className="flex-1">
                       <h3 className="text-xl font-bold text-foreground">Dr. {doc.userId.name}</h3>
                       <p className="text-indigo-600 dark:text-indigo-400 font-medium">{doc.specialization}</p>
                       <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1"><CheckCircle2 size={14} className="text-green-500"/> Perfect match for exactly what you need.</p>
                       <p className="text-sm font-semibold mt-2 text-foreground">Fee: ${doc.feesPerConsultation}</p>
                     </div>
                     <div className="flex items-center justify-center h-full pt-4">
                       <div className={cn(
                         "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                         selectedDoctorId === doc._id ? "border-indigo-500 bg-indigo-500" : "border-muted-foreground"
                       )}>
                          {selectedDoctorId === doc._id && <CheckCircle2 size={16} className="text-white" />}
                       </div>
                     </div>
                  </div>
                ))}
              </div>
            ) : (
               <div className="p-6 border border-border bg-muted/20 rounded-xl text-center mb-6">
                 No specialized doctors available right now. We will notify you when a slot opens up.
               </div>
            )}

            <div className="space-y-4">
              <label className="text-sm font-medium text-foreground">Or pick a different available doctor:</label>
              <select
                className="flex h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
              >
                <option value="" disabled>Select a doctor manually</option>
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    Dr. {doctor.userId.name} - {doctor.specialization} (${doctor.feesPerConsultation})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={handleNextStep} disabled={!selectedDoctorId} className="gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 hover:scale-[1.02] transition-all shadow-lg text-white">
                Proceed to Scheduling <ChevronRight size={18} />
              </Button>
            </div>
          </div>
        )}

// Main Form Content
        {/* Step 3: Date & Time Scheduler */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-6 animate-in slide-in-from-right-8 duration-300">
             <div className="flex items-center justify-between mb-2">
               <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
                 <CalendarIcon className="text-primary" /> Select a Convenient Slot
               </div>
               <button type="button" onClick={() => setStep(2)} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"><ArrowLeft size={14}/> Back</button>
             </div>
             
             <div className="p-4 bg-muted/30 rounded-lg border border-border mb-6">
                <p className="font-semibold text-foreground">Booking with: <span className="font-normal text-muted-foreground">Dr. {doctors.find(d => d._id === selectedDoctorId)?.userId.name}</span></p>
                <p className="font-semibold text-foreground">For: <span className="font-normal text-muted-foreground">"{concern}"</span></p>
             </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Date</label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-primary w-4 h-4 z-10 pointer-events-none" />
                    <Input
                      type="date"
                      value={date.split('T')[0] || ''}
                      onChange={(e) => {
                         const newDate = e.target.value;
                         const currentTime = date.split('T')[1] || '09:00';
                         setDate(`${newDate}T${currentTime}`);
                      }}
                      required
                      className="pl-10 relative bg-background text-foreground border-border focus:ring-primary/20 cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:left-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                    />
                  </div>
               </div>
               <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Time</label>
                  <div className="relative flex items-center bg-background border border-border rounded-md focus-within:ring-2 focus-within:ring-primary/20">
                    <span className="pl-3 z-10 pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-primary">
                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    </span>
                    <Input
                      type="time"
                      value={date.split('T')[1] || ''}
                      onChange={(e) => {
                         const newTime = e.target.value;
                         const currentDate = date.split('T')[0] || new Date().toISOString().split('T')[0];
                         setDate(`${currentDate}T${newTime}`);
                      }}
                      required
                      className="pl-10 w-full bg-transparent text-foreground border-none focus:ring-0 cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:left-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                    />
                  </div>
               </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Click anywhere on the fields to open the selector.</p>

            <div className="flex gap-4 pt-6">
              <Button type="button" variant="outline" onClick={() => router.push('/dashboard/patient')} className="flex-1 bg-background text-foreground border-border hover:bg-muted/50">Cancel</Button>
              <Button type="submit" disabled={submitting || !date || date.length < 15} className="flex-1 gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 hover:scale-[1.02] transition-all shadow-lg text-white font-semibold">
                {submitting ? <Loader2 className="animate-spin" /> : <><CheckCircle2 size={18}/> Confirm Appointment</>}
              </Button>
            </div>
          </form>
        )}

      </Card>
    </div>
  );
}
