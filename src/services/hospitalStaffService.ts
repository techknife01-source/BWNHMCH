const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return defaultValue;
  }
};

const saveToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
};

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
}

const STORAGE_KEY = 'bhmch_hospital_staff_directory_pdf_v2';

export const OFFICIAL_HOSPITAL_STAFF: HospitalStaffMember[] = [
  {
    id: 'hs-001',
    slNo: 1,
    empId: 'SL-01',
    name: 'DR. SUSMITA CHATTERJEE.',
    roleCategory: 'MEDICAL_STAFF',
    department: 'MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'SUPERINTENDENT',
    category: 'MEDICAL STAFF',
    displayOrder: 1,
    status: 'ACTIVE',
  },
  {
    id: 'hs-002-v',
    slNo: 2,
    empId: 'SL-02',
    name: 'Prof. (Dr.) Pronab Bhattacharjee',
    roleCategory: 'MEDICAL_STAFF',
    department: 'ADMINISTRATION / ACADEMIC SECTION',
    designation: 'VICE PRINCIPAL / ACADEMIC IN-CHARGE',
    category: 'MEDICAL STAFF',
    displayOrder: 2,
    status: 'ACTIVE',
  },
  {
    id: 'hs-002',
    slNo: 3,
    empId: 'SL-03',
    name: 'DR. PUSPENDU BISWAS.',
    roleCategory: 'MEDICAL_STAFF',
    department: 'MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'SENIOR MEDICAL OFFICER',
    category: 'MEDICAL STAFF',
    displayOrder: 3,
    status: 'ACTIVE',
  },
  {
    id: 'hs-003',
    slNo: 4,
    empId: 'SL-04',
    name: 'DR. SOUMYA SAMANTA.',
    roleCategory: 'MEDICAL_STAFF',
    department: 'MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'RESIDENTIAL MEDICAL OFFICER',
    category: 'MEDICAL STAFF',
    displayOrder: 4,
    status: 'ACTIVE',
  },
  {
    id: 'hs-004',
    slNo: 5,
    empId: 'SL-05',
    name: 'DR. ANUP PRASAD GUPTA',
    roleCategory: 'MEDICAL_STAFF',
    department: 'MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'DEPUTY SUPERINTENDENT.',
    category: 'MEDICAL STAFF',
    displayOrder: 5,
    status: 'ACTIVE',
  },
  {
    id: 'hs-005',
    slNo: 6,
    empId: 'SL-06',
    name: 'DR. SHYMASHREE PAL.',
    roleCategory: 'MEDICAL_STAFF',
    department: 'MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'MEDICAL OFFICER',
    category: 'MEDICAL STAFF',
    displayOrder: 6,
    status: 'ACTIVE',
  },
  {
    id: 'hs-006',
    slNo: 7,
    empId: 'SL-07',
    name: 'DR. BHUBANESWAR BHATTACHERJEE',
    roleCategory: 'MEDICAL_STAFF',
    department: 'MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'CLINICAL BIO CHEMIST',
    category: 'MEDICAL STAFF',
    displayOrder: 7,
    status: 'ACTIVE',
  },
  {
    id: 'hs-007',
    slNo: 8,
    empId: 'SL-08',
    name: 'DR. NAMRATA DAS',
    roleCategory: 'MEDICAL_STAFF',
    department: 'MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'HOUSE PHYSICIAN',
    category: 'MEDICAL STAFF',
    displayOrder: 8,
    status: 'ACTIVE',
  },
  {
    id: 'hs-008',
    slNo: 9,
    empId: 'SL-09',
    name: 'CHANDRA DAS',
    roleCategory: 'OFFICE_STAFF',
    department: 'OFFICE STAFF (HOSPITAL SECTION)',
    designation: 'L.D.C (REGISTRATION CLARK)',
    category: 'OFFICE STAFF',
    displayOrder: 9,
    status: 'ACTIVE',
  },
  {
    id: 'hs-009',
    slNo: 10,
    empId: 'SL-10',
    name: 'PUSPA DEY',
    roleCategory: 'PARAMEDICAL_STAFF',
    department: 'PARA - MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'STAFF NURSE.',
    category: 'PARAMEDICAL STAFF',
    displayOrder: 10,
    status: 'ACTIVE',
  },
  {
    id: 'hs-010',
    slNo: 11,
    empId: 'SL-11',
    name: 'DR SUSHIL MURMU',
    roleCategory: 'MEDICAL_STAFF',
    department: 'MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'SURGEN',
    category: 'MEDICAL STAFF',
    displayOrder: 11,
    status: 'ACTIVE',
  },
  {
    id: 'hs-011',
    slNo: 12,
    empId: 'SL-12',
    name: 'DR. TAPAN KUMAR BANDYOPADHYAY',
    roleCategory: 'MEDICAL_STAFF',
    department: 'MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'GYNAECOLOGIST & OBSTETRICIAN',
    category: 'MEDICAL STAFF',
    displayOrder: 12,
    status: 'ACTIVE',
  },
  {
    id: 'hs-012',
    slNo: 13,
    empId: 'SL-13',
    name: 'ANAESTHETIST. (ON CALL)',
    roleCategory: 'MEDICAL_STAFF',
    department: 'MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'ANAESTHETIST',
    category: 'MEDICAL STAFF',
    displayOrder: 13,
    status: 'ACTIVE',
  },
  {
    id: 'hs-013',
    slNo: 14,
    empId: 'SL-14',
    name: 'DR ASITAVA MUKHERJEE',
    roleCategory: 'MEDICAL_STAFF',
    department: 'MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'RADIOLOGIST',
    category: 'MEDICAL STAFF',
    displayOrder: 14,
    status: 'ACTIVE',
  },
  {
    id: 'hs-014',
    slNo: 15,
    empId: 'SL-15',
    name: 'DR. NILADRI MODOK.',
    roleCategory: 'MEDICAL_STAFF',
    department: 'MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'SONOLOGIST',
    category: 'MEDICAL STAFF',
    displayOrder: 15,
    status: 'ACTIVE',
  },
  {
    id: 'hs-015',
    slNo: 16,
    empId: 'SL-16',
    name: 'DR. PRITRISH MUKHERJEE',
    roleCategory: 'MEDICAL_STAFF',
    department: 'MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'DENTIST',
    category: 'MEDICAL STAFF',
    displayOrder: 16,
    status: 'ACTIVE',
  },
  {
    id: 'hs-016',
    slNo: 17,
    empId: 'SL-17',
    name: 'SANDHYA DAS',
    roleCategory: 'PARAMEDICAL_STAFF',
    department: 'PARA - MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'STAFF NURSE.',
    category: 'PARAMEDICAL STAFF',
    displayOrder: 17,
    status: 'ACTIVE',
  },
  {
    id: 'hs-017',
    slNo: 18,
    empId: 'SL-18',
    name: 'ARUNIMA LAHA.',
    roleCategory: 'PARAMEDICAL_STAFF',
    department: 'PARA - MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'DIETICIAN',
    category: 'PARAMEDICAL STAFF',
    displayOrder: 18,
    status: 'ACTIVE',
  },
  {
    id: 'hs-018',
    slNo: 19,
    empId: 'SL-19',
    name: 'SUKDEV MUKHERJEE',
    roleCategory: 'PARAMEDICAL_STAFF',
    department: 'PARA - MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'PHYSIOTHERAPIST',
    category: 'PARAMEDICAL STAFF',
    displayOrder: 19,
    status: 'ACTIVE',
  },
  {
    id: 'hs-019',
    slNo: 20,
    empId: 'SL-20',
    name: 'SUNIL KUMAR SHAW',
    roleCategory: 'PARAMEDICAL_STAFF',
    department: 'PARA - MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'YOGA & NATUROPATHY',
    category: 'PARAMEDICAL STAFF',
    displayOrder: 20,
    status: 'ACTIVE',
  },
  {
    id: 'hs-020',
    slNo: 21,
    empId: 'SL-21',
    name: 'SWAPAN BARAL',
    roleCategory: 'OFFICE_STAFF',
    department: 'OFFICE STAFF (HOSPITAL SECTION)',
    designation: 'DISPENSER',
    category: 'OFFICE STAFF',
    displayOrder: 21,
    status: 'ACTIVE',
  },
  {
    id: 'hs-021',
    slNo: 22,
    empId: 'SL-22',
    name: 'UJJWAL KR. MONDAL',
    roleCategory: 'OFFICE_STAFF',
    department: 'OFFICE STAFF (HOSPITAL SECTION)',
    designation: 'DISPENSER',
    category: 'OFFICE STAFF',
    displayOrder: 22,
    status: 'ACTIVE',
  },
  {
    id: 'hs-022',
    slNo: 23,
    empId: 'SL-23',
    name: 'SHOUVIK PAL',
    roleCategory: 'NON_MEDICAL_STAFF',
    department: 'NON - MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'UDC',
    category: 'NON-MEDICAL STAFF',
    displayOrder: 23,
    status: 'ACTIVE',
  },
  {
    id: 'hs-023',
    slNo: 24,
    empId: 'SL-24',
    name: 'KALPANA GHOSAL',
    roleCategory: 'PARAMEDICAL_STAFF',
    department: 'PARA - MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'STAFF NURSE.',
    category: 'PARAMEDICAL STAFF',
    displayOrder: 24,
    status: 'ACTIVE',
  },
  {
    id: 'hs-024',
    slNo: 25,
    empId: 'SL-25',
    name: 'SANCHITA DAS',
    roleCategory: 'NON_MEDICAL_STAFF',
    department: 'NON - MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'L.D.C',
    category: 'NON-MEDICAL STAFF',
    displayOrder: 25,
    status: 'ACTIVE',
  },
  {
    id: 'hs-025',
    slNo: 26,
    empId: 'SL-26',
    name: 'GEETA PAL',
    roleCategory: 'PARAMEDICAL_STAFF',
    department: 'PARA - MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'STAFF NURSE.',
    category: 'PARAMEDICAL STAFF',
    displayOrder: 26,
    status: 'ACTIVE',
  },
  {
    id: 'hs-026',
    slNo: 27,
    empId: 'SL-27',
    name: 'SUMITA CHAKRABORTY',
    roleCategory: 'NON_MEDICAL_STAFF',
    department: 'NON - MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'PUBLIC RELATION OFFICER',
    category: 'NON-MEDICAL STAFF',
    displayOrder: 27,
    status: 'ACTIVE',
  },
  {
    id: 'hs-027',
    slNo: 28,
    empId: 'SL-28',
    name: 'MAYUKH MUKHERJEE',
    roleCategory: 'PARAMEDICAL_STAFF',
    department: 'PARA - MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'USG ASSISTANT.',
    category: 'PARAMEDICAL STAFF',
    displayOrder: 28,
    status: 'ACTIVE',
  },
  {
    id: 'hs-028',
    slNo: 29,
    empId: 'SL-29',
    name: 'NIHAR KUMAR SANTRA',
    roleCategory: 'NON_MEDICAL_STAFF',
    department: 'NON - MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'SECUIRITY.',
    category: 'NON-MEDICAL STAFF',
    displayOrder: 29,
    status: 'ACTIVE',
  },
  {
    id: 'hs-029',
    slNo: 30,
    empId: 'SL-30',
    name: 'CHAINA GHOSH',
    roleCategory: 'PARAMEDICAL_STAFF',
    department: 'PARA - MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'O.T. ASSISTANT.',
    category: 'PARAMEDICAL STAFF',
    displayOrder: 30,
    status: 'ACTIVE',
  },
  {
    id: 'hs-030',
    slNo: 31,
    empId: 'SL-31',
    name: 'RAHUL DAS',
    roleCategory: 'NON_MEDICAL_STAFF',
    department: 'NON - MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'SECURITY GUARD',
    category: 'NON-MEDICAL STAFF',
    displayOrder: 31,
    status: 'ACTIVE',
  },
  {
    id: 'hs-031',
    slNo: 32,
    empId: 'SL-32',
    name: 'SK. AKTAR',
    roleCategory: 'NON_MEDICAL_STAFF',
    department: 'NON - MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'SWEEPER',
    category: 'NON-MEDICAL STAFF',
    displayOrder: 32,
    status: 'ACTIVE',
  },
  {
    id: 'hs-032',
    slNo: 33,
    empId: 'SL-33',
    name: 'TINA ROY',
    roleCategory: 'PARAMEDICAL_STAFF',
    department: 'PARA - MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'NURSING STAFF',
    category: 'PARAMEDICAL STAFF',
    displayOrder: 33,
    status: 'ACTIVE',
  },
  {
    id: 'hs-033',
    slNo: 34,
    empId: 'SL-34',
    name: 'RENUKA BARI',
    roleCategory: 'PARAMEDICAL_STAFF',
    department: 'PARA - MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'NURSING STAFF',
    category: 'PARAMEDICAL STAFF',
    displayOrder: 34,
    status: 'ACTIVE',
  },
  {
    id: 'hs-034',
    slNo: 35,
    empId: 'SL-35',
    name: 'BRISHTI DAS',
    roleCategory: 'OFFICE_STAFF',
    department: 'OFFICE STAFF (HOSPITAL SECTION)',
    designation: 'AYA',
    category: 'OFFICE STAFF',
    displayOrder: 35,
    status: 'ACTIVE',
  },
  {
    id: 'hs-035',
    slNo: 36,
    empId: 'SL-36',
    name: 'SARMISTHA DAS',
    roleCategory: 'OFFICE_STAFF',
    department: 'OFFICE STAFF (HOSPITAL SECTION)',
    designation: 'AYA',
    category: 'OFFICE STAFF',
    displayOrder: 36,
    status: 'ACTIVE',
  },
  {
    id: 'hs-036',
    slNo: 37,
    empId: 'SL-37',
    name: 'AMIT DHANK',
    roleCategory: 'OFFICE_STAFF',
    department: 'OFFICE STAFF (HOSPITAL SECTION)',
    designation: 'WARD BOY',
    category: 'OFFICE STAFF',
    displayOrder: 37,
    status: 'ACTIVE',
  },
  {
    id: 'hs-037',
    slNo: 38,
    empId: 'SL-38',
    name: 'RINKU DEY',
    roleCategory: 'NON_MEDICAL_STAFF',
    department: 'NON - MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'MULTI TUSK STAFF (ADMISTRATIVE)',
    category: 'NON-MEDICAL STAFF',
    displayOrder: 38,
    status: 'ACTIVE',
  },
  {
    id: 'hs-038',
    slNo: 39,
    empId: 'SL-39',
    name: 'DULAL BOSE',
    roleCategory: 'NON_MEDICAL_STAFF',
    department: 'NON - MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'WARD BOY',
    category: 'NON-MEDICAL STAFF',
    displayOrder: 39,
    status: 'ACTIVE',
  },
  {
    id: 'hs-039',
    slNo: 40,
    empId: 'SL-40',
    name: 'HIRALAL PRAMANIK',
    roleCategory: 'NON_MEDICAL_STAFF',
    department: 'NON - MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'SECURITY GUARD',
    category: 'NON-MEDICAL STAFF',
    displayOrder: 40,
    status: 'ACTIVE',
  },
  {
    id: 'hs-040',
    slNo: 41,
    empId: 'SL-41',
    name: 'DEBDAS CAKRABORTY',
    roleCategory: 'NON_MEDICAL_STAFF',
    department: 'NON - MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'SECURITY GUARD',
    category: 'NON-MEDICAL STAFF',
    displayOrder: 41,
    status: 'ACTIVE',
  },
  {
    id: 'hs-041',
    slNo: 42,
    empId: 'SL-42',
    name: 'MOUMITA MAJI',
    roleCategory: 'MEDICAL_STAFF',
    department: 'MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'YOGA EXPERT.',
    category: 'MEDICAL STAFF',
    displayOrder: 42,
    status: 'ACTIVE',
  },
  {
    id: 'hs-042',
    slNo: 43,
    empId: 'SL-43',
    name: 'SHILPI DAS',
    roleCategory: 'NON_MEDICAL_STAFF',
    department: 'NON - MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'DRESSER',
    category: 'NON-MEDICAL STAFF',
    displayOrder: 43,
    status: 'ACTIVE',
  },
  {
    id: 'hs-043',
    slNo: 44,
    empId: 'SL-44',
    name: 'AWADHESH KUMAR MAHATO',
    roleCategory: 'PARAMEDICAL_STAFF',
    department: 'PARA - MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'MEDICAL LABORATORY TECHNICIAN',
    category: 'PARAMEDICAL STAFF',
    displayOrder: 44,
    status: 'ACTIVE',
  },
];

import { adminHrService } from './adminHrService';

class HospitalStaffService {
  private staffList: HospitalStaffMember[] = getFromStorage(STORAGE_KEY, OFFICIAL_HOSPITAL_STAFF);

  async fetchStaffAsync(): Promise<HospitalStaffMember[]> {
    try {
      const res = await fetch('/api/v1/staff');
      if (res.ok) {
        const json = await res.json();
        if (json && json.success && Array.isArray(json.data)) {
          this.staffList = json.data.map((item: any, idx: number) => ({
            ...item,
            slNo: idx + 1,
            empId: item.empId || `SL-${String(idx + 1).padStart(2, '0')}`,
          }));
          saveToStorage(STORAGE_KEY, this.staffList);
        }
      }
    } catch (err) {
      console.warn('[HospitalStaffService] API fetch warning:', err);
    }
    return this.getAllStaff();
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
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken') || '';
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch('/api/v1/staff', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...data,
          category: data.roleCategory === 'OFFICE_STAFF' ? 'ADMINISTRATIVE STAFF' : data.department,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json && json.success) {
          await this.fetchStaffAsync();
          return json.data;
        }
      }
    } catch (err) {
      console.warn('[HospitalStaffService] addStaffMember API warning:', err);
    }

    const nextSl = (Math.max(...this.staffList.map((s) => s.slNo || 0), 0)) + 1;
    const newMember: HospitalStaffMember = {
      ...data,
      slNo: data.slNo || nextSl,
      id: `hs-${String(nextSl).padStart(3, '0')}`,
    };
    this.staffList.push(newMember);
    saveToStorage(STORAGE_KEY, this.staffList);

    this.safeLogAudit({
      module: 'MEDICAL_STAFF',
      action: 'ADD_MEDICAL_STAFF',
      performedBy: 'Super Admin',
      userRole: 'ROLE_SUPER_ADMIN',
      details: `Added new staff member: ${newMember.name} (${newMember.department} - ${newMember.designation})`,
      status: 'SUCCESS',
    });

    return newMember;
  }

  addStaffMember(data: Omit<HospitalStaffMember, 'id'>): HospitalStaffMember {
    this.addStaffMemberAsync(data).catch(() => {});
    const nextSl = (Math.max(...this.staffList.map((s) => s.slNo || 0), 0)) + 1;
    const newMember: HospitalStaffMember = {
      ...data,
      slNo: data.slNo || nextSl,
      id: `hs-${String(nextSl).padStart(3, '0')}`,
    };
    this.staffList.push(newMember);
    saveToStorage(STORAGE_KEY, this.staffList);
    return newMember;
  }

  async updateStaffMemberAsync(id: string, updates: Partial<HospitalStaffMember>): Promise<HospitalStaffMember | undefined> {
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken') || '';
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch(`/api/v1/staff/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const json = await res.json();
        if (json && json.success) {
          await this.fetchStaffAsync();
          return json.data;
        }
      }
    } catch (err) {
      console.warn('[HospitalStaffService] updateStaffMember API warning:', err);
    }

    const idx = this.staffList.findIndex((s) => s.id === id);
    if (idx !== -1) {
      const oldStatus = this.staffList[idx].status;
      this.staffList[idx] = { ...this.staffList[idx], ...updates };
      saveToStorage(STORAGE_KEY, this.staffList);

      const action = updates.status && updates.status !== oldStatus 
        ? (updates.status === 'INACTIVE' ? 'DEACTIVATE_MEDICAL_STAFF' : 'REACTIVATE_MEDICAL_STAFF')
        : 'UPDATE_MEDICAL_STAFF';

      this.safeLogAudit({
        module: 'MEDICAL_STAFF',
        action,
        performedBy: 'Super Admin',
        userRole: 'ROLE_SUPER_ADMIN',
        details: `Updated medical staff member '${this.staffList[idx].name}' (ID: ${id})`,
        status: 'SUCCESS',
      });

      return this.staffList[idx];
    }
    return undefined;
  }

  updateStaffMember(id: string, updates: Partial<HospitalStaffMember>): HospitalStaffMember | undefined {
    this.updateStaffMemberAsync(id, updates).catch(() => {});
    const idx = this.staffList.findIndex((s) => s.id === id);
    if (idx !== -1) {
      this.staffList[idx] = { ...this.staffList[idx], ...updates };
      saveToStorage(STORAGE_KEY, this.staffList);
      return this.staffList[idx];
    }
    return undefined;
  }

  async deleteStaffMemberAsync(id: string): Promise<boolean> {
    const target = this.staffList.find((s) => s.id === id);
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken') || '';
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch(`/api/v1/staff/${id}`, {
        method: 'DELETE',
        headers,
      });
      if (res.ok) {
        if (target) {
          this.safeLogAudit({
            module: 'MEDICAL_STAFF',
            action: 'DELETE_MEDICAL_STAFF',
            performedBy: 'Super Admin',
            userRole: 'ROLE_SUPER_ADMIN',
            details: `Permanently deleted staff member '${target.name}' (ID: ${id})`,
            status: 'SUCCESS',
          });
        }
        await this.fetchStaffAsync();
        return true;
      }
    } catch (err) {
      console.warn('[HospitalStaffService] deleteStaffMember API warning:', err);
    }

    const initialLength = this.staffList.length;
    this.staffList = this.staffList.filter((s) => s.id !== id);
    if (this.staffList.length < initialLength) {
      saveToStorage(STORAGE_KEY, this.staffList);
      if (target) {
        this.safeLogAudit({
          module: 'MEDICAL_STAFF',
          action: 'DELETE_MEDICAL_STAFF',
          performedBy: 'Super Admin',
          userRole: 'ROLE_SUPER_ADMIN',
          details: `Permanently deleted staff member '${target.name}' (ID: ${id})`,
          status: 'SUCCESS',
        });
      }
      return true;
    }
    return false;
  }

  deleteStaffMember(id: string): boolean {
    this.deleteStaffMemberAsync(id).catch(() => {});
    const initialLength = this.staffList.length;
    this.staffList = this.staffList.filter((s) => s.id !== id);
    if (this.staffList.length < initialLength) {
      saveToStorage(STORAGE_KEY, this.staffList);
      return true;
    }
    return false;
  }

  resetToDefault(): void {
    this.staffList = [...OFFICIAL_HOSPITAL_STAFF];
    saveToStorage(STORAGE_KEY, this.staffList);
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
