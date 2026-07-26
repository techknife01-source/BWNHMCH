import React, { useState, useEffect } from 'react';
import { FacultyLayout } from '../layout/FacultyLayout';
import {
  FileText,
  Plus,
  CheckCircle2,
  Clock,
  UserCheck,
  FileCheck,
  Upload,
  Sparkles,
  MessageSquare,
  Award,
  AlertCircle,
  X,
} from 'lucide-react';
import { facultyErpService } from '../services/facultyErp.service';
import { FacultyAssignment, StudentSubmission, FacultySubject } from '../types';

export const AssignmentsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'LIST' | 'CREATE' | 'EVALUATE'>('LIST');
  const [assignments, setAssignments] = useState<FacultyAssignment[]>([]);
  const [subjects, setSubjects] = useState<FacultySubject[]>([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>('ASG-101');
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);

  // Create Assignment Form State
  const [newTitle, setNewTitle] = useState<string>('');
  const [newSubjectId, setNewSubjectId] = useState<string>('SUB-101');
  const [newBatch, setNewBatch] = useState<string>('1st Year BHMS (Batch A)');
  const [newDueDate, setNewDueDate] = useState<string>('');
  const [newMaxMarks, setNewMaxMarks] = useState<number>(20);
  const [newDescription, setNewDescription] = useState<string>('');

  // Evaluation Form State
  const [evalMarks, setEvalMarks] = useState<{ [subId: string]: number }>({});
  const [evalFeedback, setEvalFeedback] = useState<{ [subId: string]: string }>({});

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedAssignmentId) {
      loadSubmissions(selectedAssignmentId);
    }
  }, [selectedAssignmentId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [asgs, subs] = await Promise.all([
        facultyErpService.getAssignments(),
        facultyErpService.getSubjects(),
      ]);
      setAssignments(asgs);
      setSubjects(subs);
      if (asgs.length > 0) {
        setSelectedAssignmentId(asgs[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSubmissions = async (asgId: string) => {
    const subs = await facultyErpService.getStudentSubmissions(asgId);
    setSubmissions(subs);
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDueDate || !newDescription) {
      alert('Please complete all required fields.');
      return;
    }

    const currentSub = subjects.find((s) => s.id === newSubjectId);

    const updatedAsgs = await facultyErpService.createAssignment({
      title: newTitle,
      subjectId: newSubjectId,
      subjectName: currentSub?.name || 'Organon of Medicine',
      batch: newBatch,
      assignedDate: new Date().toISOString().split('T')[0],
      dueDate: newDueDate,
      maxMarks: Number(newMaxMarks),
      description: newDescription,
      status: 'ACTIVE',
    });

    setAssignments(updatedAsgs);
    setToastMessage('Assignment created and published to student portal successfully!');
    setActiveTab('LIST');
    setNewTitle('');
    setNewDescription('');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleGradeSubmission = async (subId: string) => {
    const marks = evalMarks[subId] || 15;
    const feedback = evalFeedback[subId] || 'Good work!';

    const updated = await facultyErpService.gradeSubmission(subId, marks, feedback);
    setSubmissions(updated);
    setToastMessage('Student submission evaluated and grade saved.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const currentAssignment = assignments.find((a) => a.id === selectedAssignmentId);

  return (
    <FacultyLayout pageTitle="Assignments & Evaluation">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              Academic & Clinical Assignment Management
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Create homework assignments, clinical case study tasks, and grade student submissions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('LIST')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'LIST'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              All Assignments
            </button>
            <button
              onClick={() => setActiveTab('CREATE')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'CREATE'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              Create Assignment
            </button>
            <button
              onClick={() => setActiveTab('EVALUATE')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'EVALUATE'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              Evaluate Submissions
            </button>
          </div>
        </div>

        {toastMessage && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-xs font-bold animate-fadeIn">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* TAB 1: LIST */}
        {activeTab === 'LIST' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full text-center py-12 text-slate-400">
                Loading assignments...
              </div>
            ) : (
              assignments.map((asg) => (
                <div
                  key={asg.id}
                  className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xs space-y-4 hover:border-emerald-500/50 transition flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-3xs font-extrabold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {asg.status}
                      </span>
                      <span className="text-3xs font-bold text-slate-400">
                        Max Marks: {asg.maxMarks}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">
                        {asg.title}
                      </h3>
                      <p className="text-3xs font-bold text-emerald-600 mt-1">
                        {asg.subjectName} • {asg.batch}
                      </p>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {asg.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-3xs text-slate-400 font-semibold">
                      <span>Due Date: {asg.dueDate}</span>
                      <span>
                        Submissions: {asg.totalSubmissions} ({asg.totalEvaluated} Graded)
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedAssignmentId(asg.id);
                        setActiveTab('EVALUATE');
                      }}
                      className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition text-center cursor-pointer"
                    >
                      View & Grade Submissions →
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: CREATE */}
        {activeTab === 'CREATE' && (
          <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Create New Academic / Clinical Assignment
              </h3>
              <p className="text-xs text-slate-500">
                Post new task instructions, attach supplementary reference files, and set submission deadlines.
              </p>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <label className="block text-3xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                  Assignment Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Critical Analysis of Aphorism 9 or Repertory Case Totality"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-3xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                    Subject *
                  </label>
                  <select
                    value={newSubjectId}
                    onChange={(e) => setNewSubjectId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.code} - {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-3xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                    BHMS Batch *
                  </label>
                  <select
                    value={newBatch}
                    onChange={(e) => setNewBatch(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="1st Year BHMS (Batch A)">1st Year BHMS (Batch A)</option>
                    <option value="2nd Year BHMS">2nd Year BHMS</option>
                    <option value="3rd Year BHMS">3rd Year BHMS</option>
                    <option value="4th Year BHMS">4th Year BHMS</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-3xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-3xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                    Maximum Marks *
                  </label>
                  <input
                    type="number"
                    required
                    value={newMaxMarks}
                    onChange={(e) => setNewMaxMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-3xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                  Detailed Instructions *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide detailed submission requirements, word limit, required references..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('LIST')}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer shadow-sm hover:bg-emerald-700 transition"
                >
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: EVALUATE */}
        {activeTab === 'EVALUATE' && (
          <div className="space-y-6">
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl flex flex-wrap items-center justify-between gap-4">
              <div>
                <label className="block text-3xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                  Select Assignment to Grade
                </label>
                <select
                  value={selectedAssignmentId}
                  onChange={(e) => setSelectedAssignmentId(e.target.value)}
                  className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 min-w-[280px]"
                >
                  {assignments.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.title} ({a.batch})
                    </option>
                  ))}
                </select>
              </div>

              {currentAssignment && (
                <div className="text-right">
                  <span className="text-3xs font-bold uppercase text-slate-400 block">
                    Max Score: {currentAssignment.maxMarks} Marks
                  </span>
                  <span className="text-xs font-extrabold text-emerald-600">
                    Due: {currentAssignment.dueDate}
                  </span>
                </div>
              )}
            </div>

            {/* Submissions Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 font-extrabold text-xs text-slate-800 dark:text-slate-200">
                Student Submissions ({submissions.length})
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {submissions.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    No submissions received for this assignment yet.
                  </div>
                ) : (
                  submissions.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition"
                    >
                      <div className="space-y-1 max-w-md">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                            {sub.studentName}
                          </span>
                          <span className="text-3xs font-mono font-bold text-slate-400">
                            ({sub.rollNo})
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-3xs font-black uppercase ${
                              sub.status === 'EVALUATED'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            }`}
                          >
                            {sub.status}
                          </span>
                        </div>
                        <p className="text-3xs text-slate-500">
                          Submitted on {sub.submissionDate} • File:{' '}
                          <span className="font-bold text-emerald-600">{sub.fileName}</span>
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <div>
                          <label className="block text-3xs font-extrabold uppercase text-slate-400 mb-0.5">
                            Marks (out of {currentAssignment?.maxMarks || 20})
                          </label>
                          <input
                            type="number"
                            placeholder="Marks"
                            defaultValue={sub.marksObtained ?? ''}
                            onChange={(e) =>
                              setEvalMarks((prev) => ({
                                ...prev,
                                [sub.id]: Number(e.target.value),
                              }))
                            }
                            className="w-24 px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-center"
                          />
                        </div>

                        <div>
                          <label className="block text-3xs font-extrabold uppercase text-slate-400 mb-0.5">
                            Faculty Feedback
                          </label>
                          <input
                            type="text"
                            placeholder="Enter remarks..."
                            defaultValue={sub.feedback ?? ''}
                            onChange={(e) =>
                              setEvalFeedback((prev) => ({ ...prev, [sub.id]: e.target.value }))
                            }
                            className="px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 min-w-[180px]"
                          />
                        </div>

                        <button
                          onClick={() => handleGradeSubmission(sub.id)}
                          className="mt-4 md:mt-0 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                        >
                          Save Grade
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </FacultyLayout>
  );
};
