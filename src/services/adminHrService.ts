import {
  Employee,
  DepartmentItem,
  DesignationItem,
  StaffAttendance,
  LeaveApplication,
  LeaveBalance,
  HolidayItem,
  JobRequisition,
  CandidateApplication,
  JoiningProcess,
  EmployeeDocument,
  PayrollRecord,
  OrgNode,
  MeetingItem,
  CommitteeItem,
  CommitteeMeeting,
  InstitutionalCircular,
  AdminNotification,
  ActivityAuditLog,
  CircularItem,
  InternalNotification,
  SystemActivityLog,
  SystemAuditLog,
} from '../types/adminHr';
import { FACULTY } from '../data/mockData';

class AdminHrService {
  private employees: Employee[] = [
    {
      id: 'EMP-001',
      empId: 'BHMC-T-001',
      fullName: 'Dr. Ramesh Chandra Das',
      email: 'ramesh.das@bhmc.edu.in',
      phone: '+91 98301 23456',
      gender: 'MALE',
      dob: '1972-04-15',
      joiningDate: '2008-07-01',
      departmentId: 'DEP-001',
      departmentName: 'Organon of Medicine',
      designationId: 'DES-001',
      designationName: 'Principal & Professor',
      employeeType: 'TEACHING',
      status: 'ACTIVE',
      qualification: 'DHMS (West Bengal Council of Homoeopathic Medicine), MD (Organon of Medicine)',
      experienceYears: 24,
      bloodGroup: 'O+',
      emergencyContact: {
        name: 'Mrs. Sunita Das',
        relationship: 'Spouse',
        phone: '+91 98301 23457',
      },
      address: '12/A College Street, Kolkata, West Bengal 700073',
      aadhaarNo: '4589 1234 5678',
      panNo: 'ABCDP1234E',
      bankDetails: {
        bankName: 'State Bank of India',
        accountNo: '30123456789',
        ifscCode: 'SBIN0000001',
        branch: 'College Street Branch',
      },
      salaryBasic: 125000,
    },
    {
      id: 'EMP-002',
      empId: 'BHMC-T-002',
      fullName: 'Dr. Ananya Banerjee',
      email: 'ananya.banerjee@bhmc.edu.in',
      phone: '+91 98312 34567',
      gender: 'FEMALE',
      dob: '1980-09-22',
      joiningDate: '2012-11-15',
      departmentId: 'DEP-002',
      departmentName: 'Homoeopathic Materia Medica',
      designationId: 'DES-002',
      designationName: 'Professor & HOD',
      employeeType: 'TEACHING',
      status: 'ACTIVE',
      qualification: 'BHMS, MD (Homoeopathy)',
      experienceYears: 18,
      bloodGroup: 'B+',
      emergencyContact: {
        name: 'Dr. Sourav Banerjee',
        relationship: 'Spouse',
        phone: '+91 98312 34568',
      },
      address: '45 Gariahat Road, Kolkata, West Bengal 700019',
      aadhaarNo: '7890 2345 6789',
      panNo: 'XYZAB5678C',
      bankDetails: {
        bankName: 'Punjab National Bank',
        accountNo: '10234567890',
        ifscCode: 'PUNB0123400',
        branch: 'Gariahat Branch',
      },
      salaryBasic: 105000,
    },
    {
      id: 'EMP-003',
      empId: 'BHMC-T-003',
      fullName: 'Dr. Subhashish Roy',
      email: 'subhashish.roy@bhmc.edu.in',
      phone: '+91 98323 45678',
      gender: 'MALE',
      dob: '1984-01-10',
      joiningDate: '2015-03-01',
      departmentId: 'DEP-003',
      departmentName: 'Case Taking & Repertory',
      designationId: 'DES-003',
      designationName: 'Associate Professor',
      employeeType: 'TEACHING',
      status: 'ACTIVE',
      qualification: 'BHMS, MD (Homoeopathy)',
      experienceYears: 14,
      bloodGroup: 'A+',
      emergencyContact: {
        name: 'Mr. Bimal Roy',
        relationship: 'Father',
        phone: '+91 98323 45679',
      },
      address: '88 Salt Lake Sector 1, Kolkata 700064',
      aadhaarNo: '3456 7890 1234',
      panNo: 'LKJHG9876F',
      bankDetails: {
        bankName: 'HDFC Bank',
        accountNo: '501002345678',
        ifscCode: 'HDFC0000012',
        branch: 'Salt Lake Sector 1',
      },
      salaryBasic: 88000,
    },
    {
      id: 'EMP-004',
      empId: 'BHMC-H-001',
      fullName: 'Dr. Priya Sengupta',
      email: 'priya.sengupta@bhmc.edu.in',
      phone: '+91 98334 56789',
      gender: 'FEMALE',
      dob: '1988-06-30',
      joiningDate: '2018-08-10',
      departmentId: 'DEP-004',
      departmentName: 'Practice of Medicine & IPD',
      designationId: 'DES-004',
      designationName: 'Senior Medical Officer',
      employeeType: 'HOSPITAL_STAFF',
      status: 'ACTIVE',
      qualification: 'BHMS, MD (Homoeopathy - Medicine)',
      experienceYears: 10,
      bloodGroup: 'AB+',
      emergencyContact: {
        name: 'Mr. Amit Sengupta',
        relationship: 'Spouse',
        phone: '+91 98334 56790',
      },
      address: '23 Ballygunge Circular Rd, Kolkata 700019',
      aadhaarNo: '9012 3456 7890',
      panNo: 'MNBVC1234Z',
      bankDetails: {
        bankName: 'ICICI Bank',
        accountNo: '000401567890',
        ifscCode: 'ICIC0000004',
        branch: 'Ballygunge Branch',
      },
      salaryBasic: 75000,
    },
    {
      id: 'EMP-005',
      empId: 'BHMC-A-001',
      fullName: 'Mr. Somnath Ganguly',
      email: 'somnath.ganguly@bhmc.edu.in',
      phone: '+91 98345 67890',
      gender: 'MALE',
      dob: '1978-11-12',
      joiningDate: '2010-02-01',
      departmentId: 'DEP-005',
      departmentName: 'Administrative Office',
      designationId: 'DES-005',
      designationName: 'Administrative Officer',
      employeeType: 'ADMINISTRATIVE',
      status: 'ACTIVE',
      qualification: 'M.Com, MBA (HR)',
      experienceYears: 20,
      bloodGroup: 'B+',
      emergencyContact: {
        name: 'Mrs. Rina Ganguly',
        relationship: 'Spouse',
        phone: '+91 98345 67891',
      },
      address: '15 Behala Chowrasta, Kolkata 700034',
      aadhaarNo: '5678 9012 3456',
      panNo: 'POIUY6543M',
      bankDetails: {
        bankName: 'Axis Bank',
        accountNo: '912010045678901',
        ifscCode: 'UTIB0000015',
        branch: 'Behala Branch',
      },
      salaryBasic: 68000,
    },
    {
      id: 'EMP-006',
      empId: 'BHMC-H-002',
      fullName: 'Sister Anita Sharma',
      email: 'anita.sharma@bhmc.edu.in',
      phone: '+91 98356 78901',
      gender: 'FEMALE',
      dob: '1985-08-14',
      joiningDate: '2016-05-12',
      departmentId: 'DEP-004',
      departmentName: 'IPD Ward & Nursing',
      designationId: 'DES-006',
      designationName: 'Nursing Superintendent',
      employeeType: 'HOSPITAL_STAFF',
      status: 'ACTIVE',
      qualification: 'B.Sc Nursing, GNM',
      experienceYears: 15,
      bloodGroup: 'O+',
      emergencyContact: {
        name: 'Mr. Rajesh Sharma',
        relationship: 'Brother',
        phone: '+91 98356 78902',
      },
      address: '10 Howrah Station Rd, Howrah 711101',
      aadhaarNo: '2345 6789 0123',
      panNo: 'QWERT1234K',
      bankDetails: {
        bankName: 'State Bank of India',
        accountNo: '30987654321',
        ifscCode: 'SBIN0000001',
        branch: 'Howrah Main Branch',
      },
      salaryBasic: 52000,
    },
    {
      id: 'EMP-007',
      empId: 'BHMC-N-001',
      fullName: 'Mr. Subir Mitra',
      email: 'subir.mitra@bhmc.edu.in',
      phone: '+91 98367 89012',
      gender: 'MALE',
      dob: '1990-03-25',
      joiningDate: '2020-01-10',
      departmentId: 'DEP-006',
      departmentName: 'Central Library',
      designationId: 'DES-007',
      designationName: 'Assistant Librarian',
      employeeType: 'NON_TEACHING',
      status: 'ACTIVE',
      qualification: 'M.Lib.I.Sc.',
      experienceYears: 8,
      bloodGroup: 'A-',
      emergencyContact: {
        name: 'Mrs. Mousumi Mitra',
        relationship: 'Spouse',
        phone: '+91 98367 89013',
      },
      address: '77 Dum Dum Park, Kolkata 700055',
      aadhaarNo: '6789 0123 4567',
      panNo: 'ASDFG5678L',
      bankDetails: {
        bankName: 'Bank of Baroda',
        accountNo: '2034010001234',
        ifscCode: 'BARB0DUMDUM',
        branch: 'Dum Dum Park',
      },
      salaryBasic: 45000,
    },
  ];

  private departments: DepartmentItem[] = [
    {
      id: 'DEP-001',
      code: 'ORG',
      name: 'Organon of Medicine & Philosophy',
      category: 'ACADEMIC',
      hodName: 'Dr. Ramesh Chandra Das',
      hodEmail: 'ramesh.das@bhmc.edu.in',
      staffCount: 6,
      budgetAllocated: 1500000,
      description: 'Department dedicated to Homoeopathic philosophy, Organon, and Chronic Diseases.',
      roomLocation: 'Academic Building - Floor 2, Room 204',
    },
    {
      id: 'DEP-002',
      code: 'HMM',
      name: 'Homoeopathic Materia Medica',
      category: 'ACADEMIC',
      hodName: 'Dr. Ananya Banerjee',
      hodEmail: 'ananya.banerjee@bhmc.edu.in',
      staffCount: 8,
      budgetAllocated: 1800000,
      description: 'Study of Drug Proving, Remedy Symptomatology, and Comparative Materia Medica.',
      roomLocation: 'Academic Building - Floor 2, Room 208',
    },
    {
      id: 'DEP-003',
      code: 'REP',
      name: 'Case Taking & Repertory',
      category: 'ACADEMIC',
      hodName: 'Dr. Subhashish Roy',
      hodEmail: 'subhashish.roy@bhmc.edu.in',
      staffCount: 5,
      budgetAllocated: 1200000,
      description: 'Computerized repertorization, Kent/Boger/Boenninghausen methodologies.',
      roomLocation: 'Academic Building - Floor 3, Room 302',
    },
    {
      id: 'DEP-004',
      code: 'MED',
      name: 'Practice of Medicine & IPD',
      category: 'CLINICAL',
      hodName: 'Dr. Priya Sengupta',
      hodEmail: 'priya.sengupta@bhmc.edu.in',
      staffCount: 12,
      budgetAllocated: 3200000,
      description: 'Clinical medicine OPD, IPD management, bedside teaching, and diagnosis.',
      roomLocation: 'Hospital Wing - Floor 1, Block B',
    },
    {
      id: 'DEP-005',
      code: 'ADM',
      name: 'Administrative & HR Office',
      category: 'ADMINISTRATIVE',
      hodName: 'Mr. Somnath Ganguly',
      hodEmail: 'somnath.ganguly@bhmc.edu.in',
      staffCount: 10,
      budgetAllocated: 2500000,
      description: 'Establishment, personnel records, regulatory compliance, admissions and payroll.',
      roomLocation: 'Administrative Block - Ground Floor',
    },
    {
      id: 'DEP-006',
      code: 'LIB',
      name: 'Central Library & E-Learning',
      category: 'SUPPORT',
      hodName: 'Mr. Subir Mitra',
      hodEmail: 'subir.mitra@bhmc.edu.in',
      staffCount: 4,
      budgetAllocated: 900000,
      description: 'Digital research library, rare homoeopathic archives, and journal subscriptions.',
      roomLocation: 'Library Building - Floor 1 & 2',
    },
    {
      id: 'DEP-007',
      code: 'PHR',
      name: 'Homoeopathic Pharmacy',
      category: 'ACADEMIC',
      hodName: 'Dr. S. K. Mahapatra',
      hodEmail: 'sk.mahapatra@bhmc.edu.in',
      staffCount: 5,
      budgetAllocated: 1100000,
      description: 'Pharmacognosy, potentization, herb garden, and dispensary standards.',
      roomLocation: 'Academic Building - Ground Floor',
    },
    {
      id: 'DEP-008',
      code: 'PAT',
      name: 'Pathology & Microbiology',
      category: 'ACADEMIC',
      hodName: 'Dr. Swati Dutta',
      hodEmail: 'swati.dutta@bhmc.edu.in',
      staffCount: 7,
      budgetAllocated: 2100000,
      description: 'Diagnostic clinical lab, histology, microbiology, and student practicals.',
      roomLocation: 'Hospital Wing - Floor 2, Lab A',
    },
  ];

  private designations: DesignationItem[] = [
    {
      id: 'DES-001',
      code: 'PRN',
      title: 'Principal & Professor',
      departmentCategory: 'ACADEMIC',
      payScaleGrade: 'Pay Level 14 (₹1,44,200 - ₹2,18,200)',
      minBasicPay: 144200,
      maxBasicPay: 218200,
      reportsTo: 'Governing Body / President',
      description: 'Institutional academic and administrative head of the BURDWAN HOMOEOPATHIC MEDICAL COLLEGE & HOSPITAL.',
    },
    {
      id: 'DES-002',
      code: 'HOD',
      title: 'Professor & HOD',
      departmentCategory: 'ACADEMIC',
      payScaleGrade: 'Pay Level 13A (₹1,31,400 - ₹2,17,100)',
      minBasicPay: 131400,
      maxBasicPay: 217100,
      reportsTo: 'Principal',
      description: 'Head of academic department, curriculum lead, and clinical guide.',
    },
    {
      id: 'DES-003',
      code: 'ASSOC',
      title: 'Associate Professor',
      departmentCategory: 'ACADEMIC',
      payScaleGrade: 'Pay Level 12 (₹78,800 - ₹2,09,200)',
      minBasicPay: 78800,
      maxBasicPay: 209200,
      reportsTo: 'Professor & HOD',
      description: 'Senior teaching faculty, clinical researcher, and exam evaluator.',
    },
    {
      id: 'DES-004',
      code: 'SMO',
      title: 'Senior Medical Officer',
      departmentCategory: 'CLINICAL',
      payScaleGrade: 'Pay Level 11 (₹67,700 - ₹2,08,700)',
      minBasicPay: 67700,
      maxBasicPay: 208700,
      reportsTo: 'Hospital Superintendent',
      description: 'Clinical in-charge for hospital OPD/IPD wards, casualty, and emergency duty.',
    },
    {
      id: 'DES-005',
      code: 'AO',
      title: 'Administrative Officer',
      departmentCategory: 'ADMINISTRATIVE',
      payScaleGrade: 'Pay Level 10 (₹56,100 - ₹1,77,500)',
      minBasicPay: 56100,
      maxBasicPay: 177500,
      reportsTo: 'Principal',
      description: 'Head of non-teaching staff, office establishment, and logistics.',
    },
    {
      id: 'DES-006',
      code: 'NS',
      title: 'Nursing Superintendent',
      departmentCategory: 'CLINICAL',
      payScaleGrade: 'Pay Level 8 (₹47,600 - ₹1,51,100)',
      minBasicPay: 47600,
      maxBasicPay: 151100,
      reportsTo: 'Medical Superintendent',
      description: 'Supervises nursing officers, IPD care staff, and ward hygiene.',
    },
  ];

  private attendances: StaffAttendance[] = [
    {
      id: 'ATT-001',
      empId: 'BHMC-T-001',
      empName: 'Dr. Ramesh Chandra Das',
      departmentName: 'Organon of Medicine',
      date: '2026-07-25',
      checkInTime: '08:55 AM',
      checkOutTime: '05:10 PM',
      status: 'PRESENT',
      workHours: 8.25,
      remarks: 'Biometric logged',
    },
    {
      id: 'ATT-002',
      empId: 'BHMC-T-002',
      empName: 'Dr. Ananya Banerjee',
      departmentName: 'Homoeopathic Materia Medica',
      date: '2026-07-25',
      checkInTime: '09:02 AM',
      checkOutTime: '05:00 PM',
      status: 'PRESENT',
      workHours: 8.0,
      remarks: 'Biometric logged',
    },
    {
      id: 'ATT-003',
      empId: 'BHMC-T-003',
      empName: 'Dr. Subhashish Roy',
      departmentName: 'Case Taking & Repertory',
      date: '2026-07-25',
      checkInTime: '09:40 AM',
      checkOutTime: '05:15 PM',
      status: 'LATE',
      workHours: 7.5,
      remarks: 'Traffic delay acknowledged',
    },
    {
      id: 'ATT-004',
      empId: 'BHMC-H-001',
      empName: 'Dr. Priya Sengupta',
      departmentName: 'Practice of Medicine & IPD',
      date: '2026-07-25',
      checkInTime: '08:30 AM',
      checkOutTime: '04:45 PM',
      status: 'PRESENT',
      workHours: 8.25,
      remarks: 'IPD Morning Rounds completed',
    },
    {
      id: 'ATT-005',
      empId: 'BHMC-A-001',
      empName: 'Mr. Somnath Ganguly',
      departmentName: 'Administrative Office',
      date: '2026-07-25',
      checkInTime: '08:50 AM',
      checkOutTime: '05:30 PM',
      status: 'PRESENT',
      workHours: 8.6,
      remarks: 'Biometric logged',
    },
  ];

  private leaveApplications: LeaveApplication[] = [
    {
      id: 'LEV-001',
      empId: 'BHMC-T-003',
      empName: 'Dr. Subhashish Roy',
      departmentName: 'Case Taking & Repertory',
      leaveType: 'DUTY',
      startDate: '2026-07-28',
      endDate: '2026-07-30',
      totalDays: 3,
      reason: 'Attending National Homoeopathic Research Seminar in New Delhi as Keynote Speaker.',
      status: 'PENDING',
      appliedDate: '2026-07-22',
    },
    {
      id: 'LEV-002',
      empId: 'BHMC-H-002',
      empName: 'Sister Anita Sharma',
      departmentName: 'IPD Ward & Nursing',
      leaveType: 'CASUAL',
      startDate: '2026-07-26',
      endDate: '2026-07-26',
      totalDays: 1,
      reason: 'Personal family emergency.',
      status: 'APPROVED',
      appliedDate: '2026-07-24',
      reviewedBy: 'Mr. Somnath Ganguly (AO)',
      reviewRemarks: 'Approved with substitute ward nurse deployed.',
    },
    {
      id: 'LEV-003',
      empId: 'BHMC-N-001',
      empName: 'Mr. Subir Mitra',
      departmentName: 'Central Library',
      leaveType: 'MEDICAL',
      startDate: '2026-07-15',
      endDate: '2026-07-17',
      totalDays: 3,
      reason: 'Viral fever with medical prescription attached.',
      status: 'APPROVED',
      appliedDate: '2026-07-14',
      reviewedBy: 'Dr. Ramesh Chandra Das (Principal)',
      reviewRemarks: 'Medical certificate verified.',
      documentUrl: '/docs/medical-cert-mitra.pdf',
    },
  ];

  private holidays: HolidayItem[] = [
    {
      id: 'HOL-001',
      title: 'Independence Day',
      date: '2026-08-15',
      dayOfWeek: 'Saturday',
      type: 'GAZETTED',
      description: 'National Independence Day flag hoisting ceremony at 8:00 AM on college grounds.',
      isMandatory: true,
    },
    {
      id: 'HOL-002',
      title: 'Dr. Samuel Hahnemann Birth Anniversary',
      date: '2026-04-10',
      dayOfWeek: 'Friday',
      type: 'ACADEMIC',
      description: 'World Homoeopathy Day celebration and institutional holiday.',
      isMandatory: true,
    },
    {
      id: 'HOL-003',
      title: 'Durga Puja Saptami to Dashami',
      date: '2026-10-18',
      dayOfWeek: 'Sunday - Wednesday',
      type: 'INSTITUTIONAL',
      description: 'Autumn festival break for students and teaching staff.',
      isMandatory: true,
    },
    {
      id: 'HOL-004',
      title: 'Mahatma Gandhi Jayanti',
      date: '2026-10-02',
      dayOfWeek: 'Friday',
      type: 'GAZETTED',
      description: 'National holiday.',
      isMandatory: true,
    },
  ];

  private jobRequisitions: JobRequisition[] = [
    {
      id: 'JOB-001',
      jobCode: 'REQ-2026-01',
      title: 'Assistant Professor - Homoeopathic Pharmacy',
      departmentName: 'Homoeopathic Pharmacy',
      vacancies: 2,
      minQualification: 'MD (Homoeopathy) in Pharmacy',
      minExperienceYears: 3,
      status: 'OPEN',
      postedDate: '2026-07-01',
      closingDate: '2026-08-15',
      salaryRange: '₹67,700 - ₹85,000 / month',
      description: 'Full-time teaching faculty position with clinical supervision at pharmacy lab.',
    },
    {
      id: 'JOB-002',
      jobCode: 'REQ-2026-02',
      title: 'Casualty Medical Officer (Homoeopathy)',
      departmentName: 'Practice of Medicine & IPD',
      vacancies: 3,
      minQualification: 'BHMS with State Council Registration',
      minExperienceYears: 1,
      status: 'INTERVIEWING',
      postedDate: '2026-06-15',
      closingDate: '2026-07-30',
      salaryRange: '₹55,000 - ₹65,000 / month',
      description: 'Night shift and emergency casualty duty at BHMC Hospital.',
    },
  ];

  private candidateApplications: CandidateApplication[] = [
    {
      id: 'CAN-001',
      requisitionId: 'JOB-001',
      requisitionTitle: 'Assistant Professor - Homoeopathic Pharmacy',
      candidateName: 'Dr. Soumen Roy',
      email: 'soumen.roy.hom@gmail.com',
      phone: '+91 98765 43210',
      qualification: 'BHMS, MD (Homoeopathy Pharmacy)',
      experienceYears: 4,
      appliedDate: '2026-07-10',
      resumeUrl: '/resumes/dr_soumen_roy.pdf',
      status: 'SHORTLISTED',
      interviewDate: '2026-08-02 11:00 AM',
      interviewNotes: 'Strong academic background and journal publications in potentization research.',
    },
    {
      id: 'CAN-002',
      requisitionId: 'JOB-002',
      requisitionTitle: 'Casualty Medical Officer (Homoeopathy)',
      candidateName: 'Dr. Moumita Chanda',
      email: 'moumita.chanda@gmail.com',
      phone: '+91 98765 11223',
      qualification: 'BHMS (NIH Kolkata)',
      experienceYears: 2,
      appliedDate: '2026-06-20',
      resumeUrl: '/resumes/dr_moumita_chanda.pdf',
      status: 'SELECTED',
      offeredSalary: 60000,
    },
  ];

  private joiningProcesses: JoiningProcess[] = [
    {
      id: 'JOIN-001',
      candidateId: 'CAN-002',
      candidateName: 'Dr. Moumita Chanda',
      empIdAssigned: 'BHMC-H-005',
      designationName: 'Casualty Medical Officer',
      departmentName: 'Practice of Medicine & IPD',
      expectedJoiningDate: '2026-08-01',
      status: 'IN_PROGRESS',
      checklist: {
        documentsVerified: true,
        biometricEnrolled: true,
        idCardIssued: false,
        emailAccountCreated: true,
        bankDetailsSubmitted: true,
        orientationCompleted: false,
      },
      notes: 'Offer letter signed. Waiting for orientation on Aug 1st.',
    },
  ];

  private employeeDocuments: EmployeeDocument[] = [
    {
      id: 'DOC-001',
      empId: 'BHMC-T-001',
      empName: 'Dr. Ramesh Chandra Das',
      title: 'Aadhaar Card Copy',
      docType: 'AADHAAR',
      fileUrl: '/docs/emp-001-aadhaar.pdf',
      fileName: 'Aadhaar_Ramesh_Das.pdf',
      fileSize: '1.2 MB',
      uploadedAt: '2026-01-10',
      verifiedBy: 'Mr. Somnath Ganguly',
      status: 'VERIFIED',
    },
    {
      id: 'DOC-002',
      empId: 'BHMC-T-001',
      empName: 'Dr. Ramesh Chandra Das',
      title: 'WB Council Registration Certificate',
      docType: 'REGISTRATION_CERTIFICATE',
      fileUrl: '/docs/emp-001-council-reg.pdf',
      fileName: 'Council_Reg_Homoeopathy_Das.pdf',
      fileSize: '2.4 MB',
      uploadedAt: '2026-01-10',
      verifiedBy: 'Mr. Somnath Ganguly',
      status: 'VERIFIED',
    },
    {
      id: 'DOC-003',
      empId: 'BHMC-T-002',
      empName: 'Dr. Ananya Banerjee',
      title: 'MD Degree Certificate',
      docType: 'DEGREE_CERTIFICATE',
      fileUrl: '/docs/emp-002-degree.pdf',
      fileName: 'MD_Degree_Ananya_Banerjee.pdf',
      fileSize: '3.1 MB',
      uploadedAt: '2026-02-15',
      verifiedBy: 'Mr. Somnath Ganguly',
      status: 'VERIFIED',
    },
  ];

  private payrolls: PayrollRecord[] = [
    {
      id: 'PAY-202607-001',
      empId: 'BHMC-T-001',
      empName: 'Dr. Ramesh Chandra Das',
      departmentName: 'Organon of Medicine',
      designationName: 'Principal & Professor',
      monthYear: '2026-07',
      basicPay: 125000,
      hra: 30000,
      da: 42500,
      specialAllowance: 15000,
      grossSalary: 212500,
      pfDeduction: 15000,
      esiDeduction: 0,
      tdsDeduction: 22000,
      otherDeductions: 1000,
      totalDeductions: 38000,
      netSalary: 174500,
      status: 'PROCESSED',
      paymentDate: '2026-07-31',
      transactionRef: 'TXN-SBI-98712345',
    },
    {
      id: 'PAY-202607-002',
      empId: 'BHMC-T-002',
      empName: 'Dr. Ananya Banerjee',
      departmentName: 'Homoeopathic Materia Medica',
      designationName: 'Professor & HOD',
      monthYear: '2026-07',
      basicPay: 105000,
      hra: 25200,
      da: 35700,
      specialAllowance: 10000,
      grossSalary: 175900,
      pfDeduction: 12600,
      esiDeduction: 0,
      tdsDeduction: 16500,
      otherDeductions: 500,
      totalDeductions: 29600,
      netSalary: 146300,
      status: 'PROCESSED',
      paymentDate: '2026-07-31',
      transactionRef: 'TXN-PNB-88123901',
    },
    {
      id: 'PAY-202607-003',
      empId: 'BHMC-H-001',
      empName: 'Dr. Priya Sengupta',
      departmentName: 'Practice of Medicine & IPD',
      designationName: 'Senior Medical Officer',
      monthYear: '2026-07',
      basicPay: 75000,
      hra: 18000,
      da: 25500,
      specialAllowance: 8000,
      grossSalary: 126500,
      pfDeduction: 9000,
      esiDeduction: 0,
      tdsDeduction: 9500,
      otherDeductions: 500,
      totalDeductions: 19000,
      netSalary: 107500,
      status: 'PROCESSED',
      paymentDate: '2026-07-31',
      transactionRef: 'TXN-ICICI-33412098',
    },
  ];

  private orgTree: OrgNode = {
    id: 'org-0',
    title: 'Governing Body / Management Trust',
    name: 'Shri B. M. Charitable Trust Board',
    role: 'Apex Governance',
    department: 'Management',
    children: [
      {
        id: 'org-1',
        title: 'Principal & Medical Director',
        name: 'Dr. Ramesh Chandra Das',
        role: 'Executive Academic & Hospital Head',
        department: 'Principal Office',
        children: [
          {
            id: 'org-1-1',
            title: 'HOD - Homoeopathic Materia Medica',
            name: 'Dr. Ananya Banerjee',
            role: 'Academic Lead',
            department: 'Homoeopathic Materia Medica',
          },
          {
            id: 'org-1-2',
            title: 'HOD - Repertory & Case Taking',
            name: 'Dr. Subhashish Roy',
            role: 'Academic Lead',
            department: 'Case Taking & Repertory',
          },
          {
            id: 'org-1-3',
            title: 'Hospital Superintendent / SMO',
            name: 'Dr. Priya Sengupta',
            role: 'Clinical & Ward Head',
            department: 'Hospital Administration',
            children: [
              {
                id: 'org-1-3-1',
                title: 'Nursing Superintendent',
                name: 'Sister Anita Sharma',
                role: 'Inpatient Ward Nursing Head',
                department: 'Nursing Staff',
              },
            ],
          },
          {
            id: 'org-1-4',
            title: 'Administrative Officer',
            name: 'Mr. Somnath Ganguly',
            role: 'Non-Teaching Personnel Lead',
            department: 'Administrative & HR',
            children: [
              {
                id: 'org-1-4-1',
                title: 'Assistant Librarian',
                name: 'Mr. Subir Mitra',
                role: 'Central Library Lead',
                department: 'Central Library',
              },
            ],
          },
        ],
      },
    ],
  };

  private meetings: MeetingItem[] = [
    {
      id: 'MTG-001',
      title: 'Quarterly Academic Council & Examination Board Review',
      meetingType: 'ACADEMIC_COUNCIL',
      date: '2026-07-20',
      timeSlot: '11:00 AM - 01:00 PM',
      location: 'Conference Hall A, Administrative Block',
      organizer: 'Dr. Ramesh Chandra Das (Principal)',
      attendeesCount: 14,
      agenda: 'Review of BHMS 1st to 4th year curriculum coverage, upcoming university practical exams, and herbal garden expansion.',
      minutesOfMeeting: 'All department heads presented progress reports. Approved extra clinical hours for 3rd year students in IPD wards. Unanimously passed resolution for digital attendance integration.',
      status: 'COMPLETED',
      attachmentUrl: '/mom/Academic_Council_Jul2026_MoM.pdf',
    },
    {
      id: 'MTG-002',
      title: 'Hospital Advisory & Infection Control Committee Meeting',
      meetingType: 'HOSPITAL_ADVISORY',
      date: '2026-08-05',
      timeSlot: '02:30 PM - 04:00 PM',
      location: 'Hospital Seminar Room, Block C',
      organizer: 'Dr. Priya Sengupta (SMO)',
      attendeesCount: 10,
      agenda: 'Monsoon season IPD bed capacity, medicine stock audits, and Bio-Medical Waste compliance review.',
      status: 'SCHEDULED',
    },
  ];

  private committees: CommitteeItem[] = [
    {
      id: 'COM-001',
      name: 'Anti-Ragging Committee',
      code: 'ARC-BHMC',
      convenorName: 'Dr. Ananya Banerjee',
      membersCount: 8,
      membersList: ['Dr. Ananya Banerjee (Convenor)', 'Mr. Somnath Ganguly (AO)', 'Dr. Subhashish Roy', 'Local Police Inspector', '2 Student Reps'],
      purpose: 'Ensuring zero tolerance towards ragging and maintaining 24x7 campus vigil as per NCH guidelines.',
      formedDate: '2020-08-01',
      status: 'ACTIVE',
    },
    {
      id: 'COM-002',
      name: 'Institutional Ethics Committee (IEC)',
      code: 'IEC-BHMC',
      convenorName: 'Dr. Ramesh Chandra Das',
      membersCount: 7,
      membersList: ['Dr. Ramesh Chandra Das', 'Dr. Swati Dutta', 'Legal Advocate K. N. Ghosh', 'Layperson Representative'],
      purpose: 'Ethical review and clearance of clinical research trials, drug provings, and dissertation protocols.',
      formedDate: '2018-01-15',
      status: 'ACTIVE',
    },
    {
      id: 'COM-003',
      name: 'Internal Complaints Committee (ICC / Women Cell)',
      code: 'ICC-BHMC',
      convenorName: 'Dr. Priya Sengupta',
      membersCount: 6,
      membersList: ['Dr. Priya Sengupta (Chairperson)', 'Sister Anita Sharma', 'Mrs. Sunita Roy (NGO Member)', 'Mr. Somnath Ganguly'],
      purpose: 'Prevention, prohibition, and redressal of sexual harassment of women at workplace.',
      formedDate: '2019-03-08',
      status: 'ACTIVE',
    },
  ];

  private circulars: CircularItem[] = [
    {
      id: 'CIR-2026-08',
      circularNo: 'BHMC/ADM/2026/08',
      title: 'Mandatory Biometric Attendance Logging & Punctuality Reminder',
      targetAudience: 'ALL_STAFF',
      publishedDate: '2026-07-18',
      issuedBy: 'Principal & Administrative Officer',
      priority: 'HIGH',
      content: 'All teaching, non-teaching, and hospital personnel are strictly requested to record biometric check-in by 09:00 AM. Grace period is 15 minutes. Repeated late arrivals will attract deduction from Casual Leave balance.',
      attachmentUrl: '/circulars/Biometric_Attendance_Rules_2026.pdf',
    },
    {
      id: 'CIR-2026-09',
      circularNo: 'BHMC/HOSP/2026/09',
      title: 'Roster Duty Schedule for World Homoeopathy Day Celebrations',
      targetAudience: 'HOSPITAL_STAFF_ONLY',
      publishedDate: '2026-07-22',
      issuedBy: 'Medical Superintendent',
      priority: 'NORMAL',
      content: 'Emergency casualty duty roster during the Hahnemann Day celebration. OPD services will remain open till 01:00 PM.',
    },
  ];

  private internalNotifications: InternalNotification[] = [
    {
      id: 'NOTIF-001',
      title: 'Leave Approval Pending',
      message: 'Dr. Subhashish Roy submitted a Duty Leave request for 3 days starting 2026-07-28.',
      type: 'ALERT',
      createdAt: '2026-07-22 10:15 AM',
      targetRole: 'ROLE_ADMIN',
      isRead: false,
    },
    {
      id: 'NOTIF-002',
      title: 'Monthly Payroll Processed',
      message: 'July 2026 staff salaries have been calculated and sent for bank transfer dispatch.',
      type: 'SYSTEM',
      createdAt: '2026-07-25 09:00 AM',
      targetRole: 'ROLE_ADMIN',
      isRead: true,
    },
  ];

  private activityLogs: SystemActivityLog[] = [
    {
      id: 'ACT-001',
      action: 'LEAVE_APPROVED',
      module: 'Leave Management',
      performedBy: 'Somnath Ganguly (AO)',
      timestamp: '2026-07-24 04:15 PM',
      details: 'Approved Casual Leave for Sister Anita Sharma (EMP BHMC-H-002).',
      ipAddress: '192.168.1.45',
    },
    {
      id: 'ACT-002',
      action: 'PAYROLL_GENERATED',
      module: 'Payroll Structure',
      performedBy: 'Accounts Officer',
      timestamp: '2026-07-25 08:30 AM',
      details: 'Generated July 2026 pay slips for 125 active college and hospital staff.',
      ipAddress: '192.168.1.12',
    },
    {
      id: 'ACT-003',
      action: 'CIRCULAR_PUBLISHED',
      module: 'Circular Management',
      performedBy: 'Dr. Ramesh Chandra Das (Principal)',
      timestamp: '2026-07-18 11:00 AM',
      details: 'Published Circular BHMC/ADM/2026/08 regarding biometric punctuality.',
      ipAddress: '192.168.1.10',
    },
  ];

  private auditLogs: SystemAuditLog[] = [
    {
      id: 'AUD-001',
      timestamp: '2026-07-25 09:05:12',
      userEmail: 'ramesh.das@bhmc.edu.in',
      userRole: 'ROLE_PRINCIPAL',
      actionType: 'LOGIN',
      resource: 'Portal System Authentication',
      status: 'SUCCESS',
      ipAddress: '103.24.120.4',
      details: 'User authenticated successfully via 2FA OTP.',
    },
    {
      id: 'AUD-002',
      timestamp: '2026-07-25 08:31:00',
      userEmail: 'somnath.ganguly@bhmc.edu.in',
      userRole: 'ROLE_ADMIN',
      actionType: 'UPDATE',
      resource: 'Payroll Disburse Master',
      status: 'SUCCESS',
      ipAddress: '192.168.1.45',
      details: 'Modified net salary calculation scale for Grade 14 allowances.',
    },
  ];

  // ================= EMPLOYEES =================
  getEmployees(): Employee[] {
    return [...this.employees];
  }

  getEmployeeById(id: string): Employee | undefined {
    return this.employees.find((e) => e.id === id || e.empId === id);
  }

  addEmployee(emp: Omit<Employee, 'id'>): Employee {
    const newEmp: Employee = {
      ...emp,
      id: `EMP-${String(this.employees.length + 1).padStart(3, '0')}`,
    };
    this.employees.unshift(newEmp);
    this.addActivityLog('EMPLOYEE_CREATED', 'Employee Management', 'Admin', `Created new employee record for ${newEmp.fullName} (${newEmp.empId})`);
    return newEmp;
  }

  updateEmployee(id: string, updates: Partial<Employee>): Employee | null {
    const idx = this.employees.findIndex((e) => e.id === id);
    if (idx === -1) return null;
    this.employees[idx] = { ...this.employees[idx], ...updates };
    this.addActivityLog('EMPLOYEE_UPDATED', 'Employee Management', 'Admin', `Updated employee record for ${this.employees[idx].fullName}`);
    return this.employees[idx];
  }

  deleteEmployee(
    id: string,
    performer?: { name?: string; email?: string; role?: string }
  ): { success: boolean; message: string } {
    const emp = this.getEmployeeById(id);
    if (!emp) {
      return { success: false, message: 'Staff member record not found.' };
    }

    // Remove staff from employees array
    this.employees = this.employees.filter((e) => e.id !== emp.id && e.empId !== emp.empId);

    // Clean up related documents and attendance logs
    this.employeeDocuments = this.employeeDocuments.filter(
      (d) => d.empId !== emp.empId && d.empId !== emp.id
    );
    this.attendances = this.attendances.filter(
      (a) => a.empId !== emp.empId && a.empId !== emp.id
    );

    // Sync removal with public FACULTY list
    const facIdx = FACULTY.findIndex(
      (f) =>
        (f.email && emp.email && f.email.toLowerCase() === emp.email.toLowerCase()) ||
        (f.name && emp.fullName && f.name.toLowerCase().includes(emp.fullName.toLowerCase()))
    );
    if (facIdx !== -1) {
      FACULTY.splice(facIdx, 1);
    }

    const performedBy = performer?.name || 'Administrator';
    const userRole = performer?.role || 'ROLE_ADMIN';
    const userEmail = performer?.email || 'admin@bhmch.com';

    // Log in System Activity Logs
    this.addActivityLog(
      'EMPLOYEE_DELETED',
      'Employee Management',
      performedBy,
      `Permanently deleted staff record for ${emp.fullName} (${emp.empId} - ${emp.departmentName})`
    );

    // Log in Security Audit Trail
    this.addAuditLog({
      action: 'EMPLOYEE_DELETED',
      module: 'HR_EMPLOYEE',
      performedBy,
      userRole,
      userEmail,
      details: `Deleted staff member record: ${emp.fullName} (Emp ID: ${emp.empId}, Dept: ${emp.departmentName}, Position: ${emp.designationName}).`,
      status: 'SUCCESS',
    });

    return {
      success: true,
      message: `Staff record for ${emp.fullName} (${emp.empId}) has been deleted successfully.`,
    };
  }

  // ================= DEPARTMENTS =================
  getDepartments(): DepartmentItem[] {
    return [...this.departments];
  }

  addDepartment(dept: Omit<DepartmentItem, 'id'>): DepartmentItem {
    const newDept: DepartmentItem = {
      ...dept,
      id: `DEP-${String(this.departments.length + 1).padStart(3, '0')}`,
    };
    this.departments.push(newDept);
    this.addActivityLog('DEPARTMENT_CREATED', 'Department Management', 'Admin', `Added department ${newDept.name}`);
    return newDept;
  }

  updateDepartment(id: string, updates: Partial<DepartmentItem>): DepartmentItem | null {
    const idx = this.departments.findIndex((d) => d.id === id);
    if (idx === -1) return null;
    this.departments[idx] = { ...this.departments[idx], ...updates };
    return this.departments[idx];
  }

  deleteDepartment(id: string): boolean {
    this.departments = this.departments.filter((d) => d.id !== id);
    return true;
  }

  // ================= DESIGNATIONS =================
  getDesignations(): DesignationItem[] {
    return [...this.designations];
  }

  addDesignation(des: Omit<DesignationItem, 'id'>): DesignationItem {
    const newDes: DesignationItem = {
      ...des,
      id: `DES-${String(this.designations.length + 1).padStart(3, '0')}`,
    };
    this.designations.push(newDes);
    return newDes;
  }

  updateDesignation(id: string, updates: Partial<DesignationItem>): DesignationItem | null {
    const idx = this.designations.findIndex((d) => d.id === id);
    if (idx === -1) return null;
    this.designations[idx] = { ...this.designations[idx], ...updates };
    return this.designations[idx];
  }

  deleteDesignation(id: string): boolean {
    this.designations = this.designations.filter((d) => d.id !== id);
    return true;
  }

  // ================= ATTENDANCE =================
  getAttendance(): StaffAttendance[] {
    return [...this.attendances];
  }

  markAttendance(record: Omit<StaffAttendance, 'id'>): StaffAttendance {
    const newAtt: StaffAttendance = {
      ...record,
      id: `ATT-${String(this.attendances.length + 1).padStart(3, '0')}`,
    };
    this.attendances.unshift(newAtt);
    return newAtt;
  }

  // ================= LEAVE =================
  getLeaveApplications(): LeaveApplication[] {
    return [...this.leaveApplications];
  }

  applyLeave(app: Omit<LeaveApplication, 'id' | 'status' | 'appliedDate'>): LeaveApplication {
    const newApp: LeaveApplication = {
      ...app,
      id: `LEV-${String(this.leaveApplications.length + 1).padStart(3, '0')}`,
      status: 'PENDING',
      appliedDate: new Date().toISOString().split('T')[0],
    };
    this.leaveApplications.unshift(newApp);
    this.addActivityLog('LEAVE_APPLIED', 'Leave Management', app.empName, `Applied for ${app.leaveType} leave for ${app.totalDays} days`);
    return newApp;
  }

  updateLeaveStatus(id: string, status: 'APPROVED' | 'REJECTED', reviewedBy: string, remarks: string): LeaveApplication | null {
    const app = this.leaveApplications.find((l) => l.id === id);
    if (!app) return null;
    app.status = status;
    app.reviewedBy = reviewedBy;
    app.reviewRemarks = remarks;
    this.addActivityLog('LEAVE_STATUS_UPDATED', 'Leave Management', reviewedBy, `${status} leave request for ${app.empName}`);
    return app;
  }

  // ================= HOLIDAY CALENDAR =================
  getHolidays(): HolidayItem[] {
    return [...this.holidays];
  }

  addHoliday(h: Omit<HolidayItem, 'id'>): HolidayItem {
    const newH: HolidayItem = {
      ...h,
      id: `HOL-${String(this.holidays.length + 1).padStart(3, '0')}`,
    };
    this.holidays.push(newH);
    return newH;
  }

  // ================= RECRUITMENT & CANDIDATES =================
  getJobRequisitions(): JobRequisition[] {
    return [...this.jobRequisitions];
  }

  getCandidateApplications(): CandidateApplication[] {
    return [...this.candidateApplications];
  }

  addJobRequisition(req: Omit<JobRequisition, 'id'>): JobRequisition {
    const newReq: JobRequisition = {
      ...req,
      id: `JOB-${String(this.jobRequisitions.length + 1).padStart(3, '0')}`,
    };
    this.jobRequisitions.unshift(newReq);
    return newReq;
  }

  updateCandidateStatus(id: string, status: CandidateApplication['status'], interviewDate?: string, notes?: string): CandidateApplication | null {
    const can = this.candidateApplications.find((c) => c.id === id);
    if (!can) return null;
    can.status = status;
    if (interviewDate) can.interviewDate = interviewDate;
    if (notes) can.interviewNotes = notes;
    return can;
  }

  // ================= JOINING & ONBOARDING =================
  getJoiningProcesses(): JoiningProcess[] {
    return [...this.joiningProcesses];
  }

  updateJoiningChecklist(id: string, checklist: JoiningProcess['checklist'], notes?: string): JoiningProcess | null {
    const proc = this.joiningProcesses.find((p) => p.id === id);
    if (!proc) return null;
    proc.checklist = checklist;
    if (notes !== undefined) proc.notes = notes;
    // Auto complete if all checklist items true
    if (Object.values(checklist).every(Boolean)) {
      proc.status = 'COMPLETED';
    }
    return proc;
  }

  // ================= DOCUMENTS =================
  getDocuments(): EmployeeDocument[] {
    return [...this.employeeDocuments];
  }

  addDocument(doc: Omit<EmployeeDocument, 'id' | 'uploadedAt'>): EmployeeDocument {
    const newDoc: EmployeeDocument = {
      ...doc,
      id: `DOC-${String(this.employeeDocuments.length + 1).padStart(3, '0')}`,
      uploadedAt: new Date().toISOString().split('T')[0],
    };
    this.employeeDocuments.unshift(newDoc);
    return newDoc;
  }

  // ================= PAYROLL =================
  getPayrolls(): PayrollRecord[] {
    return [...this.payrolls];
  }

  processMonthlyPayroll(monthYear: string): number {
    let count = 0;
    this.employees.forEach((emp) => {
      const existing = this.payrolls.find((p) => p.empId === emp.empId && p.monthYear === monthYear);
      if (!existing) {
        const basic = emp.salaryBasic || 60000;
        const hra = Math.round(basic * 0.24);
        const da = Math.round(basic * 0.34);
        const spec = 5000;
        const gross = basic + hra + da + spec;
        const pf = Math.round(basic * 0.12);
        const tds = Math.round(gross * 0.1);
        const deductions = pf + tds + 500;
        const net = gross - deductions;

        this.payrolls.unshift({
          id: `PAY-${monthYear.replace('-', '')}-${String(this.payrolls.length + 1).padStart(3, '0')}`,
          empId: emp.empId,
          empName: emp.fullName,
          departmentName: emp.departmentName,
          designationName: emp.designationName,
          monthYear,
          basicPay: basic,
          hra,
          da,
          specialAllowance: spec,
          grossSalary: gross,
          pfDeduction: pf,
          esiDeduction: 0,
          tdsDeduction: tds,
          otherDeductions: 500,
          totalDeductions: deductions,
          netSalary: net,
          status: 'PROCESSED',
          paymentDate: new Date().toISOString().split('T')[0],
          transactionRef: `TXN-BANK-${Math.floor(10000000 + Math.random() * 90000000)}`,
        });
        count++;
      }
    });
    this.addActivityLog('PAYROLL_PROCESSED', 'Payroll Structure', 'Admin', `Processed monthly payroll for ${monthYear} (${count} employees)`);
    return count;
  }

  // ================= ORG STRUCTURE =================
  getOrgStructure(): OrgNode {
    return { ...this.orgTree };
  }

  // ================= MEETINGS =================
  getMeetings(): MeetingItem[] {
    return [...this.meetings];
  }

  addMeeting(m: Omit<MeetingItem, 'id'>): MeetingItem {
    const newM: MeetingItem = {
      ...m,
      id: `MTG-${String(this.meetings.length + 1).padStart(3, '0')}`,
    };
    this.meetings.unshift(newM);
    return newM;
  }

  updateMeetingMoM(id: string, mom: string): MeetingItem | null {
    const m = this.meetings.find((x) => x.id === id);
    if (!m) return null;
    m.minutesOfMeeting = mom;
    m.status = 'COMPLETED';
    return m;
  }

  // ================= COMMITTEES =================
  getCommittees(): CommitteeItem[] {
    return [...this.committees];
  }

  addCommittee(c: Omit<CommitteeItem, 'id'>): CommitteeItem {
    const newC: CommitteeItem = {
      ...c,
      id: `COM-${String(this.committees.length + 1).padStart(3, '0')}`,
    };
    this.committees.push(newC);
    return newC;
  }

  private committeeMeetings: CommitteeMeeting[] = [
    {
      id: 'COMM-MTG-001',
      title: 'Anti-Ragging Committee Campus Inspection',
      committeeId: 'COM-001',
      committeeName: 'Anti-Ragging Committee',
      meetingDate: '2026-07-28',
      startTime: '11:00 AM',
      endTime: '12:30 PM',
      venue: 'Principal Conference Room',
      agenda: 'Pre-admission session campus vigil and hostel inspection squad formation.',
      status: 'SCHEDULED',
    },
    {
      id: 'COMM-MTG-002',
      title: 'Ethics Committee Clinical Trial Review',
      committeeId: 'COM-002',
      committeeName: 'Institutional Ethics Committee (IEC)',
      meetingDate: '2026-08-04',
      startTime: '02:00 PM',
      endTime: '04:00 PM',
      venue: 'Academic Block Room 102',
      agenda: 'Evaluation of 3 MD research dissertation proposals.',
      status: 'SCHEDULED',
    },
  ];

  getCommitteeMeetings(): CommitteeMeeting[] {
    return [...this.committeeMeetings];
  }

  addCommitteeMeeting(meeting: Omit<CommitteeMeeting, 'id'>): CommitteeMeeting {
    const newM: CommitteeMeeting = {
      ...meeting,
      id: `COMM-MTG-${String(this.committeeMeetings.length + 1).padStart(3, '0')}`,
    };
    this.committeeMeetings.unshift(newM);
    return newM;
  }

  // ================= CIRCULARS =================
  getCirculars(): CircularItem[] {
    return [...this.circulars];
  }

  addCircular(cir: Omit<InstitutionalCircular, 'id'>): InstitutionalCircular {
    const newCir: InstitutionalCircular = {
      ...cir,
      id: `CIR-${String(this.circulars.length + 1).padStart(3, '0')}`,
    };
    this.circulars.unshift({
      id: newCir.id,
      circularNo: newCir.circularNo,
      title: newCir.title,
      targetAudience: 'ALL_STAFF',
      publishedDate: newCir.publishDate,
      issuedBy: newCir.issuedBy,
      priority: 'HIGH',
      content: newCir.content,
    });
    this.addActivityLog('CIRCULAR_PUBLISHED', 'Circular Management', cir.issuedBy, `Published circular "${cir.title}"`);
    return newCir;
  }

  publishCircular(cir: Omit<CircularItem, 'id'>): CircularItem {
    const newCir: CircularItem = {
      ...cir,
      id: `CIR-${String(this.circulars.length + 1).padStart(3, '0')}`,
    };
    this.circulars.unshift(newCir);
    this.addActivityLog('CIRCULAR_PUBLISHED', 'Circular Management', cir.issuedBy, `Published circular "${cir.title}"`);
    return newCir;
  }

  // ================= INTERNAL NOTIFICATIONS =================
  getNotifications(): InternalNotification[] {
    return [...this.internalNotifications];
  }

  markNotificationRead(id: string): void {
    const n = this.internalNotifications.find((x) => x.id === id);
    if (n) n.isRead = true;
  }

  markNotificationAsRead(id: string): void {
    this.markNotificationRead(id);
  }

  addNotification(notif: Omit<AdminNotification, 'id' | 'createdAt' | 'isRead'>): AdminNotification {
    const newN: AdminNotification = {
      ...notif,
      id: `NOTIF-${String(this.internalNotifications.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toLocaleString(),
      isRead: false,
    };
    this.internalNotifications.unshift({
      id: newN.id,
      title: newN.title,
      message: newN.message,
      type: 'ALERT',
      createdAt: newN.createdAt,
      targetRole: newN.recipientType,
      isRead: false,
    });
    return newN;
  }

  sendBroadcastNotification(title: string, message: string, type: InternalNotification['type'], targetRole: string): InternalNotification {
    const newN: InternalNotification = {
      id: `NOTIF-${String(this.internalNotifications.length + 1).padStart(3, '0')}`,
      title,
      message,
      type,
      createdAt: new Date().toLocaleString(),
      targetRole,
      isRead: false,
    };
    this.internalNotifications.unshift(newN);
    return newN;
  }

  // ================= LOGS =================
  getActivityLogs(): SystemActivityLog[] {
    return [...this.activityLogs];
  }

  getAuditLogs(): SystemAuditLog[] {
    return [...this.auditLogs];
  }

  private addActivityLog(action: string, module: string, performedBy: string, details: string): void {
    this.activityLogs.unshift({
      id: `ACT-${String(this.activityLogs.length + 1).padStart(3, '0')}`,
      action,
      module,
      performedBy,
      timestamp: new Date().toLocaleString(),
      details,
      ipAddress: '192.168.1.10',
    });
  }

  addAuditLog = (entry: {
    action: string;
    module: string;
    performedBy: string;
    userRole?: string;
    userEmail?: string;
    details: string;
    status?: string;
  }): void => {
    try {
      const newAudit: SystemAuditLog = {
        id: `AUD-${String(this.auditLogs.length + 1).padStart(3, '0')}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        userName: entry.performedBy,
        performedBy: entry.performedBy,
        userRole: entry.userRole || 'ROLE_ADMIN',
        userEmail: entry.userEmail || 'admin@bhmch.com',
        module: entry.module,
        action: entry.action,
        actionType: entry.action,
        resource: 'Staff Management',
        status: entry.status || 'SUCCESS',
        details: entry.details,
        ipAddress: '192.168.1.10',
      };
      this.auditLogs.unshift(newAudit);
    } catch (e) {
      console.warn('[AdminHrService] addAuditLog internal exception:', e);
    }
  };

  logAudit = (entry: {
    action: string;
    module: string;
    performedBy: string;
    userRole?: string;
    userEmail?: string;
    details: string;
    status?: string;
  }): void => {
    this.addAuditLog(entry);
  };

  // ================= DASHBOARD STATISTICS =================
  getAdminStats() {
    const totalEmployees = this.employees.length;
    const activeEmployees = this.employees.filter((e) => e.status === 'ACTIVE').length;
    const onLeaveEmployees = this.employees.filter((e) => e.status === 'ON_LEAVE').length;

    const totalDepartments = this.departments.length;
    const pendingLeaveApps = this.leaveApplications.filter((l) => l.status === 'PENDING').length;

    const totalMonthlyPayroll = this.payrolls.reduce((sum, p) => sum + p.netSalary, 0);
    const openJobRequisitions = this.jobRequisitions.filter((j) => j.status === 'OPEN').length;

    const teachingStaff = this.employees.filter((e) => e.employeeType === 'TEACHING').length;
    const hospitalStaff = this.employees.filter((e) => e.employeeType === 'HOSPITAL_STAFF').length;
    const nonTeachingStaff = this.employees.filter((e) => e.employeeType === 'NON_TEACHING' || e.employeeType === 'ADMINISTRATIVE').length;

    const maleCount = this.employees.filter((e) => e.gender === 'MALE').length;
    const femaleCount = this.employees.filter((e) => e.gender === 'FEMALE').length;

    return {
      totalEmployees,
      activeEmployees,
      onLeaveEmployees,
      totalDepartments,
      pendingLeaveApps,
      totalMonthlyPayroll,
      openJobRequisitions,
      teachingStaff,
      hospitalStaff,
      nonTeachingStaff,
      maleCount,
      femaleCount,
    };
  }
}

export const adminHrService = new AdminHrService();

export const logAudit = (entry: {
  action: string;
  module: string;
  performedBy: string;
  userRole?: string;
  userEmail?: string;
  details: string;
  status?: string;
}): void => {
  try {
    adminHrService.logAudit(entry);
  } catch (err) {
    console.warn('[logAudit Helper Warning]:', err);
  }
};
