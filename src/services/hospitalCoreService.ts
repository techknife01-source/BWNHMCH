import {
  Patient,
  OpdToken,
  DoctorSchedule,
  DepartmentInfo,
  AppointmentRecord,
  ReceptionNotification,
  ReceptionSettings,
  HospitalStats,
} from '../types/hospital';
import { adminHrService } from './adminHrService';

// Initial Mock Data
const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pat-101',
    uhid: 'BHMC-2026-0001',
    fullName: 'Rajesh Kumar Sharma',
    age: 42,
    gender: 'Male',
    phone: '9830123456',
    email: 'rajesh.sharma@example.com',
    address: '12 GT Road, Burdwan, West Bengal - 713101',
    bloodGroup: 'B+',
    category: 'General',
    registeredAt: '2026-01-10',
    lastVisitDate: '2026-07-25',
    emergencyContactName: 'Sujata Sharma',
    emergencyContactPhone: '9830987654',
    medicalHistory: 'Chronic Allergic Rhinitis, Arthralgia in left knee.',
    allergies: 'Dust, Pollen',
    totalVisits: 5,
  },
  {
    id: 'pat-102',
    uhid: 'BHMC-2026-0002',
    fullName: 'Anita Chatterji',
    age: 34,
    gender: 'Female',
    phone: '9434112233',
    email: 'anita.c@example.com',
    address: '45 Station Road, Katwa, Burdwan - 713130',
    bloodGroup: 'O+',
    category: 'BPL',
    registeredAt: '2026-02-15',
    lastVisitDate: '2026-07-24',
    emergencyContactName: 'Subir Chatterji',
    emergencyContactPhone: '9434998877',
    medicalHistory: 'Migraine with aura, Gastric acidity.',
    allergies: 'None',
    totalVisits: 3,
  },
  {
    id: 'pat-103',
    uhid: 'BHMC-2026-0003',
    fullName: 'Arunangshu Roy',
    age: 21,
    gender: 'Male',
    phone: '9732001122',
    email: 'arun.roy@student.bhmc.edu',
    address: 'Hostel No. 2, BHMC Campus, Burdwan',
    bloodGroup: 'A+',
    category: 'Student',
    registeredAt: '2026-03-01',
    lastVisitDate: '2026-07-20',
    emergencyContactName: 'Purnima Roy',
    emergencyContactPhone: '9732554433',
    medicalHistory: 'Eczematous skin rashes on forearms.',
    allergies: 'Sulfur compounds',
    totalVisits: 2,
  },
  {
    id: 'pat-104',
    uhid: 'BHMC-2026-0004',
    fullName: 'Meenakshi Sen',
    age: 58,
    gender: 'Female',
    phone: '9800445566',
    address: '78 Park Avenue, Kalna, Burdwan - 713409',
    bloodGroup: 'AB+',
    category: 'General',
    registeredAt: '2026-05-12',
    lastVisitDate: '2026-07-18',
    emergencyContactName: 'Dipankar Sen',
    emergencyContactPhone: '9800112233',
    medicalHistory: 'Post-menopausal insomnia, Hypertension.',
    allergies: 'Penicillin',
    totalVisits: 4,
  },
];

const INITIAL_DOCTORS: DoctorSchedule[] = [
  {
    id: 'doc-1',
    name: 'Dr. Subhash Chandra Roy',
    qualification: 'D.M.S., M.D. (Hom.)',
    department: 'Organon of Medicine',
    designation: 'Senior Consultant & HOD',
    roomNo: 'OPD Room 101',
    opdSchedule: 'Mon, Wed, Fri (09:00 AM - 01:00 PM)',
    availableDays: ['Mon', 'Wed', 'Fri'],
    isAvailable: true,
    maxDailyTokens: 30,
    currentServingToken: 3,
    totalTokensIssued: 8,
    imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80',
    specialization: 'Chronic Miasmatic Diseases & Constitutional Homoeopathy',
    dutyShift: 'Morning (9 AM - 1 PM)',
  },
  {
    id: 'doc-2',
    name: 'Dr. Pratima Das',
    qualification: 'M.D. (Hom.) Materia Medica',
    department: 'Materia Medica',
    designation: 'Associate Professor & OPD Specialist',
    roomNo: 'OPD Room 102',
    opdSchedule: 'Tue, Thu, Sat (10:00 AM - 02:00 PM)',
    availableDays: ['Tue', 'Thu', 'Sat'],
    isAvailable: true,
    maxDailyTokens: 25,
    currentServingToken: 2,
    totalTokensIssued: 6,
    imageUrl: 'https://images.unsplash.com/photo-1594824813566-78a9364f21d3?auto=format&fit=crop&w=300&q=80',
    specialization: 'Dermatological Disorders & Keynote Materia Medica',
    dutyShift: 'Morning (9 AM - 1 PM)',
  },
  {
    id: 'doc-3',
    name: 'Dr. Anupam Mukherjee',
    qualification: 'M.D. (Hom.) Repertory',
    department: 'Repertory',
    designation: 'OPD Consultant Doctor',
    roomNo: 'OPD Room 103',
    opdSchedule: 'Mon - Sat (09:30 AM - 01:30 PM)',
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    isAvailable: true,
    maxDailyTokens: 35,
    currentServingToken: 5,
    totalTokensIssued: 12,
    imageUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=300&q=80',
    specialization: 'Computerized Repertorization & Complex Acute Cases',
    dutyShift: 'Morning (9 AM - 1 PM)',
  },
  {
    id: 'doc-4',
    name: 'Dr. Sudipta Bandyopadhyay',
    qualification: 'M.D. (Hom.) Practice of Medicine',
    department: 'Practice of Medicine',
    designation: 'Professor & Clinical In-Charge',
    roomNo: 'OPD Room 104',
    opdSchedule: 'Mon - Fri (10:00 AM - 02:00 PM)',
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    isAvailable: false,
    maxDailyTokens: 30,
    currentServingToken: 0,
    totalTokensIssued: 4,
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80',
    specialization: 'General Internal Medicine, Gastro & Respiratory Ailments',
    dutyShift: 'Morning (9 AM - 1 PM)',
  },
  {
    id: 'doc-5',
    name: 'Dr. Kakali Ghosh',
    qualification: 'M.D. (Hom.) Gynaecology & Obstetrics',
    department: 'Gynaecology & Obstetrics',
    designation: 'Associate Professor',
    roomNo: 'OPD Room 105',
    opdSchedule: 'Mon, Tue, Thu, Sat (10:00 AM - 02:00 PM)',
    availableDays: ['Mon', 'Tue', 'Thu', 'Sat'],
    isAvailable: true,
    maxDailyTokens: 25,
    currentServingToken: 1,
    totalTokensIssued: 5,
    imageUrl: 'https://images.unsplash.com/photo-1594824813566-78a9364f21d3?auto=format&fit=crop&w=300&q=80',
    specialization: 'Female Health, Infertility & Paediatric Care',
    dutyShift: 'Morning (9 AM - 1 PM)',
  },
];

const INITIAL_DEPARTMENTS: DepartmentInfo[] = [
  { id: 'dept-1', name: 'Organon of Medicine', code: 'ORG', headOfDepartment: 'Dr. Subhash Chandra Roy', opdRoom: 'Room 101', activeDoctorsCount: 1, waitingTokensCount: 4, completedTodayCount: 3 },
  { id: 'dept-2', name: 'Materia Medica', code: 'MM', headOfDepartment: 'Dr. Pratima Das', opdRoom: 'Room 102', activeDoctorsCount: 1, waitingTokensCount: 3, completedTodayCount: 2 },
  { id: 'dept-3', name: 'Repertory', code: 'REP', headOfDepartment: 'Dr. Anupam Mukherjee', opdRoom: 'Room 103', activeDoctorsCount: 1, waitingTokensCount: 6, completedTodayCount: 5 },
  { id: 'dept-4', name: 'Practice of Medicine', code: 'POM', headOfDepartment: 'Dr. Sudipta Bandyopadhyay', opdRoom: 'Room 104', activeDoctorsCount: 0, waitingTokensCount: 2, completedTodayCount: 0 },
  { id: 'dept-5', name: 'Gynaecology & Obstetrics', code: 'GYN', headOfDepartment: 'Dr. Kakali Ghosh', opdRoom: 'Room 105', activeDoctorsCount: 1, waitingTokensCount: 3, completedTodayCount: 1 },
];

const INITIAL_TOKENS: OpdToken[] = [
  {
    id: 'tok-1',
    tokenNumber: 1,
    tokenCode: 'ORG-001',
    uhid: 'BHMC-2026-0001',
    patientName: 'Rajesh Kumar Sharma',
    age: 42,
    gender: 'Male',
    phone: '9830123456',
    department: 'Organon of Medicine',
    doctorId: 'doc-1',
    doctorName: 'Dr. Subhash Chandra Roy',
    roomNo: 'OPD Room 101',
    fee: 20,
    paymentStatus: 'PAID',
    status: 'COMPLETED',
    issuedAt: '2026-07-25 09:10 AM',
    symptoms: 'Sinusitis & Chronic Rhinitis',
    vitalSigns: { bp: '120/80', pulse: '74', temp: '98.4 F', weightKg: 72 },
  },
  {
    id: 'tok-2',
    tokenNumber: 2,
    tokenCode: 'ORG-002',
    uhid: 'BHMC-2026-0004',
    patientName: 'Meenakshi Sen',
    age: 58,
    gender: 'Female',
    phone: '9800445566',
    department: 'Organon of Medicine',
    doctorId: 'doc-1',
    doctorName: 'Dr. Subhash Chandra Roy',
    roomNo: 'OPD Room 101',
    fee: 20,
    paymentStatus: 'PAID',
    status: 'COMPLETED',
    issuedAt: '2026-07-25 09:20 AM',
    symptoms: 'Insomnia & Knee Pain',
    vitalSigns: { bp: '130/85', pulse: '78', temp: '98.6 F', weightKg: 64 },
  },
  {
    id: 'tok-3',
    tokenNumber: 3,
    tokenCode: 'ORG-003',
    uhid: 'BHMC-2026-0002',
    patientName: 'Anita Chatterji',
    age: 34,
    gender: 'Female',
    phone: '9434112233',
    department: 'Organon of Medicine',
    doctorId: 'doc-1',
    doctorName: 'Dr. Subhash Chandra Roy',
    roomNo: 'OPD Room 101',
    fee: 0,
    paymentStatus: 'EXEMPTED',
    status: 'IN_CONSULTATION',
    issuedAt: '2026-07-25 09:40 AM',
    symptoms: 'Severe Migraine with Aura',
    vitalSigns: { bp: '118/76', pulse: '72', temp: '98.2 F', weightKg: 58 },
  },
  {
    id: 'tok-4',
    tokenNumber: 4,
    tokenCode: 'ORG-004',
    uhid: 'BHMC-2026-0003',
    patientName: 'Arunangshu Roy',
    age: 21,
    gender: 'Male',
    phone: '9732001122',
    department: 'Organon of Medicine',
    doctorId: 'doc-1',
    doctorName: 'Dr. Subhash Chandra Roy',
    roomNo: 'OPD Room 101',
    fee: 0,
    paymentStatus: 'EXEMPTED',
    status: 'WAITING',
    issuedAt: '2026-07-25 10:05 AM',
    symptoms: 'Skin rashes on forearms',
    vitalSigns: { bp: '122/78', pulse: '70', temp: '98.4 F', weightKg: 68 },
  },
  {
    id: 'tok-5',
    tokenNumber: 1,
    tokenCode: 'REP-001',
    uhid: 'BHMC-2026-0001',
    patientName: 'Rajesh Kumar Sharma',
    age: 42,
    gender: 'Male',
    phone: '9830123456',
    department: 'Repertory',
    doctorId: 'doc-3',
    doctorName: 'Dr. Anupam Mukherjee',
    roomNo: 'OPD Room 103',
    fee: 20,
    paymentStatus: 'PAID',
    status: 'WAITING',
    issuedAt: '2026-07-25 10:15 AM',
    symptoms: 'Computerized Repertory Consult',
  },
];

const INITIAL_APPOINTMENTS: AppointmentRecord[] = [
  {
    id: 'app-1',
    appointmentNo: 'APP-2026-8801',
    uhid: 'BHMC-2026-0001',
    patientName: 'Rajesh Kumar Sharma',
    phone: '9830123456',
    doctorId: 'doc-1',
    doctorName: 'Dr. Subhash Chandra Roy',
    department: 'Organon of Medicine',
    appointmentDate: '2026-07-28',
    timeSlot: '10:30 AM',
    status: 'SCHEDULED',
    symptoms: 'Follow-up for Chronic Sinusitis & Dust Allergy',
    bookingChannel: 'Walk-In',
    createdAt: '2026-07-24',
  },
  {
    id: 'app-2',
    appointmentNo: 'APP-2026-8802',
    uhid: 'BHMC-2026-0002',
    patientName: 'Anita Chatterji',
    phone: '9434112233',
    doctorId: 'doc-2',
    doctorName: 'Dr. Pratima Das',
    department: 'Materia Medica',
    appointmentDate: '2026-07-29',
    timeSlot: '11:00 AM',
    status: 'SCHEDULED',
    symptoms: 'Eczematous Skin Eruptions Review',
    bookingChannel: 'Phone Query',
    createdAt: '2026-07-25',
  },
];

const INITIAL_NOTIFICATIONS: ReceptionNotification[] = [
  {
    id: 'notif-1',
    title: 'OPD Queue Congestion Warning',
    message: 'Organon of Medicine OPD has 4+ patients waiting. Ensure Token dispatch counter 2 is open.',
    timestamp: '10 mins ago',
    type: 'WARNING',
    read: false,
    category: 'Queue Alert',
  },
  {
    id: 'notif-2',
    title: 'Doctor Absence Marked',
    message: 'Dr. Sudipta Bandyopadhyay is on official duty leave today. Re-route POM tokens to Room 101.',
    timestamp: '45 mins ago',
    type: 'EMERGENCY',
    read: false,
    category: 'Doctor Availability',
  },
  {
    id: 'notif-3',
    title: 'Emergency BPL Patient Registered',
    message: 'New patient Anita Chatterji registered under BPL Scheme (UHID: BHMC-2026-0002). Fee waived.',
    timestamp: '1 hour ago',
    type: 'SUCCESS',
    read: true,
    category: 'Patient Arrival',
  },
];

const INITIAL_SETTINGS: ReceptionSettings = {
  opdRegistrationFee: 20,
  bplRegistrationFee: 0,
  maxTokensPerDoctor: 40,
  autoResetQueueDaily: true,
  emergencyOverrideAllowed: true,
  announcementSound: true,
  receptionCounterName: 'Counter 01 - General Registration Desk',
  hospitalName: 'BURDWAN HOMOEOPATHIC MEDICAL COLLEGE & HOSPITAL',
};

// In-Memory Storage / Hydration from LocalStorage
const STORAGE_KEYS = {
  PATIENTS: 'bhmc_patients',
  DOCTORS: 'bhmc_doctors',
  TOKENS: 'bhmc_tokens',
  APPOINTMENTS: 'bhmc_appointments',
  NOTIFICATIONS: 'bhmc_notifications',
  SETTINGS: 'bhmc_settings',
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
    console.error('Failed to save to localStorage:', e);
  }
};

class HospitalCoreService {
  private patients: Patient[] = getFromStorage(STORAGE_KEYS.PATIENTS, INITIAL_PATIENTS);
  private doctors: DoctorSchedule[] = getFromStorage(STORAGE_KEYS.DOCTORS, INITIAL_DOCTORS);
  private tokens: OpdToken[] = getFromStorage(STORAGE_KEYS.TOKENS, INITIAL_TOKENS);
  private appointments: AppointmentRecord[] = getFromStorage(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
  private notifications: ReceptionNotification[] = getFromStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  private settings: ReceptionSettings = getFromStorage(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);

  // Statistics
  getHospitalStats(): HospitalStats {
    const activeQueue = this.tokens.filter((t) => t.status === 'WAITING' || t.status === 'IN_CONSULTATION').length;
    const completedToday = this.tokens.filter((t) => t.status === 'COMPLETED').length;
    const availableDocs = this.doctors.filter((d) => d.isAvailable).length;

    const deptCounts: Record<string, number> = {};
    this.tokens.forEach((t) => {
      deptCounts[t.department] = (deptCounts[t.department] || 0) + 1;
    });

    const departmentBreakdown = Object.entries(deptCounts).map(([department, count]) => ({
      department,
      count,
    }));

    return {
      todayOpdRegistrations: this.tokens.length,
      totalRegisteredPatients: this.patients.length,
      doctorsAvailableToday: availableDocs,
      activeQueueCount: activeQueue,
      completedConsultationsToday: completedToday,
      todayAppointmentsCount: this.appointments.length,
      departmentBreakdown,
    };
  }

  // Patients
  getPatients(searchQuery?: string, genderFilter?: string, categoryFilter?: string): Patient[] {
    return this.patients.filter((p) => {
      const q = (searchQuery || '').toLowerCase();
      const matchesSearch =
        !q ||
        p.fullName.toLowerCase().includes(q) ||
        p.uhid.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        p.address.toLowerCase().includes(q);

      const matchesGender = !genderFilter || genderFilter === 'ALL' || p.gender === genderFilter;
      const matchesCategory = !categoryFilter || categoryFilter === 'ALL' || p.category === categoryFilter;

      return matchesSearch && matchesGender && matchesCategory;
    });
  }

  getPatientByUhid(uhid: string): Patient | undefined {
    return this.patients.find((p) => p.uhid.toLowerCase() === uhid.toLowerCase() || p.id === uhid);
  }

  registerPatient(data: Omit<Patient, 'id' | 'uhid' | 'registeredAt' | 'lastVisitDate' | 'totalVisits'>): Patient {
    const nextIdNum = this.patients.length + 1;
    const uhid = `BHMC-2026-${String(nextIdNum).padStart(4, '0')}`;
    const newPatient: Patient = {
      ...data,
      id: `pat-${Date.now()}`,
      uhid,
      registeredAt: new Date().toISOString().split('T')[0],
      lastVisitDate: new Date().toISOString().split('T')[0],
      totalVisits: 1,
    };

    this.patients.unshift(newPatient);
    saveToStorage(STORAGE_KEYS.PATIENTS, this.patients);

    // Add notification
    this.addNotification({
      title: 'New Patient Registered',
      message: `${newPatient.fullName} (${newPatient.uhid}) registered under ${newPatient.category} category.`,
      type: 'SUCCESS',
      category: 'Patient Arrival',
    });

    return newPatient;
  }

  // Doctors & Schedule
  getDoctors(departmentFilter?: string, availableOnly?: boolean): DoctorSchedule[] {
    return this.doctors.filter((d) => {
      const matchesDept = !departmentFilter || departmentFilter === 'ALL' || d.department === departmentFilter;
      const matchesAvail = !availableOnly || d.isAvailable;
      const isActive = d.status !== 'INACTIVE';
      return matchesDept && matchesAvail && isActive;
    });
  }

  getAllDoctors(): DoctorSchedule[] {
    return [...this.doctors];
  }

  addDoctor(data: Partial<DoctorSchedule>): DoctorSchedule {
    if (!data.name || !data.name.trim()) throw new Error('Doctor name is required.');
    if (!data.department || !data.department.trim()) throw new Error('Department is required.');
    if (!data.roomNo || !data.roomNo.trim()) throw new Error('OPD room / counter is required.');

    // Validate times if provided
    if (data.startTime && data.endTime) {
      if (data.startTime >= data.endTime) {
        throw new Error('End time must be after start time.');
      }
    }

    const newDoc: DoctorSchedule = {
      id: `doc-${Date.now()}`,
      name: data.name.trim(),
      qualification: data.qualification || 'M.D. (Hom.)',
      department: data.department.trim(),
      designation: data.designation || 'OPD Consultant',
      roomNo: data.roomNo.trim(),
      opdSchedule: data.opdSchedule || 'Mon - Fri (09:00 AM - 01:00 PM)',
      availableDays: data.availableDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      isAvailable: data.isAvailable ?? true,
      maxDailyTokens: data.maxDailyTokens || 30,
      totalTokensIssued: 0,
      imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80',
      specialization: data.specialization || 'General Homoeopathic Practice',
      dutyShift: data.dutyShift || 'Morning (9 AM - 1 PM)',
      registrationNumber: data.registrationNumber || '',
      experience: data.experience || '',
      startTime: data.startTime || '09:00',
      endTime: data.endTime || '13:00',
      consultationInfo: data.consultationInfo || '',
      description: data.description || '',
      availabilityStatus: data.availabilityStatus || 'Available',
      status: data.status || 'ACTIVE',
    };

    this.doctors.push(newDoc);
    saveToStorage(STORAGE_KEYS.DOCTORS, this.doctors);

    this.safeLogAudit({
      module: 'OPD_MANAGEMENT',
      action: 'ADD_OPD_DOCTOR',
      performedBy: 'Super Admin',
      userRole: 'ROLE_SUPER_ADMIN',
      details: `Added OPD doctor: ${newDoc.name} (${newDoc.department}, Room: ${newDoc.roomNo})`,
      status: 'SUCCESS',
    });

    return newDoc;
  }

  updateDoctor(id: string, updates: Partial<DoctorSchedule>): DoctorSchedule {
    const doc = this.doctors.find((d) => d.id === id);
    if (!doc) throw new Error(`Doctor with ID '${id}' not found.`);

    if (updates.startTime && updates.endTime && updates.startTime >= updates.endTime) {
      throw new Error('End time must be after start time.');
    }

    const oldStatus = doc.status;
    const oldAvailability = doc.availabilityStatus;

    Object.assign(doc, updates);

    // Sync isAvailable boolean with availabilityStatus
    if (updates.availabilityStatus) {
      doc.isAvailable = updates.availabilityStatus === 'Available';
    }

    saveToStorage(STORAGE_KEYS.DOCTORS, this.doctors);

    const action = updates.status && updates.status !== oldStatus
      ? (updates.status === 'INACTIVE' ? 'DEACTIVATE_OPD_DOCTOR' : 'REACTIVATE_OPD_DOCTOR')
      : (updates.availabilityStatus && updates.availabilityStatus !== oldAvailability ? 'CHANGE_DOCTOR_AVAILABILITY' : 'UPDATE_OPD_DOCTOR');

    this.safeLogAudit({
      module: 'OPD_MANAGEMENT',
      action,
      performedBy: 'Super Admin',
      userRole: 'ROLE_SUPER_ADMIN',
      details: `Updated OPD doctor '${doc.name}' (Department: ${doc.department}, Room: ${doc.roomNo})`,
      status: 'SUCCESS',
    });

    return doc;
  }

  updateOpdSchedule(doctorId: string, scheduleData: {
    availableDays: string[];
    startTime: string;
    endTime: string;
    roomNo: string;
    dutyShift: string;
    opdSchedule?: string;
  }): DoctorSchedule {
    const doc = this.doctors.find((d) => d.id === doctorId);
    if (!doc) throw new Error(`Doctor with ID '${doctorId}' not found.`);

    if (!scheduleData.roomNo || !scheduleData.roomNo.trim()) {
      throw new Error('OPD Room / Counter number cannot be empty.');
    }

    if (scheduleData.startTime && scheduleData.endTime && scheduleData.startTime >= scheduleData.endTime) {
      throw new Error('End time must be after start time.');
    }

    doc.availableDays = scheduleData.availableDays;
    doc.startTime = scheduleData.startTime;
    doc.endTime = scheduleData.endTime;
    doc.roomNo = scheduleData.roomNo;
    doc.dutyShift = scheduleData.dutyShift;
    doc.opdSchedule = scheduleData.opdSchedule || `${scheduleData.availableDays.join(', ')} (${scheduleData.startTime} - ${scheduleData.endTime})`;

    saveToStorage(STORAGE_KEYS.DOCTORS, this.doctors);

    this.safeLogAudit({
      module: 'OPD_MANAGEMENT',
      action: 'UPDATE_OPD_SCHEDULE',
      performedBy: 'Super Admin',
      userRole: 'ROLE_SUPER_ADMIN',
      details: `Updated OPD schedule for '${doc.name}' (Days: ${doc.availableDays.join(',')}, Timing: ${doc.startTime}-${doc.endTime}, Room: ${doc.roomNo})`,
      status: 'SUCCESS',
    });

    return doc;
  }

  deleteDoctor(id: string): boolean {
    const index = this.doctors.findIndex((d) => d.id === id);
    if (index === -1) return false;

    const [deleted] = this.doctors.splice(index, 1);
    saveToStorage(STORAGE_KEYS.DOCTORS, this.doctors);

    this.safeLogAudit({
      module: 'OPD_MANAGEMENT',
      action: 'DELETE_OPD_DOCTOR',
      performedBy: 'Super Admin',
      userRole: 'ROLE_SUPER_ADMIN',
      details: `Deleted OPD doctor record: ${deleted.name} (${deleted.department})`,
      status: 'SUCCESS',
    });

    return true;
  }

  toggleDoctorAvailability(doctorId: string, isAvailable: boolean): DoctorSchedule {
    const doc = this.doctors.find((d) => d.id === doctorId);
    if (doc) {
      doc.isAvailable = isAvailable;
      doc.availabilityStatus = isAvailable ? 'Available' : 'Unavailable';
      saveToStorage(STORAGE_KEYS.DOCTORS, this.doctors);

      this.safeLogAudit({
        module: 'OPD_MANAGEMENT',
        action: 'TOGGLE_DOCTOR_AVAILABILITY',
        performedBy: 'Super Admin',
        userRole: 'ROLE_SUPER_ADMIN',
        details: `Toggled availability for '${doc.name}' to ${isAvailable ? 'AVAILABLE' : 'OFF-DUTY'}`,
        status: 'SUCCESS',
      });

      this.addNotification({
        title: `Doctor ${isAvailable ? 'Available' : 'Unavailable'}`,
        message: `${doc.name} (${doc.department}) marked as ${isAvailable ? 'AVAILABLE in ' + doc.roomNo : 'UNAVAILABLE / OFF-DUTY'}.`,
        type: isAvailable ? 'INFO' : 'WARNING',
        category: 'Doctor Availability',
      });
    }
    return doc!;
  }

  // Departments
  getDepartments(): DepartmentInfo[] {
    return INITIAL_DEPARTMENTS.map((dept) => {
      const activeDocs = this.doctors.filter((d) => d.department === dept.name && d.isAvailable).length;
      const waiting = this.tokens.filter((t) => t.department === dept.name && t.status === 'WAITING').length;
      const completed = this.tokens.filter((t) => t.department === dept.name && t.status === 'COMPLETED').length;
      return {
        ...dept,
        activeDoctorsCount: activeDocs,
        waitingTokensCount: waiting,
        completedTodayCount: completed,
      };
    });
  }

  // OPD Tokens & Queue
  getTokens(departmentFilter?: string, statusFilter?: string, doctorId?: string): OpdToken[] {
    return this.tokens.filter((t) => {
      const matchesDept = !departmentFilter || departmentFilter === 'ALL' || t.department === departmentFilter;
      const matchesStatus = !statusFilter || statusFilter === 'ALL' || t.status === statusFilter;
      const matchesDoc = !doctorId || doctorId === 'ALL' || t.doctorId === doctorId;
      return matchesDept && matchesStatus && matchesDoc;
    });
  }

  issueOpdToken(data: {
    uhid: string;
    patientName: string;
    age: number;
    gender: string;
    phone: string;
    department: string;
    doctorId: string;
    symptoms?: string;
    vitalSigns?: { bp?: string; pulse?: string; temp?: string; weightKg?: number };
    feeExempt?: boolean;
  }): OpdToken {
    const doctor = this.doctors.find((d) => d.id === data.doctorId);
    const doctorName = doctor ? doctor.name : 'OPD Doctor';
    const roomNo = doctor ? doctor.roomNo : 'OPD Desk';

    // Count existing tokens for doctor
    const existingDoctorTokens = this.tokens.filter((t) => t.doctorId === data.doctorId);
    const tokenNumber = existingDoctorTokens.length + 1;

    const deptObj = INITIAL_DEPARTMENTS.find((d) => d.name === data.department);
    const deptCode = deptObj ? deptObj.code : 'OPD';
    const tokenCode = `${deptCode}-${String(tokenNumber).padStart(3, '0')}`;

    const fee = data.feeExempt ? 0 : this.settings.opdRegistrationFee;
    const paymentStatus = data.feeExempt ? 'EXEMPTED' : 'PAID';

    const newToken: OpdToken = {
      id: `tok-${Date.now()}`,
      tokenNumber,
      tokenCode,
      uhid: data.uhid,
      patientName: data.patientName,
      age: data.age,
      gender: data.gender,
      phone: data.phone,
      department: data.department,
      doctorId: data.doctorId,
      doctorName,
      roomNo,
      fee,
      paymentStatus,
      status: 'WAITING',
      issuedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      symptoms: data.symptoms || 'General OPD Consult',
      vitalSigns: data.vitalSigns,
    };

    this.tokens.push(newToken);
    saveToStorage(STORAGE_KEYS.TOKENS, this.tokens);

    if (doctor) {
      doctor.totalTokensIssued += 1;
      saveToStorage(STORAGE_KEYS.DOCTORS, this.doctors);
    }

    return newToken;
  }

  updateTokenStatus(tokenId: string, status: OpdToken['status']): OpdToken | undefined {
    const token = this.tokens.find((t) => t.id === tokenId);
    if (token) {
      token.status = status;
      if (status === 'IN_CONSULTATION') {
        const doc = this.doctors.find((d) => d.id === token.doctorId);
        if (doc) doc.currentServingToken = token.tokenNumber;
      }
      saveToStorage(STORAGE_KEYS.TOKENS, this.tokens);
      saveToStorage(STORAGE_KEYS.DOCTORS, this.doctors);
    }
    return token;
  }

  callNextToken(doctorId: string): OpdToken | undefined {
    const waitingTokens = this.tokens
      .filter((t) => t.doctorId === doctorId && t.status === 'WAITING')
      .sort((a, b) => a.tokenNumber - b.tokenNumber);

    if (waitingTokens.length > 0) {
      const nextToken = waitingTokens[0];
      // Mark current in consultation as completed
      this.tokens.forEach((t) => {
        if (t.doctorId === doctorId && t.status === 'IN_CONSULTATION') {
          t.status = 'COMPLETED';
        }
      });
      nextToken.status = 'IN_CONSULTATION';

      const doc = this.doctors.find((d) => d.id === doctorId);
      if (doc) doc.currentServingToken = nextToken.tokenNumber;

      saveToStorage(STORAGE_KEYS.TOKENS, this.tokens);
      saveToStorage(STORAGE_KEYS.DOCTORS, this.doctors);
      return nextToken;
    }
    return undefined;
  }

  // Appointments & Calendar
  getAppointments(date?: string, doctorId?: string): AppointmentRecord[] {
    return this.appointments.filter((a) => {
      const matchesDate = !date || a.appointmentDate === date;
      const matchesDoc = !doctorId || doctorId === 'ALL' || a.doctorId === doctorId;
      return matchesDate && matchesDoc;
    });
  }

  bookAppointment(data: {
    uhid: string;
    patientName: string;
    phone: string;
    doctorId: string;
    appointmentDate: string;
    timeSlot: string;
    symptoms: string;
    bookingChannel?: 'Walk-In' | 'Phone Query' | 'Online Portal';
  }): AppointmentRecord {
    const doctor = this.doctors.find((d) => d.id === data.doctorId);
    const doctorName = doctor ? doctor.name : 'Consultant Doctor';
    const department = doctor ? doctor.department : 'General OPD';

    const newApp: AppointmentRecord = {
      id: `app-${Date.now()}`,
      appointmentNo: `APP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      uhid: data.uhid,
      patientName: data.patientName,
      phone: data.phone,
      doctorId: data.doctorId,
      doctorName,
      department,
      appointmentDate: data.appointmentDate,
      timeSlot: data.timeSlot,
      status: 'SCHEDULED',
      symptoms: data.symptoms,
      bookingChannel: data.bookingChannel || 'Walk-In',
      createdAt: new Date().toISOString().split('T')[0],
    };

    this.appointments.unshift(newApp);
    saveToStorage(STORAGE_KEYS.APPOINTMENTS, this.appointments);

    this.addNotification({
      title: 'Appointment Booked',
      message: `Appointment #${newApp.appointmentNo} created for ${newApp.patientName} with ${doctorName} on ${newApp.appointmentDate} at ${newApp.timeSlot}.`,
      type: 'INFO',
      category: 'Patient Arrival',
    });

    return newApp;
  }

  updateAppointmentStatus(id: string, status: AppointmentRecord['status']): void {
    const app = this.appointments.find((a) => a.id === id);
    if (app) {
      app.status = status;
      saveToStorage(STORAGE_KEYS.APPOINTMENTS, this.appointments);
    }
  }

  // Notifications
  getNotifications(): ReceptionNotification[] {
    return this.notifications;
  }

  markNotificationRead(id: string): void {
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      saveToStorage(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    }
  }

  addNotification(data: Omit<ReceptionNotification, 'id' | 'timestamp' | 'read'>): ReceptionNotification {
    const newNotif: ReceptionNotification = {
      ...data,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      read: false,
    };
    this.notifications.unshift(newNotif);
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    return newNotif;
  }

  // Settings
  getSettings(): ReceptionSettings {
    return this.settings;
  }

  updateSettings(data: Partial<ReceptionSettings>): ReceptionSettings {
    this.settings = { ...this.settings, ...data };
    saveToStorage(STORAGE_KEYS.SETTINGS, this.settings);
    return this.settings;
  }
  private safeLogAudit(entry: {
    module: string;
    action: string;
    performedBy: string;
    userRole?: string;
    userEmail?: string;
    details: string;
    status?: string;
  }): void {
    try {
      if (adminHrService && typeof adminHrService.logAudit === 'function') {
        adminHrService.logAudit(entry);
      } else if (adminHrService && typeof adminHrService.addAuditLog === 'function') {
        adminHrService.addAuditLog(entry);
      } else {
        console.warn('[HospitalCore audit notice]: adminHrService audit method unavailable', entry);
      }
    } catch (e) {
      console.warn('[HospitalCore audit notice]: non-fatal audit log error', e);
    }
  }
}

export const hospitalCoreService = new HospitalCoreService();
