import React, { useState, useEffect } from 'react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Card } from '../../components/common/Card';
import { Building2, Users, FlaskConical, BookOpen, ShieldCheck, FileText, ChevronRight, Search, X, Award, Sparkles } from 'lucide-react';
import { departmentApi } from '../../services/api/department.api';

interface DepartmentDetail {
  id: string;
  name: string;
  code: string;
  hod: string;
  facultyCount: number;
  description: string;
  laboratories: string[];
  facilities: string[];
  researchAreas: string[];
  publications: string[];
}

export const DepartmentsPage: React.FC = () => {
  const [departments, setDepartments] = useState<DepartmentDetail[]>([
    {
      id: 'org',
      name: 'Organon of Medicine & Homoeopathic Philosophy',
      code: 'DEPT-ORG',
      hod: 'Prof. (Dr.) A. K. Roy, M.D. (Hom.)',
      facultyCount: 6,
      description: 'Teaches fundamental principles of Hahnemannian Homoeopathy, chronic disease theory, logic, and philosophy of medicine.',
      laboratories: ['Organon Philosophy Seminar Room', 'Computerized Logic & Case Analysis Lab'],
      facilities: ['Audio-Visual Smart Classroom', 'Historical Rare Books Archive'],
      researchAreas: ['Miasmatic Analysis of Chronic Autoimmune Disorders', 'Posology in High Potencies'],
      publications: ['Hahnemannian Principles in Modern Clinical Practice (WBUHS Journal 2025)']
    },
    {
      id: 'mm',
      name: 'Homoeopathic Materia Medica',
      code: 'DEPT-MM',
      hod: 'Prof. (Dr.) S. N. Bhattacharya, M.D. (Hom.)',
      facultyCount: 7,
      description: 'Focuses on drug provings, remedy characteristics, comparative drug study, and clinical verification of Homoeopathic remedies.',
      laboratories: ['Drug Proving Laboratory', 'Botanical Drug Specimen Display Room'],
      facilities: ['Herbal Garden Access', 'Interactive Drug Proving Database'],
      researchAreas: ['Indigenous Indian Plant Drug Standardization', 'Comparative Materia Medica of Nosodes'],
      publications: ['Clinical Verification of Carduus Marianus in Hepatic Disorders (AYUSH Research 2024)']
    },
    {
      id: 'rep',
      name: 'Repertory & Case Taking',
      code: 'DEPT-REP',
      hod: 'Dr. M. Ghosh, M.D. (Hom.)',
      facultyCount: 5,
      description: 'Training students in clinical case taking, symptom evaluation, repertorial analysis, and computer repertorization.',
      laboratories: ['Computer-Assisted Repertorization Lab (RADAR / Hompath)'],
      facilities: ['Digital Case Record Archive', '10 Student Workstations'],
      researchAreas: ['Comparative Repertorial Analysis in Pediatric Asthma', 'Synthesis of Boger Synoptic Key'],
      publications: ['Modern Repertorial Approaches in Chronic Dermatological Conditions']
    },
    {
      id: 'pharm',
      name: 'Homoeopathic Pharmacy',
      code: 'DEPT-PHARM',
      hod: 'Dr. R. Bannerjee, M.D. (Hom.)',
      facultyCount: 4,
      description: 'Covers potentization, vehicle testing, drug standardization, and Homoeopathic Pharmacopoeia of India (HPI) compliance.',
      laboratories: ['HPLC & Spectrophotometry Lab', 'Vehicle Preparation & Trituration Hall'],
      facilities: ['Pharmacognosy Herbarium', 'Distillation & Extraction Apparatus'],
      researchAreas: ['Quality Control Metrics for Mother Tinctures', 'Standardization of Bio-Chemic Remedies'],
      publications: ['Quality Evaluation of Marketed Calendula Officinalis Tinctures']
    },
    {
      id: 'anat',
      name: 'Anatomy',
      code: 'DEPT-ANAT',
      hod: 'Dr. P. Das, M.S. (Anatomy)',
      facultyCount: 4,
      description: 'Provides comprehensive gross anatomy dissection, histology, embryology, and neuroanatomy education.',
      laboratories: ['Human Cadaveric Dissection Hall', 'Histology Microscopy Lab', 'Anatomy Embryology Museum'],
      facilities: ['3D Anatomical Models Gallery', 'Cold Storage Mortuary Unit'],
      researchAreas: ['Clinical Neuroanatomy Correlations', 'Anatomical Variants in Head & Neck'],
      publications: ['Morphometric Analysis of Foramen Magnum in Eastern Indian Population']
    },
    {
      id: 'phys',
      name: 'Physiology & Biochemistry',
      code: 'DEPT-[#PHYS]',
      hod: 'Dr. S. Chatterjee, M.D. (Physiology)',
      facultyCount: 4,
      description: 'Study of human bodily functions, hematology, cardiovascular dynamics, and metabolic biochemistry.',
      laboratories: ['Hematology Practical Lab', 'Clinical Biochemistry Analysis Room'],
      facilities: ['ECG & Spirometry Testing Workstations', 'Microscope Bay for 60 Students'],
      researchAreas: ['Autonomic Nervous System Function in High Potency Homoeopathic Provings'],
      publications: ['Erythrocyte Sedimentation Rate Variations in Chronic Allergic Rhinitis']
    },
    {
      id: 'path',
      name: 'Pathology & Microbiology',
      code: 'DEPT-PATH',
      hod: 'Dr. D. Sen, M.D. (Pathology)',
      facultyCount: 5,
      description: 'Covers general pathology, clinical microbiology, parasitology, hematology, and histopathology.',
      laboratories: ['Microbiology Culture Lab', 'Clinical Diagnostic Hematology Lab'],
      facilities: ['Autoclave & Incubation Units', 'Blood Grouping & Serology Bay'],
      researchAreas: ['Antimicrobial Susceptibility Testing under Homoeopathic Dilutions'],
      publications: ['In-vitro Inhibitory Effects of Syzygium Jambolanum on Bacterial Cultures']
    },
    {
      id: 'fmt',
      name: 'Forensic Medicine & Toxicology',
      code: 'DEPT-FMT',
      hod: 'Dr. K. Nandi, M.D. (FMT)',
      facultyCount: 3,
      description: 'Medical jurisprudence, toxicology, forensic post-mortem protocols, and legal responsibilities of medical practitioners.',
      laboratories: ['Toxicology Specimen & Weapon Museum'],
      facilities: ['Poisons & Venom Identification Displays', 'Court Trial Simulation Setup'],
      researchAreas: ['Heavy Metal Toxicities & Homoeopathic Antidotes'],
      publications: ['Legal Documentation Standards in AYUSH Hospital Practice']
    },
    {
      id: 'med',
      name: 'Practice of Medicine',
      code: 'DEPT-MED',
      hod: 'Dr. T. K. Maiti, M.D. (Hom.)',
      facultyCount: 6,
      description: 'Clinical training in internal medicine, cardiology, gastroenterology, neurology, and integrative Homoeopathic therapeutics.',
      laboratories: ['Clinical OPD Examination Bays', 'IPD Ward Demonstration Rounds'],
      facilities: ['Defibrillator & ECG Diagnostics', 'Nebulization & Oxygen Support Units'],
      researchAreas: ['Homoeopathic Management of Non-Alcoholic Fatty Liver Disease (NAFLD)'],
      publications: ['Long-Term Observational Study of Rhus Tox in Osteoarthritis']
    },
    {
      id: 'surg',
      name: 'Surgery & Homoeopathic Therapeutics',
      code: 'DEPT-SURG',
      hod: 'Dr. S. K. Mitra, M.S. (Surgery)',
      facultyCount: 4,
      description: 'General surgical principles, wound care, operative procedures, pre/post-operative homoeopathic management.',
      laboratories: ['Minor OT & Suture Practice Bay'],
      facilities: ['Surgical Instrument Gallery', 'Sterilization Autoclave Suite'],
      researchAreas: ['Homoeopathic Management of Post-Surgical Healing and Fissures'],
      publications: ['Role of Silicea in Chronic Fistula-in-Ano Management']
    },
    {
      id: 'gyn',
      name: 'Obstetrics & Gynaecology',
      code: 'DEPT-GYN',
      hod: 'Dr. N. Mukhopadhyay, M.D. (O&G)',
      facultyCount: 5,
      description: 'Antenatal care, labor management, gynaecological disorders, and Homoeopathic therapeutics in female healthcare.',
      laboratories: ['Labor Room & Antenatal Care Bay'],
      facilities: ['Foetal Doppler & Ultrasound Suites', 'Pelvic Model Demonstration Hall'],
      researchAreas: ['Homoeopathic Therapeutics in Polycystic Ovarian Syndrome (PCOS)'],
      publications: ['Clinical Efficacy of Pulsatilla Nigricans in Primary Dysmenorrhea']
    },
    {
      id: 'cm',
      name: 'Community Medicine',
      code: 'DEPT-CM',
      hod: 'Dr. B. Biswas, M.D. (Community Medicine)',
      facultyCount: 3,
      description: 'Epidemiology, public health, preventive medicine, maternal & child health, national health programs.',
      laboratories: ['Public Health & Hygiene Museum'],
      facilities: ['Mobile Rural Health Camp Unit', 'Epidemiological Statistical Lab'],
      researchAreas: ['Vector-Borne Disease Prevention in Rural Bardhaman'],
      publications: ['Health Awareness & Homoeopathic Coverage in Rural Purba Bardhaman']
    }
  ]);

  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState<DepartmentDetail | null>(null);

  useEffect(() => {
    departmentApi.getDepartments()
      .then((res) => {
        if (res.data && res.data.length > 0) {
          // Merge API data if matching
        }
      })
      .catch(() => {
        // Fallback to initial structured details
      });
  }, []);

  const filteredDepts = departments.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.hod.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      <Breadcrumb items={[{ label: 'Academic Departments' }]} />

      {/* Banner Header */}
      <div className="rounded-3xl bg-[#002147] text-white p-8 sm:p-12 shadow-xl space-y-4">
        <span className="px-3.5 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-black rounded-full uppercase tracking-wider border border-emerald-500/30">
          12 NCH Recognized Faculties
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Academic & Clinical Departments
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
          Our departments combine fundamental medical sciences with deep Homoeopathic research. Each department features specialized laboratories, experienced clinical faculty, and dedicated research publications.
        </p>

        {/* Search Bar */}
        <div className="pt-2 max-w-md relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search department, HOD name, or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white/10 text-white placeholder-slate-400 border border-white/20 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDepts.map((dept) => (
          <Card
            key={dept.id}
            className="p-6 space-y-4 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                  {dept.code}
                </span>
                <span className="text-2xs text-slate-400 font-bold">{dept.facultyCount} Faculty Doctors</span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white line-clamp-2">
                {dept.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                {dept.description}
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-500">
                  <span className="font-bold text-slate-700 dark:text-slate-300">HOD:</span> {dept.hod}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedDept(dept)}
              className="mt-4 w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-[#002147] hover:text-white dark:hover:bg-[#00A651] text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1"
            >
              <span>Explore Facilities & Labs</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </Card>
        ))}
      </div>

      {/* Detail Modal / Drawer */}
      {selectedDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full p-8 space-y-6 max-h-[90vh] overflow-y-auto relative custom-scrollbar">
            <button
              onClick={() => setSelectedDept(null)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl bg-slate-100 dark:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-2xs font-bold rounded-md uppercase">
                {selectedDept.code}
              </span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">{selectedDept.name}</h2>
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Head of Department: {selectedDept.hod}</p>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedDept.description}
            </p>

            {/* Laboratories */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FlaskConical className="w-4 h-4 text-emerald-500" />
                <span>Department Laboratories</span>
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
                {selectedDept.laboratories.map((lab, i) => (
                  <li key={i} className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 font-medium">
                    • {lab}
                  </li>
                ))}
              </ul>
            </div>

            {/* Research & Publications */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-500" />
                <span>Research Areas & Publications</span>
              </h4>
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {selectedDept.publications.map((pub, i) => (
                  <p key={i} className="p-2.5 bg-blue-50/50 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900/50">
                    "{pub}"
                  </p>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedDept(null)}
                className="px-5 py-2.5 bg-[#002147] text-white text-xs font-bold rounded-xl hover:bg-[#001530]"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
