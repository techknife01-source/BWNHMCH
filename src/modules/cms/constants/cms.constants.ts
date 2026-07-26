/**
 * CMS Constants for Website Route Names and API Endpoints
 */

export const CMS_ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  PRINCIPAL_DESK: '/about/principal-desk',
  DEPARTMENTS: '/departments',
  DEPARTMENT_DETAIL: '/departments/:id',
  COURSES: '/courses',
  COURSE_DETAIL: '/courses/:id',
  NOTICES: '/notices',
  NOTICE_DETAIL: '/notices/:id',
  NEWS: '/news',
  NEWS_DETAIL: '/news/:slug',
  EVENTS: '/events',
  EVENT_DETAIL: '/events/:slug',
  GALLERY: '/gallery',
  GALLERY_ALBUM: '/gallery/:id',
  CONTACT: '/contact',
  DOWNLOADS: '/downloads',
  COMMITTEES: '/committees',
  RESEARCH: '/research',
  ACHIEVEMENTS: '/achievements',
  HOSPITAL: '/hospital',
} as const;

export const CMS_ENDPOINTS = {
  LANDING: '/cms/landing',
  ABOUT: '/cms/about',
  PRINCIPAL_DESK: '/cms/principal-desk',
  DEPARTMENTS: '/cms/departments',
  COURSES: '/cms/courses',
  NOTICES: '/cms/notices',
  NEWS: '/cms/news',
  EVENTS: '/cms/events',
  GALLERY: '/cms/gallery',
  CONTACT: '/cms/contact',
  BANNERS: '/cms/banners',
  QUICK_LINKS: '/cms/quick-links',
  DOWNLOADS: '/cms/downloads',
  COMMITTEES: '/cms/committees',
  RESEARCH: '/cms/research',
  ACHIEVEMENTS: '/cms/achievements',
  HOSPITAL: '/cms/hospital',
} as const;
