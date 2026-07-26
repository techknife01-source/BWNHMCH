export interface Patient {
  id: string;
  uhid: string;
  fullName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email?: string;
  address: string;
  bloodGroup: string;
  category: 'General' | 'BPL' | 'Staff' | 'Student';
  registeredAt: string;
  lastVisitDate: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  medicalHistory?: string;
  allergies?: string;
  totalVisits: number;
}

export interface OpdToken {
  id: string;
  tokenNumber: number;
  tokenCode: string;
  uhid: string;
  patientName: string;
  age: number;
  gender: string;
  phone: string;
  department: string;
  doctorId: string;
  doctorName: string;
  roomNo: string;
  fee: number;
  paymentStatus: 'PAID' | 'EXEMPTED';
  status: 'WAITING' | 'IN_CONSULTATION' | 'COMPLETED' | 'CANCELLED' | 'SKIPPED';
  issuedAt: string;
  symptoms?: string;
  vitalSigns?: {
    bp?: string;
    pulse?: string;
    temp?: string;
    weightKg?: number;
  };
}

export interface DoctorSchedule {
  id: string;
  name: string;
  qualification: string;
  department: string;
  designation: string;
  roomNo: string;
  opdSchedule: string;
  availableDays: string[];
  isAvailable: boolean;
  maxDailyTokens: number;
  currentServingToken?: number;
  totalTokensIssued: number;
  imageUrl?: string;
  specialization: string;
  dutyShift: 'Morning (9 AM - 1 PM)' | 'Evening (2 PM - 6 PM)' | 'Full Day';
}

export interface DepartmentInfo {
  id: string;
  name: string;
  code: string;
  headOfDepartment: string;
  opdRoom: string;
  activeDoctorsCount: number;
  waitingTokensCount: number;
  completedTodayCount: number;
  iconName?: string;
}

export interface AppointmentRecord {
  id: string;
  appointmentNo: string;
  uhid: string;
  patientName: string;
  phone: string;
  doctorId: string;
  doctorName: string;
  department: string;
  appointmentDate: string;
  timeSlot: string;
  status: 'SCHEDULED' | 'CHECKED_IN' | 'COMPLETED' | 'CANCELLED';
  symptoms: string;
  bookingChannel: 'Walk-In' | 'Phone Query' | 'Online Portal';
  createdAt: string;
}

export interface ReceptionNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'INFO' | 'WARNING' | 'EMERGENCY' | 'SUCCESS';
  read: boolean;
  category: 'Doctor Availability' | 'Queue Alert' | 'Patient Arrival' | 'System';
}

export interface ReceptionSettings {
  opdRegistrationFee: number;
  bplRegistrationFee: number;
  maxTokensPerDoctor: number;
  autoResetQueueDaily: boolean;
  emergencyOverrideAllowed: boolean;
  announcementSound: boolean;
  receptionCounterName: string;
  hospitalName: string;
}

export interface HospitalStats {
  todayOpdRegistrations: number;
  totalRegisteredPatients: number;
  doctorsAvailableToday: number;
  activeQueueCount: number;
  completedConsultationsToday: number;
  todayAppointmentsCount: number;
  departmentBreakdown: Array<{ department: string; count: number }>;
}
