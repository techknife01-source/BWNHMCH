import React, { useState } from 'react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Card } from '../../components/common/Card';
import { Calendar as CalendarIcon, MapPin, Clock, UserCheck, Sparkles, CheckCircle2, ChevronRight, X } from 'lucide-react';

interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  category: string;
  speaker: string;
  description: string;
  status: 'UPCOMING' | 'COMPLETED';
}

export const EventsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'COMPLETED'>('UPCOMING');
  const [registerEvent, setRegisterEvent] = useState<EventItem | null>(null);
  const [delegateName, setDelegateName] = useState('');
  const [delegateEmail, setDelegateEmail] = useState('');
  const [delegateCategory, setDelegateCategory] = useState('BHMS Student');
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  const events: EventItem[] = [
    {
      id: 'e1',
      title: 'WBUHS State Scientific Seminar on Homoeopathic Rheumatology 2026',
      date: '15 August 2026',
      time: '09:30 AM - 04:30 PM',
      location: 'Central AC Auditorium, BHMC&H Campus',
      organizer: 'Department of Practice of Medicine & WBUHS Academic Cell',
      category: 'Scientific Conference',
      speaker: 'Prof. (Dr.) S. N. Bhattacharya & National Keynote Speakers',
      description: 'Specialized technical sessions on auto-immune arthritic management, constitutional prescribing, and potencies in chronic joint diseases.',
      status: 'UPCOMING'
    },
    {
      id: 'e2',
      title: 'Hahnemannian Birthday Memorial Oration & Poster Competition',
      date: '10 April 2026',
      time: '10:00 AM - 02:00 PM',
      location: 'College Central Auditorium',
      organizer: 'Department of Organon of Medicine',
      category: 'Annual Commemoration',
      speaker: 'Prof. (Dr.) Susmita Chatterjee, Principal',
      description: 'Annual memorial lecture followed by student poster presentation on Organon aphorisms and clinical case exhibitions.',
      status: 'COMPLETED'
    },
    {
      id: 'e3',
      title: 'Workshop on Computer-Assisted Repertorization (RADAR Opus)',
      date: '28 August 2026',
      time: '11:00 AM - 03:00 PM',
      location: 'Digital Library Computer Lab',
      organizer: 'Department of Repertory',
      category: 'Hands-on Workshop',
      speaker: 'Dr. M. Ghosh, M.D. (Hom.)',
      description: 'Practical training for PG scholars and final year interns on synthesis repertory software, case elimination, and rubric selection.',
      status: 'UPCOMING'
    },
    {
      id: 'e4',
      title: 'Free Mega Rural Health Camp & Blood Donation Drive',
      date: '02 July 2026',
      time: '09:00 AM - 03:00 PM',
      location: 'Memari Community Health Center, Purba Bardhaman',
      organizer: 'NSS Cell & Department of Community Medicine',
      category: 'Community Outreach',
      speaker: 'Dr. B. Biswas, M.D.',
      description: 'Free consultations, medicine distribution, blood pressure & hemoglobin screening for 650 rural villagers.',
      status: 'COMPLETED'
    }
  ];

  const filteredEvents = events.filter((e) => e.status === activeTab);

  const handleRsvp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!delegateName || !delegateEmail) return;
    setRsvpSuccess(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      <Breadcrumb items={[{ label: 'Academic Events' }]} />

      {/* Header Banner */}
      <div className="rounded-3xl bg-[#002147] text-white p-8 sm:p-12 shadow-xl space-y-4">
        <span className="px-3.5 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-black rounded-full uppercase tracking-wider border border-emerald-500/30">
          Academic Symposia & Conferences
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Scientific Seminars & Event Calendar
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
          Participate in academic conferences, guest lectures by international Homoeopathic experts, clinical workshops, and community health drives organized by our departments.
        </p>

        {/* Tab Buttons */}
        <div className="pt-4 flex items-center space-x-3">
          <button
            onClick={() => setActiveTab('UPCOMING')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'UPCOMING' ? 'bg-[#00A651] text-white shadow-md' : 'bg-white/10 text-slate-200 hover:bg-white/20'
            }`}
          >
            Upcoming Events
          </button>
          <button
            onClick={() => setActiveTab('COMPLETED')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'COMPLETED' ? 'bg-[#00A651] text-white shadow-md' : 'bg-white/10 text-slate-200 hover:bg-white/20'
            }`}
          >
            Past Events Archive
          </button>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredEvents.map((evt) => (
          <Card key={evt.id} className="p-8 space-y-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                  {evt.category}
                </span>
                <span className="text-2xs font-bold text-slate-400">{evt.organizer}</span>
              </div>

              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white leading-snug">
                {evt.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {evt.description}
              </p>

              <div className="space-y-2 pt-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span><strong>Date:</strong> {evt.date} • {evt.time}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                  <span><strong>Venue:</strong> {evt.location}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <UserCheck className="w-4 h-4 text-purple-500 shrink-0" />
                  <span><strong>Keynote Speaker:</strong> {evt.speaker}</span>
                </div>
              </div>
            </div>

            {evt.status === 'UPCOMING' ? (
              <button
                onClick={() => { setRegisterEvent(evt); setRsvpSuccess(false); }}
                className="w-full py-3 bg-[#002147] hover:bg-[#001530] text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
              >
                Register as Delegate / RSVP
              </button>
            ) : (
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 text-center text-xs font-bold text-slate-400">
                Event Concluded • View Report in News
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Delegate Registration Modal */}
      {registerEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-8 space-y-6 relative">
            <button
              onClick={() => setRegisterEvent(null)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl bg-slate-100 dark:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            {rsvpSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Delegate Pass Generated!</h3>
                <p className="text-xs text-slate-500">
                  Delegate Pass ID: <span className="font-mono font-bold text-[#002147] dark:text-[#00A651]">#EVENT-2026-9921</span>
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Confirmation email with QR attendance code has been sent to <strong>{delegateEmail}</strong>.
                </p>
                <button
                  onClick={() => setRegisterEvent(null)}
                  className="w-full mt-2 py-2.5 bg-[#002147] text-white text-xs font-bold rounded-xl"
                >
                  Close Confirmation
                </button>
              </div>
            ) : (
              <form onSubmit={handleRsvp} className="space-y-4">
                <div className="space-y-1">
                  <span className="text-2xs font-black uppercase text-emerald-600">Event Registration</span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">{registerEvent.title}</h3>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Delegate Name *</label>
                  <input
                    type="text"
                    required
                    value={delegateName}
                    onChange={(e) => setDelegateName(e.target.value)}
                    placeholder="e.g. Dr. Sourav Ghosh"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={delegateEmail}
                    onChange={(e) => setDelegateEmail(e.target.value)}
                    placeholder="sourav@example.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Delegate Category</label>
                  <select
                    value={delegateCategory}
                    onChange={(e) => setDelegateCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none"
                  >
                    <option value="BHMS Student">BHMS Student / Intern</option>
                    <option value="PG Scholar">Postgraduate Scholar (M.D. Hom.)</option>
                    <option value="Faculty / Doctor">Faculty / Homoeopathic Medical Officer</option>
                    <option value="Guest Delegate">External Medical Delegate</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#00A651] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
                >
                  Confirm Delegate Registration
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
