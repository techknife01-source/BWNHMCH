import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Phone, Mail, MapPin, ShieldCheck, Heart, ExternalLink, Globe } from 'lucide-react';
import { APP_CONSTANTS } from '../../constants/app.constants';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-[#001530] text-slate-300 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
          {/* Brand & Mission */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00A651] text-white font-extrabold text-sm shadow-md">
                BH
              </div>
              <div>
                <span className="font-extrabold text-white text-sm block leading-tight">{APP_CONSTANTS.INSTITUTION_NAME}</span>
                <span className="text-[10px] text-emerald-400 font-bold uppercase">50-Bed Attached Teaching Hospital & College</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed pr-4">
              Premier Homoeopathic Medical Education & Clinical Excellence institution dedicated to holistic healthcare, research, and academic rigor since {APP_CONSTANTS.ESTD_YEAR}. Approved by NCH, Ministry of AYUSH, Govt of India & Affiliated to WBUHS.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-emerald-400 font-semibold">
              <span className="flex items-center gap-1"><ShieldCheck className="h-4 w-4" /> NCH Approved</span>
              <span className="flex items-center gap-1"><Globe className="h-4 w-4" /> WBUHS Code: 104</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Academic Links</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/about" className="hover:text-emerald-400 transition-colors">About Institution</Link></li>
              <li><Link to="/principal-desk" className="hover:text-emerald-400 transition-colors">Principal Desk</Link></li>
              <li><Link to="/departments" className="hover:text-emerald-400 transition-colors">Academic Departments</Link></li>
              <li><Link to="/courses" className="hover:text-emerald-400 transition-colors">BHMS & MD Courses</Link></li>
              <li><Link to="/admission" className="hover:text-emerald-400 transition-colors">Admission & NEET AYUSH</Link></li>
              <li><Link to="/library" className="hover:text-emerald-400 transition-colors">Digital Library</Link></li>
            </ul>
          </div>

          {/* Hospital & Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Hospital Care</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/hospital" className="hover:text-emerald-400 transition-colors">Homoeopathic Hospital OPD</Link></li>
              <li><Link to="/doctors" className="hover:text-emerald-400 transition-colors">Medical Consultants</Link></li>
              <li><Link to="/notice" className="hover:text-emerald-400 transition-colors">College Notices & Circulars</Link></li>
              <li><Link to="/events" className="hover:text-emerald-400 transition-colors">Events & Seminars</Link></li>
              <li><Link to="/downloads" className="hover:text-emerald-400 transition-colors">Syllabi & Prospectus</Link></li>
              <li><Link to="/gallery" className="hover:text-emerald-400 transition-colors">Campus Gallery</Link></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Campus Contact</h4>
            <div className="flex items-start space-x-2.5 text-xs text-slate-400">
              <MapPin className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
              <span>{APP_CONSTANTS.LOCATION}</span>
            </div>
            <div className="flex items-center space-x-2.5 text-xs text-slate-400">
              <Phone className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{APP_CONSTANTS.CONTACT_PHONE}</span>
            </div>
            <div className="flex items-center space-x-2.5 text-xs text-slate-400">
              <Mail className="h-4 w-4 text-amber-400 shrink-0" />
              <span>{APP_CONSTANTS.CONTACT_EMAIL}</span>
            </div>
          </div>
        </div>

        {/* Bottom Rights Bar */}
        <div className="mt-12 border-t border-slate-800/80 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {APP_CONSTANTS.INSTITUTION_NAME}. All Rights Reserved.</p>
          <div className="mt-2 md:mt-0 flex items-center space-x-4">
            <Link to="/contact" className="hover:text-slate-300">Privacy Policy</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-slate-300">Terms of Use</Link>
            <span>•</span>
            <span className="flex items-center text-slate-400">
              Powered by HomoeoERP CMS
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
