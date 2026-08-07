/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserSession, DashboardSubView, StudentRecord, PatientRecord, Notice, ServiceBooking } from '../types';
import {
  DEPARTMENTS,
  FACULTY,
  STUDENTS,
  PATIENTS,
  NOTICES,
  GALLERY,
  MOCK_BOOKINGS,
  COURSES,
  HOSPITAL_ANALYTICS,
  FINANCE_ANALYTICS,
  ADMISSION_TRENDS,
  RESEARCH_BY_DEPT,
  DEFAULT_PRINCIPAL_PROFILE,
  DEFAULT_CMS_DATA,
  DEFAULT_LIBRARY_BOOKS,
  DEFAULT_IPD_BEDS,
  DEFAULT_PHARMACY_STOCK,
  DEFAULT_LAB_TESTS
} from '../data/mockData';
import {
  CustomBarChart,
  CustomLineChart,
  CustomPieChart,
  MetricCard
} from '../components/Charts';
import { ServiceBookingModule } from '../components/ServiceBooking';
import { PrincipalDeskCMS } from '../components/PrincipalDeskCMS';
import { SecureELibrary } from '../components/SecureELibrary';
import { AdvancedIPD } from '../components/AdvancedIPD';
import { PharmacyModule } from '../components/PharmacyModule';
import { LabManagement } from '../components/LabManagement';
import { CMSWebsiteEditor } from '../components/CMSWebsiteEditor';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  GraduationCap,
  Activity,
  Settings,
  Bell,
  Search,
  LogOut,
  Calendar,
  Layers,
  ChevronRight,
  Database,
  Printer,
  Edit3,
  FileText,
  BadgeAlert,
  Menu,
  Heart,
  TrendingUp,
  DollarSign,
  Plus,
  BookOpen,
  Image,
  ClipboardList,
  Pin
} from 'lucide-react';

interface DashboardsProps {
  session: UserSession;
  onLogout: () => void;
}

export const Dashboards: React.FC<DashboardsProps> = ({ session, onLogout }) => {
  const [subView, setSubView] = useState<DashboardSubView>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Module State Hooks
  const [principalProfile, setPrincipalProfile] = useState(DEFAULT_PRINCIPAL_PROFILE);
  const [cmsData, setCmsData] = useState(DEFAULT_CMS_DATA);
  const [libraryBooks, setLibraryBooks] = useState(DEFAULT_LIBRARY_BOOKS);
  const [ipdBeds, setIpdBeds] = useState(DEFAULT_IPD_BEDS);
  const [pharmacyItems, setPharmacyItems] = useState(DEFAULT_PHARMACY_STOCK);
  const [labTests, setLabTests] = useState(DEFAULT_LAB_TESTS);

  // Search & Filter state for lists
  const [studentSearch, setStudentSearch] = useState('');
  const [patientSearch, setPatientSearch] = useState('');

  // Notifications drawer state
  const [notifications, setNotifications] = useState([
    { id: '1', text: 'New NCH guideline update received by Principal', unread: true },
    { id: '2', text: 'Mid-term results approved for BHMS III Professional', unread: true },
    { id: '3', text: 'Acute skin clinical OPD 3 posting roster updated', unread: false }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  // OPD Registration simulator form state
  const [patientForm, setPatientForm] = useState({
    name: '', age: 30, gender: 'Male' as 'Male'|'Female', type: 'OPD' as 'OPD'|'IPD',
    dept: 'Practice of Medicine', complaint: '', remedy: '', potency: '30C'
  });
  const [localPatients, setLocalPatients] = useState<PatientRecord[]>(PATIENTS);

  const [editingPatient, setEditingPatient] = useState<PatientRecord | null>(null);
  const [printingPatient, setPrintingPatient] = useState<PatientRecord | null>(null);
  const [editForm, setEditForm] = useState({
    complaint: '',
    remedy: '',
    potency: '',
    status: 'Under Treatment',
    department: 'Practice of Medicine'
  });

  const startEditing = (p: PatientRecord) => {
    setEditingPatient(p);
    setEditForm({
      complaint: p.complaint || '',
      remedy: p.homoeopathicRemedy || '',
      potency: p.potency || '30C',
      status: p.status,
      department: p.department || 'Practice of Medicine'
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPatient) return;
    setLocalPatients(localPatients.map(p => 
      p.id === editingPatient.id 
        ? {
            ...p,
            complaint: editForm.complaint,
            homoeopathicRemedy: editForm.remedy,
            potency: editForm.potency,
            status: editForm.status as any,
            department: editForm.department
          }
        : p
    ));
    setEditingPatient(null);
    alert('OPD case prescription successfully updated!');
  };

  const handlePatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientForm.name || !patientForm.complaint) return;
    const newPat: PatientRecord = {
      id: `pat_${Date.now()}`,
      caseNo: `${patientForm.type}/2026/0${Math.floor(1000 + Math.random() * 9000)}`,
      name: patientForm.name,
      age: patientForm.age,
      gender: patientForm.gender,
      dateRegistered: new Date().toISOString().split('T')[0],
      type: patientForm.type,
      department: patientForm.dept,
      complaint: patientForm.complaint,
      homoeopathicRemedy: patientForm.remedy || 'Nux Vomica',
      potency: patientForm.potency,
      status: 'Under Treatment',
      doctor: session.name
    };
    setLocalPatients([newPat, ...localPatients]);
    setPatientForm({ name: '', age: 30, gender: 'Male', type: 'OPD', dept: 'Practice of Medicine', complaint: '', remedy: '', potency: '30C' });
    alert('Case successfully registered in hospital electronic record system!');
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const currentRoleLabel = session.role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <div className="min-h-screen bg-[#F0F4F8] dark:bg-[#000f21] text-[#1E293B] dark:text-[#e2e8f0] flex flex-col md:flex-row font-sans" id="erp_workspace_root">
      
      {/* 1. DYNAMIC ERP SIDEBAR */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#002147] text-blue-100/80 flex flex-col transition-all duration-300 border-r border-[#001833] shrink-0`}>
        {/* LOGO BAR */}
        <div className="p-5 bg-[#001833] border-b border-[#ffffff10] flex items-center justify-between">
          <div className="flex items-center space-x-2.5 truncate">
            <Heart className="w-6 h-6 text-[#00A651] shrink-0" />
            {sidebarOpen && (
              <div>
                <span className="text-xs font-black text-white tracking-wider block uppercase">HomoeoERP</span>
                <span className="text-[9px] text-[#00A651] tracking-widest font-black uppercase block">Digital Campus</span>
              </div>
            )}
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 text-blue-200 hover:text-white transition cursor-pointer">
            <Menu className="w-4 h-4" />
          </button>
        </div>

        {/* SIDEBAR NAVIGATION ITEMS BY ROLE EXCLUSION */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2 text-2xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setSubView('overview')}
            className={`w-full flex items-center p-3 rounded-xl transition-all cursor-pointer ${
              subView === 'overview' ? 'bg-[#ffffff10] text-white border-l-4 border-[#00A651] font-black' : 'hover:bg-[#ffffff08] text-blue-100/70 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 mr-3 shrink-0" />
            {sidebarOpen && <span>Overview Desk</span>}
          </button>

          {/* STUDENT MODULE NAVIGATION (Visible to Student, Registrar, Principal, SuperAdmin) */}
          {['student', 'registrar', 'principal', 'super_admin'].includes(session.role) && (
            <div className="space-y-1.5 pt-2">
              {sidebarOpen && <span className="text-4xs font-black text-blue-200/50 block px-2 tracking-widest">Student Module</span>}
              <button
                onClick={() => setSubView('student_list')}
                className={`w-full flex items-center p-2.5 rounded-xl transition cursor-pointer ${
                  subView === 'student_list' ? 'bg-[#ffffff10] text-white border-l-4 border-[#00A651] font-black' : 'hover:bg-[#ffffff08] text-blue-100/70 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4 mr-3 shrink-0" />
                {sidebarOpen && <span>Student Directory</span>}
              </button>
              {session.role === 'student' && (
                <>
                  <button
                    onClick={() => setSubView('student_profile')}
                    className={`w-full flex items-center p-2.5 rounded-xl transition cursor-pointer ${subView === 'student_profile' ? 'bg-[#ffffff10] text-white border-l-4 border-[#00A651] font-black' : 'hover:bg-[#ffffff08] text-blue-100/70 hover:text-white'}`}
                  >
                    <Users className="w-4 h-4 mr-3 shrink-0" />
                    {sidebarOpen && <span>My Profile</span>}
                  </button>
                  <button
                    onClick={() => setSubView('student_results')}
                    className={`w-full flex items-center p-2.5 rounded-xl transition cursor-pointer ${subView === 'student_results' ? 'bg-[#ffffff10] text-white border-l-4 border-[#00A651] font-black' : 'hover:bg-[#ffffff08] text-blue-100/70 hover:text-white'}`}
                  >
                    <GraduationCap className="w-4 h-4 mr-3 shrink-0" />
                    {sidebarOpen && <span>Markssheets</span>}
                  </button>
                  <button
                    onClick={() => setSubView('student_booking')}
                    className={`w-full flex items-center p-2.5 rounded-xl transition cursor-pointer ${subView === 'student_booking' ? 'bg-[#ffffff10] text-white border-l-4 border-[#00A651] font-black' : 'hover:bg-[#ffffff08] text-blue-100/70 hover:text-white'}`}
                  >
                    <FileText className="w-4 h-4 mr-3 shrink-0" />
                    {sidebarOpen && <span>Booking Center</span>}
                  </button>
                </>
              )}
            </div>
          )}

          {/* FACULTY MODULE NAVIGATION */}
          {['faculty', 'registrar', 'principal', 'super_admin'].includes(session.role) && (
            <div className="space-y-1.5 pt-2">
              {sidebarOpen && <span className="text-4xs font-black text-blue-200/50 block px-2 tracking-widest">Faculty Desk</span>}
              <button
                onClick={() => setSubView('faculty_list')}
                className={`w-full flex items-center p-2.5 rounded-xl transition cursor-pointer ${subView === 'faculty_list' ? 'bg-[#ffffff10] text-white border-l-4 border-[#00A651] font-black' : 'hover:bg-[#ffffff08] text-blue-100/70 hover:text-white'}`}
              >
                <Briefcase className="w-4 h-4 mr-3 shrink-0" />
                {sidebarOpen && <span>Faculty roster</span>}
              </button>
              {session.role === 'faculty' && (
                <button
                  onClick={() => setSubView('faculty_publication')}
                  className={`w-full flex items-center p-2.5 rounded-xl transition cursor-pointer ${subView === 'faculty_publication' ? 'bg-[#ffffff10] text-white border-l-4 border-[#00A651] font-black' : 'hover:bg-[#ffffff08] text-blue-100/70 hover:text-white'}`}
                >
                  <BookOpen className="w-4 h-4 mr-3 shrink-0" />
                  {sidebarOpen && <span>My Publications</span>}
                </button>
              )}
            </div>
          )}

          {/* HOSPITAL/OPD MODULE NAVIGATION */}
          {['hospital_staff', 'opd_staff', 'faculty', 'principal', 'super_admin', 'reception', 'hospital_superintendent'].includes(session.role) && (
            <div className="space-y-1.5 pt-2">
              {sidebarOpen && <span className="text-4xs font-black text-blue-200/50 block px-2 tracking-widest">Hospital & OPD ERP</span>}
              <button
                onClick={() => setSubView('hospital_patient_reg')}
                className={`w-full flex items-center p-2.5 rounded-xl transition cursor-pointer ${subView === 'hospital_patient_reg' ? 'bg-[#ffffff10] text-white border-l-4 border-[#00A651] font-black' : 'hover:bg-[#ffffff08] text-blue-100/70 hover:text-white'}`}
              >
                <Activity className="w-4 h-4 mr-3 shrink-0" />
                {sidebarOpen && <span>OPD Patient Registry</span>}
              </button>
              <button
                onClick={() => setSubView('hospital_ipd')}
                className={`w-full flex items-center p-2.5 rounded-xl transition cursor-pointer ${subView === 'hospital_ipd' ? 'bg-[#ffffff10] text-white border-l-4 border-[#00A651] font-black' : 'hover:bg-[#ffffff08] text-blue-100/70 hover:text-white'}`}
              >
                <Heart className="w-4 h-4 mr-3 shrink-0" />
                {sidebarOpen && <span>IPD Ward Bed Map</span>}
              </button>
              <button
                onClick={() => setSubView('hospital_pharmacy')}
                className={`w-full flex items-center p-2.5 rounded-xl transition cursor-pointer ${subView === 'hospital_pharmacy' ? 'bg-[#ffffff10] text-white border-l-4 border-[#00A651] font-black' : 'hover:bg-[#ffffff08] text-blue-100/70 hover:text-white'}`}
              >
                <Database className="w-4 h-4 mr-3 shrink-0" />
                {sidebarOpen && <span>Pharmacy & Stock</span>}
              </button>
              <button
                onClick={() => setSubView('hospital_laboratory')}
                className={`w-full flex items-center p-2.5 rounded-xl transition cursor-pointer ${subView === 'hospital_laboratory' ? 'bg-[#ffffff10] text-white border-l-4 border-[#00A651] font-black' : 'hover:bg-[#ffffff08] text-blue-100/70 hover:text-white'}`}
              >
                <Layers className="w-4 h-4 mr-3 shrink-0" />
                {sidebarOpen && <span>Clinical Lab</span>}
              </button>
              <button
                onClick={() => setSubView('hospital_clinical_posting')}
                className={`w-full flex items-center p-2.5 rounded-xl transition cursor-pointer ${subView === 'hospital_clinical_posting' ? 'bg-[#ffffff10] text-white border-l-4 border-[#00A651] font-black' : 'hover:bg-[#ffffff08] text-blue-100/70 hover:text-white'}`}
              >
                <ClipboardList className="w-4 h-4 mr-3 shrink-0" />
                {sidebarOpen && <span>Clinical Postings</span>}
              </button>
            </div>
          )}

          {/* ACADEMICS & E-LIBRARY MODULE */}
          <div className="space-y-1.5 pt-2">
            {sidebarOpen && <span className="text-4xs font-black text-blue-200/50 block px-2 tracking-widest">Academic Resources</span>}
            <button
              onClick={() => setSubView('student_library')}
              className={`w-full flex items-center p-2.5 rounded-xl transition cursor-pointer ${subView === 'student_library' ? 'bg-[#ffffff10] text-white border-l-4 border-[#00A651] font-black' : 'hover:bg-[#ffffff08] text-blue-100/70 hover:text-white'}`}
            >
              <BookOpen className="w-4 h-4 mr-3 shrink-0" />
              {sidebarOpen && <span>Secure E-Library</span>}
            </button>
          </div>

          {/* CMS & ADMINISTRATION */}
          {['principal', 'super_admin', 'office_admin', 'vice_principal'].includes(session.role) && (
            <div className="space-y-1.5 pt-2">
              {sidebarOpen && <span className="text-4xs font-black text-blue-200/50 block px-2 tracking-widest">CMS & Desk Admin</span>}
              <button
                onClick={() => setSubView('principal_desk_cms')}
                className={`w-full flex items-center p-2.5 rounded-xl transition cursor-pointer ${subView === 'principal_desk_cms' ? 'bg-[#ffffff10] text-white border-l-4 border-[#00A651] font-black' : 'hover:bg-[#ffffff08] text-blue-100/70 hover:text-white'}`}
              >
                <Edit3 className="w-4 h-4 mr-3 shrink-0" />
                {sidebarOpen && <span>Principal Desk CMS</span>}
              </button>
              <button
                onClick={() => setSubView('cms_website_editor')}
                className={`w-full flex items-center p-2.5 rounded-xl transition cursor-pointer ${subView === 'cms_website_editor' ? 'bg-[#ffffff10] text-white border-l-4 border-[#00A651] font-black' : 'hover:bg-[#ffffff08] text-blue-100/70 hover:text-white'}`}
              >
                <Settings className="w-4 h-4 mr-3 shrink-0" />
                {sidebarOpen && <span>Website CMS Editor</span>}
              </button>
            </div>
          )}

          {/* ANALYTICS MODULE NAVIGATION */}
          {['principal', 'registrar', 'super_admin'].includes(session.role) && (
            <div className="space-y-1.5 pt-2">
              {sidebarOpen && <span className="text-4xs font-black text-blue-200/50 block px-2 tracking-widest">Analytics</span>}
              <button
                onClick={() => setSubView('analytics_admission')}
                className={`w-full flex items-center p-2.5 rounded-xl transition cursor-pointer ${subView === 'analytics_admission' ? 'bg-[#ffffff10] text-white border-l-4 border-[#00A651] font-black' : 'hover:bg-[#ffffff08] text-[#e6f0ff]/70 hover:text-white'}`}
              >
                <TrendingUp className="w-4 h-4 mr-3 shrink-0" />
                {sidebarOpen && <span>College Metrics</span>}
              </button>
            </div>
          )}
        </nav>

        {/* LOG OUT BUTTON */}
        <div className="p-4 bg-[#001833]">
          <button
            onClick={onLogout}
            className="w-full flex items-center p-2.5 rounded-xl bg-rose-950/40 text-rose-300 hover:bg-rose-900 hover:text-white transition cursor-pointer text-2xs font-bold uppercase tracking-wider"
          >
            <LogOut className="w-4 h-4 mr-3 shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* 2. MAIN APP CONTENT CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOP NAVIGATION HEAD BAR */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-850 px-6 py-4 flex items-center justify-between shadow-xs sticky top-0 z-30">
          {/* Breadcrumb path */}
          <div className="flex items-center space-x-2 text-3xs font-black text-slate-400 uppercase tracking-wider">
            <span>HomeoERP</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-600 dark:text-slate-300 font-bold">{currentRoleLabel} Workspace</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#00A651] font-black">{subView.replace('_', ' ')}</span>
          </div>

          {/* Right Header items */}
          <div className="flex items-center space-x-4">
            
            {/* Search Simulator */}
            <div className="relative hidden md:block">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Audit ERP cases..."
                className="pl-9 pr-4 py-1.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-3xs font-bold uppercase tracking-wider focus:outline-none focus:border-[#002147] w-48"
              />
            </div>

            {/* Notification triggers */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition relative cursor-pointer"
              >
                <Bell className="w-5 h-5" />
                {notifications.some(n => n.unread) && (
                  <span className="absolute top-1 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                )}
              </button>

              {/* Notification Overlay Panel */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-md p-4 z-50 space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-850 pb-2">
                    <span className="text-3xs font-black text-[#002147] dark:text-slate-100 uppercase tracking-wider">Live Notifications</span>
                    <button onClick={handleClearNotifications} className="text-[10px] text-rose-500 font-black hover:underline uppercase tracking-widest">Clear</button>
                  </div>
                  <div className="space-y-2">
                    {notifications.length === 0 ? (
                      <p className="text-4xs text-slate-400 text-center py-2 uppercase font-bold tracking-wider">No unread alerts.</p>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className="p-2 bg-slate-50 dark:bg-slate-950/60 rounded-lg text-3xs text-slate-500 font-semibold leading-relaxed">
                          {n.text}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile widget */}
            <div className="flex items-center space-x-2.5">
              <img referrerPolicy="no-referrer" src={session.avatar} alt={session.name} className="w-8 h-8 rounded-full border border-slate-200 object-cover" />
              <div className="text-left hidden lg:block">
                <span className="text-2xs font-black text-[#002147] dark:text-slate-200 block">{session.name}</span>
                <span className="text-4xs text-slate-400 uppercase font-black block">{session.email}</span>
              </div>
            </div>

          </div>
        </header>

        {/* 3. SCROLLABLE ACTIVE AREA */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
          
          {/* SUB-VIEW: OVERVIEW DESK (ROLE SPECIFIC SUMMARY) */}
          {subView === 'overview' && (
            <div className="space-y-8 animate-fadeIn" id="subview_overview">
              
              {/* WELCOME TICKET */}
              <div className="p-6 bg-[#002147] text-white rounded-2xl border border-[#ffffff10] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
                <div className="space-y-1">
                  <span className="bg-[#00A651] text-white font-black px-2.5 py-1 rounded text-4xs uppercase tracking-widest inline-block border border-[#ffffff10]">
                    {currentRoleLabel} Center
                  </span>
                  <h2 className="text-base font-black tracking-tight uppercase">
                    Burdwan HomoeoERP Workspace
                  </h2>
                  <p className="text-2xs text-slate-300 max-w-lg leading-relaxed lowercase first-letter:uppercase">
                    Logged in as <strong className="text-emerald-400">{session.name}</strong>. Digital academic and clinical record tracing is operational under NCH audit protocols.
                  </p>
                </div>
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-300 bg-[#001833]/80 p-3 rounded-xl border border-[#ffffff08] font-sans">
                  <div>UTC Roster: 2026-07-19</div>
                  <div className="mt-1 text-[#00A651]">DB Status: Synchronized</div>
                </div>
              </div>

              {/* METRIC CARD BAR */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard
                  id="met_students"
                  title="BHMS & MD Enrolments"
                  value={STUDENTS.length + " Registered"}
                  subtext="National Counseling quota"
                  icon={<GraduationCap className="w-5 h-5" />}
                  colorClass="text-[#002147] bg-[#002147]/10"
                />
                <MetricCard
                  id="met_faculty"
                  title="Clinical Consultants"
                  value={FACULTY.length + " Active"}
                  subtext="AYUSH Sanctioned Chairs"
                  icon={<Users className="w-5 h-5" />}
                  colorClass="text-[#00A651] bg-[#00A651]/10"
                />
                <MetricCard
                  id="met_patient"
                  title="Daily OPD Patients"
                  value="280+ Cases"
                  subtext="Teaching BHMCH Hospital"
                  icon={<Activity className="w-5 h-5" />}
                  colorClass="text-rose-600 bg-rose-600/10"
                />
              </div>

              {/* SPLIT MODULE DISPLAY DEPENDING ON ACTIVE ROLE */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* ROLE SPECIFIC CORE MODULE */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl space-y-4">
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-widest flex items-center gap-2">
                    <Database className="w-4 h-4 text-blue-500" />
                    <span>Your Active Workspace Directory</span>
                  </h3>

                  {/* Student View Specific overview */}
                  {session.role === 'student' && (
                    <div className="space-y-4">
                      <p className="text-2xs text-slate-500">
                        Welcome Arjun. Your clinical posting is active at <span className="font-bold text-slate-700 dark:text-slate-300">"Practice of Medicine OPD-3"</span>. Ensure logbooks are updated daily.
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-3xs">
                        <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl">
                          <span className="font-bold block text-slate-400 uppercase">My Professional Year</span>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mt-1">BHMS III Professional</span>
                        </div>
                        <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl">
                          <span className="font-bold block text-slate-400 uppercase">Session Attendance</span>
                          <span className="text-xs font-bold text-emerald-600 block mt-1">88% (Meets Criteria)</span>
                        </div>
                      </div>
                      <button onClick={() => setSubView('student_booking')} className="px-4 py-2.5 rounded-xl text-white bg-[#002147] hover:bg-[#001833] font-bold text-xs cursor-pointer transition">
                        Document Service Request
                      </button>
                    </div>
                  )}

                  {/* Faculty View specific overview */}
                  {session.role === 'faculty' && (
                    <div className="space-y-4">
                      <p className="text-2xs text-slate-500">
                        Hello Faculty Member. As part of Department of Homoeopathic Materia Medica, you are assigned 8 scholars. Weekly drug-proving seminar rosters are scheduled on Fridays.
                      </p>
                      <div className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl space-y-1.5">
                        <span className="text-3xs font-bold uppercase tracking-wider text-blue-600 block">Assigned Lectures today</span>
                        <div className="text-3xs text-slate-400 space-y-1">
                          <div>• 10:00 AM: BHMS I - Intro to Homoeopathic Dilutions</div>
                          <div>• 02:00 PM: BHMS III - Lycopodium drug proving characteristics</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* OPD Staff View specific overview */}
                  {session.role === 'opd_staff' && (
                    <div className="space-y-4">
                      <p className="text-2xs text-slate-500">
                        Welcome {session.name}. You are logged in at the <span className="font-bold text-slate-700 dark:text-slate-300">OPD General Medicine Counter</span>. Ensure all incoming patient symptoms are logged precisely.
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-3xs">
                        <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl">
                          <span className="font-bold block text-slate-400 uppercase">My OPD Station</span>
                          <span className="text-xs font-bold text-[#002147] dark:text-blue-400 block mt-1">General Medicine OPD-1</span>
                        </div>
                        <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl">
                          <span className="font-bold block text-slate-400 uppercase">Roster Shift</span>
                          <span className="text-xs font-bold text-[#00A651] block mt-1">Morning Desk (08:00 AM - 02:00 PM)</span>
                        </div>
                      </div>
                      <button onClick={() => setSubView('hospital_patient_reg')} className="px-4 py-2.5 rounded-xl text-white bg-[#002147] hover:bg-[#001833] font-bold text-xs cursor-pointer transition inline-block">
                        Open OPD Case Entry
                      </button>
                    </div>
                  )}

                  {/* Hospital Staff View specific overview */}
                  {session.role === 'hospital_staff' && (
                    <div className="space-y-4">
                      <p className="text-2xs text-slate-500">
                        Hello {session.name}. Your active area is <span className="font-bold text-slate-700 dark:text-slate-300">"IPD Ward 4 (Acute Care)"</span>. Check vital signs and coordinate clinical postings with interns.
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-3xs">
                        <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl">
                          <span className="font-bold block text-slate-400 uppercase">My Ward Assigned</span>
                          <span className="text-xs font-bold text-[#002147] dark:text-blue-400 block mt-1">IPD Ward-4 (Acute Care)</span>
                        </div>
                        <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl">
                          <span className="font-bold block text-slate-400 uppercase">Supervising Officer</span>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mt-1">Dr. Susmita Chatterjee</span>
                        </div>
                      </div>
                      <button onClick={() => setSubView('hospital_patient_reg')} className="px-4 py-2.5 rounded-xl text-white bg-[#002147] hover:bg-[#001833] font-bold text-xs cursor-pointer transition inline-block">
                        View Patient Registry
                      </button>
                    </div>
                  )}

                  {/* Admin/Registrar views overall rosters */}
                  {['registrar', 'principal', 'super_admin'].includes(session.role) && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-3xs font-bold text-slate-400 uppercase">
                        <span>Scholars roster verification</span>
                        <button onClick={() => setSubView('student_list')} className="text-blue-600 hover:underline">Full directory</button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-slate-50 dark:border-slate-850 text-slate-400 text-3xs uppercase tracking-wider font-bold">
                              <th className="py-2">Scholar</th>
                              <th className="py-2">Year</th>
                              <th className="py-2">Attendance</th>
                              <th className="py-2">Fees Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {STUDENTS.map(s => (
                              <tr key={s.id} className="border-b border-slate-50/50 dark:border-slate-850/50 text-2xs">
                                <td className="py-3 font-bold text-slate-800 dark:text-slate-200">{s.name}</td>
                                <td className="py-3 text-slate-500">{s.year}</td>
                                <td className="py-3 font-mono font-semibold text-emerald-600">{s.attendance}%</td>
                                <td className="py-3">
                                  <span className={`px-2 py-0.5 rounded text-4xs font-bold uppercase ${s.feesPaid >= s.feesTotal ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                                    {s.feesPaid >= s.feesTotal ? 'Cleared' : 'Pending'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                {/* SIDE COLUMN: QUICK ANNOUNCEMENTS & RECENT ERP LOGS */}
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl space-y-4">
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-widest flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-emerald-500" />
                    <span>Recent Activity Logs</span>
                  </h3>
                  <div className="space-y-3 relative pl-4 border-l border-slate-100 dark:border-slate-800 ml-1 text-3xs text-slate-500 leading-relaxed">
                    {[
                      { title: 'Case Record Logged', desc: 'Arsenicum Album 30C constitutional prescription registered for skin OPD.' },
                      { title: 'Academic Transcript Cleared', desc: 'Arjun Sen BHMS transcript verifications resolved.' },
                      { title: 'Syllabus updated', desc: 'NCH clinical case презентации guidelines integrated.' }
                    ].map((act, i) => (
                      <div key={i} className="relative">
                        <span className="absolute -left-[20.5px] top-1 w-2 h-2 rounded-full bg-[#00A651]"></span>
                        <span className="font-bold text-[#002147] dark:text-slate-300 block">{act.title}</span>
                        <span>{act.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUB-VIEW: STUDENT DIRECTORY LIST */}
          {subView === 'student_list' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 md:p-8 rounded-3xl space-y-6 animate-fadeIn" id="subview_student_list">
              <div className="border-b border-slate-50 dark:border-slate-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                    Scholars Register & Academic Indices
                  </h2>
                  <p className="text-2xs text-slate-400 mt-0.5">
                    Live compilation of active BHMS & MD enrollment under registrar control.
                  </p>
                </div>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={studentSearch}
                    onChange={e => setStudentSearch(e.target.value)}
                    placeholder="Search scholar name, rollNo..."
                    className="pl-9 pr-4 py-1.5 border border-slate-150 dark:border-slate-800 rounded-xl text-xs bg-transparent focus:outline-none w-48"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-50 dark:border-slate-850 text-slate-400 text-3xs uppercase tracking-wider font-bold">
                      <th className="py-2.5">Roll No & RegNo</th>
                      <th className="py-2.5">Name</th>
                      <th className="py-2.5">BHMS Year</th>
                      <th className="py-2.5">Attendance</th>
                      <th className="py-2.5">GPA</th>
                      <th className="py-2.5">Clinical Posting Assignment</th>
                      <th className="py-2.5">Scholarship Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {STUDENTS.filter(s => s.name.toLowerCase().includes(studentSearch.toLowerCase())).map(s => (
                      <tr key={s.id} className="border-b border-slate-50/50 dark:border-slate-850/50 hover:bg-slate-50/50 dark:hover:bg-slate-850/30 text-2xs transition">
                        <td className="py-3.5 font-mono text-slate-500">
                          <span className="block font-bold text-slate-700 dark:text-slate-300">{s.rollNo}</span>
                          <span className="text-4xs text-slate-400 block">{s.enrollmentNo}</span>
                        </td>
                        <td className="py-3.5 font-bold text-slate-800 dark:text-slate-100">{s.name}</td>
                        <td className="py-3.5 text-slate-500">{s.year}</td>
                        <td className={`py-3.5 font-mono font-bold ${s.attendance < 80 ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {s.attendance}%
                        </td>
                        <td className="py-3.5 font-mono font-bold">{s.gpa}</td>
                        <td className="py-3.5 text-slate-500 font-semibold">{s.clinicalPosting}</td>
                        <td className="py-3.5">
                          <span className={`px-2 py-0.5 rounded text-4xs font-bold uppercase ${s.scholarship !== 'None' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400' : 'bg-slate-50 text-slate-400'}`}>
                            {s.scholarship}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SUB-VIEW: STUDENT MY PROFILE */}
          {subView === 'student_profile' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 md:p-8 rounded-3xl space-y-6 animate-fadeIn" id="subview_student_profile">
              <div className="flex flex-col md:flex-row items-center gap-6 border-b border-slate-50 dark:border-slate-800 pb-5">
                <img referrerPolicy="no-referrer" src={session.avatar} alt={session.name} className="w-20 h-20 rounded-2xl border object-cover" />
                <div className="space-y-1 text-center md:text-left">
                  <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{session.name}</h2>
                  <p className="text-3xs text-blue-600 uppercase font-bold">BHMS III Professional Scholar</p>
                  <p className="text-4xs text-slate-400 mt-1">Enrollment Code: NCH-HOM-2023-8841</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-2xs">
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl space-y-2">
                  <span className="font-bold uppercase tracking-wider text-slate-400 block">Personal Details</span>
                  <div className="space-y-1 text-slate-500">
                    <div>• Email: {session.email}</div>
                    <div>• Phone: +91 98765 43210</div>
                    <div>• Hostel Allotment: Room 304, Dhanvantari Boys Hostel</div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl space-y-2">
                  <span className="font-bold uppercase tracking-wider text-slate-400 block">Fee Account Ledger</span>
                  <div className="space-y-1 text-slate-500">
                    <div>• Sanctioned Fee structure: $150,000 / professional year</div>
                    <div>• Fees Deposited: $125,000</div>
                    <div className="text-amber-600 font-bold">• Outstanding dues: $25,000 (Due July 30, 2026)</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUB-VIEW: STUDENT RESULTS MARKSHEET */}
          {subView === 'student_results' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 md:p-8 rounded-3xl space-y-6 animate-fadeIn" id="subview_student_results">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 border-b border-slate-50 dark:border-slate-800 pb-3">
                Professional Subject-wise Marks card
              </h2>

              <div className="space-y-4">
                {[
                  { subject: 'Materia Medica Therapeutics', theory: '84/100', practical: '45/50', status: 'Distinction' },
                  { subject: 'Organon & Homoeopathic Philosophy', theory: '78/100', practical: '42/50', status: 'First Class' },
                  { subject: 'Homoeopathic Repertorization', theory: '91/100', practical: '48/50', status: 'Distinction' },
                  { subject: 'Practice of Medicine', theory: '72/100', practical: '38/50', status: 'First Class' }
                ].map((res, i) => (
                  <div key={i} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">{res.subject}</span>
                      <span className="text-3xs text-slate-400 block mt-0.5">Theory: {res.theory} • Practical: {res.practical}</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 font-bold text-3xs uppercase">
                      {res.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-VIEW: STUDENT SERVICES BOOKING */}
          {subView === 'student_booking' && (
            <ServiceBookingModule studentId={session.regNo || 'std_1'} studentName={session.name} />
          )}

          {/* SUB-VIEW: FACULTY DIRECTORY LIST */}
          {subView === 'faculty_list' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 md:p-8 rounded-3xl space-y-6 animate-fadeIn" id="subview_faculty_list">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 border-b border-slate-50 dark:border-slate-800 pb-3">
                Authorized Academic Faculty Roster
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-50 dark:border-slate-850 text-slate-400 text-3xs uppercase tracking-wider font-bold">
                      <th className="py-2.5">Name</th>
                      <th className="py-2.5">Designation</th>
                      <th className="py-2.5">Department Specialty</th>
                      <th className="py-2.5">Qualifications</th>
                      <th className="py-2.5">Experience</th>
                      <th className="py-2.5">Scientific Publications</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FACULTY.map(f => (
                      <tr key={f.id} className="border-b border-slate-50/50 dark:border-slate-850/50 text-2xs">
                        <td className="py-3.5 font-bold text-slate-800 dark:text-slate-100">{f.name}</td>
                        <td className="py-3.5 text-slate-500 uppercase tracking-wider font-semibold">{f.designation}</td>
                        <td className="py-3.5 text-slate-500 font-bold">{f.department}</td>
                        <td className="py-3.5 font-mono text-slate-400">{f.qualification}</td>
                        <td className="py-3.5 text-slate-500">{f.experience}</td>
                        <td className="py-3.5 font-mono font-bold text-blue-600">{f.publications} Papers</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SUB-VIEW: FACULTY MY PUBLICATIONS */}
          {subView === 'faculty_publication' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 md:p-8 rounded-3xl space-y-6 animate-fadeIn" id="subview_faculty_publications">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 border-b border-slate-50 dark:border-slate-800 pb-3">
                Research Publications & Clinical Symposia Articles
              </h2>

              <div className="space-y-4">
                {[
                  { title: 'Scientific validation of Thuja Occidentalis in skin warts', journal: 'International Journal of Homoeopathic Sciences', date: 'April 2025' },
                  { title: 'Efficacy of Arsenicum Album 30C in Chronic Rhinitis cohorts', journal: 'AYUSH Medical Research Council Reports', date: 'November 2024' },
                  { title: 'Constitutional Repertorization trends using RADAR software algorithms', journal: 'Journal of Homoeopathic Philosophy', date: 'July 2024' }
                ].map((pub, i) => (
                  <div key={i} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl space-y-1">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">{pub.title}</span>
                    <span className="text-3xs text-slate-400 block">{pub.journal} • {pub.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-VIEW: HOSPITAL PATIENT REGISTRIES */}
          {subView === 'hospital_patient_reg' && (
            <div className="space-y-6 animate-fadeIn" id="subview_patient_registry">
              {/* OPD DASHBOARD COUNTERS */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xs">
                  <span className="text-4xs font-bold text-slate-400 uppercase tracking-widest block">Total OPD Registrations</span>
                  <span className="text-lg font-black text-[#002147] dark:text-blue-400 block mt-1">
                    {localPatients.filter(p => p.type === 'OPD').length}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">● Counter Live</span>
                </div>
                <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xs">
                  <span className="text-4xs font-bold text-slate-400 uppercase tracking-widest block">IPD Ward Admissions</span>
                  <span className="text-lg font-black text-slate-800 dark:text-slate-100 block mt-1">
                    {localPatients.filter(p => p.type === 'IPD').length}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Dhanvantari Wing</span>
                </div>
                <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xs">
                  <span className="text-4xs font-bold text-slate-400 uppercase tracking-widest block">Active Prescriptions</span>
                  <span className="text-lg font-black text-[#00A651] block mt-1">
                    {localPatients.filter(p => p.homoeopathicRemedy && p.homoeopathicRemedy !== 'Nux Vomica').length}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Verified AYUSH</span>
                </div>
                <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xs">
                  <span className="text-4xs font-bold text-slate-400 uppercase tracking-widest block">Recovered & Discharged</span>
                  <span className="text-lg font-black text-rose-600 block mt-1">
                    {localPatients.filter(p => p.status === 'Recovered').length}
                  </span>
                  <span className="text-[10px] text-rose-600 font-bold block mt-0.5">High Efficacy</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* PATIENT LIST PANEL */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-50 dark:border-slate-800 pb-3">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-800 dark:text-slate-100">
                      Clinical patient Case register
                    </h3>
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                      <input
                        type="text"
                        value={patientSearch}
                        onChange={e => setPatientSearch(e.target.value)}
                        placeholder="CaseNo, Remedy..."
                        className="pl-8 pr-3 py-1 border border-slate-150 dark:border-slate-800 rounded-lg text-3xs bg-transparent focus:outline-none w-36"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto text-2xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-50 dark:border-slate-850 text-slate-400 text-3xs font-bold uppercase">
                          <th className="py-2">CaseNo</th>
                          <th className="py-2">Patient</th>
                          <th className="py-2">Remedy & Potency</th>
                          <th className="py-2">Department specialty</th>
                          <th className="py-2">Treatment Status</th>
                          <th className="py-2 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {localPatients.filter(p => p.name.toLowerCase().includes(patientSearch.toLowerCase()) || (p.homoeopathicRemedy || '').toLowerCase().includes(patientSearch.toLowerCase())).map(p => (
                          <tr key={p.id} className="border-b border-slate-50/50 dark:border-slate-850/50 hover:bg-slate-50/40 dark:hover:bg-slate-850/20">
                            <td className="py-3 font-mono text-slate-500 font-bold">{p.caseNo}</td>
                            <td className="py-3">
                              <span className="font-bold text-slate-800 dark:text-slate-200 block">{p.name}</span>
                              <span className="text-4xs text-slate-400 block">Age {p.age} • {p.gender}</span>
                            </td>
                            <td className="py-3 font-semibold text-emerald-600">
                              {p.homoeopathicRemedy} <span className="text-3xs text-slate-400 font-normal">{p.potency}</span>
                            </td>
                            <td className="py-3 text-slate-500 font-medium">{p.department}</td>
                            <td className="py-3">
                              <span className={`px-2 py-0.5 rounded text-4xs font-bold uppercase ${p.status === 'Recovered' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'}`}>
                                {p.status}
                              </span>
                            </td>
                            <td className="py-3 text-right space-x-1.5 whitespace-nowrap">
                              <button
                                onClick={() => startEditing(p)}
                                className="px-2 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 transition font-bold uppercase tracking-wider text-4xs cursor-pointer inline-flex items-center gap-1"
                              >
                                <Edit3 className="w-2.5 h-2.5" />
                                <span>Prescribe / Edit</span>
                              </button>
                              <button
                                onClick={() => setPrintingPatient(p)}
                                className="px-2 py-1 rounded bg-slate-50 text-slate-700 hover:bg-slate-150 transition font-bold uppercase tracking-wider text-4xs cursor-pointer inline-flex items-center gap-1"
                              >
                                <Printer className="w-2.5 h-2.5" />
                                <span>Print Card</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* REGISTER NEW PATIENT FORM PANEL */}
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-800 dark:text-slate-100 border-b border-slate-50 dark:border-slate-800 pb-2">
                    OPD / IPD Case Entry
                  </h3>

                  <form onSubmit={handlePatientSubmit} className="space-y-4 text-3xs font-bold uppercase text-slate-500">
                    <div className="space-y-1">
                      <label>Patient Full Name</label>
                      <input
                        type="text"
                        required
                        value={patientForm.name}
                        onChange={e => setPatientForm({ ...patientForm, name: e.target.value })}
                        placeholder="e.g. Ramesh Chawla"
                        className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-transparent focus:outline-none focus:border-[#002147] font-normal text-slate-800 dark:text-slate-200"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label>Age</label>
                        <input
                          type="number"
                          required
                          value={patientForm.age}
                          onChange={e => setPatientForm({ ...patientForm, age: parseInt(e.target.value) || 30 })}
                          className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-transparent focus:outline-none focus:border-[#002147] font-normal text-slate-800 dark:text-slate-200"
                        />
                      </div>
                      <div className="space-y-1">
                        <label>OPD / IPD Type</label>
                        <select
                          value={patientForm.type}
                          onChange={e => setPatientForm({ ...patientForm, type: e.target.value as any })}
                          className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-white dark:bg-slate-900 focus:outline-none focus:border-[#002147] text-slate-800 dark:text-slate-200 font-normal"
                        >
                          <option value="OPD">OPD Clinic</option>
                          <option value="IPD">IPD Ward</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label>Pathological complaint / Symptoms</label>
                      <textarea
                        required
                        rows={2}
                        value={patientForm.complaint}
                        onChange={e => setPatientForm({ ...patientForm, complaint: e.target.value })}
                        placeholder="e.g. Skin lesions worse on exposure to damp cold..."
                        className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-transparent focus:outline-none focus:border-[#002147] font-normal text-slate-800 dark:text-slate-200"
                      ></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label>Remedy (Constitutional)</label>
                        <input
                          type="text"
                          value={patientForm.remedy}
                          onChange={e => setPatientForm({ ...patientForm, remedy: e.target.value })}
                          placeholder="e.g. Thuja Occidentalis"
                          className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-transparent focus:outline-none focus:border-[#002147] font-normal text-slate-800 dark:text-slate-200"
                        />
                      </div>
                      <div className="space-y-1">
                        <label>Potency Dilution</label>
                        <input
                          type="text"
                          value={patientForm.potency}
                          onChange={e => setPatientForm({ ...patientForm, potency: e.target.value })}
                          placeholder="e.g. 200C / 1M"
                          className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-transparent focus:outline-none focus:border-[#002147] font-normal text-slate-800 dark:text-slate-200"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer"
                    >
                      Register Clinical Case
                    </button>
                  </form>
                </div>
              </div>

              {/* EDIT PATIENT PRESCRIPTION MODAL */}
              {editingPatient && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl text-left">
                    <div className="flex justify-between items-center border-b border-slate-150 dark:border-slate-800 pb-3">
                      <div>
                        <span className="text-4xs font-black text-slate-400 uppercase tracking-widest block">Prescription Desk</span>
                        <h4 className="text-xs font-black uppercase text-[#002147] dark:text-white">
                          Edit Case: {editingPatient.caseNo}
                        </h4>
                      </div>
                      <button onClick={() => setEditingPatient(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold uppercase tracking-widest">✕ Close</button>
                    </div>

                    <form onSubmit={handleEditSubmit} className="space-y-4 text-3xs font-bold uppercase text-slate-500">
                      <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl space-y-1">
                        <span className="text-slate-400">Patient Details</span>
                        <div className="text-2xs font-bold text-slate-800 dark:text-slate-200">
                          {editingPatient.name} ({editingPatient.gender}, Age {editingPatient.age})
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label>Pathological Complaint / Symptoms</label>
                        <textarea
                          required
                          rows={2}
                          value={editForm.complaint}
                          onChange={e => setEditForm({ ...editForm, complaint: e.target.value })}
                          className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-transparent focus:outline-none focus:border-[#002147] font-normal text-slate-800 dark:text-slate-200"
                        ></textarea>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label>Homoeopathic Remedy</label>
                          <input
                            type="text"
                            required
                            value={editForm.remedy}
                            onChange={e => setEditForm({ ...editForm, remedy: e.target.value })}
                            className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-transparent focus:outline-none focus:border-[#002147] font-normal text-slate-800 dark:text-slate-200"
                          />
                        </div>
                        <div className="space-y-1">
                          <label>Potency Dilution</label>
                          <input
                            type="text"
                            required
                            value={editForm.potency}
                            onChange={e => setEditForm({ ...editForm, potency: e.target.value })}
                            className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-transparent focus:outline-none focus:border-[#002147] font-normal text-slate-800 dark:text-slate-200"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label>Department Specialty</label>
                          <select
                            value={editForm.department}
                            onChange={e => setEditForm({ ...editForm, department: e.target.value })}
                            className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-white dark:bg-slate-900 focus:outline-none focus:border-[#002147] text-slate-800 dark:text-slate-200 font-normal"
                          >
                            <option value="Practice of Medicine">Practice of Medicine</option>
                            <option value="Materia Medica">Materia Medica</option>
                            <option value="Organon of Medicine">Organon of Medicine</option>
                            <option value="Repertory">Repertory</option>
                            <option value="Paediatrics">Paediatrics</option>
                            <option value="Gynecology & Obstetrics">Gynecology</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label>Treatment Status</label>
                          <select
                            value={editForm.status}
                            onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                            className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-white dark:bg-slate-900 focus:outline-none focus:border-[#002147] text-slate-800 dark:text-slate-200 font-normal"
                          >
                            <option value="Under Treatment">Under Treatment</option>
                            <option value="Recovered">Recovered & Cured</option>
                            <option value="Chronic - Scheduled">Chronic - Scheduled</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setEditingPatient(null)}
                          className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* PRINT OPD CARD TICKET MODAL */}
              {printingPatient && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white text-slate-900 rounded-3xl max-w-lg w-full p-8 space-y-6 shadow-2xl relative border-4 border-double border-slate-300">
                    
                    {/* CASE SHEET CARD */}
                    <div className="border border-slate-300 p-6 space-y-6 bg-[#FCFDFE]" id="printable_opd_card">
                      {/* BHMCH HEADER */}
                      <div className="text-center border-b-2 border-slate-800 pb-4 space-y-1">
                        <h2 className="text-xs font-black uppercase tracking-widest text-[#002147]">
                          BURDWAN HOMOEOPATHIC MEDICAL COLLEGE & HOSPITAL
                        </h2>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                          1, Ramkrishna Road, Burdwan, West Bengal - 713101
                        </p>
                        <p className="text-[8px] font-black text-[#00A651] tracking-widest uppercase">
                          Affiliated to WBUHS & Recognized by NCH (AYUSH), Govt. of India
                        </p>
                        <div className="inline-block border border-slate-800 px-3 py-0.5 text-3xs font-black uppercase tracking-wider bg-slate-50 mt-1">
                          OPD CLINICAL TICKET
                        </div>
                      </div>

                      {/* PATIENT INFO GRID */}
                      <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-3xs border-b border-slate-200 pb-4 font-mono">
                        <div>
                          <strong className="text-slate-500 uppercase">Patient Name:</strong>
                          <span className="text-slate-900 font-bold block text-2xs uppercase mt-0.5">{printingPatient.name}</span>
                        </div>
                        <div>
                          <strong className="text-slate-500 uppercase">Case Ticket No:</strong>
                          <span className="text-[#002147] font-black block text-2xs mt-0.5">{printingPatient.caseNo}</span>
                        </div>
                        <div>
                          <strong className="text-slate-500 uppercase">Age / Gender:</strong>
                          <span className="text-slate-900 font-bold block mt-0.5">{printingPatient.age} Yrs / {printingPatient.gender}</span>
                        </div>
                        <div>
                          <strong className="text-slate-500 uppercase">Date Registered:</strong>
                          <span className="text-slate-900 font-bold block mt-0.5">{printingPatient.dateRegistered || new Date().toISOString().split('T')[0]}</span>
                        </div>
                        <div className="col-span-2">
                          <strong className="text-slate-500 uppercase font-bold">Diagnosed specialty:</strong>
                          <span className="text-slate-900 font-bold block mt-0.5">{printingPatient.department}</span>
                        </div>
                      </div>

                      {/* COMPLAINTS & RX */}
                      <div className="space-y-4 border-b border-slate-200 pb-4">
                        <div className="text-3xs font-mono">
                          <strong className="text-slate-500 uppercase block">Presenting Symptoms:</strong>
                          <p className="text-slate-800 leading-relaxed mt-1 font-sans italic text-2xs normal-case">
                            "{printingPatient.complaint}"
                          </p>
                        </div>

                        <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-1 font-mono">
                          <div className="flex items-center text-3xs text-slate-500 font-bold uppercase gap-1">
                            <span className="text-xs text-emerald-600 font-black">℞</span>
                            <span>Homoeopathic Prescription</span>
                          </div>
                          <div className="text-xs font-black text-emerald-700">
                            {printingPatient.homoeopathicRemedy || 'Nux Vomica'}{' '}
                            <span className="text-2xs text-slate-500 font-bold">{printingPatient.potency || '30C'}</span>
                          </div>
                          <p className="text-[8px] text-emerald-600 font-bold tracking-wider uppercase mt-1">
                            Dispense: Standard AYUSH dilution doses as prescribed by OPD Consultant.
                          </p>
                        </div>
                      </div>

                      {/* FOOTER SIGNATURES */}
                      <div className="flex justify-between items-end pt-4 text-[8px] font-black uppercase tracking-wider text-slate-400 font-mono">
                        <div>
                          <div>OPD Counter Clerk</div>
                          <div className="text-slate-700 font-bold mt-1">Dr. Amit Roy</div>
                        </div>
                        <div className="text-right">
                          <div className="border-t border-slate-300 pt-1 w-28">Supervising Consultant</div>
                          <div className="text-slate-900 font-bold mt-1">Dr. Susmita Chatterjee</div>
                        </div>
                      </div>
                    </div>

                    {/* PRINT ACTIONS BUTTONS */}
                    <div className="flex gap-4">
                      <button
                        onClick={() => setPrintingPatient(null)}
                        className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer"
                      >
                        Close
                      </button>
                      <button
                        onClick={() => {
                          window.print();
                        }}
                        className="w-1/2 py-2.5 bg-[#002147] hover:bg-[#001833] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer flex justify-center items-center gap-2"
                      >
                        <Printer className="w-4 h-4" />
                        <span>Print Ticket</span>
                      </button>
                    </div>

                  </div>
                </div>
              )}
            </div>
          )}

          {/* SUB-VIEW: HOSPITAL IPD BEDS */}
          {subView === 'hospital_ipd' && (
            <AdvancedIPD
              beds={ipdBeds}
              onUpdateBeds={setIpdBeds}
              userRole={session.role}
            />
          )}

          {/* SUB-VIEW: HOSPITAL PHARMACY */}
          {subView === 'hospital_pharmacy' && (
            <PharmacyModule
              inventory={pharmacyItems}
              onUpdateInventory={setPharmacyItems}
            />
          )}

          {/* SUB-VIEW: HOSPITAL LABORATORY */}
          {subView === 'hospital_laboratory' && (
            <LabManagement
              tests={labTests}
              onUpdateTests={setLabTests}
            />
          )}

          {/* SUB-VIEW: SECURE E-LIBRARY */}
          {subView === 'student_library' && (
            <SecureELibrary
              books={libraryBooks}
              userRole={session.role}
            />
          )}

          {/* SUB-VIEW: PRINCIPAL DESK CMS */}
          {subView === 'principal_desk_cms' && (
            <PrincipalDeskCMS
              profile={principalProfile}
              onUpdate={setPrincipalProfile}
              isAdmin={['super_admin', 'principal', 'office_admin'].includes(session.role)}
            />
          )}

          {/* SUB-VIEW: WEBSITE CMS EDITOR */}
          {subView === 'cms_website_editor' && (
            <CMSWebsiteEditor
              cmsData={cmsData}
              onUpdateCMS={setCmsData}
            />
          )}

          {/* SUB-VIEW: HOSPITAL CLINICAL POSTING */}
          {subView === 'hospital_clinical_posting' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 md:p-8 rounded-3xl space-y-6 animate-fadeIn" id="subview_clinical_posting">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 border-b border-slate-50 dark:border-slate-800 pb-3">
                Mandatory Clinical posting Cycles & Rotations
              </h2>

              <div className="space-y-4 text-xs">
                {[
                  { scholar: 'Arjun Sen (BHMS III)', dept: 'OPD Medicine-3', duration: 'July 01 - July 30, 2026', supervising: 'Dr. Susmita Chatterjee' },
                  { scholar: 'Priyanka Das (BHMS IV)', dept: 'Labor Room Ward B', duration: 'July 15 - August 15, 2026', supervising: 'Dr. Sunita Sharma' },
                  { scholar: 'Sneha Kulkarni (Intern)', dept: 'IPD Ward-4 (Acute care)', duration: 'June 01 - August 30, 2026', supervising: 'Dr. Susmita Chatterjee' }
                ].map((rot, i) => (
                  <div key={i} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">{rot.scholar}</span>
                      <span className="text-3xs text-slate-400 block mt-0.5">Supervising Consultant: {rot.supervising}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-[#002147] dark:text-blue-400 block">{rot.dept}</span>
                      <span className="text-3xs text-slate-400 block mt-0.5">{rot.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-VIEW: COLLEGE METRICS ANALYTICS */}
          {subView === 'analytics_admission' && (
            <div className="space-y-8 animate-fadeIn" id="subview_analytics">
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-3xl">
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  College ERP Statistics & Live Analytics Desk
                </h2>
                <p className="text-2xs text-slate-400 mt-0.5">
                  Institutional data monitoring for NCH reporting committees.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 1. ADMISSION TRENDS CHART */}
                <CustomBarChart
                  id="cht_admissions"
                  title="Annual Intake Counseling Trends (Applications received)"
                  data={ADMISSION_TRENDS.map(at => ({ label: at.year, value: at.applications }))}
                  yLabel="No. of Candidates"
                />

                {/* 2. HOSPITAL OPD TRENDS */}
                <CustomLineChart
                  id="cht_hospital"
                  title="Monthly Patient Cures Trend"
                  data={HOSPITAL_ANALYTICS.map(ha => ({ label: ha.month, value: ha.cures }))}
                />

                {/* 3. FINANCE DONUT */}
                <CustomPieChart
                  id="cht_finance"
                  title="Institutional revenue source breakdown"
                  data={FINANCE_ANALYTICS}
                />

                {/* 4. RESEARCH BY DEPARTMENT */}
                <CustomBarChart
                  id="cht_research"
                  title="Research Publications by homoeopathic Speciality chairs"
                  data={RESEARCH_BY_DEPT.map(rd => ({ label: rd.department.split(' ').pop() || '', value: rd.publications }))}
                  yLabel="Scientific Papers"
                />
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
};
