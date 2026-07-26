import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { APP_CONSTANTS } from '../../constants/app.constants';
import { Award, ShieldCheck, HeartHandshake, BookOpen, CheckCircle2, Building2, MapPin, Users, GraduationCap, Landmark, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { aboutApi, AboutCollegeData } from '../../services/api/about.api';

export const AboutPage: React.FC = () => {
  const [aboutData, setAboutData] = useState<AboutCollegeData>({
    history: `Established in 1978 in the historical city of Bardhaman, Burdwan Homoeopathic Medical College & Hospital (BHMC&H) was founded by visionary homoeopathic physicians and philanthropists. Over four decades of academic rigor, clinical excellence, and ethical medical practice have transformed the college into one of Eastern India's most prestigious Homoeopathic institutions.`,
    mission: `To impart scientific, ethical, and high-quality Homoeopathic medical education; to foster innovative clinical research; and to deliver compassionate, affordable healthcare to all strata of society.`,
    vision: `To lead as a benchmark center of excellence in Homoeopathic medical science, integrative clinical practice, and holistic patient wellness.`,
    objectives: [
      'Provide comprehensive undergraduate BHMS and postgraduate MD clinical education.',
      'Maintain an active 50-bed hospital providing subsidized outpatient and inpatient care.',
      'Promote research in drug standardization, potentization, and chronic disease management.',
      'Conduct rural health outreach camps in Purba Bardhaman and neighboring districts.'
    ],
    infrastructure: [
      '50-Bed Attached Teaching Hospital with 24/7 Emergency & OT',
      'Central Digital Library with 12,000+ Homoeopathic & Medical Volumes',
      'Hi-Tech Homoeopathic Pharmacy & Drug Standardization Laboratory',
      'Anatomy Dissection Hall, Pathology Museum, and Physiology Lab',
      'Herbal Botanical Garden featuring 250+ Medicinal Plant Species',
      'Air-Conditioned 250-Seater Auditorium & ICT-Enabled Classrooms'
    ],
    recognition: [
      'National Commission for Homoeopathy (NCH), Ministry of AYUSH, Govt of India',
      'Department of Health & Family Welfare, Government of West Bengal',
      'West Bengal University of Health Sciences (WBUHS), Kolkata'
    ],
    affiliation: 'West Bengal University of Health Sciences (WBUHS), College Code: 104',
    campusArea: '8.5 Acres Green Campus in Rajbati, Purba Bardhaman',
    establishedYear: 1978
  });

  useEffect(() => {
    aboutApi.getAboutDetails()
      .then((res) => {
        if (res.data) setAboutData(res.data);
      })
      .catch(() => {
        // Fallback to structured initial data
      });
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      <Breadcrumb items={[{ label: 'About College' }]} />

      {/* Hero Intro Header */}
      <div className="rounded-3xl bg-[#002147] text-white p-8 sm:p-12 shadow-xl relative overflow-hidden space-y-6">
        <div className="absolute -top-10 -right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-4 relative z-10">
          <span className="px-3.5 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-black rounded-full uppercase tracking-wider border border-emerald-500/30">
            ESTD {aboutData.establishedYear} • 45+ Years Educational Heritage
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            About {APP_CONSTANTS.INSTITUTION_NAME}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            A premier institution committed to nurturing Homoeopathic physicians through rigorous academic curricula, hands-on clinical training, and community-centered healthcare.
          </p>
        </div>

        <div className="pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
          <div>
            <p className="text-2xl font-black text-emerald-400">BHMS & MD</p>
            <p className="text-2xs text-slate-400 font-bold uppercase">Degree Programs</p>
          </div>
          <div>
            <p className="text-2xl font-black text-blue-400">50-Bed</p>
            <p className="text-2xs text-slate-400 font-bold uppercase">Teaching Hospital</p>
          </div>
          <div>
            <p className="text-2xl font-black text-amber-400">12,000+</p>
            <p className="text-2xs text-slate-400 font-bold uppercase">Library Volumes</p>
          </div>
          <div>
            <p className="text-2xl font-black text-emerald-300">100%</p>
            <p className="text-2xs text-slate-400 font-bold uppercase">NCH Approved</p>
          </div>
        </div>
      </div>

      {/* History & Mission Vision */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-8 space-y-4 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center space-x-3 text-[#002147] dark:text-[#00A651]">
            <Landmark className="w-6 h-6" />
            <h2 className="text-xl font-black">Our Institutional Legacy</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {aboutData.history}
          </p>
        </Card>

        <div className="space-y-6">
          <div className="bg-emerald-950 text-white p-6 rounded-3xl space-y-2 border border-emerald-800">
            <h3 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Our Mission</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              "{aboutData.mission}"
            </p>
          </div>

          <div className="bg-slate-900 text-white p-6 rounded-3xl space-y-2 border border-slate-800">
            <h3 className="text-xs font-black uppercase tracking-wider text-blue-400 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <span>Our Vision</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              "{aboutData.vision}"
            </p>
          </div>
        </div>
      </div>

      {/* Key Recognition & Affiliations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 space-y-3 border border-slate-200/80 dark:border-slate-800">
          <Award className="h-8 w-8 text-blue-600" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">NCH Recognition</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Fully recognized by National Commission for Homoeopathy (NCH), Ministry of Ayush, Govt of India for undergraduate and postgraduate seats.
          </p>
        </Card>
        <Card className="p-6 space-y-3 border border-slate-200/80 dark:border-slate-800">
          <ShieldCheck className="h-8 w-8 text-emerald-600" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">WBUHS Affiliation</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Affiliated to West Bengal University of Health Sciences (WBUHS), Kolkata for curriculum, examinations, and degree conferral.
          </p>
        </Card>
        <Card className="p-6 space-y-3 border border-slate-200/80 dark:border-slate-800">
          <HeartHandshake className="h-8 w-8 text-amber-600" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Govt of West Bengal</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Recognized by Health & Family Welfare Department, Govt of West Bengal with attached 50-bed clinical teaching hospital.
          </p>
        </Card>
      </div>

      {/* Campus Infrastructure */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Campus Facilities & Infrastructure</h2>
            <p className="text-xs text-slate-400 mt-1">{aboutData.campusArea}</p>
          </div>
          <Link to="/gallery" className="text-xs font-bold text-[#002147] dark:text-[#00A651] hover:underline flex items-center gap-1">
            <span>View Gallery</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aboutData.infrastructure.map((item, idx) => (
            <div key={idx} className="flex items-start space-x-3 p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Desk Navigation */}
      <div className="bg-[#002147] text-white p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h3 className="text-lg font-black">Principal Executive Desk</h3>
          <p className="text-xs text-slate-300">Read official message, qualifications, and vision from Principal Prof. (Dr.) Susmita Chatterjee.</p>
        </div>
        <Link
          to="/principal-desk"
          className="px-6 py-3 bg-[#00A651] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition shadow-md whitespace-nowrap"
        >
          Visit Principal Desk →
        </Link>
      </div>
    </div>
  );
};
