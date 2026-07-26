import React, { useState, useEffect } from 'react';
import { FacultyLayout } from '../layout/FacultyLayout';
import {
  Award,
  RefreshCw,
  CheckCircle2,
  Save,
  Download,
  Sparkles,
  Search,
  TrendingUp,
} from 'lucide-react';
import { facultyErpService } from '../services/facultyErp.service';
import { InternalMarksRecord, FacultySubject } from '../types';

export const ResultsPage: React.FC = () => {
  const [subjects, setSubjects] = useState<FacultySubject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('SUB-101');
  const [selectedExamType, setSelectedExamType] = useState<string>('First Internal');
  const [marksRecords, setMarksRecords] = useState<InternalMarksRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [selectedSubjectId, selectedExamType]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [subs, records] = await Promise.all([
        facultyErpService.getSubjects(),
        facultyErpService.getInternalMarks(selectedSubjectId, selectedExamType),
      ]);
      setSubjects(subs);
      setMarksRecords(records);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarksChange = (
    id: string,
    field: 'theoryMarks' | 'practicalMarks' | 'vivaMarks' | 'assignmentMarks',
    val: number
  ) => {
    setMarksRecords((prev) =>
      prev.map((rec) => {
        if (rec.id === id) {
          const updated = { ...rec, [field]: val };
          const total =
            updated.theoryMarks +
            updated.practicalMarks +
            updated.vivaMarks +
            updated.assignmentMarks;
          const percentage = (total / updated.maxMarks) * 100;
          let grade = 'F';
          if (percentage >= 85) grade = 'A+';
          else if (percentage >= 75) grade = 'A';
          else if (percentage >= 65) grade = 'B';
          else if (percentage >= 50) grade = 'C';

          return {
            ...updated,
            totalMarks: total,
            grade,
            isPassed: percentage >= 50,
          };
        }
        return rec;
      })
    );
  };

  const handleSaveAllMarks = async () => {
    setIsSaving(true);
    const res = await facultyErpService.saveInternalMarks(marksRecords);
    setIsSaving(false);
    setToastMessage(res.message);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredRecords = marksRecords.filter(
    (m) =>
      m.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const passedCount = marksRecords.filter((m) => m.isPassed).length;
  const passRate = marksRecords.length
    ? Math.round((passedCount / marksRecords.length) * 100)
    : 0;

  return (
    <FacultyLayout pageTitle="Internal Assessment Marks">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              Internal Assessment & Viva Marks Entry
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Input terminal exam scores, viva voce, and practical assessment results for Examination Cell sync.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('Exporting WBUHS Marksheet Excel...')}
              className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Export Excel
            </button>
            <button
              onClick={handleSaveAllMarks}
              disabled={isSaving}
              className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-xs font-bold shadow-md hover:from-emerald-700 transition flex items-center gap-1.5 cursor-pointer"
            >
              {isSaving ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              Submit to Exam Cell
            </button>
          </div>
        </div>

        {toastMessage && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-xs font-bold animate-fadeIn">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Filters */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-3xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">
              Select Subject
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
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
              Assessment Exam Type
            </label>
            <select
              value={selectedExamType}
              onChange={(e) => setSelectedExamType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="First Internal">First Internal Examination</option>
              <option value="Second Internal">Second Internal Examination</option>
              <option value="Mid-Term Viva">Mid-Term Viva Voce</option>
              <option value="Practical Assessment">Practical Lab Assessment</option>
              <option value="Pre-National Mock">Pre-National Mock Test</option>
            </select>
          </div>

          <div className="flex items-center gap-4 pt-4 sm:pt-0">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl flex-1 text-center">
              <span className="text-3xs font-extrabold uppercase text-slate-400 block">
                Class Pass Rate
              </span>
              <span className="text-lg font-black text-emerald-600 block">{passRate}%</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex-1 text-center">
              <span className="text-3xs font-extrabold uppercase text-slate-400 block">
                Max Score
              </span>
              <span className="text-lg font-black text-slate-900 dark:text-white block">210</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student by name or roll number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Marks Entry Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-3xs uppercase tracking-wider text-slate-500 font-extrabold border-b border-slate-200/80 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Roll No</th>
                  <th className="py-3.5 px-4">Student Name</th>
                  <th className="py-3.5 px-4 text-center">Theory (100)</th>
                  <th className="py-3.5 px-4 text-center">Practical (50)</th>
                  <th className="py-3.5 px-4 text-center">Viva (50)</th>
                  <th className="py-3.5 px-4 text-center">Asg (10)</th>
                  <th className="py-3.5 px-4 text-center">Total (210)</th>
                  <th className="py-3.5 px-4 text-center">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      Loading marksheets...
                    </td>
                  </tr>
                ) : filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      No student records found.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((m) => (
                    <tr
                      key={m.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition"
                    >
                      <td className="py-3.5 px-4 font-mono font-extrabold text-slate-800 dark:text-slate-200">
                        {m.rollNo}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                        {m.studentName}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="number"
                          value={m.theoryMarks}
                          onChange={(e) =>
                            handleMarksChange(m.id, 'theoryMarks', Number(e.target.value))
                          }
                          className="w-16 px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-center"
                        />
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="number"
                          value={m.practicalMarks}
                          onChange={(e) =>
                            handleMarksChange(m.id, 'practicalMarks', Number(e.target.value))
                          }
                          className="w-16 px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-center"
                        />
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="number"
                          value={m.vivaMarks}
                          onChange={(e) =>
                            handleMarksChange(m.id, 'vivaMarks', Number(e.target.value))
                          }
                          className="w-16 px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-center"
                        />
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="number"
                          value={m.assignmentMarks}
                          onChange={(e) =>
                            handleMarksChange(m.id, 'assignmentMarks', Number(e.target.value))
                          }
                          className="w-16 px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-center"
                        />
                      </td>
                      <td className="py-3.5 px-4 text-center font-black text-slate-900 dark:text-white">
                        {m.totalMarks}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-3xs font-black ${
                            m.isPassed
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}
                        >
                          {m.grade}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </FacultyLayout>
  );
};
