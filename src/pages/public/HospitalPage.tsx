import React, { useState, useEffect } from 'react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Stethoscope, BedDouble, HeartPulse, Clock, Calendar, Phone, ShieldAlert, FlaskConical, Pill, Activity, UserCheck, CheckCircle2, Search, X, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { hospitalApi } from '../../services/api/hospital.api';

export const HospitalPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'opd' | 'ipd' | 'facilities' | 'packages'>('opd');
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [preferredDept, setPreferredDept] = useState('General Medicine OPD');
  const [preferredDate, setPreferredDate] = useState('2026-07-24');
  const [bookedSuccess, setBookedSuccess] = useState(false);

  const opdList = [
    { name: 'General Medicine OPD', doctor: 'Dr. S. K. Banerjea & Team', counter: 'Counter 1', timing: 'Mon - Sat (9:00 AM - 2:00 PM)', fee: '₹20 (Reg + Medicines)' },
    { name: 'Pediatrics & Child Care OPD', doctor: 'Dr. S. Chatterjee, M.D.', counter: 'Counter 2', timing: 'Mon - Fri (10:00 AM - 1:00 PM)', fee: '₹20 (Reg + Medicines)' },
    { name: 'Gynaecology & Antenatal OPD', doctor: 'Dr. N. Mukhopadhyay, M.D.', counter: 'Counter 3', timing: 'Mon - Sat (10:00 AM - 2:00 PM)', fee: '₹20 (Reg + Medicines)' },
    { name: 'Dermatology & Skin OPD', doctor: 'Dr. D. Sen, M.D.', counter: 'Counter 4', timing: 'Tue, Thu, Sat (10:00 AM - 2:00 PM)', fee: '₹20 (Reg + Medicines)' },
    { name: 'Gastroenterology & Chronic Disease', doctor: 'Dr. A. K. Roy, M.D.', counter: 'Counter 5', timing: 'Mon, Wed, Fri (10:00 AM - 2:00 PM)', fee: '₹20 (Reg + Medicines)' },
    { name: 'Orthopedics & Joint Care OPD', doctor: 'Dr. S. K. Mitra, M.S.', counter: 'Counter 6', timing: 'Tue, Fri (10:00 AM - 1:00 PM)', fee: '₹20 (Reg + Medicines)' },
  ];

  const hospitalStats = [
    { label: 'Bed Capacity (IPD)', value: '50 Beds' },
    { label: 'Daily OPD Footfall', value: '250+ Patients' },
    { label: 'Free Hospital Care', value: 'Subsidized Remedies' },
    { label: 'Emergency Duty', value: '24/7 round the clock' },
  ];

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !patientPhone) return;
    setBookedSuccess(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      <Breadcrumb items={[{ label: 'Hospital & OPD Services' }]} />

      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-[#002147] via-slate-900 to-[#00A651]/90 text-white p-8 sm:p-12 shadow-xl relative overflow-hidden space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="px-3.5 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-black rounded-full uppercase tracking-wider border border-emerald-500/30">
              50-Bed Attached Clinical Teaching Hospital
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Homoeopathic Medical College Hospital
            </h1>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
              Providing compassionate, holistic, and evidence-based Homoeopathic clinical care to the community. Complete OPD clinics, IPD wards, pathology, and emergency medical services available.
            </p>
          </div>

          <div className="flex flex-col gap-3 shrink-0">
            <button
              onClick={() => { setAppointmentModalOpen(true); setBookedSuccess(false); }}
              className="px-6 py-3.5 bg-[#00A651] hover:bg-emerald-600 text-white font-bold text-xs rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book OPD Appointment Slot</span>
            </button>

            <a
              href="tel:+919832145678"
              className="px-6 py-2.5 bg-rose-600/90 hover:bg-rose-600 text-white font-bold text-xs rounded-2xl border border-rose-400/30 flex items-center justify-center gap-2"
            >
              <ShieldAlert className="w-4 h-4 animate-pulse" />
              <span>24/7 Emergency: +91 98321 45678</span>
            </a>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="pt-6 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {hospitalStats.map((st, i) => (
            <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/10">
              <p className="text-xl font-black text-emerald-300">{st.value}</p>
              <p className="text-[10px] text-slate-300 uppercase font-bold mt-0.5">{st.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider gap-4">
        <button
          onClick={() => setActiveTab('opd')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 ${
            activeTab === 'opd' ? 'border-[#002147] text-[#002147] dark:border-[#00A651] dark:text-[#00A651]' : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          <span>OPD Clinics & Schedule</span>
        </button>
        <button
          onClick={() => setActiveTab('ipd')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 ${
            activeTab === 'ipd' ? 'border-[#002147] text-[#002147] dark:border-[#00A651] dark:text-[#00A651]' : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <BedDouble className="w-4 h-4" />
          <span>In-Patient Wards (IPD)</span>
        </button>
        <button
          onClick={() => setActiveTab('facilities')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 ${
            activeTab === 'facilities' ? 'border-[#002147] text-[#002147] dark:border-[#00A651] dark:text-[#00A651]' : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          <span>Diagnostic & Pharmacy</span>
        </button>
      </div>

      {/* OPD Clinics Tab Content */}
      {activeTab === 'opd' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Daily Out-Patient Department (OPD) Roster</h2>
            <Link to="/doctors" className="text-xs font-bold text-[#002147] dark:text-[#00A651] hover:underline flex items-center gap-1">
              <span>View Full Consultants Directory</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opdList.map((opd, i) => (
              <Card key={i} className="p-6 space-y-4 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                    {opd.counter}
                  </span>
                  <span className="text-2xs font-bold text-slate-400">{opd.fee}</span>
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
                  onClick={() => { setPreferredDept(opd.name); setAppointmentModalOpen(true); setBookedSuccess(false); }}
                  className="w-full py-2 bg-[#002147] hover:bg-[#001530] text-white text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Book OPD Ticket
                </button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* IPD Tab Content */}
      {activeTab === 'ipd' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 space-y-6">
          <div className="flex items-center space-x-3 text-[#002147] dark:text-[#00A651]">
            <BedDouble className="w-6 h-6" />
            <h2 className="text-xl font-black">50-Bed Hospital In-Patient Department (IPD)</h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            BHMC&H operates 50 in-patient beds categorized into Male Wards, Female Wards, Maternity Suites, and Pediatric Bays. Admitted patients receive round-the-clock nursing supervision, medical officer rounds, and individualized Homoeopathic dietary care.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
              <p className="text-xs font-black uppercase text-slate-400">Male Medical Ward</p>
              <p className="text-2xl font-black text-[#002147] dark:text-white">20 Beds</p>
              <p className="text-xs text-slate-500">Chronic arthritis, gastrointestinal, respiratory admissions.</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
              <p className="text-xs font-black uppercase text-slate-400">Female & Maternity Ward</p>
              <p className="text-2xl font-black text-emerald-600">20 Beds</p>
              <p className="text-xs text-slate-500">Antenatal observation, gynaecological disorders, skin cases.</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
              <p className="text-xs font-black uppercase text-slate-400">Pediatric & Special Bay</p>
              <p className="text-2xl font-black text-blue-500">10 Beds</p>
              <p className="text-xs text-slate-500">Neonatal jaundice, pediatric developmental care.</p>
            </div>
          </div>
        </div>
      )}

      {/* Facilities Tab */}
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

      {/* OPD Ticket Booking Modal */}
      {appointmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-8 space-y-6 relative">
            <button
              onClick={() => setAppointmentModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl bg-slate-100 dark:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            {bookedSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">OPD Ticket Reserved!</h3>
                <p className="text-xs text-slate-500">
                  Ticket Token ID: <span className="font-mono font-bold text-[#002147] dark:text-[#00A651]">#OPD-2026-8812</span>
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Please present your Token ID at OPD Reception Counter 1 on <strong className="text-slate-900 dark:text-white">{preferredDate}</strong> at 9:00 AM.
                </p>
                <Button onClick={() => setAppointmentModalOpen(false)} variant="primary" className="w-full mt-2">Done</Button>
              </div>
            ) : (
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">OPD Clinic</label>
                    <select
                      value={preferredDept}
                      onChange={(e) => setPreferredDept(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none"
                    >
                      {opdList.map((o, i) => (
                        <option key={i} value={o.name}>{o.name}</option>
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
                  Generate Free OPD Token Ticket
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
