import {
  IpdAdmission,
  WardInfo,
  RoomInfo,
  BedInfo,
  ClinicalNote,
  PrescriptionRecord,
  TreatmentPlan,
  NursingNote,
  VitalSignRecord,
  InvestigationRequest,
  PatientMedicalProfile,
  TimelineEvent,
  ClinicalAlert,
  BedTransferRecord,
} from '../types/clinical';

// Seed Wards
const INITIAL_WARDS: WardInfo[] = [
  { id: 'ward-m', name: 'Male IPD Ward', code: 'MW', genderRestriction: 'Male', nurseInCharge: 'Sr. Nurse Sima Das', totalBeds: 20, occupiedBeds: 3, availableBeds: 16, maintenanceBeds: 1 },
  { id: 'ward-f', name: 'Female IPD Ward', code: 'FW', genderRestriction: 'Female', nurseInCharge: 'Sr. Nurse Rina Ghosh', totalBeds: 20, occupiedBeds: 2, availableBeds: 17, maintenanceBeds: 1 },
  { id: 'ward-p', name: 'Paediatric Ward', code: 'PW', genderRestriction: 'Paediatric', nurseInCharge: 'Nurse Kakali Sen', totalBeds: 10, occupiedBeds: 1, availableBeds: 9, maintenanceBeds: 0 },
  { id: 'ward-mat', name: 'Maternity & Gynaec Ward', code: 'GYNW', genderRestriction: 'Female', nurseInCharge: 'Sr. Nurse Anita Roy', totalBeds: 12, occupiedBeds: 1, availableBeds: 11, maintenanceBeds: 0 },
  { id: 'ward-icu', name: 'Special Care / ICU Ward', code: 'ICU', genderRestriction: 'Any', nurseInCharge: 'Sr. Nurse Sujata Mukherjee', totalBeds: 8, occupiedBeds: 1, availableBeds: 7, maintenanceBeds: 0 },
];

// Seed Rooms
const INITIAL_ROOMS: RoomInfo[] = [
  { id: 'rm-101', wardId: 'ward-m', wardName: 'Male IPD Ward', roomNo: 'M-101', roomType: 'General Ward Room', chargePerDay: 150, amenities: ['Ceiling Fans', 'Shared Bathroom', 'Attendant Stool'], status: 'OPERATIONAL' },
  { id: 'rm-102', wardId: 'ward-m', wardName: 'Male IPD Ward', roomNo: 'M-102', roomType: 'Semi-Private Cabin', chargePerDay: 400, amenities: ['2 Beds', 'Attached Bath', 'TV', 'Air Cooler'], status: 'OPERATIONAL' },
  { id: 'rm-201', wardId: 'ward-f', wardName: 'Female IPD Ward', roomNo: 'F-201', roomType: 'General Ward Room', chargePerDay: 150, amenities: ['Ceiling Fans', 'Shared Bath', 'Curtain Partitions'], status: 'OPERATIONAL' },
  { id: 'rm-202', wardId: 'ward-f', wardName: 'Female IPD Ward', roomNo: 'F-202', roomType: 'Deluxe Private Cabin', chargePerDay: 800, amenities: ['Single Bed', 'AC', 'Attached Bath', 'Sofa', 'TV'], status: 'OPERATIONAL' },
  { id: 'rm-p01', wardId: 'ward-p', wardName: 'Paediatric Ward', roomNo: 'P-301', roomType: 'General Ward Room', chargePerDay: 150, amenities: ['Toys Corner', 'Paediatric Cot', 'Shared Bath'], status: 'OPERATIONAL' },
  { id: 'rm-icu1', wardId: 'ward-icu', wardName: 'Special Care / ICU Ward', roomNo: 'ICU-01', roomType: 'ICU Cubicle', chargePerDay: 1500, amenities: ['Multipara Monitor', 'Oxygen Line', 'Suction', 'Infusion Pump'], status: 'OPERATIONAL' },
];

// Seed Beds
const INITIAL_BEDS: BedInfo[] = [
  { id: 'bed-m101-a', bedNo: 'M-101-A', wardId: 'ward-m', wardName: 'Male IPD Ward', roomId: 'rm-101', roomNo: 'M-101', status: 'OCCUPIED', currentIpdNo: 'IPD-2026-0001', currentPatientName: 'Rajesh Kumar Sharma', currentUhid: 'BHMC-2026-0001' },
  { id: 'bed-m101-b', bedNo: 'M-101-B', wardId: 'ward-m', wardName: 'Male IPD Ward', roomId: 'rm-101', roomNo: 'M-101', status: 'OCCUPIED', currentIpdNo: 'IPD-2026-0004', currentPatientName: 'Subhasish Banerjee', currentUhid: 'BHMC-2026-0005' },
  { id: 'bed-m102-a', bedNo: 'M-102-A', wardId: 'ward-m', wardName: 'Male IPD Ward', roomId: 'rm-102', roomNo: 'M-102', status: 'OCCUPIED', currentIpdNo: 'IPD-2026-0005', currentPatientName: 'Arunangshu Roy', currentUhid: 'BHMC-2026-0003' },
  { id: 'bed-m102-b', bedNo: 'M-102-B', wardId: 'ward-m', wardName: 'Male IPD Ward', roomId: 'rm-102', roomNo: 'M-102', status: 'AVAILABLE' },
  { id: 'bed-f201-a', bedNo: 'F-201-A', wardId: 'ward-f', wardName: 'Female IPD Ward', roomId: 'rm-201', roomNo: 'F-201', status: 'OCCUPIED', currentIpdNo: 'IPD-2026-0002', currentPatientName: 'Anita Chatterji', currentUhid: 'BHMC-2026-0002' },
  { id: 'bed-f201-b', bedNo: 'F-201-B', wardId: 'ward-f', wardName: 'Female IPD Ward', roomId: 'rm-201', roomNo: 'F-201', status: 'DIRTY_CLEANING' },
  { id: 'bed-f202-a', bedNo: 'F-202-A', wardId: 'ward-f', wardName: 'Female IPD Ward', roomId: 'rm-202', roomNo: 'F-202', status: 'OCCUPIED', currentIpdNo: 'IPD-2026-0003', currentPatientName: 'Meenakshi Sen', currentUhid: 'BHMC-2026-0004' },
  { id: 'bed-p301-a', bedNo: 'P-301-A', wardId: 'ward-p', wardName: 'Paediatric Ward', roomId: 'rm-p01', roomNo: 'P-301', status: 'AVAILABLE' },
  { id: 'bed-icu01-a', bedNo: 'ICU-01-A', wardId: 'ward-icu', wardName: 'Special Care / ICU Ward', roomId: 'rm-icu1', roomNo: 'ICU-01', status: 'OCCUPIED', currentIpdNo: 'IPD-2026-0006', currentPatientName: 'Gouranga Paul', currentUhid: 'BHMC-2026-0006' },
];

// Seed IPD Admissions
const INITIAL_ADMISSIONS: IpdAdmission[] = [
  {
    id: 'ipd-1',
    ipdNo: 'IPD-2026-0001',
    uhid: 'BHMC-2026-0001',
    patientName: 'Rajesh Kumar Sharma',
    age: 42,
    gender: 'Male',
    phone: '9830123456',
    bloodGroup: 'B+',
    admittedAt: '2026-07-22 10:30 AM',
    admittingDoctorId: 'doc-1',
    admittingDoctorName: 'Dr. Subhash Chandra Roy',
    department: 'Organon of Medicine',
    wardId: 'ward-m',
    wardName: 'Male IPD Ward',
    roomId: 'rm-101',
    roomNo: 'M-101',
    bedId: 'bed-m101-a',
    bedNo: 'M-101-A',
    primaryDiagnosis: 'Exacerbation of Severe Bronchial Asthma with Allergic Rhinitis',
    miasmaticDiagnosis: 'Psora',
    admissionType: 'Emergency',
    status: 'ADMITTED',
    depositAmount: 1500,
    paymentStatus: 'PAID',
    attendantName: 'Sujata Sharma',
    attendantPhone: '9830987654',
  },
  {
    id: 'ipd-2',
    ipdNo: 'IPD-2026-0002',
    uhid: 'BHMC-2026-0002',
    patientName: 'Anita Chatterji',
    age: 34,
    gender: 'Female',
    phone: '9434112233',
    bloodGroup: 'O+',
    admittedAt: '2026-07-23 02:15 PM',
    admittingDoctorId: 'doc-2',
    admittingDoctorName: 'Dr. Pratima Das',
    department: 'Materia Medica',
    wardId: 'ward-f',
    wardName: 'Female IPD Ward',
    roomId: 'rm-201',
    roomNo: 'F-201',
    bedId: 'bed-f201-a',
    bedNo: 'F-201-A',
    primaryDiagnosis: 'Acute Severe Migraine & Gastric Ulceration',
    miasmaticDiagnosis: 'Psora',
    admissionType: 'Routine OPD Transfer',
    status: 'ADMITTED',
    depositAmount: 0,
    paymentStatus: 'PAID',
    attendantName: 'Subir Chatterji',
    attendantPhone: '9434998877',
  },
  {
    id: 'ipd-3',
    ipdNo: 'IPD-2026-0003',
    uhid: 'BHMC-2026-0004',
    patientName: 'Meenakshi Sen',
    age: 58,
    gender: 'Female',
    phone: '9800445566',
    bloodGroup: 'AB+',
    admittedAt: '2026-07-20 09:00 AM',
    admittingDoctorId: 'doc-5',
    admittingDoctorName: 'Dr. Kakali Ghosh',
    department: 'Gynaecology & Obstetrics',
    wardId: 'ward-f',
    wardName: 'Female IPD Ward',
    roomId: 'rm-202',
    roomNo: 'F-202',
    bedId: 'bed-f202-a',
    bedNo: 'F-202-A',
    primaryDiagnosis: 'Chronic Osteoarthritis with Post-Menopausal Syndrome',
    miasmaticDiagnosis: 'Sycosis',
    admissionType: 'Routine OPD Transfer',
    status: 'ADMITTED',
    depositAmount: 3000,
    paymentStatus: 'PAID',
    attendantName: 'Dipankar Sen',
    attendantPhone: '9800112233',
  },
  {
    id: 'ipd-5',
    ipdNo: 'IPD-2026-0005',
    uhid: 'BHMC-2026-0003',
    patientName: 'Arunangshu Roy',
    age: 21,
    gender: 'Male',
    phone: '9732001122',
    bloodGroup: 'A+',
    admittedAt: '2026-07-24 11:45 AM',
    admittingDoctorId: 'doc-3',
    admittingDoctorName: 'Dr. Anupam Mukherjee',
    department: 'Repertory',
    wardId: 'ward-m',
    wardName: 'Male IPD Ward',
    roomId: 'rm-102',
    roomNo: 'M-102',
    bedId: 'bed-m102-a',
    bedNo: 'M-102-A',
    primaryDiagnosis: 'Widespread Exfoliative Eczematous Dermatitis',
    miasmaticDiagnosis: 'Psora',
    admissionType: 'Routine OPD Transfer',
    status: 'ADMITTED',
    depositAmount: 500,
    paymentStatus: 'PAID',
    attendantName: 'Purnima Roy',
    attendantPhone: '9732554433',
  },
];

// Seed Clinical Notes
const INITIAL_CLINICAL_NOTES: ClinicalNote[] = [
  {
    id: 'cn-1',
    ipdNo: 'IPD-2026-0001',
    uhid: 'BHMC-2026-0001',
    doctorId: 'doc-1',
    doctorName: 'Dr. Subhash Chandra Roy',
    noteType: 'Daily Ward Round',
    timestamp: '2026-07-25 09:30 AM',
    subjectiveSymptoms: 'Wheezing slightly diminished after Arsenicum Album 30C dose at night. Desires warm drinks. Restless around 1-2 AM.',
    objectiveFindings: 'Bilateral rhonchi present in lower lung zones. SpO2 97% on room air. BP 122/80 mmHg. Tongue clean with red tip.',
    assessment: 'Psoric manifestation resolving. Constitutional response favorable.',
    plan: 'Continue Sac Lac TDS. Monitor SpO2 4th hourly. Nebulization with steam only.',
  },
  {
    id: 'cn-2',
    ipdNo: 'IPD-2026-0002',
    uhid: 'BHMC-2026-0002',
    doctorId: 'doc-2',
    doctorName: 'Dr. Pratima Das',
    noteType: 'Initial Case History',
    timestamp: '2026-07-23 03:00 PM',
    subjectiveSymptoms: 'Throbbing right-sided temporal headache aggravated by noise and bright sunlight. Nausea and acrid eructations.',
    objectiveFindings: 'Pulse 82/min, regular. BP 118/76 mmHg. Mild epigastric tenderness on deep palpation.',
    assessment: 'Acute psoric headache storm. Miasmatic baseline: Psoric with gastric irritability.',
    plan: 'Belladonna 200C stat dose, followed by Sac Lac 2 hourly.',
  },
];

// Seed Prescriptions
const INITIAL_PRESCRIPTIONS: PrescriptionRecord[] = [
  {
    id: 'rx-1',
    ipdNo: 'IPD-2026-0001',
    uhid: 'BHMC-2026-0001',
    patientName: 'Rajesh Kumar Sharma',
    doctorName: 'Dr. Subhash Chandra Roy',
    timestamp: '2026-07-24 10:00 AM',
    remedies: [
      {
        id: 'rx-item-1',
        remedyName: 'Arsenicum Album',
        potency: '30C',
        dosage: 'TDS (3 Times Daily)',
        repetitionDays: '3 Days',
        vehicle: 'Globules No. 20',
        instructions: 'Take 4 globules dry on tongue before meals',
      },
      {
        id: 'rx-item-2',
        remedyName: 'Blatta Orientalis',
        potency: 'Q (Mother Tincture)',
        dosage: 'TDS (3 Times Daily)',
        repetitionDays: '5 Days',
        vehicle: 'Mother Tincture Drop',
        instructions: '10 drops in 1/4th cup warm water during dyspnoea episodes',
      },
    ],
    auxiliaryAdvice: 'Maintain elevated pillow posture. Avoid cold water and direct air conditioner draft.',
    dietaryRegimen: 'Warm sago gruel, light vegetable soup, steam inhalation twice daily.',
  },
];

// Seed Treatment Plans
const INITIAL_TREATMENT_PLANS: TreatmentPlan[] = [
  {
    id: 'tp-1',
    ipdNo: 'IPD-2026-0001',
    uhid: 'BHMC-2026-0001',
    patientName: 'Rajesh Kumar Sharma',
    miasmaticDiagnosis: 'Primary Psoric with Sycotic overlay (chronic mucous discharge)',
    potencyProgressionStrategy: 'Start with 30C centesimal scale during acute dyspnoea, progress to 200C and 1M LM scale for constitutional cure after discharge.',
    dietaryRegimen: 'Warm non-spicy diet, avoid curd, sour foods, and cold carbonated drinks.',
    lifestyleAdvice: 'Breathe clean dust-free air, avoid damp environments, light chest physiotherapy.',
    repertorialBasis: 'Boenninghausen Repertory: Respiratory dyspnoea < night 1-3 AM, > warm drinks.',
    targetOutcomeDays: 7,
    createdAt: '2026-07-22',
  },
];

// Seed Nursing Notes
const INITIAL_NURSING_NOTES: NursingNote[] = [
  {
    id: 'nn-1',
    ipdNo: 'IPD-2026-0001',
    uhid: 'BHMC-2026-0001',
    nurseName: 'Sr. Nurse Sima Das',
    shift: 'Morning Shift (7 AM - 3 PM)',
    timestamp: '2026-07-25 08:00 AM',
    careGiven: 'Morning sponge bath given, bed linen changed, oxygen cannula checked.',
    medicationAdministered: 'Arsenicum Album 30C (4 globules) given at 08:00 AM. Sac Lac given at 12:00 PM.',
    patientCondition: 'Stable',
  },
];

// Seed Vitals
const INITIAL_VITALS: VitalSignRecord[] = [
  { id: 'v-1', ipdNo: 'IPD-2026-0001', uhid: 'BHMC-2026-0001', timestamp: '2026-07-25 08:00 AM', bpSystolic: 122, bpDiastolic: 80, pulseRate: 76, temperatureF: 98.4, spO2: 97, respRate: 18, bloodSugarMgDl: 110, recordedBy: 'Sr. Nurse Sima Das' },
  { id: 'v-2', ipdNo: 'IPD-2026-0001', uhid: 'BHMC-2026-0001', timestamp: '2026-07-24 08:00 PM', bpSystolic: 128, bpDiastolic: 84, pulseRate: 82, temperatureF: 99.1, spO2: 95, respRate: 22, bloodSugarMgDl: 125, recordedBy: 'Nurse Kakali Sen' },
  { id: 'v-3', ipdNo: 'IPD-2026-0002', uhid: 'BHMC-2026-0002', timestamp: '2026-07-25 09:00 AM', bpSystolic: 118, bpDiastolic: 76, pulseRate: 72, temperatureF: 98.2, spO2: 99, respRate: 16, bloodSugarMgDl: 95, recordedBy: 'Sr. Nurse Rina Ghosh' },
];

// Seed Investigation Requests
const INITIAL_INVESTIGATIONS: InvestigationRequest[] = [
  {
    id: 'inv-1',
    ipdNo: 'IPD-2026-0001',
    uhid: 'BHMC-2026-0001',
    patientName: 'Rajesh Kumar Sharma',
    requisitionDate: '2026-07-22',
    requestedBy: 'Dr. Subhash Chandra Roy',
    testCategory: 'Haematology',
    testsRequested: ['Complete Blood Count (CBC)', 'Absolute Eosinophil Count (AEC)', 'Erythrocyte Sedimentation Rate (ESR)'],
    urgency: 'Routine',
    status: 'COMPLETED',
    reportFindings: 'Hb: 13.8 g/dL, WBC: 8,400 /uL, AEC: 650 /uL (Elevated eosinophils confirming allergic origin), ESR: 22 mm/hr.',
  },
  {
    id: 'inv-2',
    ipdNo: 'IPD-2026-0001',
    uhid: 'BHMC-2026-0001',
    patientName: 'Rajesh Kumar Sharma',
    requisitionDate: '2026-07-23',
    requestedBy: 'Dr. Subhash Chandra Roy',
    testCategory: 'Radiology / X-Ray',
    testsRequested: ['Chest X-Ray PA View'],
    urgency: 'Urgent',
    status: 'REPORT_READY',
    reportFindings: 'Hyperinflated lung fields bilateral, prominent bronchovascular markings. No focal parenchymal consolidation or effusion.',
  },
  {
    id: 'inv-3',
    ipdNo: 'IPD-2026-0002',
    uhid: 'BHMC-2026-0002',
    patientName: 'Anita Chatterji',
    requisitionDate: '2026-07-24',
    requestedBy: 'Dr. Pratima Das',
    testCategory: 'Biochemistry',
    testsRequested: ['Serum Electrolytes', 'Liver Function Test (LFT)'],
    urgency: 'Routine',
    status: 'IN_PROCESS',
  },
];

// Seed Medical Profiles
const INITIAL_MEDICAL_PROFILES: Record<string, PatientMedicalProfile> = {
  'BHMC-2026-0001': {
    uhid: 'BHMC-2026-0001',
    chiefComplaints: 'Dyspnoea with wheezing < midnight 1 AM - 2 AM, dry suffocating cough, acrid nasal discharge.',
    hpi: 'Patient suffers from recurrent asthmatic attacks since 4 years, aggravated after rain and dust exposure. Relieved by hot drinks and sitting propped up.',
    pastMedicalHistory: 'History of eczema suppressed in childhood with topical steroid ointments at age 12.',
    familyHistory: 'Father had chronic bronchitis; Paternal grandmother had bronchial asthma.',
    personalHistory: 'Thirst: Intense thirst for small quantities of cold water at frequent intervals. Appetite: Normal. Sleep: Restless sleep with anxious dreams.',
    thermalPreference: 'Chilly Patient',
    miasmaticBackground: 'Psoric base with latent Sycosis due to suppressed skin eruption.',
    allergies: [
      { id: 'alg-1', allergen: 'Dust & Mites', category: 'Environmental', severity: 'Severe / Anaphylactic', reaction: 'Immediate bronchospasm & sneezing fits' },
      { id: 'alg-2', allergen: 'Pollen', category: 'Environmental', severity: 'Moderate', reaction: 'Lacrimation and watery nasal discharge' },
    ],
  },
};

// Seed Timelines
const INITIAL_TIMELINES: TimelineEvent[] = [
  { id: 'tl-1', ipdNo: 'IPD-2026-0001', uhid: 'BHMC-2026-0001', timestamp: '2026-07-22 10:30 AM', eventType: 'ADMISSION', title: 'IPD Admission Recorded', description: 'Admitted to Male IPD Ward, Bed M-101-A under Dr. Subhash Chandra Roy', performerName: 'Reception & IPD Desk' },
  { id: 'tl-2', ipdNo: 'IPD-2026-0001', uhid: 'BHMC-2026-0001', timestamp: '2026-07-22 11:00 AM', eventType: 'VITAL_CHECK', title: 'Initial Vitals Logged', description: 'BP: 130/85, Pulse: 88, SpO2: 94% on room air', performerName: 'Sr. Nurse Sima Das' },
  { id: 'tl-3', ipdNo: 'IPD-2026-0001', uhid: 'BHMC-2026-0001', timestamp: '2026-07-22 12:15 PM', eventType: 'PRESCRIPTION', title: 'Acute Remedy Prescribed', description: 'Arsenicum Album 30C TDS & Blatta Orientalis Q prescribed', performerName: 'Dr. Subhash Chandra Roy' },
  { id: 'tl-4', ipdNo: 'IPD-2026-0001', uhid: 'BHMC-2026-0001', timestamp: '2026-07-23 09:30 AM', eventType: 'INVESTIGATION', title: 'CBC & AEC Requisition', description: 'Blood sample drawn for haematology panel', performerName: 'Pathology Lab' },
  { id: 'tl-5', ipdNo: 'IPD-2026-0001', uhid: 'BHMC-2026-0001', timestamp: '2026-07-24 10:00 AM', eventType: 'WARD_ROUND', title: 'Consultant Ward Round Note', description: 'SpO2 improved to 97%. Respiratory distress reduced significantly', performerName: 'Dr. Subhash Chandra Roy' },
];

// Seed Clinical Alerts
const INITIAL_CLINICAL_ALERTS: ClinicalAlert[] = [
  { id: 'ca-1', ipdNo: 'IPD-2026-0001', uhid: 'BHMC-2026-0001', patientName: 'Rajesh Kumar Sharma', bedNo: 'M-101-A', title: 'SpO2 Drop Alert', message: 'SpO2 recorded at 94% on 22nd July. Monitor respiratory status.', alertType: 'CRITICAL_VITAL', severity: 'HIGH', timestamp: '2 days ago', isRead: true },
  { id: 'ca-2', ipdNo: 'IPD-2026-0001', uhid: 'BHMC-2026-0001', patientName: 'Rajesh Kumar Sharma', bedNo: 'M-101-A', title: 'X-Ray Report Ready', message: 'Chest X-Ray PA View report uploaded by Radiology.', alertType: 'LAB_RESULT_READY', severity: 'MEDIUM', timestamp: '1 day ago', isRead: false },
  { id: 'ca-3', ipdNo: 'IPD-2026-0002', uhid: 'BHMC-2026-0002', patientName: 'Anita Chatterji', bedNo: 'F-201-A', title: 'Daily Homoeopathic Dose Due', message: 'Sac Lac dose scheduled for 02:00 PM in Female Ward.', alertType: 'MEDICATION_DUE', severity: 'LOW', timestamp: '30 mins ago', isRead: false },
];

// LocalStorage Persistence Keys
const STORAGE_KEYS = {
  ADMISSIONS: 'bhmc_ipd_admissions',
  WARDS: 'bhmc_ipd_wards',
  ROOMS: 'bhmc_ipd_rooms',
  BEDS: 'bhmc_ipd_beds',
  NOTES: 'bhmc_clinical_notes',
  PRESCRIPTIONS: 'bhmc_prescriptions',
  TREATMENT_PLANS: 'bhmc_treatment_plans',
  NURSING_NOTES: 'bhmc_nursing_notes',
  VITALS: 'bhmc_vitals',
  INVESTIGATIONS: 'bhmc_investigations',
  PROFILES: 'bhmc_medical_profiles',
  TIMELINES: 'bhmc_timelines',
  ALERTS: 'bhmc_clinical_alerts',
  TRANSFERS: 'bhmc_bed_transfers',
};

const getFromStorage = <T>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

const saveToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save clinical data:', e);
  }
};

class HospitalClinicalService {
  private admissions: IpdAdmission[] = getFromStorage(STORAGE_KEYS.ADMISSIONS, INITIAL_ADMISSIONS);
  private wards: WardInfo[] = getFromStorage(STORAGE_KEYS.WARDS, INITIAL_WARDS);
  private rooms: RoomInfo[] = getFromStorage(STORAGE_KEYS.ROOMS, INITIAL_ROOMS);
  private beds: BedInfo[] = getFromStorage(STORAGE_KEYS.BEDS, INITIAL_BEDS);
  private clinicalNotes: ClinicalNote[] = getFromStorage(STORAGE_KEYS.NOTES, INITIAL_CLINICAL_NOTES);
  private prescriptions: PrescriptionRecord[] = getFromStorage(STORAGE_KEYS.PRESCRIPTIONS, INITIAL_PRESCRIPTIONS);
  private treatmentPlans: TreatmentPlan[] = getFromStorage(STORAGE_KEYS.TREATMENT_PLANS, INITIAL_TREATMENT_PLANS);
  private nursingNotes: NursingNote[] = getFromStorage(STORAGE_KEYS.NURSING_NOTES, INITIAL_NURSING_NOTES);
  private vitals: VitalSignRecord[] = getFromStorage(STORAGE_KEYS.VITALS, INITIAL_VITALS);
  private investigations: InvestigationRequest[] = getFromStorage(STORAGE_KEYS.INVESTIGATIONS, INITIAL_INVESTIGATIONS);
  private profiles: Record<string, PatientMedicalProfile> = getFromStorage(STORAGE_KEYS.PROFILES, INITIAL_MEDICAL_PROFILES);
  private timelines: TimelineEvent[] = getFromStorage(STORAGE_KEYS.TIMELINES, INITIAL_TIMELINES);
  private alerts: ClinicalAlert[] = getFromStorage(STORAGE_KEYS.ALERTS, INITIAL_CLINICAL_ALERTS);
  private transfers: BedTransferRecord[] = getFromStorage(STORAGE_KEYS.TRANSFERS, []);

  // IPD Admissions
  getAdmissions(statusFilter?: string, wardFilter?: string, search?: string): IpdAdmission[] {
    return this.admissions.filter((adm) => {
      const matchStatus = !statusFilter || statusFilter === 'ALL' || adm.status === statusFilter;
      const matchWard = !wardFilter || wardFilter === 'ALL' || adm.wardId === wardFilter;
      const q = (search || '').toLowerCase();
      const matchSearch =
        !q ||
        adm.patientName.toLowerCase().includes(q) ||
        adm.ipdNo.toLowerCase().includes(q) ||
        adm.uhid.toLowerCase().includes(q) ||
        adm.bedNo.toLowerCase().includes(q);

      return matchStatus && matchWard && matchSearch;
    });
  }

  getAdmissionByIpdNo(ipdNo: string): IpdAdmission | undefined {
    return this.admissions.find((a) => a.ipdNo.toLowerCase() === ipdNo.toLowerCase() || a.id === ipdNo);
  }

  admitPatient(data: {
    uhid: string;
    patientName: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    phone: string;
    bloodGroup: string;
    admittingDoctorId: string;
    admittingDoctorName: string;
    department: string;
    wardId: string;
    roomId: string;
    bedId: string;
    primaryDiagnosis: string;
    miasmaticDiagnosis: 'Psora' | 'Sycosis' | 'Syphilis' | 'Tubercular' | 'Mixed Miasm';
    admissionType: 'Emergency' | 'Routine OPD Transfer' | 'Referral';
    depositAmount: number;
    attendantName: string;
    attendantPhone: string;
  }): IpdAdmission {
    const nextNum = this.admissions.length + 1;
    const ipdNo = `IPD-2026-${String(nextNum).padStart(4, '0')}`;

    const ward = this.wards.find((w) => w.id === data.wardId);
    const room = this.rooms.find((r) => r.id === data.roomId);
    const bed = this.beds.find((b) => b.id === data.bedId);

    const newAdmission: IpdAdmission = {
      id: `ipd-${Date.now()}`,
      ipdNo,
      uhid: data.uhid,
      patientName: data.patientName,
      age: data.age,
      gender: data.gender,
      phone: data.phone,
      bloodGroup: data.bloodGroup,
      admittedAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      admittingDoctorId: data.admittingDoctorId,
      admittingDoctorName: data.admittingDoctorName,
      department: data.department,
      wardId: data.wardId,
      wardName: ward ? ward.name : 'IPD Ward',
      roomId: data.roomId,
      roomNo: room ? room.roomNo : 'General',
      bedId: data.bedId,
      bedNo: bed ? bed.bedNo : 'BED-01',
      primaryDiagnosis: data.primaryDiagnosis,
      miasmaticDiagnosis: data.miasmaticDiagnosis,
      admissionType: data.admissionType,
      status: 'ADMITTED',
      depositAmount: data.depositAmount,
      paymentStatus: 'PAID',
      attendantName: data.attendantName,
      attendantPhone: data.attendantPhone,
    };

    // Update Bed state
    if (bed) {
      bed.status = 'OCCUPIED';
      bed.currentIpdNo = ipdNo;
      bed.currentPatientName = data.patientName;
      bed.currentUhid = data.uhid;
      saveToStorage(STORAGE_KEYS.BEDS, this.beds);
    }

    // Update Ward counters
    if (ward) {
      ward.occupiedBeds += 1;
      ward.availableBeds = Math.max(0, ward.totalBeds - ward.occupiedBeds - ward.maintenanceBeds);
      saveToStorage(STORAGE_KEYS.WARDS, this.wards);
    }

    this.admissions.unshift(newAdmission);
    saveToStorage(STORAGE_KEYS.ADMISSIONS, this.admissions);

    // Add Timeline Event
    this.addTimelineEvent({
      ipdNo,
      uhid: data.uhid,
      eventType: 'ADMISSION',
      title: 'IPD Admission Form Filled',
      description: `Admitted to ${ward?.name || 'Ward'}, Bed ${bed?.bedNo || ''} under ${data.admittingDoctorName}`,
      performerName: 'IPD Desk Officer',
    });

    return newAdmission;
  }

  // Transfer Bed/Ward Workflow
  transferPatientBed(
    ipdNo: string,
    toWardId: string,
    toRoomId: string,
    toBedId: string,
    reason: string,
    transferredBy: string
  ): void {
    const admission = this.admissions.find((a) => a.ipdNo === ipdNo);
    if (!admission) return;

    const oldWardId = admission.wardId;
    const oldBedId = admission.bedId;
    const oldBedNo = admission.bedNo;

    const toWard = this.wards.find((w) => w.id === toWardId);
    const toRoom = this.rooms.find((r) => r.id === toRoomId);
    const toBed = this.beds.find((b) => b.id === toBedId);

    // Release Old Bed
    const oldBed = this.beds.find((b) => b.id === oldBedId);
    if (oldBed) {
      oldBed.status = 'DIRTY_CLEANING';
      oldBed.currentIpdNo = undefined;
      oldBed.currentPatientName = undefined;
      oldBed.currentUhid = undefined;
    }

    // Occupy New Bed
    if (toBed) {
      toBed.status = 'OCCUPIED';
      toBed.currentIpdNo = ipdNo;
      toBed.currentPatientName = admission.patientName;
      toBed.currentUhid = admission.uhid;
    }

    // Update Ward stats
    const oldWard = this.wards.find((w) => w.id === oldWardId);
    if (oldWard) {
      oldWard.occupiedBeds = Math.max(0, oldWard.occupiedBeds - 1);
      oldWard.availableBeds = Math.max(0, oldWard.totalBeds - oldWard.occupiedBeds - oldWard.maintenanceBeds);
    }
    if (toWard) {
      toWard.occupiedBeds += 1;
      toWard.availableBeds = Math.max(0, toWard.totalBeds - toWard.occupiedBeds - toWard.maintenanceBeds);
    }

    // Update Admission record
    admission.wardId = toWardId;
    admission.wardName = toWard ? toWard.name : admission.wardName;
    admission.roomId = toRoomId;
    admission.roomNo = toRoom ? toRoom.roomNo : admission.roomNo;
    admission.bedId = toBedId;
    admission.bedNo = toBed ? toBed.bedNo : admission.bedNo;

    // Log Transfer
    const transferRecord: BedTransferRecord = {
      id: `tr-${Date.now()}`,
      ipdNo,
      patientName: admission.patientName,
      fromWard: oldWard?.name || 'Previous Ward',
      fromBed: oldBedNo,
      toWard: toWard?.name || 'New Ward',
      toBed: toBed?.bedNo || 'New Bed',
      reason,
      transferredBy,
      timestamp: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
    };

    this.transfers.unshift(transferRecord);

    saveToStorage(STORAGE_KEYS.ADMISSIONS, this.admissions);
    saveToStorage(STORAGE_KEYS.BEDS, this.beds);
    saveToStorage(STORAGE_KEYS.WARDS, this.wards);
    saveToStorage(STORAGE_KEYS.TRANSFERS, this.transfers);

    this.addTimelineEvent({
      ipdNo,
      uhid: admission.uhid,
      eventType: 'TRANSFER',
      title: 'Bed / Ward Transfer Complete',
      description: `Transferred from Bed ${oldBedNo} to Bed ${toBed?.bedNo}. Reason: ${reason}`,
      performerName: transferredBy,
    });
  }

  // Discharge Workflow
  dischargePatient(
    ipdNo: string,
    dischargeType: 'DISCHARGED' | 'LAMA' | 'DECEASED',
    summary: string,
    conditionOnDischarge: 'Cured' | 'Improved' | 'Unchanged' | 'Referred' | 'Expired'
  ): void {
    const admission = this.admissions.find((a) => a.ipdNo === ipdNo);
    if (!admission) return;

    admission.status = dischargeType;
    admission.dischargeDate = new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
    admission.dischargeSummary = summary;
    admission.conditionOnDischarge = conditionOnDischarge;

    // Free Bed
    const bed = this.beds.find((b) => b.id === admission.bedId);
    if (bed) {
      bed.status = 'DIRTY_CLEANING';
      bed.currentIpdNo = undefined;
      bed.currentPatientName = undefined;
      bed.currentUhid = undefined;
    }

    // Update Ward Stats
    const ward = this.wards.find((w) => w.id === admission.wardId);
    if (ward) {
      ward.occupiedBeds = Math.max(0, ward.occupiedBeds - 1);
      ward.availableBeds = Math.max(0, ward.totalBeds - ward.occupiedBeds - ward.maintenanceBeds);
    }

    saveToStorage(STORAGE_KEYS.ADMISSIONS, this.admissions);
    saveToStorage(STORAGE_KEYS.BEDS, this.beds);
    saveToStorage(STORAGE_KEYS.WARDS, this.wards);

    this.addTimelineEvent({
      ipdNo,
      uhid: admission.uhid,
      eventType: 'DISCHARGE',
      title: `Patient ${dischargeType}`,
      description: `Discharge summary recorded. Condition: ${conditionOnDischarge}. Notes: ${summary.slice(0, 80)}...`,
      performerName: admission.admittingDoctorName,
    });
  }

  // Wards, Rooms, Beds
  getWards(): WardInfo[] {
    return this.wards;
  }

  getRooms(wardId?: string): RoomInfo[] {
    return this.rooms.filter((r) => !wardId || wardId === 'ALL' || r.wardId === wardId);
  }

  getBeds(wardId?: string, roomId?: string, statusFilter?: string): BedInfo[] {
    return this.beds.filter((b) => {
      const mWard = !wardId || wardId === 'ALL' || b.wardId === wardId;
      const mRoom = !roomId || roomId === 'ALL' || b.roomId === roomId;
      const mStatus = !statusFilter || statusFilter === 'ALL' || b.status === statusFilter;
      return mWard && mRoom && mStatus;
    });
  }

  updateBedStatus(bedId: string, status: BedInfo['status']): void {
    const bed = this.beds.find((b) => b.id === bedId);
    if (bed) {
      bed.status = status;
      if (status === 'AVAILABLE' || status === 'MAINTENANCE') {
        bed.lastCleanedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      saveToStorage(STORAGE_KEYS.BEDS, this.beds);
    }
  }

  // Clinical Notes
  getClinicalNotes(ipdNo: string): ClinicalNote[] {
    return this.clinicalNotes.filter((n) => n.ipdNo === ipdNo);
  }

  addClinicalNote(data: Omit<ClinicalNote, 'id' | 'timestamp'>): ClinicalNote {
    const note: ClinicalNote = {
      ...data,
      id: `cn-${Date.now()}`,
      timestamp: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
    };

    this.clinicalNotes.unshift(note);
    saveToStorage(STORAGE_KEYS.NOTES, this.clinicalNotes);

    this.addTimelineEvent({
      ipdNo: data.ipdNo,
      uhid: data.uhid,
      eventType: 'WARD_ROUND',
      title: `${data.noteType} Entry`,
      description: `${data.doctorName}: ${data.assessment}`,
      performerName: data.doctorName,
    });

    return note;
  }

  // Prescriptions
  getPrescriptions(ipdNo: string): PrescriptionRecord[] {
    return this.prescriptions.filter((p) => p.ipdNo === ipdNo);
  }

  addPrescription(data: Omit<PrescriptionRecord, 'id' | 'timestamp'>): PrescriptionRecord {
    const rx: PrescriptionRecord = {
      ...data,
      id: `rx-${Date.now()}`,
      timestamp: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
    };

    this.prescriptions.unshift(rx);
    saveToStorage(STORAGE_KEYS.PRESCRIPTIONS, this.prescriptions);

    const remedyNames = rx.remedies.map((r) => `${r.remedyName} ${r.potency}`).join(', ');

    this.addTimelineEvent({
      ipdNo: data.ipdNo,
      uhid: data.uhid,
      eventType: 'PRESCRIPTION',
      title: 'New Homoeopathic Prescription',
      description: `Remedies: ${remedyNames}. Regimen: ${data.dietaryRegimen}`,
      performerName: data.doctorName,
    });

    return rx;
  }

  // Treatment Plans
  getTreatmentPlan(ipdNo: string): TreatmentPlan | undefined {
    return this.treatmentPlans.find((tp) => tp.ipdNo === ipdNo);
  }

  saveTreatmentPlan(data: Omit<TreatmentPlan, 'id' | 'createdAt'>): TreatmentPlan {
    let plan = this.treatmentPlans.find((tp) => tp.ipdNo === data.ipdNo);
    if (plan) {
      Object.assign(plan, data);
    } else {
      plan = {
        ...data,
        id: `tp-${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
      };
      this.treatmentPlans.unshift(plan);
    }
    saveToStorage(STORAGE_KEYS.TREATMENT_PLANS, this.treatmentPlans);
    return plan;
  }

  // Nursing Notes & Vitals
  getNursingNotes(ipdNo: string): NursingNote[] {
    return this.nursingNotes.filter((nn) => nn.ipdNo === ipdNo);
  }

  addNursingNote(data: Omit<NursingNote, 'id' | 'timestamp'>): NursingNote {
    const note: NursingNote = {
      ...data,
      id: `nn-${Date.now()}`,
      timestamp: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
    };
    this.nursingNotes.unshift(note);
    saveToStorage(STORAGE_KEYS.NURSING_NOTES, this.nursingNotes);
    return note;
  }

  getVitals(ipdNo: string): VitalSignRecord[] {
    return this.vitals.filter((v) => v.ipdNo === ipdNo);
  }

  addVitalSign(data: Omit<VitalSignRecord, 'id' | 'timestamp'>): VitalSignRecord {
    const v: VitalSignRecord = {
      ...data,
      id: `v-${Date.now()}`,
      timestamp: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
    };
    this.vitals.unshift(v);
    saveToStorage(STORAGE_KEYS.VITALS, this.vitals);

    // Alert check if SpO2 < 95 or BP Systolic > 140
    if (data.spO2 < 95 || data.bpSystolic > 140) {
      this.addAlert({
        ipdNo: data.ipdNo,
        uhid: data.uhid,
        title: 'Abnormal Vital Warning',
        message: `BP: ${data.bpSystolic}/${data.bpDiastolic}, Pulse: ${data.pulseRate}, SpO2: ${data.spO2}%. Immediate clinical review advised.`,
        alertType: 'CRITICAL_VITAL',
        severity: 'HIGH',
      });
    }

    this.addTimelineEvent({
      ipdNo: data.ipdNo,
      uhid: data.uhid,
      eventType: 'VITAL_CHECK',
      title: 'Vital Signs Recorded',
      description: `BP ${data.bpSystolic}/${data.bpDiastolic} mmHg | Temp ${data.temperatureF}°F | Pulse ${data.pulseRate}/min | SpO2 ${data.spO2}%`,
      performerName: data.recordedBy,
    });

    return v;
  }

  // Investigation Requests
  getInvestigations(ipdNo?: string): InvestigationRequest[] {
    return this.investigations.filter((inv) => !ipdNo || inv.ipdNo === ipdNo);
  }

  addInvestigationRequest(data: Omit<InvestigationRequest, 'id' | 'requisitionDate' | 'status'>): InvestigationRequest {
    const req: InvestigationRequest = {
      ...data,
      id: `inv-${Date.now()}`,
      requisitionDate: new Date().toISOString().split('T')[0],
      status: 'REQUESTED',
    };
    this.investigations.unshift(req);
    saveToStorage(STORAGE_KEYS.INVESTIGATIONS, this.investigations);

    this.addTimelineEvent({
      ipdNo: data.ipdNo,
      uhid: data.uhid,
      eventType: 'INVESTIGATION',
      title: `${data.testCategory} Requisition`,
      description: `Tests: ${data.testsRequested.join(', ')} (${data.urgency})`,
      performerName: data.requestedBy,
    });

    return req;
  }

  updateInvestigationStatus(id: string, status: InvestigationRequest['status'], findings?: string): void {
    const inv = this.investigations.find((i) => i.id === id);
    if (inv) {
      inv.status = status;
      if (findings) inv.reportFindings = findings;
      saveToStorage(STORAGE_KEYS.INVESTIGATIONS, this.investigations);

      if (status === 'REPORT_READY' || status === 'COMPLETED') {
        this.addAlert({
          ipdNo: inv.ipdNo,
          uhid: inv.uhid,
          patientName: inv.patientName,
          title: 'Lab Report Ready',
          message: `${inv.testCategory} report completed for ${inv.patientName}.`,
          alertType: 'LAB_RESULT_READY',
          severity: 'MEDIUM',
        });
      }
    }
  }

  // Medical Profile & Allergy Information
  getMedicalProfile(uhid: string): PatientMedicalProfile {
    if (!this.profiles[uhid]) {
      this.profiles[uhid] = {
        uhid,
        chiefComplaints: '',
        hpi: '',
        pastMedicalHistory: '',
        familyHistory: '',
        personalHistory: '',
        thermalPreference: 'Ambithermal',
        miasmaticBackground: 'Psoric',
        allergies: [],
      };
    }
    return this.profiles[uhid];
  }

  saveMedicalProfile(profile: PatientMedicalProfile): void {
    this.profiles[profile.uhid] = profile;
    saveToStorage(STORAGE_KEYS.PROFILES, this.profiles);
  }

  // Patient Timeline
  getTimeline(ipdNo: string): TimelineEvent[] {
    return this.timelines
      .filter((tl) => tl.ipdNo === ipdNo)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  addTimelineEvent(data: Omit<TimelineEvent, 'id' | 'timestamp'>): void {
    const event: TimelineEvent = {
      ...data,
      id: `tl-${Date.now()}`,
      timestamp: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
    };
    this.timelines.unshift(event);
    saveToStorage(STORAGE_KEYS.TIMELINES, this.timelines);
  }

  // Clinical Alerts & Notifications
  getAlerts(): ClinicalAlert[] {
    return this.alerts;
  }

  addAlert(data: Omit<ClinicalAlert, 'id' | 'timestamp' | 'isRead'>): ClinicalAlert {
    const alert: ClinicalAlert = {
      ...data,
      id: `ca-${Date.now()}`,
      timestamp: 'Just now',
      isRead: false,
    };
    this.alerts.unshift(alert);
    saveToStorage(STORAGE_KEYS.ALERTS, this.alerts);
    return alert;
  }

  markAlertRead(id: string): void {
    const alert = this.alerts.find((a) => a.id === id);
    if (alert) {
      alert.isRead = true;
      saveToStorage(STORAGE_KEYS.ALERTS, this.alerts);
    }
  }

  // Get Hospital IPD Quick Summary
  getIpdSummary() {
    const totalAdmitted = this.admissions.filter((a) => a.status === 'ADMITTED').length;
    const totalBeds = this.beds.length;
    const occupiedBeds = this.beds.filter((b) => b.status === 'OCCUPIED').length;
    const availableBeds = this.beds.filter((b) => b.status === 'AVAILABLE').length;
    const cleaningBeds = this.beds.filter((b) => b.status === 'DIRTY_CLEANING').length;

    return {
      totalAdmitted,
      totalBeds,
      occupiedBeds,
      availableBeds,
      cleaningBeds,
      occupancyRate: totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0,
      unreadAlertsCount: this.alerts.filter((a) => !a.isRead).length,
    };
  }
}

export const hospitalClinicalService = new HospitalClinicalService();
