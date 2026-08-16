import { apiClient } from '../../../services/api/apiClient';
import { ApiResponse } from '../../../types/index';
import { CMS_ENDPOINTS } from '../constants/cms.constants';
import {
  About,
  PrincipalDesk,
  Department,
  Course,
  Notice,
  News,
  Event,
  GalleryAlbum,
  ContactInformation,
  Banner,
  QuickLink,
  Download,
  Committee,
  ResearchHighlight,
  Achievement,
  HospitalOverview,
  ContentStatus,
  NoticeCategory,
  NewsCategory,
  EventCategory,
  GalleryCategory,
  DepartmentType,
  CourseType,
} from '../types/cms.types';

const currentTimestamp = () => new Date().toISOString();

// Mock initial state stores for seamless offline / client fallback execution
let mockBanners: Banner[] = [
  {
    id: 'b1',
    title: 'Excellence in Homoeopathic Education Since 1958',
    subtitle: 'Government Aided Homoeopathic Medical College affiliated with WBUHS & CCH',
    imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1200',
    linkUrl: '/about',
    linkText: 'Discover Our Heritage',
    displayOrder: 1,
    isActive: true,
    status: ContentStatus.PUBLISHED,
  },
  {
    id: 'b2',
    title: 'State-of-the-Art Homoeopathic Hospital & Research Facility',
    subtitle: 'Providing 24x7 Emergency OPD, IPD, and Specialized Clinical Training',
    imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=1200',
    linkUrl: '/hospital',
    linkText: 'Explore Hospital OPD',
    displayOrder: 2,
    isActive: true,
    status: ContentStatus.PUBLISHED,
  },
];

let mockNotices: Notice[] = [
  {
    id: 'n1',
    title: 'BHMS 1st Professional WBUHS Supplementary Examination Routine 2026',
    category: NoticeCategory.EXAM,
    content: 'All eligible students of BHMS 1st Professional (Batch 2024-25) are hereby informed that WBUHS Supplementary Examination schedule is published.',
    summary: 'WBUHS Supplementary Routine published for 1st Prof BHMS.',
    publishedDate: '2026-07-20',
    isImportant: true,
    author: 'Controller of Examinations',
    status: ContentStatus.PUBLISHED,
    attachmentUrl: '/downloads/exam-routine-2026.pdf',
    attachmentName: 'WBUHS_Exam_Routine_2026.pdf',
  },
  {
    id: 'n2',
    title: 'Homoeopathic OPD Duty Roster for Interns and Clinical Faculty',
    category: NoticeCategory.HOSPITAL,
    content: 'Special OPD duty roster for August 2026 is updated for Organon and Materia Medica departments.',
    summary: 'Updated OPD Roster for August 2026.',
    publishedDate: '2026-07-18',
    isImportant: false,
    author: 'Medical Superintendent',
    status: ContentStatus.PUBLISHED,
  },
  {
    id: 'n3',
    title: 'WBMCC State AYUSH Counselling Document Verification Desk',
    category: NoticeCategory.ACADEMIC,
    content: 'Counselling verification desk will remain open in the Principal Conference Room from 10:00 AM onwards.',
    summary: 'AYUSH Counselling Verification Notice',
    publishedDate: '2026-07-15',
    isImportant: true,
    author: 'Admission Committee',
    status: ContentStatus.PUBLISHED,
  },
];

let mockNews: News[] = [
  {
    id: 'nw1',
    title: 'National Homoeopathy Science Conference 2026 Hosted at Burdwan Campus',
    slug: 'national-homoeopathy-conference-2026',
    category: NewsCategory.RESEARCH,
    summary: 'Over 500 delegates across India participated in discussions on chronic disease management through high-potency remedies.',
    content: 'The 15th National Homoeopathy Science Seminar witnessed seminal research presentations by faculty and postgraduate scholars.',
    publishedDate: '2026-07-10',
    author: 'Media Relations Cell',
    isFeatured: true,
    status: ContentStatus.PUBLISHED,
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
  },
];

let mockEvents: Event[] = [
  {
    id: 'e1',
    title: 'Hahnemann Birthday Commemoration & Scientific Symposium',
    slug: 'hahnemann-birthday-2026',
    category: EventCategory.SEMINAR,
    description: 'Annual commemoration seminar on Dr. Samuel Hahnemann with clinical case study competitions.',
    eventDate: '2026-08-10',
    location: 'College Auditorium, Main Building',
    organizer: 'Dept. of Organon of Medicine',
    isUpcoming: true,
    status: ContentStatus.PUBLISHED,
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800',
  },
];

let mockDepartments: Department[] = [
  {
    id: 'd1',
    code: 'MM',
    name: 'Department of Materia Medica',
    type: DepartmentType.ACADEMIC,
    headOfDepartment: 'Dr. S. K. Mukhopadhyay, M.D. (Hom.)',
    description: 'Comprehensive study of Homoeopathic Pharmacodynamics and Drug Pictures.',
    facultyCount: 8,
    studentCapacity: 100,
    status: ContentStatus.PUBLISHED,
  },
  {
    id: 'd2',
    code: 'OM',
    name: 'Department of Organon of Medicine',
    type: DepartmentType.ACADEMIC,
    headOfDepartment: 'Dr. A. K. Biswas, M.D. (Hom.)',
    description: 'Core principles of Hahnemannian Philosophy, Case Taking, and Repertorization.',
    facultyCount: 7,
    studentCapacity: 100,
    status: ContentStatus.PUBLISHED,
  },
];

let mockCourses: Course[] = [
  {
    id: 'c1',
    code: 'BHMS',
    title: 'Bachelor of Homoeopathic Medicine and Surgery (B.H.M.S.)',
    type: CourseType.UNDERGRADUATE,
    duration: '5.5 Years (4.5 Yrs Academic + 1 Yr Internship)',
    intakeCapacity: 50,
    eligibilityCriteria: '10+2 with Physics, Chemistry, Biology & English with NEET UG Qualification',
    syllabusOverview: 'Anatomy, Physiology, Pharmacy, Materia Medica, Organon, Pathology, Practice of Medicine, Surgery, Gynaecology, Repertory.',
    status: ContentStatus.PUBLISHED,
  },
  {
    id: 'c2',
    code: 'MD-HOM',
    title: 'Doctor of Medicine in Homoeopathy (M.D. Hom.)',
    type: CourseType.POSTGRADUATE,
    duration: '3 Years Full Time',
    intakeCapacity: 12,
    eligibilityCriteria: 'BHMS Degree from recognized university with NEET UG / AYUSH UG Qualification',
    syllabusOverview: 'Specialization in Materia Medica, Organon of Medicine, and Practice of Medicine.',
    status: ContentStatus.PUBLISHED,
  },
];

let mockDownloads: Download[] = [
  {
    id: 'dl1',
    title: 'BHMS Student Admission Form & Document Checklist',
    category: 'Admission',
    fileType: 'PDF',
    fileSize: '1.2 MB',
    fileUrl: '/downloads/admission-form-2026.pdf',
    updatedAt: '2026-07-01',
    isPublic: true,
  },
  {
    id: 'dl2',
    title: 'Internship Log Book & Clinical Duty Rules',
    category: 'Internship',
    fileType: 'PDF',
    fileSize: '850 KB',
    fileUrl: '/downloads/internship-logbook.pdf',
    updatedAt: '2026-06-20',
    isPublic: true,
  },
];

let mockCommittees: Committee[] = [
  {
    id: 'cm1',
    name: 'Internal Quality Assurance Cell (IQAC)',
    description: 'Ensuring continuous academic quality improvement and accreditation standards.',
    chairperson: 'Principal, BHMCH',
    members: [
      { id: 'm1', name: 'Dr. S. K. Mukhopadhyay', designation: 'Professor', roleInCommittee: 'Member Secretary' },
      { id: 'm2', name: 'Dr. A. K. Biswas', designation: 'Professor', roleInCommittee: 'Member' },
    ],
    status: ContentStatus.PUBLISHED,
  },
];

let mockAbout: About = {
  id: 'ab1',
  title: 'BURDWAN HOMOEOPATHIC MEDICAL COLLEGE & HOSPITAL',
  establishmentYear: 1958,
  vision: 'To emerge as a premier global institution for Homoeopathic education, research, and holistic patient care.',
  mission: [
    'Deliver high quality evidence-based homoeopathic clinical training.',
    'Foster research innovation in drug proving and repertory analysis.',
    'Provide accessible and affordable healthcare to rural and urban communities.',
  ],
  objectives: [
    'Train competent homoeopathic physicians with scientific integrity.',
    'Maintain a 100+ bed hospital with specialized clinical OPDs.',
  ],
  history: 'Established in 1958 by visionary practitioners, BHMCH has grown into one of the oldest and most esteemed Homoeopathic institutions in West Bengal.',
  affiliationDetails: 'Affiliated to The West Bengal University of Health Sciences (WBUHS) & Recognized by National Commission for Homoeopathy (NCH).',
  recognitionDetails: 'Government Aided Institution recognized under 2(f) & 12(B) of UGC Act.',
};

let mockPrincipalDesk: PrincipalDesk = {
  id: 'pd1',
  principalName: 'Dr. Susmita Chatterjee',
  designation: 'Principal & Medical Superintendent',
  qualifications: 'DHMS (West Bengal Council of Homoeopathic Medicine), MD (Organon of Medicine)',
  message: 'Welcome to BURDWAN HOMOEOPATHIC MEDICAL COLLEGE & HOSPITAL. We are dedicated to nurturing scientific rigor and compassionate clinical care in Homoeopathic Medicine.',
  imageUrl: '/images/principal.jpg',
  email: 'drsusmita01@gmail.com',
  phone: '9434238508',
};

let mockContactInfo: ContactInformation = {
  institutionName: 'BURDWAN HOMOEOPATHIC MEDICAL COLLEGE & HOSPITAL',
  address: 'NIMBARK BHABAN, Rajganj, P.O. - Nutanganj, Purba Bardhaman',
  city: 'Bardhaman',
  state: 'West Bengal',
  pincode: '713102',
  primaryPhone: '+91 9434238508',
  secondaryPhone: '+91 7001539036',
  emergencyHelpline: '+91 94333 11889',
  email: 'bhmhospital78@gmail.com',
  admissionEmail: 'bhmhospital78@gmail.com',
  hospitalEmail: 'bhmhospital78@gmail.com',
  workingHours: 'Monday - Saturday: 9:00 AM - 5:00 PM',
  opdHours: 'Daily 9:00 AM - 2:00 PM (Emergency 24x7)',
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3659.8!2d87.86!3d23.23',
  socialMedia: {
    facebook: 'https://facebook.com/bhmch',
    youtube: 'https://youtube.com/c/bhmch',
    linkedin: 'https://linkedin.com/school/bhmch',
  },
};

export const cmsService = {
  // BANNERS
  getLandingBanners: async (): Promise<ApiResponse<Banner[]>> => {
    try {
      const response = await apiClient.get<ApiResponse<Banner[]>>(CMS_ENDPOINTS.BANNERS);
      return response.data;
    } catch {
      return { success: true, data: mockBanners, message: 'Fetched banners', timestamp: currentTimestamp() };
    }
  },
  saveBanner: async (banner: Partial<Banner>): Promise<ApiResponse<Banner>> => {
    if (banner.id) {
      mockBanners = mockBanners.map((b) => (b.id === banner.id ? ({ ...b, ...banner } as Banner) : b));
    } else {
      const newBanner: Banner = {
        id: Date.now().toString(),
        title: banner.title || 'Untitled Banner',
        subtitle: banner.subtitle,
        imageUrl: banner.imageUrl || '',
        displayOrder: mockBanners.length + 1,
        isActive: banner.isActive ?? true,
        status: banner.status || ContentStatus.PUBLISHED,
      };
      mockBanners.unshift(newBanner);
    }
    return { success: true, data: mockBanners[0], message: 'Banner saved', timestamp: currentTimestamp() };
  },
  deleteBanner: async (id: string): Promise<ApiResponse<void>> => {
    mockBanners = mockBanners.filter((b) => b.id !== id);
    return { success: true, data: undefined, message: 'Banner deleted', timestamp: currentTimestamp() };
  },

  // QUICK LINKS
  getQuickLinks: async (): Promise<ApiResponse<QuickLink[]>> => {
    try {
      const response = await apiClient.get<ApiResponse<QuickLink[]>>(CMS_ENDPOINTS.QUICK_LINKS);
      return response.data;
    } catch {
      return { success: true, data: [], message: 'Quick links', timestamp: currentTimestamp() };
    }
  },

  // ABOUT & PRINCIPAL
  getAbout: async (): Promise<ApiResponse<About>> => {
    try {
      const response = await apiClient.get<ApiResponse<About>>(CMS_ENDPOINTS.ABOUT);
      return response.data;
    } catch {
      return { success: true, data: mockAbout, message: 'About details', timestamp: currentTimestamp() };
    }
  },
  updateAbout: async (data: Partial<About>): Promise<ApiResponse<About>> => {
    mockAbout = { ...mockAbout, ...data };
    return { success: true, data: mockAbout, message: 'About updated', timestamp: currentTimestamp() };
  },

  getPrincipalDesk: async (): Promise<ApiResponse<PrincipalDesk>> => {
    try {
      const response = await apiClient.get<ApiResponse<PrincipalDesk>>(CMS_ENDPOINTS.PRINCIPAL_DESK);
      return response.data;
    } catch {
      return { success: true, data: mockPrincipalDesk, message: 'Principal desk', timestamp: currentTimestamp() };
    }
  },
  updatePrincipalDesk: async (data: Partial<PrincipalDesk>): Promise<ApiResponse<PrincipalDesk>> => {
    mockPrincipalDesk = { ...mockPrincipalDesk, ...data };
    return { success: true, data: mockPrincipalDesk, message: 'Principal message updated', timestamp: currentTimestamp() };
  },

  // DEPARTMENTS
  getDepartments: async (): Promise<ApiResponse<Department[]>> => {
    try {
      const response = await apiClient.get<ApiResponse<Department[]>>(CMS_ENDPOINTS.DEPARTMENTS);
      return response.data;
    } catch {
      return { success: true, data: mockDepartments, message: 'Departments list', timestamp: currentTimestamp() };
    }
  },
  saveDepartment: async (dept: Partial<Department>): Promise<ApiResponse<Department>> => {
    if (dept.id) {
      mockDepartments = mockDepartments.map((d) => (d.id === dept.id ? ({ ...d, ...dept } as Department) : d));
    } else {
      const newDept: Department = {
        id: Date.now().toString(),
        code: dept.code || 'DEPT',
        name: dept.name || 'New Department',
        type: dept.type || DepartmentType.ACADEMIC,
        headOfDepartment: dept.headOfDepartment || 'Unassigned',
        description: dept.description || '',
        facultyCount: dept.facultyCount || 0,
        studentCapacity: dept.studentCapacity || 50,
        status: dept.status || ContentStatus.PUBLISHED,
      };
      mockDepartments.unshift(newDept);
    }
    return { success: true, data: mockDepartments[0], message: 'Department saved', timestamp: currentTimestamp() };
  },
  deleteDepartment: async (id: string): Promise<ApiResponse<void>> => {
    mockDepartments = mockDepartments.filter((d) => d.id !== id);
    return { success: true, data: undefined, message: 'Department deleted', timestamp: currentTimestamp() };
  },

  // COURSES
  getCourses: async (): Promise<ApiResponse<Course[]>> => {
    try {
      const response = await apiClient.get<ApiResponse<Course[]>>(CMS_ENDPOINTS.COURSES);
      return response.data;
    } catch {
      return { success: true, data: mockCourses, message: 'Courses list', timestamp: currentTimestamp() };
    }
  },
  saveCourse: async (course: Partial<Course>): Promise<ApiResponse<Course>> => {
    if (course.id) {
      mockCourses = mockCourses.map((c) => (c.id === course.id ? ({ ...c, ...course } as Course) : c));
    } else {
      const newCourse: Course = {
        id: Date.now().toString(),
        code: course.code || 'COURSE',
        title: course.title || 'New Course',
        type: course.type || CourseType.UNDERGRADUATE,
        duration: course.duration || '3 Years',
        intakeCapacity: course.intakeCapacity || 30,
        eligibilityCriteria: course.eligibilityCriteria || '',
        syllabusOverview: course.syllabusOverview || '',
        status: course.status || ContentStatus.PUBLISHED,
      };
      mockCourses.unshift(newCourse);
    }
    return { success: true, data: mockCourses[0], message: 'Course saved', timestamp: currentTimestamp() };
  },

  // NOTICES
  getNotices: async (): Promise<ApiResponse<Notice[]>> => {
    try {
      const response = await apiClient.get<ApiResponse<Notice[]>>(CMS_ENDPOINTS.NOTICES);
      return response.data;
    } catch {
      return { success: true, data: mockNotices, message: 'Notices list', timestamp: currentTimestamp() };
    }
  },
  saveNotice: async (notice: Partial<Notice>): Promise<ApiResponse<Notice>> => {
    if (notice.id) {
      mockNotices = mockNotices.map((n) => (n.id === notice.id ? ({ ...n, ...notice } as Notice) : n));
    } else {
      const newNotice: Notice = {
        id: Date.now().toString(),
        title: notice.title || 'New Notice',
        category: notice.category || NoticeCategory.GENERAL,
        content: notice.content || '',
        summary: notice.summary,
        publishedDate: notice.publishedDate || new Date().toISOString().split('T')[0],
        isImportant: notice.isImportant ?? false,
        author: notice.author || 'Admin Office',
        status: notice.status || ContentStatus.PUBLISHED,
        attachmentUrl: notice.attachmentUrl,
        attachmentName: notice.attachmentName,
      };
      mockNotices.unshift(newNotice);
    }
    return { success: true, data: mockNotices[0], message: 'Notice saved', timestamp: currentTimestamp() };
  },
  deleteNotice: async (id: string): Promise<ApiResponse<void>> => {
    mockNotices = mockNotices.filter((n) => n.id !== id);
    return { success: true, data: undefined, message: 'Notice deleted', timestamp: currentTimestamp() };
  },

  // NEWS
  getNewsList: async (): Promise<ApiResponse<News[]>> => {
    try {
      const response = await apiClient.get<ApiResponse<News[]>>(CMS_ENDPOINTS.NEWS);
      return response.data;
    } catch {
      return { success: true, data: mockNews, message: 'News list', timestamp: currentTimestamp() };
    }
  },
  saveNews: async (news: Partial<News>): Promise<ApiResponse<News>> => {
    if (news.id) {
      mockNews = mockNews.map((nw) => (nw.id === news.id ? ({ ...nw, ...news } as News) : nw));
    } else {
      const newArticle: News = {
        id: Date.now().toString(),
        title: news.title || 'New News Article',
        slug: news.slug || (news.title ? news.title.toLowerCase().replace(/ /g, '-') : 'news-article'),
        category: news.category || NewsCategory.COLLEGE_NEWS,
        summary: news.summary || '',
        content: news.content || '',
        publishedDate: news.publishedDate || new Date().toISOString().split('T')[0],
        author: news.author || 'Editorial Team',
        isFeatured: news.isFeatured ?? false,
        status: news.status || ContentStatus.PUBLISHED,
        imageUrl: news.imageUrl,
      };
      mockNews.unshift(newArticle);
    }
    return { success: true, data: mockNews[0], message: 'News article saved', timestamp: currentTimestamp() };
  },

  // EVENTS
  getEventsList: async (): Promise<ApiResponse<Event[]>> => {
    try {
      const response = await apiClient.get<ApiResponse<Event[]>>(CMS_ENDPOINTS.EVENTS);
      return response.data;
    } catch {
      return { success: true, data: mockEvents, message: 'Events list', timestamp: currentTimestamp() };
    }
  },
  saveEvent: async (evt: Partial<Event>): Promise<ApiResponse<Event>> => {
    if (evt.id) {
      mockEvents = mockEvents.map((e) => (e.id === evt.id ? ({ ...e, ...evt } as Event) : e));
    } else {
      const newEvt: Event = {
        id: Date.now().toString(),
        title: evt.title || 'New Event',
        slug: evt.slug || (evt.title ? evt.title.toLowerCase().replace(/ /g, '-') : 'event'),
        category: evt.category || EventCategory.SEMINAR,
        description: evt.description || '',
        eventDate: evt.eventDate || new Date().toISOString().split('T')[0],
        location: evt.location || 'Campus Auditorium',
        organizer: evt.organizer || 'Academic Cell',
        isUpcoming: evt.isUpcoming ?? true,
        status: evt.status || ContentStatus.PUBLISHED,
      };
      mockEvents.unshift(newEvt);
    }
    return { success: true, data: mockEvents[0], message: 'Event saved', timestamp: currentTimestamp() };
  },

  // DOWNLOADS
  getDownloads: async (): Promise<ApiResponse<Download[]>> => {
    try {
      const response = await apiClient.get<ApiResponse<Download[]>>(CMS_ENDPOINTS.DOWNLOADS);
      return response.data;
    } catch {
      return { success: true, data: mockDownloads, message: 'Downloads', timestamp: currentTimestamp() };
    }
  },
  saveDownload: async (dl: Partial<Download>): Promise<ApiResponse<Download>> => {
    if (dl.id) {
      mockDownloads = mockDownloads.map((item) => (item.id === dl.id ? ({ ...item, ...dl } as Download) : item));
    } else {
      const newDl: Download = {
        id: Date.now().toString(),
        title: dl.title || 'New Download Document',
        category: dl.category || 'General',
        fileType: dl.fileType || 'PDF',
        fileSize: dl.fileSize || '1.0 MB',
        fileUrl: dl.fileUrl || '/downloads/document.pdf',
        updatedAt: new Date().toISOString().split('T')[0],
        isPublic: dl.isPublic ?? true,
      };
      mockDownloads.unshift(newDl);
    }
    return { success: true, data: mockDownloads[0], message: 'Download document saved', timestamp: currentTimestamp() };
  },

  // COMMITTEES
  getCommittees: async (): Promise<ApiResponse<Committee[]>> => {
    try {
      const response = await apiClient.get<ApiResponse<Committee[]>>(CMS_ENDPOINTS.COMMITTEES);
      return response.data;
    } catch {
      return { success: true, data: mockCommittees, message: 'Committees', timestamp: currentTimestamp() };
    }
  },

  // CONTACT INFO
  getContactInfo: async (): Promise<ApiResponse<ContactInformation>> => {
    try {
      const response = await apiClient.get<ApiResponse<ContactInformation>>(CMS_ENDPOINTS.CONTACT);
      return response.data;
    } catch {
      return { success: true, data: mockContactInfo, message: 'Contact details', timestamp: currentTimestamp() };
    }
  },
  updateContactInfo: async (info: Partial<ContactInformation>): Promise<ApiResponse<ContactInformation>> => {
    mockContactInfo = { ...mockContactInfo, ...info };
    return { success: true, data: mockContactInfo, message: 'Contact information updated', timestamp: currentTimestamp() };
  },

  // GALLERY, RESEARCH, ACHIEVEMENTS, HOSPITAL
  getGalleryAlbums: async (): Promise<ApiResponse<GalleryAlbum[]>> => {
    try {
      const response = await apiClient.get<ApiResponse<GalleryAlbum[]>>(CMS_ENDPOINTS.GALLERY);
      return response.data;
    } catch {
      return {
        success: true,
        data: [
          {
            id: 'ga1',
            title: 'Campus Life & Laboratories',
            coverImageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800',
            category: GalleryCategory.CAMPUS,
            images: [],
            imageCount: 12,
            status: ContentStatus.PUBLISHED,
          },
        ],
        message: 'Gallery albums',
        timestamp: currentTimestamp(),
      };
    }
  },
  getResearchHighlights: async (): Promise<ApiResponse<ResearchHighlight[]>> => {
    try {
      const response = await apiClient.get<ApiResponse<ResearchHighlight[]>>(CMS_ENDPOINTS.RESEARCH);
      return response.data;
    } catch {
      return { success: true, data: [], message: 'Research highlights', timestamp: currentTimestamp() };
    }
  },
  getAchievements: async (): Promise<ApiResponse<Achievement[]>> => {
    try {
      const response = await apiClient.get<ApiResponse<Achievement[]>>(CMS_ENDPOINTS.ACHIEVEMENTS);
      return response.data;
    } catch {
      return { success: true, data: [], message: 'Achievements', timestamp: currentTimestamp() };
    }
  },
  getHospitalOverview: async (): Promise<ApiResponse<HospitalOverview>> => {
    try {
      const response = await apiClient.get<ApiResponse<HospitalOverview>>(CMS_ENDPOINTS.HOSPITAL);
      return response.data;
    } catch {
      return {
        success: true,
        data: {
          id: 'ho1',
          name: 'BURDWAN HOMOEOPATHIC MEDICAL COLLEGE & HOSPITAL',
          totalBedCapacity: 100,
          dailyAverageOpdCount: 250,
          emergencyAvailable24x7: true,
          facilities: ['24x7 Emergency', 'IPD Care', 'Surgical Ward', 'Clinical Pathology Lab'],
          departmentBeds: [{ departmentName: 'Organon & Practice of Medicine', bedCount: 40 }],
          opdTiming: '9:00 AM - 2:00 PM',
          ipdTiming: '24x7 Visiting Hours 4 PM - 6 PM',
          description: '100 Bedded Hospital with state-of-the-art OPDs and IPDs.',
          helplineNumber: '+91-342-2530507',
        },
        message: 'Hospital details',
        timestamp: currentTimestamp(),
      };
    }
  },
};
