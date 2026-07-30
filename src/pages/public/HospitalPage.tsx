import React, { useState, useEffect } from 'react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import {
  Stethoscope,
  BedDouble,
  HeartPulse,
  Clock,
  Calendar,
  Phone,
  ShieldAlert,
  FlaskConical,
  Pill,
  Activity,
  CheckCircle2,
  X,
  ChevronRight,
  Edit3,
  Save,
  RotateCcw,
  Building2,
  Microscope,
  FileText,
  UserCheck,
  Check,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Users,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { OpdTicketModal } from '../../components/opd/OpdTicketModal';
import { OpdTicketData } from '../../services/opdTicketService';
import { HospitalStaffDirectory } from '../../modules/hospital/components/HospitalStaffDirectory';

interface HospitalPageProps {
  defaultTab?: 'opd' | 'ipd' | 'investigations' | 'facilities' | 'staff';
}

interface OpdDeptStat {
  id: string;
  name: string;
  doctor: string;
  dailyFootfall: number;
  roomNo: string;
  timing: string;
  status: 'ACTIVE' | 'ON_DUTY' | 'EMERGENCY';
}

interface IpdBedOccupancy {
  id: string;
  wardName: string;
  category: string;
  totalBeds: number;
  occupiedBeds: number;
  wardInCharge: string;
  lastUpdated: string;
}

const DEFAULT_OPD_DEPARTMENTS: OpdDeptStat[] = [
  { id: 'opd-1', name: 'General Medicine', doctor: 'Dr. T. K. Maiti, M.D. (Hom.)', dailyFootfall: 55, roomNo: 'OPD Room 101', timing: 'Mon - Sat (09:00 AM - 02:00 PM)', status: 'ACTIVE' },
  { id: 'opd-2', name: 'Paediatrics', doctor: 'Dr. S. Chatterjee, M.D. (Hom.)', dailyFootfall: 35, roomNo: 'OPD Room 102', timing: 'Mon - Fri (10:00 AM - 01:00 PM)', status: 'ACTIVE' },
  { id: 'opd-3', name: 'Dermatology', doctor: 'Dr. D. Sen, M.D. (Path.)', dailyFootfall: 28, roomNo: 'OPD Room 103', timing: 'Tue, Thu, Sat (10:00 AM - 02:00 PM)', status: 'ACTIVE' },
  { id: 'opd-4', name: 'Rheumatology', doctor: 'Dr. A. K. Roy, M.D. (Hom.)', dailyFootfall: 20, roomNo: 'OPD Room 104', timing: 'Mon, Wed, Fri (10:00 AM - 02:00 PM)', status: 'ACTIVE' },
  { id: 'opd-5', name: 'Surgery', doctor: 'Dr. S. K. Mitra, M.S. (Surgery)', dailyFootfall: 22, roomNo: 'OPD Room 105', timing: 'Tue, Fri (10:00 AM - 01:00 PM)', status: 'ACTIVE' },
  { id: 'opd-6', name: 'Dental', doctor: 'Dr. R. Bannerjee, M.D.S.', dailyFootfall: 18, roomNo: 'OPD Room 106', timing: 'Mon - Sat (09:30 AM - 01:30 PM)', status: 'ACTIVE' },
  { id: 'opd-7', name: 'Eye', doctor: 'Dr. P. K. Ghosh, M.S. (Ophthal.)', dailyFootfall: 18, roomNo: 'OPD Room 107', timing: 'Mon, Thu, Sat (10:00 AM - 02:00 PM)', status: 'ACTIVE' },
  { id: 'opd-8', name: 'ENT', doctor: 'Dr. M. Roy, M.S. (E.N.T.)', dailyFootfall: 15, roomNo: 'OPD Room 108', timing: 'Wed, Sat (10:00 AM - 01:00 PM)', status: 'ACTIVE' },
  { id: 'opd-9', name: 'Gynaecology & Obstetrics', doctor: 'Dr. N. Mukhopadhyay, M.D. (O&G)', dailyFootfall: 25, roomNo: 'OPD Room 109', timing: 'Mon - Sat (10:00 AM - 02:00 PM)', status: 'ACTIVE' },
  { id: 'opd-10', name: 'Yoga & Physiotherapy', doctor: 'Dr. P. K. Samanta, M.D., Dip. Yoga', dailyFootfall: 12, roomNo: 'Yoga Studio OPD', timing: 'Mon - Sat (08:00 AM - 12:00 PM)', status: 'ACTIVE' },
  { id: 'opd-11', name: 'Nutrition & Diet', doctor: 'Dr. S. N. Bhattacharya, M.D. (Hom.)', dailyFootfall: 10, roomNo: 'OPD Room 110', timing: 'Tue, Thu (10:00 AM - 01:00 PM)', status: 'ACTIVE' },
];

const DEFAULT_IPD_OCCUPANCY: IpdBedOccupancy[] = [
  { id: 'ipd-1', wardName: 'General Medicine Male Ward', category: 'Male', totalBeds: 5, occupiedBeds: 4, wardInCharge: 'Dr. T. K. Maiti / Sister P. Das', lastUpdated: 'Today, 09:00 AM' },
  { id: 'ipd-2', wardName: 'General Medicine Female Ward', category: 'Female', totalBeds: 5, occupiedBeds: 3, wardInCharge: 'Dr. S. Chatterjee / Sister M. Roy', lastUpdated: 'Today, 09:00 AM' },
  { id: 'ipd-3', wardName: 'Surgery Male Ward', category: 'Male', totalBeds: 2, occupiedBeds: 1, wardInCharge: 'Dr. S. K. Mitra / Sister S. Ghosh', lastUpdated: 'Today, 08:30 AM' },
  { id: 'ipd-4', wardName: 'Surgery Female Ward', category: 'Female', totalBeds: 2, occupiedBeds: 2, wardInCharge: 'Dr. S. K. Mitra / Sister A. Sen', lastUpdated: 'Today, 08:30 AM' },
  { id: 'ipd-5', wardName: 'Paediatric Ward', category: 'Pediatric', totalBeds: 2, occupiedBeds: 1, wardInCharge: 'Dr. S. Chatterjee / Sister R. Dutta', lastUpdated: 'Today, 09:15 AM' },
  { id: 'ipd-6', wardName: 'Gynaecology & Obstetrics Ward', category: 'Female/Maternity', totalBeds: 4, occupiedBeds: 3, wardInCharge: 'Dr. N. Mukhopadhyay / Sister K. Paul', lastUpdated: 'Today, 09:00 AM' },
];

export const HospitalPage: React.FC<HospitalPageProps> = ({ defaultTab = 'opd' }) => {
  const [activeTab, setActiveTab] = useState<'opd' | 'ipd' | 'investigations' | 'facilities' | 'staff'>(defaultTab);

  // Sync tab if prop changes
  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  // OPD Department Stats & Admin Editing
  const [opdStats, setOpdStats] = useState<OpdDeptStat[]>(() => {
    const saved = localStorage.getItem('bhmch_opd_department_stats');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return DEFAULT_OPD_DEPARTMENTS;
  });

  const [isAdminEditingOpd, setIsAdminEditingOpd] = useState(false);
  const [editingOpdList, setEditingOpdList] = useState<OpdDeptStat[]>(opdStats);

  // IPD Occupancy & Admin Editing
  const [ipdOccupancy, setIpdOccupancy] = useState<IpdBedOccupancy[]>(() => {
    const saved = localStorage.getItem('bhmch_ipd_occupancy_stats');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return DEFAULT_IPD_OCCUPANCY;
  });

  const [isAdminEditingIpd, setIsAdminEditingIpd] = useState(false);
  const [editingIpdList, setEditingIpdList] = useState<IpdBedOccupancy[]>(ipdOccupancy);

  // Appointment & Ticket Modals
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientAge, setPatientAge] = useState('32');
  const [patientGender, setPatientGender] = useState('Male');
  const [preferredDept, setPreferredDept] = useState('General Medicine');
  const [preferredDate, setPreferredDate] = useState('2026-07-30');

  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [generatedTicket, setGeneratedTicket] = useState<OpdTicketData | null>(null);

  // Calculate Total Daily Footfall
  const totalDailyFootfall = opdStats.reduce((sum, d) => sum + d.dailyFootfall, 0);

  // Save OPD Edits
  const handleSaveOpdEdits = () => {
    setOpdStats(editingOpdList);
    localStorage.setItem('bhmch_opd_department_stats', JSON.stringify(editingOpdList));
    setIsAdminEditingOpd(false);
  };

  const handleResetOpd = () => {
    setOpdStats(DEFAULT_OPD_DEPARTMENTS);
    setEditingOpdList(DEFAULT_OPD_DEPARTMENTS);
    localStorage.removeItem('bhmch_opd_department_stats');
    setIsAdminEditingOpd(false);
  };

  // Save IPD Edits
  const handleSaveIpdEdits = () => {
    setIpdOccupancy(editingIpdList);
    localStorage.setItem('bhmch_ipd_occupancy_stats', JSON.stringify(editingIpdList));
    setIsAdminEditingIpd(false);
  };

  const handleResetIpd = () => {
    setIpdOccupancy(DEFAULT_IPD_OCCUPANCY);
    setEditingIpdList(DEFAULT_IPD_OCCUPANCY);
    localStorage.removeItem('bhmch_ipd_occupancy_stats');
    setIsAdminEditingIpd(false);
  };

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !patientPhone) return;

    const randomApptId = `OPD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const randomUhid = `BHMC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const tokenNum = Math.floor(1 + Math.random() * 25);
    const selectedDept = opdStats.find((o) => o.name === preferredDept);

    const ticketData: OpdTicketData = {
      appointmentId: randomApptId,
      uhid: randomUhid,
      patientName,
      age: patientAge || '30',
      gender: patientGender || 'Male',
      phone: patientPhone,
      email: patientEmail || 'patient@example.com',
      doctorName: selectedDept ? selectedDept.doctor : 'Dr. T. K. Maiti',
      department: preferredDept,
      appointmentDate: preferredDate,
      timeSlot: '09:30 AM',
      tokenNumber: tokenNum,
      status: 'CONFIRMED',
      roomNo: selectedDept ? selectedDept.roomNo : 'OPD Room 101',
      symptoms: 'General OPD Clinical Consultation',
      issuedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setGeneratedTicket(ticketData);
    setAppointmentModalOpen(false);
    setTicketModalOpen(true);
  };

  // Investigation Data
  const labServices = [
    { name: 'Pathology', status: 'ACTIVE', desc: 'Complete blood counts (CBC), ESR, peripheral blood smears & general pathological analysis.' },
    { name: 'Biochemistry', status: 'ACTIVE', desc: 'Liver function tests (LFT), kidney function tests (KFT), lipid profile & blood glucose.' },
    { name: 'Blood', status: 'ACTIVE', desc: 'Blood grouping, Rh typing, cross-matching & donor compatibility testing.' },
    { name: 'Urine', status: 'ACTIVE', desc: 'Routine & microscopic urine examination, protein, sugar & specific gravity analysis.' },
    { name: 'Stool', status: 'ACTIVE', desc: 'Microscopic stool routine, ova, cyst, occult blood & digestive enzyme check.' },
    { name: 'Sputum', status: 'ACTIVE', desc: 'AFB staining for tuberculosis screening, cytology & routine sputum culture.' },
    { name: 'Semen Analysis', status: 'ACTIVE', desc: 'Sperm count, motility, morphology & fertility evaluation.' },
    { name: 'Pregnancy Test', status: 'ACTIVE', desc: 'Rapid urine hCG pregnancy detection and confirmation.' },
    { name: 'Histopathology', status: 'ACTIVE', desc: 'Biopsy tissue processing, slide preparation & cellular pathology examination.' },
    { name: 'Serology', status: 'ACTIVE', desc: 'Widal test, VDRL, Hepatitis B/C, HIV screening & rheumatoid factor (RF).' },
  ];

  const radiologyServices = [
    { name: 'X-Ray', status: 'ACTIVE', desc: 'Digital radiography for chest, bones, joints, spine & abdomen.' },
    { name: 'Dental X-Ray', status: 'ACTIVE', desc: 'Intraoral periapical (IOPA) radiography for dental diagnostics.' },
    { name: 'USG', status: 'ACTIVE', desc: 'Ultrasonography for abdominal, pelvic, obstetrics & Doppler studies.' },
    { name: 'CT Scan', status: 'UNDER_PROCESS', desc: 'Advanced computed tomography scanning unit under commissioning.' },
    { name: 'MRI', status: 'UNDER_PROCESS', desc: 'Magnetic resonance imaging facility currently under process.' },
  ];

  const cardiologyServices = [
    { name: 'ECG', status: 'ACTIVE', desc: '12-lead Electrocardiogram for cardiac rhythm & ischemic evaluation.' },
    { name: 'Echo', status: 'UNDER_PROCESS', desc: 'Echocardiography for cardiac valvular & chamber function (under process).' },
    { name: 'TMT', status: 'UNDER_PROCESS', desc: 'Treadmill Stress Test for exercise ECG monitoring (under process).' },
    { name: 'Angiography', status: 'UNDER_PROCESS', desc: 'Coronary angiography facility planning & setup under process.' },
    { name: 'CT Angio', status: 'UNDER_PROCESS', desc: 'Non-invasive CT coronary angiography setup under installation.' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      <Breadcrumb items={[{ label: 'Hospital & OPD Services' }]} />

      {/* Header Banner */}
      <div className="rounded-3xl bg-[#002147] text-white p-8 sm:p-12 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="px-3.5 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-black rounded-full uppercase tracking-wider border border-emerald-500/30">
              20-Bed Attached Clinical Teaching Hospital
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Burdwan Homoeopathic Medical College Hospital
            </h1>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
              Providing compassionate, holistic, and evidence-based Homoeopathic clinical healthcare. Equipped with 11 OPD departments, 20 IPD bed capacity, pathology, radiology, and emergency medical services.
            </p>
          </div>

          <div className="flex flex-col gap-3 shrink-0">
            <button
              onClick={() => setAppointmentModalOpen(true)}
              className="px-6 py-3.5 bg-[#00A651] hover:bg-emerald-600 text-white font-bold text-xs rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book OPD Appointment Slot</span>
            </button>

            <a
              href="tel:+919832145678"
              className="px-6 py-2.5 bg-rose-600/90 hover:bg-rose-600 text-white font-bold text-xs rounded-2xl border border-rose-400/30 flex items-center justify-center gap-2 text-center"
            >
              <ShieldAlert className="w-4 h-4 animate-pulse" />
              <span>24/7 Emergency: +91 98321 45678</span>
            </a>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="pt-6 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <p className="text-xl sm:text-2xl font-black text-emerald-300">250+ / Day</p>
            <p className="text-[10px] text-slate-300 uppercase font-bold mt-0.5">Avg OPD Footfall</p>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <p className="text-xl sm:text-2xl font-black text-blue-300">20 Beds</p>
            <p className="text-[10px] text-slate-300 uppercase font-bold mt-0.5">Total IPD Capacity</p>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <p className="text-xl sm:text-2xl font-black text-amber-300">11 OPD Depts</p>
            <p className="text-[10px] text-slate-300 uppercase font-bold mt-0.5">Specialist Clinics</p>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <p className="text-xl sm:text-2xl font-black text-purple-300">24 / 7 Duty</p>
            <p className="text-[10px] text-slate-300 uppercase font-bold mt-0.5">Emergency & Ward Care</p>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider gap-4 overflow-x-auto custom-scrollbar">
        <button
          onClick={() => setActiveTab('opd')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'opd' ? 'border-[#002147] text-[#002147] dark:border-[#00A651] dark:text-[#00A651]' : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          <span>OPD Clinics & Statistics</span>
        </button>
        <button
          onClick={() => setActiveTab('ipd')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'ipd' ? 'border-[#002147] text-[#002147] dark:border-[#00A651] dark:text-[#00A651]' : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <BedDouble className="w-4 h-4" />
          <span>IPD Wards & Occupancy (20 Beds)</span>
        </button>
        <button
          onClick={() => setActiveTab('investigations')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'investigations' ? 'border-[#002147] text-[#002147] dark:border-[#00A651] dark:text-[#00A651]' : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <Microscope className="w-4 h-4" />
          <span>Investigation & Diagnostic Services</span>
        </button>
        <button
          onClick={() => setActiveTab('facilities')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'facilities' ? 'border-[#002147] text-[#002147] dark:border-[#00A651] dark:text-[#00A651]' : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          <span>Hospital Facilities</span>
        </button>
        <button
          onClick={() => setActiveTab('staff')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'staff' ? 'border-[#002147] text-[#002147] dark:border-[#00A651] dark:text-[#00A651]' : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Hospital Staff Directory</span>
        </button>
      </div>

      {/* 1. OPD CLINICS & DYNAMIC EDITABLE STATISTICS TABLE */}
      {activeTab === 'opd' && (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-3xs font-black rounded uppercase">
                  Official Record
                </span>
                <span className="text-xs font-bold text-slate-500">Total Avg Daily OPD Footfall: <strong className="text-emerald-600 dark:text-emerald-400">{totalDailyFootfall}+ Patients/Day</strong></span>
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">Out-Patient Department (OPD) Clinics & Statistics</h2>
            </div>

            <div className="flex items-center gap-2">
              {!isAdminEditingOpd ? (
                <button
                  onClick={() => { setEditingOpdList([...opdStats]); setIsAdminEditingOpd(true); }}
                  className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold rounded-xl flex items-center gap-1.5 transition hover:bg-slate-800 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit OPD Statistics (Admin)</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveOpdEdits}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                  <button
                    onClick={() => setIsAdminEditingOpd(false)}
                    className="px-3.5 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleResetOpd}
                    title="Reset to official defaults"
                    className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-xl transition cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Dynamic Editable OPD Statistics Table */}
          <Card className="p-0 overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#002147] text-white font-bold uppercase tracking-wider text-[11px]">
                    <th className="p-3.5">OPD Department</th>
                    <th className="p-3.5">Attending Consultant</th>
                    <th className="p-3.5 text-center">Avg Daily Attendance</th>
                    <th className="p-3.5">Counter / Room</th>
                    <th className="p-3.5">Timings</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {(isAdminEditingOpd ? editingOpdList : opdStats).map((dept, index) => (
                    <tr key={dept.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50 transition">
                      <td className="p-3.5 font-extrabold text-slate-900 dark:text-white">
                        {dept.name}
                      </td>

                      <td className="p-3.5">
                        {isAdminEditingOpd ? (
                          <input
                            type="text"
                            value={dept.doctor}
                            onChange={(e) => {
                              const updated = [...editingOpdList];
                              updated[index].doctor = e.target.value;
                              setEditingOpdList(updated);
                            }}
                            className="px-2 py-1 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded text-xs w-full"
                          />
                        ) : (
                          <span className="font-semibold">{dept.doctor}</span>
                        )}
                      </td>

                      <td className="p-3.5 text-center">
                        {isAdminEditingOpd ? (
                          <input
                            type="number"
                            value={dept.dailyFootfall}
                            onChange={(e) => {
                              const updated = [...editingOpdList];
                              updated[index].dailyFootfall = parseInt(e.target.value) || 0;
                              setEditingOpdList(updated);
                            }}
                            className="px-2 py-1 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded text-xs w-20 text-center font-bold"
                          />
                        ) : (
                          <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold rounded-lg border border-emerald-200 dark:border-emerald-800">
                            {dept.dailyFootfall} patients
                          </span>
                        )}
                      </td>

                      <td className="p-3.5">
                        {isAdminEditingOpd ? (
                          <input
                            type="text"
                            value={dept.roomNo}
                            onChange={(e) => {
                              const updated = [...editingOpdList];
                              updated[index].roomNo = e.target.value;
                              setEditingOpdList(updated);
                            }}
                            className="px-2 py-1 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded text-xs w-full"
                          />
                        ) : (
                          <span className="font-mono text-2xs font-bold text-slate-500">{dept.roomNo}</span>
                        )}
                      </td>

                      <td className="p-3.5">
                        {isAdminEditingOpd ? (
                          <input
                            type="text"
                            value={dept.timing}
                            onChange={(e) => {
                              const updated = [...editingOpdList];
                              updated[index].timing = e.target.value;
                              setEditingOpdList(updated);
                            }}
                            className="px-2 py-1 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded text-xs w-full"
                          />
                        ) : (
                          <span className="text-2xs text-slate-600 dark:text-slate-400">{dept.timing}</span>
                        )}
                      </td>

                      <td className="p-3.5">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-black text-3xs rounded uppercase tracking-wider">
                          {dept.status}
                        </span>
                      </td>

                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => {
                            setPreferredDept(dept.name);
                            setAppointmentModalOpen(true);
                          }}
                          className="px-3 py-1 bg-[#002147] hover:bg-[#001530] text-white font-bold text-3xs rounded-lg transition cursor-pointer"
                        >
                          Book Ticket
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Department Roster Cards */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">All 11 Official OPD Department Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {opdStats.map((opd) => (
                <Card key={opd.id} className="p-6 space-y-4 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                      {opd.roomNo}
                    </span>
                    <span className="text-2xs font-bold text-slate-400">Avg {opd.dailyFootfall}+ patients/day</span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{opd.name}</h3>
                    <p className="text-xs text-slate-500">Attending Consultant: <span className="font-bold text-slate-700 dark:text-slate-300">{opd.doctor}</span></p>
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    <Clock className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>{opd.timing}</span>
                  </div>

                  <button
                    onClick={() => { setPreferredDept(opd.name); setAppointmentModalOpen(true); }}
                    className="w-full py-2 bg-[#002147] hover:bg-[#001530] text-white text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    Book OPD Ticket
                  </button>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. IPD WARDS & EDITABLE HOSPITAL OCCUPANCY DATA */}
      {activeTab === 'ipd' && (
        <div className="space-y-8">
          {/* Header Banner */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 text-[#002147] dark:text-[#00A651]">
                <BedDouble className="w-6 h-6" />
                <h2 className="text-xl font-black">20-Bed Hospital In-Patient Department (IPD)</h2>
              </div>
              <span className="px-3 py-1 bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300 text-xs font-black rounded-full border border-blue-200 dark:border-blue-800">
                Total Capacity: 20 Beds
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Burdwan Homoeopathic Medical College & Hospital operates a 20-bed attached teaching hospital categorized into General Medicine (Male & Female), Surgery (Male & Female), Paediatrics, and Gynaecology & Obstetrics.
            </p>

            {/* Official Bed Allocation Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
                <p className="text-3xs font-black uppercase text-slate-400">General Medicine</p>
                <p className="text-2xl font-black text-[#002147] dark:text-white">10 Beds</p>
                <p className="text-2xs text-slate-500 font-medium">Male: 5 Beds | Female: 5 Beds</p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
                <p className="text-3xs font-black uppercase text-slate-400">Surgery Ward</p>
                <p className="text-2xl font-black text-emerald-600">4 Beds</p>
                <p className="text-2xs text-slate-500 font-medium">Male: 2 Beds | Female: 2 Beds</p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
                <p className="text-3xs font-black uppercase text-slate-400">Paediatric Ward</p>
                <p className="text-2xl font-black text-blue-500">2 Beds</p>
                <p className="text-2xs text-slate-500 font-medium">Child Care & Developmental Bay</p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
                <p className="text-3xs font-black uppercase text-slate-400">Gynaecology & Obstetrics</p>
                <p className="text-2xl font-black text-purple-600">4 Beds</p>
                <p className="text-2xs text-slate-500 font-medium">Antenatal & Maternity Suite</p>
              </div>
            </div>
          </div>

          {/* Hospital Infrastructure & Facility Rooms */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-500" />
              <span>Hospital Facility Rooms & Infrastructure</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Operation Theatre (OT)</span>
                </div>
                <p className="text-2xs text-slate-500">Fully sanitized minor/major OT suite for surgical procedures and post-operative monitoring.</p>
              </div>

              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Labour Room</span>
                </div>
                <p className="text-2xs text-slate-500">Equipped maternity delivery room with fetal Doppler monitoring and neonatal warming apparatus.</p>
              </div>

              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Sterilization Room (CSSD)</span>
                </div>
                <p className="text-2xs text-slate-500">Central Sterile Supply Department with heavy-duty autoclaves & surgical instrument sterilizers.</p>
              </div>

              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Doctors Room</span>
                </div>
                <p className="text-2xs text-slate-500">Dedicated resident medical officer and visiting consultant duty room for ward rounds.</p>
              </div>

              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Sisters Room</span>
                </div>
                <p className="text-2xs text-slate-500">24/7 Central nursing station for patient chart tracking, medication administration & vitals logging.</p>
              </div>

              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>House Staff Room</span>
                </div>
                <p className="text-2xs text-slate-500">Duty quarters for intern doctors and house staff officers managing 24x7 bed-side care.</p>
              </div>
            </div>
          </div>

          {/* Editable Hospital Occupancy Data Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Hospital Bed Occupancy Data (Real-time)</h3>
                <p className="text-xs text-slate-500">Live ward occupancy statistics and bed availability tracker.</p>
              </div>

              {!isAdminEditingIpd ? (
                <button
                  onClick={() => { setEditingIpdList([...ipdOccupancy]); setIsAdminEditingIpd(true); }}
                  className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold rounded-xl flex items-center gap-1.5 transition hover:bg-slate-800 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Bed Occupancy (Admin)</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveIpdEdits}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Occupancy</span>
                  </button>
                  <button
                    onClick={() => setIsAdminEditingIpd(false)}
                    className="px-3.5 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleResetIpd}
                    title="Reset to default bed capacity"
                    className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-xl transition cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <Card className="p-0 overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#002147] text-white font-bold uppercase tracking-wider text-[11px]">
                      <th className="p-3.5">Ward / Specialty</th>
                      <th className="p-3.5 text-center">Total Beds</th>
                      <th className="p-3.5 text-center">Occupied Beds</th>
                      <th className="p-3.5 text-center">Vacant Beds</th>
                      <th className="p-3.5 text-center">Occupancy Rate</th>
                      <th className="p-3.5">Ward In-Charge</th>
                      <th className="p-3.5 text-right">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {(isAdminEditingIpd ? editingIpdList : ipdOccupancy).map((ward, index) => {
                      const total = ward.totalBeds;
                      const occupied = ward.occupiedBeds;
                      const vacant = Math.max(0, total - occupied);
                      const rate = Math.round((occupied / total) * 100);

                      return (
                        <tr key={ward.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50 transition">
                          <td className="p-3.5 font-extrabold text-slate-900 dark:text-white">
                            {ward.wardName}
                          </td>

                          <td className="p-3.5 text-center font-bold">
                            {ward.totalBeds} Beds
                          </td>

                          <td className="p-3.5 text-center">
                            {isAdminEditingIpd ? (
                              <input
                                type="number"
                                max={ward.totalBeds}
                                min={0}
                                value={ward.occupiedBeds}
                                onChange={(e) => {
                                  const updated = [...editingIpdList];
                                  updated[index].occupiedBeds = parseInt(e.target.value) || 0;
                                  setEditingIpdList(updated);
                                }}
                                className="px-2 py-1 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded text-xs w-16 text-center font-bold"
                              />
                            ) : (
                              <span className="px-2 py-0.5 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 font-extrabold rounded">
                                {occupied}
                              </span>
                            )}
                          </td>

                          <td className="p-3.5 text-center">
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-extrabold rounded">
                              {vacant}
                            </span>
                          </td>

                          <td className="p-3.5 text-center font-bold">
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-16 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                <div className="bg-emerald-500 h-full" style={{ width: `${rate}%` }}></div>
                              </div>
                              <span className="text-2xs">{rate}%</span>
                            </div>
                          </td>

                          <td className="p-3.5">
                            {isAdminEditingIpd ? (
                              <input
                                type="text"
                                value={ward.wardInCharge}
                                onChange={(e) => {
                                  const updated = [...editingIpdList];
                                  updated[index].wardInCharge = e.target.value;
                                  setEditingIpdList(updated);
                                }}
                                className="px-2 py-1 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded text-xs w-full"
                              />
                            ) : (
                              <span className="text-2xs font-semibold">{ward.wardInCharge}</span>
                            )}
                          </td>

                          <td className="p-3.5 text-right text-3xs font-bold text-slate-400">
                            {ward.lastUpdated}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* 3. INVESTIGATION & DIAGNOSTIC SERVICES */}
      {activeTab === 'investigations' && (
        <div className="space-y-10">
          {/* Header Description */}
          <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-3xs font-black rounded-full uppercase tracking-wider">
              Hospital Diagnostic Wing
            </span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Investigation & Diagnostic Services</h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
              Comprehensive laboratory, radiological, and cardiology investigation services at Burdwan Homoeopathic Medical College Hospital. Subsidized government tariff rates applied for all registered OPD and IPD patients.
            </p>
          </div>

          {/* Section A: Laboratory Services */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <FlaskConical className="w-5 h-5 text-emerald-500" />
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Laboratory Services (Pathology & Microbiology)</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {labServices.map((srv, idx) => (
                <Card key={idx} className="p-5 space-y-3 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center justify-between">
                    <span className="text-2xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Laboratory</span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-3xs font-black rounded flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      <span>Active</span>
                    </span>
                  </div>

                  <h4 className="text-base font-black text-slate-900 dark:text-white">{srv.name}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{srv.desc}</p>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-3xs text-slate-400 font-bold">
                    <span>Requisition: Central Lab Counter</span>
                    <span>Report: Same Day</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Section B: Radiology */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <Activity className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Radiology & Diagnostic Imaging</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {radiologyServices.map((srv, idx) => (
                <Card key={idx} className="p-5 space-y-3 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center justify-between">
                    <span className="text-2xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Radiology</span>
                    {srv.status === 'ACTIVE' ? (
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-3xs font-black rounded flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        <span>Active</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 text-3xs font-black rounded flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-500" />
                        <span>Under Process</span>
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-black text-slate-900 dark:text-white">{srv.name}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{srv.desc}</p>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-3xs text-slate-400 font-bold">
                    <span>Department: Radiology Wing</span>
                    <span>Status: {srv.status === 'ACTIVE' ? 'Operational' : 'Under Process'}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Section C: Cardiology */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <HeartPulse className="w-5 h-5 text-rose-500" />
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Cardiology Diagnostics</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {cardiologyServices.map((srv, idx) => (
                <Card key={idx} className="p-5 space-y-3 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center justify-between">
                    <span className="text-2xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Cardiology</span>
                    {srv.status === 'ACTIVE' ? (
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-3xs font-black rounded flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        <span>Active</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 text-3xs font-black rounded flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-500" />
                        <span>Under Process</span>
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-black text-slate-900 dark:text-white">{srv.name}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{srv.desc}</p>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-3xs text-slate-400 font-bold">
                    <span>Department: Cardiac Diagnostics</span>
                    <span>Status: {srv.status === 'ACTIVE' ? 'Operational' : 'Under Process'}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. HOSPITAL FACILITIES */}
      {activeTab === 'facilities' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-8 space-y-4 border border-slate-200/80 dark:border-slate-800">
            <FlaskConical className="w-8 h-8 text-emerald-500" />
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Clinical Pathology & Diagnostic Lab</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Equipped for complete blood counts (CBC), liver function tests, renal panels, blood sugar monitoring, stool/urine analysis, and microbiology cultures at government-subsidized rates.
            </p>
          </Card>

          <Card className="p-8 space-y-4 border border-slate-200/80 dark:border-slate-800">
            <Pill className="w-8 h-8 text-blue-500" />
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Hospital Dispensing Pharmacy</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Maintains an inventory of genuine mother tinctures, potentized liquid remedies, and bio-chemic salts prepared strictly according to Homoeopathic Pharmacopoeia of India (HPI) standards.
            </p>
          </Card>
        </div>
      )}

      {/* 5. HOSPITAL STAFF DIRECTORY */}
      {activeTab === 'staff' && (
        <HospitalStaffDirectory />
      )}

      {/* OPD Ticket Booking Modal */}
      {appointmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-8 space-y-6 relative">
            <button
              onClick={() => setAppointmentModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl bg-slate-100 dark:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleBook} className="space-y-4">
              <div className="space-y-1">
                <span className="text-2xs font-black uppercase text-emerald-600">Online OPD Ticket Slot</span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Book OPD Consultation</h3>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Patient Full Name *</label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Ramesh Chandra Das"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#002147] dark:focus:ring-[#00A651]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Age (Years) *</label>
                  <input
                    type="number"
                    required
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    placeholder="e.g. 32"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#002147]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Gender *</label>
                  <select
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="+91 98321 00000"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#002147] dark:focus:ring-[#00A651]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Patient Email (For PDF Ticket)</label>
                  <input
                    type="email"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    placeholder="patient@example.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#002147]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">OPD Clinic</label>
                  <select
                    value={preferredDept}
                    onChange={(e) => setPreferredDept(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none"
                  >
                    {opdStats.map((o) => (
                      <option key={o.id} value={o.name}>{o.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Visit Date</label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#002147] hover:bg-[#001530] text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
              >
                Generate PDF Ticket & Book OPD Slot
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Official OPD Ticket Modal & Preview */}
      <OpdTicketModal
        isOpen={ticketModalOpen}
        onClose={() => setTicketModalOpen(false)}
        ticketData={generatedTicket}
        onRegenerate={(updated) => setGeneratedTicket({ ...updated })}
      />
    </div>
  );
};
