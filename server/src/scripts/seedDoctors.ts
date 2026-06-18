import 'dotenv/config';
import { DatabaseConnection } from '../config/database';
import { UserModel } from '../models/User.model';
import { DoctorModel } from '../models/Doctor.model';
import { RoleModel } from '../models/Role.model';
import { RolePermissionModel } from '../models/RolePermission';
import mongoose from 'mongoose';

const DOCTOR_DATA = [
  {
    name: 'Atul Sachdev',
    email: 'atul.sachdev@healthsync.com',
    specialization: 'Gastroenterology',
    department: 'Gastroenterology & Hepatology',
    experience: 35,
    feesPerConsultation: 1200,
    designation: 'Principal Director & Head – Gastroenterology',
    hospitalName: 'Max Super Speciality Hospital, Saket, New Delhi',
    opdTimings: 'Mon, Wed, Fri: 10:00 AM - 02:00 PM',
    profilePicture: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=250&h=250',
    bio: 'Dr. Atul Sachdev is a highly experienced Gastroenterologist with over 35 years of clinical excellence in therapeutic endoscopy, hepatology, and inflammatory bowel disease. He is known for his patient-first approach and extensive research contributions.',
    education: [
      { degree: 'MBBS', institution: 'Maulana Azad Medical College, Delhi', year: '1985' },
      { degree: 'MD - Internal Medicine', institution: 'Lady Hardinge Medical College, Delhi', year: '1989' },
      { degree: 'DM - Gastroenterology', institution: 'GB Pant Hospital, Delhi', year: '1993' }
    ],
    workExperience: [
      { role: 'Head of Department', organization: 'Max Healthcare', duration: '2015 - Present' },
      { role: 'Senior Consultant', organization: 'Fortis Hospital', duration: '2005 - 2015' },
      { role: 'Associate Professor', organization: 'MAMC, Delhi', duration: '1995 - 2005' }
    ],
    specialityInterests: ['Therapeutic Endoscopy', 'Hepatology', 'Inflammatory Bowel Disease (IBD)', 'Pancreatic Disorders'],
    languages: ['English', 'Hindi', 'Punjabi'],
    memberships: ['Indian Society of Gastroenterology (ISG)', 'Society of Gastrointestinal Endoscopy of India (SGEI)'],
    awards: [
      { name: 'Lifetime Achievement Award in Gastroenterology', year: '2022' },
      { name: 'Best Doctor Award - Delhi Medical Association', year: '2015' }
    ]
  },
  {
    name: 'Sunita Kapoor',
    email: 'sunita.kapoor@healthsync.com',
    specialization: 'Cardiology',
    department: 'Cardiac Sciences',
    experience: 22,
    feesPerConsultation: 1500,
    designation: 'Senior Consultant – Interventional Cardiology',
    hospitalName: 'Max Heart & Vascular Institute, Saket, New Delhi',
    opdTimings: 'Tue, Thu, Sat: 09:00 AM - 01:00 PM',
    profilePicture: 'https://images.unsplash.com/photo-1594824813573-246434e3b96f?auto=format&fit=crop&q=80&w=250&h=250',
    bio: 'Dr. Sunita Kapoor is a renowned interventional cardiologist specializing in complex angioplasties, pacemaker implantations, valvular interventions, and comprehensive preventive cardiac care.',
    education: [
      { degree: 'MBBS', institution: 'King George\'s Medical University', year: '1998' },
      { degree: 'MD - Medicine', institution: 'KGMU, Lucknow', year: '2001' },
      { degree: 'DM - Cardiology', institution: 'AIIMS, New Delhi', year: '2005' }
    ],
    workExperience: [
      { role: 'Senior Consultant', organization: 'Max Healthcare', duration: '2012 - Present' },
      { role: 'Consultant Cardiologist', organization: 'Medanta - The Medicity', duration: '2006 - 2012' }
    ],
    specialityInterests: ['Coronary Angioplasty', 'Pacemaker & ICD Implantation', 'Heart Failure Management', 'Preventive Cardiology'],
    languages: ['English', 'Hindi'],
    memberships: ['Cardiological Society of India (CSI)', 'Fellow of the American College of Cardiology (FACC)'],
    awards: [
      { name: 'Dr. B.C. Roy National Award', year: '2019' }
    ]
  },
  {
    name: 'Rajesh Sharma',
    email: 'rajesh.sharma@healthsync.com',
    specialization: 'Orthopedics',
    department: 'Orthopedics & Joint Reconstruction',
    experience: 18,
    feesPerConsultation: 1000,
    designation: 'Director – Joint Replacement & Arthroscopy',
    hospitalName: 'Max Hospital, Gurgaon, Haryana',
    opdTimings: 'Mon-Fri: 02:00 PM - 05:00 PM',
    profilePicture: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=250&h=250',
    bio: 'Dr. Rajesh Sharma has performed over 5,000 successful joint replacement surgeries. He is a pioneer in minimally invasive knee and hip replacements, computer-assisted navigation joint surgery, and sports arthroscopy.',
    education: [
      { degree: 'MBBS', institution: 'Armed Forces Medical College, Pune', year: '2002' },
      { degree: 'MS - Orthopedics', institution: 'AFMC, Pune', year: '2006' },
      { degree: 'Fellowship in Joint Replacement', institution: 'University of Munich, Germany', year: '2008' }
    ],
    workExperience: [
      { role: 'Director - Orthopedics', organization: 'Max Hospital', duration: '2016 - Present' },
      { role: 'Senior Consultant', organization: 'Artemis Hospital', duration: '2010 - 2016' }
    ],
    specialityInterests: ['Total Knee Replacement', 'Total Hip Replacement', 'Knee Arthroscopy', 'Sports Injury Rehabilitation'],
    languages: ['English', 'Hindi', 'German'],
    memberships: ['Indian Orthopaedic Association (IOA)', 'Indian Arthroscopy Society (IAS)'],
    awards: [
      { name: 'Best Joint Replacement Surgeon in Delhi NCR', year: '2021' }
    ]
  },
  {
    name: 'Anita Desai',
    email: 'anita.desai@healthsync.com',
    specialization: 'Pediatrics',
    department: 'Pediatrics & Neonatology',
    experience: 15,
    feesPerConsultation: 800,
    designation: 'Senior Consultant – Pediatric Care',
    hospitalName: 'Max Super Speciality Hospital, Shalimar Bagh, New Delhi',
    opdTimings: 'Mon-Sat: 11:00 AM - 03:00 PM',
    profilePicture: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=250&h=250',
    bio: 'Dr. Anita Desai is dedicated to offering standard-setting medical care to children of all ages. She has special expertise in neonatology, pediatric nutrition, childhood asthma, and growth monitoring.',
    education: [
      { degree: 'MBBS', institution: 'Grant Medical College, Mumbai', year: '2005' },
      { degree: 'MD - Pediatrics', institution: 'GMC, Mumbai', year: '2008' },
      { degree: 'DCH (Diploma in Child Health)', institution: 'College of Physicians & Surgeons, Mumbai', year: '2010' }
    ],
    workExperience: [
      { role: 'Senior Consultant', organization: 'Max Healthcare', duration: '2014 - Present' },
      { role: 'Consultant Pediatrician', organization: 'Apollo Cradle', duration: '2010 - 2014' }
    ],
    specialityInterests: ['Neonatal Intensive Care', 'Pediatric Asthma & Allergies', 'Childhood Nutrition & Growth', 'Developmental Pediatrics'],
    languages: ['English', 'Hindi', 'Marathi', 'Gujarati'],
    memberships: ['Indian Academy of Pediatrics (IAP)', 'National Neonatology Forum (NNF)'],
    awards: []
  },
  {
    name: 'Vikram Mehta',
    email: 'vikram.mehta@healthsync.com',
    specialization: 'Neurology',
    department: 'Neurology & Stroke Care',
    experience: 20,
    feesPerConsultation: 1400,
    designation: 'Head – Neurology Department',
    hospitalName: 'Max Hospital, Noida, Uttar Pradesh',
    opdTimings: 'Tue, Thu: 10:00 AM - 04:00 PM',
    profilePicture: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=250&h=250',
    bio: 'Dr. Vikram Mehta is a leading clinical neurologist with extensive expertise in stroke management, epilepsy treatment, Parkinson\'s disease, memory disorders, and comprehensive neuro-rehabilitation services.',
    education: [
      { degree: 'MBBS', institution: 'Madras Medical College, Chennai', year: '2000' },
      { degree: 'MD - General Medicine', institution: 'MMC, Chennai', year: '2003' },
      { degree: 'DM - Neurology', institution: 'National Institute of Mental Health and Neuro Sciences (NIMHANS)', year: '2007' }
    ],
    workExperience: [
      { role: 'Head of Neurology', organization: 'Max Hospital', duration: '2015 - Present' },
      { role: 'Senior Consultant', organization: 'Fortis Escorts', duration: '2008 - 2015' }
    ],
    specialityInterests: ['Acute Stroke Management', 'Epilepsy & Seizures', 'Parkinson\'s & Movement Disorders', 'Electromyography (EMG)'],
    languages: ['English', 'Hindi', 'Tamil', 'Telugu'],
    memberships: ['Indian Academy of Neurology (IAN)', 'Neurological Society of India (NSI)'],
    awards: [
      { name: 'NIMHANS Gold Medal in Neurology', year: '2007' }
    ]
  },
  {
    name: 'Priya Nair',
    email: 'priya.nair@healthsync.com',
    specialization: 'Oncology',
    department: 'Medical Oncology & Hematology',
    experience: 12,
    feesPerConsultation: 1800,
    designation: 'Consultant – Breast & Thoracic Oncology',
    hospitalName: 'Max Cancer Centre, Saket, New Delhi',
    opdTimings: 'Wed, Fri: 09:00 AM - 01:00 PM',
    profilePicture: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=250&h=250',
    bio: 'Dr. Priya Nair specializes in breast and lung cancer management. She is highly trained in modern targeted therapies, immuno-oncology, and clinical trial participation for advanced cancers.',
    education: [
      { degree: 'MBBS', institution: 'Calicut Medical College', year: '2008' },
      { degree: 'MD - Radiotherapy', institution: 'Tata Memorial Hospital, Mumbai', year: '2011' },
      { degree: 'DM - Medical Oncology', institution: 'TMH, Mumbai', year: '2014' }
    ],
    workExperience: [
      { role: 'Consultant Medical Oncologist', organization: 'Max Healthcare', duration: '2018 - Present' },
      { role: 'Specialist Registrar', organization: 'Tata Memorial Hospital', duration: '2014 - 2018' }
    ],
    specialityInterests: ['Breast Cancer Chemotherapy', 'Lung & Thoracic Cancers', 'Targeted & Immunotherapies', 'Genetic Counseling'],
    languages: ['English', 'Hindi', 'Malayalam'],
    memberships: ['European Society for Medical Oncology (ESMO)', 'American Society of Clinical Oncology (ASCO)'],
    awards: [
      { name: 'Young Oncologist Travel Award', year: '2016' }
    ]
  }
];

async function seedDoctors() {
  await DatabaseConnection.getInstance().connect();

  console.log('🔄 Cleaning up existing doctor users and profiles...');

  // Get 'doctor' role
  const doctorRole = await RoleModel.findOne({ key: 'doctor' });
  if (!doctorRole) {
    console.error('❌ Role "doctor" not found in DB. Please run seedRBACData first!');
    process.exit(1);
  }

  // Find users with email addresses corresponding to doctors we are seeding
  const emails = DOCTOR_DATA.map(d => d.email);
  const existingUsers = await UserModel.find({ email: { $in: emails } });
  const existingUserIds = existingUsers.map(u => u._id);

  // Delete doctor profiles linked to these users
  await DoctorModel.deleteMany({ userId: { $in: existingUserIds } });
  // Delete the users
  await UserModel.deleteMany({ email: { $in: emails } });

  console.log('🌱 Seeding doctor users and profiles...');

  // Doctor permissions_cache
  const doctorPermissions = ['patients.view', 'patients.update', 'appointments.view', 'appointments.cancel', 'doctors.view'];

  for (const doc of DOCTOR_DATA) {
    // 1. Create User
    const user = await UserModel.create({
      name: doc.name,
      email: doc.email,
      password: 'password123', // Will be hashed by pre-save hook
      role: 'doctor',
      roles: [{
        role_id: doctorRole._id,
        role_key: 'doctor',
        role_name: 'Doctor',
        is_primary: true
      }],
      permissions_cache: doctorPermissions,
      phone: '9876543210'
    });

    // 2. Create Doctor Profile
    await DoctorModel.create({
      userId: user._id,
      specialization: doc.specialization,
      experience: doc.experience,
      feesPerConsultation: doc.feesPerConsultation,
      department: doc.department,
      bio: doc.bio,
      designation: doc.designation,
      hospitalName: doc.hospitalName,
      opdTimings: doc.opdTimings,
      profilePicture: doc.profilePicture,
      education: doc.education,
      workExperience: doc.workExperience,
      specialityInterests: doc.specialityInterests,
      languages: doc.languages,
      memberships: doc.memberships,
      awards: doc.awards
    });

    console.log(`✅ Seeded Dr. ${doc.name}`);
  }

  console.log('🎉 Seeding of doctors complete!');
  process.exit(0);
}

seedDoctors().catch(err => {
  console.error('❌ Error seeding doctors:', err);
  process.exit(1);
});
