import React, { useState, useEffect } from 'react';
import { Search, Calendar, User, Tag, ArrowRight, Bell, Newspaper, Sparkles, Filter } from 'lucide-react';
import { newsApi, NewsItem } from '../../services/api/news.api';

export const NewsPage: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([
    {
      id: '1',
      title: 'WBUHS Annual Homoeopathic Scientific Seminar 2026 Hosted at BHMC Campus',
      slug: 'wbuhs-annual-scientific-seminar-2026',
      summary: 'Distinguished research papers on chronic disease management with high-potency Homoeopathic remedies were presented by senior clinical professors.',
      content: 'BURDWAN HOMOEOPATHIC MEDICAL COLLEGE & HOSPITAL successfully convened the WBUHS Annual Homoeopathic Scientific Conference. Over 400 delegates including post-graduate scholars, medical officers, and faculty members participated in technical sessions on Materia Medica and Repertory analysis.',
      category: 'Academic Conference',
      author: 'Media Cell, BHMC&H',
      publishedAt: '2026-07-20',
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
      featured: true,
    },
    {
      id: '2',
      title: 'Free Health & Homoeopathic OPD Medical Camp Conducted in Rural Bardhaman',
      slug: 'free-rural-health-camp-bardhaman',
      summary: 'Over 650 patients received free Homoeopathic consultations, diagnostic checkups, and genuine remedies under National Health Mission outreach.',
      content: 'As part of our commitment to community healthcare, BHMC&H faculty doctors and final year BHMS interns organized an extensive free medical camp at Memari village. Specialized OPDs for skin, gastrointestinal, and pediatric disorders were established.',
      category: 'Community Health',
      author: 'NSS Cell & OPD Desk',
      publishedAt: '2026-07-15',
      imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800',
      featured: false,
    },
    {
      id: '3',
      title: 'State-of-the-Art Homoeopathic Pharmacy & Drug Standardization Lab Inaugurated',
      slug: 'pharmacy-lab-inauguration-2026',
      summary: 'New high-performance liquid chromatography (HPLC) and spectrophotometry equipment installed for student practical research.',
      content: 'Principal Prof. (Dr.) Susmita Chatterjee inaugurated the upgraded Homoeopathic Pharmacy laboratory. The facility enhances practical learning in potentization, mother tincture analysis, and quality standardization according to Homoeopathic Pharmacopoeia of India (HPI).',
      category: 'Campus Expansion',
      author: 'Dept of Pharmacy',
      publishedAt: '2026-07-08',
      imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800',
      featured: false,
    },
    {
      id: '4',
      title: 'BHMS 2026 Batch Orientation & Hahnemannian Oath Ceremony',
      slug: 'bhms-orientation-oath-ceremony',
      summary: '50 newly admitted BHMS medical students formally took the Hahnemannian Oath during the annual induction program.',
      content: 'The 2026-2027 academic session commenced with solemnity as 50 scholars admitted through NEET AYUSH counseling received their white coats and pledged allegiance to the principles of Organon of Medicine.',
      category: 'Student Event',
      author: 'Academic Council',
      publishedAt: '2026-07-01',
      imageUrl: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=800',
      featured: false,
    }
  ]);

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');

  const categories = ['All', 'Academic Conference', 'Community Health', 'Campus Expansion', 'Student Event'];

  useEffect(() => {
    newsApi.getNews()
      .then((res) => {
        if (res.data?.content && res.data.content.length > 0) {
          setNews(res.data.content);
        }
      })
      .catch(() => {
        // Fallback to structured news items
      });
  }, []);

  const filtered = news.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
                          item.summary.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === 'All' || item.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  const featuredItem = news.find((n) => n.featured) || news[0];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
          <Newspaper className="w-4 h-4" />
          <span>Official Gazette & News Bulletin</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Campus News, Events & Press Releases
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl">
          Stay updated with the latest academic milestones, medical research findings, hospital outreach camps, and campus events at BURDWAN HOMOEOPATHIC MEDICAL COLLEGE & HOSPITAL.
        </p>
      </div>

      {/* Featured News Banner */}
      {featuredItem && (
        <div className="max-w-7xl mx-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-0">
          <div className="h-64 lg:h-auto overflow-hidden relative">
            <img src={featuredItem.imageUrl} alt={featuredItem.title} className="w-full h-full object-cover" />
            <span className="absolute top-4 left-4 px-3 py-1 bg-emerald-500 text-white font-bold text-xs rounded-full uppercase shadow-md">
              Featured Story
            </span>
          </div>
          <div className="p-8 sm:p-12 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-emerald-500" /> {featuredItem.publishedAt}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-blue-500" /> {featuredItem.author}</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-snug">
                {featuredItem.title}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {featuredItem.summary}
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-2xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-md">
                {featuredItem.category}
              </span>
              <button className="flex items-center space-x-1.5 text-xs font-bold text-[#002147] dark:text-[#00A651] hover:underline">
                <span>Read Full Article</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search news & press releases..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#002147] dark:focus:ring-[#00A651]"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedCat === cat
                  ? 'bg-[#002147] text-white dark:bg-[#00A651]'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* News Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((item) => (
          <div key={item.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-48 overflow-hidden relative">
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-slate-900/80 text-white font-mono text-[10px] rounded-lg backdrop-blur-md">
                  {item.publishedAt}
                </span>
              </div>
              <div className="p-6 space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  {item.category}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {item.summary}
                </p>
              </div>
            </div>

            <div className="px-6 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-[10px] text-slate-400 font-medium">{item.author}</span>
              <button className="font-bold text-[#002147] dark:text-[#00A651] hover:underline flex items-center gap-1">
                <span>Read More</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
