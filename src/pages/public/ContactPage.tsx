import React, { useState } from 'react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Textarea } from '../../components/common/Textarea';
import { Button } from '../../components/common/Button';
import { APP_CONSTANTS } from '../../constants/app.constants';
import { Phone, Mail, MapPin, Clock, ShieldAlert, CheckCircle2, Send, Building2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('General Enquiry');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !message) return;
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      <Breadcrumb items={[{ label: 'Contact Us' }]} />

      {/* Banner Header */}
      <div className="rounded-3xl bg-[#002147] text-white p-8 sm:p-12 shadow-xl space-y-4">
        <span className="px-3.5 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-black rounded-full uppercase tracking-wider border border-emerald-500/30">
          Reach Out To Us
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          College & Hospital Administration Desk
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
          We welcome your inquiries regarding BHMS & M.D. admissions, OPD hospital appointments, academic transcripts, or research collaborations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Form */}
        <Card className="p-8 space-y-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="space-y-1">
            <span className="text-2xs font-black uppercase tracking-wider text-emerald-600">Online Helpdesk</span>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">Send an Official Message</h3>
          </div>

          {submitted ? (
            <div className="p-8 bg-emerald-50 dark:bg-emerald-950/50 rounded-2xl border border-emerald-200 dark:border-emerald-900 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h4 className="text-lg font-bold text-emerald-800 dark:text-emerald-300">Message Received</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Thank you <strong>{fullName}</strong>. Your query has been logged and routed to the <strong>{department}</strong> desk. Reference Ticket: <span className="font-mono font-bold text-[#002147] dark:text-[#00A651]">#TKT-2026-4401</span>.
              </p>
              <Button onClick={() => setSubmitted(false)} variant="outline" className="mt-2 text-xs">Send Another Inquiry</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Dr. Arindam Paul"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="arindam@example.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98321 00000"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Target Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none"
                  >
                    <option value="General Enquiry">General Information</option>
                    <option value="Admission Cell">NEET Admission Cell</option>
                    <option value="Hospital Desk">Hospital OPD & IPD Desk</option>
                    <option value="Principal Secretariat">Principal Office Secretariat</option>
                    <option value="Accounts Section">Accounts & Student Fees Section</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Message / Inquiry Details *</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your inquiry or request in detail..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#002147] hover:bg-[#001530] text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit Official Inquiry</span>
              </button>
            </form>
          )}
        </Card>

        {/* Contact Info & Map */}
        <div className="space-y-6">
          <Card className="p-8 space-y-6 border border-slate-200/80 dark:border-slate-800">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Campus Location & Contacts</h3>

            <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Campus Address:</p>
                  <p>Burdwan Homoeopathic Medical College & Hospital, Rajbati, Purba Bardhaman, West Bengal 713104, India.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Phone Contacts:</p>
                  <p>College Office: +91 342 2634123</p>
                  <p>Hospital Helpdesk: +91 342 2634456</p>
                  <p>Emergency / Casualty: +91 98321 45678</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Email Addresses:</p>
                  <p>General: principal@bhmc.ac.in</p>
                  <p>Admissions: admission@bhmc.ac.in</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Office & OPD Hours:</p>
                  <p>College Office: Mon - Sat (10:00 AM - 5:00 PM)</p>
                  <p>Hospital OPD: Mon - Sat (9:00 AM - 2:00 PM)</p>
                  <p>IPD Casualty: 24 Hours Open</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="bg-[#002147] text-white p-6 rounded-3xl space-y-3 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-rose-400 uppercase flex items-center gap-1">
                <ShieldAlert className="w-4 h-4" /> Anti-Ragging Helpline
              </p>
              <p className="text-xs text-slate-300">Toll-Free 24x7 Anti-Ragging Cell: 1800-180-5522</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
