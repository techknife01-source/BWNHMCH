export interface IpdAdmission {
  id: string;
  ipdNo: string; // e.g. IPD-2026-001
  uhid: string;
  patientName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  bloodGroup: string;
  admittedAt: string; // ISO or formatted date time
  admittingDoctorId: string;
  admittingDoctorName: string;
  department: string;
  wardId: string;
  wardName: string;
  roomId: string;
  roomNo: string;
  bedId: string;
  bedNo: string;
  primaryDiagnosis: string;
  miasmaticDiagnosis: 'Psora' | 'Sycosis' | 'Syphilis' | 'Tubercular' | 'Mixed Miasm';
  admissionType: 'Emergency' | 'Routine OPD Transfer' | 'Referral';
  status: 'ADMITTED' | 'TRANSFERRED' | 'DISCHARGED' | 'LAMA' | 'DECEASED';
  depositAmount: number;
  paymentStatus: 'PAID' | 'PENDING' | 'PARTIAL';
  attendantName: string;
  attendantPhone: string;
  dischargeDate?: string;
  dischargeSummary?: string;
  conditionOnDischarge?: 'Cured' | 'Improved' | 'Unchanged' | 'Referred' | 'Expired';
}

export interface WardInfo {
  id: string;
  name: string;
  code: string;
  genderRestriction: 'Male' | 'Female' | 'Any' | 'Paediatric';
  nurseInCharge: string;
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;
  maintenanceBeds: number;
}

export interface RoomInfo {
  id: string;
  wardId: string;
  wardName: string;
  roomNo: string;
  roomType: 'General Ward Room' | 'Semi-Private Cabin' | 'Deluxe Private Cabin' | 'Isolation Room' | 'ICU Cubicle';
  chargePerDay: number;
  amenities: string[];
  status: 'OPERATIONAL' | 'FULL' | 'MAINTENANCE';
}

export interface BedInfo {
  id: string;
  bedNo: string;
  wardId: string;
  wardName: string;
  roomId: string;
  roomNo: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'RESERVED' | 'DIRTY_CLEANING';
  currentIpdNo?: string;
  currentPatientName?: string;
  currentUhid?: string;
  lastCleanedAt?: string;
}

export interface ClinicalNote {
  id: string;
  ipdNo: string;
  uhid: string;
  doctorId: string;
  doctorName: string;
  noteType: 'Daily Ward Round' | 'Initial Case History' | 'Consultant Note' | 'Emergency Note';
  timestamp: string;
  subjectiveSymptoms: string; // Chief Complaints & Modalities
  objectiveFindings: string;  // Physical Generals & Systemic Exam
  assessment: string;         // Miasmatic Evaluation & Progress
  plan: string;               // Remedy Potency Plan & Auxiliaries
}

export interface PrescriptionItem {
  id: string;
  remedyName: string; // e.g. Arsenicum Album, Sulphur, Nux Vomica
  potency: 'Q (Mother Tincture)' | '3C' | '6C' | '30C' | '200C' | '1M' | '10M' | '50M' | 'CM' | 'LM1' | 'LM2';
  dosage: '1 Dose Daily' | 'BD (Twice Daily)' | 'TDS (3 Times Daily)' | 'QID (4 Times Daily)' | 'SOS (As Needed)' | 'Single Dose Stat';
  repetitionDays: string; // e.g., '3 Days', '7 Days', '14 Days'
  vehicle: 'Globules No. 20' | 'Sugar of Milk (Sac Lac)' | 'Distilled Water Liquid' | 'Mother Tincture Drop' | 'Ointment';
  instructions: string; // e.g., 'Take on empty stomach, avoid camphor/coffee'
}

export interface PrescriptionRecord {
  id: string;
  ipdNo: string;
  uhid: string;
  patientName: string;
  doctorName: string;
  timestamp: string;
  remedies: PrescriptionItem[];
  auxiliaryAdvice: string;
  dietaryRegimen: string;
}

export interface TreatmentPlan {
  id: string;
  ipdNo: string;
  uhid: string;
  patientName: string;
  miasmaticDiagnosis: string;
  potencyProgressionStrategy: string;
  dietaryRegimen: string;
  lifestyleAdvice: string;
  repertorialBasis: string;
  targetOutcomeDays: number;
  createdAt: string;
}

export interface NursingNote {
  id: string;
  ipdNo: string;
  uhid: string;
  nurseName: string;
  shift: 'Morning Shift (7 AM - 3 PM)' | 'Evening Shift (3 PM - 11 PM)' | 'Night Shift (11 PM - 7 AM)';
  timestamp: string;
  careGiven: string;
  medicationAdministered: string;
  patientCondition: 'Stable' | 'Improving' | 'Critical' | 'Guarded';
}

export interface VitalSignRecord {
  id: string;
  ipdNo: string;
  uhid: string;
  timestamp: string;
  bpSystolic: number;
  bpDiastolic: number;
  pulseRate: number;
  temperatureF: number;
  spO2: number;
  respRate: number;
  bloodSugarMgDl?: number;
  recordedBy: string;
}

export interface InvestigationRequest {
  id: string;
  ipdNo: string;
  uhid: string;
  patientName: string;
  requisitionDate: string;
  requestedBy: string;
  testCategory: 'Pathology' | 'Haematology' | 'Biochemistry' | 'Radiology / X-Ray' | 'ECG' | 'Stool & Urine';
  testsRequested: string[];
  urgency: 'Routine' | 'Urgent' | 'STAT / Emergency';
  status: 'REQUESTED' | 'SAMPLE_COLLECTED' | 'IN_PROCESS' | 'REPORT_READY' | 'COMPLETED';
  reportFindings?: string;
  reportFileUrl?: string;
}

export interface AllergyInfo {
  id: string;
  allergen: string;
  category: 'Drug / Remedy' | 'Food' | 'Environmental' | 'Contact';
  severity: 'Mild' | 'Moderate' | 'Severe / Anaphylactic';
  reaction: string;
}

export interface PatientMedicalProfile {
  uhid: string;
  chiefComplaints: string;
  hpi: string; // History of Present Illness
  pastMedicalHistory: string;
  familyHistory: string;
  personalHistory: string; // Thermal, Thirst, Cravings, Sleep, Mind
  thermalPreference: 'Hot Patient' | 'Chilly Patient' | 'Ambithermal';
  miasmaticBackground: string;
  allergies: AllergyInfo[];
}

export interface TimelineEvent {
  id: string;
  ipdNo: string;
  uhid: string;
  timestamp: string;
  eventType: 'ADMISSION' | 'VITAL_CHECK' | 'WARD_ROUND' | 'PRESCRIPTION' | 'INVESTIGATION' | 'TRANSFER' | 'DISCHARGE';
  title: string;
  description: string;
  performerName: string;
}

export interface ClinicalAlert {
  id: string;
  ipdNo?: string;
  uhid?: string;
  patientName?: string;
  bedNo?: string;
  title: string;
  message: string;
  alertType: 'CRITICAL_VITAL' | 'LAB_RESULT_READY' | 'MEDICATION_DUE' | 'DOCTOR_REVIEW' | 'TRANSFER_REQ';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  timestamp: string;
  isRead: boolean;
}

export interface BedTransferRecord {
  id: string;
  ipdNo: string;
  patientName: string;
  fromWard: string;
  fromBed: string;
  toWard: string;
  toBed: string;
  reason: string;
  transferredBy: string;
  timestamp: string;
}
