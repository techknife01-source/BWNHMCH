export type NoticeCategory = 'ACADEMIC' | 'EXAM' | 'HOSPITAL' | 'ADMISSION' | 'ADMINISTRATIVE' | 'RESEARCH' | 'GENERAL';

export type NoticeStatus = 'PUBLISHED' | 'DRAFT' | 'ARCHIVED' | 'SCHEDULED';

export type NoticeUserRole = 'ADMIN' | 'PRINCIPAL' | 'HOD' | 'FACULTY' | 'STUDENT';

export interface NoticeAttachment {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'ppt' | 'image';
  url: string;
  size?: string;
}

export interface NoticeItem {
  id: string;
  noticeNo: string;
  title: string;
  summary?: string;
  content: string;
  category: NoticeCategory;
  department: string;
  author: string;
  authorRole?: string;
  publishedDate: string;
  scheduledPublishDate?: string;
  expiryDate?: string;
  isImportant: boolean;
  status: NoticeStatus;
  attachments: NoticeAttachment[];
  targetAudience: 'ALL' | 'STUDENTS' | 'FACULTY' | 'HOSPITAL_STAFF' | 'HOD';
  viewsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface NoticeFilterParams {
  search?: string;
  category?: string;
  department?: string;
  priority?: 'ALL' | 'IMPORTANT' | 'NORMAL';
  status?: string;
  role?: NoticeUserRole;
  page?: number;
  pageSize?: number;
}
