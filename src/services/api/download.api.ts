import { apiClient } from './apiClient';
import { ApiResponse, DownloadItem } from '../../types/index';

export const mockDownloads: DownloadItem[] = [
  { id: 'dl-1', title: 'BHMS 3rd Professional WBUHS Syllabus & Examination Regulations', category: 'Prospectus', fileType: 'PDF', fileSize: '4.8 MB', updatedAt: '2026-06-10', downloadUrl: '#' },
  { id: 'dl-2', title: 'WBUHS 3rd Year University Examination Admit Card / Hall Ticket (2026)', category: 'Hall Ticket', fileType: 'PDF', fileSize: '1.2 MB', updatedAt: '2026-07-20', downloadUrl: '#' },
  { id: 'dl-3', title: 'Student Digital Identity Card Duplicate Request Form', category: 'ID Card', fileType: 'PDF', fileSize: '650 KB', updatedAt: '2026-05-15', downloadUrl: '#' },
  { id: 'dl-4', title: 'BHMS Clinical Rotations Hospital Logbook Proforma', category: 'Forms', fileType: 'PDF', fileSize: '3.1 MB', updatedAt: '2026-04-12', downloadUrl: '#' },
  { id: 'dl-5', title: 'Academic Session Calendar & Holiday Schedule (2026 - 2027)', category: 'Academic Calendar', fileType: 'PDF', fileSize: '2.2 MB', updatedAt: '2026-07-01', downloadUrl: '#' },
  { id: 'dl-6', title: 'No Dues Clearance Certificate Application Form', category: 'Certificates', fileType: 'PDF', fileSize: '850 KB', updatedAt: '2026-06-25', downloadUrl: '#' },
];

export const downloadApi = {
  getDownloads: async (): Promise<ApiResponse<DownloadItem[]>> => {
    try {
      const response = await apiClient.get<ApiResponse<DownloadItem[]>>('/student/downloads');
      return response.data;
    } catch {
      return { success: true, message: 'Downloads fetched', data: mockDownloads, timestamp: new Date().toISOString() };
    }
  },

  downloadFile: async (id: string, fileName: string): Promise<Blob> => {
    try {
      const response = await apiClient.get(`/student/downloads/${id}`, { responseType: 'blob' });
      return response.data;
    } catch {
      const content = `Official Document File: ${fileName}`;
      return new Blob([content], { type: 'application/pdf' });
    }
  }
};
