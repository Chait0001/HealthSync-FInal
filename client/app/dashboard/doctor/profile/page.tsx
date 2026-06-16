'use client';

import { useEffect, useState, useRef } from 'react';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import {
  Pencil,
  Plus,
  Trash2,
  Save,
  X,
  Eye,
  Activity,
  Award,
  BookOpen,
  Briefcase,
  GraduationCap,
  Globe,
  MapPin,
  Clock,
  DollarSign,
  User,
  CheckCircle2,
  Stethoscope,
  ChevronLeft,
  AlertCircle
} from 'lucide-react';

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

export default function DoctorProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<DoctorProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPublicMode, setIsPublicMode] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // File Upload Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Editing states for sections
  const [editSection, setEditSection] = useState<string | null>(null);

  // Form states
  const [headerForm, setHeaderForm] = useState({
    name: '',
    designation: '',
    specialization: '',
    experience: 0,
    hospitalName: '',
    opdTimings: '',
    feesPerConsultation: 0,
    department: ''
  });

  const [bioForm, setBioForm] = useState('');
  const [workForm, setWorkForm] = useState<WorkEntry[]>([]);
  const [eduForm, setEduForm] = useState<EduEntry[]>([]);
  const [interestsForm, setInterestsForm] = useState<string[]>([]);
  const [membershipsForm, setMembershipsForm] = useState<string[]>([]);
  const [awardsForm, setAwardsForm] = useState<AwardEntry[]>([]);
  const [pubsForm, setPubsForm] = useState<PubEntry[]>([]);
  const [languagesForm, setLanguagesForm] = useState<string[]>([]);

  // Input states for tags
  const [newInterest, setNewInterest] = useState('');
  const [newMembership, setNewMembership] = useState('');
  const [newLanguage, setNewLanguage] = useState('');

  // Toast helper
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/doctors/me');
      const data = res.data.data || res.data;
      setProfile(data);
    } catch (err) {
      console.error('Failed to load doctor profile:', err);
      showToast('Failed to load profile details', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const saveSection = async (section: string, payload: any) => {
    try {
      const res = await api.put('/doctors/me', payload);
      const updated = res.data.data || res.data;
      setProfile(updated);
      showToast('Profile updated successfully!');
      setEditSection(null);
    } catch (err: any) {
      console.error('Failed to update section:', err);
      showToast(err.response?.data?.message || 'Failed to save profile changes', 'error');
    }
  };

  // Profile Picture Upload Handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64String = reader.result as string;
      await saveSection('profilePicture', { profilePicture: base64String });
    };
    reader.onerror = () => {
      showToast('Error reading image file', 'error');
    };
    reader.readAsDataURL(file);
  };

  // Initialize Section Forms when entering edit mode
  const enterEditMode = (section: string) => {
    if (!profile) return;
    setEditSection(section);

    if (section === 'header') {
      setHeaderForm({
        name: profile.userId?.name || '',
        designation: profile.designation || '',
        specialization: profile.specialization || '',
        experience: profile.experience || 0,
        hospitalName: profile.hospitalName || '',
        opdTimings: profile.opdTimings || '',
        feesPerConsultation: profile.feesPerConsultation || 0,
        department: profile.department || ''
      });
    } else if (section === 'bio') {
      setBioForm(profile.bio || '');
    } else if (section === 'work') {
      setWorkForm(profile.workExperience || []);
    } else if (section === 'edu') {
      setEduForm(profile.education || []);
    } else if (section === 'interests') {
      setInterestsForm(profile.specialityInterests || []);
    } else if (section === 'memberships') {
      setMembershipsForm(profile.memberships || []);
    } else if (section === 'awards') {
      setAwardsForm(profile.awards || []);
    } else if (section === 'pubs') {
      setPubsForm(profile.publications || []);
    } else if (section === 'languages') {
      setLanguagesForm(profile.languages || []);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 dark:text-slate-500">
        <Activity className="animate-spin mx-auto mb-4 text-teal-400" size={36} />
        <p className="text-sm">Loading profile details...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="py-16 text-center text-slate-400">
        <AlertCircle size={40} className="opacity-30 mx-auto mb-3" />
        <p className="text-sm">Doctor profile not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl border transition-all duration-300 transform translate-y-0 bg-slate-900 border-teal-500/20 text-white">
          <CheckCircle2 size={18} className="text-teal-400 shrink-0" />
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
      )}

      {/* Top action bar */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {isPublicMode ? 'Public Profile View' : 'My Doctor Profile'}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isPublicMode
              ? 'This is a read-only preview of your profile page as visible to patients.'
              : 'Keep your professional details, timings, and work history updated.'}
          </p>
        </div>

        <button
          onClick={() => setIsPublicMode(!isPublicMode)}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition border ${
            isPublicMode
              ? 'bg-teal-600 hover:bg-teal-700 text-white border-transparent'
              : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
          }`}
        >
          {isPublicMode ? (
            <>
              <ChevronLeft size={16} /> Back to Edit Mode
            </>
          ) : (
            <>
              <Eye size={16} /> View Public Profile
            </>
          )}
        </button>
      </div>

      {/* TOP HEADER CARD */}
      <div className="relative bg-white dark:bg-[#161b27] border border-slate-200 dark:border-white/10 rounded-2xl p-6 md:p-8 shadow-xl overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 dark:bg-teal-500/5 rounded-full blur-3xl pointer-events-none"></div>

        {editSection === 'header' ? (
          /* Header Editing Mode */
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Edit Header Details</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditSection(null)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => saveSection('header', headerForm)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-600 hover:bg-teal-700 text-white transition"
                >
                  <Save size={12} /> Save
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                  value={headerForm.name}
                  onChange={(e) => setHeaderForm({ ...headerForm, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Designation</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                  placeholder="e.g. Principal Director - Gastroenterology"
                  value={headerForm.designation}
                  onChange={(e) => setHeaderForm({ ...headerForm, designation: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Speciality</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                  value={headerForm.specialization}
                  onChange={(e) => setHeaderForm({ ...headerForm, specialization: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Department</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                    value={headerForm.department}
                    onChange={(e) => setHeaderForm({ ...headerForm, department: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Experience (yrs)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                    value={headerForm.experience}
                    onChange={(e) => setHeaderForm({ ...headerForm, experience: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Hospital/Clinic Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                  placeholder="e.g. Max Healthcare, Delhi"
                  value={headerForm.hospitalName}
                  onChange={(e) => setHeaderForm({ ...headerForm, hospitalName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Fees (Rs.)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                    value={headerForm.feesPerConsultation}
                    onChange={(e) => setHeaderForm({ ...headerForm, feesPerConsultation: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">OPD Timings</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                    placeholder="e.g. Mon-Sat: 10:00 AM - 04:00 PM"
                    value={headerForm.opdTimings}
                    onChange={(e) => setHeaderForm({ ...headerForm, opdTimings: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Header Display Mode */
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Profile Picture Overlay */}
            <div className="relative group shrink-0">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/png, image/jpeg"
                onChange={handleImageChange}
              />
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-teal-500/30 bg-slate-100 dark:bg-slate-900 flex items-center justify-center shadow-lg relative">
                {profile.profilePicture ? (
                  <img
                    src={profile.profilePicture}
                    alt={profile.userId?.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={48} className="text-slate-400 dark:text-slate-600" />
                )}
              </div>
              {!isPublicMode && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2 bg-teal-600 hover:bg-teal-700 text-white rounded-full shadow-lg border border-teal-400/30 transition-transform active:scale-95 flex items-center justify-center cursor-pointer"
                  title="Upload profile picture"
                >
                  <Pencil size={14} />
                </button>
              )}
            </div>

            {/* Profile Info Details */}
            <div className="flex-1 text-center md:text-left space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                    Dr. {profile.userId?.name || 'Unknown'}
                  </h2>
                  <p className="text-teal-600 dark:text-teal-400 font-medium text-sm md:text-base mt-0.5">
                    {profile.designation || 'Specialist'}
                  </p>
                </div>
                {!isPublicMode && (
                  <button
                    onClick={() => enterEditMode('header')}
                    className="self-center md:self-start flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 border border-slate-200 dark:border-white/10 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition"
                  >
                    <Pencil size={12} /> Edit Details
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 pt-2 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <Stethoscope size={16} className="text-teal-500 shrink-0" />
                  <span>
                    Speciality: <strong className="text-slate-800 dark:text-slate-300 font-medium">{profile.specialization}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <Briefcase size={16} className="text-teal-500 shrink-0" />
                  <span>
                    Experience: <strong className="text-slate-800 dark:text-slate-300 font-medium">{profile.experience} years</strong>
                  </span>
                </div>
                {profile.hospitalName && (
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <MapPin size={16} className="text-teal-500 shrink-0" />
                    <span>
                      Hospital: <strong className="text-slate-800 dark:text-slate-300 font-medium">{profile.hospitalName}</strong>
                    </span>
                  </div>
                )}
                {profile.opdTimings && (
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <Clock size={16} className="text-teal-500 shrink-0" />
                    <span>
                      OPD Timings: <strong className="text-slate-800 dark:text-slate-300 font-medium">{profile.opdTimings}</strong>
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <DollarSign size={16} className="text-teal-500 shrink-0" />
                  <span>
                    Consultation Fee: <strong className="text-slate-800 dark:text-slate-300 font-medium">Rs. {profile.feesPerConsultation}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <Activity size={16} className="text-teal-500 shrink-0" />
                  <span>
                    Department: <strong className="text-slate-800 dark:text-slate-300 font-medium">{profile.department}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT PROFILE PANELS (About, Interests, Languages) */}
        <div className="lg:col-span-2 space-y-6">
          {/* ABOUT / BIO */}
          <div className="bg-white dark:bg-[#161b27] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
              <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <User size={18} className="text-teal-500" /> About / Bio
              </h3>
              {!isPublicMode && editSection !== 'bio' && (
                <button
                  onClick={() => enterEditMode('bio')}
                  className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-teal-400 transition"
                >
                  <Pencil size={12} /> Edit
                </button>
              )}
            </div>

            {editSection === 'bio' ? (
              <div className="space-y-3">
                <textarea
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/40 resize-none"
                  rows={5}
                  placeholder="Tell patients about your background, clinical philosophy, and special interests..."
                  value={bioForm}
                  onChange={(e) => setBioForm(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditSection(null)}
                    className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => saveSection('bio', { bio: bioForm })}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-600 hover:bg-teal-700 text-white transition"
                  >
                    <Save size={12} /> Save
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                {profile.bio || 'No bio introduction added yet.'}
              </p>
            )}
          </div>

          {/* WORK EXPERIENCE */}
          <div className="bg-white dark:bg-[#161b27] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
              <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase size={18} className="text-teal-500" /> Work Experience
              </h3>
              {!isPublicMode && editSection !== 'work' && (
                <button
                  onClick={() => enterEditMode('work')}
                  className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-teal-400 transition"
                >
                  <Pencil size={12} /> Edit
                </button>
              )}
            </div>

            {editSection === 'work' ? (
              <div className="space-y-4">
                {workForm.map((entry, index) => (
                  <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-900 rounded-lg relative">
                    <button
                      onClick={() => setWorkForm(workForm.filter((_, idx) => idx !== index))}
                      className="absolute -top-1.5 -right-1.5 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X size={10} />
                    </button>
                    <input
                      type="text"
                      className="px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-white focus:outline-none"
                      placeholder="Role (e.g. Senior Resident)"
                      value={entry.role}
                      onChange={(e) => {
                        const next = [...workForm];
                        next[index].role = e.target.value;
                        setWorkForm(next);
                      }}
                    />
                    <input
                      type="text"
                      className="px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-white focus:outline-none"
                      placeholder="Organization"
                      value={entry.organization}
                      onChange={(e) => {
                        const next = [...workForm];
                        next[index].organization = e.target.value;
                        setWorkForm(next);
                      }}
                    />
                    <input
                      type="text"
                      className="px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-white focus:outline-none"
                      placeholder="Duration (e.g. 2018 - 2022)"
                      value={entry.duration}
                      onChange={(e) => {
                        const next = [...workForm];
                        next[index].duration = e.target.value;
                        setWorkForm(next);
                      }}
                    />
                  </div>
                ))}
                <button
                  onClick={() => setWorkForm([...workForm, { role: '', organization: '', duration: '' }])}
                  className="flex items-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
                >
                  <Plus size={14} /> Add Entry
                </button>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setEditSection(null)}
                    className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => saveSection('workExperience', { workExperience: workForm })}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-600 hover:bg-teal-700 text-white transition"
                  >
                    <Save size={12} /> Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {!profile.workExperience || profile.workExperience.length === 0 ? (
                  <p className="text-sm text-slate-500">No work experience entries listed yet.</p>
                ) : (
                  profile.workExperience.map((entry, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className="w-2.5 h-2.5 rounded-full bg-teal-500/50 mt-1.5 shrink-0" />
                      <div className="space-y-0.5">
                        <p className="font-semibold text-slate-900 dark:text-white text-sm">{entry.role}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{entry.organization} &middot; {entry.duration}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* EDUCATION & TRAINING */}
          <div className="bg-white dark:bg-[#161b27] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
              <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <GraduationCap size={18} className="text-teal-500" /> Education & Training
              </h3>
              {!isPublicMode && editSection !== 'edu' && (
                <button
                  onClick={() => enterEditMode('edu')}
                  className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-teal-400 transition"
                >
                  <Pencil size={12} /> Edit
                </button>
              )}
            </div>

            {editSection === 'edu' ? (
              <div className="space-y-4">
                {eduForm.map((entry, index) => (
                  <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-900 rounded-lg relative">
                    <button
                      onClick={() => setEduForm(eduForm.filter((_, idx) => idx !== index))}
                      className="absolute -top-1.5 -right-1.5 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X size={10} />
                    </button>
                    <input
                      type="text"
                      className="px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-white focus:outline-none"
                      placeholder="Degree / Fellowship"
                      value={entry.degree}
                      onChange={(e) => {
                        const next = [...eduForm];
                        next[index].degree = e.target.value;
                        setEduForm(next);
                      }}
                    />
                    <input
                      type="text"
                      className="px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-white focus:outline-none"
                      placeholder="Institution"
                      value={entry.institution}
                      onChange={(e) => {
                        const next = [...eduForm];
                        next[index].institution = e.target.value;
                        setEduForm(next);
                      }}
                    />
                    <input
                      type="text"
                      className="px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-white focus:outline-none"
                      placeholder="Year"
                      value={entry.year}
                      onChange={(e) => {
                        const next = [...eduForm];
                        next[index].year = e.target.value;
                        setEduForm(next);
                      }}
                    />
                  </div>
                ))}
                <button
                  onClick={() => setEduForm([...eduForm, { degree: '', institution: '', year: '' }])}
                  className="flex items-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
                >
                  <Plus size={14} /> Add Entry
                </button>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setEditSection(null)}
                    className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => saveSection('education', { education: eduForm })}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-600 hover:bg-teal-700 text-white transition"
                  >
                    <Save size={12} /> Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {!profile.education || profile.education.length === 0 ? (
                  <p className="text-sm text-slate-500">No education background listed yet.</p>
                ) : (
                  profile.education.map((entry, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className="w-2.5 h-2.5 rounded-full bg-teal-500/50 mt-1.5 shrink-0" />
                      <div className="space-y-0.5">
                        <p className="font-semibold text-slate-900 dark:text-white text-sm">{entry.degree}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{entry.institution} &middot; {entry.year}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE PANELS (Interests, Memberships, Awards, Publications, Languages) */}
        <div className="space-y-6">
          {/* SPECIALITY INTERESTS */}
          <div className="bg-white dark:bg-[#161b27] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
              <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Stethoscope size={18} className="text-teal-500" /> Speciality Interests
              </h3>
              {!isPublicMode && editSection !== 'interests' && (
                <button
                  onClick={() => enterEditMode('interests')}
                  className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-teal-400 transition"
                >
                  <Pencil size={12} /> Edit
                </button>
              )}
            </div>

            {editSection === 'interests' ? (
              <div className="space-y-3">
                <div className="flex gap-1.5 flex-wrap">
                  {interestsForm.map((interest, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-full">
                      {interest}
                      <button
                        onClick={() => setInterestsForm(interestsForm.filter((_, i) => i !== idx))}
                        className="text-slate-400 hover:text-red-400"
                      >
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg text-slate-900 dark:text-white focus:outline-none"
                    placeholder="Type interest & press add"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newInterest.trim()) {
                          setInterestsForm([...interestsForm, newInterest.trim()]);
                          setNewInterest('');
                        }
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      if (newInterest.trim()) {
                        setInterestsForm([...interestsForm, newInterest.trim()]);
                        setNewInterest('');
                      }
                    }}
                    className="px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10"
                  >
                    Add
                  </button>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setEditSection(null)}
                    className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => saveSection('specialityInterests', { specialityInterests: interestsForm })}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-600 hover:bg-teal-700 text-white transition"
                  >
                    <Save size={12} /> Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-1.5 flex-wrap">
                {!profile.specialityInterests || profile.specialityInterests.length === 0 ? (
                  <p className="text-sm text-slate-500">No speciality interests listed yet.</p>
                ) : (
                  profile.specialityInterests.map((interest, idx) => (
                    <span key={idx} className="px-2.5 py-1 text-xs font-medium bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 rounded-full border border-teal-500/10 dark:border-teal-500/5">
                      {interest}
                    </span>
                  ))
                )}
              </div>
            )}
          </div>

          {/* LANGUAGES SPOKEN */}
          <div className="bg-white dark:bg-[#161b27] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
              <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Globe size={18} className="text-teal-500" /> Languages Spoken
              </h3>
              {!isPublicMode && editSection !== 'languages' && (
                <button
                  onClick={() => enterEditMode('languages')}
                  className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-teal-400 transition"
                >
                  <Pencil size={12} /> Edit
                </button>
              )}
            </div>

            {editSection === 'languages' ? (
              <div className="space-y-3">
                <div className="flex gap-1.5 flex-wrap">
                  {languagesForm.map((lang, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-full">
                      {lang}
                      <button
                        onClick={() => setLanguagesForm(languagesForm.filter((_, i) => i !== idx))}
                        className="text-slate-400 hover:text-red-400"
                      >
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg text-slate-900 dark:text-white focus:outline-none"
                    placeholder="Type language & press add"
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newLanguage.trim()) {
                          setLanguagesForm([...languagesForm, newLanguage.trim()]);
                          setNewLanguage('');
                        }
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      if (newLanguage.trim()) {
                        setLanguagesForm([...languagesForm, newLanguage.trim()]);
                        setNewLanguage('');
                      }
                    }}
                    className="px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10"
                  >
                    Add
                  </button>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setEditSection(null)}
                    className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => saveSection('languages', { languages: languagesForm })}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-600 hover:bg-teal-700 text-white transition"
                  >
                    <Save size={12} /> Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-1.5 flex-wrap">
                {!profile.languages || profile.languages.length === 0 ? (
                  <p className="text-sm text-slate-500">No languages listed.</p>
                ) : (
                  profile.languages.map((lang, idx) => (
                    <span key={idx} className="px-2.5 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5 rounded-lg">
                      {lang}
                    </span>
                  ))
                )}
              </div>
            )}
          </div>

          {/* MEMBERSHIPS */}
          <div className="bg-white dark:bg-[#161b27] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
              <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity size={18} className="text-teal-500" /> Memberships
              </h3>
              {!isPublicMode && editSection !== 'memberships' && (
                <button
                  onClick={() => enterEditMode('memberships')}
                  className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-teal-400 transition"
                >
                  <Pencil size={12} /> Edit
                </button>
              )}
            </div>

            {editSection === 'memberships' ? (
              <div className="space-y-3">
                <div className="flex gap-1.5 flex-wrap">
                  {membershipsForm.map((mem, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-full">
                      {mem}
                      <button
                        onClick={() => setMembershipsForm(membershipsForm.filter((_, i) => i !== idx))}
                        className="text-slate-400 hover:text-red-400"
                      >
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg text-slate-900 dark:text-white focus:outline-none"
                    placeholder="Type membership details & press add"
                    value={newMembership}
                    onChange={(e) => setNewMembership(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newMembership.trim()) {
                          setMembershipsForm([...membershipsForm, newMembership.trim()]);
                          setNewMembership('');
                        }
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      if (newMembership.trim()) {
                        setMembershipsForm([...membershipsForm, newMembership.trim()]);
                        setNewMembership('');
                      }
                    }}
                    className="px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10"
                  >
                    Add
                  </button>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setEditSection(null)}
                    className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => saveSection('memberships', { memberships: membershipsForm })}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-600 hover:bg-teal-700 text-white transition"
                  >
                    <Save size={12} /> Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {!profile.memberships || profile.memberships.length === 0 ? (
                  <p className="text-sm text-slate-500">No professional memberships added yet.</p>
                ) : (
                  profile.memberships.map((mem, idx) => (
                    <div key={idx} className="flex gap-2.5 items-start">
                      <span className="text-teal-400 select-none">&bull;</span>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{mem}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* AWARDS & RECOGNITIONS */}
          <div className="bg-white dark:bg-[#161b27] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
              <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Award size={18} className="text-teal-500" /> Awards & Recognitions
              </h3>
              {!isPublicMode && editSection !== 'awards' && (
                <button
                  onClick={() => enterEditMode('awards')}
                  className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-teal-400 transition"
                >
                  <Pencil size={12} /> Edit
                </button>
              )}
            </div>

            {editSection === 'awards' ? (
              <div className="space-y-4">
                {awardsForm.map((award, index) => (
                  <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-900 rounded-lg relative">
                    <button
                      onClick={() => setAwardsForm(awardsForm.filter((_, idx) => idx !== index))}
                      className="absolute -top-1.5 -right-1.5 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X size={10} />
                    </button>
                    <input
                      type="text"
                      className="px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-white focus:outline-none"
                      placeholder="Award Name"
                      value={award.name}
                      onChange={(e) => {
                        const next = [...awardsForm];
                        next[index].name = e.target.value;
                        setAwardsForm(next);
                      }}
                    />
                    <input
                      type="text"
                      className="px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-white focus:outline-none"
                      placeholder="Year"
                      value={award.year}
                      onChange={(e) => {
                        const next = [...awardsForm];
                        next[index].year = e.target.value;
                        setAwardsForm(next);
                      }}
                    />
                  </div>
                ))}
                <button
                  onClick={() => setAwardsForm([...awardsForm, { name: '', year: '' }])}
                  className="flex items-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
                >
                  <Plus size={14} /> Add Award
                </button>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setEditSection(null)}
                    className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => saveSection('awards', { awards: awardsForm })}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-600 hover:bg-teal-700 text-white transition"
                  >
                    <Save size={12} /> Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {!profile.awards || profile.awards.length === 0 ? (
                  <p className="text-sm text-slate-500">No awards listed.</p>
                ) : (
                  profile.awards.map((award, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <Award size={16} className="text-amber-500 mt-0.5 shrink-0" />
                      <div className="space-y-0.5">
                        <p className="font-semibold text-slate-900 dark:text-white text-sm">{award.name}</p>
                        <p className="text-xs text-slate-500">{award.year}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* RESEARCH PAPERS & PUBLICATIONS */}
          <div className="bg-white dark:bg-[#161b27] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
              <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen size={18} className="text-teal-500" /> Research & Publications
              </h3>
              {!isPublicMode && editSection !== 'pubs' && (
                <button
                  onClick={() => enterEditMode('pubs')}
                  className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-teal-400 transition"
                >
                  <Pencil size={12} /> Edit
                </button>
              )}
            </div>

            {editSection === 'pubs' ? (
              <div className="space-y-4">
                {pubsForm.map((pub, index) => (
                  <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-900 rounded-lg relative">
                    <button
                      onClick={() => setPubsForm(pubsForm.filter((_, idx) => idx !== index))}
                      className="absolute -top-1.5 -right-1.5 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X size={10} />
                    </button>
                    <input
                      type="text"
                      className="px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-white focus:outline-none"
                      placeholder="Publication Title"
                      value={pub.title}
                      onChange={(e) => {
                        const next = [...pubsForm];
                        next[index].title = e.target.value;
                        setPubsForm(next);
                      }}
                    />
                    <input
                      type="text"
                      className="px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-white focus:outline-none"
                      placeholder="Journal Name"
                      value={pub.journalName}
                      onChange={(e) => {
                        const next = [...pubsForm];
                        next[index].journalName = e.target.value;
                        setPubsForm(next);
                      }}
                    />
                  </div>
                ))}
                <button
                  onClick={() => setPubsForm([...pubsForm, { title: '', journalName: '' }])}
                  className="flex items-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
                >
                  <Plus size={14} /> Add Publication
                </button>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setEditSection(null)}
                    className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => saveSection('publications', { publications: pubsForm })}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-600 hover:bg-teal-700 text-white transition"
                  >
                    <Save size={12} /> Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {!profile.publications || profile.publications.length === 0 ? (
                  <p className="text-sm text-slate-500">No research papers or publications listed yet.</p>
                ) : (
                  profile.publications.map((pub, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <BookOpen size={16} className="text-teal-500 mt-0.5 shrink-0" />
                      <div className="space-y-0.5">
                        <p className="font-semibold text-slate-900 dark:text-white text-sm leading-snug">"{pub.title}"</p>
                        <p className="text-xs text-slate-500">{pub.journalName}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
