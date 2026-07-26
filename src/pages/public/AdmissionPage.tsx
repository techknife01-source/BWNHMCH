import React, { useState } from 'react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Calendar, FileText, CheckCircle2, Phone, Mail, HelpCircle, Download, UserPlus, AlertCircle, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

export const AdmissionPage: React.FC = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [applicantName, setApplicantName] = useState('');
  const [neetRoll, setNeetRoll] = useState('');
  const [neetScore, setNeetScore] = useState('');
  const [phone, setPhone] = useState('');
  const [courseChoice, setCourseChoice] = useState('BHMS');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const importantDates = [
    { event: 'NEET-UG 2026 Results Declaration', date: '14 June 2026', status: 'Completed' },
    { event: 'WBMCC State AYUSH Counselling Registration', date: '10 July - 25 July 2026', status: 'Active Now' },
    { event: '1st Round Physical Document Verification at BHMC&H', date: '02 August - 05 August 2026', status: 'Upcoming' },
    { event: 'Commencement of BHMS Academic Session 2026-27', date: '18 August 2026', status: 'Upcoming' },
  ];

  const requiredDocs = [
    'NEET-UG Admit Card & Rank Score Card 2026',
    'Class 10th Admit Card / Birth Certificate for Age Proof',
    'Class 12th (10+2) Marksheet and Passing Certificate',
    'SC / ST / OBC-A / OBC-B / EWS / PwD Category Certificate (If applicable)',
    'Domicile Certificate of West Bengal (Proforma a1/a2/b)',
    'Medical Fitness Certificate from a Registered Medical Practitioner',
    '10 Passport Size Recent Photographs',
    'Aadhaar Card or Valid Voter / Passport Photo ID'
  ];

  const faqs = [
    {
      q: 'How are seats allotted at Burdwan Homoeopathic Medical College?',
      a: 'All 63 BHMS seats are allotted through centralized counseling. 85% State Quota seats are allotted by WBMCC (Govt of WB), and 15% All India Quota seats are allotted by AACCC (Ministry of AYUSH).'
    },
    {
      q: 'Is there any direct admission without NEET qualification?',
      a: 'No. As per National Commission for Homoeopathy (NCH) regulations, qualifying NEET-UG is strictly mandatory for admission to BHMS degree courses.'
    },
    {
      q: 'What is the duration and structure of BHMS course?',
      a: 'The BHMS program is 5.5 years in duration, comprising 4.5 years of academic and clinical training divided across 4 professional exams, followed by 1 year of compulsory rotatory internship at our attached 50-bed hospital.'
    },
    {
      q: 'Are hostel facilities available for male and female students?',
      a: 'Yes, separate campus hostels are available for boys and girls with 24/7 security, mess facilities, Wi-Fi, and recreation rooms.'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !phone) return;
    setFormSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      <Breadcrumb items={[{ label: 'Admissions 2026' }]} />

      {/* Header Banner */}
      <div className="rounded-3xl bg-[#002147] text-white p-8 sm:p-12 shadow-xl space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <span className="px-3.5 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-black rounded-full uppercase tracking-wider border border-emerald-500/30">
          NEET-UG AYUSH Counseling Portal 2026-27
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          BHMS & M.D. Homoeopathy Admissions
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
          Welcome prospective medical scholars! Enroll in Eastern India's leading Homoeopathic medical college. Complete counseling guidance, seat matrix, fees structure, and document verification details provided below.
        </p>

        <div className="pt-4 flex flex-wrap gap-4">
          <a href="#enquiry-form" className="px-5 py-2.5 bg-[#00A651] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition shadow-md flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            <span>Submit Admission Enquiry</span>
          </a>
          <a href="/downloads" className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span>Download Seat Matrix & Prospectus</span>
          </a>
        </div>
      </div>

      {/* Grid: Counseling Dates & Eligibility */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Dates */}
        <Card className="p-8 space-y-6 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center space-x-3 text-[#002147] dark:text-[#00A651]">
            <Calendar className="w-6 h-6" />
            <h2 className="text-xl font-black">Important Admission Dates (2026)</h2>
          </div>
          <div className="space-y-3">
            {importantDates.map((item, i) => (
              <div key={i} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{item.event}</p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">{item.date}</p>
                </div>
                <span className={`px-2.5 py-1 text-[10px] font-black rounded-lg uppercase ${
                  item.status === 'Active Now' ? 'bg-emerald-500 text-white animate-pulse' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}>
                  {item.status}
                </span>
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
              <strong>Total Approved Intake:</strong> 63 Seats for BHMS Degree Program (NCH Code: WB04).
            </p>
            <ul className="space-y-2 pt-2">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
                <span><strong>85% West Bengal State Quota (54 Seats):</strong> Allotted via WBMCC online counseling for WB domiciled candidates.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 mt-1 shrink-0" />
                <span><strong>15% All India Quota (9 Seats):</strong> Allotted via AACCC counseling open to candidates across India.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 mt-1 shrink-0" />
                <span><strong>Qualifying Cut-off:</strong> Minimum 50th percentile in NEET-UG 2026 for General (40th percentile for SC/ST/OBC).</span>
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
        <p className="text-xs text-slate-500">Candidates reporting for physical document verification at BHMC&H campus must bring original documents along with 2 sets of self-attested photocopies:</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {requiredDocs.map((doc, i) => (
            <div key={i} className="flex items-start space-x-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
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
            <span className="text-2xs font-black uppercase tracking-wider text-emerald-600">Quick Portal Desk</span>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">Admission Guidance & Seat Reservation Enquiry</h3>
          </div>

          {formSubmitted ? (
            <div className="p-8 bg-emerald-50 dark:bg-emerald-950/50 rounded-2xl border border-emerald-200 dark:border-emerald-900 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h4 className="text-lg font-bold text-emerald-800 dark:text-emerald-300">Enquiry Submitted Successfully!</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Our Admission Nodal Officer will contact you within 24 hours regarding NEET score evaluation and counseling assistance.
              </p>
              <Button onClick={() => setFormSubmitted(false)} variant="outline" className="mt-2 text-xs">Submit Another Request</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Candidate Full Name *</label>
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
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Phone Number (WhatsApp) *</label>
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
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">NEET Roll No (Optional)</label>
                  <input
                    type="text"
                    value={neetRoll}
                    onChange={(e) => setNeetRoll(e.target.value)}
                    placeholder="202604921"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#002147] dark:focus:ring-[#00A651]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">NEET Score / Percentile</label>
                  <input
                    type="text"
                    value={neetScore}
                    onChange={(e) => setNeetScore(e.target.value)}
                    placeholder="e.g. 480 marks"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#002147] dark:focus:ring-[#00A651]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Program of Interest</label>
                  <select
                    value={courseChoice}
                    onChange={(e) => setCourseChoice(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#002147] dark:focus:ring-[#00A651]"
                  >
                    <option value="BHMS">BHMS (5.5 Years UG)</option>
                    <option value="MD-MM">M.D. Homoeopathy - Materia Medica</option>
                    <option value="MD-ORG">M.D. Homoeopathy - Organon</option>
                    <option value="MD-REP">M.D. Homoeopathy - Repertory</option>
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
                <span>+91 342 2634123 / +91 98321 88900</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>admission@bhmc.ac.in</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400">
            Office Hours: Mon - Sat (10:00 AM - 5:00 PM)
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
                className="w-full p-4 text-left flex items-center justify-between font-bold text-xs text-slate-800 dark:text-slate-200 bg-slate-50/50 dark:bg-slate-950/50 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <span>{faq.q}</span>
                {activeFaq === i ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
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
    </div>
  );
};
