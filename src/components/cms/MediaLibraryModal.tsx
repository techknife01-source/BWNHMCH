import React, { useState } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  FileText,
  Search,
  Check,
  Trash2,
  ExternalLink,
  Copy,
  Plus,
} from 'lucide-react';

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  fileType: 'IMAGE' | 'PDF' | 'DOCUMENT' | 'VIDEO';
  fileSize: string;
  uploadedAt: string;
}

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMedia: (mediaUrl: string) => void;
  acceptedType?: 'ALL' | 'IMAGE' | 'PDF';
}

const DEFAULT_MEDIA: MediaItem[] = [
  {
    id: '1',
    name: 'campus-building-front.jpg',
    url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800',
    fileType: 'IMAGE',
    fileSize: '1.2 MB',
    uploadedAt: '2026-07-20',
  },
  {
    id: '2',
    name: 'principal-desk-official.jpg',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
    fileType: 'IMAGE',
    fileSize: '850 KB',
    uploadedAt: '2026-07-18',
  },
  {
    id: '3',
    name: 'bhms-prospectus-2026-27.pdf',
    url: '/downloads/bhms-prospectus-2026.pdf',
    fileType: 'PDF',
    fileSize: '3.4 MB',
    uploadedAt: '2026-07-15',
  },
  {
    id: '4',
    name: 'homoeopathic-herb-garden.jpg',
    url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800',
    fileType: 'IMAGE',
    fileSize: '1.8 MB',
    uploadedAt: '2026-07-10',
  },
  {
    id: '5',
    name: 'opd-schedule-notice.pdf',
    url: '/downloads/opd-schedule.pdf',
    fileType: 'PDF',
    fileSize: '450 KB',
    uploadedAt: '2026-07-05',
  },
];

export const MediaLibraryModal: React.FC<MediaLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectMedia,
  acceptedType = 'ALL',
}) => {
  const [mediaList, setMediaList] = useState<MediaItem[]>(DEFAULT_MEDIA);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'IMAGE' | 'PDF'>('ALL');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [uploadName, setUploadName] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filtered = mediaList.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesTab =
      activeTab === 'ALL' ||
      (activeTab === 'IMAGE' && item.fileType === 'IMAGE') ||
      (activeTab === 'PDF' && item.fileType === 'PDF');
    const matchesAccepted =
      acceptedType === 'ALL' ||
      (acceptedType === 'IMAGE' && item.fileType === 'IMAGE') ||
      (acceptedType === 'PDF' && item.fileType === 'PDF');
    return matchesSearch && matchesTab && matchesAccepted;
  });

  const handleSimulatedUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadUrl) return;

    const newItem: MediaItem = {
      id: Date.now().toString(),
      name: uploadName || `media-${Date.now()}.${uploadUrl.endsWith('.pdf') ? 'pdf' : 'jpg'}`,
      url: uploadUrl,
      fileType: uploadUrl.endsWith('.pdf') ? 'PDF' : 'IMAGE',
      fileSize: '1.1 MB',
      uploadedAt: new Date().toISOString().split('T')[0],
    };

    setMediaList([newItem, ...mediaList]);
    setUploadName('');
    setUploadUrl('');
    setIsUploading(false);
  };

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this media asset from repository?')) {
      setMediaList(mediaList.filter((m) => m.id !== id));
      if (selectedId === id) setSelectedId(null);
    }
  };

  const selectedItem = mediaList.find((m) => m.id === selectedId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#002147] dark:text-blue-400" />
              <span>Media & Asset Repository</span>
            </h3>
            <p className="text-3xs text-slate-400 mt-0.5">
              Select or upload images, logos, banners, and downloadable PDF documents.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-1.5">
            {(['ALL', 'IMAGE', 'PDF'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-xl text-3xs font-black uppercase tracking-wider transition cursor-pointer ${
                  activeTab === tab
                    ? 'bg-[#002147] text-white dark:bg-[#00A651]'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {tab}s
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-1 sm:flex-initial">
            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search media files..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-2xs focus:outline-none focus:ring-1 focus:ring-[#002147]"
              />
            </div>

            <button
              onClick={() => setIsUploading(!isUploading)}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-3xs uppercase tracking-wider rounded-xl transition flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add URL / Upload</span>
            </button>
          </div>
        </div>

        {/* Upload Drawer Form */}
        {isUploading && (
          <form
            onSubmit={handleSimulatedUpload}
            className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border-b border-emerald-100 dark:border-emerald-900/30 space-y-3 text-2xs animate-fadeIn"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Asset Title / File Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. college-entrance.jpg"
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Image or PDF Direct Web URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/... or /downloads/file.pdf"
                  value={uploadUrl}
                  onChange={(e) => setUploadUrl(e.target.value)}
                  className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsUploading(false)}
                className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700"
              >
                Save Asset to Repository
              </button>
            </div>
          </form>
        )}

        {/* Media Grid */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Upload className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-xs font-bold">No matching media files found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filtered.map((item) => {
                const isSelected = selectedId === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={`group relative rounded-2xl border overflow-hidden transition cursor-pointer flex flex-col ${
                      isSelected
                        ? 'border-[#002147] dark:border-[#00A651] ring-2 ring-[#002147] dark:ring-[#00A651] bg-blue-50/20 dark:bg-emerald-950/20'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 hover:border-slate-300'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="h-28 w-full bg-slate-200 dark:bg-slate-800 relative overflow-hidden flex items-center justify-center">
                      {item.fileType === 'IMAGE' ? (
                        <img
                          src={item.url}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-rose-600 dark:text-rose-400">
                          <FileText className="w-8 h-8" />
                          <span className="text-[10px] font-black uppercase">PDF Document</span>
                        </div>
                      )}

                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#002147] dark:bg-[#00A651] text-white flex items-center justify-center shadow-md">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="p-2.5 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-2xs font-bold text-slate-800 dark:text-slate-200 truncate">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {item.fileType} • {item.fileSize}
                        </p>
                      </div>

                      <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(item.url, item.id);
                          }}
                          className="text-[10px] text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedId === item.id ? 'Copied' : 'Copy URL'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleDelete(item.id, e)}
                          className="text-rose-500 hover:text-rose-700 p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/30"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
          <div className="text-xs text-slate-500">
            {selectedItem ? (
              <span className="font-bold text-slate-800 dark:text-slate-200">
                Selected: {selectedItem.name}
              </span>
            ) : (
              <span>Select an asset to use in your form</span>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              disabled={!selectedItem}
              onClick={() => {
                if (selectedItem) {
                  onSelectMedia(selectedItem.url);
                  onClose();
                }
              }}
              className="px-5 py-2 bg-[#002147] hover:bg-[#001833] dark:bg-[#00A651] dark:hover:bg-[#008d44] text-white font-bold text-xs rounded-xl transition cursor-pointer disabled:opacity-50"
            >
              Use Selected Media Asset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
