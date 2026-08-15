import React, { useState, useEffect } from 'react';
import { cmsService } from '../services/cms.service';
import {
  Banner,
  Notice,
  News,
  Event,
  Department,
  Course,
  Download,
  About,
  PrincipalDesk,
  ContactInformation,
  ContentStatus,
  NoticeCategory,
  NewsCategory,
  EventCategory,
  DepartmentType,
  CourseType,
} from '../types/cms.types';
import { RichTextEditor } from '../../../components/common/RichTextEditor';
import { MediaLibraryModal } from '../../../components/cms/MediaLibraryModal';
import { GalleryManagementPanel } from '../components/GalleryManagementPanel';
import { NoticeManagementPanel } from '../components/NoticeManagementPanel';
import { NoticeBoardManagementPanel } from '../components/NoticeBoardManagementPanel';
import { DepartmentStaffManagementPanel } from '../components/DepartmentStaffManagementPanel';
import { AdmissionManagementPanel } from '../components/AdmissionManagementPanel';
import {
  Globe,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  FileText,
  Image as ImageIcon,
  Calendar,
  Building,
  GraduationCap,
  Download as DownloadIcon,
  Phone,
  Share2,
  ShieldAlert,
  Sparkles,
  Layout,
  Save,
  Check,
  Eye,
  Megaphone,
  BookOpen,
  UserCheck,
  Award,
  Layers,
  MapPin,
  Tag,
  Users,
  Pin,
} from 'lucide-react';
import { useLocation, useSearchParams } from 'react-router-dom';

interface CmsDashboardPageProps {
  defaultTab?: any;
}

export const CmsDashboardPage: React.FC<CmsDashboardPageProps> = ({ defaultTab }) => {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const getInitialTab = () => {
    if (defaultTab) return defaultTab;
    if (location.pathname.includes('gallery')) return 'gallery';
    const tab = searchParams.get('tab');
    if (tab) return tab as any;
    return 'overview';
  };

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'banners'
    | 'gallery'
    | 'notices'
    | 'notice_board'
    | 'news'
    | 'events'
    | 'about'
    | 'departments'
    | 'staff'
    | 'courses'
    | 'downloads'
    | 'hospital'
    | 'contact_seo'
  >(getInitialTab);

  useEffect(() => {
    if (location.pathname.includes('gallery')) {
      setActiveTab('gallery');
    } else {
      const tab = searchParams.get('tab');
      if (tab) setActiveTab(tab as any);
    }
  }, [location.pathname, searchParams]);

  // Loading & notification states
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaTargetCallback, setMediaTargetCallback] = useState<((url: string) => void) | null>(null);

  // Entities Data State
  const [banners, setBanners] = useState<Banner[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [about, setAbout] = useState<About | null>(null);
  const [principal, setPrincipal] = useState<PrincipalDesk | null>(null);
  const [contact, setContact] = useState<ContactInformation | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modal / Form Edit States
  const [editingBanner, setEditingBanner] = useState<Partial<Banner> | null>(null);
  const [editingNotice, setEditingNotice] = useState<Partial<Notice> | null>(null);
  const [editingNews, setEditingNews] = useState<Partial<News> | null>(null);
  const [editingEvent, setEditingEvent] = useState<Partial<Event> | null>(null);
  const [editingDept, setEditingDept] = useState<Partial<Department> | null>(null);
  const [editingCourse, setEditingCourse] = useState<Partial<Course> | null>(null);
  const [editingDownload, setEditingDownload] = useState<Partial<Download> | null>(null);

  // Load Initial CMS Data
  useEffect(() => {
    loadAllCmsData();
  }, []);

  const loadAllCmsData = async () => {
    setIsLoading(true);
    try {
      const [bRes, nRes, nwRes, eRes, dRes, cRes, dlRes, abRes, pdRes, ctRes] = await Promise.all([
        cmsService.getLandingBanners(),
        cmsService.getNotices(),
        cmsService.getNewsList(),
        cmsService.getEventsList(),
        cmsService.getDepartments(),
        cmsService.getCourses(),
        cmsService.getDownloads(),
        cmsService.getAbout(),
        cmsService.getPrincipalDesk(),
        cmsService.getContactInfo(),
      ]);

      if (bRes.data) setBanners(bRes.data);
      if (nRes.data) setNotices(nRes.data);
      if (nwRes.data) setNews(nwRes.data);
      if (eRes.data) setEvents(eRes.data);
      if (dRes.data) setDepartments(dRes.data);
      if (cRes.data) setCourses(cRes.data);
      if (dlRes.data) setDownloads(dlRes.data);
      if (abRes.data) setAbout(abRes.data);
      if (pdRes.data) setPrincipal(pdRes.data);
      if (ctRes.data) setContact(ctRes.data);
    } catch {
      // Handled gracefully via fallbacks
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const openMediaPicker = (callback: (url: string) => void) => {
    setMediaTargetCallback(() => callback);
    setIsMediaModalOpen(true);
  };

  // BANNER HANDLERS
  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner) return;
    await cmsService.saveBanner(editingBanner);
    setEditingBanner(null);
    showToast('Hero Banner updated successfully!');
    loadAllCmsData();
  };

  const handleDeleteBanner = async (id: string) => {
    if (confirm('Are you sure you want to delete this Hero Banner?')) {
      await cmsService.deleteBanner(id);
      showToast('Banner removed');
      loadAllCmsData();
    }
  };

  // NOTICE HANDLERS
  const handleSaveNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNotice) return;
    await cmsService.saveNotice(editingNotice);
    setEditingNotice(null);
    showToast('Notice published/updated successfully!');
    loadAllCmsData();
  };

  const handleDeleteNotice = async (id: string) => {
    if (confirm('Are you sure you want to delete this Notice?')) {
      await cmsService.deleteNotice(id);
      showToast('Notice deleted');
      loadAllCmsData();
    }
  };

  // NEWS HANDLERS
  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNews) return;
    await cmsService.saveNews(editingNews);
    setEditingNews(null);
    showToast('News article published/updated!');
    loadAllCmsData();
  };

  // EVENT HANDLERS
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    await cmsService.saveEvent(editingEvent);
    setEditingEvent(null);
    showToast('Event updated!');
    loadAllCmsData();
  };

  // DEPARTMENT HANDLERS
  const handleSaveDept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDept) return;
    await cmsService.saveDepartment(editingDept);
    setEditingDept(null);
    showToast('Department details updated!');
    loadAllCmsData();
  };

  // COURSE HANDLERS
  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;
    await cmsService.saveCourse(editingCourse);
    setEditingCourse(null);
    showToast('Course information saved!');
    loadAllCmsData();
  };

  // DOWNLOAD HANDLERS
  const handleSaveDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDownload) return;
    await cmsService.saveDownload(editingDownload);
    setEditingDownload(null);
    showToast('Download document published!');
    loadAllCmsData();
  };

  // ABOUT & PRINCIPAL HANDLERS
  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!about) return;
    await cmsService.updateAbout(about);
    showToast('About College information updated!');
  };

  const handleSavePrincipal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!principal) return;
    await cmsService.updatePrincipalDesk(principal);
    showToast("Principal's Desk message saved!");
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact) return;
    await cmsService.updateContactInfo(contact);
    showToast('Contact, Google Maps & SEO Settings saved!');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fadeIn">
      {/* Toast Alert */}
      {successMsg && (
        <div className="fixed top-20 right-6 z-50 bg-[#002147] text-white dark:bg-[#00A651] px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-bounce border border-white/20">
          <CheckCircle className="w-4 h-4 text-emerald-400 dark:text-white" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="rounded-3xl bg-[#002147] text-white p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#00A651] uppercase tracking-widest">
            <Globe className="w-4 h-4" />
            <span>Digital College Ecosystem Content Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            CMS Content Management Center
          </h1>
          <p className="text-slate-300 text-xs max-w-2xl leading-relaxed">
            Manage public portal notices, homepage hero sliders, news, academic calendar events, department details, principal messages, downloads, and SEO metadata in real-time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 z-10">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-2xs uppercase tracking-wider rounded-xl transition flex items-center gap-2 backdrop-blur-xs border border-white/10"
          >
            <Eye className="w-4 h-4" />
            <span>Preview Portal</span>
          </a>
          <button
            onClick={() => setIsMediaModalOpen(true)}
            className="px-4 py-2.5 bg-[#00A651] hover:bg-[#008d44] text-white font-bold text-2xs uppercase tracking-wider rounded-xl transition flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <ImageIcon className="w-4 h-4" />
            <span>Media Library</span>
          </button>
        </div>
      </div>

      {/* Primary Tab Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 custom-scrollbar">
        {[
          { id: 'overview', label: 'Overview', icon: Layout },
          { id: 'gallery', label: 'Gallery Management', icon: ImageIcon },
          { id: 'notices', label: 'Notices & Circulars', icon: Megaphone },
          { id: 'notice_board', label: 'Notice Board Control', icon: Pin },
          { id: 'banners', label: 'Hero Banners', icon: Layers },
          { id: 'departments', label: 'Departments', icon: Building },
          { id: 'staff', label: 'Department Staff', icon: Users },
          { id: 'news', label: 'News & Press', icon: FileText },
          { id: 'events', label: 'Events & Calendar', icon: Calendar },
          { id: 'about', label: 'About & Principal', icon: BookOpen },
          { id: 'courses', label: 'Courses', icon: GraduationCap },
          { id: 'admissions', label: 'BHMS Admissions', icon: CheckCircle },
          { id: 'downloads', label: 'Downloads', icon: DownloadIcon },
          { id: 'contact_seo', label: 'Contact, Map & SEO', icon: MapPin },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider transition whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#002147] text-white shadow-md dark:bg-[#00A651]'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* 1. OVERVIEW TAB */}
      {/* ======================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-3xs font-extrabold uppercase text-slate-400">Total Banners</span>
                <ImageIcon className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{banners.length}</p>
              <p className="text-[10px] text-slate-400">Homepage Sliders Active</p>
            </div>

            <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-3xs font-extrabold uppercase text-slate-400">Notices & Gazette</span>
                <Megaphone className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{notices.length}</p>
              <p className="text-[10px] text-emerald-600 font-bold">
                {notices.filter((n) => n.isImportant).length} High Priority Notices
              </p>
            </div>

            <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-3xs font-extrabold uppercase text-slate-400">News Articles</span>
                <FileText className="w-4 h-4 text-purple-500" />
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{news.length}</p>
              <p className="text-[10px] text-slate-400">Published Press Releases</p>
            </div>

            <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-3xs font-extrabold uppercase text-slate-400">Academic Events</span>
                <Calendar className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{events.length}</p>
              <p className="text-[10px] text-slate-400">Upcoming Seminars & Work</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4">
              <h3 className="text-sm font-black uppercase text-[#002147] dark:text-white flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-[#00A651]" />
                <span>Recent Notice Board Circulars</span>
              </h3>
              <div className="space-y-3">
                {notices.slice(0, 4).map((n) => (
                  <div
                    key={n.id}
                    className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl flex items-center justify-between gap-3 border border-slate-150 dark:border-slate-800"
                  >
                    <div className="min-w-0">
                      <p className="text-2xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {n.title}
                      </p>
                      <p className="text-[10px] text-slate-400">{n.category} • {n.publishedDate}</p>
                    </div>
                    <span
                      className={`px-2 py-0.5 text-[9px] font-black uppercase rounded ${
                        n.status === ContentStatus.PUBLISHED
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {n.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4">
              <h3 className="text-sm font-black uppercase text-[#002147] dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Quick Content Publishing Tools</span>
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                <button
                  onClick={() => {
                    setEditingNotice({
                      title: '',
                      category: NoticeCategory.ACADEMIC,
                      content: '',
                      publishedDate: new Date().toISOString().split('T')[0],
                      status: ContentStatus.PUBLISHED,
                      isImportant: false,
                    });
                    setActiveTab('notices');
                  }}
                  className="p-4 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 rounded-2xl border border-blue-100 dark:border-blue-900 hover:bg-blue-100 transition flex flex-col items-center gap-2 text-center cursor-pointer"
                >
                  <Plus className="w-5 h-5" />
                  <span>Publish New Notice</span>
                </button>

                <button
                  onClick={() => {
                    setEditingNews({
                      title: '',
                      category: NewsCategory.COLLEGE_NEWS,
                      summary: '',
                      content: '',
                      publishedDate: new Date().toISOString().split('T')[0],
                      status: ContentStatus.PUBLISHED,
                    });
                    setActiveTab('news');
                  }}
                  className="p-4 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-2xl border border-emerald-100 dark:border-emerald-900 hover:bg-emerald-100 transition flex flex-col items-center gap-2 text-center cursor-pointer"
                >
                  <Plus className="w-5 h-5" />
                  <span>Publish News Article</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. HERO BANNERS TAB */}
      {/* ======================================================== */}
      {activeTab === 'banners' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Homepage Hero Sliders & Banners
              </h3>
              <p className="text-3xs text-slate-400">
                Manage high-resolution image sliders displayed on the college landing page.
              </p>
            </div>
            <button
              onClick={() =>
                setEditingBanner({
                  title: '',
                  subtitle: '',
                  imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1200',
                  displayOrder: banners.length + 1,
                  isActive: true,
                  status: ContentStatus.PUBLISHED,
                })
              }
              className="px-4 py-2 bg-[#002147] dark:bg-[#00A651] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Hero Banner</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {banners.map((b) => (
              <div
                key={b.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs flex flex-col"
              >
                <div className="h-44 bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
                  <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-slate-900/80 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs">
                    Order #{b.displayOrder}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">
                      {b.title}
                    </h4>
                    {b.subtitle && <p className="text-2xs text-slate-500 mt-1">{b.subtitle}</p>}
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${
                        b.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {b.isActive ? 'Active Slider' : 'Hidden'}
                    </span>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingBanner(b)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl transition cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBanner(b.id)}
                        className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* EDIT BANNER MODAL */}
          {editingBanner && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
              <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {editingBanner.id ? 'Edit Hero Banner' : 'Create New Hero Banner'}
                </h3>

                <form onSubmit={handleSaveBanner} className="space-y-4 text-2xs">
                  <div>
                    <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Banner Heading Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingBanner.title || ''}
                      onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Subtitle / Tagline
                    </label>
                    <input
                      type="text"
                      value={editingBanner.subtitle || ''}
                      onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
                        Image Asset URL *
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          required
                          value={editingBanner.imageUrl || ''}
                          onChange={(e) => setEditingBanner({ ...editingBanner, imageUrl: e.target.value })}
                          className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950"
                        />
                        <button
                          type="button"
                          onClick={() => openMediaPicker((url) => setEditingBanner({ ...editingBanner, imageUrl: url }))}
                          className="px-3 bg-slate-200 dark:bg-slate-800 rounded-xl font-bold"
                        >
                          Pick
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
                        Display Order #
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={editingBanner.displayOrder || 1}
                        onChange={(e) =>
                          setEditingBanner({ ...editingBanner, displayOrder: parseInt(e.target.value) || 1 })
                        }
                        className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setEditingBanner(null)}
                      className="px-4 py-2 bg-slate-200 dark:bg-slate-800 font-bold rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#002147] dark:bg-[#00A651] text-white font-bold rounded-xl"
                    >
                      Save Hero Banner
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* GALLERY MANAGEMENT TAB */}
      {/* ======================================================== */}
      {activeTab === 'gallery' && <GalleryManagementPanel />}

      {/* ======================================================== */}
      {/* NOTICES MANAGEMENT TAB */}
      {/* ======================================================== */}
      {activeTab === 'notices' && <NoticeManagementPanel />}

      {/* ======================================================== */}
      {/* NOTICE BOARD CONTROL TAB */}
      {/* ======================================================== */}
      {activeTab === 'notice_board' && <NoticeBoardManagementPanel />}

      {/* ======================================================== */}
      {/* DEPARTMENT STAFF MANAGEMENT TAB */}
      {/* ======================================================== */}
      {activeTab === 'staff' && <DepartmentStaffManagementPanel />}

      {/* ======================================================== */}
      {/* 4. NEWS & PRESS RELEASES TAB */}
      {/* ======================================================== */}
      {activeTab === 'news' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                News Articles & Press Releases
              </h3>
              <p className="text-3xs text-slate-400">
                Publish college achievements, research symposiums, and hospital outreach programs.
              </p>
            </div>
            <button
              onClick={() =>
                setEditingNews({
                  title: '',
                  category: NewsCategory.COLLEGE_NEWS,
                  summary: '',
                  content: '',
                  publishedDate: new Date().toISOString().split('T')[0],
                  status: ContentStatus.PUBLISHED,
                })
              }
              className="px-4 py-2 bg-[#002147] dark:bg-[#00A651] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Create News Article</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {news.map((nw) => (
              <div
                key={nw.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs flex flex-col justify-between"
              >
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                      {nw.category}
                    </span>
                    <span className="text-[10px] text-slate-400">{nw.publishedDate}</span>
                  </div>

                  <h4 className="font-extrabold text-base text-slate-900 dark:text-white leading-snug">
                    {nw.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2">{nw.summary}</p>
                </div>

                <div className="px-6 py-3 bg-slate-50/50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">By {nw.author}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingNews(nw)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* EDIT NEWS MODAL */}
          {editingNews && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
              <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {editingNews.id ? 'Edit News Article' : 'Publish News Article'}
                </h3>

                <form onSubmit={handleSaveNews} className="space-y-4 text-2xs">
                  <div>
                    <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Article Headline / Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingNews.title || ''}
                      onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Brief Summary / Lead Paragraph
                    </label>
                    <input
                      type="text"
                      value={editingNews.summary || ''}
                      onChange={(e) => setEditingNews({ ...editingNews, summary: e.target.value })}
                      className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950"
                    />
                  </div>

                  <RichTextEditor
                    label="Full News Article Body"
                    value={editingNews.content || ''}
                    onChange={(val) => setEditingNews({ ...editingNews, content: val })}
                  />

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setEditingNews(null)}
                      className="px-4 py-2 bg-slate-200 dark:bg-slate-800 font-bold rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#002147] dark:bg-[#00A651] text-white font-bold rounded-xl"
                    >
                      Publish Article
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. EVENTS & CALENDAR TAB */}
      {/* ======================================================== */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Academic Calendar & Campus Events
              </h3>
              <p className="text-3xs text-slate-400">
                Manage upcoming scientific seminars, clinical workshops, and cultural symposiums.
              </p>
            </div>
            <button
              onClick={() =>
                setEditingEvent({
                  title: '',
                  category: EventCategory.SEMINAR,
                  description: '',
                  eventDate: new Date().toISOString().split('T')[0],
                  location: 'College Main Auditorium',
                  organizer: 'Academic Committee',
                  isUpcoming: true,
                  status: ContentStatus.PUBLISHED,
                })
              }
              className="px-4 py-2 bg-[#002147] dark:bg-[#00A651] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Calendar Event</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    {evt.category}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-600">{evt.eventDate}</span>
                </div>

                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">{evt.title}</h4>
                <p className="text-xs text-slate-500">{evt.description}</p>
                <p className="text-2xs text-slate-400 font-bold">📍 {evt.location}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. ABOUT COLLEGE & PRINCIPAL DESK TAB */}
      {/* ======================================================== */}
      {activeTab === 'about' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* About College Overview */}
          {about && (
            <form
              onSubmit={handleSaveAbout}
              className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 text-2xs"
            >
              <h3 className="text-sm font-black uppercase text-[#002147] dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-500" />
                <span>Institutional Profile & History</span>
              </h3>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Official Institution Title
                </label>
                <input
                  type="text"
                  value={about.title}
                  onChange={(e) => setAbout({ ...about, title: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl font-bold bg-slate-50 dark:bg-slate-950"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Establishment Year
                </label>
                <input
                  type="number"
                  value={about.establishmentYear}
                  onChange={(e) => setAbout({ ...about, establishmentYear: parseInt(e.target.value) || 1958 })}
                  className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Vision Statement
                </label>
                <textarea
                  rows={3}
                  value={about.vision}
                  onChange={(e) => setAbout({ ...about, vision: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Institutional History & Heritage
                </label>
                <textarea
                  rows={4}
                  value={about.history}
                  onChange={(e) => setAbout({ ...about, history: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#002147] hover:bg-[#001833] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save About College Changes</span>
              </button>
            </form>
          )}

          {/* Principal Desk */}
          {principal && (
            <form
              onSubmit={handleSavePrincipal}
              className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 text-2xs"
            >
              <h3 className="text-sm font-black uppercase text-[#002147] dark:text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-500" />
                <span>Principal's Desk & Official Desk Message</span>
              </h3>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Principal Full Name & Degrees
                </label>
                <input
                  type="text"
                  value={principal.principalName}
                  onChange={(e) => setPrincipal({ ...principal, principalName: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl font-bold bg-slate-50 dark:bg-slate-950"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Academic Qualifications
                </label>
                <input
                  type="text"
                  value={principal.qualifications}
                  onChange={(e) => setPrincipal({ ...principal, qualifications: e.target.value })}
                  className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Principal Photo Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={principal.imageUrl}
                    onChange={(e) => setPrincipal({ ...principal, imageUrl: e.target.value })}
                    className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950"
                  />
                  <button
                    type="button"
                    onClick={() => openMediaPicker((url) => setPrincipal({ ...principal, imageUrl: url }))}
                    className="px-3 bg-slate-200 dark:bg-slate-800 rounded-xl font-bold"
                  >
                    Pick
                  </button>
                </div>
              </div>

              <RichTextEditor
                label="Principal Official Address & Welcome Message"
                value={principal.message}
                onChange={(val) => setPrincipal({ ...principal, message: val })}
              />

              <button
                type="submit"
                className="w-full py-2.5 bg-[#00A651] hover:bg-[#008d44] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Principal Desk Message</span>
              </button>
            </form>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. DEPARTMENTS TAB */}
      {/* ======================================================== */}
      {activeTab === 'departments' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Academic & Clinical Departments
              </h3>
              <p className="text-3xs text-slate-400">
                Manage department heads, student capacity, faculty strength, and clinical labs.
              </p>
            </div>
            <button
              onClick={() =>
                setEditingDept({
                  code: 'DEPT',
                  name: '',
                  type: DepartmentType.ACADEMIC,
                  headOfDepartment: '',
                  description: '',
                  facultyCount: 5,
                  studentCapacity: 60,
                  status: ContentStatus.PUBLISHED,
                })
              }
              className="px-4 py-2 bg-[#002147] dark:bg-[#00A651] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Department</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {departments.map((d) => (
              <div
                key={d.id}
                className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded dark:bg-blue-950 dark:text-blue-300">
                    {d.code}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">{d.facultyCount} Faculty Members</span>
                </div>

                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">{d.name}</h4>
                <p className="text-xs text-slate-500 font-bold">HOD: {d.headOfDepartment}</p>
                <p className="text-2xs text-slate-400">{d.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 8. COURSES TAB */}
      {/* ======================================================== */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Academic Degree Programs & Courses
              </h3>
              <p className="text-3xs text-slate-400">
                Manage B.H.M.S. & M.D. Homoeopathy course overview, eligibility criteria, and intake capacity.
              </p>
            </div>
            <button
              onClick={() =>
                setEditingCourse({
                  code: 'BHMS',
                  title: '',
                  type: CourseType.UNDERGRADUATE,
                  duration: '5.5 Years',
                  intakeCapacity: 50,
                  eligibilityCriteria: '',
                  syllabusOverview: '',
                  status: ContentStatus.PUBLISHED,
                })
              }
              className="px-4 py-2 bg-[#002147] dark:bg-[#00A651] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Degree Course</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((c) => (
              <div
                key={c.id}
                className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {c.code} • {c.type}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">Intake: {c.intakeCapacity} Seats</span>
                </div>

                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">{c.title}</h4>
                <p className="text-xs text-slate-500">{c.duration}</p>
                <p className="text-2xs text-slate-400">
                  <span className="font-bold text-slate-700 dark:text-slate-200">Eligibility:</span>{' '}
                  {c.eligibilityCriteria}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ADMISSIONS & TIMELINE TAB */}
      {/* ======================================================== */}
      {activeTab === 'admissions' && <AdmissionManagementPanel />}

      {/* ======================================================== */}
      {/* 9. DOWNLOADS TAB */}
      {/* ======================================================== */}
      {activeTab === 'downloads' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Downloadable Forms, Syllabi & Document Circulars
              </h3>
              <p className="text-3xs text-slate-400">
                Upload prospectus PDF files, admission forms, and fee structures for public access.
              </p>
            </div>
            <button
              onClick={() =>
                setEditingDownload({
                  title: '',
                  category: 'General',
                  fileType: 'PDF',
                  fileSize: '1.2 MB',
                  fileUrl: '/downloads/document.pdf',
                  isPublic: true,
                })
              }
              className="px-4 py-2 bg-[#002147] dark:bg-[#00A651] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add PDF Download Document</span>
            </button>
          </div>

          <div className="space-y-3">
            {downloads.map((dl) => (
              <div
                key={dl.id}
                className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 shadow-xs"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl dark:bg-rose-950 dark:text-rose-400">
                    <DownloadIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{dl.title}</h4>
                    <p className="text-[10px] text-slate-400">
                      {dl.category} • {dl.fileType} ({dl.fileSize})
                    </p>
                  </div>
                </div>

                <a
                  href={dl.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-[#002147] hover:text-white text-slate-800 dark:bg-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 10. CONTACT, GOOGLE MAP & SEO SETTINGS TAB */}
      {/* ======================================================== */}
      {activeTab === 'contact_seo' && contact && (
        <form onSubmit={handleSaveContact} className="space-y-6 text-2xs">
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-black uppercase text-[#002147] dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-500" />
              <span>Contact Details & Google Maps Embed</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Campus Address
                </label>
                <input
                  type="text"
                  value={contact.address}
                  onChange={(e) => setContact({ ...contact, address: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Primary Phone Helpline
                </label>
                <input
                  type="text"
                  value={contact.primaryPhone}
                  onChange={(e) => setContact({ ...contact, primaryPhone: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Official Administrative Email
                </label>
                <input
                  type="email"
                  value={contact.email}
                  onChange={(e) => setContact({ ...contact, email: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Google Map Embed URL
                </label>
                <input
                  type="text"
                  value={contact.mapEmbedUrl || ''}
                  onChange={(e) => setContact({ ...contact, mapEmbedUrl: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#002147] hover:bg-[#001833] dark:bg-[#00A651] text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg"
          >
            <Save className="w-4 h-4" />
            <span>Save Contact & SEO Configuration</span>
          </button>
        </form>
      )}

      {/* Global Media Library Picker Modal */}
      <MediaLibraryModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelectMedia={(url) => {
          if (mediaTargetCallback) {
            mediaTargetCallback(url);
          }
        }}
      />
    </div>
  );
};
