import mongoose, { Schema, Document } from 'mongoose';

export interface IStaff extends Document {
  id: string;
  slNo: number;
  empId: string;
  name: string;
  roleCategory: 'MEDICAL_STAFF' | 'OFFICE_STAFF' | 'PARAMEDICAL_STAFF' | 'NON_MEDICAL_STAFF';
  staffCategory: 'MEDICAL' | 'NON_MEDICAL';
  department: string;
  designation: string;
  category: string;
  displayOrder: number;
  qualification?: string;
  contactNumber?: string;
  phone?: string;
  email?: string;
  photoUrl?: string;
  photo?: {
    driveFileId: string;
    fileName: string;
    mimeType: string;
  };
  registrationNumber?: string;
  joiningDate?: string;
  promotionDate?: string;
  experienceYears?: string;
  specialization?: string;
  biography?: string;
  availability?: string;
  dutyShift?: string;
  opdCounter?: string;
  status: 'ACTIVE' | 'INACTIVE';
  joiningYear?: number;
  createdAt?: string;
  updatedAt?: string;
}

const StaffSchema = new Schema<IStaff>(
  {
    id: { type: String, required: true, unique: true },
    slNo: { type: Number, required: true },
    empId: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    roleCategory: {
      type: String,
      required: true,
      enum: ['MEDICAL_STAFF', 'OFFICE_STAFF', 'PARAMEDICAL_STAFF', 'NON_MEDICAL_STAFF'],
      default: 'OFFICE_STAFF',
    },
    staffCategory: {
      type: String,
      enum: ['MEDICAL', 'NON_MEDICAL'],
      default: 'NON_MEDICAL',
    },
    department: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true, default: 'STAFF' },
    displayOrder: { type: Number, required: true, index: true },
    qualification: { type: String },
    contactNumber: { type: String },
    phone: { type: String },
    email: { type: String },
    photoUrl: { type: String },
    photo: {
      driveFileId: { type: String },
      fileName: { type: String },
      mimeType: { type: String },
    },
    registrationNumber: { type: String },
    joiningDate: { type: String },
    promotionDate: { type: String },
    experienceYears: { type: String },
    specialization: { type: String },
    biography: { type: String },
    availability: { type: String, default: 'AVAILABLE' },
    dutyShift: { type: String },
    opdCounter: { type: String },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
    joiningYear: { type: Number },
  },
  { timestamps: true, strict: false }
);

export const StaffModel = mongoose.models.Staff || mongoose.model<IStaff>('Staff', StaffSchema);

export const SEED_STAFF: any[] = [
  { id: 'stf-001', slNo: 1, empId: 'SL-01', name: 'Dr. Susmita Chatterjee', designation: 'Superintendent', department: 'HOSPITAL SECTION', roleCategory: 'MEDICAL_STAFF', staffCategory: 'MEDICAL', category: 'HOSPITAL STAFF', displayOrder: 1, joiningDate: '2013-06-04', experienceYears: '13 years 2 months', status: 'ACTIVE' },
  { id: 'stf-002', slNo: 2, empId: 'SL-02', name: 'Dr. Anup Prasad Gupta', designation: 'Deputy Superintendent / MO', department: 'HOSPITAL SECTION', roleCategory: 'MEDICAL_STAFF', staffCategory: 'MEDICAL', category: 'HOSPITAL STAFF', displayOrder: 2, joiningDate: '1997-07-31', experienceYears: '29 years 1 months', status: 'ACTIVE' },
  { id: 'stf-003', slNo: 3, empId: 'SL-03', name: 'Dr. Puspendu Biswas', designation: 'SMO', department: 'HOSPITAL SECTION', roleCategory: 'MEDICAL_STAFF', staffCategory: 'MEDICAL', category: 'HOSPITAL STAFF', displayOrder: 3, joiningDate: '2003-05-01', experienceYears: '23 years 3 months', status: 'ACTIVE' },
  { id: 'stf-004', slNo: 4, empId: 'SL-04', name: 'Dr. Shyamashri Pal', designation: 'RMO', department: 'HOSPITAL SECTION', roleCategory: 'MEDICAL_STAFF', staffCategory: 'MEDICAL', category: 'HOSPITAL STAFF', displayOrder: 4, joiningDate: '2020-10-12', experienceYears: '5 years 10 months', status: 'ACTIVE' },
  { id: 'stf-005', slNo: 5, empId: 'SL-05', name: 'Dr. Namrata Das', designation: 'House Physician', department: 'HOSPITAL SECTION', roleCategory: 'MEDICAL_STAFF', staffCategory: 'MEDICAL', category: 'HOSPITAL STAFF', displayOrder: 5, joiningDate: '2026-01-14', experienceYears: '7 months', status: 'ACTIVE' },
  { id: 'stf-007', slNo: 7, empId: 'SL-07', name: 'Puspa Dey', designation: 'Nursing in charge', department: 'HOSPITAL SECTION', roleCategory: 'PARAMEDICAL_STAFF', staffCategory: 'MEDICAL', category: 'HOSPITAL STAFF', displayOrder: 7, joiningDate: '2023-07-01', experienceYears: '5 years 1 months', status: 'ACTIVE' },
  { id: 'stf-008', slNo: 8, empId: 'SL-08', name: 'Geeta Pal', designation: 'Nursing Staff', department: 'HOSPITAL SECTION', roleCategory: 'PARAMEDICAL_STAFF', staffCategory: 'MEDICAL', category: 'HOSPITAL STAFF', displayOrder: 8, joiningDate: '2020-02-16', experienceYears: '6 years 6 months', status: 'ACTIVE' },
  { id: 'stf-009', slNo: 9, empId: 'SL-09', name: 'Tina roy', designation: 'Nursing Staff', department: 'HOSPITAL SECTION', roleCategory: 'PARAMEDICAL_STAFF', staffCategory: 'MEDICAL', category: 'HOSPITAL STAFF', displayOrder: 9, joiningDate: '2023-06-02', experienceYears: '3 years 2 months', status: 'ACTIVE' },
  { id: 'stf-010', slNo: 10, empId: 'SL-10', name: 'Mouli Roy', designation: 'OT Nurse', department: 'HOSPITAL SECTION', roleCategory: 'PARAMEDICAL_STAFF', staffCategory: 'MEDICAL', category: 'HOSPITAL STAFF', displayOrder: 10, joiningDate: '2026-04-01', experienceYears: '4 months', status: 'ACTIVE' },
  { id: 'stf-011', slNo: 11, empId: 'SL-11', name: 'Dhriti Dey', designation: 'Nursing Staff', department: 'HOSPITAL SECTION', roleCategory: 'PARAMEDICAL_STAFF', staffCategory: 'MEDICAL', category: 'HOSPITAL STAFF', displayOrder: 11, joiningDate: '2026-08-01', experienceYears: '6 Days', status: 'ACTIVE' },
  { id: 'stf-012', slNo: 12, empId: 'SL-12', name: 'Titun Mukherjee', designation: 'Nursing Staff', department: 'HOSPITAL SECTION', roleCategory: 'PARAMEDICAL_STAFF', staffCategory: 'MEDICAL', category: 'HOSPITAL STAFF', displayOrder: 12, joiningDate: '2026-08-10', status: 'ACTIVE' },
  { id: 'stf-013', slNo: 13, empId: 'SL-13', name: 'Chaina Ghosh', designation: 'OT Assistant', department: 'HOSPITAL SECTION', roleCategory: 'PARAMEDICAL_STAFF', staffCategory: 'MEDICAL', category: 'HOSPITAL STAFF', displayOrder: 13, joiningDate: '2003-02-22', experienceYears: '23 years 6 months', status: 'ACTIVE' },
  { id: 'stf-014', slNo: 14, empId: 'SL-14', name: 'Sumita Chakraborty', designation: 'P.R.O', department: 'HOSPITAL SECTION', roleCategory: 'OFFICE_STAFF', staffCategory: 'NON_MEDICAL', category: 'HOSPITAL STAFF', displayOrder: 14, joiningDate: '2015-01-02', experienceYears: '11 years 7 months', status: 'ACTIVE' },
  { id: 'stf-015', slNo: 15, empId: 'SL-15', name: 'Paresh Chattopadhyay', designation: 'Xray Technician', department: 'HOSPITAL SECTION', roleCategory: 'PARAMEDICAL_STAFF', staffCategory: 'MEDICAL', category: 'HOSPITAL STAFF', displayOrder: 15, joiningDate: '2000-09-05', experienceYears: '25 years 11 months', status: 'ACTIVE' },
  { id: 'stf-016', slNo: 16, empId: 'SL-16', name: 'Somnath Gain', designation: 'Xray Attendent', department: 'HOSPITAL SECTION', roleCategory: 'NON_MEDICAL_STAFF', staffCategory: 'NON_MEDICAL', category: 'HOSPITAL STAFF', displayOrder: 16, status: 'ACTIVE' },
  { id: 'stf-017', slNo: 17, empId: 'SL-17', name: 'Swapan Boral', designation: 'Compounder cum dispenser', department: 'HOSPITAL SECTION', roleCategory: 'PARAMEDICAL_STAFF', staffCategory: 'MEDICAL', category: 'HOSPITAL STAFF', displayOrder: 17, joiningDate: '1985-10-01', experienceYears: '40 years 10 months', status: 'ACTIVE' },
  { id: 'stf-018', slNo: 18, empId: 'SL-18', name: 'Chandra Das', designation: 'Registration clerk', department: 'HOSPITAL SECTION', roleCategory: 'OFFICE_STAFF', staffCategory: 'NON_MEDICAL', category: 'HOSPITAL STAFF', displayOrder: 18, joiningDate: '2015-01-02', experienceYears: '11 years 7 months', status: 'ACTIVE' },
  { id: 'stf-019', slNo: 19, empId: 'SL-19', name: 'Ujjal Kumar Mondal', designation: 'Pharmacist', department: 'HOSPITAL SECTION', roleCategory: 'PARAMEDICAL_STAFF', staffCategory: 'MEDICAL', category: 'HOSPITAL STAFF', displayOrder: 19, joiningDate: '2015-01-02', experienceYears: '11 years 7 months', status: 'ACTIVE' },
  { id: 'stf-020', slNo: 20, empId: 'SL-20', name: 'Shilpi Das', designation: 'Dresser', department: 'HOSPITAL SECTION', roleCategory: 'PARAMEDICAL_STAFF', staffCategory: 'MEDICAL', category: 'HOSPITAL STAFF', displayOrder: 20, joiningDate: '2025-07-03', experienceYears: '1 years 1 months', status: 'ACTIVE' },
  { id: 'stf-021', slNo: 21, empId: 'SL-21', name: 'Mandira Pal', designation: 'Receptionist', department: 'HOSPITAL SECTION', roleCategory: 'OFFICE_STAFF', staffCategory: 'NON_MEDICAL', category: 'HOSPITAL STAFF', displayOrder: 21, joiningDate: '2025-07-03', experienceYears: '1 years 1 months', status: 'ACTIVE' },
  { id: 'stf-022', slNo: 22, empId: 'SL-22', name: 'Kalyan Chouni', designation: 'Store keeper', department: 'HOSPITAL SECTION', roleCategory: 'OFFICE_STAFF', staffCategory: 'NON_MEDICAL', category: 'HOSPITAL STAFF', displayOrder: 22, joiningDate: '2004-09-01', experienceYears: '21 years 11 months', status: 'ACTIVE' },
  { id: 'stf-023', slNo: 23, empId: 'SL-23', name: 'Dulal Bose', designation: 'Ward boy', department: 'HOSPITAL SECTION', roleCategory: 'NON_MEDICAL_STAFF', staffCategory: 'NON_MEDICAL', category: 'HOSPITAL STAFF', displayOrder: 23, joiningDate: '2014-01-21', experienceYears: '12 years 7 months', status: 'ACTIVE' },
  { id: 'stf-024', slNo: 24, empId: 'SL-24', name: 'Sarmishtha Das', designation: 'Aya', department: 'HOSPITAL SECTION', roleCategory: 'NON_MEDICAL_STAFF', staffCategory: 'NON_MEDICAL', category: 'HOSPITAL STAFF', displayOrder: 24, joiningDate: '2025-02-21', experienceYears: '1 years 6 months', status: 'ACTIVE' },
  { id: 'stf-025', slNo: 25, empId: 'SL-25', name: 'Brishti Das', designation: 'Aya', department: 'HOSPITAL SECTION', roleCategory: 'NON_MEDICAL_STAFF', staffCategory: 'NON_MEDICAL', category: 'HOSPITAL STAFF', displayOrder: 25, joiningDate: '2025-02-21', experienceYears: '1 years 6 months', status: 'ACTIVE' },
  { id: 'stf-026', slNo: 26, empId: 'SL-26', name: 'Amit Dhank', designation: 'Ward Boy', department: 'HOSPITAL SECTION', roleCategory: 'NON_MEDICAL_STAFF', staffCategory: 'NON_MEDICAL', category: 'HOSPITAL STAFF', displayOrder: 26, joiningDate: '2025-02-21', experienceYears: '1 years 6 months', status: 'ACTIVE' },
  { id: 'stf-027', slNo: 27, empId: 'SL-27', name: 'Arunima Laha', designation: 'Dietecian', department: 'HOSPITAL SECTION', roleCategory: 'PARAMEDICAL_STAFF', staffCategory: 'MEDICAL', category: 'HOSPITAL STAFF', displayOrder: 27, joiningDate: '2021-04-16', experienceYears: '5 years 4 months', status: 'ACTIVE' },
  { id: 'stf-028', slNo: 28, empId: 'SL-28', name: 'Dr. Bhubaneswar Bhattacharjee', designation: 'Bio Chemist', department: 'HOSPITAL SECTION', roleCategory: 'MEDICAL_STAFF', staffCategory: 'MEDICAL', category: 'HOSPITAL STAFF', displayOrder: 28, status: 'ACTIVE' },
  { id: 'stf-029', slNo: 29, empId: 'SL-29', name: 'Dr. Tapan kumar Bandyopadhyay', designation: 'Gynaecologist & obstetrician', department: 'HOSPITAL SECTION', roleCategory: 'MEDICAL_STAFF', staffCategory: 'MEDICAL', category: 'HOSPITAL STAFF', displayOrder: 29, status: 'ACTIVE' },
  { id: 'stf-030', slNo: 30, empId: 'SL-30', name: 'Dr. Sukdev Mukherjee', designation: 'Physiotherapist', department: 'HOSPITAL SECTION', roleCategory: 'MEDICAL_STAFF', staffCategory: 'MEDICAL', category: 'HOSPITAL STAFF', displayOrder: 30, status: 'ACTIVE' },
  { id: 'stf-031', slNo: 31, empId: 'SL-31', name: 'Awadhesh kumar Mahato', designation: 'Laboratory Technician', department: 'HOSPITAL SECTION', roleCategory: 'PARAMEDICAL_STAFF', staffCategory: 'MEDICAL', category: 'HOSPITAL STAFF', displayOrder: 31, status: 'ACTIVE' },
  { id: 'stf-032', slNo: 32, empId: 'SL-32', name: 'Dr Abhi Jana', designation: 'General Physician', department: 'HOSPITAL SECTION', roleCategory: 'MEDICAL_STAFF', staffCategory: 'MEDICAL', category: 'HOSPITAL STAFF', displayOrder: 32, joiningDate: '2026-07-24', status: 'ACTIVE' },
  { id: 'stf-033', slNo: 33, empId: 'SL-33', name: 'Dr Dilip Basak', designation: 'Anesthetist ( on call)', department: 'HOSPITAL SECTION', roleCategory: 'MEDICAL_STAFF', staffCategory: 'MEDICAL', category: 'HOSPITAL STAFF', displayOrder: 33, status: 'ACTIVE' },
  { id: 'stf-034', slNo: 34, empId: 'SL-34', name: 'Dr Pritrish Mukherjee', designation: 'Dentist', department: 'HOSPITAL SECTION', roleCategory: 'MEDICAL_STAFF', staffCategory: 'MEDICAL', category: 'HOSPITAL STAFF', displayOrder: 34, status: 'ACTIVE' },
  { id: 'stf-035', slNo: 35, empId: 'SL-35', name: 'Sunil kumar Shaw', designation: 'Yoga Expert', department: 'HOSPITAL SECTION', roleCategory: 'PARAMEDICAL_STAFF', staffCategory: 'MEDICAL', category: 'HOSPITAL STAFF', displayOrder: 35, status: 'ACTIVE' },
  { id: 'stf-036', slNo: 36, empId: 'SL-36', name: 'Moumita Maji', designation: 'Yoga Instructor', department: 'HOSPITAL SECTION', roleCategory: 'PARAMEDICAL_STAFF', staffCategory: 'MEDICAL', category: 'HOSPITAL STAFF', displayOrder: 36, status: 'ACTIVE' }
];
