import { z } from 'zod';

export const personalInfoSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  fatherName: z.string().min(2, 'Father name is required'),
  motherName: z.string().min(2, 'Mother name is required'),
  dob: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['Male', 'Female', 'Other']),
  bloodGroup: z.string().min(1, 'Blood group is required'),
  nationality: z.string().min(2, 'Nationality is required'),
  maritalStatus: z.enum(['Single', 'Married', 'Divorced', 'Widowed']),
  languagesKnown: z.array(z.string()).min(1, 'Select at least one language'),
});

export const contactInfoSchema = z.object({
  officialEmail: z.string().email('Invalid email address'),
  personalEmail: z.string().email('Invalid email address'),
  mobileNumber: z.string().regex(/^[0-9+\s-]{10,15}$/, 'Invalid mobile phone number'),
  alternateMobileNumber: z.string().optional(),
  presentAddress: z.object({
    street: z.string().min(3, 'Street address required'),
    city: z.string().min(2, 'City required'),
    state: z.string().min(2, 'State required'),
    pincode: z.string().min(6, 'Valid pincode required'),
    country: z.string().min(2, 'Country required'),
  }),
  permanentAddress: z.object({
    street: z.string().min(3, 'Street address required'),
    city: z.string().min(2, 'City required'),
    state: z.string().min(2, 'State required'),
    pincode: z.string().min(6, 'Valid pincode required'),
    country: z.string().min(2, 'Country required'),
    sameAsPresent: z.boolean(),
  }),
});

export const emergencyContactSchema = z.object({
  name: z.string().min(2, 'Contact name required'),
  relationship: z.string().min(2, 'Relationship required'),
  primaryPhone: z.string().regex(/^[0-9+\s-]{10,15}$/, 'Invalid phone number'),
  secondaryPhone: z.string().optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  address: z.string().min(5, 'Address required'),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string().min(8, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const academicQualificationSchema = z.object({
  degree: z.string().min(2, 'Degree title required'),
  specialization: z.string().min(2, 'Specialization required'),
  institution: z.string().min(2, 'Institution required'),
  university: z.string().min(2, 'University required'),
  yearOfPassing: z.number().min(1950, 'Invalid year').max(new Date().getFullYear(), 'Year cannot be in future'),
  percentageOrGrade: z.string().min(1, 'Grade/Percentage required'),
});

export const registrationDetailsSchema = z.object({
  councilName: z.string().min(3, 'Medical council name required'),
  registrationNumber: z.string().min(3, 'Registration number required'),
  state: z.string().min(2, 'State required'),
  registrationDate: z.string().min(1, 'Registration date required'),
  renewalDate: z.string().min(1, 'Renewal date required'),
});

export type PersonalInfoInput = z.infer<typeof personalInfoSchema>;
export type ContactInfoInput = z.infer<typeof contactInfoSchema>;
export type EmergencyContactInput = z.infer<typeof emergencyContactSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type AcademicQualificationInput = z.infer<typeof academicQualificationSchema>;
export type RegistrationDetailsInput = z.infer<typeof registrationDetailsSchema>;
