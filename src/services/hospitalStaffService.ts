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
  empId: string;
  name: string;
  roleCategory: StaffRoleCategory;
  department: string;
  designation: string;
  qualification?: string;
  contactNumber: string;
  email?: string;
  photoUrl: string;
  availability: 'AVAILABLE' | 'ON_DUTY' | 'ON_LEAVE' | 'EMERGENCY_DUTY' | 'SHIFT_DUTY';
  dutyShift: string;
  opdCounter?: string;
  status: 'ACTIVE' | 'INACTIVE';
  joiningYear?: number;
}

const STORAGE_KEY = 'bhmch_hospital_staff_directory';

const OFFICIAL_HOSPITAL_STAFF: HospitalStaffMember[] = [
  // MEDICAL STAFF
  {
    id: 'hs-001',
    empId: 'BHMC-MED-001',
    name: 'Prof. (Dr.) T. K. Maiti',
    roleCategory: 'MEDICAL_STAFF',
    department: 'Practice of Medicine',
    designation: 'Senior Medical Officer & HOD',
    qualification: 'M.D. (Homoeopathy)',
    contactNumber: '+91 98321 00101',
    email: 'tk.maiti@bhmc.edu.in',
    photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    availability: 'ON_DUTY',
    dutyShift: 'Morning (09:00 AM - 02:00 PM)',
    opdCounter: 'OPD Room 101',
    status: 'ACTIVE',
    joiningYear: 2010
  },
  {
    id: 'hs-002',
    empId: 'BHMC-MED-002',
    name: 'Dr. Priya Sengupta',
    roleCategory: 'MEDICAL_STAFF',
    department: 'Practice of Medicine & IPD',
    designation: 'Resident Medical Officer (RMO)',
    qualification: 'B.H.M.S., M.D. (Hom.)',
    contactNumber: '+91 98321 00102',
    email: 'priya.sengupta@bhmc.edu.in',
    photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    availability: 'ON_DUTY',
    dutyShift: '24x7 IPD Ward & Emergency',
    opdCounter: 'IPD Ward Desk',
    status: 'ACTIVE',
    joiningYear: 2016
  },
  {
    id: 'hs-003',
    empId: 'BHMC-MED-003',
    name: 'Prof. (Dr.) A. K. Roy',
    roleCategory: 'MEDICAL_STAFF',
    department: 'Organon of Medicine',
    designation: 'Senior Homoeopathic Consultant',
    qualification: 'M.D. (Homoeopathy)',
    contactNumber: '+91 98321 00103',
    email: 'ak.roy@bhmc.edu.in',
    photoUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
    availability: 'AVAILABLE',
    dutyShift: 'Mon, Wed, Fri (10:00 AM - 02:00 PM)',
    opdCounter: 'OPD Room 104',
    status: 'ACTIVE',
    joiningYear: 2008
  },
  {
    id: 'hs-004',
    empId: 'BHMC-MED-004',
    name: 'Prof. (Dr.) S. N. Bhattacharya',
    roleCategory: 'MEDICAL_STAFF',
    department: 'Homoeopathic Materia Medica',
    designation: 'Senior Consultant & Professor',
    qualification: 'M.D. (Homoeopathy)',
    contactNumber: '+91 98321 00104',
    email: 'sn.bhattacharya@bhmc.edu.in',
    photoUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
    availability: 'AVAILABLE',
    dutyShift: 'Tue, Thu, Sat (09:30 AM - 01:30 PM)',
    opdCounter: 'OPD Room 102',
    status: 'ACTIVE',
    joiningYear: 2009
  },
  {
    id: 'hs-005',
    empId: 'BHMC-MED-005',
    name: 'Dr. M. Ghosh',
    roleCategory: 'MEDICAL_STAFF',
    department: 'Case Taking & Repertory',
    designation: 'Consultant Medical Officer',
    qualification: 'M.D. (Homoeopathy)',
    contactNumber: '+91 98321 00105',
    email: 'm.ghosh@bhmc.edu.in',
    photoUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=400',
    availability: 'AVAILABLE',
    dutyShift: 'Mon - Sat (10:00 AM - 02:00 PM)',
    opdCounter: 'OPD Room 103',
    status: 'ACTIVE',
    joiningYear: 2014
  },
  {
    id: 'hs-006',
    empId: 'BHMC-MED-006',
    name: 'Dr. N. Mukhopadhyay',
    roleCategory: 'MEDICAL_STAFF',
    department: 'Obstetrics & Gynaecology',
    designation: 'Gynecologist & Medical Officer',
    qualification: 'M.D. (O&G)',
    contactNumber: '+91 98321 00106',
    email: 'n.mukhopadhyay@bhmc.edu.in',
    photoUrl: 'https://images.unsplash.com/photo-1594824813566-88855ce78907?auto=format&fit=crop&q=80&w=400',
    availability: 'ON_DUTY',
    dutyShift: 'Mon - Sat (10:00 AM - 02:00 PM)',
    opdCounter: 'OPD Room 109',
    status: 'ACTIVE',
    joiningYear: 2012
  },
  {
    id: 'hs-007',
    empId: 'BHMC-MED-007',
    name: 'Dr. S. K. Mitra',
    roleCategory: 'MEDICAL_STAFF',
    department: 'Surgery & Homoeopathic Therapeutics',
    designation: 'Surgical Consultant & Medical Officer',
    qualification: 'M.S. (General Surgery)',
    contactNumber: '+91 98321 00107',
    email: 'sk.mitra@bhmc.edu.in',
    photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    availability: 'AVAILABLE',
    dutyShift: 'Tue, Fri (10:00 AM - 01:00 PM)',
    opdCounter: 'OPD Room 105',
    status: 'ACTIVE',
    joiningYear: 2015
  },
  {
    id: 'hs-008',
    empId: 'BHMC-MED-008',
    name: 'Dr. D. Sen',
    roleCategory: 'MEDICAL_STAFF',
    department: 'Pathology & Dermatology',
    designation: 'Clinical Pathologist & Medical Officer',
    qualification: 'M.D. (Pathology)',
    contactNumber: '+91 98321 00108',
    email: 'd.sen@bhmc.edu.in',
    photoUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
    availability: 'AVAILABLE',
    dutyShift: 'Tue, Thu, Sat (10:00 AM - 02:00 PM)',
    opdCounter: 'OPD Room 103 / Lab',
    status: 'ACTIVE',
    joiningYear: 2013
  },
  {
    id: 'hs-009',
    empId: 'BHMC-MED-009',
    name: 'Dr. P. K. Samanta',
    roleCategory: 'MEDICAL_STAFF',
    department: 'Yoga & Lifestyle Medicine',
    designation: 'Medical Officer & Yoga Consultant',
    qualification: 'M.D. (Hom.), Dip. Yoga',
    contactNumber: '+91 98321 00109',
    email: 'pk.samanta@bhmc.edu.in',
    photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    availability: 'AVAILABLE',
    dutyShift: 'Mon - Sat (08:00 AM - 12:00 PM)',
    opdCounter: 'Yoga Studio OPD',
    status: 'ACTIVE',
    joiningYear: 2018
  },
  {
    id: 'hs-010',
    empId: 'BHMC-MED-010',
    name: 'Dr. R. Bannerjee',
    roleCategory: 'MEDICAL_STAFF',
    department: 'Homoeopathic Pharmacy & Dental',
    designation: 'Dental Medical Officer',
    qualification: 'M.D.S., M.D. (Hom.)',
    contactNumber: '+91 98321 00110',
    email: 'r.bannerjee@bhmc.edu.in',
    photoUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
    availability: 'AVAILABLE',
    dutyShift: 'Mon - Sat (09:30 AM - 01:30 PM)',
    opdCounter: 'OPD Room 106',
    status: 'ACTIVE',
    joiningYear: 2017
  },
  {
    id: 'hs-011',
    empId: 'BHMC-MED-011',
    name: 'Dr. Arindam Paul',
    roleCategory: 'MEDICAL_STAFF',
    department: 'Practice of Medicine',
    designation: 'House Staff Officer',
    qualification: 'B.H.M.S.',
    contactNumber: '+91 98321 00111',
    email: 'arindam.paul@bhmc.edu.in',
    photoUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=400',
    availability: 'SHIFT_DUTY',
    dutyShift: 'Rotational Shift Duty',
    opdCounter: 'Medicine OPD',
    status: 'ACTIVE',
    joiningYear: 2025
  },
  {
    id: 'hs-012',
    empId: 'BHMC-MED-012',
    name: 'Dr. Sourav Chakraborty',
    roleCategory: 'MEDICAL_STAFF',
    department: 'IPD Clinical Wards',
    designation: 'House Staff Officer',
    qualification: 'B.H.M.S.',
    contactNumber: '+91 98321 00112',
    email: 'sourav.c@bhmc.edu.in',
    photoUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
    availability: 'EMERGENCY_DUTY',
    dutyShift: 'Night Ward Rounds & Emergency',
    opdCounter: 'IPD Casualty',
    status: 'ACTIVE',
    joiningYear: 2025
  },

  // OFFICE STAFF
  {
    id: 'hs-013',
    empId: 'BHMC-OFF-001',
    name: 'Mr. Somnath Ganguly',
    roleCategory: 'OFFICE_STAFF',
    department: 'Hospital Administration',
    designation: 'Hospital Administrative Officer',
    qualification: 'M.Com, MBA (Hospital Admin)',
    contactNumber: '+91 98321 00201',
    email: 'somnath.ganguly@bhmc.edu.in',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    availability: 'ON_DUTY',
    dutyShift: 'General Shift (09:00 AM - 05:00 PM)',
    status: 'ACTIVE',
    joiningYear: 2011
  },
  {
    id: 'hs-014',
    empId: 'BHMC-OFF-002',
    name: 'Mr. Biplab Roy',
    roleCategory: 'OFFICE_STAFF',
    department: 'OPD Registration Desk',
    designation: 'Chief Registration Clerk',
    qualification: 'B.A.',
    contactNumber: '+91 98321 00202',
    email: 'biplab.roy@bhmc.edu.in',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    availability: 'ON_DUTY',
    dutyShift: 'Morning Shift (08:30 AM - 02:30 PM)',
    opdCounter: 'Registration Counter 1',
    status: 'ACTIVE',
    joiningYear: 2015
  },
  {
    id: 'hs-015',
    empId: 'BHMC-OFF-003',
    name: 'Mr. Sujoy Dutta',
    roleCategory: 'OFFICE_STAFF',
    department: 'Accounts & Billing',
    designation: 'Hospital Billing Assistant',
    qualification: 'B.Sc. (Maths)',
    contactNumber: '+91 98321 00203',
    email: 'sujoy.dutta@bhmc.edu.in',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
    availability: 'AVAILABLE',
    dutyShift: 'General Shift (09:00 AM - 05:00 PM)',
    opdCounter: 'Billing Counter 2',
    status: 'ACTIVE',
    joiningYear: 2018
  },
  {
    id: 'hs-016',
    empId: 'BHMC-OFF-004',
    name: 'Mrs. Kakali Das',
    roleCategory: 'OFFICE_STAFF',
    department: 'IPD Record Room',
    designation: 'Patient Record Keeper',
    qualification: 'B.A.',
    contactNumber: '+91 98321 00204',
    email: 'kakali.das@bhmc.edu.in',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
    availability: 'AVAILABLE',
    dutyShift: 'General Shift (09:00 AM - 05:00 PM)',
    status: 'ACTIVE',
    joiningYear: 2019
  },
  {
    id: 'hs-017',
    empId: 'BHMC-OFF-005',
    name: 'Mr. Amitabha Hazra',
    roleCategory: 'OFFICE_STAFF',
    department: 'Hospital IT & EMR Cell',
    designation: 'Computer & IT System Assistant',
    qualification: 'B.C.A.',
    contactNumber: '+91 98321 00205',
    email: 'amitabha.hazra@bhmc.edu.in',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
    availability: 'ON_DUTY',
    dutyShift: 'General Shift (09:00 AM - 05:00 PM)',
    status: 'ACTIVE',
    joiningYear: 2021
  },

  // PARA MEDICAL STAFF
  {
    id: 'hs-018',
    empId: 'BHMC-PARA-001',
    name: 'Sister Anita Sharma',
    roleCategory: 'PARAMEDICAL_STAFF',
    department: 'Nursing Superintendent Cell',
    designation: 'Nursing Superintendent',
    qualification: 'B.Sc. Nursing, GNM',
    contactNumber: '+91 98321 00301',
    email: 'anita.sharma@bhmc.edu.in',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    availability: 'ON_DUTY',
    dutyShift: 'Day Shift (08:00 AM - 04:00 PM)',
    opdCounter: 'Nursing Office',
    status: 'ACTIVE',
    joiningYear: 2012
  },
  {
    id: 'hs-019',
    empId: 'BHMC-PARA-002',
    name: 'Sister Pratima Das',
    roleCategory: 'PARAMEDICAL_STAFF',
    department: 'General Medicine Male Ward',
    designation: 'Senior Staff Nurse',
    qualification: 'GNM Nursing',
    contactNumber: '+91 98321 00302',
    email: 'pratima.das@bhmc.edu.in',
    photoUrl: 'https://images.unsplash.com/photo-1580281657557-2b69b33a0b3f?auto=format&fit=crop&q=80&w=400',
    availability: 'SHIFT_DUTY',
    dutyShift: 'Morning Shift (07:00 AM - 02:00 PM)',
    status: 'ACTIVE',
    joiningYear: 2015
  },
  {
    id: 'hs-020',
    empId: 'BHMC-PARA-003',
    name: 'Sister Mousumi Roy',
    roleCategory: 'PARAMEDICAL_STAFF',
    department: 'General Medicine Female Ward',
    designation: 'Senior Staff Nurse',
    qualification: 'GNM Nursing',
    contactNumber: '+91 98321 00303',
    email: 'mousumi.roy@bhmc.edu.in',
    photoUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=400',
    availability: 'SHIFT_DUTY',
    dutyShift: 'Evening Shift (02:00 PM - 09:00 PM)',
    status: 'ACTIVE',
    joiningYear: 2016
  },
  {
    id: 'hs-021',
    empId: 'BHMC-PARA-004',
    name: 'Sister Archana Sen',
    roleCategory: 'PARAMEDICAL_STAFF',
    department: 'Surgery & OT Bay',
    designation: 'Operation Theatre Staff Nurse',
    qualification: 'GNM, OT Technician Cert.',
    contactNumber: '+91 98321 00304',
    email: 'archana.sen@bhmc.edu.in',
    photoUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=400',
    availability: 'ON_DUTY',
    dutyShift: 'Surgical Duty Shift',
    status: 'ACTIVE',
    joiningYear: 2017
  },
  {
    id: 'hs-022',
    empId: 'BHMC-PARA-005',
    name: 'Sister Rekha Dutta',
    roleCategory: 'PARAMEDICAL_STAFF',
    department: 'Paediatric Ward',
    designation: 'Staff Nurse',
    qualification: 'GNM Nursing',
    contactNumber: '+91 98321 00305',
    email: 'rekha.dutta@bhmc.edu.in',
    photoUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400',
    availability: 'SHIFT_DUTY',
    dutyShift: 'Night Shift (09:00 PM - 07:00 AM)',
    status: 'ACTIVE',
    joiningYear: 2019
  },
  {
    id: 'hs-023',
    empId: 'BHMC-PARA-006',
    name: 'Sister Kabita Paul',
    roleCategory: 'PARAMEDICAL_STAFF',
    department: 'Gynaecology & Labour Room',
    designation: 'Maternity Staff Nurse',
    qualification: 'GNM, Midwifery Specialization',
    contactNumber: '+91 98321 00306',
    email: 'kabita.paul@bhmc.edu.in',
    photoUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=400',
    availability: 'ON_DUTY',
    dutyShift: 'Labour Room Rotation',
    status: 'ACTIVE',
    joiningYear: 2018
  },
  {
    id: 'hs-024',
    empId: 'BHMC-PARA-007',
    name: 'Mr. Dipankar Ghosh',
    roleCategory: 'PARAMEDICAL_STAFF',
    department: 'Diagnostic Laboratory',
    designation: 'Chief Laboratory Technician',
    qualification: 'DMLT, B.Sc. (Microbiology)',
    contactNumber: '+91 98321 00307',
    email: 'dipankar.ghosh@bhmc.edu.in',
    photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    availability: 'ON_DUTY',
    dutyShift: 'Lab Hours (08:00 AM - 04:00 PM)',
    opdCounter: 'Central Diagnostic Lab',
    status: 'ACTIVE',
    joiningYear: 2013
  },
  {
    id: 'hs-025',
    empId: 'BHMC-PARA-008',
    name: 'Mr. Subhasish Paul',
    roleCategory: 'PARAMEDICAL_STAFF',
    department: 'Diagnostic Laboratory',
    designation: 'Assistant Lab Technician',
    qualification: 'DMLT',
    contactNumber: '+91 98321 00308',
    email: 'subhasish.paul@bhmc.edu.in',
    photoUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
    availability: 'AVAILABLE',
    dutyShift: 'Lab Hours (09:00 AM - 05:00 PM)',
    status: 'ACTIVE',
    joiningYear: 2020
  },
  {
    id: 'hs-026',
    empId: 'BHMC-PARA-009',
    name: 'Mr. Tarun Kanti Dey',
    roleCategory: 'PARAMEDICAL_STAFF',
    department: 'Homoeopathic Dispensary',
    designation: 'Chief Pharmacist',
    qualification: 'D.Pharm (Homoeopathy)',
    contactNumber: '+91 98321 00309',
    email: 'tarun.dey@bhmc.edu.in',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    availability: 'ON_DUTY',
    dutyShift: 'Dispensary Shift (09:00 AM - 03:00 PM)',
    opdCounter: 'Dispensary Counter',
    status: 'ACTIVE',
    joiningYear: 2011
  },
  {
    id: 'hs-027',
    empId: 'BHMC-PARA-010',
    name: 'Mr. Chandan Das',
    roleCategory: 'PARAMEDICAL_STAFF',
    department: 'Homoeopathic Dispensary',
    designation: 'Assistant Pharmacist',
    qualification: 'D.Pharm (Homoeopathy)',
    contactNumber: '+91 98321 00310',
    email: 'chandan.das@bhmc.edu.in',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    availability: 'AVAILABLE',
    dutyShift: 'Dispensary Shift (10:00 AM - 04:00 PM)',
    status: 'ACTIVE',
    joiningYear: 2019
  },
  {
    id: 'hs-028',
    empId: 'BHMC-PARA-011',
    name: 'Mr. Sanjay Sarkar',
    roleCategory: 'PARAMEDICAL_STAFF',
    department: 'Radiology & X-Ray Unit',
    designation: 'Senior Radiographer / X-Ray Tech',
    qualification: 'D.R.T. (Radiological Tech)',
    contactNumber: '+91 98321 00311',
    email: 'sanjay.sarkar@bhmc.edu.in',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
    availability: 'ON_DUTY',
    dutyShift: 'Radiology Hours (09:00 AM - 04:00 PM)',
    opdCounter: 'X-Ray Room',
    status: 'ACTIVE',
    joiningYear: 2014
  },

  // NON MEDICAL STAFF
  {
    id: 'hs-029',
    empId: 'BHMC-NON-001',
    name: 'Mr. Rabindra Nath Bauri',
    roleCategory: 'NON_MEDICAL_STAFF',
    department: 'Hospital Central Store',
    designation: 'Hospital Storekeeper',
    qualification: 'Higher Secondary',
    contactNumber: '+91 98321 00401',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    availability: 'AVAILABLE',
    dutyShift: 'General Shift (09:00 AM - 05:00 PM)',
    status: 'ACTIVE',
    joiningYear: 2010
  },
  {
    id: 'hs-030',
    empId: 'BHMC-NON-002',
    name: 'Mr. Kartick Chandra Malik',
    roleCategory: 'NON_MEDICAL_STAFF',
    department: 'Hospital Security Wing',
    designation: 'Hospital Security In-Charge',
    qualification: 'Secondary (Madhyamik)',
    contactNumber: '+91 98321 00402',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    availability: 'ON_DUTY',
    dutyShift: '24x7 Security Roster Head',
    status: 'ACTIVE',
    joiningYear: 2012
  },
  {
    id: 'hs-031',
    empId: 'BHMC-NON-003',
    name: 'Mr. Manoranjan Bag',
    roleCategory: 'NON_MEDICAL_STAFF',
    department: 'General Male Ward',
    designation: 'Ward Attendant / Ward Boy',
    qualification: 'Secondary',
    contactNumber: '+91 98321 00403',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
    availability: 'SHIFT_DUTY',
    dutyShift: 'Day Shift Ward Care',
    status: 'ACTIVE',
    joiningYear: 2016
  },
  {
    id: 'hs-032',
    empId: 'BHMC-NON-004',
    name: 'Mrs. Laxmi Rani Hembram',
    roleCategory: 'NON_MEDICAL_STAFF',
    department: 'Female Ward & Maternity',
    designation: 'Female Ward Attendant / Ayah',
    qualification: 'Secondary',
    contactNumber: '+91 98321 00404',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
    availability: 'ON_DUTY',
    dutyShift: 'Female Ward Duty',
    status: 'ACTIVE',
    joiningYear: 2015
  },
  {
    id: 'hs-033',
    empId: 'BHMC-NON-005',
    name: 'Mr. Srikanta Konar',
    roleCategory: 'NON_MEDICAL_STAFF',
    department: 'Emergency & Transport',
    designation: 'Hospital Ambulance Driver',
    qualification: 'Heavy Commercial Driving License',
    contactNumber: '+91 98321 00405',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
    availability: 'EMERGENCY_DUTY',
    dutyShift: '24x7 On-Call Emergency Service',
    status: 'ACTIVE',
    joiningYear: 2017
  },
  {
    id: 'hs-034',
    empId: 'BHMC-NON-006',
    name: 'Mr. Shibnath Soren',
    roleCategory: 'NON_MEDICAL_STAFF',
    department: 'Sanitation & Housekeeping',
    designation: 'Housekeeping In-Charge',
    qualification: 'Secondary',
    contactNumber: '+91 98321 00406',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    availability: 'ON_DUTY',
    dutyShift: 'Morning & Evening Ward Sanitation',
    status: 'ACTIVE',
    joiningYear: 2014
  }
];

class HospitalStaffService {
  private staffList: HospitalStaffMember[] = getFromStorage(STORAGE_KEY, OFFICIAL_HOSPITAL_STAFF);

  getAllStaff(): HospitalStaffMember[] {
    return [...this.staffList];
  }

  getStaffById(id: string): HospitalStaffMember | undefined {
    return this.staffList.find((s) => s.id === id);
  }

  addStaffMember(data: Omit<HospitalStaffMember, 'id'>): HospitalStaffMember {
    const newMember: HospitalStaffMember = {
      ...data,
      id: `hs-${String(this.staffList.length + 1).padStart(3, '0')}`,
    };
    this.staffList.unshift(newMember);
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
