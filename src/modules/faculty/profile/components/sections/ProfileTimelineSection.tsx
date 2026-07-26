import React from 'react';
import { TimelineEvent } from '../../types/profile.types';
import { History, Award, GraduationCap, FlaskConical, Stethoscope, ChevronRight } from 'lucide-react';

interface ProfileTimelineProps {
  timeline: TimelineEvent[];
}

export const ProfileTimelineSection: React.FC<ProfileTimelineProps> = ({ timeline }) => {
  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
      <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
        <History className="w-5 h-5 text-emerald-600" />
        <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
          Faculty Milestone Activity Stream
        </h3>
      </div>

      <div className="relative border-l-2 border-emerald-500/30 dark:border-emerald-500/20 ml-4 space-y-6 pl-6">
        {timeline.map((event) => (
          <div key={event.id} className="relative group">
            {/* Dot */}
            <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white dark:border-slate-900 group-hover:scale-125 transition" />

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="px-2.5 py-0.5 rounded-full text-3xs font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 w-fit">
                  {event.category}
                </span>
                <span className="text-3xs font-extrabold text-slate-400">
                  {event.date}
                </span>
              </div>

              <h4 className="font-black text-xs text-slate-900 dark:text-white pt-0.5">
                {event.title}
              </h4>

              <p className="text-2xs text-slate-500 font-medium">
                {event.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
