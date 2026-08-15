import React, { useState, useEffect } from 'react';
import { galleryService, GalleryItem } from '../../../services/galleryService';
import { galleryApi } from '../../../services/api/gallery.api';
import { Card } from '../../../components/common/Card';
import { useAuth } from '../../../contexts/AuthContext';
import {
  canManageGallery,
  isSuperAdmin,
  isAdmin,
  isPrincipal,
  isVicePrincipal,
  getUserDisplayDesignation,
} from '../../../utils/permissionHelper';
import {
  Image as ImageIcon,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Upload,
  Download,
  FileSpreadsheet,
  CheckSquare,
  Square,
  Maximize2,
  X,
  Sparkles,
  ShieldAlert,
  RefreshCw,
  FolderPlus,
  Layers,
  Star,
  CheckCircle2,
  AlertTriangle,
  HardDrive,
  Table as TableIcon,
  LayoutGrid,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const GalleryManagementPanel: React.FC = () => {
  const { user } = useAuth();
  const isAuthorized = canManageGallery(user) || isSuperAdmin(user) || isAdmin(user) || isPrincipal(user) || isVicePrincipal(user);

  // Filter & Search states
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [featuredFilter, setFeaturedFilter] = useState<'ALL' | 'FEATURED_ONLY'>('ALL');
  const [sortBy, setSortBy] = useState<'displayOrder' | 'date' | 'title'>('displayOrder');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // Live items state from backend
  const [rawItems, setRawItems] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [brokenImageMap, setBrokenImageMap] = useState<Record<string, boolean>>({});

  // Selection states
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkCategory, setBulkCategory] = useState('Hospital & OPD');

  // Modals & Form states
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<any | null>(null);
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<{ id?: string; bulk?: boolean } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Upload Form State
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreviewUrl, setUploadPreviewUrl] = useState<string | null>(null);
  const [uploadFormData, setUploadFormData] = useState({
    title: '',
    description: '',
    category: 'Hospital & OPD',
    displayOrder: 1,
    isFeatured: false,
    status: 'PUBLISHED' as 'PUBLISHED' | 'HIDDEN',
  });

  // Edit Form State
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editPreviewUrl, setEditPreviewUrl] = useState<string | null>(null);

  const fetchBackendData = async () => {
    setIsLoadingData(true);
    try {
      const res = await galleryApi.getGalleryItems();
      if (res && res.success && Array.isArray(res.data)) {
        setRawItems(res.data);
      } else {
        await galleryService.syncFromBackend();
        const fallback = galleryService.getItems({ role: isAuthorized ? 'SUPER_ADMIN' : 'STUDENT' });
        setRawItems(fallback.data || []);
      }
    } catch (err) {
      console.warn('[GalleryManagementPanel] Fetch warning:', err);
      await galleryService.syncFromBackend();
      const fallback = galleryService.getItems({ role: isAuthorized ? 'SUPER_ADMIN' : 'STUDENT' });
      setRawItems(fallback.data || []);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchBackendData();
  }, []);

  const categories = ['All', 'Hospital & OPD', 'Labs & Classrooms', 'Events & Seminars', 'Herbal Garden'];

  const getUploaderInfo = () => {
    const name = user?.fullName || user?.username || 'Authorized Admin';
    const des = getUserDisplayDesignation(user);
    return `${name} (${des})`;
  };

  // Helper to build canonical streamed image URL
  const buildImageUrl = (item: any) => {
    if (!item) return '';
    const itemId = item.id || item._id;
    const driveId = item.image?.driveFileId || item.driveFileId;
    if (driveId) {
      return `/api/v1/gallery/${itemId}/image?v=${driveId}`;
    }
    if (item.imageUrl && !item.imageUrl.startsWith('blob:')) {
      return item.imageUrl;
    }
    return `/api/v1/gallery/${itemId}/image`;
  };

  // Filtered & Sorted items computation
  const filteredItems = rawItems.filter((item: any) => {
    const itemId = item.id || item._id;
    if (!isAuthorized && item.status !== 'PUBLISHED') return false;

    if (categoryFilter !== 'All' && item.category !== categoryFilter) return false;
    if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
    if (featuredFilter === 'FEATURED_ONLY' && !item.isFeatured) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = (item.title || '').toLowerCase().includes(q);
      const matchDesc = (item.description || '').toLowerCase().includes(q);
      const matchUploader = (item.uploader || '').toLowerCase().includes(q);
      const matchCategory = (item.category || '').toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchUploader && !matchCategory) return false;
    }

    return true;
  }).sort((a: any, b: any) => {
    if (sortBy === 'displayOrder') {
      return (a.displayOrder || 0) - (b.displayOrder || 0);
    }
    if (sortBy === 'date') {
      return new Date(b.uploadDate || b.createdAt || 0).getTime() - new Date(a.uploadDate || a.createdAt || 0).getTime();
    }
    if (sortBy === 'title') {
      return (a.title || '').localeCompare(b.title || '');
    }
    return 0;
  });

  // Statistics
  const totalPhotosCount = rawItems.length;
  const publishedCount = rawItems.filter((i) => i.status === 'PUBLISHED').length;
  const featuredCount = rawItems.filter((i) => i.isFeatured).length;
  const missingImagesCount = rawItems.filter((i) => {
    const driveId = i.image?.driveFileId || i.driveFileId;
    const itemId = i.id || i._id;
    return !driveId || brokenImageMap[itemId];
  }).length;

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const paginatedItems = filteredItems.slice((page - 1) * pageSize, page * pageSize);

  // Checkbox handlers
  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedItems.map((i) => i.id || i._id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Upload Photo File Handler
  const handleUploadFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      toast.error('Image file size exceeds 15MB limit.');
      return;
    }
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image format (JPEG, PNG, WEBP).');
      return;
    }

    setUploadFile(file);
    const url = URL.createObjectURL(file);
    setUploadPreviewUrl(url);

    if (!uploadFormData.title) {
      const autoTitle = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());
      setUploadFormData((prev) => ({ ...prev, title: autoTitle }));
    }
  };

  // Submit New Upload
  const handleCreateUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthorized) {
      toast.error('Permission denied: Authorized administrator login required.');
      return;
    }
    if (!uploadFile) {
      toast.error('Please select an image file to upload.');
      return;
    }
    if (!uploadFormData.title.trim()) {
      toast.error('Please enter a photo title.');
      return;
    }

    setIsSubmitting(true);
    const loadingToastId = toast.loading('Uploading gallery photo to Google Drive...');

    try {
      const res = await galleryApi.uploadGalleryImageWithMeta(uploadFile, {
        title: uploadFormData.title,
        description: uploadFormData.description,
        category: uploadFormData.category,
        status: uploadFormData.status,
        displayOrder: Number(uploadFormData.displayOrder),
        isFeatured: uploadFormData.isFeatured,
        uploader: getUploaderInfo(),
      });

      if (res && res.success) {
        toast.success('Gallery photo uploaded & saved to Google Drive!', { id: loadingToastId });
        setIsUploadModalOpen(false);
        setUploadFile(null);
        if (uploadPreviewUrl) URL.revokeObjectURL(uploadPreviewUrl);
        setUploadPreviewUrl(null);
        setUploadFormData({
          title: '',
          description: '',
          category: 'Hospital & OPD',
          displayOrder: rawItems.length + 1,
          isFeatured: false,
          status: 'PUBLISHED',
        });
        await fetchBackendData();
      } else {
        toast.error(res?.message || 'Failed to upload photo to Google Drive.', { id: loadingToastId });
      }
    } catch (err: any) {
      console.error('[Gallery Upload Error]:', err);
      toast.error(`Photo upload failed: ${err?.response?.data?.message || err?.message || 'Server Error'}`, { id: loadingToastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Edit Modal
  const handleOpenEditModal = (item: any) => {
    setEditingItem({ ...item });
    setEditFile(null);
    setEditPreviewUrl(null);
    setIsEditModalOpen(true);
  };

  // Open Replace Photo Modal
  const handleOpenReplaceModal = (item: any) => {
    setEditingItem({ ...item });
    setEditFile(null);
    setEditPreviewUrl(null);
    setIsEditModalOpen(true);
  };

  // Quick Toggle Publish Status
  const handleTogglePublish = async (item: any) => {
    const itemId = item.id || item._id;
    const newStatus = item.status === 'PUBLISHED' ? 'HIDDEN' : 'PUBLISHED';
    const loadingToastId = toast.loading(`${newStatus === 'PUBLISHED' ? 'Publishing' : 'Hiding'} photo...`);
    try {
      const res = await galleryApi.updateGalleryItem(itemId, { status: newStatus } as any);
      if (res && res.success) {
        toast.success(`Photo ${newStatus === 'PUBLISHED' ? 'published' : 'hidden'} successfully!`, { id: loadingToastId });
        await fetchBackendData();
      } else {
        toast.error(res?.message || 'Status update failed.', { id: loadingToastId });
      }
    } catch (err: any) {
      toast.error(`Status change error: ${err?.message || 'Server error'}`, { id: loadingToastId });
    }
  };

  // Quick Toggle Featured Status
  const handleToggleFeatured = async (item: any) => {
    const itemId = item.id || item._id;
    const newFeatured = !item.isFeatured;
    const loadingToastId = toast.loading(`${newFeatured ? 'Setting' : 'Removing'} featured status...`);
    try {
      const res = await galleryApi.updateGalleryItem(itemId, { isFeatured: newFeatured } as any);
      if (res && res.success) {
        toast.success(`Photo ${newFeatured ? 'marked as Featured' : 'unfeatured'}!`, { id: loadingToastId });
        await fetchBackendData();
      } else {
        toast.error(res?.message || 'Featured update failed.', { id: loadingToastId });
      }
    } catch (err: any) {
      toast.error(`Featured update error: ${err?.message || 'Server error'}`, { id: loadingToastId });
    }
  };

  // Submit Edit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    const itemId = editingItem.id || editingItem._id;

    setIsSubmitting(true);
    const loadingToastId = toast.loading('Saving gallery item metadata...');

    try {
      if (editFile) {
        // Upload replacement photo
        const res = await galleryApi.uploadGalleryImageWithMeta(editFile, {
          title: editingItem.title,
          description: editingItem.description,
          category: editingItem.category,
          status: editingItem.status,
          displayOrder: Number(editingItem.displayOrder),
          isFeatured: Boolean(editingItem.isFeatured),
          uploader: getUploaderInfo(),
        });
        if (res && res.success) {
          toast.success('Gallery image replaced & updated on Google Drive!', { id: loadingToastId });
          setIsEditModalOpen(false);
          await fetchBackendData();
        } else {
          toast.error(res?.message || 'Failed to replace image.', { id: loadingToastId });
        }
      } else {
        // Update metadata
        const res = await galleryApi.updateGalleryItem(itemId, {
          title: editingItem.title,
          description: editingItem.description,
          category: editingItem.category,
          status: editingItem.status,
          displayOrder: Number(editingItem.displayOrder),
          isFeatured: Boolean(editingItem.isFeatured),
          uploader: getUploaderInfo(),
        } as any);

        if (res && res.success) {
          toast.success('Gallery item updated successfully!', { id: loadingToastId });
          setIsEditModalOpen(false);
          await fetchBackendData();
        } else {
          toast.error(res?.message || 'Failed to update gallery item metadata.', { id: loadingToastId });
        }
      }
    } catch (err: any) {
      console.error('[Gallery Edit Error]:', err);
      toast.error(`Update failed: ${err?.response?.data?.message || err?.message || 'Server error'}`, { id: loadingToastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Action
  const handleConfirmDelete = async () => {
    if (!deleteConfirmTarget) return;

    setIsSubmitting(true);
    const loadingToastId = toast.loading('Deleting gallery item from Google Drive & MongoDB...');

    try {
      if (deleteConfirmTarget.bulk) {
        const res = await galleryApi.bulkDeleteGalleryItems(selectedIds);
        if (res && res.success) {
          toast.success(`Successfully deleted ${selectedIds.length} gallery item(s)!`, { id: loadingToastId });
          setSelectedIds([]);
          setDeleteConfirmTarget(null);
          await fetchBackendData();
        } else {
          toast.error(res?.message || 'Bulk deletion failed.', { id: loadingToastId });
        }
      } else if (deleteConfirmTarget.id) {
        const res = await galleryApi.deleteGalleryItem(deleteConfirmTarget.id);
        if (res && res.success) {
          toast.success('Gallery photo deleted permanently from Google Drive & MongoDB!', { id: loadingToastId });
          setDeleteConfirmTarget(null);
          await fetchBackendData();
        } else {
          toast.error(res?.message || 'Deletion failed.', { id: loadingToastId });
        }
      }
    } catch (err: any) {
      console.error('[Gallery Delete Error]:', err);
      toast.error(`Deletion failed: ${err?.response?.data?.message || err?.message || 'Server error'}`, { id: loadingToastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Bulk Status Change
  const handleBulkStatusChange = async (status: 'PUBLISHED' | 'HIDDEN') => {
    if (selectedIds.length === 0) return;
    const loadingToastId = toast.loading(`Updating status for ${selectedIds.length} item(s)...`);
    try {
      const res = await galleryApi.bulkUpdateStatus(selectedIds, status);
      if (res && res.success) {
        toast.success(`Status updated to ${status}!`, { id: loadingToastId });
        setSelectedIds([]);
        await fetchBackendData();
      } else {
        toast.error('Bulk status update failed.', { id: loadingToastId });
      }
    } catch (err: any) {
      toast.error(`Bulk status update error: ${err?.message || err}`, { id: loadingToastId });
    }
  };

  // Bulk Category Update
  const handleBulkCategoryChange = async () => {
    if (selectedIds.length === 0) return;
    const loadingToastId = toast.loading(`Updating category to ${bulkCategory}...`);
    try {
      const res = await galleryApi.bulkUpdateCategory(selectedIds, bulkCategory);
      if (res && res.success) {
        toast.success(`Category updated for ${selectedIds.length} item(s)!`, { id: loadingToastId });
        setSelectedIds([]);
        await fetchBackendData();
      } else {
        toast.error('Bulk category update failed.', { id: loadingToastId });
      }
    } catch (err: any) {
      toast.error(`Bulk category update error: ${err?.message || err}`, { id: loadingToastId });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2.5 bg-emerald-50 dark:bg-emerald-950/80 text-[#00A651] rounded-2xl">
              <ImageIcon className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              CMS Gallery Management
            </h2>
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-extrabold text-2xs rounded-full flex items-center gap-1">
              <HardDrive className="w-3 h-3 text-emerald-600" />
              Google Drive Cloud Storage
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage high-resolution campus photographs, Google Drive binary sync, metadata & live public visibility.
          </p>
        </div>

        {isAuthorized ? (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setUploadFile(null);
                setUploadPreviewUrl(null);
                setUploadFormData({
                  title: '',
                  description: '',
                  category: 'Hospital & OPD',
                  displayOrder: rawItems.length + 1,
                  isFeatured: false,
                  status: 'PUBLISHED',
                });
                setIsUploadModalOpen(true);
              }}
              className="px-4 py-2.5 bg-[#00A651] hover:bg-emerald-600 text-white font-bold text-xs rounded-2xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              Upload New Photo
            </button>
            <button
              onClick={fetchBackendData}
              disabled={isLoadingData}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-2xl transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Refresh from MongoDB & Google Drive"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingData ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        ) : (
          <div className="px-3 py-1.5 bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 rounded-xl text-2xs font-extrabold flex items-center gap-1">
            <ShieldAlert className="w-4 h-4" />
            View Only Mode (Read Access)
          </div>
        )}
      </div>

      {/* TOP STATISTICS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/80 text-blue-600 rounded-2xl shrink-0">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xs font-bold uppercase text-slate-400">Total Photos</p>
            <h4 className="text-lg font-black text-slate-900 dark:text-white">{totalPhotosCount}</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 rounded-2xl shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xs font-bold uppercase text-slate-400">Published</p>
            <h4 className="text-lg font-black text-slate-900 dark:text-white">{publishedCount}</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/80 text-amber-600 rounded-2xl shrink-0">
            <Star className="w-6 h-6 fill-amber-500" />
          </div>
          <div>
            <p className="text-2xs font-bold uppercase text-slate-400">Featured</p>
            <h4 className="text-lg font-black text-slate-900 dark:text-white">{featuredCount}</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className={`p-3 rounded-2xl shrink-0 ${missingImagesCount > 0 ? 'bg-rose-50 dark:bg-rose-950/80 text-rose-600' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xs font-bold uppercase text-slate-400">Missing Images</p>
            <h4 className={`text-lg font-black ${missingImagesCount > 0 ? 'text-rose-600' : 'text-slate-900 dark:text-white'}`}>{missingImagesCount}</h4>
          </div>
        </div>
      </div>

      {/* FILTER & TOOLBAR BAR */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, description, uploader..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#00A651]"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="HIDDEN">Hidden</option>
            </select>
          </div>

          {/* Featured Filter */}
          <div>
            <select
              value={featuredFilter}
              onChange={(e) => {
                setFeaturedFilter(e.target.value as any);
                setPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold focus:outline-none"
            >
              <option value="ALL">All Featured Types</option>
              <option value="FEATURED_ONLY">Featured Only</option>
            </select>
          </div>
        </div>

        {/* Toolbar Footer: Sort & View Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="text-2xs font-bold text-slate-400">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg text-2xs font-bold"
              >
                <option value="displayOrder">Display Order (Asc)</option>
                <option value="date">Newest First</option>
                <option value="title">Title (A-Z)</option>
              </select>
            </div>

            <span className="text-2xs text-slate-400">
              Showing <strong className="text-slate-900 dark:text-white font-bold">{filteredItems.length}</strong> of {totalPhotosCount} photos
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-2.5 py-1 rounded-lg text-2xs font-extrabold flex items-center gap-1 cursor-pointer transition ${
                viewMode === 'cards' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Cards
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 rounded-lg text-2xs font-extrabold flex items-center gap-1 cursor-pointer transition ${
                viewMode === 'table' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" /> Table
            </button>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {isAuthorized && selectedIds.length > 0 && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-emerald-50/70 dark:bg-emerald-950/30 p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-800">
            <span className="text-xs font-black text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-600" />
              {selectedIds.length} gallery item(s) selected
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleBulkStatusChange('PUBLISHED')}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-2xs rounded-xl cursor-pointer transition shadow-xs"
              >
                Set Published
              </button>
              <button
                onClick={() => handleBulkStatusChange('HIDDEN')}
                className="px-3.5 py-1.5 bg-slate-700 hover:bg-slate-800 text-white font-bold text-2xs rounded-xl cursor-pointer transition shadow-xs"
              >
                Set Hidden
              </button>
              <div className="flex items-center gap-1">
                <select
                  value={bulkCategory}
                  onChange={(e) => setBulkCategory(e.target.value)}
                  className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-300 text-xs font-bold rounded-lg"
                >
                  {categories.filter((c) => c !== 'All').map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <button
                  onClick={handleBulkCategoryChange}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-2xs rounded-xl cursor-pointer transition"
                >
                  Apply Category
                </button>
              </div>
              <button
                onClick={() => setDeleteConfirmTarget({ bulk: true })}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-2xs rounded-xl flex items-center gap-1 cursor-pointer transition shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Selected
              </button>
            </div>
          </div>
        )}
      </div>

      {/* GALLERY DATA DISPLAY */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 space-y-3">
          <ImageIcon className="w-12 h-12 mx-auto text-slate-400" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No gallery photographs match your filter criteria</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search query, category, status, or featured filter.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setCategoryFilter('All');
              setStatusFilter('ALL');
              setFeaturedFilter('ALL');
            }}
            className="px-4 py-2 bg-[#002147] text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === 'cards' ? (
        /* CARDS GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {paginatedItems.map((item: any) => {
            const itemId = item.id || item._id;
            const isSelected = selectedIds.includes(itemId);
            const driveFileId = item.image?.driveFileId || item.driveFileId;
            const imageUrl = buildImageUrl(item);
            const isImageBroken = brokenImageMap[itemId];

            return (
              <Card
                key={itemId}
                className={`p-0 overflow-hidden border transition group relative rounded-3xl flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-500 ring-2 ring-emerald-400/50 bg-emerald-50/20 dark:bg-emerald-950/20'
                    : 'border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md'
                }`}
              >
                <div>
                  {/* Photo Stream Container */}
                  <div className="h-44 overflow-hidden relative cursor-pointer bg-slate-100 dark:bg-slate-800" onClick={() => setPreviewImage(item)}>
                    {!isImageBroken ? (
                      <img
                        src={imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        onError={() => {
                          setBrokenImageMap((prev) => ({ ...prev, [itemId]: true }));
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-amber-50/80 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 space-y-1">
                        <AlertTriangle className="w-6 h-6 text-amber-600" />
                        <span className="text-2xs font-extrabold">Image Unavailable</span>
                        <span className="text-[9px] text-amber-700 dark:text-amber-400">Google Drive file missing</span>
                      </div>
                    )}

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                      {isAuthorized && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSelectOne(itemId);
                          }}
                          className="pointer-events-auto p-1 bg-white/90 dark:bg-slate-900/90 rounded-lg text-slate-800 dark:text-slate-200 shadow-xs cursor-pointer"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400" />
                          )}
                        </button>
                      )}

                      <div className="flex items-center gap-1 ml-auto">
                        {item.isFeatured && (
                          <span className="px-2 py-0.5 text-[9px] font-black uppercase rounded-lg bg-amber-500/90 text-white backdrop-blur-md flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-white" /> Featured
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.5 text-[9px] font-black uppercase rounded-lg backdrop-blur-md ${
                            item.status === 'PUBLISHED'
                              ? 'bg-emerald-600/90 text-white'
                              : 'bg-slate-600/90 text-white'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>

                    <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <span className="p-2.5 bg-white/90 text-slate-900 rounded-full shadow-lg">
                        <Maximize2 className="w-4 h-4" />
                      </span>
                    </div>
                  </div>

                  {/* Card Meta Content */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded truncate max-w-[140px]">
                        {item.category}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">Order: #{item.displayOrder || 1}</span>
                    </div>

                    <h3 className="text-xs font-extrabold text-slate-900 dark:text-white line-clamp-1">{item.title}</h3>
                    <p className="text-2xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {item.description || 'No description provided.'}
                    </p>

                    {/* Google Drive Status Indicator */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px]">
                      {driveFileId && !isImageBroken ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Google Drive: Synced
                        </span>
                      ) : (
                        <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-amber-500" /> Google Drive: File missing
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-4 pt-0 space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>{item.uploadDate ? String(item.uploadDate).split('T')[0] : 'Today'}</span>
                    <span className="font-bold text-slate-500 truncate max-w-[110px]">{item.uploader || 'Admin'}</span>
                  </div>

                  {isAuthorized && (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                      {/* Row 1: Edit & Replace Photo */}
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="px-2 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:hover:bg-blue-900 dark:text-blue-300 font-bold text-2xs rounded-xl flex items-center justify-center gap-1 cursor-pointer transition shadow-2xs"
                          title="Edit photo metadata (title, category, display order...)"
                        >
                          <Edit2 className="w-3 h-3" /> Edit
                        </button>

                        <button
                          onClick={() => handleOpenReplaceModal(item)}
                          className="px-2 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:hover:bg-purple-900 dark:text-purple-300 font-bold text-2xs rounded-xl flex items-center justify-center gap-1 cursor-pointer transition shadow-2xs"
                          title="Replace photo binary on Google Drive"
                        >
                          <Upload className="w-3 h-3" /> Replace
                        </button>
                      </div>

                      {/* Row 2: Quick Toggle Publish & Featured */}
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          onClick={() => handleTogglePublish(item)}
                          className={`px-2 py-1.5 font-bold text-2xs rounded-xl flex items-center justify-center gap-1 cursor-pointer transition shadow-2xs ${
                            item.status === 'PUBLISHED'
                              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                          }`}
                          title={item.status === 'PUBLISHED' ? 'Hide from public gallery' : 'Publish to public gallery'}
                        >
                          {item.status === 'PUBLISHED' ? (
                            <>
                              <EyeOff className="w-3 h-3 text-slate-500" /> Hide
                            </>
                          ) : (
                            <>
                              <Eye className="w-3 h-3 text-emerald-600" /> Publish
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleToggleFeatured(item)}
                          className={`px-2 py-1.5 font-bold text-2xs rounded-xl flex items-center justify-center gap-1 cursor-pointer transition shadow-2xs ${
                            item.isFeatured
                              ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300'
                          }`}
                          title={item.isFeatured ? 'Remove featured status' : 'Mark as Featured'}
                        >
                          <Star className={`w-3 h-3 ${item.isFeatured ? 'fill-amber-500 text-amber-500' : 'text-amber-500'}`} />
                          {item.isFeatured ? 'Unfeature' : 'Featured'}
                        </button>
                      </div>

                      {/* Row 3: Permanent Delete */}
                      <button
                        onClick={() => setDeleteConfirmTarget({ id: itemId })}
                        className="w-full py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:hover:bg-rose-900 dark:text-rose-300 font-extrabold text-2xs rounded-xl flex items-center justify-center gap-1 cursor-pointer transition shadow-2xs"
                      >
                        <Trash2 className="w-3 h-3" /> Delete Photo
                      </button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#002147] text-white font-extrabold border-b border-slate-800">
                  {isAuthorized && (
                    <th className="p-3.5 text-center w-10">
                      <button onClick={toggleSelectAll} className="text-slate-300 hover:text-white cursor-pointer">
                        {selectedIds.length > 0 && selectedIds.length === paginatedItems.length ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </th>
                  )}
                  <th className="p-3.5 w-16">Preview</th>
                  <th className="p-3.5">Title & Description</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Display Order</th>
                  <th className="p-3.5">Google Drive Status</th>
                  <th className="p-3.5">Featured</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedItems.map((item: any) => {
                  const itemId = item.id || item._id;
                  const isSelected = selectedIds.includes(itemId);
                  const driveFileId = item.image?.driveFileId || item.driveFileId;
                  const imageUrl = buildImageUrl(item);
                  const isImageBroken = brokenImageMap[itemId];

                  return (
                    <tr
                      key={itemId}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition ${
                        isSelected ? 'bg-emerald-50/40 dark:bg-emerald-950/20' : ''
                      }`}
                    >
                      {isAuthorized && (
                        <td className="p-3.5 text-center">
                          <button onClick={() => toggleSelectOne(itemId)} className="text-slate-400 cursor-pointer">
                            {isSelected ? <CheckSquare className="w-4 h-4 text-emerald-600" /> : <Square className="w-4 h-4" />}
                          </button>
                        </td>
                      )}

                      <td className="p-3.5">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer" onClick={() => setPreviewImage(item)}>
                          {!isImageBroken ? (
                            <img
                              src={imageUrl}
                              alt={item.title}
                              className="w-full h-full object-cover"
                              onError={() => setBrokenImageMap((prev) => ({ ...prev, [itemId]: true }))}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-amber-50 text-amber-600">
                              <AlertTriangle className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="p-3.5">
                        <h4 className="font-extrabold text-slate-900 dark:text-white">{item.title}</h4>
                        <p className="text-2xs text-slate-500 dark:text-slate-400 line-clamp-1">{item.description || 'No description'}</p>
                      </td>

                      <td className="p-3.5">
                        <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold text-[10px] rounded-lg">
                          {item.category}
                        </span>
                      </td>

                      <td className="p-3.5 font-bold font-mono text-slate-700 dark:text-slate-300">
                        #{item.displayOrder || 1}
                      </td>

                      <td className="p-3.5 text-2xs font-bold">
                        {driveFileId && !isImageBroken ? (
                          <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Synced
                          </span>
                        ) : (
                          <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Missing
                          </span>
                        )}
                      </td>

                      <td className="p-3.5">
                        {item.isFeatured ? (
                          <span className="px-2 py-0.5 text-[9px] font-black uppercase rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            Featured
                          </span>
                        ) : (
                          <span className="text-slate-400 text-2xs">—</span>
                        )}
                      </td>

                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-0.5 text-[10px] font-black rounded-full ${
                            item.status === 'PUBLISHED'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setPreviewImage(item)}
                            className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition"
                            title="Preview Image"
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                          </button>
                          {isAuthorized && (
                            <>
                              <button
                                onClick={() => handleOpenEditModal(item)}
                                className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60 rounded-lg cursor-pointer transition"
                                title="Edit Metadata"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleOpenReplaceModal(item)}
                                className="p-1.5 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/60 rounded-lg cursor-pointer transition"
                                title="Replace Photo Binary on Google Drive"
                              >
                                <Upload className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleTogglePublish(item)}
                                className={`p-1.5 rounded-lg cursor-pointer transition ${
                                  item.status === 'PUBLISHED'
                                    ? 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                                    : 'text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/60'
                                }`}
                                title={item.status === 'PUBLISHED' ? 'Hide Photo' : 'Publish Photo'}
                              >
                                {item.status === 'PUBLISHED' ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>

                              <button
                                onClick={() => handleToggleFeatured(item)}
                                className={`p-1.5 rounded-lg cursor-pointer transition ${
                                  item.isFeatured
                                    ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/60'
                                    : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                                title={item.isFeatured ? 'Unfeature Photo' : 'Mark Featured'}
                              >
                                <Star className={`w-3.5 h-3.5 ${item.isFeatured ? 'fill-amber-500' : ''}`} />
                              </button>

                              <button
                                onClick={() => setDeleteConfirmTarget({ id: itemId })}
                                className="p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg cursor-pointer transition"
                                title="Delete Photo Permanently"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 gap-3 text-xs text-slate-500">
          <div>
            Showing Page <strong className="text-slate-900 dark:text-white">{page}</strong> of{' '}
            <strong className="text-slate-900 dark:text-white">{totalPages}</strong> ({filteredItems.length} photos)
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* MODAL 1: UPLOAD NEW PHOTO */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full my-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Upload className="w-5 h-5 text-emerald-600" /> Upload Photo to Google Drive
                </h3>
                <p className="text-2xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Permanent Google Drive Cloud Storage & MongoDB Metadata Integration
                </p>
              </div>
              <button onClick={() => setIsUploadModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUpload} className="space-y-4 text-xs">
              {/* Photo File Selector */}
              <div>
                <label className="block text-2xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Select Image File (Max 15MB) *
                </label>
                <label className="w-full p-4 border-2 border-dashed border-emerald-300 dark:border-emerald-800 hover:border-emerald-500 rounded-2xl flex flex-col items-center justify-center gap-2 bg-emerald-50/50 dark:bg-emerald-950/20 cursor-pointer transition">
                  <Upload className="w-6 h-6 text-emerald-600" />
                  <span className="text-xs font-extrabold text-emerald-900 dark:text-emerald-200">
                    {uploadFile ? uploadFile.name : 'Click to choose image file'}
                  </span>
                  <span className="text-[10px] text-slate-400">JPEG, PNG, WEBP supported</span>
                  <input type="file" accept="image/*" onChange={handleUploadFileChange} className="hidden" />
                </label>
              </div>

              {uploadPreviewUrl && (
                <div className="h-36 w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
                  <img src={uploadPreviewUrl} alt="Upload Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div>
                <label className="block text-2xs font-bold text-slate-700 dark:text-slate-300 mb-1">Photo Title *</label>
                <input
                  type="text"
                  placeholder="e.g. OPD Reception & Patient Waiting Hall"
                  value={uploadFormData.title}
                  onChange={(e) => setUploadFormData({ ...uploadFormData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={uploadFormData.category}
                    onChange={(e) => setUploadFormData({ ...uploadFormData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  >
                    {categories.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-700 dark:text-slate-300 mb-1">Display Order</label>
                  <input
                    type="number"
                    min={1}
                    value={uploadFormData.displayOrder}
                    onChange={(e) => setUploadFormData({ ...uploadFormData, displayOrder: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Detailed description of the photograph..."
                  value={uploadFormData.description}
                  onChange={(e) => setUploadFormData({ ...uploadFormData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={uploadFormData.isFeatured}
                    onChange={(e) => setUploadFormData({ ...uploadFormData, isFeatured: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  Featured Photograph
                </label>

                <div className="flex items-center gap-2">
                  <span className="text-2xs font-bold text-slate-400">Visibility:</span>
                  <select
                    value={uploadFormData.status}
                    onChange={(e) => setUploadFormData({ ...uploadFormData, status: e.target.value as any })}
                    className="px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-2xs font-bold"
                  >
                    <option value="PUBLISHED">Published</option>
                    <option value="HIDDEN">Hidden</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#00A651] hover:bg-emerald-600 text-white text-xs font-extrabold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  Upload to Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT METADATA & REPLACE IMAGE */}
      {isEditModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full my-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-600" /> Edit Gallery Photo
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-2xs font-bold text-slate-700 dark:text-slate-300 mb-1">Title *</label>
                <input
                  type="text"
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={editingItem.category || 'Hospital & OPD'}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  >
                    {categories.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-700 dark:text-slate-300 mb-1">Display Order</label>
                  <input
                    type="number"
                    min={1}
                    value={editingItem.displayOrder || 1}
                    onChange={(e) => setEditingItem({ ...editingItem, displayOrder: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-700 dark:text-slate-300 mb-1">Replace Image File (Optional)</label>
                <label className="w-full px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl cursor-pointer flex items-center justify-center gap-2 transition">
                  <Upload className="w-4 h-4 text-blue-600" />
                  {editFile ? editFile.name : 'Choose new photo to replace'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setEditFile(file);
                        setEditPreviewUrl(URL.createObjectURL(file));
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>

              {(editPreviewUrl || buildImageUrl(editingItem)) && (
                <div className="h-32 w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
                  <img src={editPreviewUrl || buildImageUrl(editingItem)} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={Boolean(editingItem.isFeatured)}
                    onChange={(e) => setEditingItem({ ...editingItem, isFeatured: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  Featured Photograph
                </label>

                <div className="flex items-center gap-2">
                  <span className="text-2xs font-bold text-slate-400">Status:</span>
                  <select
                    value={editingItem.status || 'PUBLISHED'}
                    onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                    className="px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-2xs font-bold"
                  >
                    <option value="PUBLISHED">Published</option>
                    <option value="HIDDEN">Hidden</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Save Metadata Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: LIGHTBOX PREVIEW */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl max-w-3xl w-full relative">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 z-10 p-2 text-white bg-slate-900/70 hover:bg-slate-900 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="h-96 w-full overflow-hidden bg-slate-950">
              <img src={buildImageUrl(previewImage)} alt={previewImage.title} className="w-full h-full object-contain" />
            </div>
            <div className="p-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xs font-black uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded">
                  {previewImage.category}
                </span>
                <span className="text-xs font-mono text-slate-400">Order: #{previewImage.displayOrder || 1}</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">{previewImage.title}</h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{previewImage.description || 'No description provided.'}</p>
              <div className="pt-2 text-2xs text-slate-400 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                <span>Uploaded: {previewImage.uploadDate ? String(previewImage.uploadDate).split('T')[0] : 'Recent'}</span>
                <span>By: {previewImage.uploader || 'Admin'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: DELETE CONFIRMATION DIALOG */}
      {deleteConfirmTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <Trash2 className="w-6 h-6" />
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Confirm Deletion</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {deleteConfirmTarget.bulk
                ? `Are you sure you want to permanently delete ${selectedIds.length} selected gallery photograph(s)? This will delete the binary file from Google Drive and remove the metadata record from MongoDB.`
                : 'Are you sure you want to permanently delete this gallery photograph? This will delete the binary file from Google Drive and remove the metadata record from MongoDB.'}
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmTarget(null)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isSubmitting}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
