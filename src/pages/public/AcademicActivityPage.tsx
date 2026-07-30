import React, { useState } from 'react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Card } from '../../components/common/Card';
import {
  GraduationCap,
  BookOpen,
  Users,
  Award,
  HeartPulse,
  Sparkles,
  Search,
  Calendar,
  FileText,
  Activity,
  CheckCircle2,
  Building2,
  Stethoscope,
  Microscope,
  ShieldCheck,
  Megaphone
} from 'lucide-react';

interface AcademicActivityItem {
  id: string;
  title: string;
  category: string;
  iconName: string;
  description: string;
  highlights: string[];
  frequency: string;
}

export const AcademicActivityPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const activities: AcademicActivityItem[] = [
    {
      id: 'act-1',
      title: 'Seminars',
      category: 'Academic & Scientific',
      iconName: 'BookOpen',
      description: 'National, state, and university-level scientific symposia and departmental seminars organized regularly by faculty members and post-graduate scholars.',
      highlights: [
        'Annual WBUHS State Scientific Seminar',
        'Organon & Hahnemannian Philosophy Oration',
        'Departmental PG Scholar Presentations',
        'Inter-departmental Clinical Seminars'
      ],
      frequency: 'Monthly & Annual Events'
    },
    {
      id: 'act-2',
      title: 'Workshops',
      category: 'Hands-on Skill Training',
      iconName: 'Activity',
      description: 'Hands-on practical training workshops focusing on computer repertorization, clinical diagnostic tools, pharmacy potentization, and surgical dressing.',
      highlights: [
        'RADAR Opus & Hompath Software Training',
        'Clinical Case Taking & Rubric Synthesis',
        'Mother Tincture & Vehicle Trituration',
        'ECG & Basic Life Support (BLS) Workshops'
      ],
      frequency: 'Bi-Monthly'
    },
    {
      id: 'act-3',
      title: 'CME (Continuing Medical Education)',
      category: 'Faculty & Doctor Enhancement',
      iconName: 'GraduationCap',
      description: 'NCH and WBUHS-accredited Continuing Medical Education modules designed to upgrade clinical knowledge, drug research, and regulatory standards for faculty and medical officers.',
      highlights: [
        'Pharmacovigilance & Drug Proving Protocols',
        'Recent Advances in Homoeopathic Research',
        'AYUSH Clinical Practice Standards',
        'Diagnostic Imaging in Clinical Practice'
      ],
      frequency: 'Quarterly'
    },
    {
      id: 'act-4',
      title: 'Guest Lectures',
      category: 'Academic & Scientific',
      iconName: 'Users',
      description: 'Special interactive lectures delivered by eminent national homoeopaths, visiting university professors, and international clinical researchers.',
      highlights: [
        'Keynotes by National Awardee Clinicians',
        'Specialist sessions in Paediatrics & Dermatology',
        'Research methodology guidance sessions',
        'Interactive Q&A with Senior Hospital Consultants'
      ],
      frequency: 'Bi-Weekly'
    },
    {
      id: 'act-5',
      title: 'Medical Camps',
      category: 'Community & Clinical Outreach',
      iconName: 'Stethoscope',
      description: 'Free outpatient diagnostic, consultation, and medicine distribution camps organized in rural and semi-urban regions of Purba Bardhaman.',
      highlights: [
        'Free Homoeopathic Medicine Distribution',
        'Rural Health Screening Drives',
        'Geriatric & Child Health Clinics',
        'Chronic Disease Management OPD Camps'
      ],
      frequency: 'Weekly OPD Field Drives'
    },
    {
      id: 'act-6',
      title: 'Health Awareness Programs',
      category: 'Community & Clinical Outreach',
      iconName: 'Megaphone',
      description: 'Public health education drives focusing on epidemic prevention, vector-borne disease control, maternal nutrition, and seasonal wellness.',
      highlights: [
        'Dengue & Malaria Awareness Campaigns',
        'Anemia & Maternal Health Counselling',
        'Personal Hygiene & Sanitation Drives',
        'Preventive Homoeopathy Distribution'
      ],
      frequency: 'Monthly'
    },
    {
      id: 'act-7',
      title: 'Research Activities',
      category: 'Research & Innovation',
      iconName: 'Microscope',
      description: 'Structured clinical research, drug provings, clinical verification of rare remedies, and PG scholar dissertations under institutional ethics review.',
      highlights: [
        'Clinical Trials on Chronic Autoimmune Cases',
        'Standardization of Indigenous Plant Extracts',
        'PG Scholar WBUHS Research Dissertations',
        'Publications in Peer-Reviewed AYUSH Journals'
      ],
      frequency: 'Ongoing Academic Projects'
    },
    {
      id: 'act-8',
      title: 'Student Competitions',
      category: 'Student Development',
      iconName: 'Award',
      description: 'Competitive events to spur academic excellence, creative scientific presentation, rubric mastery, and public speaking confidence among scholars.',
      highlights: [
        'Hahnemannian Oration Contest',
        'Scientific Poster & Model Exhibition',
        'Inter-Batch Repertory Rubric Quiz',
        'Medical Debate & Elocution Competitions'
      ],
      frequency: 'Annual Calendar'
    },
    {
      id: 'act-9',
      title: 'Cultural Programs',
      category: 'Campus Life & Culture',
      iconName: 'Sparkles',
      description: 'Vibrant cultural celebrations showcasing student talents in music, dance, drama, and literature while fostering institutional camaraderie.',
      highlights: [
        'Annual College Social & Cultural Fest',
        'Rabindra Jayanti & Bhasha Dibas',
        'Teachers\' Day & Fresher Welcome',
        'Independence & Republic Day Ceremonies'
      ],
      frequency: 'Seasonal Events'
    },
    {
      id: 'act-10',
      title: 'NSS Activities',
      category: 'Community & Clinical Outreach',
      iconName: 'ShieldCheck',
      description: 'National Service Scheme (NSS) initiatives promoting social responsibility, environmental conservation, village adoption, and youth leadership.',
      highlights: [
        'Village Adoption & Rural Sanitation',
        'Campus Tree Plantation & Green Drives',
        'Swachh Bharat Abhiyan Cleanliness Camps',
        'Youth Leadership & Disaster Relief Training'
      ],
      frequency: 'Monthly Service Camps'
    },
    {
      id: 'act-11',
      title: 'Blood Donation Camps',
      category: 'Community & Clinical Outreach',
      iconName: 'HeartPulse',
      description: 'Voluntary blood donation drives organized in collaboration with Burdwan Medical College Blood Bank to maintain emergency blood reserves.',
      highlights: [
        'Annual Voluntary Donor Registration',
        'Over 200+ Units Collected Per Drive',
        'Health Checkup & Certificate for Donors',
        'Awareness on Blood Donation Benefits'
      ],
      frequency: 'Bi-Annual Drives'
    },
    {
      id: 'act-12',
      title: 'Community Outreach',
      category: 'Community & Clinical Outreach',
      iconName: 'Building2',
      description: 'Comprehensive outreach projects extending healthcare access, nutrition education, and medical support to underprivileged sections.',
      highlights: [
        'Mobile Health Unit Rural Visits',
        'School Health Checkup Programs',
        'Mother & Child Wellness Guidance',
        'Free Diagnostic Screening Camps'
      ],
      frequency: 'Continuous Operation'
    },
    {
      id: 'act-13',
      title: 'National Health Days',
      category: 'Academic & Scientific',
      iconName: 'Calendar',
      description: 'Observance of national and international health commemorative days through rallies, scientific lectures, and health pledges.',
      highlights: [
        'World Homoeopathy Day (April 10 - Hahnemann Jayanti)',
        'International Yoga Day (June 21)',
        'World Health Day & World AIDS Day',
        'National Doctors\' Day & Pharmacist Day'
      ],
      frequency: 'Scheduled Calendar Days'
    },
    {
      id: 'act-14',
      title: 'Clinical Case Discussions',
      category: 'Academic & Scientific',
      iconName: 'FileText',
      description: 'Weekly bed-side and auditorium clinical case conferences reviewing complex OPD/IPD cases, rare pathologies, and prescription outcomes.',
      highlights: [
        'Inter-Departmental OPD Case Reviews',
        'Difficult Miasmatic Case Analysis',
        'Follow-Up Verification & Posology Review',
        'Intern & PG Resident Case Defense'
      ],
      frequency: 'Weekly Sessions'
    },
    {
      id: 'act-15',
      title: 'Journal Club',
      category: 'Research & Innovation',
      iconName: 'BookOpen',
      description: 'Bi-weekly academic forum where faculty, PG scholars, and interns critically analyze recent research papers from international homoeopathic and medical journals.',
      highlights: [
        'Critical Appraisal of International Papers',
        'Review of High-Impact AYUSH Publications',
        'Evidence-Based Homoeopathy Debates',
        'Research Methodology Evaluation'
      ],
      frequency: 'Bi-Weekly Meetings'
    },
    {
      id: 'act-16',
      title: 'Faculty Development Programmes',
      category: 'Faculty & Doctor Enhancement',
      iconName: 'GraduationCap',
      description: 'Structured pedagogical training, curriculum design workshops, research paper writing sessions, and e-learning tools adoption for teaching staff.',
      highlights: [
        'Outcome-Based Education (OBE) Pedagogy',
        'Digital Classroom & LMS Integration',
        'Grant Writing & Research Methodology',
        'NCH Assessment & Accreditation Metrics'
      ],
      frequency: 'Bi-Annual Workshops'
    }
  ];

  const categories = ['ALL', 'Academic & Scientific', 'Hands-on Skill Training', 'Research & Innovation', 'Community & Clinical Outreach', 'Faculty & Doctor Enhancement', 'Student Development', 'Campus Life & Culture'];

  const filteredActivities = activities.filter((act) => {
    const matchesCategory = selectedCategory === 'ALL' || act.category === selectedCategory;
    const matchesSearch = act.title.toLowerCase().includes(search.toLowerCase()) || act.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      <Breadcrumb items={[{ label: 'Academic Activity' }]} />

      {/* Header Banner */}
      <div className="rounded-3xl bg-[#002147] text-white p-8 sm:p-12 shadow-xl space-y-4">
        <span className="px-3.5 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-black rounded-full uppercase tracking-wider border border-emerald-500/30">
          Academic Excellence & Co-Curricular Initiatives
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Academic Activity Calendar & Initiatives
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
          Explore the vibrant spectrum of scholarly activities, clinical workshops, research initiatives, community health outreach, and cultural programs conducted at Burdwan Homoeopathic Medical College & Hospital.
        </p>

        {/* Search & Filter */}
        <div className="pt-2 flex flex-col md:flex-row items-stretch md:items-center gap-3 max-w-3xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search academic activity, seminar, camp, or workshop..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white/10 text-white placeholder-slate-400 border border-white/20 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0 custom-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-2xs font-bold whitespace-nowrap transition ${
                  selectedCategory === cat ? 'bg-[#00A651] text-white' : 'bg-white/10 text-slate-200 hover:bg-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredActivities.map((act) => (
          <Card
            key={act.id}
            className="p-6 space-y-4 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded-md">
                  {act.category}
                </span>
                <span className="text-3xs font-bold text-slate-400">{act.frequency}</span>
              </div>

              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                {act.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {act.description}
              </p>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                <p className="text-3xs font-bold uppercase text-slate-400 tracking-wider">Key Highlights</p>
                <ul className="space-y-1">
                  {act.highlights.map((hl, i) => (
                    <li key={i} className="text-2xs text-slate-700 dark:text-slate-300 flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
