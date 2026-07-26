import React, { useState } from 'react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Card } from '../../components/common/Card';
import { Stethoscope, Calendar, Search, Award, CheckCircle2, ChevronRight, Phone, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DoctorProfile {
  id: string;
  name: string;
  photoUrl: string;
  qualifications: string;
  department: string;
  experienceYears: number;
  specialization: string;
  schedule: string;
  opdCounter: string;
  rating: number;
}

export const DoctorsPage: React.FC = () => {
  const doctors: DoctorProfile[] = [
    {
      id: 'doc1',
      name: 'Prof. (Dr.) Susmita Chatterjee',
      photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600',
      qualifications: 'B.H.M.S., M.D. (Hom.) Materia Medica, Ph.D.',
      department: 'Organon & General Medicine',
      experienceYears: 28,
      specialization: 'Chronic Disease Therapeutics, Miasmatic Evaluation, Autoimmune Disorders',
      schedule: 'Mon, Wed, Fri (10:00 AM - 1:00 PM)',
      opdCounter: 'OPD Counter 1',
      rating: 4.9
    },
    {
      id: 'doc2',
      name: 'Prof. (Dr.) S. K. Banerjea',
      photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600',
      qualifications: 'B.H.M.S. (Gold Medalist), M.D. (Hom.)',
      department: 'Homoeopathic Materia Medica',
      experienceYears: 32,
      specialization: 'Miasmatic Prescribing, Clinical Provings, Cardiac & Hepatic Therapeutics',
      schedule: 'Mon, Tue, Thu, Sat (9:00 AM - 1:00 PM)',
      opdCounter: 'OPD Counter 2',
      rating: 5.0
    },
    {
      id: 'doc3',
      name: 'Dr. M. Ghosh',
      photoUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=600',
      qualifications: 'B.H.M.S., M.D. (Hom.) Repertory',
      department: 'Repertory & Case Analysis',
      experienceYears: 20,
      specialization: 'Computer Repertorization, Pediatric Asthma, Allergic Rhinitis',
      schedule: 'Mon, Wed, Sat (10:00 AM - 2:00 PM)',
      opdCounter: 'OPD Counter 3',
      rating: 4.8
    },
    {
      id: 'doc4',
      name: 'Dr. N. Mukhopadhyay',
      photoUrl: 'https://images.unsplash.com/photo-1594824813566-88855ce78907?auto=format&fit=crop&q=80&w=600',
      qualifications: 'B.H.M.S., M.D. (O&G)',
      department: 'Obstetrics & Gynaecology',
      experienceYears: 22,
      specialization: 'Polycystic Ovarian Syndrome (PCOS), Dysmenorrhea, Infertility Management',
      schedule: 'Mon - Sat (10:00 AM - 2:00 PM)',
      opdCounter: 'OPD Counter 4',
      rating: 4.9
    },
    {
      id: 'doc5',
      name: 'Dr. D. Sen',
      photoUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=600',
      qualifications: 'B.H.M.S., M.D. (Pathology)',
      department: 'Dermatology & Skin OPD',
      experienceYears: 18,
      specialization: 'Psoriasis, Chronic Eczema, Vitiligo, Fungal Dermatitis',
      schedule: 'Tue, Thu, Sat (10:00 AM - 2:00 PM)',
      opdCounter: 'OPD Counter 5',
      rating: 4.7
    },
    {
      id: 'doc6',
      name: 'Dr. S. K. Mitra',
      photoUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=600',
      qualifications: 'B.H.M.S., M.S. (General Surgery)',
      department: 'Surgery & Wound Care OPD',
      experienceYears: 24,
      specialization: 'Non-Surgical Hemorrhoid & Fissure Management, Post-Op Homoeopathic Care',
      schedule: 'Tue, Fri (10:00 AM - 1:00 PM)',
      opdCounter: 'OPD Counter 6',
      rating: 4.8
    }
  ];

  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  const departments = ['All', 'Organon & General Medicine', 'Homoeopathic Materia Medica', 'Repertory & Case Analysis', 'Obstetrics & Gynaecology', 'Dermatology & Skin OPD', 'Surgery & Wound Care OPD'];

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase()) ||
                          doc.specialization.toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept === 'All' || doc.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      <Breadcrumb items={[{ label: 'Medical Consultants' }]} />

      {/* Header Banner */}
      <div className="rounded-3xl bg-[#002147] text-white p-8 sm:p-12 shadow-xl space-y-4">
        <span className="px-3.5 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-black rounded-full uppercase tracking-wider border border-emerald-500/30">
          Senior Homoeopathic Consultants & Professors
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Hospital Medical Officers & Faculty Specialists
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
          Meet our distinguished team of senior Homoeopathic consultants, professors, and medical officers who lead outpatient clinics and inpatient care at BHMC&H.
        </p>

        {/* Filter and Search Bar */}
        <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search doctor by name or specialty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white/10 text-white placeholder-slate-400 border border-white/20 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl text-xs focus:outline-none"
          >
            {departments.map((d, i) => (
              <option key={i} value={d} className="bg-slate-900 text-white">{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredDoctors.map((doc) => (
          <Card key={doc.id} className="p-6 space-y-4 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition">
            <div className="flex items-start space-x-4">
              <img
                src={doc.photoUrl}
                alt={doc.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500 shrink-0 shadow-md"
              />
              <div className="space-y-1 min-w-0 flex-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                  {doc.opdCounter}
                </span>
                <h3 className="text-base font-black text-slate-900 dark:text-white truncate pt-1">{doc.name}</h3>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-bold">{doc.qualifications}</p>
                <p className="text-2xs text-slate-400 font-semibold">{doc.department} • {doc.experienceYears}+ Yrs Clinical Practice</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1 text-xs">
              <p className="text-slate-500 font-bold text-[10px] uppercase">Specialization:</p>
              <p className="text-slate-700 dark:text-slate-300 text-xs">{doc.specialization}</p>
            </div>

            <div className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-300">
              <Calendar className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>OPD Schedule: <strong className="text-slate-900 dark:text-white">{doc.schedule}</strong></span>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <Link
                to="/hospital"
                className="flex-1 py-2.5 bg-[#002147] hover:bg-[#001530] text-white text-xs font-bold rounded-xl text-center transition shadow-xs"
              >
                Book OPD Consultation
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
