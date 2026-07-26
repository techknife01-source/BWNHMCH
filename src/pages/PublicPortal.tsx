/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ActiveTab, FeedbackSubmission } from '../types';
import {
  DEPARTMENTS,
  FACULTY,
  NOTICES,
  GALLERY,
  COURSES,
  FEEDBACK_LIST,
  GENERAL_STATS
} from '../data/mockData';
import {
  BookOpen,
  Calendar,
  Phone,
  Mail,
  MapPin,
  FileText,
  Clock,
  Award,
  ChevronRight,
  Heart,
  Users,
  Search,
  CheckCircle,
  HelpCircle,
  Megaphone,
  Briefcase,
  Layers,
  FileSpreadsheet,
  AlertTriangle,
  Scale,
  Shield,
  Download,
  Send,
  Star
} from 'lucide-react';

interface PublicPortalProps {
  activeTab: ActiveTab;
  onNavigate: (tab: ActiveTab) => void;
  onLoginClick: () => void;
}

export const PublicPortal: React.FC<PublicPortalProps> = ({
  activeTab,
  onNavigate,
  onLoginClick
}) => {
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackRole, setFeedbackRole] = useState<'Student' | 'Faculty' | 'Alumni' | 'Patient' | 'Visitor'>('Student');
  const [feedbackSubject, setFeedbackSubject] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbacks, setFeedbacks] = useState<FeedbackSubmission[]>(FEEDBACK_LIST);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Notice board search & category filters
  const [noticeSearch, setNoticeSearch] = useState('');
  const [noticeCat, setNoticeCat] = useState<string>('All');

  // Faculty department filter
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('All');

  const filteredFaculty = selectedDeptFilter === 'All'
    ? FACULTY
    : FACULTY.filter(f => f.department === selectedDeptFilter);

  const filteredNotices = NOTICES.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(noticeSearch.toLowerCase()) ||
                          n.content.toLowerCase().includes(noticeSearch.toLowerCase());
    const matchesCategory = noticeCat === 'All' || n.category === noticeCat;
    return matchesSearch && matchesCategory;
  });

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackName || !feedbackEmail || !feedbackMsg) return;
    const newFb: FeedbackSubmission = {
      id: `fb_${Date.now()}`,
      name: feedbackName,
      email: feedbackEmail,
      role: feedbackRole,
      subject: feedbackSubject || 'General Feedback',
      message: feedbackMsg,
      rating: feedbackRating,
      date: new Date().toISOString().split('T')[0]
    };
    setFeedbacks([newFb, ...feedbacks]);
    setFeedbackSubmitted(true);
    setFeedbackName('');
    setFeedbackEmail('');
    setFeedbackSubject('');
    setFeedbackMsg('');
    setTimeout(() => setFeedbackSubmitted(false), 4000);
  };

  return (
    <div className="bg-[#F0F4F8] dark:bg-[#000f21] min-h-screen text-[#1E293B] dark:text-[#e2e8f0] font-sans selection:bg-[#002147] selection:text-white" id="public_portal_root">
      {/* 1. TOP UTILITY HEADER */}
      <div className="bg-[#002147] text-blue-100 py-2.5 px-4 text-xs shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex flex-wrap items-center gap-4 text-3xs md:text-2xs font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#00A651]" /> +91 342 262 5585
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#00A651]" /> bwnhmch@gmail.com
            </span>
            <span className="bg-[#00A651] text-white font-black px-2.5 py-0.5 rounded uppercase tracking-widest text-[9px] border border-[#ffffff10]">
              WBUHS Affiliated
            </span>
            <span className="text-blue-200">| Approved by National Commission for Homoeopathy (NCH), New Delhi</span>
          </div>
          <div className="flex items-center gap-4 text-3xs md:text-2xs font-bold uppercase tracking-wider">
            <button onClick={() => onNavigate('anti_ragging')} className="hover:text-[#00A651] transition">Anti-Ragging Help</button>
            <button onClick={() => onNavigate('grievance')} className="hover:text-[#00A651] transition">Grievance Cell</button>
            <button onClick={() => onNavigate('rti')} className="hover:text-[#00A651] transition">RTI Disclosure</button>
            <button
              onClick={onLoginClick}
              className="bg-[#00A651] hover:bg-[#008c44] text-white font-black px-3.5 py-1.5 rounded-lg transition shadow-md cursor-pointer uppercase tracking-widest text-[9px]"
            >
              ERP Campus Login
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN LOGO HEADER & NAVIGATION */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/80 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col lg:flex-row justify-between items-center gap-4">
          {/* Logo Brand */}
          <div className="flex items-center space-x-3.5 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="p-2 bg-[#00A651] rounded-xl text-white shadow-sm flex items-center justify-center shrink-0">
              <Heart className="w-7 h-7" />
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-[#002147] dark:text-slate-100 block uppercase">
                Burdwan Homoeopathic
              </span>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
                Medical College & Hospital
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[11px] font-bold text-[#002147] dark:text-slate-300 uppercase tracking-wider">
            <button onClick={() => onNavigate('home')} className={`hover:text-[#00A651] dark:hover:text-emerald-400 transition ${activeTab === 'home' ? 'text-[#00A651] border-b-2 border-[#00A651]' : ''}`}>Home</button>
            
            {/* About Dropdown Simulation */}
            <div className="relative group">
              <span className="hover:text-[#00A651] cursor-pointer flex items-center gap-0.5">About college ▾</span>
              <div className="absolute left-0 mt-1 w-48 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-lg hidden group-hover:block py-2 z-50">
                <button onClick={() => onNavigate('about')} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-3xs uppercase text-[#002147] dark:text-slate-200 font-bold">Overview</button>
                <button onClick={() => onNavigate('vision')} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-3xs uppercase text-[#002147] dark:text-slate-200 font-bold">Vision & Mission</button>
                <button onClick={() => onNavigate('principal_msg')} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-3xs uppercase text-[#002147] dark:text-slate-200 font-bold">Principal Message</button>
                <button onClick={() => onNavigate('history')} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-3xs uppercase text-[#002147] dark:text-slate-200 font-bold">College History</button>
                <button onClick={() => onNavigate('campus')} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-3xs uppercase text-[#002147] dark:text-slate-200 font-bold">Campus & Amenities</button>
              </div>
            </div>

            <button onClick={() => onNavigate('departments')} className={`hover:text-[#00A651] transition ${activeTab === 'departments' ? 'text-[#00A651] border-b-2 border-[#00A651]' : ''}`}>Departments</button>
            <button onClick={() => onNavigate('faculty')} className={`hover:text-[#00A651] transition ${activeTab === 'faculty' ? 'text-[#00A651] border-b-2 border-[#00A651]' : ''}`}>Faculty</button>
            <button onClick={() => onNavigate('teaching_hospital')} className={`hover:text-[#00A651] transition ${activeTab === 'teaching_hospital' ? 'text-[#00A651] border-b-2 border-[#00A651]' : ''}`}>Teaching Hospital</button>
            
            <div className="relative group">
              <span className="hover:text-[#00A651] cursor-pointer flex items-center gap-0.5">Academics ▾</span>
              <div className="absolute left-0 mt-1 w-48 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-lg hidden group-hover:block py-2 z-50">
                <button onClick={() => onNavigate('courses')} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-3xs uppercase text-[#002147] dark:text-slate-200 font-bold">BHMS & MD Courses</button>
                <button onClick={() => onNavigate('admissions')} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-3xs uppercase text-[#002147] dark:text-slate-200 font-bold">Admissions & Eligibility</button>
                <button onClick={() => onNavigate('academic_calendar')} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-3xs uppercase text-[#002147] dark:text-slate-200 font-bold">Academic Calendar</button>
                <button onClick={() => onNavigate('downloads')} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-3xs uppercase text-[#002147] dark:text-slate-200 font-bold">Downloads Desk</button>
              </div>
            </div>

            <button onClick={() => onNavigate('notice_board')} className={`hover:text-[#00A651] transition ${activeTab === 'notice_board' ? 'text-[#00A651] border-b-2 border-[#00A651]' : ''}`}>Notice Board</button>
            <button onClick={() => onNavigate('gallery')} className={`hover:text-[#00A651] transition ${activeTab === 'gallery' ? 'text-[#00A651] border-b-2 border-[#00A651]' : ''}`}>Gallery</button>
            <button onClick={() => onNavigate('contact')} className={`hover:text-[#00A651] transition ${activeTab === 'contact' ? 'text-[#00A651] border-b-2 border-[#00A651]' : ''}`}>Contact</button>
          </nav>
        </div>
      </header>

      {/* 3. CORE PAGE ROUTER SWITCH */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* --- PAGE: HOME --- */}
        {activeTab === 'home' && (
          <div className="space-y-12 animate-fadeIn" id="page_home">
            {/* HERO SECTION */}
            <div className="relative bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-slate-800">
              <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200')" }}></div>
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent"></div>
              
              <div className="relative z-10 p-8 md:p-16 max-w-2xl space-y-6">
                <span className="bg-emerald-600/40 text-emerald-400 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider inline-block">
                  A Grade Accredited by NAAC & NCH
                </span>
                <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  Empowering the Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Homeopathic Science</span>
                </h1>
                <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                  Integrating centuries-old therapeutic philosophy with cutting-edge medical research and clinical internships. Join India's premier AYUSH ecosystem.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => onNavigate('admissions')} className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition uppercase tracking-wider cursor-pointer">
                    Apply for Admission 2026
                  </button>
                  <button onClick={() => onNavigate('teaching_hospital')} className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition uppercase tracking-wider cursor-pointer border border-slate-700">
                    Explore OPD Services
                  </button>
                </div>
              </div>
            </div>

            {/* KEY METRICS GRID */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { value: GENERAL_STATS.totalStudents, label: 'BHMS & MD Scholars', icon: <Users className="w-6 h-6" /> },
                { value: GENERAL_STATS.totalFaculty, label: 'Super-Specialty Clinicians', icon: <Award className="w-6 h-6" /> },
                { value: GENERAL_STATS.totalBeds, label: 'Associated Hospital Beds', icon: <Heart className="w-6 h-6" /> },
                { value: GENERAL_STATS.dailyOpdCount + '+', label: 'Average Daily OPD Footfall', icon: <Calendar className="w-6 h-6" /> }
              ].map((m, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center space-x-4 shadow-xs">
                  <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                    {m.icon}
                  </div>
                  <div>
                    <span className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-100 block">{m.value}</span>
                    <span className="text-3xs md:text-2xs font-semibold uppercase text-slate-400 tracking-wider block">{m.label}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* SPLIT COLUMN: NOTICE BOARD & ROTATING NEWS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* NOTICE TICKET PANEL */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-50 dark:border-slate-800 pb-3">
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-widest flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-rose-500" />
                    <span>Recent Notifications Desk</span>
                  </h3>
                  <button onClick={() => onNavigate('notice_board')} className="text-3xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider hover:underline">
                    View Archive
                  </button>
                </div>
                <div className="space-y-4">
                  {NOTICES.filter(n => n.isPinned).map(n => (
                    <div key={n.id} className="p-4 bg-slate-50/60 dark:bg-slate-950/40 border border-slate-100/40 dark:border-slate-800 rounded-2xl space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-4xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400">
                          {n.category}
                        </span>
                        <span className="text-4xs font-mono text-slate-400">{n.date}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {n.title}
                      </h4>
                      <p className="text-2xs text-slate-500 dark:text-slate-400 line-clamp-2">
                        {n.content}
                      </p>
                      {n.attachmentName && (
                        <a href="#" className="inline-flex items-center gap-1 text-4xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                          <Download className="w-3 h-3" /> {n.attachmentName}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* QUICK LINKS PANEL */}
              <div className="bg-gradient-to-b from-blue-900 to-slate-900 text-white rounded-3xl p-6 flex flex-col justify-between border border-blue-950">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-blue-400">
                    Student Desk & Helplines
                  </h3>
                  <div className="space-y-2 text-2xs font-semibold">
                    {[
                      { text: 'Admission Prospectus 2026', page: 'admissions' },
                      { text: 'Teaching Hospital Clinical Roster', page: 'teaching_hospital' },
                      { text: 'Academic Calendar Desk', page: 'academic_calendar' },
                      { text: 'Syllabus & Course Scheme', page: 'courses' },
                      { text: 'Institutional NAAC & IQAC Records', page: 'iqac' },
                      { text: 'Anti-Ragging Committee Contacts', page: 'anti_ragging' }
                    ].map((lnk, i) => (
                      <button
                        key={i}
                        onClick={() => onNavigate(lnk.page as ActiveTab)}
                        className="w-full text-left p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 transition-all border border-slate-800/30 flex items-center justify-between"
                      >
                        <span>{lnk.text}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-blue-950/60 p-4 rounded-2xl border border-blue-900/60 mt-4 text-center">
                  <span className="text-3xs text-blue-300 uppercase font-black block">Anti-Ragging 24x7 Hotline</span>
                  <span className="text-sm font-extrabold text-emerald-400 font-mono block mt-0.5">1800-180-5522</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- PAGE: ABOUT --- */}
        {activeTab === 'about' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-10 space-y-8 animate-fadeIn" id="page_about">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
              <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100 font-sans">
                About Burdwan Homoeopathic College
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Estd. 1978 • Affiliated with The West Bengal University of Health Sciences (WBUHS) & Approved by National Commission for Homoeopathy (NCH).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Burdwan Homoeopathic Medical College & Hospital has remained a beacon of educational excellence in natural medicine for over four decades. Located in Nutanganj, Burdwan, our state-aided institution integrates foundational modern pathology and clinical diagnostic tools with rigorous study of classical Hahnemannian homeopathic therapeutics.
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Our associated 25-bed teaching hospital offers interns unique clinical training in specialized OPDs and IPD wards, handling complex dermatological issues, pediatric cases, and respiratory conditions.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <span className="text-lg font-bold text-blue-600 block">30+ Years</span>
                    <span className="text-3xs text-slate-500 uppercase tracking-wide">Academic Legacy</span>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <span className="text-lg font-bold text-emerald-600 block">10,000+</span>
                    <span className="text-3xs text-slate-500 uppercase tracking-wide">Successful Cures</span>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
                <img
                  referrerPolicy="no-referrer"
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600"
                  alt="College building"
                  className="w-full h-64 object-cover hover:scale-105 transition duration-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* --- PAGE: VISION & MISSION --- */}
        {activeTab === 'vision' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn" id="page_vision">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-4">
              <div className="p-3 w-12 h-12 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl">
                <Award className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100">
                Our Vision
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                To achieve global leadership in holistic healthcare education by establishing a scientifically validated, patient-centric homeopathic healing environment. We strive to mold clinicians who possess both high intellectual capability and the human touch.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-4">
              <div className="p-3 w-12 h-12 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100">
                Our Mission
              </h2>
              <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-2 list-disc list-inside leading-relaxed">
                <li>Provide world-class medical instruction under NCH standards.</li>
                <li>Pioneer research projects validating homeopathic potency chemistry.</li>
                <li>Operate rural diagnostic centers and mobile Ayush clinics.</li>
                <li>Instill rigorous medical ethics and empathy in student interns.</li>
              </ul>
            </div>
          </div>
        )}

        {/* --- PAGE: PRINCIPAL MESSAGE --- */}
        {activeTab === 'principal_msg' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-10 space-y-8 animate-fadeIn" id="page_principal_msg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              <div className="text-center md:col-span-1 space-y-3">
                <div className="w-32 h-32 mx-auto rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                  <img
                    referrerPolicy="no-referrer"
                    src="https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=300"
                    alt="Principal"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-sans">Dr. Susmita Chatterjee, BHMS, MD (Hom)</h3>
                  <p className="text-3xs text-slate-400 uppercase font-bold">Principal & Administrator</p>
                  <p className="text-4xs text-slate-400 mt-1">Renowned Homoeopathic Clinician & Academician</p>
                </div>
              </div>
              <div className="md:col-span-2 space-y-4">
                <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
                  From the Principal's Desk
                </h2>
                <div className="w-12 h-1 bg-blue-600 rounded"></div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  "Dear Scholars, Clinicians, and Patrons, Welcome to Burdwan Homoeopathic Medical College & Hospital. Our institution is built on the profound medical philosophy laid down by Dr. Samuel Hahnemann. In today’s complex clinical environment, chronic lifestyle ailments and autoimmune syndromes demand gentle, restorative therapeutics."
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  "Our role here is not just to teach repertories, but to educate students on the art and science of pathogenetic evaluation. Through our fully digitized ERP system, student scholars trace clinical cases from OPD registration down to remedial dispensaries, ensuring a truly immersive educational experience."
                </p>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  With warm regards,<br />
                  Dr. Susmita Chatterjee
                </p>
              </div>
            </div>
          </div>
        )}

        {/* --- PAGE: HISTORY --- */}
        {activeTab === 'history' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 animate-fadeIn" id="page_history">
            <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
              Institutional Heritage & Chronology
            </h2>
            <div className="space-y-6 relative pl-6 border-l border-slate-100 dark:border-slate-800">
              {[
                { year: '1978', title: 'Foundation Stone', text: 'Established as Burdwan Homoeopathic Medical College & Hospital to provide quality homeopathic education in West Bengal.' },
                { year: '2003', title: 'WBUHS Affiliation', text: 'Transferred affiliation to the newly established West Bengal University of Health Sciences (WBUHS), Kolkata.' },
                { year: '2016', title: 'Clinical & Lab Expansion', text: 'Upgraded associated teaching hospital with 25 IPD beds and modern departmental museums according to CCH/NCH guidelines.' },
                { year: '2026', title: 'Digital Transformation', text: 'Deploying the comprehensive digital ERP enabling cloud clinical tracking, student portfolios, and service logs.' }
              ].map((h, i) => (
                <div key={i} className="relative">
                  <span className="absolute -left-[32.5px] top-1.5 w-3.5 h-3.5 bg-blue-600 rounded-full border-4 border-white dark:border-slate-900"></span>
                  <div className="space-y-1">
                    <span className="text-xs font-black text-blue-600 font-mono block">{h.year}</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100 block">{h.title}</span>
                    <p className="text-2xs text-slate-500 dark:text-slate-400">{h.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- PAGE: CAMPUS --- */}
        {activeTab === 'campus' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 animate-fadeIn" id="page_campus">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Campus Amenities & Physical Infrastructure
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Repertory Software Suite', desc: 'Fully modernized IT lab containing computerized repertories (RADAR, MacRepertory, Hompath).', img: 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&q=80&w=400' },
                { title: 'Botanical Garden', desc: 'Acres of cultivated organic flora for pharmacognosy identification and raw homeopathic dilutions.', img: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=400' },
                { title: 'Medical Library & Reading Hall', desc: 'Access to over 15,000 international textbooks, archives, Hahnemannian journals, and online research indexes.', img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=400' }
              ].map((c, i) => (
                <div key={i} className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
                  <img referrerPolicy="no-referrer" src={c.img} alt={c.title} className="w-full h-40 object-cover" />
                  <div className="p-4 space-y-1.5">
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">{c.title}</h3>
                    <p className="text-2xs text-slate-500 dark:text-slate-400 leading-relaxed">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- PAGE: DEPARTMENTS --- */}
        {activeTab === 'departments' && (
          <div className="space-y-6 animate-fadeIn" id="page_departments">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                Our Academic & Clinical Departments
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                The core pillars of homeopathic study approved by NCH curriculum committees.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {DEPARTMENTS.map(d => (
                <div key={d.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-3xs font-mono font-bold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded uppercase">
                        {d.code}
                      </span>
                      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1.5">
                        {d.name}
                      </h3>
                    </div>
                  </div>
                  <p className="text-2xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {d.description}
                  </p>
                  <div className="border-t border-slate-50 dark:border-slate-800 pt-3 flex flex-col gap-1 text-3xs text-slate-400">
                    <div>
                      <span className="font-semibold text-slate-600 dark:text-slate-300">HOD:</span> {d.hod}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-600 dark:text-slate-300">Sanctioned Laboratories:</span> {d.labs.join(', ')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- PAGE: FACULTY --- */}
        {activeTab === 'faculty' && (
          <div className="space-y-6 animate-fadeIn" id="page_faculty">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  Our Faculty of Medicine
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Experienced clinicians, homeopathic pharmaceutical researchers, and guides.
                </p>
              </div>

              {/* Department Filter */}
              <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-950 p-1.5 border border-slate-150 dark:border-slate-800 rounded-xl">
                <span className="text-3xs font-bold text-slate-400 uppercase px-2">Filter</span>
                <select
                  value={selectedDeptFilter}
                  onChange={e => setSelectedDeptFilter(e.target.value)}
                  className="bg-transparent text-2xs font-semibold text-slate-600 dark:text-slate-300 focus:outline-none"
                >
                  <option value="All">All Departments</option>
                  <option value="Materia Medica">Materia Medica</option>
                  <option value="Organon of Medicine & Philosophy">Organon</option>
                  <option value="Homoeopathic Repertory">Repertory</option>
                  <option value="Homoeopathic Pharmacy">Pharmacy</option>
                  <option value="Practice of Medicine">Practice of Medicine</option>
                  <option value="Gynecology & Obstetrics">Gynecology</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredFaculty.map(f => (
                <div key={f.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-extrabold flex items-center justify-center text-xs">
                        {f.name.split(' ').pop()?.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">{f.name}</h3>
                        <p className="text-4xs text-slate-400 uppercase font-bold">{f.designation}</p>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl space-y-1 text-3xs text-slate-500">
                      <div>
                        <span className="font-semibold text-slate-600 dark:text-slate-300">Department:</span> {f.department}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-600 dark:text-slate-300">Qualification:</span> {f.qualification}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-600 dark:text-slate-300">Experience:</span> {f.experience}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-50 dark:border-slate-800 pt-3 flex justify-between items-center text-3xs">
                    <span className="text-slate-400 font-medium">Publications: <strong className="text-slate-600 dark:text-slate-300">{f.publications}</strong></span>
                    <a href={`mailto:${f.email}`} className="text-blue-600 hover:underline">Email Staff</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- PAGE: TEACHING HOSPITAL --- */}
        {activeTab === 'teaching_hospital' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-8 animate-fadeIn" id="page_teaching_hospital">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
              <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
                Burdwan Homoeopathic Associated Teaching Hospital
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                A 25-bed clinical multi-specialty OPD and IPD supporting the community since 1978.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Clinical Services & Specialty OPDs
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  The teaching hospital provides clinical outpatient treatment utilizing classic constitutional prescribing. Our specialized wings receive referrals from all over the country.
                </p>
                <div className="grid grid-cols-2 gap-3 text-3xs font-semibold uppercase text-slate-500">
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl">✓ Chronic Skin OPD (Psoriasis, Eczema)</div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl">✓ Rheumatology & Joint Clinic</div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl">✓ Pediatric Developmental Delay Unit</div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl">✓ Respiratory Allergy Cell</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Clinical Training For Scholars
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Both 3rd and 4th Professional BHMS scholars receive mandatory rotational clinical postings. Under the supervision of senior MD consultants, they master chronic case-taking, repertorization, and remedial dispensing.
                </p>
                <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 border border-emerald-150 dark:border-emerald-900 rounded-xl text-xs text-emerald-800 dark:text-emerald-400 leading-relaxed">
                  <strong>Did you know?</strong> 100% of our patient prescribing records are archived digitally in the hospital database, helping postgraduate scholars track remedy efficacy trends.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- PAGE: COURSES --- */}
        {activeTab === 'courses' && (
          <div className="space-y-6 animate-fadeIn" id="page_courses">
            {COURSES.map(c => (
              <div key={c.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-3 gap-2">
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                    {c.name}
                  </h3>
                  <span className="text-3xs font-mono font-bold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 px-3 py-1 rounded">
                    Sanctioned Intake: {c.intake} seats
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-3xs text-slate-500">
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl">
                    <span className="font-bold block text-slate-700 dark:text-slate-300 uppercase">Duration</span>
                    <span>{c.duration}</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl md:col-span-2">
                    <span className="font-bold block text-slate-700 dark:text-slate-300 uppercase">Eligibility Criteria</span>
                    <span>{c.eligibility}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block">Professional Syllabus Roster</span>
                  <div className="space-y-1.5 pl-4 border-l border-slate-100 dark:border-slate-800">
                    {c.syllabusOverview.map((s, idx) => (
                      <p key={idx} className="text-2xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        • {s}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- PAGE: ADMISSIONS --- */}
        {activeTab === 'admissions' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 animate-fadeIn" id="page_admissions">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Admission Criteria & Intake 2026
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              All BHMS (Undergraduate) and MD (Postgraduate) admissions are routed strictly via national counseling frameworks.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 border border-slate-100 dark:border-slate-800 rounded-2xl space-y-3">
                <span className="text-3xs font-bold uppercase tracking-wider text-blue-600 block">BHMS Program Admission</span>
                <p className="text-2xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  NEET-UG qualification is mandatory. Candidates must register on the AYUSH Admissions Central Counseling Committee (AACCC) website for national seat allocations.
                </p>
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl text-3xs text-slate-500 space-y-1">
                  <div>• Minimum Physics, Chemistry, Biology aggregate: 50%</div>
                  <div>• Age limit: Minimum 17 years by December 31st.</div>
                </div>
              </div>

              <div className="p-5 border border-slate-100 dark:border-slate-800 rounded-2xl space-y-3">
                <span className="text-3xs font-bold uppercase tracking-wider text-emerald-600 block">MD (Homoeopathy) Admission</span>
                <p className="text-2xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  AIAPGET (All India AYUSH Post Graduate Entrance Test) qualification is mandatory. Registered BHMS degree from an NCH recognized college is required.
                </p>
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl text-3xs text-slate-500 space-y-1">
                  <div>• Mandatory 12-month clinical internship completion required before counselling dates.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- PAGE: ACADEMIC CALENDAR --- */}
        {activeTab === 'academic_calendar' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 animate-fadeIn" id="page_academic_calendar">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                Academic Session Calendar (Q3 - Q4 2026)
              </h2>
              <p className="text-xs text-slate-400">
                Authorized scheduler by Registrar Office under NCH curriculum guidelines.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { date: 'July 28, 2026', title: 'BHMS Main Exam Admit Card Collection', desc: 'Distribution starts from administration counter.' },
                { date: 'August 10 - 24, 2026', title: 'BHMS Annual Professional Written Examinations', desc: 'Theory exam sessions in the central auditorium.' },
                { date: 'September 01, 2026', title: 'New Academic Term Resumption (BHMS & MD)', desc: 'Roll-calls for semesters start at 09:00 AM.' },
                { date: 'October 15, 2026', title: 'Mega Clinical Poster Presentation', desc: 'Organized by Repertory & Materia Medica departments.' }
              ].map((cal, i) => (
                <div key={i} className="flex gap-4 items-start p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-100 dark:border-slate-800/60">
                  <span className="text-2xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/60 px-3 py-1.5 rounded-xl font-mono shrink-0 select-none">
                    {cal.date}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">{cal.title}</span>
                    <span className="text-2xs text-slate-500 dark:text-slate-400 block mt-0.5">{cal.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- PAGE: GALLERY --- */}
        {activeTab === 'gallery' && (
          <div className="space-y-6 animate-fadeIn" id="page_gallery">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                Institutional Media Gallery
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Visual snapshots of academic symposia, research projects, and rural medical outreach camps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {GALLERY.map(alb => (
                <div key={alb.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
                  <div className="relative h-40 overflow-hidden">
                    <img referrerPolicy="no-referrer" src={alb.coverImage} alt={alb.title} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                    <span className="absolute bottom-2 left-2 text-4xs font-bold px-2 py-0.5 rounded-full bg-slate-950/60 text-white select-none">
                      {alb.category}
                    </span>
                  </div>
                  <div className="p-4 space-y-1 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-4xs font-mono text-slate-400 block">{alb.date}</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mt-1">
                        {alb.title}
                      </span>
                      <p className="text-2xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-3">
                        {alb.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- PAGE: NOTICE BOARD --- */}
        {activeTab === 'notice_board' && (
          <div className="space-y-6 animate-fadeIn" id="page_notice_board">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-4">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                College Circulars & Notice Desk
              </h2>

              <div className="flex flex-col md:flex-row gap-3">
                {/* Search */}
                <div className="flex-1 flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-xl px-3 py-1.5">
                  <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
                  <input
                    type="text"
                    value={noticeSearch}
                    onChange={e => setNoticeSearch(e.target.value)}
                    placeholder="Search notices, exams, clinical rules..."
                    className="w-full bg-transparent text-xs focus:outline-none"
                  />
                </div>

                {/* Filter */}
                <div className="flex gap-2">
                  {['All', 'Academic', 'Hospital', 'Admission', 'General', 'Examination'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setNoticeCat(cat)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-3xs uppercase tracking-wider transition ${
                        noticeCat === cat
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:brightness-110'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {filteredNotices.map(n => (
                <div key={n.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-4xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400">
                        {n.category}
                      </span>
                      {n.isPinned && (
                        <span className="ml-2 text-4xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400">
                          📌 Pinned Notice
                        </span>
                      )}
                    </div>
                    <span className="text-3xs font-mono text-slate-400">{n.date}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug">
                    {n.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {n.content}
                  </p>

                  {n.attachmentName && (
                    <div className="border-t border-slate-50 dark:border-slate-800/80 pt-3 flex justify-between items-center text-3xs">
                      <span className="text-slate-400">Circular Code: <strong className="font-mono">{n.id}</strong></span>
                      <a href="#" className="inline-flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400 hover:underline">
                        <Download className="w-3.5 h-3.5" /> Download attachment ({n.attachmentName})
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- PAGE: CONTACT --- */}
        {activeTab === 'contact' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fadeIn" id="page_contact">
            {/* CONTACT DETAIL */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Administrative Contacts
              </h2>

              <div className="space-y-4">
                <div className="flex items-start space-x-3 text-2xs">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-700 dark:text-slate-300 block">Address Campus</span>
                    <span className="text-slate-500 dark:text-slate-400">
                      Rajganj, Nutanganj, Burdwan, Purba Bardhaman, West Bengal, PIN - 713102, India
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-2xs">
                  <Phone className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-700 dark:text-slate-300 block">Phone Desk</span>
                    <span className="text-slate-500 dark:text-slate-400">+91 342 262 5585, +91 342 262 5586</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-2xs">
                  <Mail className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-700 dark:text-slate-300 block">Staff Email</span>
                    <span className="text-slate-500 dark:text-slate-400">bwnhmch@gmail.com, info@bwnhmch.com</span>
                  </div>
                </div>
              </div>

              {/* Anti-ragging Cell disclosure in sidebar */}
              <div className="p-4 bg-rose-50/40 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900 rounded-xl space-y-2">
                <span className="text-3xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider block">Anti-Ragging Helpline</span>
                <p className="text-4xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  We maintain a zero tolerance policy towards ragging. Report cases directly to Dr. Vandana Gupta (Chairperson).
                </p>
                <span className="text-2xs font-mono font-bold text-rose-600 dark:text-rose-400 block">+91 98991 10042</span>
              </div>
            </div>

            {/* INTERACTIVE INQUIRY FORM */}
            <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-4">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Institutional Inquiry Desk
              </h2>
              <p className="text-2xs text-slate-400">
                Your question will be routed to the specific administrative committee or admission cell.
              </p>

              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-3xs font-bold text-slate-500 uppercase tracking-wider">Your Name</label>
                    <input
                      type="text"
                      required
                      value={feedbackName}
                      onChange={e => setFeedbackName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-transparent focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-3xs font-bold text-slate-500 uppercase tracking-wider">Your Email</label>
                    <input
                      type="email"
                      required
                      value={feedbackEmail}
                      onChange={e => setFeedbackEmail(e.target.value)}
                      placeholder="e.g. rahul@gmail.com"
                      className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-transparent focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-3xs font-bold text-slate-500 uppercase tracking-wider">Your Role</label>
                    <select
                      value={feedbackRole}
                      onChange={e => setFeedbackRole(e.target.value as any)}
                      className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-white dark:bg-slate-900 focus:outline-none focus:border-blue-500"
                    >
                      <option value="Student">NEET Scholar / Aspirant</option>
                      <option value="Faculty">Academic Faculty Member</option>
                      <option value="Alumni">Registered Alumni Physician</option>
                      <option value="Patient">OPD/IPD Patient</option>
                      <option value="Visitor">General Visitor</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-3xs font-bold text-slate-500 uppercase tracking-wider">Subject</label>
                    <input
                      type="text"
                      value={feedbackSubject}
                      onChange={e => setFeedbackSubject(e.target.value)}
                      placeholder="e.g. Admission vacancy query"
                      className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-transparent focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-3xs font-bold text-slate-500 uppercase tracking-wider">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={feedbackMsg}
                    onChange={e => setFeedbackMsg(e.target.value)}
                    placeholder="Write detailed inquiry here..."
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-transparent focus:outline-none focus:border-blue-500"
                  ></textarea>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-3xs font-bold text-slate-500 uppercase">Rate College Infrastructure:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFeedbackRating(star)}
                        className="text-amber-400 hover:scale-110 transition"
                      >
                        <Star className={`w-5 h-5 ${feedbackRating >= star ? 'fill-amber-400' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl uppercase tracking-wider flex items-center space-x-2 transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Inquiry</span>
                </button>

                {feedbackSubmitted && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 text-xs font-semibold rounded-xl text-center">
                    ✓ Your inquiry has been routed successfully. An admission representative will email you shortly.
                  </div>
                )}
              </form>
            </div>
          </div>
        )}

        {/* --- PAGE: ANTI RAGGING --- */}
        {activeTab === 'anti_ragging' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 animate-fadeIn" id="page_anti_ragging">
            <h2 className="text-xl font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6" />
              <span>Anti Ragging cell declaration</span>
            </h2>
            <div className="w-12 h-1 bg-rose-600 rounded"></div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              In accordance with AICTE & UGC Anti-Ragging guidelines and National Commission for Homoeopathy rules, ragging in any form is strictly banned inside the campus, hostels, or clinical wards.
            </p>
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs space-y-2">
              <span className="font-bold text-slate-700 dark:text-slate-200 block">Actions categorized as Ragging:</span>
              <ul className="list-disc list-inside space-y-1 text-slate-500">
                <li>Teasing, treating or handling a student with rudeness.</li>
                <li>Undertaking physical activities which cause distress, fear, or physical harm.</li>
                <li>Forcing financial contributions.</li>
              </ul>
            </div>
          </div>
        )}

        {/* --- PAGE: GRIEVANCE CELL --- */}
        {activeTab === 'grievance' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 animate-fadeIn" id="page_grievance">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Scale className="w-6 h-6 text-blue-500" />
              <span>Internal Grievance Redressal Committee</span>
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Our Internal Grievance Cell addresses student or faculty grievances, exam disputes, or general service bookings complaints. Submissions can be sent directly to the Principal’s office via the portal.
            </p>
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block">Cell Officers:</span>
              <p className="text-3xs text-slate-400">
                1. Dr. Sunita Sharma (Chairperson)<br />
                2. Dr. Anil Khanna (Legal Advisor)<br />
                3. Mr. Vikram Seth (Student Counselor)
              </p>
            </div>
          </div>
        )}

        {/* --- PAGE: IQAC & NAAC RECORDS --- */}
        {activeTab === 'iqac' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 animate-fadeIn" id="page_iqac">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Shield className="w-6 h-6 text-emerald-500" />
              <span>Internal Quality Assurance Cell (IQAC)</span>
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              IQAC works to maintain high academic and clinical prescribing quality at the Burdwan Homoeopathic College & Hospital. Annual self-study reports are published regularly for NCH monitoring.
            </p>
            <div className="border border-slate-100 dark:border-slate-800 rounded-xl p-4 text-3xs space-y-2 text-slate-400">
              <span className="font-bold text-slate-700 dark:text-slate-200">Latest Disclosures:</span>
              <div>• AQAR Submission Report 2024-2025 (PDF)</div>
              <div>• Student Satisfaction Survey Index 2025 (94.2% positive)</div>
            </div>
          </div>
        )}

        {/* --- LEGAL/TERMS PAGES --- */}
        {activeTab === 'privacy' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-4 animate-fadeIn" id="page_privacy">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Privacy & Data Governance Policy</h2>
            <p className="text-2xs text-slate-500 leading-relaxed">
              We secure all academic indices and clinical prescription case notes. Homeopathic prescription logs are strictly anonymized for research publications under Ayush health research policies.
            </p>
          </div>
        )}

        {activeTab === 'terms' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-4 animate-fadeIn" id="page_terms">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Terms & Conditions of Portal Usage</h2>
            <p className="text-2xs text-slate-500 leading-relaxed">
              This digital campus ERP portal provides informational support. Academic schedules, NCH guidelines, and hospital OPD timetables are subject to revision without prior updates.
            </p>
          </div>
        )}

      </main>

      {/* 4. FOOTER */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-16 py-12 px-4 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Heart className="w-6 h-6 text-blue-500" />
              <span className="font-bold text-white uppercase text-2xs tracking-wider">Burdwan Homoeopathic Campus</span>
            </div>
            <p className="text-3xs text-slate-500 leading-relaxed">
              Affiliated with the West Bengal University of Health Sciences (WBUHS) and recognized by the National Commission for Homoeopathy (NCH), Ministry of AYUSH, Govt. of India.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-2xs font-bold uppercase tracking-wider text-white">Admissions & Study</h4>
            <div className="flex flex-col space-y-1 text-3xs font-medium">
              <button onClick={() => onNavigate('courses')} className="hover:text-white transition text-left">BHMS Program Structure</button>
              <button onClick={() => onNavigate('courses')} className="hover:text-white transition text-left">MD Specialties Chairs</button>
              <button onClick={() => onNavigate('admissions')} className="hover:text-white transition text-left">Eligibility & NEET Counsel</button>
              <button onClick={() => onNavigate('downloads')} className="hover:text-white transition text-left">Academic Syllabus PDF</button>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-2xs font-bold uppercase tracking-wider text-white">Disclosures & RTI</h4>
            <div className="flex flex-col space-y-1 text-3xs font-medium">
              <button onClick={() => onNavigate('rti')} className="hover:text-white transition text-left">RTI Mandate & Minutes</button>
              <button onClick={() => onNavigate('iqac')} className="hover:text-white transition text-left">NAAC self-study records</button>
              <button onClick={() => onNavigate('grievance')} className="hover:text-white transition text-left">Grievance officers list</button>
              <button onClick={() => onNavigate('anti_ragging')} className="hover:text-white transition text-left">Anti-ragging guidelines</button>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-2xs font-bold uppercase tracking-wider text-white">Regulatory Partners</h4>
            <div className="flex flex-col space-y-1 text-3xs font-semibold text-slate-500">
              <span>• Ministry of AYUSH, Govt of India</span>
              <span>• National Commission for Homoeopathy</span>
              <span>• Central Council of Research (CCRH)</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-slate-800/80 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-3xs text-slate-600 gap-4">
          <span>© 2026 Burdwan Homoeopathic Medical College & Hospital. All Rights Reserved.</span>
          <div className="flex gap-4">
            <button onClick={() => onNavigate('privacy')} className="hover:underline">Privacy Policy</button>
            <button onClick={() => onNavigate('terms')} className="hover:underline">Terms of Service</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
