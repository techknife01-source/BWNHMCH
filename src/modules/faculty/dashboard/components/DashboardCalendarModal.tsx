import React, { useState } from 'react';
import { Calendar as CalendarIcon, X, ChevronLeft, ChevronRight, Clock, MapPin, Tag, Plus, Filter, GraduationCap, Building2, Stethoscope, FlaskConical, FileText, Award } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  type: 'Class' | 'Meeting' | 'Research' | 'Assignment' | 'Exam' | 'Hospital' | 'Department';
  date: string; // YYYY-MM-DD
  dayNum: number;
  time: string;
  location: string;
  description: string;
}

const MOCK_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'e1',
    title: '1st BHMS Organon Lecture & Philosophy',
    type: 'Class',
    date: '2026-07-24',
    dayNum: 24,
    time: '10:00 AM - 11:00 AM',
    location: 'Lecture Hall 2',
    description: 'Aphorisms 1-10 discussion on Vital Force concept.',
  },
  {
    id: 'e2',
    title: 'General Medicine OPD Clinical Duty',
    type: 'Hospital',
    date: '2026-07-24',
    dayNum: 24,
    time: '11:30 AM - 02:30 PM',
    location: 'OPD Building Room 4',
    description: 'Patient consultations & prescribing homeopathic potencies.',
  },
  {
    id: 'e3',
    title: 'HOD Academic & Exam Committee Meeting',
    type: 'Meeting',
    date: '2026-07-24',
    dayNum: 24,
    time: '03:30 PM - 04:30 PM',
    location: 'Conference Room B',
    description: 'Finalizing 2nd BHMS Pathology internal assessment schedule.',
  },
  {
    id: 'e4',
    title: '2nd BHMS Pathology Practical Lab',
    type: 'Class',
    date: '2026-07-25',
    dayNum: 25,
    time: '11:00 AM - 01:00 PM',
    location: 'Pathology Lab Block A',
    description: 'Microscopic slide analysis of inflammatory changes.',
  },
  {
    id: 'e5',
    title: 'Internal Assessment Evaluation Viva',
    type: 'Exam',
    date: '2026-07-25',
    dayNum: 25,
    time: '02:00 PM - 04:00 PM',
    location: 'Viva Examination Hall 1',
    description: 'Oral evaluation of student case records.',
  },
  {
    id: 'e6',
    title: 'Chronic Case Taking Assignment Deadline',
    type: 'Assignment',
    date: '2026-07-28',
    dayNum: 28,
    time: '05:00 PM Deadline',
    location: 'Faculty Portal Upload',
    description: 'Student submission cut-off for Logbook 4.',
  },
  {
    id: 'e7',
    title: 'AYUSH Allergic Rhinitis Project Progress Review',
    type: 'Research',
    date: '2026-07-28',
    dayNum: 28,
    time: '02:30 PM - 04:00 PM',
    location: 'Research Wing Room 102',
    description: 'CCRH quarterly review & data sheet audit.',
  },
  {
    id: 'e8',
    title: 'Departmental Academic Seminar on Miasms',
    type: 'Department',
    date: '2026-07-30',
    dayNum: 30,
    time: '02:00 PM - 04:00 PM',
    location: 'Auditorium Hall',
    description: 'Special presentation on Psora vs Sycosis in Chronic Diseases.',
  },
];

interface DashboardCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DashboardCalendarModal: React.FC<DashboardCalendarModalProps> = ({ isOpen, onClose }) => {
  const [viewMode, setViewMode] = useState<'Month' | 'Week' | 'Day'>('Month');
  const [selectedDay, setSelectedDay] = useState<number>(24);
  const [selectedType, setSelectedType] = useState<string>('All');

  if (!isOpen) return null;

  const daysInMonth = 31;
  const startDayOffset = 3; // Wednesday start

  const filteredEvents = MOCK_CALENDAR_EVENTS.filter((e) => {
    if (selectedType !== 'All' && e.type !== selectedType) return false;
    if (viewMode === 'Day' && e.dayNum !== selectedDay) return false;
    return true;
  });

  const selectedDayEvents = MOCK_CALENDAR_EVENTS.filter((e) => e.dayNum === selectedDay);

  const getEventBadgeClass = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'Class': return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
      case 'Hospital': return 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300';
      case 'Meeting': return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300';
      case 'Exam': return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
      case 'Assignment': return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
      case 'Research': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
      case 'Department': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/50 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Faculty Academic & Duty Calendar
              </h3>
              <p className="text-2xs text-slate-500">
                July 2026 • Classes, Meetings, Exams, OPD Roster & Deadlines
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switchers */}
            <div className="p-1 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center gap-1">
              {(['Month', 'Week', 'Day'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1 rounded-lg text-2xs font-extrabold transition cursor-pointer ${
                    viewMode === mode
                      ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-3xs font-black uppercase text-slate-400 flex items-center gap-1 shrink-0">
              <Filter className="w-3 h-3" /> Filter:
            </span>
            {['All', 'Class', 'Meeting', 'Hospital', 'Exam', 'Assignment', 'Research', 'Department'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-2.5 py-1 text-3xs font-black rounded-lg uppercase tracking-wider shrink-0 cursor-pointer ${
                  selectedType === type
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>July 2026</span>
            <button
              onClick={() => setSelectedDay((prev) => Math.max(1, prev - 1))}
              className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedDay((prev) => Math.min(daysInMonth, prev + 1))}
              className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Main Content */}
        <div className="p-5 flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Grid View (2 cols on large screens) */}
          <div className="lg:col-span-2 space-y-4">
            {viewMode === 'Month' && (
              <div>
                {/* Days header */}
                <div className="grid grid-cols-7 text-center text-3xs font-black text-slate-400 uppercase tracking-wider mb-2">
                  <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold">
                  {Array.from({ length: startDayOffset }).map((_, i) => (
                    <div key={`empty-${i}`} className="p-3 opacity-0" />
                  ))}

                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const isSelected = day === selectedDay;
                    const dayEventsList = MOCK_CALENDAR_EVENTS.filter((e) => e.dayNum === day);

                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`p-2 sm:p-3 rounded-2xl transition relative flex flex-col items-center justify-between min-h-12 cursor-pointer ${
                          isSelected
                            ? 'bg-[#002147] text-white font-black shadow-md dark:bg-[#00A651]'
                            : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                        }`}
                      >
                        <span className="text-xs">{day}</span>
                        {dayEventsList.length > 0 && (
                          <div className="flex items-center gap-0.5 mt-1">
                            {dayEventsList.slice(0, 3).map((e, idx) => (
                              <span
                                key={idx}
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isSelected ? 'bg-emerald-300' : 'bg-emerald-600 dark:bg-emerald-400'
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {viewMode === 'Week' && (
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
                <h4 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                  July 2026 • Week 4 Overview (July 20 - July 26)
                </h4>
                <div className="space-y-2">
                  {[20, 21, 22, 23, 24, 25, 26].map((dayNum) => {
                    const evts = MOCK_CALENDAR_EVENTS.filter((e) => e.dayNum === dayNum);
                    return (
                      <div
                        key={dayNum}
                        onClick={() => setSelectedDay(dayNum)}
                        className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                          selectedDay === dayNum
                            ? 'bg-emerald-50/80 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <div>
                          <span className="font-black text-xs text-slate-900 dark:text-white">
                            July {dayNum}, 2026
                          </span>
                          <p className="text-3xs text-slate-500">
                            {evts.length} Scheduled Item(s)
                          </p>
                        </div>
                        <span className="text-2xs font-extrabold text-emerald-600">
                          {evts.map((e) => e.title).join(' • ') || 'No duties'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {viewMode === 'Day' && (
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
                <h4 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                  Detailed Day Schedule • July {selectedDay}, 2026
                </h4>
                {selectedDayEvents.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDayEvents.map((evt) => (
                      <div
                        key={evt.id}
                        className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className={`px-2.5 py-0.5 rounded-full text-3xs font-black uppercase ${getEventBadgeClass(evt.type)}`}>
                            {evt.type}
                          </span>
                          <span className="text-3xs font-bold text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {evt.time}
                          </span>
                        </div>
                        <h5 className="font-extrabold text-xs text-slate-900 dark:text-white">
                          {evt.title}
                        </h5>
                        <p className="text-3xs text-slate-500 dark:text-slate-400">
                          {evt.description}
                        </p>
                        <span className="text-3xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {evt.location}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 py-6 text-center italic">
                    No academic or OPD events scheduled for July {selectedDay}.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Side Widget: Agenda for Selected Day */}
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                  Selected Day Agenda
                </h4>
                <span className="text-2xs font-extrabold text-emerald-600">
                  July {selectedDay}, 2026
                </span>
              </div>

              {selectedDayEvents.length > 0 ? (
                <div className="space-y-2">
                  {selectedDayEvents.map((e) => (
                    <div
                      key={e.id}
                      className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1"
                    >
                      <span className={`px-2 py-0.5 rounded-md text-3xs font-black uppercase ${getEventBadgeClass(e.type)}`}>
                        {e.type}
                      </span>
                      <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                        {e.title}
                      </h5>
                      <span className="text-3xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {e.time}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 py-4 text-center italic">
                  No events on July {selectedDay}. Select another date on the calendar.
                </p>
              )}
            </div>

            {/* Upcoming Deadlines Widget */}
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
              <h4 className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center justify-between">
                <span>Upcoming Key Deadlines</span>
                <span className="text-3xs font-bold text-emerald-600">Next 7 Days</span>
              </h4>

              <div className="space-y-2">
                {MOCK_CALENDAR_EVENTS.slice(3, 7).map((evt) => (
                  <div
                    key={evt.id}
                    className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">
                        {evt.title}
                      </h5>
                      <span className="text-3xs text-slate-400">
                        July {evt.dayNum} • {evt.time}
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-md text-3xs font-black uppercase shrink-0 ${getEventBadgeClass(evt.type)}`}>
                      {evt.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>
            Calendar Mode: <strong className="text-slate-800 dark:text-slate-200">{viewMode} View</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl font-bold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 transition cursor-pointer"
          >
            Close Calendar
          </button>
        </div>
      </div>
    </div>
  );
};
