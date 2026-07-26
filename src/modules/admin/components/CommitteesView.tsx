import React, { useState } from 'react';
import { adminHrService } from '../../../services/adminHrService';
import { CommitteeItem, CommitteeMeeting } from '../../../types/adminHr';
import { Modal } from '../../../components/common/Modal';
import { Users, Plus, Calendar, FileText, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export const CommitteesView: React.FC = () => {
  const [committees, setCommittees] = useState<CommitteeItem[]>(adminHrService.getCommittees());
  const [meetings, setMeetings] = useState<CommitteeMeeting[]>(adminHrService.getCommitteeMeetings());

  const [selectedCommittee, setSelectedCommittee] = useState<CommitteeItem | null>(committees[0] || null);

  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [meetingFormData, setMeetingFormData] = useState({
    title: 'Quarterly Academic Review',
    committeeId: committees[0]?.id || '',
    meetingDate: '2026-08-10',
    startTime: '02:00 PM',
    endTime: '04:00 PM',
    venue: 'Conference Hall A',
    agenda: 'Review of BHMS syllabus progress, clinical rotas & internship postings.',
  });

  const handleScheduleMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    const comm = committees.find((c) => c.id === meetingFormData.committeeId) || committees[0];

    adminHrService.addCommitteeMeeting({
      title: meetingFormData.title,
      committeeId: comm.id,
      committeeName: comm.name,
      meetingDate: meetingFormData.meetingDate,
      startTime: meetingFormData.startTime,
      endTime: meetingFormData.endTime,
      venue: meetingFormData.venue,
      agenda: meetingFormData.agenda,
      status: 'SCHEDULED',
    });

    toast.success('Committee meeting scheduled and members notified!');
    setMeetings(adminHrService.getCommitteeMeetings());
    setIsMeetingModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <span>Institutional Committees & Statutory Boards ({committees.length})</span>
          </h2>
          <p className="text-xs text-slate-500">
            Academic Council, Anti-Ragging Cell, IQAC Quality Committee & Hospital Board meetings
          </p>
        </div>

        <button
          onClick={() => setIsMeetingModalOpen(true)}
          className="px-4 py-2.5 bg-[#002147] hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Committee Meeting</span>
        </button>
      </div>

      {/* Grid of Committees */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {committees.map((comm) => (
          <div
            key={comm.id}
            onClick={() => setSelectedCommittee(comm)}
            className={`p-5 rounded-2xl border shadow-xs cursor-pointer transition space-y-3 ${
              selectedCommittee?.id === comm.id
                ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex justify-between items-start">
              <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-100 dark:bg-indigo-950 px-2.5 py-0.5 rounded-lg">
                {comm.code}
              </span>
              <span className="text-[10px] font-extrabold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">
                {comm.memberCount} Members
              </span>
            </div>

            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-base">{comm.name}</h3>
              <p className="text-xs text-slate-500 line-clamp-2 mt-1">{comm.purpose}</p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 font-semibold">
              <p>Chairperson: {comm.chairperson}</p>
              <p className="text-[11px] text-slate-500">Convener: {comm.convener}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Committee Meetings History */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-600" />
          <span>Scheduled Meetings & Minutes of Meeting (MoM) ({meetings.length})</span>
        </h3>

        <div className="space-y-3 text-xs">
          {meetings.map((m) => (
            <div key={m.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-blue-600">{m.committeeName}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                  m.status === 'COMPLETED'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {m.status}
                </span>
              </div>

              <h4 className="font-black text-slate-900 dark:text-white text-sm">{m.title}</h4>
              <p className="text-slate-600 dark:text-slate-300">
                <strong>Date & Venue:</strong> {m.meetingDate} ({m.startTime} - {m.endTime}) • {m.venue}
              </p>
              <p className="text-slate-500 italic">Agenda: "{m.agenda}"</p>

              {m.minutesOfMeeting && (
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800">
                  <p className="font-bold">Minutes of Meeting (MoM):</p>
                  <p className="text-[11px] mt-0.5">{m.minutesOfMeeting}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Meeting Modal */}
      <Modal isOpen={isMeetingModalOpen} onClose={() => setIsMeetingModalOpen(false)} title="Schedule Committee Meeting">
        <form onSubmit={handleScheduleMeeting} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Committee</label>
            <select
              value={meetingFormData.committeeId}
              onChange={(e) => setMeetingFormData({ ...meetingFormData, committeeId: e.target.value })}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
            >
              {committees.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Meeting Title *</label>
            <input
              type="text"
              required
              value={meetingFormData.title}
              onChange={(e) => setMeetingFormData({ ...meetingFormData, title: e.target.value })}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Meeting Date</label>
              <input
                type="date"
                value={meetingFormData.meetingDate}
                onChange={(e) => setMeetingFormData({ ...meetingFormData, meetingDate: e.target.value })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Venue</label>
              <input
                type="text"
                value={meetingFormData.venue}
                onChange={(e) => setMeetingFormData({ ...meetingFormData, venue: e.target.value })}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Agenda</label>
            <textarea
              rows={2}
              value={meetingFormData.agenda}
              onChange={(e) => setMeetingFormData({ ...meetingFormData, agenda: e.target.value })}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setIsMeetingModalOpen(false)}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-800 font-bold rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#002147] text-white font-bold rounded-xl shadow-xs cursor-pointer"
            >
              Schedule Meeting
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
