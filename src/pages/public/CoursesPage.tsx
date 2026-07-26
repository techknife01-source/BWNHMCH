import React, { useState, useEffect } from 'react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Link } from 'react-router-dom';
import { GraduationCap, Award, CheckCircle2, Clock, Users, Download, BookOpen, ChevronRight, FileText, Sparkles } from 'lucide-react';
import { courseApi, CourseItem } from '../../services/api/course.api';

export const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<CourseItem[]>([
    {
      id: 'bhms',
      code: 'BHMS-UG',
      title: 'Bachelor of Homoeopathic Medicine and Surgery (BHMS)',
      degree: 'Undergraduate Degree (U.G.)',
      duration: '5.5 Years (4.5 Years Academic + 1 Year Mandatory Rotatory Internship)',
      seats: 63,
      eligibility: '10+2 Science with Physics, Chemistry, Biology & English (Min 50% aggregate). Must qualify NEET-UG (AYUSH counseling).',
      fees: '₹45,000 / Year (State Quota) | ₹1,20,000 / Year (Management Quota)',
      description: 'The premier undergraduate medical degree program recognized by NCH and affiliated with WBUHS. Training encompasses pre-clinical, para-clinical, and clinical homoeopathic subjects along with extensive OPD/IPD rotatory hospital internship.',
      affiliation: 'WBUHS Kolkata & NCH New Delhi',
      syllabusUrl: '/downloads'
    },
    {
      id: 'md-mm',
      code: 'MD-HOM-MM',
      title: 'M.D. (Hom.) Materia Medica',
      degree: 'Postgraduate Degree (P.G.)',
      duration: '3 Years Full-Time Clinical Specialty',
      seats: 6,
      eligibility: 'Passed BHMS degree from an NCH recognized institution. Qualified AIAPGET (All India AYUSH Post Graduate Entrance Test).',
      fees: '₹95,000 / Year',
      description: 'Specialized postgraduate research & clinical residency focusing on drug provings, comparative materia medica, pharmacodynamics, and clinical case management.',
      affiliation: 'WBUHS Kolkata & NCH New Delhi',
      syllabusUrl: '/downloads'
    },
    {
      id: 'md-org',
      code: 'MD-HOM-ORG',
      title: 'M.D. (Hom.) Organon of Medicine & Homoeopathic Philosophy',
      degree: 'Postgraduate Degree (P.G.)',
      duration: '3 Years Full-Time Clinical Specialty',
      seats: 6,
      eligibility: 'Passed BHMS degree from an NCH recognized institution + AIAPGET Rank.',
      fees: '₹95,000 / Year',
      description: 'In-depth study of Hahnemannian principles, chronic miasms, logic, philosophy of science, and advanced posology in hospital care.',
      affiliation: 'WBUHS Kolkata & NCH New Delhi',
      syllabusUrl: '/downloads'
    },
    {
      id: 'md-rep',
      code: 'MD-HOM-REP',
      title: 'M.D. (Hom.) Repertory',
      degree: 'Postgraduate Degree (P.G.)',
      duration: '3 Years Full-Time Clinical Specialty',
      seats: 6,
      eligibility: 'Passed BHMS degree from an NCH recognized institution + AIAPGET Rank.',
      fees: '₹95,000 / Year',
      description: 'Focuses on Kentian, Boenninghausen, and Boger repertorial methodologies, computer-assisted repertorization, and case synthesis.',
      affiliation: 'WBUHS Kolkata & NCH New Delhi',
      syllabusUrl: '/downloads'
    },
    {
      id: 'cert-pharm',
      code: 'CERT-HP',
      title: 'Certificate Course in Homoeopathic Dispensing & Pharmacy',
      degree: 'Certificate Program',
      duration: '1 Year (Weekend Classes)',
      seats: 30,
      eligibility: '10+2 passed from any recognized Board.',
      fees: '₹18,000 (Lump sum)',
      description: 'Practical course covering homoeopathic potentization, vehicle preparation, prescription dispensing, and pharmacy inventory handling.',
      affiliation: 'State Medical Faculty of West Bengal',
      syllabusUrl: '/downloads'
    }
  ]);

  const [activeTab, setActiveTab] = useState<'ALL' | 'UG' | 'PG' | 'CERT'>('ALL');

  useEffect(() => {
    courseApi.getCourses()
      .then((res) => {
        if (res.data && res.data.length > 0) setCourses(res.data);
      })
      .catch(() => {
        // Fallback to structured courses
      });
  }, []);

  const filteredCourses = courses.filter((c) => {
    if (activeTab === 'UG') return c.code.includes('UG');
    if (activeTab === 'PG') return c.code.includes('MD');
    if (activeTab === 'CERT') return c.code.includes('CERT');
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      <Breadcrumb items={[{ label: 'Courses & Curriculum' }]} />

      {/* Page Banner Header */}
      <div className="rounded-3xl bg-[#002147] text-white p-8 sm:p-12 shadow-xl space-y-4">
        <span className="px-3.5 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-black rounded-full uppercase tracking-wider border border-emerald-500/30">
          Academic Curriculum & Degrees
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          UG, PG & Certificate Medical Programs
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
          Explore our NCH approved and WBUHS affiliated medical degree programs. We combine rigorous theoretical study with intensive clinical residency in our 50-bed teaching hospital.
        </p>

        {/* Filter Buttons */}
        <div className="pt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'ALL' ? 'bg-[#00A651] text-white' : 'bg-white/10 text-slate-200 hover:bg-white/20'
            }`}
          >
            All Programs
          </button>
          <button
            onClick={() => setActiveTab('UG')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'UG' ? 'bg-[#00A651] text-white' : 'bg-white/10 text-slate-200 hover:bg-white/20'
            }`}
          >
            Undergraduate (BHMS)
          </button>
          <button
            onClick={() => setActiveTab('PG')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'PG' ? 'bg-[#00A651] text-white' : 'bg-white/10 text-slate-200 hover:bg-white/20'
            }`}
          >
            Postgraduate (M.D. Hom.)
          </button>
          <button
            onClick={() => setActiveTab('CERT')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'CERT' ? 'bg-[#00A651] text-white' : 'bg-white/10 text-slate-200 hover:bg-white/20'
            }`}
          >
            Certificate & Diploma
          </button>
        </div>
      </div>

      {/* Courses Detailed List */}
      <div className="space-y-8">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="p-8 space-y-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
              <div className="space-y-1">
                <span className="text-2xs font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-md">
                  {course.degree}
                </span>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white pt-1">{course.title}</h2>
                <p className="text-xs text-slate-400 font-mono">Course Code: {course.code} • {course.affiliation}</p>
              </div>

              <Link to="/admission">
                <Button variant="primary" className="bg-[#002147] hover:bg-[#001530] text-white font-bold whitespace-nowrap">
                  <span>Admission Enquiry</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            {/* Metrics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                  <Clock className="w-3 h-3 text-blue-500" /> Duration
                </p>
                <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200 mt-1">{course.duration}</p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                  <Users className="w-3 h-3 text-emerald-500" /> Approved Intake
                </p>
                <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200 mt-1">{course.seats} Seats / Year</p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-500" /> Fees Structure
                </p>
                <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200 mt-1">{course.fees}</p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                  <GraduationCap className="w-3 h-3 text-purple-500" /> Entrance Exam
                </p>
                <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200 mt-1">NEET UG / AIAPGET</p>
              </div>
            </div>

            {/* Detailed Description & Eligibility */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Course Overview</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {course.description}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Eligibility Criteria</h3>
                <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 rounded-xl text-xs text-slate-700 dark:text-slate-300">
                  {course.eligibility}
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs">
              <Link to="/downloads" className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                <Download className="w-3.5 h-3.5" />
                <span>Download Detailed Syllabus PDF</span>
              </Link>
              <Link to="/admission" className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                View Admission Helpline & Dates →
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
