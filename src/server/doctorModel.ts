import mongoose, { Schema, Document } from 'mongoose';

export interface IDoctor extends Document {
  id: string;
  slNo: number;
  empId: string;
  name: string;
  roleCategory?: string;
  department: string;
  departmentId?: string;
  designation: string;
  category?: string;
  displayOrder: number;
  qualification?: string;
  specialization?: string;
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
  medicalRegistrationNumber?: string;
  joiningDate?: string;
  promotionDate?: string;
  experienceYears?: string;
  biography?: string;
  availability?: string;
  dutyShift?: string;
  opdCounter?: string;
  status: 'ACTIVE' | 'INACTIVE';
  joiningYear?: number;
  createdAt?: string;
  updatedAt?: string;
}

const DoctorSchema = new Schema<IDoctor>(
  {
    id: { type: String, required: true, unique: true },
    slNo: { type: Number, required: true },
    empId: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    roleCategory: { type: String, default: 'MEDICAL_DOCTOR' },
    department: { type: String, required: true, trim: true },
    departmentId: { type: String },
    designation: { type: String, required: true, trim: true },
    category: { type: String, default: 'CLINICAL_DOCTOR' },
    displayOrder: { type: Number, required: true, index: true },
    qualification: { type: String },
    specialization: { type: String },
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
    medicalRegistrationNumber: { type: String },
    joiningDate: { type: String },
    promotionDate: { type: String },
    experienceYears: { type: String },
    biography: { type: String },
    availability: { type: String, default: 'AVAILABLE' },
    dutyShift: { type: String },
    opdCounter: { type: String },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
    joiningYear: { type: Number },
  },
  { timestamps: true, strict: false }
);

export const DoctorModel = mongoose.models.Doctor || mongoose.model<IDoctor>('Doctor', DoctorSchema);

export const SEED_DOCTORS: any[] = [];
