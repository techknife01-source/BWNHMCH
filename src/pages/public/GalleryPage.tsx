import React, { useState } from 'react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Card } from '../../components/common/Card';
import { Image as ImageIcon, Filter, Maximize2, X, Sparkles } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  category: 'Hospital & OPD' | 'Labs & Classrooms' | 'Events & Seminars' | 'Herbal Garden';
  imageUrl: string;
  description: string;
}

export const GalleryPage: React.FC = () => {
  const items: GalleryItem[] = [
    {
      id: 'g1',
      title: '50-Bed Attached Teaching Hospital & OPD Building',
      category: 'Hospital & OPD',
      imageUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=800',
      description: 'Front facade of the hospital housing daily outpatient departments, casualty, and inpatient wards.'
    },
    {
      id: 'g2',
      title: 'Homoeopathic Pharmacy & HPLC Drug Standardization Lab',
      category: 'Labs & Classrooms',
      imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800',
      description: 'Students performing potentization and vehicle testing under senior pharmacy professors.'
    },
    {
      id: 'g3',
      title: 'Annual Hahnemannian Oath Ceremony & Induction 2026',
      category: 'Events & Seminars',
      imageUrl: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=800',
      description: 'Fresh BHMS 2026 scholars taking the Hahnemannian Oath at the 250-seater air-conditioned auditorium.'
    },
    {
      id: 'g4',
      title: 'Botanical Herbal Garden & Medicinal Flora Reserve',
      category: 'Herbal Garden',
      imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800',
      description: '250+ species of medicinal herbs preserved for practical drug identification and pharmacognosy study.'
    },
    {
      id: 'g5',
      title: 'Central Digital Medical Library & E-Learning Workstations',
      category: 'Labs & Classrooms',
      imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800',
      description: 'Housing 12,000+ volumes of rare Homoeopathic treatises, WBUHS journals, and online databases.'
    },
    {
      id: 'g6',
      title: 'Free Rural Homoeopathic Medical Camp - Memari Village',
      category: 'Events & Seminars',
      imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800',
      description: 'Interns and faculty doctors delivering free healthcare to over 600 rural patients in Purba Bardhaman.'
    },
    {
      id: 'g7',
      title: 'Anatomy Dissection Hall & Histology Microscope Room',
      category: 'Labs & Classrooms',
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
      description: 'First year BHMS medical students exploring cadaveric dissection and tissue histology.'
    },
    {
      id: 'g8',
      title: 'Clinical Pathology Diagnostic & Culture Suite',
      category: 'Hospital & OPD',
      imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800',
      description: 'Equipped for hematology, biochemistry panels, and bacterial culture sensitivity testing.'
    }
  ];

  const [activeCat, setActiveCat] = useState<string>('All');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const categories = ['All', 'Hospital & OPD', 'Labs & Classrooms', 'Events & Seminars', 'Herbal Garden'];

  const filtered = activeCat === 'All' ? items : items.filter((i) => i.category === activeCat);

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
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
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

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <Card
            key={item.id}
            className="overflow-hidden p-0 group border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all rounded-3xl"
          >
            <div className="h-56 overflow-hidden relative cursor-pointer" onClick={() => setSelectedImage(item)}>
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <span className="p-3 bg-white/90 rounded-full text-slate-900 shadow-lg">
                  <Maximize2 className="w-5 h-5" />
                </span>
              </div>
              <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-slate-900/80 text-white font-mono text-[10px] rounded-lg backdrop-blur-md">
                {item.category}
              </span>
            </div>

            <div className="p-5 space-y-1">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-1">{item.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{item.description}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl max-w-3xl w-full relative space-y-0">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 p-2 text-white bg-slate-900/70 hover:bg-slate-900 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="h-96 w-full overflow-hidden">
              <img src={selectedImage.imageUrl} alt={selectedImage.title} className="w-full h-full object-cover" />
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
