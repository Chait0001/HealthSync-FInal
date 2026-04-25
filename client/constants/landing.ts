import {
  ClipboardList,
  Pill,
  Calendar,
  FileText,
  UserCheck,
  Clock,
  MessageSquare,
  Users,
  BarChart3,
  Globe,
  Smartphone,
  Lock,
  Shield,
  HeadphonesIcon
} from 'lucide-react';

export const CORE_FEATURES = [
  { icon: ClipboardList, label: 'Electronic Medical Records' },
  { icon: Pill, label: 'E-Prescription' },
  { icon: Calendar, label: 'Appointment Scheduling' },
  { icon: FileText, label: 'Invoice & Billing' },
  { icon: UserCheck, label: 'Patient Management' },
  { icon: Clock, label: 'Queue Management' },
];

export const ADVANCED_FEATURES = [
  { icon: MessageSquare, label: 'Patient Communication' },
  { icon: Users, label: 'Multi-User Role Access' },
  { icon: BarChart3, label: 'Analytics & Reports' },
  { icon: Globe, label: 'Telemedicine Support' },
  { icon: Smartphone, label: 'Mobile App Access' },
  { icon: Lock, label: 'HIPAA Compliant Security' },
];

export const SPECIALTIES = [
  'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics',
  'Orthopedics', 'Ophthalmology', 'Dentistry', 'Psychology'
];

export const TESTIMONIALS = [
  {
    name: 'Dr. Sarah Johnson',
    role: 'Cardiologist, HeartCare Clinic',
    initials: 'DSJ',
    content: 'HealthSync has transformed how we manage our practice. The appointment scheduling alone has saved us countless hours.',
    rating: 5
  },
  {
    name: 'Dr. Michael Chen',
    role: 'General Practitioner',
    initials: 'DMC',
    content: 'The patient communication features are incredible. Our patient satisfaction scores have improved by 40%.',
    rating: 5
  },
  {
    name: 'Dr. Emily Williams',
    role: 'Pediatrician, Kids First Clinic',
    initials: 'DEW',
    content: 'Easy to use, powerful features, and excellent support. Exactly what modern healthcare needs.',
    rating: 5
  }
];

export const MAIN_FEATURES = [
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description: 'AI-powered appointment scheduling that reduces no-shows and optimizes your calendar automatically.',
    colors: [[16, 185, 129], [6, 182, 212]] // emerald to cyan
  },
  {
    icon: FileText,
    title: 'Electronic Health Records',
    description: 'Secure, cloud-based EHR system with templates for every specialty. Access records anywhere.',
    colors: [[6, 182, 212], [59, 130, 246]] // cyan to blue
  },
  {
    icon: MessageSquare,
    title: 'Patient Communication',
    description: 'Automated reminders, secure messaging, and telehealth integration for better patient engagement.',
    colors: [[59, 130, 246], [139, 92, 246]] // blue to purple
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Real-time insights into your practice performance, revenue trends, and patient demographics.',
    colors: [[139, 92, 246], [168, 85, 247]] // purple
  },
  {
    icon: Shield,
    title: 'Security & Compliance',
    description: 'HIPAA compliant with end-to-end encryption. Your patient data is always protected.',
    colors: [[239, 68, 68], [249, 115, 22]] // red to orange
  },
  {
    icon: HeadphonesIcon,
    title: '24/7 Support',
    description: 'Dedicated support team available round the clock. Average response time under 5 minutes.',
    colors: [[249, 115, 22], [234, 179, 8]] // orange to yellow
  },
];
