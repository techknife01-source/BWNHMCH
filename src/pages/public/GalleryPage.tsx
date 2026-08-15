import React, { useState, useEffect } from 'react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Card } from '../../components/common/Card';
import { Image as ImageIcon, Maximize2, X, AlertTriangle, Loader2 } from 'lucide-react';
import { galleryApi } from '../../services/api/gallery.api';

export const GalleryPage: React.FC = () => {
  const [rawItems, setRawItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeCat, setActiveCat] = useState<string>('All');
  const [selectedImage, setSelectedImage] = useState<any | null>(null);
  const [brokenImageMap, setBrokenImageMap] = useState<Record<string, boolean>>({});

  const fetchPublicGallery = async () => {
    setIsLoading(true);
    console.log('[GALLERY PUBLIC DEBUG] API URL', '/api/v1/gallery');
    try {
      const res = await galleryApi.getGalleryItems();
      console.log('[GALLERY PUBLIC DEBUG] RESPONSE STATUS', res ? 200 : 'NO_RES');
      console.log('[GALLERY PUBLIC DEBUG] RESPONSE DATA', res?.data);

      const items = (res && res.success && Array.isArray(res.data)) ? res.data : [];
      setRawItems(items);

      console.log('[GALLERY PUBLIC DEBUG] TOTAL ITEMS', items.length);
    } catch (err: any) {
      console.error('[GALLERY PUBLIC DEBUG] Fetch error:', err);
      setRawItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicGallery();
  }, []);

  const categories = ['All', 'Hospital & OPD', 'Labs & Classrooms', 'Events & Seminars', 'Herbal Garden'];

  // Published items only with normalized status check
  const publishedItems = rawItems.filter((item) => {
    const normalizedStatus = String(item.status ?? '').trim().toUpperCase();
    return normalizedStatus === 'PUBLISHED' || normalizedStatus === 'ACTIVE' || !item.status;
  });

  console.log('[GALLERY PUBLIC DEBUG] PUBLISHED ITEMS', publishedItems.length);

  // Category filter
  const filtered = activeCat === 'All'
    ? publishedItems
    : publishedItems.filter((i) => (i.category || '').toLowerCase() === activeCat.toLowerCase());

  console.log('[GALLERY PUBLIC DEBUG] FILTERED ITEMS', filtered.length);

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

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      <Breadcrumb items={[{ label: 'Media & Campus Gallery' }]} />

      {/* Header Banner */}
      <div className="rounded-3xl bg-[#002147] text-white p-8 sm:p-12 shadow-xl space-y-4">
        <span className="px-3.5 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-black rounded-full uppercase tracking-wider border border-emerald-500/30">
          Visual Campus Tour & Events
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Photo & Infrastructure Gallery
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
          Take a visual tour of our 8.5-acre campus in Purba Bardhaman. Explore our teaching hospital, laboratories, botanical herbal garden, library, and community health camps.
        </p>

        {/* Categories Bar */}
        <div className="pt-4 flex items-center space-x-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeCat === cat
                  ? 'bg-[#00A651] text-white shadow-md'
                  : 'bg-white/10 text-slate-200 hover:bg-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="p-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#00A651]" />
          <p className="text-xs text-slate-500 font-bold">Loading campus photographs from Google Drive cloud storage...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 space-y-3">
          <ImageIcon className="w-12 h-12 mx-auto text-slate-400" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No published photographs found in this category</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try clicking "All" to view all published campus photographs.
          </p>
          <button
            onClick={() => setActiveCat('All')}
            className="px-4 py-2 bg-[#002147] text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            Show All Photographs
          </button>
        </div>
      ) : (
        /* Gallery Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item: any) => {
            const itemId = item.id || item._id;
            const imageUrl = buildImageUrl(item);
            const isBroken = brokenImageMap[itemId];

            console.log('[GALLERY PUBLIC DEBUG] IMAGE URL', imageUrl);

            return (
              <Card
                key={itemId}
                className="overflow-hidden p-0 group border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all rounded-3xl flex flex-col justify-between"
              >
                <div>
                  <div className="h-56 overflow-hidden relative cursor-pointer bg-slate-100 dark:bg-slate-800" onClick={() => !isBroken && setSelectedImage(item)}>
                    {!isBroken ? (
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
                    {!isBroken && (
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <span className="p-3 bg-white/90 rounded-full text-slate-900 shadow-lg">
                          <Maximize2 className="w-5 h-5" />
                        </span>
                      </div>
                    )}
                    <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-slate-900/80 text-white font-mono text-[10px] rounded-lg backdrop-blur-md">
                      {item.category || 'Hospital & OPD'}
                    </span>
                  </div>

                  <div className="p-5 space-y-1">
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-1">{item.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{item.description || 'No description provided.'}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl max-w-3xl w-full relative space-y-0">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 p-2 text-white bg-slate-900/70 hover:bg-slate-900 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="h-96 w-full overflow-hidden bg-slate-950 flex items-center justify-center">
              <img src={buildImageUrl(selectedImage)} alt={selectedImage.title} className="w-full h-full object-contain" />
            </div>

            <div className="p-6 space-y-2">
              <span className="text-2xs font-black uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded">
                {selectedImage.category}
              </span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">{selectedImage.title}</h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{selectedImage.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
