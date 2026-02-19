'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/PasswordInput';
import Link from 'next/link';
import { Loader2, Heart } from 'lucide-react';
import { NoiseBackground } from '@/components/ui/noise-background';

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
    // Patient specific
    age: '',
    gender: 'Male',
    address: '',
    phone: '',
    bloodGroup: '',
    // Doctor specific
    specialization: '',
    experience: '',
    feesPerConsultation: '',
    department: '',
    bio: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setError('');

    // Admin doesn't need profile details
    if (formData.role === 'admin') {
      handleAdminSubmit();
    } else {
      setStep(2);
    }
  };

  const handleAdminSubmit = async () => {
    setIsLoading(true);
    setError('');
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'admin'
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const submissionData = {
        ...formData,
        age: Number(formData.age) || 0,
        experience: Number(formData.experience) || 0,
        feesPerConsultation: Number(formData.feesPerConsultation) || 0
      };
      await register(submissionData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClassName = "bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-emerald-500 focus:ring-emerald-500/20";
  const selectClassName = "flex h-10 w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500";
  const labelClassName = "text-sm font-medium text-neutral-300";

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4 py-12">
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl flex items-center justify-center">
            <Heart size={24} className="text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            HealthSync
          </span>
        </div>

        <NoiseBackground
          containerClassName="w-full"
          gradientColors={["rgb(16, 185, 129)", "rgb(6, 182, 212)", "rgb(59, 130, 246)"]}
        >
          <div className="p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
              <p className="text-neutral-400">Join HealthSync today</p>
              {step === 2 && (
                <div className="flex items-center justify-center gap-2 mt-2">
                  <div className="w-8 h-1 rounded-full bg-emerald-500"></div>
                  <div className="w-8 h-1 rounded-full bg-emerald-500"></div>
                </div>
              )}
              {step === 1 && (
                <div className="flex items-center justify-center gap-2 mt-2">
                  <div className="w-8 h-1 rounded-full bg-emerald-500"></div>
                  <div className="w-8 h-1 rounded-full bg-neutral-700"></div>
                </div>
              )}
            </div>

            {error && (
              <div className="mb-4 p-3 text-sm text-red-400 bg-red-500/10 rounded-lg border border-red-500/20">
                {error}
              </div>
            )}

            <form onSubmit={step === 1 ? handleNext : handleSubmit} className="space-y-4">

              {step === 1 && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-2">
                      <label className={labelClassName}>Role</label>
                      <select
                        name="role"
                        className={selectClassName}
                        value={formData.role}
                        onChange={handleChange}
                      >
                        <option value="patient">Patient</option>
                        <option value="doctor">Doctor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div className="space-y-2 col-span-2">
                      <label className={labelClassName}>Full Name</label>
                      <Input name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" className={inputClassName} />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <label className={labelClassName}>Email</label>
                      <Input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" className={inputClassName} />
                    </div>
                    <div className="space-y-2">
                      <label className={labelClassName}>Password</label>
                      <PasswordInput name="password" value={formData.password} onChange={handleChange} required className={inputClassName} />
                    </div>
                    <div className="space-y-2">
                      <label className={labelClassName}>Confirm Password</label>
                      <PasswordInput name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className={inputClassName} />
                    </div>
                  </div>
                  <Button type="submit" className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600" disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin mr-2" /> : formData.role === 'admin' ? 'Create Admin Account' : 'Next: Profile Details'}
                  </Button>
                </>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  {formData.role === 'patient' ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className={labelClassName}>Age</label>
                        <Input type="number" name="age" value={formData.age} onChange={handleChange} required className={inputClassName} />
                      </div>
                      <div className="space-y-2">
                        <label className={labelClassName}>Gender</label>
                        <select name="gender" className={selectClassName} value={formData.gender} onChange={handleChange}>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="space-y-2 col-span-2">
                        <label className={labelClassName}>Phone</label>
                        <Input name="phone" value={formData.phone} onChange={handleChange} required className={inputClassName} />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <label className={labelClassName}>Address</label>
                        <Input name="address" value={formData.address} onChange={handleChange} required className={inputClassName} />
                      </div>
                      <div className="space-y-2">
                        <label className={labelClassName}>Blood Group</label>
                        <Input name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} placeholder="O+" className={inputClassName} />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 col-span-2">
                        <label className={labelClassName}>Specialization</label>
                        <Input name="specialization" value={formData.specialization} onChange={handleChange} required placeholder="Cardiology" className={inputClassName} />
                      </div>
                      <div className="space-y-2">
                        <label className={labelClassName}>Experience (Years)</label>
                        <Input type="number" name="experience" value={formData.experience} onChange={handleChange} required className={inputClassName} />
                      </div>
                      <div className="space-y-2">
                        <label className={labelClassName}>Fees ($)</label>
                        <Input type="number" name="feesPerConsultation" value={formData.feesPerConsultation} onChange={handleChange} required className={inputClassName} />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <label className={labelClassName}>Department</label>
                        <Input name="department" value={formData.department} onChange={handleChange} required className={inputClassName} />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <label className={labelClassName}>Phone</label>
                        <Input name="phone" value={formData.phone} onChange={handleChange} required className={inputClassName} />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 mt-6">
                    <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1 border-neutral-700 text-neutral-300 hover:bg-neutral-800">
                      Back
                    </Button>
                    <Button type="submit" disabled={isLoading} className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600">
                      {isLoading ? <Loader2 className="animate-spin mr-2" /> : 'Create Account'}
                    </Button>
                  </div>
                </div>
              )}
            </form>

            <div className="mt-6 text-center text-sm text-neutral-400">
              Already have an account?{' '}
              <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium">
                Sign in
              </Link>
            </div>
          </div>
        </NoiseBackground>
      </div>
    </div>
  );
}
