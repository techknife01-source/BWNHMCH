import mongoose, { Schema, Document } from 'mongoose';

export interface IFaculty extends Document {
  id: string;
  slNo: number;
  empId: string;
  name: string;
  department: string;
  departmentId?: string;
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
  status: 'ACTIVE' | 'INACTIVE';
  joiningYear?: number;
  createdAt?: string;
  updatedAt?: string;
}

const FacultySchema = new Schema<IFaculty>(
  {
    id: { type: String, required: true, unique: true },
    slNo: { type: Number, required: true },
    empId: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    departmentId: { type: String },
    designation: { type: String, required: true, trim: true },
    category: { type: String, default: 'ACADEMIC FACULTY' },
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
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
    joiningYear: { type: Number },
  },
  { timestamps: true, collection: 'faculty', strict: false }
);

export const FacultyModel = mongoose.models.Faculty || mongoose.model<IFaculty>('Faculty', FacultySchema, 'faculty');

export const SEED_FACULTY = [
  {
    id: 'fac-test-001',
    slNo: 1,
    empId: 'TEST-FAC-001',
    name: 'Rajesh Pal',
    department: 'Homoeopathic Medicine',
    departmentId: 'med',
    designation: 'Assistant Professor',
    category: 'ACADEMIC FACULTY',
    displayOrder: 1,
    qualification: 'BHMS, MD (Hom)',
    specialization: 'Homoeopathic Medicine',
    email: 'rajesh.pal@bhmc.edu.in',
    phone: '+91 98000 00001',
    status: 'ACTIVE',
  },
];
