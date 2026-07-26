import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin, Tag } from 'lucide-react';

export const CalendarWidget: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 24)); // July 24, 2026
  const [selectedDay, setSelectedDay] = useState<number>(24);

  const daysInMonth = 31;
  const startDayOffset = 3; // July 2026 starts on Wednesday

  // Mock events for specific days of July 2026
  const eventsByDay: Record<number, Array<{ title: string; time: string; type: 'lecture' | 'opd' | 'exam' | 'meeting' }>> = {
    24: [
      { title: '1st BHMS Organon Lecture', time: '10:00 AM - 11:00 AM', type: 'lecture' },
      { title: 'General Medicine OPD Duty', time: '11:30 AM - 02:30 PM', type: 'opd' },
      { title: 'HOD Academic Roster Meeting', time: '03:30 PM - 04:30 PM', type: 'meeting' },
    ],
    25: [
      { title: '2nd BHMS Pathology Practical', time: '11:00 AM - 01:00 PM', type: 'lecture' },
      { title: 'Internal Evaluation Viva', time: '02:00 PM - 04:00 PM', type: 'exam' },
    ],
    28: [
      { title: 'AYUSH Research Project Review', time: '02:30 PM - 04:00 PM', type: 'meeting' },
    ],
  };

  const dayEvents = eventsByDay[selectedDay] || [];

  return (
    <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
            Academic Calendar & Duties
          </h4>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
          <span>July 2026</span>
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => setSelectedDay((prev) => Math.max(1, prev - 1))}
              className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedDay((prev) => Math.min(daysInMonth, prev + 1))}
              className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 text-center text-3xs font-black text-slate-400 uppercase tracking-wider">
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>

      {/* Grid of days */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold">
        {Array.from({ length: startDayOffset }).map((_, i) => (
          <div key={`empty-${i}`} className="p-1.5 opacity-0" />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const isSelected = day === selectedDay;
          const hasEvents = !!eventsByDay[day];

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`p-1.5 rounded-xl transition relative flex flex-col items-center justify-center cursor-pointer ${
                isSelected
                  ? 'bg-[#002147] text-white font-black shadow-xs dark:bg-[#00A651]'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
              aria-label={`Select July ${day}`}
            >
              <span>{day}</span>
              {hasEvents && (
                <span
                  className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                    isSelected ? 'bg-emerald-300' : 'bg-emerald-600 dark:bg-emerald-400'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Day Agenda */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-2xs font-extrabold text-slate-500">
          <span>Schedule for July {selectedDay}, 2026</span>
          <span className="text-emerald-600">{dayEvents.length} Event(s)</span>
        </div>

        {dayEvents.length > 0 ? (
          <div className="space-y-2">
            {dayEvents.map((evt, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">
                    {evt.title}
                  </h5>
                  <span className="text-3xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" /> {evt.time}
                  </span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-md text-3xs font-black uppercase shrink-0 ${
                    evt.type === 'lecture'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      : evt.type === 'opd'
                      ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                      : evt.type === 'exam'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                  }`}
                >
                  {evt.type}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-2xs text-slate-400 text-center py-2 italic">
            No scheduled duties for this date.
          </p>
        )}
      </div>
    </div>
  );
};
