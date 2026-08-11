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
  qualification?: string;
  contactNumber?: string;
  email?: string;
  photoUrl?: string;
  availability?: 'AVAILABLE' | 'ON_DUTY' | 'ON_LEAVE' | 'EMERGENCY_DUTY' | 'SHIFT_DUTY';
  dutyShift?: string;
  opdCounter?: string;
  status: 'ACTIVE' | 'INACTIVE';
  joiningYear?: number;
}

const STORAGE_KEY = 'bhmch_hospital_staff_directory_pdf_v1';

export const OFFICIAL_HOSPITAL_STAFF: HospitalStaffMember[] = [
  {
    id: 'hs-001',
    slNo: 1,
    empId: 'SL-01',
    name: 'DR. SUSMITA CHATTERJEE.',
    roleCategory: 'MEDICAL_STAFF',
    department: 'MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'SUPERINTENDENT',
    status: 'ACTIVE'
  },
  {
    id: 'hs-002',
    slNo: 2,
    empId: 'SL-02',
    name: 'DR. PUSPENDU BISWAS.',
    roleCategory: 'MEDICAL_STAFF',
    department: 'MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'SENIOR MEDICAL OFFICER',
    status: 'ACTIVE'
  },
  {
    id: 'hs-003',
    slNo: 3,
    empId: 'SL-03',
    name: 'DR. SOUMYA SAMANTA.',
    roleCategory: 'MEDICAL_STAFF',
    department: 'MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'RESIDENTIAL MEDICAL OFFICER',
    status: 'ACTIVE'
  },
  {
    id: 'hs-004',
    slNo: 4,
    empId: 'SL-04',
    name: 'DR. ANUP PRASAD GUPTA',
    roleCategory: 'MEDICAL_STAFF',
    department: 'MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'DEPUTY SUPERINTENDENT.',
    status: 'ACTIVE'
  },
  {
    id: 'hs-005',
    slNo: 5,
    empId: 'SL-05',
    name: 'DR. SHYMASHREE PAL.',
    roleCategory: 'MEDICAL_STAFF',
    department: 'MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'MEDICAL OFFICER',
    status: 'ACTIVE'
  },
  {
    id: 'hs-006',
    slNo: 6,
    empId: 'SL-06',
    name: 'DR. BHUBANESWAR BHATTACHERJEE',
    roleCategory: 'MEDICAL_STAFF',
    department: 'MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'CLINICAL BIO CHEMIST',
    status: 'ACTIVE'
  },
  {
    id: 'hs-007',
    slNo: 7,
    empId: 'SL-07',
    name: 'DR. NAMRATA DAS',
    roleCategory: 'MEDICAL_STAFF',
    department: 'MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'HOUSE PHYSICIAN',
    status: 'ACTIVE'
  },
  {
    id: 'hs-008',
    slNo: 8,
    empId: 'SL-08',
    name: 'CHANDRA DAS',
    roleCategory: 'OFFICE_STAFF',
    department: 'OFFICE STAFF (HOSPITAL SECTION)',
    designation: 'L.D.C (REGISTRATION CLARK)',
    status: 'ACTIVE'
  },
  {
    id: 'hs-009',
    slNo: 9,
    empId: 'SL-09',
    name: 'PUSPA DEY',
    roleCategory: 'PARAMEDICAL_STAFF',
    department: 'PARA - MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'STAFF NURSE.',
    status: 'ACTIVE'
  },
  {
    id: 'hs-010',
    slNo: 10,
    empId: 'SL-10',
    name: 'DR SUSHIL MURMU',
    roleCategory: 'MEDICAL_STAFF',
    department: 'MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'SURGEN',
    status: 'ACTIVE'
  },
  {
    id: 'hs-011',
    slNo: 11,
    empId: 'SL-11',
    name: 'DR. TAPAN KUMAR BANDYOPADHYAY',
    roleCategory: 'MEDICAL_STAFF',
    department: 'MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'GYNAECOLOGIST & OBSTETRICIAN',
    status: 'ACTIVE'
  },
  {
    id: 'hs-012',
    slNo: 12,
    empId: 'SL-12',
    name: 'ANAESTHETIST. (ON CALL)',
    roleCategory: 'MEDICAL_STAFF',
    department: 'MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'ANAESTHETIST',
    status: 'ACTIVE'
  },
  {
    id: 'hs-013',
    slNo: 13,
    empId: 'SL-13',
    name: 'DR ASITAVA MUKHERJEE',
    roleCategory: 'MEDICAL_STAFF',
    department: 'MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'RADIOLOGIST',
    status: 'ACTIVE'
  },
  {
    id: 'hs-014',
    slNo: 14,
    empId: 'SL-14',
    name: 'DR. NILADRI MODOK.',
    roleCategory: 'MEDICAL_STAFF',
    department: 'MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'SONOLOGIST',
    status: 'ACTIVE'
  },
  {
    id: 'hs-015',
    slNo: 15,
    empId: 'SL-15',
    name: 'DR. PRITRISH MUKHERJEE',
    roleCategory: 'MEDICAL_STAFF',
    department: 'MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'DENTIST',
    status: 'ACTIVE'
  },
  {
    id: 'hs-016',
    slNo: 16,
    empId: 'SL-16',
    name: 'SANDHYA DAS',
    roleCategory: 'PARAMEDICAL_STAFF',
    department: 'PARA - MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'STAFF NURSE.',
    status: 'ACTIVE'
  },
  {
    id: 'hs-017',
    slNo: 17,
    empId: 'SL-17',
    name: 'ARUNIMA LAHA.',
    roleCategory: 'PARAMEDICAL_STAFF',
    department: 'PARA - MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'DIETICIAN',
    status: 'ACTIVE'
  },
  {
    id: 'hs-018',
    slNo: 18,
    empId: 'SL-18',
    name: 'SUKDEV MUKHERJEE',
    roleCategory: 'PARAMEDICAL_STAFF',
    department: 'PARA - MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'PHYSIOTHERAPIST',
    status: 'ACTIVE'
  },
  {
    id: 'hs-019',
    slNo: 19,
    empId: 'SL-19',
    name: 'SUNIL KUMAR SHAW',
    roleCategory: 'PARAMEDICAL_STAFF',
    department: 'PARA - MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'YOGA & NATUROPATHY',
    status: 'ACTIVE'
  },
  {
    id: 'hs-020',
    slNo: 20,
    empId: 'SL-20',
    name: 'SWAPAN BARAL',
    roleCategory: 'OFFICE_STAFF',
    department: 'OFFICE STAFF (HOSPITAL SECTION)',
    designation: 'DISPENSER',
    status: 'ACTIVE'
  },
  {
    id: 'hs-021',
    slNo: 21,
    empId: 'SL-21',
    name: 'UJJWAL KR. MONDAL',
    roleCategory: 'OFFICE_STAFF',
    department: 'OFFICE STAFF (HOSPITAL SECTION)',
    designation: 'DISPENSER',
    status: 'ACTIVE'
  },
  {
    id: 'hs-022',
    slNo: 22,
    empId: 'SL-22',
    name: 'SHOUVIK PAL',
    roleCategory: 'NON_MEDICAL_STAFF',
    department: 'NON - MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'UDC',
    status: 'ACTIVE'
  },
  {
    id: 'hs-023',
    slNo: 23,
    empId: 'SL-23',
    name: 'KALPANA GHOSAL',
    roleCategory: 'PARAMEDICAL_STAFF',
    department: 'PARA - MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'STAFF NURSE.',
    status: 'ACTIVE'
  },
  {
    id: 'hs-024',
    slNo: 24,
    empId: 'SL-24',
    name: 'SANCHITA DAS',
    roleCategory: 'NON_MEDICAL_STAFF',
    department: 'NON - MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'L.D.C',
    status: 'ACTIVE'
  },
  {
    id: 'hs-025',
    slNo: 25,
    empId: 'SL-25',
    name: 'GEETA PAL',
    roleCategory: 'PARAMEDICAL_STAFF',
    department: 'PARA - MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'STAFF NURSE.',
    status: 'ACTIVE'
  },
  {
    id: 'hs-026',
    slNo: 26,
    empId: 'SL-26',
    name: 'SUMITA CHAKRABORTY',
    roleCategory: 'NON_MEDICAL_STAFF',
    department: 'NON - MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'PUBLIC RELATION OFFICER',
    status: 'ACTIVE'
  },
  {
    id: 'hs-027',
    slNo: 27,
    empId: 'SL-27',
    name: 'MAYUKH MUKHERJEE',
    roleCategory: 'PARAMEDICAL_STAFF',
    department: 'PARA - MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'USG ASSISTANT.',
    status: 'ACTIVE'
  },
  {
    id: 'hs-028',
    slNo: 28,
    empId: 'SL-28',
    name: 'NIHAR KUMAR SANTRA',
    roleCategory: 'NON_MEDICAL_STAFF',
    department: 'NON - MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'SECUIRITY.',
    status: 'ACTIVE'
  },
  {
    id: 'hs-029',
    slNo: 29,
    empId: 'SL-29',
    name: 'CHAINA GHOSH',
    roleCategory: 'PARAMEDICAL_STAFF',
    department: 'PARA - MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'O.T. ASSISTANT.',
    status: 'ACTIVE'
  },
  {
    id: 'hs-030',
    slNo: 30,
    empId: 'SL-30',
    name: 'RAHUL DAS',
    roleCategory: 'NON_MEDICAL_STAFF',
    department: 'NON - MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'SECURITY GUARD',
    status: 'ACTIVE'
  },
  {
    id: 'hs-031',
    slNo: 31,
    empId: 'SL-31',
    name: 'SK. AKTAR',
    roleCategory: 'NON_MEDICAL_STAFF',
    department: 'NON - MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'SWEEPER',
    status: 'ACTIVE'
  },
  {
    id: 'hs-032',
    slNo: 32,
    empId: 'SL-32',
    name: 'TINA ROY',
    roleCategory: 'PARAMEDICAL_STAFF',
    department: 'PARA - MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'NURSING STAFF',
    status: 'ACTIVE'
  },
  {
    id: 'hs-033',
    slNo: 33,
    empId: 'SL-33',
    name: 'RENUKA BARI',
    roleCategory: 'PARAMEDICAL_STAFF',
    department: 'PARA - MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'NURSING STAFF',
    status: 'ACTIVE'
  },
  {
    id: 'hs-034',
    slNo: 34,
    empId: 'SL-34',
    name: 'BRISHTI DAS',
    roleCategory: 'OFFICE_STAFF',
    department: 'OFFICE STAFF (HOSPITAL SECTION)',
    designation: 'AYA',
    status: 'ACTIVE'
  },
  {
    id: 'hs-035',
    slNo: 35,
    empId: 'SL-35',
    name: 'SARMISTHA DAS',
    roleCategory: 'OFFICE_STAFF',
    department: 'OFFICE STAFF (HOSPITAL SECTION)',
    designation: 'AYA',
    status: 'ACTIVE'
  },
  {
    id: 'hs-036',
    slNo: 36,
    empId: 'SL-36',
    name: 'AMIT DHANK',
    roleCategory: 'OFFICE_STAFF',
    department: 'OFFICE STAFF (HOSPITAL SECTION)',
    designation: 'WARD BOY',
    status: 'ACTIVE'
  },
  {
    id: 'hs-037',
    slNo: 37,
    empId: 'SL-37',
    name: 'RINKU DEY',
    roleCategory: 'NON_MEDICAL_STAFF',
    department: 'NON - MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'MULTI TUSK STAFF (ADMISTRATIVE)',
    status: 'ACTIVE'
  },
  {
    id: 'hs-038',
    slNo: 38,
    empId: 'SL-38',
    name: 'DULAL BOSE',
    roleCategory: 'NON_MEDICAL_STAFF',
    department: 'NON - MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'WARD BOY',
    status: 'ACTIVE'
  },
  {
    id: 'hs-039',
    slNo: 39,
    empId: 'SL-39',
    name: 'HIRALAL PRAMANIK',
    roleCategory: 'NON_MEDICAL_STAFF',
    department: 'NON - MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'SECURITY GUARD',
    status: 'ACTIVE'
  },
  {
    id: 'hs-040',
    slNo: 40,
    empId: 'SL-40',
    name: 'DEBDAS CAKRABORTY',
    roleCategory: 'NON_MEDICAL_STAFF',
    department: 'NON - MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'SECURITY GUARD',
    status: 'ACTIVE'
  },
  {
    id: 'hs-041',
    slNo: 41,
    empId: 'SL-41',
    name: 'MOUMITA MAJI',
    roleCategory: 'MEDICAL_STAFF',
    department: 'MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'YOGA EXPERT.',
    status: 'ACTIVE'
  },
  {
    id: 'hs-042',
    slNo: 42,
    empId: 'SL-42',
    name: 'SHILPI DAS',
    roleCategory: 'NON_MEDICAL_STAFF',
    department: 'NON - MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'DRESSER',
    status: 'ACTIVE'
  },
  {
    id: 'hs-043',
    slNo: 43,
    empId: 'SL-43',
    name: 'AWADHESH KUMAR MAHATO',
    roleCategory: 'PARAMEDICAL_STAFF',
    department: 'PARA - MEDICAL STAFF (HOSPITAL SECTION)',
    designation: 'MEDICAL LABORATORY TECHNICIAN',
    status: 'ACTIVE'
  }
];

class HospitalStaffService {
  private staffList: HospitalStaffMember[] = getFromStorage(STORAGE_KEY, OFFICIAL_HOSPITAL_STAFF);

  getAllStaff(): HospitalStaffMember[] {
    // Sort by slNo ascending by default
    return [...this.staffList].sort((a, b) => (a.slNo || 0) - (b.slNo || 0));
  }

  getStaffById(id: string): HospitalStaffMember | undefined {
    return this.staffList.find((s) => s.id === id);
  }

  addStaffMember(data: Omit<HospitalStaffMember, 'id'>): HospitalStaffMember {
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

  updateStaffMember(id: string, updates: Partial<HospitalStaffMember>): HospitalStaffMember | undefined {
    const idx = this.staffList.findIndex((s) => s.id === id);
    if (idx !== -1) {
      this.staffList[idx] = { ...this.staffList[idx], ...updates };
      saveToStorage(STORAGE_KEY, this.staffList);
      return this.staffList[idx];
    }
    return undefined;
  }

  deleteStaffMember(id: string): boolean {
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
}

export const hospitalStaffService = new HospitalStaffService();
