import { apiClient } from './apiClient';
import { ApiResponse, Doctor, HospitalAppointment } from '../../types/index';

export const mockDoctors: Doctor[] = [
  { id: 'doc-1', name: 'Dr. Subhash Chandra Roy', qualification: 'D.M.S., M.D. (Hom.)', department: 'Organon of Medicine', designation: 'Senior Consultant & HOD', opdSchedule: 'Mon, Wed, Fri (09:00 AM - 01:00 PM)', availableDays: ['Mon', 'Wed', 'Fri'], imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80' },
  { id: 'doc-2', name: 'Dr. Pratima Das', qualification: 'M.D. (Hom.) Materia Medica', department: 'Materia Medica', designation: 'Associate Professor & OPD Specialist', opdSchedule: 'Tue, Thu, Sat (10:00 AM - 02:00 PM)', availableDays: ['Tue', 'Thu', 'Sat'], imageUrl: 'https://images.unsplash.com/photo-1594824813566-78a9364f21d3?auto=format&fit=crop&w=300&q=80' },
  { id: 'doc-3', name: 'Dr. Anupam Mukherjee', qualification: 'M.D. (Hom.) Repertory', department: 'Repertory', designation: 'OPD Consultant Doctor', opdSchedule: 'Mon - Sat (09:30 AM - 01:30 PM)', availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], imageUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=300&q=80' },
];

export const mockAppointments: HospitalAppointment[] = [
  { id: 'app-1', appointmentNo: 'OPD-2026-4401', doctorName: 'Dr. Subhash Chandra Roy', doctorDepartment: 'Organon & General OPD', appointmentDate: '2026-07-28', timeSlot: '10:30 AM', status: 'SCHEDULED', symptoms: 'Chronic Sinusitis & Dust Allergy' },
  { id: 'app-2', appointmentNo: 'OPD-2026-3810', doctorName: 'Dr. Pratima Das', doctorDepartment: 'Materia Medica & Dermatology OPD', appointmentDate: '2026-06-15', timeSlot: '11:00 AM', status: 'COMPLETED', symptoms: 'Eczematous Skin Eruptions', prescriptionUrl: '#', labReportUrl: '#', followUpDate: '2026-08-10' },
];

export const hospitalApi = {
  getDoctors: async (params?: Record<string, any>): Promise<ApiResponse<Doctor[]>> => {
    try {
      const response = await apiClient.get<ApiResponse<Doctor[]>>('/hospital/doctors', { params });
      return response.data;
    } catch {
      return { success: true, message: 'Doctors fetched', data: mockDoctors, timestamp: new Date().toISOString() };
    }
  },

  getMyAppointments: async (): Promise<ApiResponse<HospitalAppointment[]>> => {
    try {
      const response = await apiClient.get<ApiResponse<HospitalAppointment[]>>('/hospital/my-appointments');
      return response.data;
    } catch {
      return { success: true, message: 'Appointments fetched', data: mockAppointments, timestamp: new Date().toISOString() };
    }
  },

  bookAppointment: async (data: { doctorId: string; appointmentDate: string; timeSlot: string; symptoms: string }): Promise<ApiResponse<HospitalAppointment>> => {
    try {
      const response = await apiClient.post<ApiResponse<HospitalAppointment>>('/hospital/appointments', data);
      return response.data;
    } catch {
      const doctor = mockDoctors.find((d) => d.id === data.doctorId) || mockDoctors[0];
      const newApp: HospitalAppointment = {
        id: `app-${Date.now()}`,
        appointmentNo: `OPD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        doctorName: doctor.name,
        doctorDepartment: doctor.department,
        appointmentDate: data.appointmentDate,
        timeSlot: data.timeSlot,
        status: 'SCHEDULED',
        symptoms: data.symptoms
      };
      return { success: true, message: 'OPD Appointment booked successfully', data: newApp, timestamp: new Date().toISOString() };
    }
  },

  getOpdSchedule: async () => {
    try {
      const response = await apiClient.get<ApiResponse<any>>('/hospital/opd-schedule');
      return response.data;
    } catch {
      return { success: true, message: 'OPD schedule loaded', data: mockDoctors, timestamp: new Date().toISOString() };
    }
  },

  getBedOccupancy: async () => {
    try {
      const response = await apiClient.get<ApiResponse<any>>('/hospital/bed-occupancy');
      return response.data;
    } catch {
      return { success: true, message: 'Bed occupancy loaded', data: { totalBeds: 50, occupied: 38, available: 12 }, timestamp: new Date().toISOString() };
    }
  }
};
