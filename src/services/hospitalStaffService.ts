import { staffApi } from './api/staff.api';
import { adminHrService } from './adminHrService';

export type StaffRoleCategory = 'MEDICAL_STAFF' | 'OFFICE_STAFF' | 'PARAMEDICAL_STAFF' | 'NON_MEDICAL_STAFF';

export interface HospitalStaffMember {
  id: string;
  slNo: number;
  empId: string;
  name: string;
  roleCategory: StaffRoleCategory;
  department: string;
  designation: string;
  category?: string;
  displayOrder?: number;
  qualification?: string;
  specialization?: string;
  experience?: string;
  registrationNumber?: string;
  contactNumber?: string;
  email?: string;
  photoUrl?: string;
  joiningDate?: string;
  biography?: string;
  availability?: 'AVAILABLE' | 'ON_DUTY' | 'ON_LEAVE' | 'EMERGENCY_DUTY' | 'SHIFT_DUTY';
  dutyShift?: string;
  opdCounter?: string;
  status: 'ACTIVE' | 'INACTIVE';
  joiningYear?: number;
  promotionDate?: string;
}

class HospitalStaffService {
  private staffList: HospitalStaffMember[] = [];

  async fetchStaffAsync(): Promise<HospitalStaffMember[]> {
    try {
      const res: any = await staffApi.getStaffList();
      let rawList: any[] | null = null;
      if (Array.isArray(res)) {
        rawList = res;
      } else if (Array.isArray(res?.data)) {
        rawList = res.data;
      } else if (Array.isArray(res?.data?.data)) {
        rawList = res.data.data;
      } else if (Array.isArray(res?.data?.content)) {
        rawList = res.data.content;
      } else if (Array.isArray(res?.staff)) {
        rawList = res.staff;
      }

      if (Array.isArray(rawList)) {
        this.staffList = rawList.map((item: any, idx: number) => ({
          ...item,
          id: item.id || item._id,
          slNo: item.slNo || idx + 1,
          empId: item.empId || `SL-${String(idx + 1).padStart(2, '0')}`,
          name: item.name || item.facultyName || 'Staff Member',
          department: item.department || item.departmentName || 'HOSPITAL SECTION',
          designation: item.designation || 'Staff',
          roleCategory: item.roleCategory || (item.category === 'ACADEMIC FACULTY' ? 'MEDICAL_STAFF' : 'OFFICE_STAFF'),
          status: (item.status || 'ACTIVE').toUpperCase() === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE',
        }));
        return this.staffList;
      }
    } catch (err) {
      console.warn('[HospitalStaffService] API fetch error:', err);
    }
    return this.staffList;
  }

  async getStaffByIdAsync(id: string): Promise<HospitalStaffMember | undefined> {
    try {
      const res = await staffApi.getStaffById(id);
      const target = res?.data || res;
      if (target) {
        return {
          ...target,
          id: target.id || target._id,
          name: target.name || target.facultyName,
          department: target.department || target.departmentName,
        };
      }
    } catch (err) {
      console.warn('[HospitalStaffService] getStaffByIdAsync error:', err);
    }
    return this.staffList.find((s) => s.id === id);
  }

  getAllStaff(): HospitalStaffMember[] {
    return [...this.staffList].sort((a, b) => (a.slNo || 0) - (b.slNo || 0));
  }

  getActiveStaff(): HospitalStaffMember[] {
    return this.getAllStaff().filter((s) => s.status === 'ACTIVE');
  }

  getStaffById(id: string): HospitalStaffMember | undefined {
    return this.staffList.find((s) => s.id === id);
  }

  async addStaffMemberAsync(data: Omit<HospitalStaffMember, 'id'>): Promise<HospitalStaffMember> {
    const payload = {
      ...data,
      category: data.roleCategory === 'OFFICE_STAFF' ? 'ADMINISTRATIVE STAFF' : data.department,
    };
    const res = await staffApi.createStaff(payload);
    const target = res?.data || res;
    if (target && (target.id || target._id)) {
      await this.fetchStaffAsync();
      return target;
    }
    throw new Error(res?.message || 'Failed to create staff member in backend');
  }

  addStaffMember(data: Omit<HospitalStaffMember, 'id'>): HospitalStaffMember {
    const nextSl = (Math.max(...this.staffList.map((s) => s.slNo || 0), 0)) + 1;
    return {
      ...data,
      slNo: data.slNo || nextSl,
      id: `hs-${String(nextSl).padStart(3, '0')}`,
    };
  }

  async updateStaffMemberAsync(id: string, updates: Partial<HospitalStaffMember>): Promise<HospitalStaffMember | undefined> {
    console.log('[STAFF EDIT] CALLING PUT:', `/api/v1/staff/${id}`);
    const res = await staffApi.updateStaff(id, updates);
    console.log('[STAFF EDIT] PUT RESPONSE:', res);
    const target = res?.data || res;
    if (target && (target.id || target._id)) {
      await this.fetchStaffAsync();
      return target;
    }
    throw new Error(res?.message || `Failed to update staff member '${id}'`);
  }

  updateStaffMember(id: string, updates: Partial<HospitalStaffMember>): HospitalStaffMember | undefined {
    const idx = this.staffList.findIndex((s) => s.id === id);
    if (idx !== -1) {
      this.staffList[idx] = { ...this.staffList[idx], ...updates };
      return this.staffList[idx];
    }
    return undefined;
  }

  async deleteStaffMemberAsync(id: string): Promise<boolean> {
    console.log('[STAFF DELETE] CALLING DELETE:', `/api/v1/staff/${id}`);
    const res = await staffApi.deleteStaff(id);
    console.log('[STAFF DELETE] DELETE RESPONSE:', res);
    if (res && res.success !== false) {
      await this.fetchStaffAsync();
      return true;
    }
    throw new Error(res?.message || `Failed to delete staff member '${id}'`);
  }

  deleteStaffMember(id: string): boolean {
    const initialLength = this.staffList.length;
    this.staffList = this.staffList.filter((s) => s.id !== id);
    return this.staffList.length < initialLength;
  }

  resetToDefault(): void {
    this.fetchStaffAsync();
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
        console.warn('[HospitalStaff audit notice]: adminHrService audit method unavailable', entry);
      }
    } catch (e) {
      console.warn('[HospitalStaff audit notice]: non-fatal audit log error', e);
    }
  }
}

export const hospitalStaffService = new HospitalStaffService();
