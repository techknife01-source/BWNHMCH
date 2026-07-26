import { NoticeCategory, NewsCategory, ContentStatus } from '../types/cms.types';

export const formatCmsDate = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
};

export const truncateContent = (text: string, maxLength: number = 150): string => {
  if (!text || text.length <= maxLength) return text || '';
  return text.substring(0, maxLength).trim() + '...';
};

export const getNoticeCategoryColor = (category: NoticeCategory): string => {
  switch (category) {
    case NoticeCategory.ACADEMIC:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
    case NoticeCategory.EXAM:
      return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
    case NoticeCategory.ADMINISTRATIVE:
      return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300';
    case NoticeCategory.HOSPITAL:
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
    default:
      return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
  }
};

export const getContentStatusBadge = (status: ContentStatus): string => {
  switch (status) {
    case ContentStatus.PUBLISHED:
      return 'bg-emerald-500 text-white';
    case ContentStatus.DRAFT:
      return 'bg-amber-500 text-white';
    case ContentStatus.SCHEDULED:
      return 'bg-blue-500 text-white';
    case ContentStatus.ARCHIVED:
      return 'bg-slate-500 text-white';
    default:
      return 'bg-slate-400 text-white';
  }
};
