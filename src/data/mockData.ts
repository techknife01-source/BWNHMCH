/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Department,
  FacultyMember,
  StudentRecord,
  PatientRecord,
  Notice,
  GalleryAlbum,
  ServiceBooking,
  FeedbackSubmission,
  Course,
  PrincipalProfile,
  LibraryBook,
  IPDBed,
  PharmacyItem,
  LabTestRecord,
  CMSData
} from '../types';

export const DEFAULT_PRINCIPAL_PROFILE: PrincipalProfile = {
  name: 'Dr. Susmita Chatterjee',
  title: 'Principal & Chief Administrator',
  qualification: 'DHMS (West Bengal Council of Homoeopathic Medicine), MD (Organon of Medicine)',
  experience: '26 Years in Academic Administration & Clinical Medicine',
  image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=600',
  messageText: 'Welcome to BURDWAN HOMOEOPATHIC MEDICAL COLLEGE & HOSPITAL. Established in 1958, our institution stands as a premier seat of homoeopathic learning in Eastern India. We strive to merge Hahnemannian classical philosophy with modern medical diagnostics and research.',
  tenure: '2021 - Present',
  email: 'principal@bhmch.com',
  phone: '+91 342 2656331'
};

export const DEFAULT_CMS_DATA: CMSData = {
  collegeName: 'BURDWAN HOMOEOPATHIC MEDICAL COLLEGE & HOSPITAL',
  address: '1, Ramkrishna Road, Burdwan, West Bengal - 713101, India',
  phone: '+91 (0342) 2656331 / 2568442',
  email: 'principal@bhmch.com',
  aboutText: 'BURDWAN HOMOEOPATHIC MEDICAL COLLEGE & HOSPITAL is a premier AYUSH educational institution in West Bengal, dedicated to classical homoeopathic education, research, and patient care.',
  historyText: 'Founded in 1958 by visionaries in Burdwan district, the college was established to deliver affordable homoeopathic healthcare and quality medical training.',
  missionText: 'To nurture highly competent, empathetic homoeopathic physicians equipped with deep classical knowledge and modern clinical diagnostic skills.',
  visionText: 'To be a global center of excellence in homoeopathic medical education, clinical research, and community health service.',
  seoTitle: 'BURDWAN HOMOEOPATHIC MEDICAL COLLEGE & HOSPITAL | Premier AYUSH Institute',
  seoDescription: 'Official Portal of BURDWAN HOMOEOPATHIC MEDICAL COLLEGE & HOSPITAL. Offering BHMS degree affiliated with WBUHS and recognized by NCH.'
};

export const DEFAULT_LIBRARY_BOOKS: LibraryBook[] = [
  {
    id: 'bk_101',
    title: 'Organon of Medicine (6th Edition)',
    author: 'Dr. Samuel Hahnemann',
    category: 'Organon',
    publisher: 'B. Jain Publishers',
    year: 1921,
    fileType: 'PDF',
    allowDownload: false,
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400',
    pageCount: 380,
    sampleContent: [
      '§ 1 The physician’s highest and only mission is to restore the sick to health, to cure, as it is termed.',
      '§ 2 The highest ideal of cure is rapid, gentle and permanent restoration of the health, or removal and annihilation of the disease in its whole extent...',
      '§ 3 If the physician clearly perceives what is to be cured in diseases, that is to say, in every individual case of disease...',
      '§ 4 He is likewise a preserver of health if he knows the things that derange health and cause disease, and how to remove them from persons in health.'
    ]
  },
  {
    id: 'bk_102',
    title: 'Pocket Manual of Materia Medica with Repertory',
    author: 'Dr. William Boericke',
    category: 'Materia Medica',
    publisher: 'B. Jain Publishers',
    year: 1927,
    fileType: 'PDF',
    allowDownload: false,
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400',
    pageCount: 1040,
    sampleContent: [
      'NUX VOMICA - Poison Nut. Is the greatest Homoepathic polychrest, because three-fourths of its symptoms correspond to conditions met in daily practice.',
      'Mind: Very irritable, sensitive to all impressions; cannot bear noise, odors, light. Time passes too slowly.',
      'Head: Headache in morning on waking, as if bruised. Vertigo with moment loss of consciousness.',
      'Modalities: Worse in morning, mental exertion, after eating, touch, spices. Better from a nap, in evening, while at rest.'
    ]
  },
  {
    id: 'bk_103',
    title: 'Repertory of the Homoeopathic Materia Medica',
    author: 'Dr. James Tyler Kent',
    category: 'Repertory',
    publisher: 'Sett Dey & Co.',
    year: 1908,
    fileType: 'PDF',
    allowDownload: false,
    coverUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=400',
    pageCount: 1420,
    sampleContent: [
      'MIND - ANXIETY - evening - in bed: Acon, Arsenic, Calc, Lyc, Nux-v, Puls, Rhus-t.',
      'HEAD - PAIN - cold - air, from: Ars, Nux-v, Sil, Psor, Hep.',
      'RESPIRATION - ASTHMATIC - night - midnight, after: Ars, Kali-c, Nux-v.',
      'GENERALITIES - WEAKNESS - morning - waking, on: Bry, Nux-v, Phos, Sulph.'
    ]
  },
  {
    id: 'bk_104',
    title: 'BHMCH Clinical Research Journal Vol. 14',
    author: 'Department of Research, BHMCH',
    category: 'Research Journal',
    publisher: 'BHMCH Press',
    year: 2026,
    fileType: 'PDF',
    allowDownload: false,
    coverUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=400',
    pageCount: 120,
    sampleContent: [
      'Efficacy of Ultramolecular Potencies in Sub-clinical Hypothyroidism: A Double-Blind Placebo-Controlled Trial conducted at BHMCH OPD.',
      'Statistical Analysis: Significant reduction in Serum TSH levels (p < 0.001) observed in Thyroidinum 200C treatment cohort over 6 months.'
    ]
  }
];

export const DEFAULT_IPD_BEDS: IPDBed[] = [
  {
    id: 'bed_1',
    bedNumber: 'D-01',
    wardName: 'Dhanvantari Acute Ward',
    isOccupied: true,
    patientName: 'Savitri Devi',
    caseNo: 'IPD/2026/00714',
    doctorInCharge: 'Dr. Sunita Sharma',
    admissionDate: '2026-07-10',
    nursingNote: 'Patient comfortable after Sepia 200C. Vitals stable BP 124/82 mmHg.',
    vitals: 'Pulse: 76 bpm, SpO2: 98%, Temp: 98.4 F'
  },
  {
    id: 'bed_2',
    bedNumber: 'D-02',
    wardName: 'Dhanvantari Acute Ward',
    isOccupied: false
  },
  {
    id: 'bed_3',
    bedNumber: 'H-101',
    wardName: 'Hahnemann Male IPD',
    isOccupied: true,
    patientName: 'Ramesh Chawla',
    caseNo: 'IPD/2026/00728',
    doctorInCharge: 'Dr. Susmita Chatterjee',
    admissionDate: '2026-07-14',
    nursingNote: 'Observed under Arsenicum Album 30C dose. Breathing unlabored.',
    vitals: 'Pulse: 80 bpm, SpO2: 97%, Temp: 98.6 F'
  },
  {
    id: 'bed_4',
    bedNumber: 'H-102',
    wardName: 'Hahnemann Male IPD',
    isOccupied: false
  },
  {
    id: 'bed_5',
    bedNumber: 'K-201',
    wardName: 'Kent Female IPD',
    isOccupied: true,
    patientName: 'Priyanka Ghosh',
    caseNo: 'IPD/2026/00735',
    doctorInCharge: 'Dr. Vandana Gupta',
    admissionDate: '2026-07-16',
    nursingNote: 'Post-acute allergic eruption monitoring under Pulsatilla 200C.',
    vitals: 'Pulse: 72 bpm, SpO2: 99%, Temp: 98.2 F'
  },
  {
    id: 'bed_6',
    bedNumber: 'B-301',
    wardName: 'Boenninghausen Pediatric Ward',
    isOccupied: false
  }
];

export const DEFAULT_PHARMACY_STOCK: PharmacyItem[] = [
  {
    id: 'ph_1',
    name: 'Thuja Occidentalis',
    potency: '200C',
    form: 'Dilution',
    batchNo: 'TH-2026-08',
    expiryDate: '2029-12-31',
    stockQuantity: 145,
    reorderLevel: 20,
    pricePerUnit: 85
  },
  {
    id: 'ph_2',
    name: 'Nux Vomica',
    potency: '30C',
    form: 'Globules',
    batchNo: 'NV-2026-02',
    expiryDate: '2028-10-30',
    stockQuantity: 18, // low stock alert
    reorderLevel: 25,
    pricePerUnit: 60
  },
  {
    id: 'ph_3',
    name: 'Arnica Montana',
    potency: '1M',
    form: 'Dilution',
    batchNo: 'AM-2025-11',
    expiryDate: '2029-05-15',
    stockQuantity: 80,
    reorderLevel: 15,
    pricePerUnit: 120
  },
  {
    id: 'ph_4',
    name: 'Calendula Officinalis',
    potency: 'Q (Mother Tincture)',
    form: 'Mother Tincture',
    batchNo: 'CAL-2026-01',
    expiryDate: '2027-11-20',
    stockQuantity: 62,
    reorderLevel: 10,
    pricePerUnit: 150
  }
];

export const DEFAULT_LAB_TESTS: LabTestRecord[] = [
  {
    id: 'lab_1',
    testName: 'Complete Blood Count (CBC)',
    patientName: 'Savitri Devi',
    caseNo: 'IPD/2026/00714',
    requestedDate: '2026-07-16',
    status: 'Report Ready',
    resultSummary: 'Hb: 12.4 g/dL, WBC: 6,800 /cu.mm, ESR: 18 mm/hr',
    referenceRange: 'Hb (11.5 - 15.5 g/dL), WBC (4000 - 10000 /cu.mm)'
  },
  {
    id: 'lab_2',
    testName: 'Widal Slide Agglutination Test',
    patientName: 'Ramesh Chawla',
    caseNo: 'OPD/2026/04112',
    requestedDate: '2026-07-18',
    status: 'Sample Collected',
    resultSummary: 'Sample in processing in Microbiology Lab',
    referenceRange: 'Titre < 1:80 (Negative)'
  },
  {
    id: 'lab_3',
    testName: 'Stool Microscopic Examination',
    patientName: 'Anish Verma',
    caseNo: 'OPD/2026/04185',
    requestedDate: '2026-07-19',
    status: 'Ordered'
  }
];

export const DEPARTMENTS: Department[] = [
  {
    id: 'organon',
    name: 'Organon of Medicine & Homoeopathic Philosophy and Fundamentals of Psychology',
    code: 'DEPT-ORG',
    hod: 'Prof. (Dr.) A. K. Roy, M.D. (Hom.)',
    facultyCount: 6,
    description: 'Imparts rigorous classical training in the philosophy of Dr. Samuel Hahnemann, holistic disease evaluation, miasmatic analysis, and psychological principles integral to clinical case handling.',
    labs: ['Organon Philosophy Seminar Room', 'Computerized Logic & Case Analysis Lab']
  },
  {
    id: 'mat_medica',
    name: 'Homoeopathic Materia Medica',
    code: 'DEPT-MM',
    hod: 'Prof. (Dr.) S. N. Bhattacharya, M.D. (Hom.)',
    facultyCount: 8,
    description: 'Detailed study of Homoeopathic Materia Medica spanning BHMS 1st to 4th year, detailing drug proving principles, pathogenetic action, comparative drug pictures, and clinical verification.',
    labs: ['Drug Proving Laboratory', 'Botanical & Mineral Specimen Display Museum']
  },
  {
    id: 'repertory',
    name: 'Case Taking & Repertory',
    code: 'DEPT-REP',
    hod: 'Dr. M. Ghosh, M.D. (Hom.)',
    facultyCount: 5,
    description: 'Training in systematic clinical case taking, symptom evaluation, rubric selection, and repertorization using Kent, Boger, Boenninghausen, and computer software (RADAR Opus, Hompath, MacRepertory).',
    labs: ['Computer-Assisted Repertorization Lab (20 Workstations)', 'Case Record Archive']
  },
  {
    id: 'yoga',
    name: 'Department of Yoga',
    code: 'DEPT-YOGA',
    hod: 'Dr. P. K. Samanta, M.D. (Hom.), Dip. Yoga',
    facultyCount: 4,
    description: 'Integration of classical yogic science with clinical homoeopathic healthcare, emphasizing therapeutic yoga, meditation, pranayama, and lifestyle counselling.',
    labs: ['Yoga & Meditation Practice Hall', 'Therapeutic Yoga Studio']
  },
  {
    id: 'pharmacy',
    name: 'Homoeopathic Pharmacy',
    code: 'DEPT-PHARM',
    hod: 'Dr. R. Bannerjee, M.D. (Hom.)',
    facultyCount: 4,
    description: 'The science of preparing, compounding, standardizing, and dispensing homoeopathic potentized remedies from natural sources under HPI compliance.',
    labs: ['HPLC & Spectrophotometry Lab', 'Vehicle Preparation & Trituration Hall', 'Pharmacognosy Herbarium']
  },
  {
    id: 'anatomy',
    name: 'Anatomy',
    code: 'DEPT-ANAT',
    hod: 'Dr. P. Das, M.S. (Anatomy)',
    facultyCount: 4,
    description: 'Provides comprehensive gross anatomy cadaveric dissection, microscopic histology, embryology, and neuroanatomy education.',
    labs: ['Human Cadaveric Dissection Hall', 'Histology Microscopy Lab', 'Anatomy Embryology Museum']
  },
  {
    id: 'physiology',
    name: 'Physiology & Biochemistry',
    code: 'DEPT-PHYS',
    hod: 'Dr. S. Chatterjee, M.D. (Physiology)',
    facultyCount: 4,
    description: 'Study of normal human bodily functions, hematology, cardiovascular dynamics, spirometry, and metabolic biochemistry.',
    labs: ['Hematology Practical Lab', 'Clinical Biochemistry Analysis Room']
  },
  {
    id: 'pathology',
    name: 'Pathology & Microbiology',
    code: 'DEPT-PATH',
    hod: 'Dr. D. Sen, M.D. (Pathology)',
    facultyCount: 5,
    description: 'Covers general pathology, clinical microbiology, parasitology, bacterial cultures, hematology, and histopathology.',
    labs: ['Microbiology Culture Lab', 'Clinical Diagnostic Hematology Lab']
  },
  {
    id: 'forensic_med',
    name: 'Forensic Medicine & Toxicology',
    code: 'DEPT-FMT',
    hod: 'Dr. K. Nandi, M.D. (FMT)',
    facultyCount: 3,
    description: 'Medical jurisprudence, legal obligations of medical practitioners, toxicology identification, and court trial simulations.',
    labs: ['Toxicology Specimen & Weapon Museum', 'Courtroom Trial Simulation Setup']
  },
  {
    id: 'prac_med',
    name: 'Practice of Medicine',
    code: 'DEPT-MED',
    hod: 'Dr. T. K. Maiti, M.D. (Hom.)',
    facultyCount: 6,
    description: 'Comprehensive study of internal medicine conditions paired with their clinical homoeopathic therapeutics and OPD/IPD ward care.',
    labs: ['Clinical OPD Examination Bays', 'IPD Ward Demonstration Rounds']
  },
  {
    id: 'surgery',
    name: 'Surgery & Homoeopathic Therapeutics',
    code: 'DEPT-SURG',
    hod: 'Dr. S. K. Mitra, M.S. (Surgery)',
    facultyCount: 4,
    description: 'General surgical principles, wound care, minor operative techniques, and pre/post-operative homoeopathic management.',
    labs: ['Minor OT & Suture Practice Bay', 'Surgical Instrument Gallery']
  },
  {
    id: 'gynae_obs',
    name: 'Obstetrics & Gynaecology',
    code: 'DEPT-GYN',
    hod: 'Dr. N. Mukhopadhyay, M.D. (O&G)',
    facultyCount: 5,
    description: 'Antenatal care, labor monitoring, gynaecological disorders, and Homoeopathic therapeutics in female healthcare.',
    labs: ['Labor Room & Antenatal Care Bay', 'Pelvic Model Demonstration Hall']
  },
  {
    id: 'community_med',
    name: 'Community Medicine',
    code: 'DEPT-CM',
    hod: 'Dr. B. Biswas, M.D. (Community Medicine)',
    facultyCount: 3,
    description: 'Epidemiology, public health administration, preventive medicine, maternal & child health, and rural health camp management.',
    labs: ['Public Health & Hygiene Museum', 'Mobile Rural Health Camp Unit']
  }
];

export const FACULTY: FacultyMember[] = [
  {
    id: 'fac_1',
    name: 'Dr. S. K. Banerjea',
    designation: 'Professor & HOD',
    department: 'Materia Medica',
    qualification: 'MD (Hom)',
    experience: '28 Years',
    email: 'skbanerjea@bhmch.com',
    publications: 24
  },
  {
    id: 'fac_2',
    name: 'Dr. G. S. Lamba',
    designation: 'Professor & HOD',
    department: 'Organon of Medicine & Philosophy',
    qualification: 'MD (Hom)',
    experience: '24 Years',
    email: 'gslamba@bhmch.com',
    publications: 15
  },
  {
    id: 'fac_3',
    name: 'Dr. Vandana Gupta',
    designation: 'Professor & HOD',
    department: 'Homoeopathic Repertory',
    qualification: 'MD (Hom)',
    experience: '19 Years',
    email: 'vgupta@bhmch.com',
    publications: 12
  },
  {
    id: 'fac_4',
    name: 'Dr. Susmita Chatterjee',
    designation: 'Principal & HOD',
    department: 'Practice of Medicine',
    qualification: 'DHMS (West Bengal Council of Homoeopathic Medicine), MD (Organon of Medicine)',
    experience: '22 Years',
    email: 'principal@bhmch.com',
    publications: 18
  },
  {
    id: 'fac_5',
    name: 'Dr. Sunita Sharma',
    designation: 'Associate Professor',
    department: 'Gynecology & Obstetrics',
    qualification: 'MD (Hom)',
    experience: '14 Years',
    email: 'ssharma@bhmch.com',
    publications: 8
  },
  {
    id: 'fac_6',
    name: 'Dr. R. C. Mohanty',
    designation: 'Professor & HOD',
    department: 'Homoeopathic Pharmacy',
    qualification: 'MD (Hom)',
    experience: '20 Years',
    email: 'rcmohanty@bhmch.com',
    publications: 9
  },
  {
    id: 'fac_7',
    name: 'Dr. Amit Trivedi',
    designation: 'Assistant Professor',
    department: 'Materia Medica',
    qualification: 'MD (Hom)',
    experience: '6 Years',
    email: 'atrivedi@bhmch.com',
    publications: 3
  },
  {
    id: 'fac_8',
    name: 'Dr. Meera Nair',
    designation: 'Associate Professor',
    department: 'Homoeopathic Repertory',
    qualification: 'MD (Hom)',
    experience: '11 Years',
    email: 'mnair@bhmch.com',
    publications: 7
  }
];

export const STUDENTS: StudentRecord[] = [
  {
    id: 'std_1',
    name: 'Arjun Sen',
    rollNo: 'BHMS/2023/045',
    enrollmentNo: 'NCH-HOM-2023-8841',
    year: 'BHMS III',
    attendance: 88,
    gpa: 8.7,
    feesPaid: 125000,
    feesTotal: 150000,
    scholarship: 'State Merit Scholarship',
    clinicalPosting: 'Practice of Medicine OPD-3',
    email: 'arjun.sen@bhmch.com',
    phone: '+91 98765 43210'
  },
  {
    id: 'std_2',
    name: 'Priyanka Das',
    rollNo: 'BHMS/2022/012',
    enrollmentNo: 'NCH-HOM-2022-3102',
    year: 'BHMS IV',
    attendance: 94,
    gpa: 9.1,
    feesPaid: 150000,
    feesTotal: 150000,
    scholarship: 'NHA Meritorious Scholarship',
    clinicalPosting: 'Gynecology & Obstetrics Ward B',
    email: 'priyanka.das@bhmch.com',
    phone: '+91 91234 56789'
  },
  {
    id: 'std_3',
    name: 'Kabir Malhotra',
    rollNo: 'BHMS/2024/102',
    enrollmentNo: 'NCH-HOM-2024-9122',
    year: 'BHMS II',
    attendance: 79,
    gpa: 7.2,
    feesPaid: 100000,
    feesTotal: 150000,
    scholarship: 'None',
    clinicalPosting: 'Homoeopathic Pharmacy Potentization Lab',
    email: 'kabir.mal@bhmch.com',
    phone: '+91 88877 66554'
  },
  {
    id: 'std_4',
    name: 'Sneha Kulkarni',
    rollNo: 'BHMS/2021/004',
    enrollmentNo: 'NCH-HOM-2021-1254',
    year: 'Intern',
    attendance: 96,
    gpa: 8.9,
    feesPaid: 120000,
    feesTotal: 120000,
    scholarship: 'OBC Merit-Cum-Means',
    clinicalPosting: 'IPD Ward 4 (Acute Care)',
    email: 'sneha.kul@bhmch.com',
    phone: '+91 77766 55443'
  },
  {
    id: 'std_5',
    name: 'Rohan Mehra',
    rollNo: 'BHMS/2025/078',
    enrollmentNo: 'NCH-HOM-2025-0451',
    year: 'BHMS I',
    attendance: 85,
    gpa: 7.8,
    feesPaid: 150000,
    feesTotal: 150000,
    scholarship: 'None',
    clinicalPosting: 'Anatomy Dissection Hall',
    email: 'rohan.m@bhmch.com',
    phone: '+91 99988 87776'
  }
];

export const PATIENTS: PatientRecord[] = [
  {
    id: 'pat_1',
    caseNo: 'OPD/2026/04112',
    name: 'Ramesh Chawla',
    age: 44,
    gender: 'Male',
    dateRegistered: '2026-07-15',
    type: 'OPD',
    department: 'Practice of Medicine',
    complaint: 'Chronic allergic rhinitis, watery discharge, sneezing worse in cold air, relief with warm drinks.',
    homoeopathicRemedy: 'Arsenicum Album',
    potency: '30C',
    status: 'Recovered',
    doctor: 'Dr. Susmita Chatterjee'
  },
  {
    id: 'pat_2',
    caseNo: 'IPD/2026/00714',
    name: 'Savitri Devi',
    age: 62,
    gender: 'Female',
    dateRegistered: '2026-07-10',
    type: 'IPD',
    department: 'Gynecology & Obstetrics',
    complaint: 'Uterine fibroids, dragging down pain in lower abdomen, hot flushes, highly irritable mood.',
    homoeopathicRemedy: 'Sepia Officinalis',
    potency: '200C',
    status: 'Under Treatment',
    doctor: 'Dr. Sunita Sharma'
  },
  {
    id: 'pat_3',
    caseNo: 'OPD/2026/04185',
    name: 'Anish Verma',
    age: 9,
    gender: 'Male',
    dateRegistered: '2026-07-18',
    type: 'OPD',
    department: 'Materia Medica',
    complaint: 'Enuresis (bedwetting), fear of dark, clinging to mother, timid temperament, likes sweets.',
    homoeopathicRemedy: 'Pulsatilla Nigricans',
    potency: '200C',
    status: 'Under Treatment',
    doctor: 'Dr. S. K. Banerjea'
  },
  {
    id: 'pat_4',
    caseNo: 'OPD/2026/04200',
    name: 'Vikram Singh',
    age: 51,
    gender: 'Male',
    dateRegistered: '2026-07-19',
    type: 'OPD',
    department: 'Surgery & Homoeopathic Therapeutics',
    complaint: 'Fistula-in-ano, sharp splinter-like pain during stool, highly sensitive to cold water.',
    homoeopathicRemedy: 'Nitricum Acidum',
    potency: '200C',
    status: 'Under Treatment',
    doctor: 'Dr. Rajesh Patel'
  },
  {
    id: 'pat_5',
    caseNo: 'IPD/2026/00732',
    name: 'Meena Saxena',
    age: 38,
    gender: 'Female',
    dateRegistered: '2026-07-12',
    type: 'IPD',
    department: 'Practice of Medicine',
    complaint: 'Severe gastric burning, flatulence, abdominal bloating starting 4 PM, relief after passing gas.',
    homoeopathicRemedy: 'Lycopodium Clavatum',
    potency: '1M',
    status: 'Discharged',
    doctor: 'Dr. Susmita Chatterjee'
  }
];

export const NOTICES: Notice[] = [
  {
    id: 'ntc_1',
    title: 'BHMS Annual University Examination Schedule 2026',
    category: 'Examination',
    date: '2026-07-18',
    content: 'The National Commission for Homoeopathy (NCH) has approved the annual professional theory examinations. Exams start on August 10, 2026. Hall tickets can be collected from July 28 onwards.',
    isPinned: true,
    attachmentName: 'Syllabus_Exam_Dates_2026.pdf'
  },
  {
    id: 'ntc_2',
    title: 'Mandatory Clinical Posting Cycle for III & IV Year BHMS',
    category: 'Academic',
    date: '2026-07-15',
    content: 'Clinical postings at the associated BURDWAN HOMOEOPATHIC MEDICAL COLLEGE & HOSPITAL (Teaching Hospital) have been updated. Ensure logbooks are signed daily by respective HODs. 85% attendance is required to appear in final assessments.',
    isPinned: true,
    attachmentName: 'Clinical_Rotation_Chart_Q3.pdf'
  },
  {
    id: 'ntc_3',
    title: 'Free Mega Homoeopathic Medical Camp on World Health Day',
    category: 'Hospital',
    date: '2026-07-14',
    content: 'Our Hospital is organizing a free diagnostic and prescribing health camp focusing on chronic rheumatological, dermatological, and pediatric diseases. All faculty, interns, and postgraduate scholars must attend.',
    isPinned: false,
    attachmentName: 'Medical_Camp_Duty_List.pdf'
  },
  {
    id: 'ntc_4',
    title: 'National Commission for Homoeopathy (NCH) Curriculum Guidelines',
    category: 'Admission',
    date: '2026-07-10',
    content: 'Updates to the competency-based curriculum have been issued by the NCH under Ministry of AYUSH. New practical assessment marks will include organon archives case presentations.',
    isPinned: false,
    attachmentName: 'NCH_Competency_Curriculum_2026.pdf'
  },
  {
    id: 'ntc_5',
    title: 'PG Seminar & Materia Medica Research Symposium',
    category: 'General',
    date: '2026-07-08',
    content: 'Symposium on "Scientific Verification of High-Potency Homoeopathic Dilutions" will take place on August 3rd, 2026, in the main college auditorium. Guest Speaker: Senior Researcher from IIT Bombay.',
    isPinned: false,
    attachmentName: 'Symposium_Brochure.pdf'
  }
];

export const GALLERY: GalleryAlbum[] = [
  {
    id: 'gal_1',
    title: 'Annual Hahnemann Day Celebrations',
    description: 'Celebrating the birth anniversary of Dr. Samuel Hahnemann with medical exhibits and classical homoeopathic presentations.',
    coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600',
    category: 'Campus',
    date: '2026-04-10'
  },
  {
    id: 'gal_2',
    title: 'IPD Clinical Case Conference',
    description: 'Postgraduate scholars and senior interns reviewing difficult case takes in the repertorization laboratory.',
    coverImage: 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&q=80&w=600',
    category: 'Clinical Training',
    date: '2026-06-22'
  },
  {
    id: 'gal_3',
    title: 'International Seminar on Organon Philosophy',
    description: 'Expert talks delivered by globally renowned homoeopathic clinicians regarding chronic miasmatic diagnosis.',
    coverImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600',
    category: 'Seminars',
    date: '2026-05-15'
  },
  {
    id: 'gal_4',
    title: 'Free Ayush Rural Outreach Clinic',
    description: 'Interns and faculty operating a mobile dispensary in rural tribal communities, diagnosing and dispensing free homoeopathic remedies.',
    coverImage: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=600',
    category: 'Social Service',
    date: '2026-07-02'
  }
];

export const MOCK_BOOKINGS: ServiceBooking[] = [
  {
    id: 'bk_1',
    serviceType: 'Academic Transcript Issue',
    studentId: 'std_1',
    studentName: 'Arjun Sen',
    bookingDate: '2026-07-16',
    prefDate: '2026-07-22',
    prefTime: '11:00 AM',
    documentsUploaded: ['BHMS_1_Marksheet.pdf', 'BHMS_2_Marksheet.pdf'],
    status: 'Approved',
    history: [
      { status: 'Submitted', note: 'Request initiated by student with necessary documents.', date: '2026-07-16' },
      { status: 'Approved', note: 'All marksheet verifications completed by Registrar office.', date: '2026-07-17' }
    ]
  },
  {
    id: 'bk_2',
    serviceType: 'NOC for Hospital Internship',
    studentId: 'std_2',
    studentName: 'Priyanka Das',
    bookingDate: '2026-07-18',
    prefDate: '2026-07-25',
    prefTime: '02:30 PM',
    documentsUploaded: ['Course_Completion_Cert.pdf'],
    status: 'In Progress',
    history: [
      { status: 'Submitted', note: 'Internship transfer No-Objection Certificate request submitted.', date: '2026-07-18' },
      { status: 'In Progress', note: 'Pending HOD Practice of Medicine department signature.', date: '2026-07-19' }
    ]
  },
  {
    id: 'bk_3',
    serviceType: 'Library Card Extension',
    studentId: 'std_3',
    studentName: 'Kabir Malhotra',
    bookingDate: '2026-07-19',
    prefDate: '2026-07-20',
    prefTime: '10:00 AM',
    documentsUploaded: ['Current_ID_Card.pdf'],
    status: 'Pending',
    history: [
      { status: 'Submitted', note: 'Requested extension of borrowing card to standard 4 books limit.', date: '2026-07-19' }
    ]
  }
];

export const COURSES: Course[] = [
  {
    id: 'crs_bhms',
    name: 'Bachelor of Homoeopathic Medicine and Surgery (BHMS)',
    duration: '5.5 Years (including 1 Year compulsory clinical internship)',
    intake: 50,
    eligibility: '10+2 with Physics, Chemistry, Biology & English (NEET Qualified under AYUSH stream)',
    syllabusOverview: [
      'First Professional: Anatomy, Physiology & Biochemistry, Homoeopathic Pharmacy, Organon of Medicine (Principles)',
      'Second Professional: Pathology & Microbiology, Forensic Medicine & Toxicology, Homoeopathic Materia Medica, Organon',
      'Third Professional: Surgery & Therapeutics, Gynecology & Obstetrics & Therapeutics, Organon & Homoeopathic Philosophy',
      'Fourth Professional: Practice of Medicine & Therapeutics, Homoeopathic Repertory, Community Medicine',
      'Compulsory Internship: 12 months rotational duty across OPD/IPD departments including rural clinics'
    ]
  }
];

export const FEEDBACK_LIST: FeedbackSubmission[] = [
  {
    id: 'fb_1',
    name: 'Santosh Kumar',
    email: 'santosh.k@gmail.com',
    role: 'Patient',
    subject: 'Excellent skin OPD treatment',
    message: 'I was suffering from chronic psoriasis for 5 years with no relief in allopathy. Within 4 months of treatment with Thuja 200 at this college hospital, my lesions have completely disappeared. The student clinical interns were very thorough and polite.',
    rating: 5,
    date: '2026-07-15'
  },
  {
    id: 'fb_2',
    name: 'Alumni Dr. Ritu Kapoor',
    email: 'ritukapoor@gmail.com',
    role: 'Alumni',
    subject: 'Proud of our college infrastructure',
    message: 'Visiting the newly established repertory computer lab was fantastic. AI integrated repertorization will help student analytical skills immensely.',
    rating: 5,
    date: '2026-07-12'
  }
];

export const GENERAL_STATS = {
  totalStudents: 315,
  totalFaculty: 42,
  totalBeds: 30,
  dailyOpdCount: 250,
  researchProjects: 18,
  ayushRating: 'Grade A (Govt. Aided)',
  successRate: '95.6%'
};

export const HOSPITAL_ANALYTICS = [
  { month: 'Jan', opd: 6200, ipd: 310, cures: 5800 },
  { month: 'Feb', opd: 6800, ipd: 340, cures: 6400 },
  { month: 'Mar', opd: 7400, ipd: 380, cures: 7100 },
  { month: 'Apr', opd: 8100, ipd: 410, cures: 7800 },
  { month: 'May', opd: 8500, ipd: 440, cures: 8200 },
  { month: 'Jun', opd: 9200, ipd: 480, cures: 8900 },
  { month: 'Jul', opd: 9600, ipd: 510, cures: 9200 }
];

export const FINANCE_ANALYTICS = [
  { category: 'Student Fees', value: 7200000, color: '#3b82f6' },
  { category: 'Hospital OPD Fees', value: 1200000, color: '#10b981' },
  { category: 'Government Grants', value: 3400000, color: '#8b5cf6' },
  { category: 'Alumni Donations', value: 450000, color: '#f59e0b' },
  { category: 'Research Funding', value: 850000, color: '#ec4899' }
];

export const ADMISSION_TRENDS = [
  { year: '2022', bhms: 50, md: 0, applications: 1240 },
  { year: '2023', bhms: 50, md: 0, applications: 1480 },
  { year: '2024', bhms: 50, md: 0, applications: 1720 },
  { year: '2025', bhms: 50, md: 0, applications: 1950 },
  { year: '2026', bhms: 50, md: 0, applications: 2280 }
];

export const RESEARCH_BY_DEPT = [
  { department: 'Materia Medica', publications: 32, clinicalTrials: 5 },
  { department: 'Organon', publications: 21, clinicalTrials: 2 },
  { department: 'Repertory', publications: 18, clinicalTrials: 4 },
  { department: 'Pharmacy', publications: 15, clinicalTrials: 6 },
  { department: 'Practice of Medicine', publications: 42, clinicalTrials: 12 },
  { department: 'Gynae & Obs', publications: 24, clinicalTrials: 8 }
];
