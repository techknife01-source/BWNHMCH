import React, { useState, useEffect } from 'react';
import { Award, GraduationCap, CheckCircle2, Mail, Phone, Calendar, BookOpen, Quote, ShieldCheck, HeartPulse, Building2, User } from 'lucide-react';
import { principalApi, PrincipalDeskData } from '../../services/api/principal.api';

export const PrincipalDeskPage: React.FC = () => {
  const [data, setData] = useState<PrincipalDeskData>({
    name: 'Prof. (Dr.) Susmita Chatterjee',
    designation: 'Principal & Ex-Officio Superintendent',
    photoUrl: '/images/principal.jpg',
    qualifications: ['DHMS (West Bengal Council of Homoeopathic Medicine)', 'MD (Organon of Medicine)'],
    experienceYears: 28,
    message: `It gives me immense pride and pleasure to welcome you to BURDWAN HOMOEOPATHIC MEDICAL COLLEGE & HOSPITAL. Homoeopathy is not merely a system of medicine; it is a gentle, individualistic, and holistic science of healing founded by Dr. Samuel Hahnemann. 

Our institution is committed to nurturing compassionate healthcare leaders who combine rigorous clinical training with deep empathetic care. With our 30-bed attached hospital, advanced research labs, and distinguished faculty members, we ensure every student acquires the highest standard of academic excellence and clinical acumen.

We invite aspiring scholars to join our vibrant academic community and embrace the noble path of homoeopathic medicine.`,
    vision: `To stand as a global beacon of excellence in Homoeopathic medical education, integrative clinical research, and accessible community healthcare.`,
    achievements: [
      'Published over 35 research papers in indexed Homoeopathic and AYUSH journals',
      'Awarded Hahnemann National Award for Clinical Excellence in 2022',
      'Pioneered integrative Homoeopathic OPD research protocols in Purba Bardhaman',
      'Keynote speaker at World Homoeopathy Summit, New Delhi',
    ],
    awards: [
      'National Healthcare Leadership Award - AYUSH Sector 2024',
      'Best Homoeopathic Academic Administrator Award - WBUHS',
      'Life Member of Homoeopathic Medical Association of India (HMAI)'
    ],
    contactEmail: 'drsusmita01@gmail.com',
    phone: '9434238508',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Attempt to fetch live CMS content if available
    principalApi.getPrincipalDesk()
      .then((res) => {
        if (res.data) setData(res.data);
      })
      .catch(() => {
        // Fallback to initial structured data
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Banner Header */}
      <div className="max-w-7xl mx-auto rounded-3xl bg-[#002147] text-white p-8 sm:p-12 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden border-4 border-emerald-400 shadow-2xl shrink-0">
            <img src={data.photoUrl} alt={data.name} className="w-full h-full object-cover" />
          </div>
          <div className="space-y-3 text-center md:text-left">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full uppercase tracking-wider border border-emerald-500/30">
              Executive Leadership
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">{data.name}</h1>
            <p className="text-emerald-400 text-sm font-semibold">{data.designation}</p>
            <div className="flex flex-wrap gap-2 pt-2 justify-center md:justify-start">
              {data.qualifications.map((q, i) => (
                <span key={i} className="text-2xs font-bold bg-white/10 px-2.5 py-1 rounded-lg text-slate-200">
                  {q}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Principal Message & Vision */}
        <div className="lg:col-span-2 space-y-8">
          {/* Message Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center space-x-3 text-[#002147] dark:text-[#00A651]">
              <Quote className="w-8 h-8" />
              <h2 className="text-xl font-black">Message from the Desk of Principal</h2>
            </div>
            <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line font-normal">
              {data.message}
            </div>
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-extrabold text-slate-900 dark:text-white text-sm">{data.name}</p>
                <p className="text-xs text-slate-400 font-medium">BURDWAN HOMOEOPATHIC MEDICAL COLLEGE & HOSPITAL</p>
              </div>
              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-900">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Executive Office</span>
              </div>
            </div>
          </div>

          {/* Institutional Vision Card */}
          <div className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white rounded-3xl p-8 shadow-md space-y-4">
            <div className="flex items-center space-x-3 text-emerald-400">
              <Building2 className="w-6 h-6" />
              <h3 className="text-lg font-bold">Principal's Vision for Academic & Clinical Growth</h3>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed">
              "{data.vision}"
            </p>
          </div>
        </div>

        {/* Right Sidebar: Qualifications, Experience & Contact */}
        <div className="space-y-6">
          {/* Experience Stat Box */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-500" />
              <span>Leadership Overview</span>
            </h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                <p className="text-3xl font-black text-[#002147] dark:text-[#00A651]">{data.experienceYears}+</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Years Experience</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                <p className="text-3xl font-black text-emerald-600">35+</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Research Papers</p>
              </div>
            </div>
          </div>

          {/* Key Achievements */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-blue-500" />
              <span>Major Achievements & Honors</span>
            </h3>
            <ul className="space-y-2.5">
              {data.achievements.map((ach, i) => (
                <li key={i} className="flex items-start space-x-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{ach}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Office Contact Info */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Principal's Secretariat</h3>
            <div className="flex items-center space-x-3 text-xs text-slate-600 dark:text-slate-300">
              <Mail className="w-4 h-4 text-blue-500" />
              <span>{data.contactEmail}</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-slate-600 dark:text-slate-300">
              <Phone className="w-4 h-4 text-emerald-500" />
              <span>{data.phone}</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-slate-600 dark:text-slate-300">
              <Calendar className="w-4 h-4 text-amber-500" />
              <span>Visitors Hour: Mon - Fri (2:00 PM - 4:00 PM)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
