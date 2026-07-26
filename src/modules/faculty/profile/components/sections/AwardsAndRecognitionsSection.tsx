import React from 'react';
import { AwardRecognition } from '../../types/profile.types';
import { Award, Trophy, Medal, Star } from 'lucide-react';

interface AwardsSectionProps {
  awards: AwardRecognition[];
}

export const AwardsAndRecognitionsSection: React.FC<AwardsSectionProps> = ({ awards }) => {
  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
      <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
        <Award className="w-5 h-5 text-amber-500" />
        <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
          Awards, Honors & University Recognitions
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {awards.map((aw) => (
          <div
            key={aw.id}
            className="p-5 rounded-3xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-2 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-3xs font-extrabold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                {aw.category} Award • {aw.year}
              </span>
              <Trophy className="w-5 h-5 text-amber-500" />
            </div>

            <h4 className="font-black text-xs text-slate-900 dark:text-white pt-1">
              {aw.title}
            </h4>

            <p className="text-2xs font-bold text-amber-900 dark:text-amber-300">
              Conferred By: {aw.awardingBody}
            </p>

            {aw.description && (
              <p className="text-3xs text-slate-500 leading-relaxed pt-1">
                {aw.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
