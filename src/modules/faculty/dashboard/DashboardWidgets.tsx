import React, { useState } from 'react';
import {
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Send,
  HelpCircle,
  ChevronRight,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardWidgets: React.FC = () => {
  const navigate = useNavigate();
  const [queryInput, setQueryInput] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState(false);

  const studentQueries = [
    {
      id: 1,
      student: 'Ananya Roy (Roll 14 - 1st BHMS)',
      query: 'Clarification regarding §12 Organon vital force disturbance vs pathology.',
      time: '2 hours ago',
      status: 'pending',
    },
    {
      id: 2,
      student: 'Debojyoti Sen (Roll 28 - 2nd BHMS)',
      query: 'Query on Potentisation calculation for Hahnemannian Centesimal scale.',
      time: '5 hours ago',
      status: 'replied',
    },
  ];

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryInput.trim()) return;
    setSubmittedQuery(true);
    setQueryInput('');
    setTimeout(() => setSubmittedQuery(false), 3000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Student Queries & Doubts Portal Widget */}
      <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Student Academic Doubts & Queries
              </h4>
              <p className="text-2xs text-slate-500">Direct subject Q&A and doubt resolution</p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 text-3xs font-black bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 rounded-full">
            1 Unanswered
          </span>
        </div>

        <div className="space-y-3">
          {studentQueries.map((q) => (
            <div
              key={q.id}
              className={`p-3 rounded-xl border transition space-y-1.5 ${
                q.status === 'pending'
                  ? 'bg-amber-50/40 dark:bg-amber-950/10 border-amber-200 dark:border-amber-900/50'
                  : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-3xs font-extrabold text-slate-700 dark:text-slate-300">
                  {q.student}
                </span>
                <span className="text-3xs text-slate-400">{q.time}</span>
              </div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                "{q.query}"
              </p>
              {q.status === 'pending' && (
                <div className="pt-1">
                  <span className="px-2 py-0.5 text-3xs font-black bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 rounded-md">
                    Needs Faculty Answer
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Answer Form */}
        <form onSubmit={handleReplySubmit} className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <label className="text-2xs font-bold text-slate-700 dark:text-slate-300 block">
            Quick Reply to Pending Doubt
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="Type your explanation or reference § section..."
              className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1 cursor-pointer shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Reply</span>
            </button>
          </div>
          {submittedQuery && (
            <p className="text-3xs font-extrabold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Answer sent to student portal successfully!
            </p>
          )}
        </form>
      </div>

      {/* Faculty Quick Navigation & Resource Portal Links */}
      <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Academic & AYUSH Portals
              </h4>
              <p className="text-2xs text-slate-500">External university & council references</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <a
            href="https://www.wbuhs.ac.in"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-between group"
          >
            <div>
              <h5 className="font-extrabold text-xs text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                WBUHS Official Portal
              </h5>
              <p className="text-3xs text-slate-500">Exams & Syllabus Notifications</p>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
          </a>

          <a
            href="https://www.nch.org.in"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-between group"
          >
            <div>
              <h5 className="font-extrabold text-xs text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                National Commission for Homoeopathy
              </h5>
              <p className="text-3xs text-slate-500">NCH Guidelines & Minimum Standards</p>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
          </a>

          <a
            href="https://ccrhindia.nic.in"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-between group"
          >
            <div>
              <h5 className="font-extrabold text-xs text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                CCRH Research Council
              </h5>
              <p className="text-3xs text-slate-500">Research Grants & Clinical Trials</p>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
          </a>

          <button
            onClick={() => navigate('/faculty/department')}
            className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-between group text-left cursor-pointer"
          >
            <div>
              <h5 className="font-extrabold text-xs text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                Department Directory
              </h5>
              <p className="text-3xs text-slate-500">Faculty contacts & HOD desk</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
          </button>
        </div>
      </div>
    </div>
  );
};
