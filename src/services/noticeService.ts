import { NoticeItem, NoticeFilterParams, NoticeUserRole, NoticeStatus, NoticeCategory } from '../types/notice';
import toast from 'react-hot-toast';

const STORAGE_KEY = 'bhmc_notices_data_v2';
const UNREAD_TRACKER_KEY = 'bhmc_notices_read_ids';

const INITIAL_NOTICES: NoticeItem[] = [
  {
    id: 'n-101',
    noticeNo: 'BHMCH/ACAD/2026/089',
    title: 'BHMS 1st Professional WBUHS Supplementary Examination Routine 2026',
    summary: 'Official routine and guidelines for upcoming supplementary theory and practical examinations.',
    content: `
      <h2>BHMS 1st Professional Supplementary Examination Roster</h2>
      <p>All eligible BHMS 1st Professional candidates of <strong>BURDWAN HOMOEOPATHIC MEDICAL COLLEGE & HOSPITAL</strong> are hereby notified that the WBUHS Supplementary Examinations 2026 are scheduled as follows:</p>
      <ul>
        <li><strong>Anatomy Paper I & II:</strong> August 12 & 13, 2026 (11:00 AM - 2:00 PM)</li>
        <li><strong>Physiology & Biochemistry:</strong> August 16 & 17, 2026 (11:00 AM - 2:00 PM)</li>
        <li><strong>Homoeopathic Pharmacy:</strong> August 19, 2026 (11:00 AM - 2:00 PM)</li>
      </ul>
      <p>Admit cards must be downloaded from the university student portal after clearance of library dues.</p>
    `,
    category: 'EXAM',
    department: 'Practice of Medicine',
    author: 'Prof. Dr. S. K. Banerjea',
    authorRole: 'Principal & Academic Director',
    publishedDate: '2026-07-28',
    isImportant: true,
    status: 'PUBLISHED',
    targetAudience: 'STUDENTS',
    viewsCount: 342,
    attachments: [
      {
        id: 'att-1',
        name: 'WBUHS_Supplementary_Exam_Routine_2026.pdf',
        type: 'pdf',
        size: '1.4 MB',
        url: 'data:application/pdf;base64,JVBERi0xLjQK...',
      },
      {
        id: 'att-2',
        name: 'Hall_Ticket_Instructions.docx',
        type: 'docx',
        size: '420 KB',
        url: 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,PK01...',
      },
    ],
  },
  {
    id: 'n-102',
    noticeNo: 'BHMCH/HOSP/2026/044',
    title: 'Notification regarding Homoeopathic Hospital OPD Roster during National Holiday',
    summary: 'Emergency OPD duty roster for interns and clinical faculty members.',
    content: `
      <h2>Hospital Duty Directive for National Holiday</h2>
      <p>The Emergency & Casual OPD Services at BURDWAN HOMOEOPATHIC MEDICAL COLLEGE & HOSPITAL will remain <strong>FULLY OPERATIONAL 24x7</strong>.</p>
      <p>Specialized Skin, Pediatric, and General Medicine OPD clinics will run under duty roster batch B.</p>
    `,
    category: 'HOSPITAL',
    department: 'General Medicine',
    author: 'Dr. Amitav Roy',
    authorRole: 'Medical Superintendent',
    publishedDate: '2026-07-25',
    isImportant: false,
    status: 'PUBLISHED',
    targetAudience: 'ALL',
    viewsCount: 189,
    attachments: [
      {
        id: 'att-3',
        name: 'OPD_Duty_Roster_Holiday.pdf',
        type: 'pdf',
        size: '890 KB',
        url: 'data:application/pdf;base64,JVBERi0x...',
      },
      {
        id: 'att-4',
        name: 'Clinical_Duty_Briefing.pptx',
        type: 'ppt',
        size: '2.8 MB',
        url: 'data:application/vnd.ms-powerpoint;base64,PK02...',
      },
    ],
  },
  {
    id: 'n-103',
    noticeNo: 'BHMCH/REG/2026/012',
    title: 'Registration Form Fill-up Notice for Fresh Enrolled BHMS Batch 2026-27',
    summary: 'Step-by-step verification guidelines for fresh undergraduate admission Scholars.',
    content: `
      <h2>Fresh Batch BHMS University Registration Guidelines</h2>
      <p>Newly admitted BHMS scholars (2026-27 session) are instructed to report to the Administrative Office for WBUHS online enrollment document verification.</p>
    `,
    category: 'ACADEMIC',
    department: 'Organon of Medicine',
    author: 'Office of Academic Registrar',
    authorRole: 'Registrar Desk',
    publishedDate: '2026-07-20',
    isImportant: true,
    status: 'PUBLISHED',
    targetAudience: 'STUDENTS',
    viewsCount: 512,
    attachments: [
      {
        id: 'att-5',
        name: 'Registration_Flowchart.png',
        type: 'image',
        size: '650 KB',
        url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      },
    ],
  },
  {
    id: 'n-104',
    noticeNo: 'BHMCH/DRAFT/2026/001',
    title: 'Upcoming National Seminar on Organon & Miasmatic Prescribing (Draft Directive)',
    summary: 'Internal review draft for HODs and Academic Council regarding international speaker roster.',
    content: `
      <h2>Draft Proposal: International Miasm Seminar</h2>
      <p>This draft directive outlines the proposed schedule for the 3-day CME workshop on Miasmatic Diagnosis in Chronic Skin Pathologies.</p>
    `,
    category: 'RESEARCH',
    department: 'Organon of Medicine',
    author: 'Prof. Dr. S. K. Banerjea',
    authorRole: 'Principal',
    publishedDate: '2026-07-29',
    isImportant: false,
    status: 'DRAFT',
    targetAudience: 'FACULTY',
    viewsCount: 15,
    attachments: [],
  },
  {
    id: 'n-105',
    noticeNo: 'BHMCH/ARCH/2025/099',
    title: 'Archived: Annual Sports & Cultural Meet Roster 2025',
    summary: 'Previous year cultural celebration and inter-college tournament results.',
    content: `
      <p>Official sports results and prize distribution archive from December 2025 event.</p>
    `,
    category: 'GENERAL',
    department: 'All',
    author: 'Sports Committee',
    authorRole: 'Convener',
    publishedDate: '2025-12-10',
    expiryDate: '2026-01-01',
    isImportant: false,
    status: 'ARCHIVED',
    targetAudience: 'ALL',
    viewsCount: 840,
    attachments: [],
  },
];

class NoticeService {
  private notices: NoticeItem[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.notices = JSON.parse(stored);
      } else {
        this.notices = INITIAL_NOTICES;
        this.saveToStorage();
      }
    } catch {
      this.notices = INITIAL_NOTICES;
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.notices));
    } catch (e) {
      console.warn('Could not save notices to localStorage', e);
    }
  }

  // Read tracker
  getReadNoticeIds(): string[] {
    try {
      const data = localStorage.getItem(UNREAD_TRACKER_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  markNoticeAsRead(noticeId: string): void {
    try {
      const readIds = this.getReadNoticeIds();
      if (!readIds.includes(noticeId)) {
        readIds.push(noticeId);
        localStorage.setItem(UNREAD_TRACKER_KEY, JSON.stringify(readIds));
      }
    } catch (e) {
      console.warn(e);
    }
  }

  isNoticeRead(noticeId: string): boolean {
    return this.getReadNoticeIds().includes(noticeId);
  }

  // Permission helpers
  canManageNotices(role: NoticeUserRole | string): boolean {
    const norm = (role || '').toString().toUpperCase();
    return (
      norm === 'SUPER_ADMIN' ||
      norm === 'ROLE_SUPER_ADMIN' ||
      norm === 'ADMIN' ||
      norm === 'ROLE_ADMIN' ||
      norm === 'PRINCIPAL' ||
      norm === 'ROLE_PRINCIPAL' ||
      norm === 'VICE_PRINCIPAL' ||
      norm === 'ROLE_VICE_PRINCIPAL'
    );
  }

  canPublishNotice(role: NoticeUserRole | string): boolean {
    return this.canManageNotices(role);
  }

  canDeleteNotice(role: NoticeUserRole | string): boolean {
    return this.canManageNotices(role);
  }

  // Query & Filter
  getNotices(params: NoticeFilterParams = {}): {
    data: NoticeItem[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  } {
    let result = [...this.notices];

    // Role-based visibility filtering
    const userRole = params.role || 'STUDENT';
    if (userRole === 'STUDENT') {
      // Students see only PUBLISHED notices that are not expired
      const today = new Date().toISOString().split('T')[0];
      result = result.filter(
        (n) => n.status === 'PUBLISHED' && (!n.expiryDate || n.expiryDate >= today)
      );
    } else if (userRole === 'FACULTY') {
      // Faculty see PUBLISHED and DRAFT notices
      result = result.filter((n) => n.status === 'PUBLISHED' || n.status === 'DRAFT');
    }

    // Explicit Status Filter
    if (params.status && params.status !== 'ALL') {
      result = result.filter((n) => n.status === params.status);
    }

    // Search query
    if (params.search && params.search.trim() !== '') {
      const q = params.search.toLowerCase();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.noticeNo.toLowerCase().includes(q) ||
          n.author.toLowerCase().includes(q) ||
          (n.summary && n.summary.toLowerCase().includes(q))
      );
    }

    // Category Filter
    if (params.category && params.category !== 'ALL' && params.category !== 'All') {
      result = result.filter((n) => n.category.toUpperCase() === params.category!.toUpperCase());
    }

    // Department Filter
    if (params.department && params.department !== 'ALL' && params.department !== 'All') {
      result = result.filter(
        (n) => n.department === 'All' || n.department.toLowerCase() === params.department!.toLowerCase()
      );
    }

    // Priority Filter
    if (params.priority && params.priority !== 'ALL') {
      if (params.priority === 'IMPORTANT') {
        result = result.filter((n) => n.isImportant);
      } else if (params.priority === 'NORMAL') {
        result = result.filter((n) => !n.isImportant);
      }
    }

    // Sort: Pinned/Important first, then date descending
    result.sort((a, b) => {
      if (a.isImportant && !b.isImportant) return -1;
      if (!a.isImportant && b.isImportant) return 1;
      return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
    });

    // Pagination
    const page = params.page || 1;
    const pageSize = params.pageSize || 6;
    const total = result.length;
    const totalPages = Math.ceil(total / pageSize) || 1;

    const startIndex = (page - 1) * pageSize;
    const paginatedData = result.slice(startIndex, startIndex + pageSize);

    return {
      data: paginatedData,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  getNoticeById(id: string): NoticeItem | undefined {
    const notice = this.notices.find((n) => n.id === id);
    if (notice) {
      notice.viewsCount = (notice.viewsCount || 0) + 1;
      this.saveToStorage();
    }
    return notice;
  }

  createNotice(data: Partial<NoticeItem>): NoticeItem {
    const newNotice: NoticeItem = {
      id: `notice-${Date.now()}`,
      noticeNo: data.noticeNo || `BHMCH/${data.category || 'GEN'}/2026/${Math.floor(100 + Math.random() * 900)}`,
      title: data.title || 'Untitled Notice',
      summary: data.summary || '',
      content: data.content || '<p>Notice details pending...</p>',
      category: data.category || 'ACADEMIC',
      department: data.department || 'All',
      author: data.author || 'Prof. Dr. S. K. Banerjea',
      authorRole: data.authorRole || 'Principal',
      publishedDate: data.publishedDate || new Date().toISOString().split('T')[0],
      scheduledPublishDate: data.scheduledPublishDate,
      expiryDate: data.expiryDate,
      isImportant: data.isImportant ?? false,
      status: data.status || 'PUBLISHED',
      attachments: data.attachments || [],
      targetAudience: data.targetAudience || 'ALL',
      viewsCount: 1,
      createdAt: new Date().toISOString(),
    };

    this.notices.unshift(newNotice);
    this.saveToStorage();
    toast.success(`Notice "${newNotice.title}" successfully created!`);
    return newNotice;
  }

  updateNotice(id: string, updates: Partial<NoticeItem>): NoticeItem | undefined {
    const index = this.notices.findIndex((n) => n.id === id);
    if (index === -1) return undefined;

    this.notices[index] = {
      ...this.notices[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.saveToStorage();
    toast.success('Notice updated successfully!');
    return this.notices[index];
  }

  deleteNotice(id: string): boolean {
    const index = this.notices.findIndex((n) => n.id === id);
    if (index === -1) return false;

    const deleted = this.notices.splice(index, 1);
    this.saveToStorage();
    toast.success(`Notice "${deleted[0].title}" deleted.`);
    return true;
  }

  changeStatus(id: string, newStatus: NoticeStatus): void {
    const notice = this.notices.find((n) => n.id === id);
    if (notice) {
      notice.status = newStatus;
      this.saveToStorage();
      toast.success(`Notice status updated to ${newStatus}`);
    }
  }

  togglePin(id: string): void {
    const notice = this.notices.find((n) => n.id === id);
    if (notice) {
      notice.isImportant = !notice.isImportant;
      this.saveToStorage();
      toast.success(notice.isImportant ? 'Notice pinned to top!' : 'Notice unpinned');
    }
  }

  // Bulk Operations
  bulkDeleteNotices(ids: string[]): boolean {
    if (ids.length === 0) return false;
    this.notices = this.notices.filter((n) => !ids.includes(n.id));
    this.saveToStorage();
    toast.success(`${ids.length} notice(s) deleted.`);
    return true;
  }

  bulkPublishNotices(ids: string[]): void {
    if (ids.length === 0) return;
    this.notices.forEach((n) => {
      if (ids.includes(n.id)) n.status = 'PUBLISHED';
    });
    this.saveToStorage();
    toast.success(`${ids.length} notice(s) published.`);
  }

  bulkArchiveNotices(ids: string[]): void {
    if (ids.length === 0) return;
    this.notices.forEach((n) => {
      if (ids.includes(n.id)) n.status = 'ARCHIVED';
    });
    this.saveToStorage();
    toast.success(`${ids.length} notice(s) archived.`);
  }

  bulkCategoryUpdateNotices(ids: string[], newCategory: NoticeCategory): void {
    if (ids.length === 0) return;
    this.notices.forEach((n) => {
      if (ids.includes(n.id)) n.category = newCategory;
    });
    this.saveToStorage();
    toast.success(`${ids.length} notice(s) updated to ${newCategory}.`);
  }

  exportNotices(ids?: string[]): string {
    const exportList = ids && ids.length > 0 ? this.notices.filter((n) => ids.includes(n.id)) : this.notices;
    return JSON.stringify(exportList, null, 2);
  }

  importNotices(jsonString: string): number {
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed)) throw new Error('Expected an array of notices.');
      let count = 0;
      parsed.forEach((n, idx) => {
        if (n.title) {
          const item: NoticeItem = {
            id: n.id || `notice-imp-${Date.now()}-${idx}`,
            noticeNo: n.noticeNo || `BHMCH/IMP/2026/${Math.floor(100 + Math.random() * 900)}`,
            title: n.title,
            summary: n.summary || '',
            content: n.content || `<p>${n.title}</p>`,
            category: n.category || 'ACADEMIC',
            department: n.department || 'All',
            author: n.author || 'Imported Desk',
            authorRole: n.authorRole || 'Administrator',
            publishedDate: n.publishedDate || new Date().toISOString().split('T')[0],
            expiryDate: n.expiryDate,
            isImportant: !!n.isImportant,
            status: n.status || 'PUBLISHED',
            attachments: n.attachments || [],
            targetAudience: n.targetAudience || 'ALL',
            viewsCount: 1,
            createdAt: new Date().toISOString(),
          };
          this.notices.unshift(item);
          count++;
        }
      });
      this.saveToStorage();
      toast.success(`${count} notice(s) imported successfully!`);
      return count;
    } catch (e: any) {
      toast.error(`Import failed: ${e.message || 'Invalid format'}`);
      return 0;
    }
  }
}

export const noticeService = new NoticeService();
