import React, { useState, useEffect } from 'react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldAlert,
  CheckCircle2,
  Send,
  Building2,
  Globe,
  Train,
  Navigation,
  UserCheck,
  Stethoscope,
  ExternalLink,
  HeartPulse
} from 'lucide-react';
import { institutionSettingsService, InstitutionSettings } from '../../services/institutionSettingsService';

export const ContactPage: React.FC = () => {
  const [settings, setSettings] = useState<InstitutionSettings>(() => institutionSettingsService.getSettings());
  const [submitted, setSubmitted] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('General Enquiry');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleSettingsUpdate = () => {
      setSettings(institutionSettingsService.getSettings());
    };
    window.addEventListener('bhmch_institution_settings_updated', handleSettingsUpdate);
    return () => window.removeEventListener('bhmch_institution_settings_updated', handleSettingsUpdate);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !message) return;
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      <Breadcrumb items={[{ label: 'Contact Us' }]} />

      {/* Banner Header */}
      <div className="rounded-3xl bg-[#002147] text-white p-8 sm:p-12 shadow-xl space-y-4 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 opacity-10 pointer-events-none">
          <Building2 className="w-96 h-96 text-white" />
        </div>

        <div className="relative z-10 space-y-3 max-w-3xl">
          <span className="px-3.5 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-black rounded-full uppercase tracking-wider border border-emerald-500/30">
            Official Institution Desk
          </span>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {settings.collegeName}
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Get in touch with the principal’s secretariat, college administrative office, hospital OPD registration, or emergency helpline for general inquiries, admissions, and hospital services.
          </p>
        </div>
      </div>

      {/* Primary Contact Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* College Office */}
        <Card className="p-5 space-y-3 border border-slate-200/80 dark:border-slate-800 hover:shadow-md transition">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">College Office</h4>
            <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">{settings.collegePhone}</p>
            <p className="text-2xs text-slate-500 mt-1">General Office & Academic Inquiry</p>
          </div>
        </Card>

        {/* Hospital Helpdesk */}
        <Card className="p-5 space-y-3 border border-slate-200/80 dark:border-slate-800 hover:shadow-md transition">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Hospital Desk</h4>
            <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">{settings.hospitalPhone}</p>
            <p className="text-2xs text-slate-500 mt-1">OPD, IPD Wards & Emergency</p>
          </div>
        </Card>

        {/* Principal Secretariat */}
        <Card className="p-5 space-y-3 border border-slate-200/80 dark:border-slate-800 hover:shadow-md transition">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950 flex items-center justify-center text-purple-600">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Principal Contact</h4>
            <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 font-mono">
              {settings.principalName}
            </p>
            <p className="text-2xs text-slate-700 dark:text-slate-300 font-bold">Tel: {settings.principalMobile}</p>
            <p className="text-3xs text-slate-500 font-mono truncate">{settings.principalEmail}</p>
          </div>
        </Card>

        {/* Official Email */}
        <Card className="p-5 space-y-3 border border-slate-200/80 dark:border-slate-800 hover:shadow-md transition">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950 flex items-center justify-center text-amber-600">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Official Email</h4>
            <a href={`mailto:${settings.collegeEmail}`} className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline block truncate mt-0.5">
              {settings.collegeEmail}
            </a>
            <p className="text-2xs text-slate-500 mt-1">Website: www.bhnmch.com</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Contact Form */}
        <Card className="p-6 sm:p-8 space-y-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="space-y-1">
            <span className="text-2xs font-black uppercase tracking-wider text-emerald-600">Online Helpdesk</span>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">Quick Contact Form</h3>
            <p className="text-xs text-slate-500">Send an official message directly to the college administration.</p>
          </div>

          {submitted ? (
            <div className="p-8 bg-emerald-50 dark:bg-emerald-950/50 rounded-2xl border border-emerald-200 dark:border-emerald-900 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h4 className="text-lg font-bold text-emerald-800 dark:text-emerald-300">Inquiry Submitted Successfully</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Thank you <strong>{fullName}</strong>. Your query has been logged and routed to the <strong>{department}</strong> desk. Reference Ticket: <span className="font-mono font-bold text-[#002147] dark:text-[#00A651]">#TKT-2026-8802</span>.
              </p>
              <Button onClick={() => setSubmitted(false)} variant="outline" className="mt-2 text-xs">Send Another Inquiry</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Dr. Arindam Paul"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    <option value="Admission Cell">BHMS Admission Cell</option>
                    <option value="Hospital Desk">Hospital OPD & IPD Desk</option>
                    <option value="Principal Secretariat">Principal Office Secretariat</option>
                    <option value="Accounts Section">Accounts & Fees Section</option>
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
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        {/* Detailed Address, Location, Emergency & Working Hours */}
        <div className="space-y-6">
          <Card className="p-6 sm:p-8 space-y-6 border border-slate-200/80 dark:border-slate-800">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Official Campus Address
            </h3>

            <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
                <p className="font-extrabold text-slate-900 dark:text-white text-sm">
                  {settings.collegeName}
                </p>
                <p>{settings.addressLine1}</p>
                <p>{settings.addressLine2}</p>
                <p>{settings.district}, {settings.city}, {settings.state} - {settings.pincode}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                  <Train className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Nearest Railway Station:</span>
                    <span className="text-slate-600 dark:text-slate-300 font-semibold">Bardhaman Junction (2 km)</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                  <Navigation className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Distance from Kolkata:</span>
                    <span className="text-slate-600 dark:text-slate-300 font-semibold">95 km (via NH-19 / Grand Trunk Road)</span>
                  </div>
                </div>
              </div>

              {/* Working Hours */}
              <div className="pt-2 space-y-2">
                <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
                  <Clock className="w-4 h-4 text-purple-600" /> Working Hours
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-2xs">
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="font-bold block text-slate-800 dark:text-slate-200">College Office</span>
                    <span className="text-slate-500">Mon - Sat: 10:00 AM - 5:00 PM</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="font-bold block text-slate-800 dark:text-slate-200">Hospital OPD</span>
                    <span className="text-slate-500">Mon - Sat: 9:00 AM - 2:00 PM</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="font-bold block text-emerald-600 dark:text-emerald-400">IPD Wards</span>
                    <span className="text-slate-500">24 Hours Emergency</span>
                  </div>
                </div>
              </div>

              {/* Website */}
              <div className="pt-1 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Official Website:</span>
                <a
                  href="http://www.bwnhmch.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <Globe className="w-3.5 h-3.5" /> www.bwnhmch.com <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </Card>

          {/* Emergency Contacts Banner */}
          <div className="bg-[#002147] text-white p-6 rounded-3xl space-y-3 shadow-md">
            <div className="flex items-center gap-2 text-rose-400 font-black text-xs uppercase tracking-wider">
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
              Emergency Contacts & Helplines
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div>
                <span className="text-slate-300 block text-2xs">Hospital Emergency Desk:</span>
                <span className="font-extrabold text-white font-mono text-sm">{settings.hospitalPhone}</span>
              </div>
              <div>
                <span className="text-slate-300 block text-2xs">Principal Hotline:</span>
                <span className="font-extrabold text-white font-mono text-sm">{settings.principalMobile}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 text-2xs text-slate-300">
              24x7 Anti-Ragging Cell Helpline: <strong className="text-white font-mono">1800-180-5522</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Google Map Embed */}
      <Card className="p-6 space-y-4 border border-slate-200/80 dark:border-slate-800 overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-rose-500" /> Google Map Location
            </h3>
            <p className="text-xs text-slate-500">Nimbark Bhaban, Rajganj, Nutanganj, Purba Bardhaman</p>
          </div>
          <a
            href="https://maps.google.com/?q=Burdwan+Homoeopathic+Medical+College+%26+Hospital+Nutanganj+Purba+Bardhaman"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>Open in Maps</span> <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="w-full h-80 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner bg-slate-100 dark:bg-slate-900">
          <iframe
            title="BURDWAN HOMOEOPATHIC MEDICAL COLLEGE & HOSPITAL Google Map Location"
            src="https://maps.google.com/maps?q=Burdwan%20Homoeopathic%20Medical%20College%20%26%20Hospital%20Nimbark%20Bhaban%20Nutanganj%20Purba%20Bardhaman&t=&z=15&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </Card>
    </div>
  );
};
