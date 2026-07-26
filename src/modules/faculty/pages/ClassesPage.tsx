import React, { useState, useEffect } from 'react';
import { FacultyLayout } from '../layout/FacultyLayout';
import {
  BookOpen,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  CheckCircle2,
  ListTodo,
  Layers,
  Sparkles,
  Plus,
  BarChart2,
} from 'lucide-react';
import { facultyErpService } from '../services/facultyErp.service';
import { ClassRoutineItem, FacultySubject, LessonPlanItem } from '../types';

export const ClassesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ROUTINE' | 'SUBJECTS' | 'LESSONS'>('ROUTINE');
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [routine, setRoutine] = useState<ClassRoutineItem[]>([]);
  const [subjects, setSubjects] = useState<FacultySubject[]>([]);
  const [lessonPlans, setLessonPlans] = useState<LessonPlanItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [r, s, l] = await Promise.all([
        facultyErpService.getClassRoutine(),
        facultyErpService.getSubjects(),
        facultyErpService.getLessonPlans(),
      ]);
      setRoutine(r);
      setSubjects(s);
      setLessonPlans(l);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLessonStatusChange = async (
    planId: string,
    newStatus: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED'
  ) => {
    const updated = await facultyErpService.updateLessonPlanStatus(planId, newStatus);
    setLessonPlans(updated);
  };

  const dayFilteredRoutine = routine.filter((r) => r.day === selectedDay);

  return (
    <FacultyLayout pageTitle="Teaching Schedule & Routine">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              Teaching Schedule & Syllabus Planning
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Weekly class routine, assigned BHMS subjects, and unit-wise lesson completion progress.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('ROUTINE')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'ROUTINE'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              Class Routine
            </button>
            <button
              onClick={() => setActiveTab('SUBJECTS')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'SUBJECTS'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Assigned Subjects
            </button>
            <button
              onClick={() => setActiveTab('LESSONS')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'LESSONS'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <ListTodo className="w-3.5 h-3.5" />
              Lesson Planning
            </button>
          </div>
        </div>

        {/* TAB 1: ROUTINE */}
        {activeTab === 'ROUTINE' && (
          <div className="space-y-6">
            {/* Days Filter */}
            <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/60 rounded-2xl w-fit">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedDay === day
                      ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            {/* Timetable Grid Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoading ? (
                <div className="col-span-full text-center py-12 text-slate-400">
                  Loading class timetable...
                </div>
              ) : dayFilteredRoutine.length === 0 ? (
                <div className="col-span-full text-center py-12 border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl text-slate-500 text-xs">
                  No lectures scheduled for {selectedDay}.
                </div>
              ) : (
                dayFilteredRoutine.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xs space-y-3 hover:border-emerald-500/50 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full text-3xs font-extrabold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {item.type}
                      </span>
                      <span className="text-3xs font-mono font-bold text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {item.timeSlot}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {item.subjectName}
                      </h3>
                      <p className="text-3xs font-bold text-slate-400 mt-0.5">
                        Code: {item.subjectCode} • {item.batch}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1 text-3xs font-bold">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" /> {item.roomNo}
                      </span>
                      <button
                        onClick={() => alert(`Log lecture notes for ${item.subjectName}`)}
                        className="text-3xs font-extrabold text-emerald-600 hover:underline cursor-pointer"
                      >
                        Log Lecture Notes →
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 2: SUBJECTS */}
        {activeTab === 'SUBJECTS' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subjects.map((sub) => (
              <div
                key={sub.id}
                className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xs space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-3xs font-extrabold uppercase bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                      {sub.course} • {sub.semester}
                    </span>
                    <h3 className="text-base font-black text-slate-900 dark:text-white mt-1.5">
                      {sub.name}
                    </h3>
                    <span className="text-xs font-bold text-slate-400">
                      Subject Code: {sub.code}
                    </span>
                  </div>
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl text-emerald-600">
                    <BookOpen className="w-6 h-6" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                    <span className="text-3xs font-extrabold text-slate-400 uppercase tracking-wider block">
                      Weekly Lectures
                    </span>
                    <span className="text-base font-black text-slate-900 dark:text-white mt-0.5 block">
                      {sub.weeklyLectures} Hours / Week
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                    <span className="text-3xs font-extrabold text-slate-400 uppercase tracking-wider block">
                      Enrolled Students
                    </span>
                    <span className="text-base font-black text-slate-900 dark:text-white mt-0.5 block">
                      {sub.totalStudentsEnrolled} Students
                    </span>
                  </div>
                </div>

                {/* Syllabus Completion Bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-slate-600 dark:text-slate-300">
                      Syllabus Progress
                    </span>
                    <span className="font-black text-emerald-600">
                      {sub.syllabusProgress || 65}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${sub.syllabusProgress || 65}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: LESSON PLANNING */}
        {activeTab === 'LESSONS' && (
          <div className="space-y-6">
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <ListTodo className="w-4 h-4 text-emerald-600" />
                    Unit-wise Lesson Tracker & Methodology
                  </h3>
                  <p className="text-xs text-slate-500">
                    Track topic completion, planned teaching hours vs actual delivered hours under WBUHS syllabus.
                  </p>
                </div>
                <button
                  onClick={() => alert('New Lesson Plan Form')}
                  className="px-3.5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Lesson Unit
                </button>
              </div>

              <div className="space-y-3">
                {lessonPlans.map((lp) => (
                  <div
                    key={lp.id}
                    className="p-4 border border-slate-200/80 dark:border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/30"
                  >
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md text-3xs font-black uppercase bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                          Unit {lp.unitNo}: {lp.unitTitle}
                        </span>
                        <span className="text-3xs font-bold text-slate-400">
                          {lp.plannedHours} Hours Planned
                        </span>
                      </div>
                      <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
                        {lp.topic}
                      </h4>
                      <p className="text-3xs text-slate-500">
                        Methodology: <span className="font-semibold">{lp.methodology}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <select
                        value={lp.status}
                        onChange={(e) =>
                          handleLessonStatusChange(
                            lp.id,
                            e.target.value as 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED'
                          )
                        }
                        className={`px-3 py-1.5 rounded-xl text-3xs font-black uppercase tracking-wider focus:outline-none cursor-pointer ${
                          lp.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : lp.status === 'IN_PROGRESS'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <option value="PLANNED">Planned</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </FacultyLayout>
  );
};
