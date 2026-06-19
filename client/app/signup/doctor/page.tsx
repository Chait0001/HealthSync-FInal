'use client';

import React, { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import {
  Heart,
  Eye,
  EyeOff,
  ChevronRight,
  ChevronLeft,
  Upload,
  Plus,
  Trash2,
  Check,
  Loader2,
  User,
  Briefcase,
  Camera,
  FileText,
  AlertCircle,
  CheckCircle2,
  X,
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────
const SPECIALIZATIONS = [
  'General Physician',
  'Cardiology',
  'Dermatology',
  'Dentistry',
  'Gynecology',
  'Gastroenterology',
  'Orthopedics',
  'Pediatrics',
  'Neurology',
  'Oncology',
  'Ophthalmology',
  'Psychiatry',
  'Psychology',
  'Pulmonology',
  'Endocrinology',
  'Nephrology',
  'Rheumatology',
  'ENT (Ear, Nose, Throat)',
  'Urology',
  'Internal Medicine',
  'Anesthesiology',
  'Emergency Medicine',
  'Radiology',
];

const DEPARTMENTS = [
  'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 'Orthopedics',
  'Ophthalmology', 'Dentistry', 'Psychiatry', 'Gynecology', 'Urology',
  'Oncology', 'Pulmonology', 'Endocrinology', 'Gastroenterology', 'Nephrology',
  'Rheumatology', 'ENT', 'Internal Medicine', 'General Surgery', 'ICU', 'Emergency',
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface EduEntry {
  degree: string;
  institution: string;
  year: string;
}

interface FormData {
  // Step 1
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  gender: string;
  dob: string;

  // Step 2
  specialities: string[];
  designation: string;
  experience: string;
  department: string;
  education: EduEntry[];
  opdSchedule: Array<{ day: string; startTime: string; endTime: string }>;
  feesPerConsultation: string;
  hospitalName: string;
  publications: string;
  awards: string;
  licenseFile: File | null;
  licenseBase64: string;

  // Step 3
  profilePicture: string;
  displayName: string;
  bio: string;
  languages: string;
  memberships: string;
  agreedToTerms: boolean;
  confirmedAccuracy: boolean;
}

interface FieldErrors {
  [key: string]: string;
}

// ─── Step Progress Bar ────────────────────────────────────────────────────────
const STEPS = [
  { label: 'Basic Info', icon: User },
  { label: 'Professional', icon: Briefcase },
  { label: 'Public Profile', icon: Camera },
];

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center mb-8 gap-0">
      {STEPS.map((step, idx) => {
        const Icon = step.icon;
        const isComplete = idx < current - 1;
        const isActive = idx === current - 1;
        return (
          <React.Fragment key={idx}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-400 ${
                  isComplete
                    ? 'bg-[#00d4aa] border-[#00d4aa] text-white'
                    : isActive
                    ? 'bg-[#00d4aa]/10 border-[#00d4aa] text-[#00d4aa]'
                    : 'bg-white/5 border-white/10 text-slate-500'
                }`}
              >
                {isComplete ? <Check size={18} /> : <Icon size={16} />}
              </div>
              <span
                className={`text-xs font-semibold tracking-wide transition-colors ${
                  isActive ? 'text-[#00d4aa]' : isComplete ? 'text-[#00d4aa]/70' : 'text-slate-500'
                }`}
              >
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={`h-0.5 w-16 md:w-24 mx-1 mb-5 rounded-full transition-all duration-500 ${
                  idx < current - 1 ? 'bg-[#00d4aa]' : 'bg-white/10'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Reusable Field Components ────────────────────────────────────────────────
function FieldWrap({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
        {label} {required && <span className="text-[#00d4aa]">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-400">
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  );
}

const inputCls =
  'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#00d4aa]/40 focus:border-[#00d4aa] transition-all duration-200';
const selectCls =
  'w-full px-4 py-3 bg-[#161b27] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00d4aa]/40 focus:border-[#00d4aa] transition-all duration-200 appearance-none';

const validatePassword = (password: string): string | null => {
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
  if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'Password must contain at least one special character';
  return null;
};

const getPasswordStrength = (pass: string): number => {
  let score = 0;
  if (pass.length >= 8) score++;
  if (/[A-Z]/.test(pass)) score++;
  if (/[0-9]/.test(pass)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) score++;
  return score;
};

// ─── Main Onboarding Component ────────────────────────────────────────────────
export default function DoctorOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});

  // Password visibility
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  // File refs
  const licenseRef = useRef<HTMLInputElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gender: '',
    dob: '',
    specialities: [],
    designation: '',
    experience: '',
    department: '',
    education: [{ degree: '', institution: '', year: '' }],
    opdSchedule: [],
    feesPerConsultation: '',
    hospitalName: 'HealthSync Clinic',
    publications: '',
    awards: '',
    licenseFile: null,
    licenseBase64: '',
    profilePicture: '',
    displayName: '',
    bio: '',
    languages: '',
    memberships: '',
    agreedToTerms: false,
    confirmedAccuracy: false,
  });

  const set = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  const addSpeciality = (value: string) => {
    if (value && !formData.specialities.includes(value)) {
      setFormData(prev => ({ ...prev, specialities: [...prev.specialities, value] }));
      if (errors.specialities) setErrors((prev) => { const n = { ...prev }; delete n.specialities; return n; });
    }
  };

  const removeSpeciality = (value: string) => {
    setFormData(prev => ({ ...prev, specialities: prev.specialities.filter(s => s !== value) }));
  };

  const toggleDay = (day: string) => {
    setFormData(prev => {
      const exists = prev.opdSchedule.find(s => s.day === day);
      if (exists) {
        const nextSchedule = prev.opdSchedule.filter(s => s.day !== day);
        if (errors.opdSchedule) setErrors((errs) => { const n = { ...errs }; delete n.opdSchedule; return n; });
        return { ...prev, opdSchedule: nextSchedule };
      }
      if (errors.opdSchedule) setErrors((errs) => { const n = { ...errs }; delete n.opdSchedule; return n; });
      return { ...prev, opdSchedule: [...prev.opdSchedule, { day, startTime: '09:00', endTime: '17:00' }] };
    });
  };

  const updateOpdTime = (index: number, field: 'startTime' | 'endTime', value: string) => {
    setFormData(prev => ({
      ...prev,
      opdSchedule: prev.opdSchedule.map((slot, i) => i === index ? { ...slot, [field]: value } : slot)
    }));
  };

  // ─── Education row helpers ─────────────────────────────────────────────────
  const addEduRow = () => set('education', [...formData.education, { degree: '', institution: '', year: '' }]);
  const removeEduRow = (idx: number) => set('education', formData.education.filter((_, i) => i !== idx));
  const updateEduRow = (idx: number, field: keyof EduEntry, value: string) => {
    const updated = formData.education.map((row, i) => i === idx ? { ...row, [field]: value } : row);
    set('education', updated);
  };

  // ─── File handlers ─────────────────────────────────────────────────────────
  const handleLicenseFile = (file: File) => {
    if (file.size > 2 * 1024 * 1024) { setErrors((p) => ({ ...p, licenseFile: 'File must be under 2MB' })); return; }
    if (!['application/pdf', 'image/png', 'image/jpeg'].includes(file.type)) {
      setErrors((p) => ({ ...p, licenseFile: 'Only PDF, PNG or JPEG files accepted' })); return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, licenseFile: file, licenseBase64: reader.result as string }));
      setErrors((p) => { const n = { ...p }; delete n.licenseFile; return n; });
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoFile = (file: File) => {
    if (file.size > 2 * 1024 * 1024) { setErrors((p) => ({ ...p, profilePicture: 'Image must be under 2MB' })); return; }
    if (!file.type.startsWith('image/')) { setErrors((p) => ({ ...p, profilePicture: 'Only image files accepted' })); return; }
    const reader = new FileReader();
    reader.onload = () => {
      set('profilePicture', reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // ─── Drag-drop helpers ─────────────────────────────────────────────────────
  const [dragLicense, setDragLicense] = useState(false);
  const [dragPhoto, setDragPhoto] = useState(false);

  const onDropLicense = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragLicense(false);
    const file = e.dataTransfer.files[0]; if (file) handleLicenseFile(file);
  }, []);

  const onDropPhoto = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragPhoto(false);
    const file = e.dataTransfer.files[0]; if (file) handlePhotoFile(file);
  }, []);

  // ─── Validation ────────────────────────────────────────────────────────────
  const validateStep1 = (): boolean => {
    const e: FieldErrors = {};
    if (!formData.firstName.trim()) e.firstName = 'First name is required';
    if (!formData.lastName.trim()) e.lastName = 'Last name is required';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Valid email is required';
    if (!formData.phone.trim()) e.phone = 'Phone number is required';
    
    const pwdErr = validatePassword(formData.password);
    if (pwdErr) {
      e.password = pwdErr;
    }
    
    if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = (): boolean => {
    const e: FieldErrors = {};
    if (!formData.specialities || formData.specialities.length === 0) {
      e.specialities = 'At least one speciality is required';
    }
    if (!formData.designation || !formData.designation.trim()) e.designation = 'Designation is required';
    if (!formData.experience || Number(formData.experience) < 0) e.experience = 'Valid years of experience required';
    if (!formData.department || !formData.department.trim()) e.department = 'Department is required';
    if (!formData.licenseBase64) e.licenseFile = 'Medical license/certificate is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep3 = (): boolean => {
    const e: FieldErrors = {};
    if (!formData.profilePicture) e.profilePicture = 'Profile photo is required';
    if (!formData.displayName.trim()) e.displayName = 'Display name is required';
    if (!formData.agreedToTerms) e.agreedToTerms = 'You must agree to the Terms & Conditions';
    if (!formData.confirmedAccuracy) e.confirmedAccuracy = 'You must confirm accuracy of information';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ─── Navigation ────────────────────────────────────────────────────────────
  const goNext = () => {
    setServerError('');
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep((s) => s + 1);
    // Auto-fill display name from step 1
    if (step === 1) {
      set('displayName', `${formData.firstName} ${formData.lastName}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ─── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validateStep3()) return;
    setIsSubmitting(true);
    setServerError('');

    // Parse languages & memberships from comma/newline separated text
    const parsedLanguages = formData.languages
      .split(/[,\n]/).map((s) => s.trim()).filter(Boolean);
    const parsedMemberships = formData.memberships
      .split(/\n/).map((s) => s.trim()).filter(Boolean);
    const parsedPublications = formData.publications
      .split(/\n/).map((s) => s.trim()).filter(Boolean)
      .map((title) => ({ title }));
    const parsedAwards = formData.awards
      .split(/\n/).map((s) => s.trim()).filter(Boolean)
      .map((name) => ({ name }));

    const validEdu = formData.education.filter((e) => e.degree.trim() || e.institution.trim());

    const payload = {
      name: formData.displayName,
      email: formData.email,
      password: formData.password,
      role: 'doctor',
      phone: formData.phone,
      gender: formData.gender || undefined,
      // Doctor fields
      specialities: formData.specialities,
      specialization: formData.specialities.join(', '),
      designation: formData.designation,
      experience: Number(formData.experience) || 0,
      feesPerConsultation: Number(formData.feesPerConsultation) || 500,
      department: formData.department,
      hospitalName: formData.hospitalName || 'HealthSync Clinic',
      opdSchedule: formData.opdSchedule,
      bio: formData.bio || undefined,
      profilePhoto: formData.profilePicture || undefined,
      education: validEdu.length > 0 ? validEdu : undefined,
      publications: parsedPublications.length > 0 ? parsedPublications : undefined,
      awards: parsedAwards.length > 0 ? parsedAwards : undefined,
      languagesSpoken: parsedLanguages.length > 0 ? parsedLanguages : undefined,
      memberships: parsedMemberships.length > 0 ? parsedMemberships : undefined,
    };

    try {
      await api.post('/auth/register', payload);
      setSubmitted(true);
    } catch (err: any) {
      console.error('Doctor registration error:', err.response?.data || err.message);
      setServerError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Success Screen ────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6 animate-[fadeInUp_0.6s_ease_both]">
          <div className="w-20 h-20 bg-[#00d4aa]/10 border-2 border-[#00d4aa] rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={40} className="text-[#00d4aa]" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white mb-2">Profile Submitted!</h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Thank you, Dr. {formData.firstName}. Our team will review your details and activate your account within <strong className="text-white">1–2 business days</strong>.
            </p>
          </div>
          <div className="bg-[#161b27] border border-white/10 rounded-2xl p-4 text-left space-y-2">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">What happens next?</p>
            {[
              'Your application is under review',
              'Admin verifies your credentials',
              'You receive an email upon activation',
              'You can then log in and manage appointments',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 text-sm text-slate-300">
                <div className="w-5 h-5 rounded-full bg-[#00d4aa]/20 text-[#00d4aa] text-xs flex items-center justify-center font-bold shrink-0">
                  {i + 1}
                </div>
                {item}
              </div>
            ))}
          </div>
          <Link
            href="/login"
            className="block w-full py-3 rounded-xl bg-[#00d4aa] hover:bg-[#00b894] text-[#0d1117] font-bold text-sm transition-all"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const password = formData.password;
  const passwordStrength = getPasswordStrength(password);

  // ─── Form ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-[#00d4aa]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-10">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 bg-[#00d4aa] rounded-xl flex items-center justify-center shadow-lg shadow-[#00d4aa]/20">
            <Heart size={20} className="text-[#0d1117]" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white">HealthSync</span>
        </div>

        {/* Heading */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Doctor Onboarding</h1>
          <p className="text-slate-400 text-sm mt-1.5">
            {step === 1 && 'Welcome to HealthSync — Enter your basic details'}
            {step === 2 && 'Enter your professional details'}
            {step === 3 && 'Set up your public profile visible on HealthSync'}
          </p>
        </div>

        {/* Step bar */}
        <StepBar current={step} />

        {/* Card */}
        <div className="bg-[#161b27] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl shadow-black/30">

          {/* Global server error */}
          {serverError && (
            <div className="mb-6 flex items-start gap-3 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          {/* ══════════════════ STEP 1 ══════════════════ */}
          {step === 1 && (
            <div className="space-y-5 animate-[fadeInUp_0.3s_ease_both]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FieldWrap label="First Name" required error={errors.firstName}>
                  <input
                    className={inputCls}
                    placeholder="e.g. John"
                    value={formData.firstName}
                    onChange={(e) => set('firstName', e.target.value)}
                  />
                </FieldWrap>
                <FieldWrap label="Last Name" required error={errors.lastName}>
                  <input
                    className={inputCls}
                    placeholder="e.g. Doe"
                    value={formData.lastName}
                    onChange={(e) => set('lastName', e.target.value)}
                  />
                </FieldWrap>
                <FieldWrap label="Email" required error={errors.email}>
                  <input
                    type="email"
                    className={inputCls}
                    placeholder="john.doe@example.com"
                    value={formData.email}
                    onChange={(e) => set('email', e.target.value)}
                  />
                </FieldWrap>
                <FieldWrap label="Phone Number" required error={errors.phone}>
                  <input
                    type="tel"
                    className={inputCls}
                    placeholder="1234567890"
                    value={formData.phone}
                    onChange={(e) => set('phone', e.target.value)}
                  />
                </FieldWrap>
                <FieldWrap label="Password" required error={errors.password}>
                  <div className="relative">
                    <input
                      type={showPwd ? 'text' : 'password'}
                      className={inputCls + ' pr-11'}
                      placeholder="Min. 8 characters"
                      value={formData.password}
                      onChange={(e) => set('password', e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#00d4aa] transition-colors"
                    >
                      {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {password && (
                    <div className="mt-2 space-y-1">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                            passwordStrength >= i ? 
                              passwordStrength === 4 ? 'bg-green-500' : passwordStrength >= 3 ? 'bg-yellow-500' : 'bg-red-500' 
                              : 'bg-slate-700'
                          }`} />
                        ))}
                      </div>
                      <ul className="text-xs space-y-0.5 mt-1.5">
                        <li className={password.length >= 8 ? 'text-green-400' : 'text-slate-500'}>✓ At least 8 characters</li>
                        <li className={/[A-Z]/.test(password) ? 'text-green-400' : 'text-slate-500'}>✓ One uppercase letter</li>
                        <li className={/[0-9]/.test(password) ? 'text-green-400' : 'text-slate-500'}>✓ One number</li>
                        <li className={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-green-400' : 'text-slate-500'}>✓ One special character</li>
                      </ul>
                    </div>
                  )}
                </FieldWrap>
                <FieldWrap label="Confirm Password" required error={errors.confirmPassword}>
                  <div className="relative">
                    <input
                      type={showConfirmPwd ? 'text' : 'password'}
                      className={inputCls + ' pr-11'}
                      placeholder="Re-enter password"
                      value={formData.confirmPassword}
                      onChange={(e) => set('confirmPassword', e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPwd((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#00d4aa] transition-colors"
                    >
                      {showConfirmPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </FieldWrap>
                <FieldWrap label="Gender" error={errors.gender}>
                  <select
                    className={selectCls}
                    value={formData.gender}
                    onChange={(e) => set('gender', e.target.value)}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </FieldWrap>
                <FieldWrap label="Date of Birth" error={errors.dob}>
                  <input
                    type="date"
                    className={inputCls + ' [color-scheme:dark]'}
                    value={formData.dob}
                    onChange={(e) => set('dob', e.target.value)}
                  />
                </FieldWrap>
              </div>
            </div>
          )}

          {/* ══════════════════ STEP 2 ══════════════════ */}
          {step === 2 && (
            <div className="space-y-5 animate-[fadeInUp_0.3s_ease_both]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FieldWrap label="Speciality" required error={errors.specialities}>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.specialities.map(s => (
                      <span key={s} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-sm">
                        {s}
                        <button type="button" onClick={() => removeSpeciality(s)} className="hover:text-white cursor-pointer">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="relative">
                    <select
                      className={selectCls}
                      value=""
                      onChange={(e) => addSpeciality(e.target.value)}
                    >
                      <option value="">+ Add a speciality</option>
                      {SPECIALIZATIONS.filter(s => !formData.specialities.includes(s)).map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </FieldWrap>
                <FieldWrap label="Designation / Title" required error={errors.designation}>
                  <input
                    className={inputCls}
                    placeholder="e.g. Principal Director, Consultant"
                    value={formData.designation}
                    onChange={(e) => set('designation', e.target.value)}
                  />
                </FieldWrap>
                <FieldWrap label="Years of Experience" required error={errors.experience}>
                  <input
                    type="number"
                    min="0"
                    className={inputCls}
                    placeholder="e.g. 15"
                    value={formData.experience}
                    onChange={(e) => set('experience', e.target.value)}
                  />
                </FieldWrap>
                <FieldWrap label="Department" required error={errors.department}>
                  <select
                    name="department"
                    className={selectCls}
                    value={formData.department}
                    onChange={(e) => set('department', e.target.value)}
                  >
                    <option value="">Select department</option>
                    {DEPARTMENTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </FieldWrap>
                <div className="md:col-span-2">
                  <FieldWrap label="OPD Timings" error={errors.opdSchedule}>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {DAYS.map(day => {
                        const isSelected = formData.opdSchedule.some(s => s.day === day);
                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => toggleDay(day)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                              isSelected ? 'bg-[#00d4aa] text-[#0d1117]' : 'bg-white/5 text-slate-400 border border-white/10'
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {formData.opdSchedule.map((slot, i) => (
                        <div key={slot.day} className="flex items-center gap-3 bg-white/5 rounded-lg p-3 border border-white/5">
                          <span className="text-sm font-semibold text-[#00d4aa] w-12">{slot.day}</span>
                          <input
                            type="time"
                            value={slot.startTime}
                            onChange={(e) => updateOpdTime(i, 'startTime', e.target.value)}
                            className="bg-transparent border border-white/10 rounded-lg px-2 py-1 text-sm text-white focus:outline-none focus:border-[#00d4aa] [color-scheme:dark]"
                          />
                          <span className="text-slate-500 text-sm">to</span>
                          <input
                            type="time"
                            value={slot.endTime}
                            onChange={(e) => updateOpdTime(i, 'endTime', e.target.value)}
                            className="bg-transparent border border-white/10 rounded-lg px-2 py-1 text-sm text-white focus:outline-none focus:border-[#00d4aa] [color-scheme:dark]"
                          />
                          <button type="button" onClick={() => toggleDay(slot.day)} className="ml-auto text-red-400 hover:text-red-300 cursor-pointer">
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </FieldWrap>
                </div>
                <FieldWrap label="Consultation Fee" error={errors.feesPerConsultation}>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">Rs.</span>
                    <input
                      type="number"
                      min="0"
                      className={inputCls + ' pl-12'}
                      placeholder="500"
                      value={formData.feesPerConsultation}
                      onChange={(e) => set('feesPerConsultation', e.target.value)}
                    />
                  </div>
                </FieldWrap>
                <div className="md:col-span-2">
                  <FieldWrap label="Hospital / Clinic Name" error={errors.hospitalName}>
                    <input
                      className={inputCls}
                      placeholder="HealthSync Clinic"
                      value={formData.hospitalName}
                      onChange={(e) => set('hospitalName', e.target.value)}
                    />
                  </FieldWrap>
                </div>
              </div>

              {/* Education */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Education Details</label>
                  <button
                    type="button"
                    onClick={addEduRow}
                    className="flex items-center gap-1 text-xs text-[#00d4aa] hover:text-[#00b894] font-semibold transition-colors"
                  >
                    <Plus size={14} /> Add More
                  </button>
                </div>
                {formData.education.map((row, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto_auto] gap-2 items-start bg-white/5 rounded-xl p-3 border border-white/5">
                    <input
                      className={inputCls}
                      placeholder="Degree (e.g. MBBS, MD)"
                      value={row.degree}
                      onChange={(e) => updateEduRow(idx, 'degree', e.target.value)}
                    />
                    <input
                      className={inputCls}
                      placeholder="Institution"
                      value={row.institution}
                      onChange={(e) => updateEduRow(idx, 'institution', e.target.value)}
                    />
                    <input
                      className={inputCls + ' md:w-28'}
                      placeholder="Year"
                      value={row.year}
                      onChange={(e) => updateEduRow(idx, 'year', e.target.value)}
                    />
                    {formData.education.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEduRow(idx)}
                        className="p-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors self-center"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Publications */}
              <FieldWrap label="Research Papers / Publications" error={errors.publications}>
                <textarea
                  rows={3}
                  className={inputCls + ' resize-none'}
                  placeholder="One per line — e.g. &quot;Title of paper&quot; in Journal Name"
                  value={formData.publications}
                  onChange={(e) => set('publications', e.target.value)}
                />
              </FieldWrap>

              {/* Awards */}
              <FieldWrap label="Achievements / Awards" error={errors.awards}>
                <textarea
                  rows={3}
                  className={inputCls + ' resize-none'}
                  placeholder="One per line — e.g. Best Doctor Award 2022"
                  value={formData.awards}
                  onChange={(e) => set('awards', e.target.value)}
                />
              </FieldWrap>

              {/* License Upload */}
              <FieldWrap label="Medical License / Certificate" required error={errors.licenseFile}>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragLicense(true); }}
                  onDragLeave={() => setDragLicense(false)}
                  onDrop={onDropLicense}
                  onClick={() => licenseRef.current?.click()}
                  className={`relative flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all duration-200 ${
                    dragLicense
                      ? 'border-[#00d4aa] bg-[#00d4aa]/5'
                      : formData.licenseFile
                      ? 'border-[#00d4aa]/50 bg-[#00d4aa]/5'
                      : 'border-white/10 hover:border-[#00d4aa]/40 hover:bg-white/5'
                  }`}
                >
                  <input
                    ref={licenseRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleLicenseFile(f); }}
                  />
                  {formData.licenseFile ? (
                    <>
                      <div className="w-12 h-12 bg-[#00d4aa]/10 rounded-full flex items-center justify-center">
                        <FileText size={24} className="text-[#00d4aa]" />
                      </div>
                      <p className="text-sm font-semibold text-[#00d4aa]">{formData.licenseFile.name}</p>
                      <p className="text-xs text-slate-500">Click to replace</p>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
                        <Upload size={22} className="text-slate-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-white font-medium">Drag & drop or <span className="text-[#00d4aa]">choose file</span></p>
                        <p className="text-xs text-slate-500 mt-1">PDF, PNG or JPEG — Max 2MB</p>
                      </div>
                    </>
                  )}
                </div>
              </FieldWrap>
            </div>
          )}

          {/* ══════════════════ STEP 3 ══════════════════ */}
          {step === 3 && (
            <div className="space-y-6 animate-[fadeInUp_0.3s_ease_both]">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_180px] gap-6 items-start">
                {/* Left: Form fields */}
                <div className="space-y-5">
                  <FieldWrap label="Profile Photo" required error={errors.profilePicture}>
                    <div
                      onDragOver={(e) => { e.preventDefault(); setDragPhoto(true); }}
                      onDragLeave={() => setDragPhoto(false)}
                      onDrop={onDropPhoto}
                      onClick={() => photoRef.current?.click()}
                      className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                        dragPhoto
                          ? 'border-[#00d4aa] bg-[#00d4aa]/5'
                          : formData.profilePicture
                          ? 'border-[#00d4aa]/50 bg-[#00d4aa]/5'
                          : 'border-white/10 hover:border-[#00d4aa]/40 hover:bg-white/5'
                      }`}
                    >
                      <input
                        ref={photoRef}
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePhotoFile(f); }}
                      />
                      <Camera size={24} className={formData.profilePicture ? 'text-[#00d4aa]' : 'text-slate-400'} />
                      <p className="text-sm text-white font-medium text-center">
                        {formData.profilePicture
                          ? <span className="text-[#00d4aa]">Photo uploaded ✓ — Click to change</span>
                          : <>Drag & drop or <span className="text-[#00d4aa]">choose photo</span></>
                        }
                      </p>
                      <p className="text-xs text-slate-500">Image only — Max 2MB</p>
                    </div>
                  </FieldWrap>

                  <FieldWrap label="Display Name" required error={errors.displayName}>
                    <input
                      className={inputCls}
                      placeholder="Your full name as seen by patients"
                      value={formData.displayName}
                      onChange={(e) => set('displayName', e.target.value)}
                    />
                  </FieldWrap>

                  <FieldWrap label="Short Bio / About" error={errors.bio}>
                    <textarea
                      rows={4}
                      className={inputCls + ' resize-none'}
                      placeholder="Tell patients about yourself, your approach, specializations..."
                      value={formData.bio}
                      onChange={(e) => set('bio', e.target.value)}
                    />
                  </FieldWrap>

                  <FieldWrap label="Languages Spoken" error={errors.languages}>
                    <input
                      className={inputCls}
                      placeholder="e.g. English, Hindi, Punjabi (comma-separated)"
                      value={formData.languages}
                      onChange={(e) => set('languages', e.target.value)}
                    />
                  </FieldWrap>

                  <FieldWrap label="Memberships / Associations" error={errors.memberships}>
                    <textarea
                      rows={3}
                      className={inputCls + ' resize-none'}
                      placeholder="One per line — e.g. Indian Society of Gastroenterology"
                      value={formData.memberships}
                      onChange={(e) => set('memberships', e.target.value)}
                    />
                  </FieldWrap>
                </div>

                {/* Right: circular photo preview */}
                <div className="flex flex-col items-center gap-3 pt-1">
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider text-center">Preview</p>
                  <div
                    className="w-36 h-36 rounded-full border-2 border-[#00d4aa]/40 bg-[#0d1117] flex items-center justify-center overflow-hidden shadow-lg shadow-[#00d4aa]/5 cursor-pointer hover:border-[#00d4aa] transition-colors"
                    onClick={() => photoRef.current?.click()}
                  >
                    {formData.profilePicture ? (
                      <img src={formData.profilePicture} alt="Profile preview" className="w-full h-full object-cover" />
                    ) : (
                      <User size={50} className="text-slate-600" />
                    )}
                  </div>
                  {formData.displayName && (
                    <p className="text-sm font-semibold text-white text-center leading-tight">
                      Dr. {formData.displayName}
                    </p>
                  )}
                  {formData.specialities && formData.specialities.length > 0 && (
                    <div className="flex flex-wrap gap-1 justify-center">
                      {formData.specialities.slice(0, 2).map(s => (
                        <span key={s} className="px-2.5 py-1 text-xs font-bold rounded-full bg-[#00d4aa]/10 text-[#00d4aa] border border-[#00d4aa]/20">
                          {s}
                        </span>
                      ))}
                      {formData.specialities.length > 2 && (
                        <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-[#00d4aa]/10 text-[#00d4aa] border border-[#00d4aa]/20">
                          +{formData.specialities.length - 2} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3 pt-2 border-t border-white/5">
                {[
                  {
                    key: 'agreedToTerms' as keyof FormData,
                    label: (
                      <>I agree to HealthSync&apos;s{' '}
                        <a href="#" className="text-[#00d4aa] hover:underline">Terms & Conditions</a>
                        {' '}and{' '}
                        <a href="#" className="text-[#00d4aa] hover:underline">Privacy Policy</a>
                      </>
                    ),
                  },
                  {
                    key: 'confirmedAccuracy' as keyof FormData,
                    label: 'I confirm that all information provided above is accurate and complete',
                  },
                ].map(({ key, label }) => (
                  <div key={key} className="space-y-1">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div
                        className={`w-5 h-5 rounded-md border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                          formData[key]
                            ? 'bg-[#00d4aa] border-[#00d4aa]'
                            : 'border-white/20 group-hover:border-[#00d4aa]/50'
                        }`}
                        onClick={() => set(key, !formData[key])}
                      >
                        {formData[key] && <Check size={12} className="text-[#0d1117]" strokeWidth={3} />}
                      </div>
                      <span className="text-sm text-slate-300 leading-snug">{label}</span>
                    </label>
                    {errors[key] && (
                      <p className="flex items-center gap-1 text-xs text-red-400 ml-8">
                        <AlertCircle size={12} /> {errors[key]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════ Navigation Buttons ══════════════════ */}
          <div className={`flex gap-3 mt-8 pt-6 border-t border-white/5 ${step === 1 ? 'justify-end' : 'justify-between'}`}>
            {step > 1 && (
              <button
                type="button"
                onClick={goBack}
                className="flex items-center gap-2 px-5 py-3 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 hover:border-white/20 font-semibold text-sm transition-all"
              >
                <ChevronLeft size={16} /> Back
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={goNext}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00d4aa] hover:bg-[#00b894] active:scale-[0.98] text-[#0d1117] font-bold text-sm transition-all shadow-lg shadow-[#00d4aa]/20"
              >
                Proceed to Next <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00d4aa] hover:bg-[#00b894] active:scale-[0.98] text-[#0d1117] font-bold text-sm transition-all shadow-lg shadow-[#00d4aa]/20 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <><Loader2 size={16} className="animate-spin" /> Submitting...</>
                ) : (
                  <><Check size={16} /> Submit & Create Profile</>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Footer link */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Already a doctor?{' '}
          <Link href="/login" className="text-[#00d4aa] hover:text-[#00b894] font-semibold transition-colors">
            Login here
          </Link>
        </p>
      </div>

      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
