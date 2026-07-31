import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  GraduationCap,
  Stethoscope,
  BookOpen,
  Award,
  ArrowRight,
  Calendar,
  FileText,
  Users,
  CheckCircle,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { APP_CONSTANTS } from '../../constants/app.constants';

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 py-20 lg:py-28 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="accent" className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3.5 py-1 text-xs">
                ✨ NCH Recognized & WBUHS Affiliated Institution
              </Badge>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
                Empowering Excellence in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Homoeopathic Healthcare</span> & Education
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                Serving the nation since {APP_CONSTANTS.ESTD_YEAR} with exemplary Bachelor of Homoeopathic Medicine and Surgery (BHMS) degree programs, state-of-the-art clinical teaching hospital, and cutting-edge research laboratories.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link to="/admission">
                  <Button variant="primary" size="lg" className="bg-blue-600 hover:bg-blue-500 text-white font-bold">
                    <span>Admission Enquiry 2026-27</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/hospital">
                  <Button variant="outline" size="lg" className="border-slate-700 text-slate-200 hover:bg-slate-800">
                    <Stethoscope className="h-4 w-4 text-emerald-400" />
                    <span>Hospital OPD Roster</span>
                  </Button>
                </Link>
              </div>
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80">
                <div>
                  <p className="text-2xl font-black text-white">{new Date().getFullYear() - 1978}+</p>
                  <p className="text-xs text-slate-400 font-medium">Years Legacy</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-emerald-400">100%</p>
                  <p className="text-xs text-slate-400 font-medium">NCH Compliant</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-blue-400">250+</p>
                  <p className="text-xs text-slate-400 font-medium">Daily OPD Patients</p>
                </div>
              </div>
            </div>

            {/* Hero Quick Card Panel */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">Notice & Desk Quick Gate</h3>
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="space-y-3">
                <Link to="/notice" className="block rounded-2xl border border-slate-800 bg-slate-800/50 p-4 hover:border-blue-500 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-400">Academic Notice</span>
                    <span className="text-[10px] text-slate-500">Today</span>
                  </div>
                  <p className="mt-1 text-xs font-medium text-slate-200">BHMS Final Year University Examination Form Fill-up Schedule</p>
                </Link>

                <Link to="/login/student" className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-800/30 p-4 hover:bg-slate-800 transition-all">
                  <div className="flex items-center space-x-3">
                    <GraduationCap className="h-5 w-5 text-emerald-400" />
                    <div>
                      <p className="text-xs font-bold text-slate-200">Student ERP Portal</p>
                      <p className="text-[10px] text-slate-400">Access marksheets, attendance & rosters</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-500" />
                </Link>

                <Link to="/login/faculty" className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-800/30 p-4 hover:bg-slate-800 transition-all">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-amber-400" />
                    <div>
                      <p className="text-xs font-bold text-slate-200">Faculty & Consultant Desk</p>
                      <p className="text-[10px] text-slate-400">Mark attendance, log OPD clinical cases</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-500" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* College Overview */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400">Institutional Heritage</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Pioneering Homoeopathic Science & Clinical Care in West Bengal
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Established in {APP_CONSTANTS.ESTD_YEAR}, {APP_CONSTANTS.INSTITUTION_NAME} stands as a beacon of academic excellence in alternative medicine. Affiliated with West Bengal University of Health Sciences (WBUHS) and recognized by the National Commission for Homoeopathy (NCH), New Delhi.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>5.5 Years BHMS Degree</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>In-house Clinical Teaching Hospital</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Medicinal Herbal Botanical Garden</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Digitalized High-Tech Pathology Lab</span>
              </div>
            </div>
          </div>

          <Card className="p-8 border-l-4 border-l-blue-600 space-y-4">
            <div className="flex items-center space-x-3">
              <Award className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Principal's Desk</h3>
                <p className="text-xs text-slate-400">Prof. (Dr.) S. N. Bhattacharya, M.D. (Hom.)</p>
              </div>
            </div>
            <blockquote className="text-xs italic text-slate-600 dark:text-slate-300 leading-relaxed">
              "Our mission is to foster compassion, scientific temper, and rigorous clinical aptitude in our student doctors. Homoeopathy holds standard answers to modern health challenges, and our digital ecosystem ensures our graduates excel both academically and clinically."
            </blockquote>
          </Card>
        </div>
      </section>

      {/* Academic Departments */}
      <section className="bg-slate-100/60 dark:bg-slate-900/40 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Curriculum & Faculties</span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Core Academic Departments</h2>
            <p className="text-xs text-slate-500">Excellence across preclinical, paraclinical and clinical homoeopathic subjects.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Organon of Medicine", desc: "Principles and philosophy of Hahnemannian homoeopathic science." },
              { name: "Homoeopathic Materia Medica", desc: "In-depth study of drug proving, symptomatology and remedies." },
              { name: "Reperatory & Case Taking", desc: "Clinical case analysis, synthesis and repertorial indexing." },
              { name: "Homoeopathic Pharmacy", desc: "Pharmacognosy, potentization, standards and dispensing." },
              { name: "Anatomy & Physiology", desc: "Human structural anatomy and functional bio-systems." },
              { name: "Practice of Medicine", desc: "Clinical diagnostics, systemic pathology and therapeutics." },
            ].map((dept, idx) => (
              <Card key={idx} className="p-6 hover:shadow-md transition-all space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 font-bold text-sm">
                  0{idx + 1}
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">{dept.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{dept.desc}</p>
                <Link to="/departments" className="inline-flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline pt-2">
                  <span>Explore Faculty</span>
                  <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Hospital Overview */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-blue-900 to-slate-900 text-white p-8 lg:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <Badge variant="accent" className="bg-emerald-500/20 text-emerald-300 border-none">24x7 Clinical Services</Badge>
            <h2 className="text-2xl sm:text-3xl font-black">Homoeopathic Medical College Hospital</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Providing compassionate, low-cost homoeopathic healthcare to thousands of patients annually. Features dedicated IPD beds, daily specialized OPD clinics, pathology diagnostic laboratory, and emergency response desk.
            </p>
          </div>
          <div className="flex flex-col space-y-3 shrink-0">
            <Link to="/hospital">
              <Button variant="accent" size="lg" className="w-full bg-emerald-600 hover:bg-emerald-500">
                <span>View OPD Doctor Schedule</span>
              </Button>
            </Link>
            <Link to="/doctors">
              <Button variant="outline" size="lg" className="w-full border-slate-700 text-slate-200">
                <span>Consultant Roster</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
