'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/PasswordInput';
import Link from 'next/link';
import { Loader2, Heart } from 'lucide-react';
import { NoiseBackground } from '@/components/ui/noise-background';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
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
              <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
              <p className="text-neutral-400">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-400 bg-red-500/10 rounded-lg border border-red-500/20">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">Email</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">Password</label>
                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-emerald-500"
                />
              </div>

              <Button
                className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-medium py-2.5"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-neutral-400">
              Don't have an account?{' '}
              <Link href="/signup" className="text-emerald-400 hover:text-emerald-300 font-medium">
                Sign up
              </Link>
            </div>
          </div>
        </NoiseBackground>
      </div>
    </div>
  );
}
