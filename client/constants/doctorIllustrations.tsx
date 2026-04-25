import React from 'react';

export const getDoctorIllustration = (specialization: string): React.JSX.Element => {
  const spec = specialization?.toLowerCase() || ''

  // DENTISTRY — tooth with sparkle
  if (spec.includes('dent')) {
    return (
      <svg width="100" height="120" viewBox="0 0 100 120" fill="none">
        <ellipse cx="50" cy="55" rx="30" ry="35" fill="white" stroke="#e2e8f0" strokeWidth="2"/>
        <ellipse cx="35" cy="48" rx="8" ry="12" fill="#f8fafc"/>
        <ellipse cx="65" cy="48" rx="8" ry="12" fill="#f8fafc"/>
        <path d="M30 70 Q50 85 70 70" stroke="#cbd5e1" strokeWidth="2" fill="none"/>
        <circle cx="75" cy="25" r="6" fill="#fbbf24"/>
        <path d="M72 25 L75 22 L78 25 L75 28 Z" fill="white"/>
        <circle cx="80" cy="15" r="3" fill="#fbbf24" opacity="0.6"/>
        <circle cx="68" cy="18" r="2" fill="#fbbf24" opacity="0.4"/>
        {/* Doctor body */}
        <rect x="30" y="90" width="40" height="30" fill="white" rx="5"/>
        <circle cx="50" cy="80" r="12" fill="#f5c5a3"/>
        <rect x="38" y="72" width="24" height="10" fill="#1e293b" rx="4"/>
      </svg>
    )
  }

  // CARDIOLOGY — heart with ECG
  if (spec.includes('cardio') || spec.includes('heart')) {
    return (
      <svg width="100" height="120" viewBox="0 0 100 120" fill="none">
        <path d="M50 80 C20 60 10 40 25 25 C35 15 50 20 50 30 C50 20 65 15 75 25 C90 40 80 60 50 80Z" fill="#ef4444" opacity="0.9"/>
        <path d="M15 55 L25 55 L30 45 L35 65 L42 38 L48 62 L52 50 L58 58 L63 55 L85 55" stroke="#00c8a0" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        {/* Doctor */}
        <circle cx="50" cy="100" r="10" fill="#f5c5a3"/>
        <rect x="38" y="108" width="24" height="12" fill="white" rx="3"/>
        <rect x="44" y="93" width="12" height="8" fill="#1e293b" rx="3"/>
      </svg>
    )
  }

  // OPHTHALMOLOGY — eye
  if (spec.includes('ophthal') || spec.includes('eye')) {
    return (
      <svg width="100" height="120" viewBox="0 0 100 120" fill="none">
        <ellipse cx="50" cy="50" rx="38" ry="22" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2"/>
        <circle cx="50" cy="50" r="14" fill="#3b82f6"/>
        <circle cx="50" cy="50" r="8" fill="#1e293b"/>
        <circle cx="53" cy="46" r="3" fill="white"/>
        <circle cx="47" cy="52" r="1.5" fill="white" opacity="0.6"/>
        {/* Lashes */}
        <line x1="20" y1="45" x2="15" y2="40" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="25" y1="38" x2="22" y2="32" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="50" y1="28" x2="50" y2="22" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="75" y1="38" x2="78" y2="32" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round"/>
        {/* Doctor */}
        <circle cx="50" cy="100" r="10" fill="#f5c5a3"/>
        <rect x="38" y="108" width="24" height="12" fill="white" rx="3"/>
      </svg>
    )
  }

  // DERMATOLOGY — skin/body
  if (spec.includes('derma') || spec.includes('skin')) {
    return (
      <svg width="100" height="120" viewBox="0 0 100 120" fill="none">
        <circle cx="50" cy="35" r="22" fill="#fde68a" stroke="#f59e0b" strokeWidth="2"/>
        <circle cx="42" cy="30" r="3" fill="#92400e"/>
        <circle cx="58" cy="30" r="3" fill="#92400e"/>
        <path d="M40 45 Q50 52 60 45" stroke="#92400e" strokeWidth="2" fill="none" strokeLinecap="round"/>
        {/* Sparkles on skin */}
        <circle cx="30" cy="20" r="2" fill="#f59e0b" opacity="0.7"/>
        <circle cx="70" cy="22" r="2" fill="#f59e0b" opacity="0.7"/>
        <circle cx="75" cy="40" r="1.5" fill="#f59e0b" opacity="0.5"/>
        {/* Doctor coat */}
        <rect x="28" y="57" width="44" height="50" fill="white" rx="5"/>
        <rect x="44" y="57" width="12" height="25" fill="#dbeafe"/>
        <circle cx="50" cy="75" r="3" fill="#3b82f6"/>
        <circle cx="50" cy="85" r="3" fill="#3b82f6"/>
      </svg>
    )
  }

  // NEUROLOGY — brain
  if (spec.includes('neuro') || spec.includes('brain')) {
    return (
      <svg width="100" height="120" viewBox="0 0 100 120" fill="none">
        <path d="M25 55 C20 35 35 15 50 18 C65 15 80 35 75 55 C78 65 70 78 50 78 C30 78 22 65 25 55Z" fill="#e9d5ff" stroke="#8b5cf6" strokeWidth="2"/>
        <path d="M50 18 L50 78" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="4 3"/>
        <path d="M30 35 Q40 30 50 35 Q60 40 70 35" stroke="#8b5cf6" strokeWidth="1.5" fill="none"/>
        <path d="M27 50 Q38 45 50 50 Q62 55 73 50" stroke="#8b5cf6" strokeWidth="1.5" fill="none"/>
        <path d="M28 65 Q39 60 50 65 Q61 70 72 65" stroke="#8b5cf6" strokeWidth="1.5" fill="none"/>
        {/* Doctor */}
        <circle cx="50" cy="100" r="10" fill="#f5c5a3"/>
        <rect x="38" y="108" width="24" height="12" fill="white" rx="3"/>
      </svg>
    )
  }

  // ORTHOPEDICS — bone
  if (spec.includes('ortho') || spec.includes('bone')) {
    return (
      <svg width="100" height="120" viewBox="0 0 100 120" fill="none">
        <rect x="45" y="15" width="10" height="70" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" rx="5"/>
        <ellipse cx="50" cy="18" rx="14" ry="10" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5"/>
        <ellipse cx="50" cy="82" rx="14" ry="10" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5"/>
        <rect x="20" y="45" width="60" height="10" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" rx="5"/>
        <ellipse cx="22" cy="50" rx="10" ry="7" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5"/>
        <ellipse cx="78" cy="50" rx="10" ry="7" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5"/>
        {/* Plus sign */}
        <circle cx="75" cy="20" r="10" fill="#00c8a0"/>
        <rect x="70" y="18" width="10" height="4" fill="white" rx="1"/>
        <rect x="73" y="15" width="4" height="10" fill="white" rx="1"/>
      </svg>
    )
  }

  // PSYCHOLOGY/PSYCHIATRY — brain with heart
  if (spec.includes('psych') || spec.includes('mental')) {
    return (
      <svg width="100" height="120" viewBox="0 0 100 120" fill="none">
        <path d="M30 50 C28 35 38 20 50 22 C62 20 72 35 70 50 C72 62 62 75 50 75 C38 75 28 62 30 50Z" fill="#fce7f3" stroke="#ec4899" strokeWidth="2"/>
        <path d="M42 45 C40 38 48 35 50 42 C52 35 60 38 58 45 C56 52 50 58 50 58 C50 58 44 52 42 45Z" fill="#ec4899"/>
        {/* Zigzag thoughts */}
        <path d="M20 25 L25 20 L30 25 L35 18" stroke="#a855f7" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <circle cx="15" cy="28" r="4" fill="#a855f7" opacity="0.5"/>
        <circle cx="10" cy="20" r="2.5" fill="#a855f7" opacity="0.3"/>
        {/* Doctor */}
        <circle cx="50" cy="100" r="10" fill="#f5c5a3"/>
        <rect x="38" y="108" width="24" height="12" fill="white" rx="3"/>
      </svg>
    )
  }

  // PEDIATRICS — baby/child
  if (spec.includes('pediatr') || spec.includes('child')) {
    return (
      <svg width="100" height="120" viewBox="0 0 100 120" fill="none">
        <circle cx="50" cy="35" r="20" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2"/>
        <circle cx="42" cy="30" r="2.5" fill="#92400e"/>
        <circle cx="58" cy="30" r="2.5" fill="#92400e"/>
        <circle cx="43" cy="29" r="1" fill="white"/>
        <circle cx="59" cy="29" r="1" fill="white"/>
        <path d="M43 42 Q50 48 57 42" stroke="#92400e" strokeWidth="2" fill="none" strokeLinecap="round"/>
        {/* Hair buns */}
        <circle cx="35" cy="22" r="6" fill="#fbbf24"/>
        <circle cx="65" cy="22" r="6" fill="#fbbf24"/>
        {/* Small body */}
        <rect x="33" y="55" width="34" height="35" fill="#bfdbfe" rx="8"/>
        <circle cx="50" cy="70" r="4" fill="#93c5fd"/>
        {/* Stethoscope */}
        <path d="M38 65 Q30 75 35 82" stroke="#1e293b" strokeWidth="2" fill="none"/>
        <circle cx="35" cy="83" r="4" fill="#1e293b"/>
      </svg>
    )
  }

  // ENT
  if (spec.includes('ent') || spec.includes('ear') || spec.includes('nose')) {
    return (
      <svg width="100" height="120" viewBox="0 0 100 120" fill="none">
        <circle cx="50" cy="40" r="25" fill="#f5c5a3"/>
        {/* Ear */}
        <path d="M25 35 C18 35 15 45 20 50 C23 53 26 50 25 45 C26 42 28 40 25 35Z" fill="#f5c5a3" stroke="#e0a882" strokeWidth="1.5"/>
        {/* Nose */}
        <ellipse cx="50" cy="45" rx="5" ry="7" fill="#e0a882" opacity="0.5"/>
        {/* Eyes */}
        <circle cx="40" cy="35" r="4" fill="white" stroke="#1e293b" strokeWidth="1"/>
        <circle cx="60" cy="35" r="4" fill="white" stroke="#1e293b" strokeWidth="1"/>
        <circle cx="41" cy="35" r="2" fill="#1e293b"/>
        <circle cx="61" cy="35" r="2" fill="#1e293b"/>
        {/* Doctor coat */}
        <rect x="28" y="65" width="44" height="45" fill="white" rx="5"/>
        <rect x="44" y="65" width="12" height="22" fill="#dbeafe"/>
      </svg>
    )
  }

  // DEFAULT — General Physician with stethoscope
  return (
    <svg width="100" height="120" viewBox="0 0 100 120" fill="none">
      <circle cx="50" cy="28" r="18" fill="#f5c5a3"/>
      <rect x="28" y="46" width="44" height="55" fill="white" rx="5"/>
      <rect x="42" y="46" width="16" height="30" fill="#dbeafe"/>
      {/* Stethoscope */}
      <path d="M35 60 Q25 72 30 82" stroke="#1e293b" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <circle cx="30" cy="83" r="7" fill="none" stroke="#1e293b" strokeWidth="2.5"/>
      <circle cx="30" cy="83" r="3" fill="#00c8a0"/>
      <path d="M35 60 Q38 55 42 58" stroke="#1e293b" strokeWidth="2" fill="none"/>
      <path d="M65 60 Q75 72 70 82" stroke="#1e293b" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M65 60 Q62 55 58 58" stroke="#1e293b" strokeWidth="2" fill="none"/>
      {/* Buttons */}
      <circle cx="50" cy="70" r="2" fill="#94a3b8"/>
      <circle cx="50" cy="80" r="2" fill="#94a3b8"/>
      <circle cx="50" cy="90" r="2" fill="#94a3b8"/>
      {/* Hair */}
      <rect x="32" y="12" width="36" height="18" fill="#1e293b" rx="8"/>
    </svg>
  )
}
