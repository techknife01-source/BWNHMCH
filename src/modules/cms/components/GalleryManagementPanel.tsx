import React, { useState, useEffect } from 'react';
import { galleryService, GalleryItem } from '../../../services/galleryService';
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
} from 'lucide-react';
import toast from 'react-hot-toast';

export const GalleryManagementPanel: React.FC = () => {
  const { user } = useAuth();
  const isAuthorized = canManageGallery(user);

  // Filter & Search states
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'displayOrder' | 'date' | 'title'>('displayOrder');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const [galleryData, setGalleryData] = useState(() =>
    galleryService.getItems({
      search,
      category: categoryFilter,
      status: statusFilter,
      sortBy,
      page,
      pageSize,
      role: isAuthorized ? 'SUPER_ADMIN' : 'STUDENT',
    })
  );

  // Selection states
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkCategory, setBulkCategory] = useState('Hospital & OPD');

  // Modals & Form states
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<GalleryItem | null>(null);
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<{ id?: string; bulk?: boolean } | null>(null);

  // Editing state
  const [currentItem, setCurrentItem] = useState<Partial<GalleryItem>>({
    title: '',
    description: '',
    category: 'Hospital & OPD',
    imageUrl: '',
    status: 'PUBLISHED',
  });

  // Multiple upload state
  const [batchUploadItems, setBatchUploadItems] = useState<
    Array<{ title: string; description: string; category: string; imageUrl: string }>
  >([{ title: '', description: '', category: 'Hospital & OPD', imageUrl: '' }]);

  const loadData = () => {
    const res = galleryService.getItems({
      search,
      category: categoryFilter,
      status: statusFilter,
      sortBy,
      page,
      pageSize,
      role: isAuthorized ? 'SUPER_ADMIN' : 'STUDENT',
    });
    setGalleryData(res);
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('bhmch_gallery_updated', handleUpdate);
    return () => window.removeEventListener('bhmch_gallery_updated', handleUpdate);
  }, [search, categoryFilter, statusFilter, sortBy, page, pageSize, isAuthorized]);

  const categories = ['All', 'Hospital & OPD', 'Labs & Classrooms', 'Events & Seminars', 'Herbal Garden'];

  // Checkbox handlers
  const toggleSelectAll = () => {
    if (selectedIds.length === galleryData.data.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(galleryData.data.map((i) => i.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const getUploaderInfo = () => {
    const name = user?.fullName || user?.username || 'Authorized Admin';
    const des = getUserDisplayDesignation(user);
    return `${name} (${des})`;
  };

  // Image Upload File Converter with Validation & Multi-File Support
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files) as File[];
    const validFiles: File[] = [];

    // Validate size and format
    fileList.forEach((file: File) => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`File "${file.name}" exceeds 10MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB). Please select a smaller photo.`);
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error(`File "${file.name}" is not a valid image format. Please select JPEG, PNG, WEBP, GIF, or SVG.`);
        return;
      }
      validFiles.push(file);
    });

    if (validFiles.length === 0) {
      e.target.value = '';
      return;
    }

    let processed = 0;
    const newItems: Array<{ title: string; description: string; category: string; imageUrl: string }> = [];

    validFiles.forEach((file: File) => {
      const reader = new FileReader();
      reader.onerror = () => {
        toast.error(`Failed to read file "${file.name}". Storage or filesystem error.`);
      };

      reader.onload = (event) => {
        const url = event.target?.result as string;
        const autoTitle = file.name
          .replace(/\.[^/.]+$/, '')
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, (l) => l.toUpperCase());

        if (typeof index === 'number') {
          // Specific slot replace/upload
          setBatchUploadItems((prev) => {
            const list = [...prev];
            if (list[index]) {
              list[index] = {
                ...list[index],
                imageUrl: url,
                title: list[index].title || autoTitle,
              };
            }
            return list;
          });
        } else if (validFiles.length === 1 && !isUploadModalOpen) {
          // Single Edit Modal
          setCurrentItem((prev) => ({
            ...prev,
            imageUrl: url,
            title: prev.title || autoTitle,
          }));
        } else {
          // Batch upload multiple photos
          newItems.push({
            title: autoTitle,
            description: 'BURDWAN HOMOEOPATHIC MEDICAL COLLEGE & HOSPITAL campus photograph.',
            category: 'Hospital & OPD',
            imageUrl: url,
          });

          processed++;
          if (processed === validFiles.length) {
            setBatchUploadItems((prev) => {
              const existingFilled = prev.filter((i) => i.imageUrl.trim() || i.title.trim());
              return [...existingFilled, ...newItems];
            });
            toast.success(`${newItems.length} photo(s) selected and processed!`);
          }
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  // Handlers
  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthorized) {
      toast.error('Permission denied: Only Super Admin, Admin, Principal, and Vice Principal can manage gallery photos.');
      return;
    }
    if (!currentItem.imageUrl || !currentItem.title) {
      toast.error('Please provide image file/URL and title.');
      return;
    }

    const uploader = getUploaderInfo();

    if (currentItem.id) {
      galleryService.updateItem(currentItem.id, {
        ...currentItem,
        uploader,
      });
    } else {
      galleryService.addMultiple(
        [{ ...currentItem, uploader }],
        uploader
      );
    }
    setIsEditModalOpen(false);
    setCurrentItem({ title: '', description: '', category: 'Hospital & OPD', imageUrl: '', status: 'PUBLISHED' });
    loadData();
  };

  const handleBatchSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthorized) {
      toast.error('Permission denied: Only Super Admin, Admin, Principal, and Vice Principal can upload gallery photos.');
      return;
    }

    const valid = batchUploadItems.filter((i) => i.imageUrl.trim() && i.title.trim());
    if (valid.length === 0) {
      toast.error('Please complete at least one photo with a title and valid image file/URL.');
      return;
    }

    const uploader = getUploaderInfo();
    const itemsToSave = valid.map((i) => ({
      ...i,
      uploader,
      status: 'PUBLISHED' as const,
    }));

    galleryService.addMultiple(itemsToSave, uploader);
    setIsUploadModalOpen(false);
    setBatchUploadItems([{ title: '', description: '', category: 'Hospital & OPD', imageUrl: '' }]);
    loadData();
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmTarget) return;
    if (deleteConfirmTarget.bulk) {
      galleryService.bulkDelete(selectedIds);
      setSelectedIds([]);
    } else if (deleteConfirmTarget.id) {
      galleryService.deleteItem(deleteConfirmTarget.id);
    }
    setDeleteConfirmTarget(null);
    loadData();
  };

  // Export & Import
  const handleExport = () => {
    const jsonStr = galleryService.exportItems(selectedIds.length > 0 ? selectedIds : undefined);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BHMCH_Gallery_Export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    toast.success('Gallery exported successfully!');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      galleryService.importItems(content);
      loadData();
    };
    reader.readAsText(file);
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
              Media & Infrastructure Gallery Management
            </h2>
            <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-extrabold text-2xs rounded-full">
              {galleryData.total} Total Images
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Upload multi-category photos, edit metadata, reorder display sequence & control live visibility.
          </p>
        </div>

        {isAuthorized ? (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setBatchUploadItems([{ title: '', description: '', category: 'Hospital & OPD', imageUrl: '' }]);
                setIsUploadModalOpen(true);
              }}
              className="px-4 py-2.5 bg-[#00A651] hover:bg-emerald-600 text-white font-bold text-xs rounded-2xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              Upload Photos
            </button>
            <button
              onClick={handleExport}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-2xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <label className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-2xl transition flex items-center gap-1.5 cursor-pointer">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              Import
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>
        ) : (
          <div className="px-3 py-1.5 bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 rounded-xl text-2xs font-extrabold flex items-center gap-1">
            <ShieldAlert className="w-4 h-4" />
            View Only Mode (Read Access)
          </div>
        )}
      </div>

      {/* Filter & Bulk Actions Bar */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search images by title, description, uploader..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#00A651]"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none font-bold"
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
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none font-bold"
            >
              <option value="ALL">All Statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="HIDDEN">Hidden</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>
        </div>

        {/* Bulk Action Toolbar */}
        {isAuthorized && selectedIds.length > 0 && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-emerald-50/50 dark:bg-emerald-950/20 p-3 rounded-2xl">
            <span className="text-xs font-black text-emerald-800 dark:text-emerald-300">
              {selectedIds.length} item(s) selected
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  galleryService.bulkPublish(selectedIds);
                  setSelectedIds([]);
                  loadData();
                }}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-2xs rounded-xl transition flex items-center gap-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" /> Publish
              </button>
              <button
                onClick={() => {
                  galleryService.bulkHide(selectedIds);
                  setSelectedIds([]);
                  loadData();
                }}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-800 text-white font-bold text-2xs rounded-xl transition flex items-center gap-1 cursor-pointer"
              >
                <EyeOff className="w-3.5 h-3.5" /> Hide
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
                  onClick={() => {
                    galleryService.bulkCategoryUpdate(selectedIds, bulkCategory);
                    setSelectedIds([]);
                    loadData();
                  }}
                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-2xs rounded-xl transition"
                >
                  Move Category
                </button>
              </div>
              <button
                onClick={() => setDeleteConfirmTarget({ bulk: true })}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-2xs rounded-xl transition flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Selected
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Gallery Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {galleryData.data.map((item) => {
          const isSelected = selectedIds.includes(item.id);
          return (
            <Card
              key={item.id}
              className={`p-0 overflow-hidden border transition group relative rounded-3xl ${
                isSelected
                  ? 'border-emerald-500 ring-2 ring-emerald-400/50 bg-emerald-50/20 dark:bg-emerald-950/20'
                  : 'border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md'
              }`}
            >
              {/* Image Preview Container */}
              <div className="h-44 overflow-hidden relative cursor-pointer" onClick={() => setPreviewImage(item)}>
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />

                {/* Top Badge Overlay */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  {isAuthorized && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelectOne(item.id);
                      }}
                      className="pointer-events-auto p-1 bg-white/90 dark:bg-slate-900/90 rounded-lg text-slate-800 dark:text-slate-200 shadow-xs"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  )}

                  <span
                    className={`px-2 py-0.5 text-[10px] font-black uppercase rounded-lg backdrop-blur-md ${
                      item.status === 'PUBLISHED'
                        ? 'bg-emerald-500/90 text-white'
                        : 'bg-amber-500/90 text-white'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <span className="p-2.5 bg-white/90 text-slate-900 rounded-full shadow-lg">
                    <Maximize2 className="w-4 h-4" />
                  </span>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-4 space-y-2">
                <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                  {item.category}
                </span>

                <h3 className="text-xs font-extrabold text-slate-900 dark:text-white line-clamp-1">{item.title}</h3>
                <p className="text-2xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{item.uploadDate}</span>
                  <span className="font-bold text-slate-500 line-clamp-1 max-w-[120px]">{item.uploader}</span>
                </div>

                {/* Authorized Controls */}
                {isAuthorized && (
                  <div className="pt-2 flex items-center justify-between gap-1 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => galleryService.reorderItem(item.id, 'up')}
                        title="Move Up"
                        className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => galleryService.reorderItem(item.id, 'down')}
                        title="Move Down"
                        className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => galleryService.toggleHide(item.id)}
                        title={item.status === 'PUBLISHED' ? 'Hide image' : 'Publish image'}
                        className="p-1 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-lg cursor-pointer"
                      >
                        {item.status === 'PUBLISHED' ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setCurrentItem(item);
                          setIsEditModalOpen(true);
                        }}
                        className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmTarget({ id: item.id })}
                        className="p-1 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Pagination Footer */}
      {galleryData.totalPages > 1 && (
        <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500">
            Page {galleryData.page} of {galleryData.totalPages} ({galleryData.total} items)
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              disabled={page >= galleryData.totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* MODAL 1: Batch Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full my-8 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Upload className="w-5 h-5 text-emerald-600" /> Upload Campus Gallery Photos
                </h3>
                <p className="text-2xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Authorized Role: Super Admin, Admin, Principal & Vice Principal (Max 10MB per image)
                </p>
              </div>
              <button onClick={() => setIsUploadModalOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                Select one or multiple photos from your device:
              </span>
              <label className="px-3.5 py-1.5 bg-[#00A651] hover:bg-emerald-600 text-white text-xs font-extrabold rounded-xl cursor-pointer transition shadow-xs flex items-center gap-1.5">
                <Upload className="w-4 h-4" /> Select Image File(s)
                <input type="file" accept="image/*" multiple onChange={(e) => handleFileUpload(e)} className="hidden" />
              </label>
            </div>

            <form onSubmit={handleBatchSave} className="space-y-4">
              {batchUploadItems.map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xs font-extrabold uppercase text-slate-400">Photo #{idx + 1}</span>
                    {batchUploadItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setBatchUploadItems(batchUploadItems.filter((_, i) => i !== idx))}
                        className="text-rose-500 hover:text-rose-700 text-2xs font-bold"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Image Title *"
                      value={item.title}
                      onChange={(e) => {
                        const list = [...batchUploadItems];
                        list[idx].title = e.target.value;
                        setBatchUploadItems(list);
                      }}
                      className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                      required
                    />

                    <select
                      value={item.category}
                      onChange={(e) => {
                        const list = [...batchUploadItems];
                        list[idx].category = e.target.value;
                        setBatchUploadItems(list);
                      }}
                      className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                    >
                      {categories.filter((c) => c !== 'All').map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <input
                      type="url"
                      placeholder="Image URL (Unsplash or direct image link)..."
                      value={item.imageUrl}
                      onChange={(e) => {
                        const list = [...batchUploadItems];
                        list[idx].imageUrl = e.target.value;
                        setBatchUploadItems(list);
                      }}
                      className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                    />

                    <label className="px-3 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl cursor-pointer hover:bg-slate-300">
                      Or Choose File
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, idx)} className="hidden" />
                    </label>
                  </div>

                  {item.imageUrl && (
                    <div className="h-28 w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                      <img src={item.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              ))}

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setBatchUploadItems([...batchUploadItems, { title: '', description: '', category: 'Hospital & OPD', imageUrl: '' }])}
                  className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Another Photo
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#00A651] hover:bg-emerald-600 text-white text-xs font-extrabold rounded-xl shadow-md"
                  >
                    Publish Photos
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Single Edit / Replace Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Edit Gallery Photo</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-3 text-xs">
              <div>
                <label className="block text-2xs font-bold text-slate-600 dark:text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  value={currentItem.title || ''}
                  onChange={(e) => setCurrentItem({ ...currentItem, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-600 dark:text-slate-300 mb-1">Category</label>
                <select
                  value={currentItem.category || 'Hospital & OPD'}
                  onChange={(e) => setCurrentItem({ ...currentItem, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                >
                  {categories.filter((c) => c !== 'All').map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-600 dark:text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={currentItem.description || ''}
                  onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-600 dark:text-slate-300 mb-1">Image URL or Replace Image</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={currentItem.imageUrl || ''}
                    onChange={(e) => setCurrentItem({ ...currentItem, imageUrl: e.target.value })}
                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                  <label className="px-3 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl cursor-pointer">
                    Replace
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {currentItem.imageUrl && (
                <div className="h-32 w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                  <img src={currentItem.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#00A651] hover:bg-emerald-600 text-white font-extrabold rounded-xl"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Lightbox Image Preview */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl max-w-3xl w-full relative">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 z-10 p-2 text-white bg-slate-900/70 hover:bg-slate-900 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="h-96 w-full overflow-hidden">
              <img src={previewImage.imageUrl} alt={previewImage.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-6 space-y-2">
              <span className="text-2xs font-black uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded">
                {previewImage.category}
              </span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">{previewImage.title}</h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{previewImage.description}</p>
              <div className="pt-2 text-2xs text-slate-400">Uploaded on {previewImage.uploadDate} by {previewImage.uploader}</div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Delete Confirmation */}
      {deleteConfirmTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <Trash2 className="w-6 h-6" />
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Confirm Deletion</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {deleteConfirmTarget.bulk
                ? `Are you sure you want to permanently delete ${selectedIds.length} selected gallery image(s)?`
                : 'Are you sure you want to delete this gallery photograph?'}
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
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl shadow-md cursor-pointer"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
