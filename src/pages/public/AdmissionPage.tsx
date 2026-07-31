import React, { useState, useEffect } from 'react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import {
  Calendar,
  FileText,
  CheckCircle2,
  Phone,
  Mail,
  HelpCircle,
  Download,
  UserPlus,
  ChevronDown,
  ChevronUp,
  Layers,
  Settings,
  Plus,
  Edit2,
  Trash2,
  Radio,
  Clock,
  Sparkles,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import {
  isSuperAdmin,
  isAdmin,
  isPrincipal,
  isVicePrincipal,
  getUserDisplayDesignation,
} from '../../utils/permissionHelper';
import {
  admissionCmsService,
  AdmissionEvent,
  AdmissionStage,
  AdmissionSettings,
} from '../../services/admissionCmsService';
import toast from 'react-hot-toast';

export const AdmissionPage: React.FC = () => {
  const { user } = useAuth();
  const isAuthorized =
    isSuperAdmin(user) || isAdmin(user) || isPrincipal(user) || isVicePrincipal(user);

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [applicantName, setApplicantName] = useState('');
  const [neetRoll, setNeetRoll] = useState('');
  const [neetScore, setNeetScore] = useState('');
  const [phone, setPhone] = useState('');
  const [courseChoice, setCourseChoice] = useState('BHMS');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Dynamic Data from CMS Service
  const [stages, setStages] = useState<AdmissionStage[]>([]);
  const [events, setEvents] = useState<AdmissionEvent[]>([]);
  const [settings, setSettings] = useState<AdmissionSettings>(admissionCmsService.getSettings());

  // Modals for authorized inline management
  const [editingEvent, setEditingEvent] = useState<Partial<AdmissionEvent> | null>(null);
  const [editingStage, setEditingStage] = useState<Partial<AdmissionStage> | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const loadData = () => {
    setStages(admissionCmsService.getStages());
    setEvents(admissionCmsService.getEvents(!isAuthorized)); // show all if admin, only published if guest
    setSettings(admissionCmsService.getSettings());
  };

  useEffect(() => {
    loadData();
    const unsubscribe = admissionCmsService.subscribe(loadData);
    return () => unsubscribe();
  }, [isAuthorized]);

  const requiredDocs = [
    'Allotment Letter (AACCC / WBMCC Allotment Order)',
    '6 Passport Size Photographs',
    'NEET-UG Admit Card & Rank Score Card 2026',
    'Class 10th Admit Card / Birth Certificate for Age Proof',
    'Class 12th (10+2) Marksheet and Passing Certificate',
    'SC / ST / OBC-A / OBC-B / EWS / PwD Category Certificate (If applicable)',
    'Domicile Certificate of West Bengal (Proforma a1/a2/b)',
    'Medical Fitness Certificate from a Registered Medical Practitioner',
    'Aadhaar Card or Valid Voter / Passport Photo ID',
  ];

  const faqs = [
    {
      q: 'How are seats allotted at BURDWAN HOMOEOPATHIC MEDICAL COLLEGE & HOSPITAL?',
      a: 'All 50 BHMS seats are allotted through centralized counseling. 85% State Quota seats are allotted by WBMCC (Govt of WB), and 15% All India Quota seats are allotted by AACCC (Ministry of AYUSH).',
    },
    {
      q: 'Is there any direct admission without NEET qualification?',
      a: 'No. As per National Commission for Homoeopathy (NCH) regulations, qualifying NEET-UG is strictly mandatory for admission to BHMS degree courses.',
    },
    {
      q: 'What is the duration and structure of BHMS course?',
      a: 'The BHMS program is 5.5 years in duration, comprising 4.5 years of academic and clinical training divided across 4 professional exams, followed by 1 year of compulsory rotatory internship at our attached 50-bed hospital.',
    },
    {
      q: 'Are hostel facilities available for male and female students?',
      a: 'Yes, separate campus hostels are available for boys and girls with 24/7 security, mess facilities, Wi-Fi, and recreation rooms.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !phone) return;
    setFormSubmitted(true);
  };

  // Quick Action: Active Stage update directly on page
  const handleStageSelect = (stageId: string) => {
    admissionCmsService.setActiveStage(stageId);
    toast.success('Active admission stage updated!');
  };

  // Event handlers for admin modals
  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent?.event || !editingEvent?.date) return;

    if (editingEvent.id) {
      admissionCmsService.updateEvent(editingEvent.id, editingEvent);
      toast.success('Event updated');
    } else {
      admissionCmsService.addEvent({
        event: editingEvent.event,
        date: editingEvent.date,
        description: editingEvent.description || '',
        status: editingEvent.status || 'Upcoming',
        isPublished: editingEvent.isPublished !== undefined ? editingEvent.isPublished : true,
        order: events.length + 1,
      });
      toast.success('Event added');
    }
    setEditingEvent(null);
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      admissionCmsService.deleteEvent(id);
      toast.success('Event deleted');
    }
  };

  const currentActiveStage = stages.find((s) => s.isCurrentActive) || stages[0];
  const activeStageIndex = stages.findIndex((s) => s.isCurrentActive);
  const activePercent = stages.length > 0 ? Math.round(((activeStageIndex + 1) / stages.length) * 100) : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      <Breadcrumb items={[{ label: 'BHMS Admissions 2026' }]} />

      {/* Authorized Admin Control Bar */}
      {isAuthorized && (
        <div className="p-4 bg-[#002147] text-white rounded-2xl border border-emerald-500/40 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="text-2xs font-extrabold uppercase tracking-wider text-emerald-300">
                Authorized Mode • {getUserDisplayDesignation(user)}
              </span>
              <p className="text-xs font-bold text-slate-100">
                Inline Admission Timeline & Active Stage Management Enabled
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() =>
                setEditingEvent({
                  event: '',
                  date: '',
                  description: '',
                  status: 'Upcoming',
                  isPublished: true,
                })
              }
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-2xs rounded-xl flex items-center gap-1 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Event</span>
            </button>
            <button
              onClick={() => setShowSettingsModal(true)}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-bold text-2xs rounded-xl flex items-center gap-1 transition cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Edit Page Config</span>
            </button>
            <a
              href="/cms"
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-2xs rounded-xl flex items-center gap-1 transition"
            >
              <span>Full CMS Dashboard</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="rounded-3xl bg-[#002147] text-white p-8 sm:p-12 shadow-xl space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <span className="px-3.5 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-black rounded-full uppercase tracking-wider border border-emerald-500/30">
          NEET-UG AYUSH Counseling Portal {settings.academicSession}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          {settings.heading}
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
          {settings.subheading}
        </p>

        <div className="pt-4 flex flex-wrap gap-4">
          <a
            href="#enquiry-form"
            className="px-5 py-2.5 bg-[#00A651] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition shadow-md flex items-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Submit Admission Enquiry</span>
          </a>
          <a
            href="/downloads"
            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Seat Matrix & Prospectus</span>
          </a>
        </div>
      </div>

      {/* ACTIVE ADMISSION STAGE & PROGRESS TRACKER */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#002147] dark:text-[#00A651]">
              <Layers className="w-6 h-6" />
              <h2 className="text-xl font-black">Current Active Admission Stage</h2>
            </div>
            <p className="text-xs text-slate-500">
              Track real-time progress through the official WBMCC & AACCC admission procedure.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/50 px-4 py-2 rounded-2xl border border-emerald-200 dark:border-emerald-800">
            <span className="text-2xs font-bold text-emerald-800 dark:text-emerald-300">
              Progress: {activePercent}% Complete
            </span>
            <div className="w-20 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${activePercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Current Active Stage Featured Box */}
        {currentActiveStage && (
          <div className="p-6 bg-gradient-to-r from-emerald-900/90 to-[#002147] text-white rounded-3xl border-2 border-emerald-500 shadow-lg relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 relative z-10 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-emerald-500 text-white text-2xs font-extrabold rounded-full uppercase tracking-wider animate-pulse">
                  Currently Open Stage
                </span>
                <span className="text-2xs text-emerald-300 font-mono">
                  Stage {currentActiveStage.order} of {stages.length}
                </span>
              </div>
              <h3 className="text-2xl font-black">{currentActiveStage.name}</h3>
              {currentActiveStage.description && (
                <p className="text-xs text-slate-200 leading-relaxed">
                  {currentActiveStage.description}
                </p>
              )}
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative z-10 w-full md:w-auto">
              <a
                href="#enquiry-form"
                className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-2xl shadow-md text-center transition cursor-pointer"
              >
                Proceed to Desk Guidance
              </a>
            </div>
          </div>
        )}

        {/* Timeline Stage Pipeline Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {stages.map((stage) => (
            <div
              key={stage.id}
              className={`p-5 rounded-2xl border transition relative flex flex-col justify-between space-y-3 ${
                stage.isCurrentActive
                  ? 'bg-emerald-500/10 border-emerald-500 shadow-md ring-2 ring-emerald-500/30'
                  : stage.status === 'Completed'
                  ? 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xs font-mono font-bold text-slate-400">
                    Step 0{stage.order}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                      stage.status === 'Currently Open'
                        ? 'bg-emerald-500 text-white animate-pulse'
                        : stage.status === 'Completed'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {stage.status}
                  </span>
                </div>

                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">
                  {stage.name}
                </h4>
                {stage.description && (
                  <p className="text-2xs text-slate-500 line-clamp-2">{stage.description}</p>
                )}
              </div>

              {/* Admin quick toggle inside card */}
              {isAuthorized && !stage.isCurrentActive && (
                <button
                  onClick={() => handleStageSelect(stage.id)}
                  className="w-full py-1.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-700 dark:text-slate-300 font-extrabold text-[10px] rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Radio className="w-3 h-3 text-emerald-500" />
                  <span>Set as Active Stage</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Dynamic Important Dates & Eligibility */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Dynamic Admission Timeline */}
        <Card className="p-8 space-y-6 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 text-[#002147] dark:text-[#00A651]">
              <Calendar className="w-6 h-6" />
              <h2 className="text-xl font-black">Important Admission Dates (2026)</h2>
            </div>

            {isAuthorized && (
              <button
                onClick={() =>
                  setEditingEvent({
                    event: '',
                    date: '',
                    description: '',
                    status: 'Upcoming',
                    isPublished: true,
                  })
                }
                className="p-1.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-xl font-bold text-2xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Date</span>
              </button>
            )}
          </div>

          <div className="space-y-3">
            {events.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border flex items-center justify-between gap-3 transition ${
                  item.status === 'Active Now'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800'
                }`}
              >
                <div className="space-y-0.5 min-w-0 flex-1">
                  <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                    {item.event}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">{item.date}</p>
                  {item.description && (
                    <p className="text-3xs text-slate-400 mt-0.5">{item.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`px-2.5 py-1 text-[10px] font-black rounded-lg uppercase ${
                      item.status === 'Active Now'
                        ? 'bg-emerald-500 text-white animate-pulse'
                        : item.status === 'Completed'
                        ? 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {item.status}
                  </span>

                  {isAuthorized && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingEvent(item)}
                        className="p-1 text-blue-600 hover:text-blue-800 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(item.id)}
                        className="p-1 text-rose-600 hover:text-rose-800 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Eligibility & Reservation */}
        <Card className="p-8 space-y-6 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center space-x-3 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
            <h2 className="text-xl font-black">Seat Distribution & Eligibility</h2>
          </div>
          <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <p className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 rounded-xl">
              <strong>Total Approved Intake:</strong> {settings.totalSeats} Seats for BHMS Degree Program (NCH Code: WB04).
            </p>
            <ul className="space-y-2 pt-2">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
                <span>
                  <strong>85% West Bengal State Quota ({settings.stateQuotaSeats} Seats):</strong> Allotted via WBMCC online counseling for WB domiciled candidates.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 mt-1 shrink-0" />
                <span>
                  <strong>15% All India Quota ({settings.allIndiaQuotaSeats} Seats):</strong> Allotted via AACCC counseling open to candidates across India.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 mt-1 shrink-0" />
                <span>
                  <strong>Qualifying Cut-off:</strong> Minimum 50th percentile in NEET-UG 2026 for General (40th percentile for SC/ST/OBC).
                </span>
              </li>
            </ul>
          </div>
        </Card>
      </div>

      {/* Document Verification Checklist */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 space-y-6 shadow-xs">
        <div className="flex items-center space-x-3 text-[#002147] dark:text-[#00A651]">
          <FileText className="w-6 h-6" />
          <h2 className="text-xl font-black">Mandatory Document Verification Checklist</h2>
        </div>
        <p className="text-xs text-slate-500">
          Candidates reporting for physical document verification at BHMC&H campus must bring original documents along with 2 sets of self-attested photocopies:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {requiredDocs.map((doc, i) => (
            <div
              key={i}
              className="flex items-start space-x-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{doc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Admission Helpline & Quick Enquiry Form */}
      <div id="enquiry-form" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="space-y-1">
            <span className="text-2xs font-black uppercase tracking-wider text-emerald-600">
              Quick Portal Desk
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Admission Guidance & Seat Reservation Enquiry
            </h3>
          </div>

          {formSubmitted ? (
            <div className="p-8 bg-emerald-50 dark:bg-emerald-950/50 rounded-2xl border border-emerald-200 dark:border-emerald-900 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h4 className="text-lg font-bold text-emerald-800 dark:text-emerald-300">
                Enquiry Submitted Successfully!
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Our Admission Nodal Officer will contact you within 24 hours regarding NEET score evaluation and counseling assistance.
              </p>
              <Button
                onClick={() => setFormSubmitted(false)}
                variant="outline"
                className="mt-2 text-xs cursor-pointer"
              >
                Submit Another Request
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Candidate Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="e.g. Ananya Sharma"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#002147] dark:focus:ring-[#00A651]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Phone Number (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#002147] dark:focus:ring-[#00A651]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    NEET Roll No (Optional)
                  </label>
                  <input
                    type="text"
                    value={neetRoll}
                    onChange={(e) => setNeetRoll(e.target.value)}
                    placeholder="202604921"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#002147] dark:focus:ring-[#00A651]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    NEET Score / Percentile
                  </label>
                  <input
                    type="text"
                    value={neetScore}
                    onChange={(e) => setNeetScore(e.target.value)}
                    placeholder="e.g. 480 marks"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#002147] dark:focus:ring-[#00A651]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Program Offered
                  </label>
                  <select
                    value={courseChoice}
                    onChange={(e) => setCourseChoice(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#002147] dark:focus:ring-[#00A651] font-bold"
                  >
                    <option value="BHMS">BHMS - Bachelor of Homoeopathic Medicine and Surgery (5.5 Years UG)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#002147] hover:bg-[#001530] text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
              >
                Submit Admission Guidance Form
              </button>
            </form>
          )}
        </div>

        {/* Admission Helpline Contact Card */}
        <div className="bg-[#002147] text-white rounded-3xl p-8 space-y-6 shadow-md flex flex-col justify-between">
          <div className="space-y-4">
            <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 text-2xs font-bold rounded uppercase border border-emerald-500/30">
              Nodal Admission Desk
            </span>
            <h3 className="text-xl font-extrabold">Admission Helpline</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Have questions regarding WBMCC seat choice filling, fee payment, or document verification? Speak with our admission desk officer:
            </p>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>{settings.helplinePhones}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>{settings.helplineEmail}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400">
            Office Hours: {settings.officeHours}
          </div>
        </div>
      </div>

      {/* Admission FAQs */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 space-y-6">
        <div className="flex items-center space-x-3 text-[#002147] dark:text-[#00A651]">
          <HelpCircle className="w-6 h-6" />
          <h2 className="text-xl font-black">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden transition"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                className="w-full p-4 text-left flex items-center justify-between font-bold text-xs text-slate-800 dark:text-slate-200 bg-slate-50/50 dark:bg-slate-950/50 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <span>{faq.q}</span>
                {activeFaq === i ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>
              {activeFaq === i && (
                <div className="p-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ADMIN INLINE EDIT EVENT MODAL */}
      {isAuthorized && editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              {editingEvent.id ? 'Edit Admission Date' : 'Add Admission Event'}
            </h3>

            <form onSubmit={handleSaveEvent} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingEvent.event || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, event: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Date / Schedule *
                </label>
                <input
                  type="text"
                  required
                  value={editingEvent.date || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                  placeholder="e.g. 02 August - 05 August 2026"
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Status
                </label>
                <select
                  value={editingEvent.status || 'Upcoming'}
                  onChange={(e) => setEditingEvent({ ...editingEvent, status: e.target.value as any })}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 font-bold"
                >
                  <option value="Completed">Completed</option>
                  <option value="Active Now">Active Now</option>
                  <option value="Upcoming">Upcoming</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#002147] dark:bg-[#00A651] text-white font-bold rounded-xl"
                >
                  Save Date
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN SETTINGS MODAL */}
      {isAuthorized && showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Edit Admission Page Metadata
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                admissionCmsService.updateSettings(settings);
                toast.success('Page metadata saved');
                setShowSettingsModal(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Header Heading
                </label>
                <input
                  type="text"
                  required
                  value={settings.heading}
                  onChange={(e) => setSettings({ ...settings, heading: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Subheading Banner Description
                </label>
                <textarea
                  rows={3}
                  value={settings.subheading}
                  onChange={(e) => setSettings({ ...settings, subheading: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#002147] dark:bg-[#00A651] text-white font-bold rounded-xl"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
