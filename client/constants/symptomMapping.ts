// constants/symptomMapping.ts
export const SYMPTOM_SPECIALIZATION_MAP: Record<string, string[]> = {
  // Dental
  'toothache': ['Dentistry', 'Dental', 'Dentist'],
  'tooth pain': ['Dentistry', 'Dental', 'Dentist'],
  'tooth': ['Dentistry', 'Dental', 'Dentist'],
  'gum': ['Dentistry', 'Dental', 'Dentist'],
  'cavity': ['Dentistry', 'Dental', 'Dentist'],

  // Heart
  'chest pain': ['Cardiology', 'Cardiologist'],
  'heart': ['Cardiology', 'Cardiologist'],
  'palpitation': ['Cardiology', 'Cardiologist'],
  'blood pressure': ['Cardiology', 'Cardiologist'],

  // Skin
  'skin rash': ['Dermatology', 'Dermatologist'],
  'skin': ['Dermatology', 'Dermatologist'],
  'acne': ['Dermatology', 'Dermatologist'],
  'eczema': ['Dermatology', 'Dermatologist'],
  'rash': ['Dermatology', 'Dermatologist'],

  // Eyes
  'blurry vision': ['Ophthalmology', 'Eye'],
  'eye': ['Ophthalmology', 'Eye'],
  'vision': ['Ophthalmology', 'Eye'],

  // General/Fever
  'fever': ['General Physician', 'General Medicine', 'Internal Medicine'],
  'cold': ['General Physician', 'Pulmonology'],
  'cough': ['General Physician', 'Pulmonology'],
  'headache': ['General Physician', 'Neurology'],
  'weakness': ['General Physician', 'Internal Medicine'],
  'general': ['General Physician', 'Internal Medicine'],

  // Bones/Joints
  'joint pain': ['Orthopedics', 'Orthopedic', 'Bone'],
  'back pain': ['Orthopedics', 'Orthopedic'],
  'bone': ['Orthopedics', 'Orthopedic'],

  // Mental Health
  'stress': ['Psychiatry', 'Psychology', 'Mental Health'],
  'anxiety': ['Psychiatry', 'Psychology', 'Mental Health'],
  'depression': ['Psychiatry', 'Psychology', 'Mental Health'],

  // Default
  'default': ['General Medicine', 'General Physician']
}

export function getSpecializationsForSymptom(concern: string): string[] {
  const lowerConcern = concern.toLowerCase()
  
  for (const [keyword, specializations] of Object.entries(SYMPTOM_SPECIALIZATION_MAP)) {
    if (lowerConcern.includes(keyword)) {
      return specializations
    }
  }
  
  return SYMPTOM_SPECIALIZATION_MAP['default']
}
