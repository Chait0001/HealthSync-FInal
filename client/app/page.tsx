'use client';
import { ThemeContext, useTheme } from '@/context/ThemeContext';
import { useState, useEffect, useRef, useContext } from 'react';
import Link from 'next/link';
import { CardSpotlight } from '@/components/ui/card-spotlight';
import {
  ChevronDown,
  Calendar,
  Users,
  FileText,
  Shield,
  Stethoscope,
  Heart,
  Activity,
  BarChart3,
  MessageSquare,
  Star,
  ArrowRight,
  Check,
  Play,
  Zap,
  Clock,
  Lock,
  Globe,
  Smartphone,
  HeadphonesIcon,
  Building2,
  UserCheck,
  Pill,
  ClipboardList,
  Twitter,
  Linkedin,
  Facebook
} from 'lucide-react';
import { ModeToggle } from '@/components/ModeToggle';
import AnimatedSection from '@/components/shared/AnimatedSection';
import { motion, AnimatePresence } from 'framer-motion';
import { CORE_FEATURES, ADVANCED_FEATURES, SPECIALTIES, TESTIMONIALS, MAIN_FEATURES } from '@/constants/landing';

// Custom hook for scroll animations
function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

// Animated counter hook
function useCountAnimation(target: number, duration: number = 2000, startCounting: boolean = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startCounting) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, startCounting]);

  return count;
}


// Dropdown Menu Component
function DropdownMenu({
  label,
  isOpen,
  onToggle,
  children
}: {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode
}) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors py-2 cursor-pointer"
      >
        {label}
        <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl p-6 min-w-[500px] z-50 animate-fadeIn text-neutral-900 dark:text-white">
          {children}
        </div>
      )}
    </div>
  );
}

// Testimonials Carousel
type Testimonial = { name: string; role: string; initials: string; content: string; rating: number };
function TestimonialsCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [current, setCurrent] = useState(0);
  const [direction, setCarouselDirection] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselDirection(1);
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const go = (idx: number) => {
    setCarouselDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  };

  const t = testimonials[current];

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-2xl bg-[#0d1117] border border-white/5 p-8 md:p-12 min-h-[260px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            initial={{ opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -60 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="flex items-center gap-1 mb-6">
              {[...Array(t.rating)].map((_, j) => (
                <Star key={j} size={18} className="fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-neutral-200 text-xl leading-relaxed mb-8">"{t.content}"</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center font-bold text-sm text-white">
                {t.initials}
              </div>
              <div>
                <div className="font-semibold text-white">{t.name}</div>
                <div className="text-sm text-neutral-400">{t.role}</div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => go((current - 1 + testimonials.length) % testimonials.length)}
          className="w-10 h-10 rounded-full border border-white/10 hover:border-emerald-500/50 flex items-center justify-center text-neutral-400 hover:text-white transition-all"
        >
          &#8592;
        </button>
        <div className="flex items-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${i === current ? 'bg-emerald-400 w-6' : 'bg-neutral-600 hover:bg-neutral-400'}`}
            />
          ))}
        </div>
        <button
          onClick={() => go((current + 1) % testimonials.length)}
          className="w-10 h-10 rounded-full border border-white/10 hover:border-emerald-500/50 flex items-center justify-center text-neutral-400 hover:text-white transition-all"
        >
          &#8594;
        </button>
      </div>
    </div>
  );
}

// Hero Dashboard Stats with animated counters
function HeroDashboardStats() {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const patients = useCountAnimation(24, 1500, started);
  const pending = useCountAnimation(5, 1000, started);
  const revenue = useCountAnimation(2450, 2000, started);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const stats = [
    { label: 'Patients Today', value: patients, prefix: '', color: 'bg-emerald-500/20 text-emerald-400' },
    { label: 'Pending', value: pending, prefix: '', color: 'bg-yellow-500/20 text-yellow-400' },
    { label: 'Revenue', value: revenue, prefix: '$', color: 'bg-cyan-500/20 text-cyan-400' },
  ];

  return (
    <div ref={ref} className="grid grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className={`${stat.color} rounded-lg p-4`}>
          <div className="text-2xl font-bold">{stat.prefix}{stat.value.toLocaleString()}</div>
          <div className="text-sm opacity-80">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

// Stats Section Component
function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const professionals = useCountAnimation(40000, 2000, started);
  const satisfaction = useCountAnimation(98, 1500, started);
  const hospitals = useCountAnimation(500, 1800, started);
  const uptime = useCountAnimation(99, 1200, started);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const stats = [
    { value: professionals, suffix: '+', label: 'Healthcare Professionals', sublabel: 'Trust HealthSync worldwide' },
    { value: satisfaction, suffix: '%', label: 'Patient Satisfaction', sublabel: 'Average rating from clinics' },
    { value: hospitals, suffix: '+', label: 'Hospitals Connected', sublabel: 'Across 40+ countries' },
    { value: uptime, suffix: '%', label: 'Uptime Guarantee', sublabel: 'Enterprise-grade reliability' },
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <AnimatedSection key={i} delay={i * 0.1} direction="up">
              <div className="bg-[#0d1117] border border-white/5 rounded-2xl p-8 text-center hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300">
                <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  {stat.value.toLocaleString()}{stat.suffix}
                </div>
                <div className="text-white font-semibold mb-1">{stat.label}</div>
                <div className="text-neutral-500 text-sm">{stat.sublabel}</div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenDropdown(null);
    if (openDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openDropdown]);

  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: featuresRef, isVisible: featuresVisible } = useScrollAnimation();

  const { ref: testimonialsRef, isVisible: testimonialsVisible } = useScrollAnimation();


  return (
    <div className="min-h-screen bg-white dark:bg-[#080c14] text-neutral-900 dark:text-white transition-colors duration-300">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'backdrop-blur-md bg-[#080c14]/90 border-b border-white/5 shadow-lg' : 'bg-transparent'
        }`}>

        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl flex items-center justify-center">
                <Heart size={24} className="text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                HealthSync
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center gap-8" onClick={(e) => e.stopPropagation()}>
              {/* Features Dropdown */}
              <DropdownMenu
                label="Features"
                isOpen={openDropdown === 'features'}
                onToggle={() => setOpenDropdown(openDropdown === 'features' ? null : 'features')}
              >
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-emerald-400 font-semibold text-sm uppercase tracking-wider mb-4 border-b border-emerald-400/30 pb-2">
                      Core Features
                    </h4>
                    <div className="space-y-3">
                      {CORE_FEATURES.map((feature) => (
                        <a key={feature.label} href="#" className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-white transition-colors group">
                          <feature.icon size={18} className="text-emerald-500 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                          <span>{feature.label}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-cyan-400 font-semibold text-sm uppercase tracking-wider mb-4 border-b border-cyan-400/30 pb-2">
                      Advanced Features
                    </h4>
                    <div className="space-y-3">
                      {ADVANCED_FEATURES.map((feature) => (
                        <a key={feature.label} href="#" className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400 hover:text-cyan-600 dark:hover:text-white transition-colors group">
                          <feature.icon size={18} className="text-cyan-500 dark:text-cyan-400 group-hover:scale-110 transition-transform" />
                          <span>{feature.label}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </DropdownMenu>

              {/* Solutions Dropdown */}
              <DropdownMenu
                label="Solutions"
                isOpen={openDropdown === 'solutions'}
                onToggle={() => setOpenDropdown(openDropdown === 'solutions' ? null : 'solutions')}
              >
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-emerald-400 font-semibold text-sm uppercase tracking-wider mb-4 border-b border-emerald-400/30 pb-2">
                      By Specialty
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {SPECIALTIES.map((specialty) => (
                        <a key={specialty} href="#" className="text-neutral-400 hover:text-white transition-colors py-1">
                          {specialty}
                        </a>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-cyan-500 dark:text-cyan-400 font-semibold text-sm uppercase tracking-wider mb-4 border-b border-cyan-500/30 dark:border-cyan-400/30 pb-2">
                      By Practice Size
                    </h4>
                    <div className="space-y-3">
                      <a href="#" className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400 hover:text-cyan-600 dark:hover:text-white transition-colors">
                        <Stethoscope size={18} className="text-cyan-500 dark:text-cyan-400" />
                        Solo Practice
                      </a>
                      <a href="#" className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400 hover:text-cyan-600 dark:hover:text-white transition-colors">
                        <Users size={18} className="text-cyan-500 dark:text-cyan-400" />
                        Multi-Doctor Clinic
                      </a>
                      <a href="#" className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400 hover:text-cyan-600 dark:hover:text-white transition-colors">
                        <Building2 size={18} className="text-cyan-500 dark:text-cyan-400" />
                        Hospital
                      </a>
                    </div>
                  </div>
                </div>
              </DropdownMenu>

              {/* Resources Dropdown */}
              <DropdownMenu
                label="Resources"
                isOpen={openDropdown === 'resources'}
                onToggle={() => setOpenDropdown(openDropdown === 'resources' ? null : 'resources')}
              >
                <div className="space-y-3 min-w-[200px]">
                  <h4 className="text-emerald-400 font-semibold text-sm uppercase tracking-wider mb-4 border-b border-emerald-400/30 pb-2">
                    Resources
                  </h4>
                  <a href="#" className="block text-neutral-400 hover:text-white transition-colors py-1">Documentation</a>
                  <a href="#" className="block text-neutral-400 hover:text-white transition-colors py-1">API Reference</a>
                  <a href="#" className="block text-neutral-400 hover:text-white transition-colors py-1">Blog</a>
                  <a href="#" className="block text-neutral-400 hover:text-white transition-colors py-1">Support</a>
                  <a href="#" className="block text-neutral-400 hover:text-white transition-colors py-1">FAQ</a>
                </div>
              </DropdownMenu>

              <a href="#pricing" className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">Pricing</a>
              <a href="#contact" className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">Contact</a>
            </nav>

            {/* CTA Buttons */}
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="hidden md:block px-5 py-2.5 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-5 py-2.5 bg-[#080c14] dark:bg-gradient-to-r dark:from-emerald-500 dark:to-cyan-500 hover:bg-neutral-800 dark:hover:from-emerald-600 dark:hover:to-cyan-600 text-white rounded-lg font-medium transition-all hover:shadow-lg dark:hover:shadow-emerald-500/25"
              >
                Get Started Free
              </Link>
              <ModeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Gradient Mesh Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute top-1/2 -right-60 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
          <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-blue-500/8 rounded-full blur-[80px] animate-pulse delay-500"></div>
        </div>

        <div
          ref={heroRef}
          className={`max-w-7xl mx-auto relative z-10 transition-all duration-1000 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Simplify Your Practice with{' '}
                <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Powerful Healthcare Software
                </span>
              </h1>

              <p className="text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed">
                All-in-one platform for doctors, clinics, and hospitals to manage appointments,
                medical records, billing, and patient communication — all from one dashboard.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#080c14] dark:bg-gradient-to-r dark:from-emerald-500 dark:to-cyan-500 hover:bg-neutral-800 dark:hover:from-emerald-600 dark:hover:to-cyan-600 text-white rounded-xl font-semibold text-lg transition-all hover:shadow-xl dark:hover:shadow-emerald-500/25 hover:-translate-y-0.5"
                >
                  <Zap size={20} />
                  Start Free Trial
                </Link>
                <button className="inline-flex items-center gap-2 px-8 py-4 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 rounded-xl font-semibold text-lg transition-all hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-900 dark:text-white">
                  <Play size={20} className="text-emerald-500 dark:text-emerald-400" />
                  Watch Demo
                </button>
              </div>
            </div>

            {/* Right Content - Dashboard Preview with float animation */}
            <div className="relative animate-float">
              <div className="bg-neutral-900 rounded-2xl border border-neutral-800 shadow-2xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 bg-white/50 dark:bg-[#080c14]/50 border-b border-neutral-200 dark:border-neutral-800">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="ml-4 text-neutral-500 text-sm">HealthSync Dashboard</span>
                </div>
                <div className="p-6 space-y-4 bg-white dark:bg-neutral-900">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-neutral-900 dark:text-white">Good Morning, Dr. Smith!</h3>
                    <span className="text-neutral-500 text-sm">Today: 8 Appointments</span>
                  </div>
                  <HeroDashboardStats />
                  <div className="bg-neutral-100 dark:bg-[#080c14]/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-neutral-900 dark:text-white">Appointment Schedule</span>
                      <span className="text-xs text-emerald-500 dark:text-emerald-400">View All</span>
                    </div>
                    <div className="space-y-2">
                      {[
                        { time: '09:00', name: 'John Smith', type: 'Check-up' },
                        { time: '10:30', name: 'Emily Brown', type: 'Follow-up' },
                        { time: '11:00', name: 'David Wilson', type: 'Consultation' },
                      ].map((apt, i) => (
                        <div key={i} className="flex items-center justify-between py-2 border-b border-neutral-200 dark:border-neutral-800 last:border-0">
                          <div className="flex items-center gap-3">
                            <span className="text-neutral-500 text-sm w-12">{apt.time}</span>
                            <span className="text-sm text-neutral-700 dark:text-white">{apt.name}</span>
                          </div>
                          <span className="text-xs text-neutral-500 bg-white dark:bg-neutral-800 px-2 py-1 rounded border border-neutral-200 dark:border-neutral-700">{apt.type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating notification badge */}
              <div className="absolute -top-4 -right-4 bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-lg animate-bounce">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <Check size={16} /> New Patient Added!
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}


      {/* Features Section with CardSpotlight */}
      <section
        ref={featuresRef}
        className={`py-24 px-6 transition-all duration-1000 ${featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-emerald-400 font-semibold uppercase tracking-wider text-sm">Features</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
              Everything You Need to Run Your Practice
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
              From appointment scheduling to billing, HealthSync provides all the tools you need to streamline your healthcare practice.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MAIN_FEATURES.map((feature, i) => (
              <AnimatedSection key={i} delay={i * 0.08} direction="up">
                <CardSpotlight
                  className="rounded-2xl bg-[#0d1117] border border-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-teal-500/40 hover:shadow-lg hover:shadow-teal-500/10 h-full"
                  color="#0d1117"
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                    style={{
                      background: `linear-gradient(135deg, rgb(${feature.colors[0].join(',')}) 0%, rgb(${feature.colors[1].join(',')}) 100%)`
                    }}
                  >
                    <feature.icon size={28} className="text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 relative z-20 text-white">{feature.title}</h3>
                  <p className="text-neutral-300 leading-relaxed relative z-20">{feature.description}</p>
                </CardSpotlight>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Testimonials Carousel Section */}
      <section className="py-24 px-6 bg-[#0a0f1a]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-emerald-400 font-semibold uppercase tracking-wider text-sm">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
              Loved by Healthcare Professionals
            </h2>
          </div>
          <TestimonialsCarousel testimonials={TESTIMONIALS} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Transform Your Practice?
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Join thousands of healthcare professionals who have already streamlined their practice with HealthSync.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-600 hover:bg-neutral-100 rounded-xl font-semibold text-lg transition-all hover:shadow-xl"
                >
                  Start Free Trial
                  <ArrowRight size={20} />
                </Link>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 hover:border-white rounded-xl font-semibold text-lg transition-all"
                >
                  Schedule Demo
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#080c14]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-12">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Heart size={24} className="text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  HealthSync
                </span>
              </Link>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-sm">
                The all-in-one healthcare management platform trusted by 40,000+ professionals worldwide.
              </p>
              <div className="flex items-center gap-4">
                {[
                  { name: 'Twitter', icon: Twitter },
                  { name: 'LinkedIn', icon: Linkedin },
                  { name: 'Facebook', icon: Facebook },
                ].map(({ name, icon: Icon }) => (
                  <a key={name} href="#" className="w-10 h-10 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                    <span className="sr-only">{name}</span>
                    <Icon size={18} className="text-neutral-600 dark:text-neutral-400" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-neutral-900 dark:text-white">Product</h4>
              <div className="space-y-3">
                {['Features', 'Pricing', 'Integrations', 'API'].map((link) => (
                  <a key={link} href="#" className="block text-neutral-600 dark:text-neutral-400 hover:text-emerald-500 dark:hover:text-white transition-colors">{link}</a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-neutral-900 dark:text-white">Company</h4>
              <div className="space-y-3">
                {['About', 'Blog', 'Careers', 'Contact'].map((link) => (
                  <a key={link} href="#" className="block text-neutral-600 dark:text-neutral-400 hover:text-emerald-500 dark:hover:text-white transition-colors">{link}</a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-neutral-900 dark:text-white">Support</h4>
              <div className="space-y-3">
                {['Help Center', 'Documentation', 'Status', 'Security'].map((link) => (
                  <a key={link} href="#" className="block text-neutral-600 dark:text-neutral-400 hover:text-emerald-500 dark:hover:text-white transition-colors">{link}</a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-neutral-500 text-sm">© 2024 HealthSync. All rights reserved.</p>
            <div className="flex items-center gap-6 text-sm text-neutral-500">
              <a href="#" className="hover:text-emerald-500 dark:hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-emerald-500 dark:hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-emerald-500 dark:hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
