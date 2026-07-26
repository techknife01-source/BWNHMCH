import React from 'react';
import { TeachingExperience, ResearchExperience } from '../../types/profile.types';
import { Briefcase, FlaskConical, ExternalLink, Calendar, Building2, Award } from 'lucide-react';

interface ExperienceSectionProps {
  teachingExperience: TeachingExperience[];
  researchExperience: ResearchExperience[];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  teachingExperience,
  researchExperience,
}) => {
  return (
    <div className="space-y-6">
      {/* Teaching Experience Timeline */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <Briefcase className="w-5 h-5 text-emerald-600" />
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            Teaching & Academic Experience
          </h3>
        </div>

        <div className="relative border-l-2 border-emerald-500/30 dark:border-emerald-500/20 ml-4 space-y-6 pl-6">
          {teachingExperience.map((exp) => (
            <div key={exp.id} className="relative group">
              {/* Point Dot */}
              <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white dark:border-slate-900 group-hover:scale-125 transition" />

              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4 className="font-black text-xs text-slate-900 dark:text-white">
                    {exp.designation} — {exp.department}
                  </h4>
                  <span className="text-3xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 w-fit">
                    {exp.startDate} – {exp.endDate}
                  </span>
                </div>

                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" /> {exp.institution}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {exp.subjectsTaught.map((sub) => (
                    <span
                      key={sub}
                      className="px-2 py-0.5 bg-white dark:bg-slate-700 rounded-lg text-[10px] font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Research Experience & Publications */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <FlaskConical className="w-5 h-5 text-purple-600" />
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            Research Projects & Published Papers
          </h3>
        </div>

        <div className="space-y-4">
          {researchExperience.map((res) => (
            <div
              key={res.id}
              className="p-5 rounded-3xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/40 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-3xs font-extrabold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800 w-fit">
                  {res.role} • {res.status} ({res.year})
                </span>
                {res.grantAmount && (
                  <span className="text-xs font-black text-purple-900 dark:text-purple-200">
                    Grant: {res.grantAmount}
                  </span>
                )}
              </div>

              <h4 className="font-extrabold text-xs text-slate-900 dark:text-white leading-snug">
                {res.title}
              </h4>

              {res.fundingAgency && (
                <p className="text-3xs text-slate-500 font-semibold">
                  Funding Body: {res.fundingAgency}
                </p>
              )}

              {res.doiOrLink && (
                <a
                  href={res.doiOrLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-2xs font-extrabold text-purple-700 dark:text-purple-300 hover:underline pt-1"
                >
                  <span>DOI / Journal Link ({res.journalOrConference})</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
