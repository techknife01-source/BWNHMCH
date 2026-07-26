import React, { useState, useEffect } from 'react';
import { FacultyLayout } from '../layout/FacultyLayout';
import {
  FlaskConical,
  FileText,
  Award,
  Users,
  Plus,
  ExternalLink,
  Sparkles,
  Search,
  BookOpen,
} from 'lucide-react';
import { facultyErpService } from '../services/facultyErp.service';
import {
  ResearchProject,
  ResearchPublication,
  FacultyAward,
  ConferenceParticipation,
} from '../types';

export const ResearchPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'PROJECTS' | 'PUBLICATIONS' | 'AWARDS' | 'CONFERENCES'>('PROJECTS');
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [publications, setPublications] = useState<ResearchPublication[]>([]);
  const [awards, setAwards] = useState<FacultyAward[]>([]);
  const [conferences, setConferences] = useState<ConferenceParticipation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modal State for New Paper
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newJournal, setNewJournal] = useState<string>('');
  const [newDoi, setNewDoi] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [p, pub, a, c] = await Promise.all([
        facultyErpService.getResearchProjects(),
        facultyErpService.getPublications(),
        facultyErpService.getAwards(),
        facultyErpService.getConferences(),
      ]);
      setProjects(p);
      setPublications(pub);
      setAwards(a);
      setConferences(c);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPaper = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newJournal) return;

    const updatedPubs = await facultyErpService.addPublication({
      title: newTitle,
      journalName: newJournal,
      volumeIssue: 'Vol 20, Issue 1, pp. 45-50',
      impactFactor: 2.1,
      doi: newDoi || '10.4103/ijrh.ijrh_new',
      publishedDate: new Date().toISOString().split('T')[0],
      indexing: 'Scopus / PubMed Central',
      authors: ['Dr. A. K. Banerjee', 'Faculty Co-Author'],
    });

    setPublications(updatedPubs);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewJournal('');
    setNewDoi('');
    setToastMessage('Research paper publication registered successfully!');
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <FacultyLayout pageTitle="Research & Publications">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-emerald-600" />
              Faculty Research, Grants & Publications
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              CCRH & AYUSH research projects, peer-reviewed journals, national awards, and conference proceedings.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('PROJECTS')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'PROJECTS'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              Grants & Projects
            </button>
            <button
              onClick={() => setActiveTab('PUBLICATIONS')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'PUBLICATIONS'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Publications ({publications.length})
            </button>
            <button
              onClick={() => setActiveTab('AWARDS')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'AWARDS'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              Awards
            </button>
            <button
              onClick={() => setActiveTab('CONFERENCES')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'CONFERENCES'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Conferences
            </button>
          </div>
        </div>

        {toastMessage && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-xs font-bold animate-fadeIn">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* TAB 1: PROJECTS */}
        {activeTab === 'PROJECTS' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xs space-y-4 hover:border-emerald-500/50 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="px-2.5 py-0.5 rounded-full text-3xs font-extrabold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {proj.status}
                    </span>
                    <span className="text-3xs font-bold text-slate-400">
                      {proj.duration}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">
                      {proj.title}
                    </h3>
                    <p className="text-3xs font-extrabold text-emerald-600 mt-1">
                      Sponsor: {proj.fundingAgency}
                    </p>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">{proj.summary}</p>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-3xs font-extrabold text-slate-400">
                      Role: {proj.role}
                    </span>
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      Grant: ₹{(proj.grantAmount / 100000).toFixed(2)} Lakhs
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: PUBLICATIONS */}
        {activeTab === 'PUBLICATIONS' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Register Published Paper
              </button>
            </div>

            <div className="space-y-4">
              {publications.map((pub) => (
                <div
                  key={pub.id}
                  className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xs space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-3xs font-extrabold uppercase bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                      {pub.indexing}
                    </span>
                    <span className="text-3xs font-bold text-slate-400">
                      Published: {pub.publishedDate}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    {pub.title}
                  </h3>

                  <p className="text-xs font-bold text-emerald-600">
                    {pub.journalName} • <span className="text-slate-500">{pub.volumeIssue}</span>
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-3xs font-bold text-slate-400 border-t border-slate-100 dark:border-slate-800">
                    <span>Authors: {pub.authors.join(', ')}</span>
                    <span className="text-emerald-600">Impact Factor: {pub.impactFactor}</span>
                    <span className="font-mono">DOI: {pub.doi}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: AWARDS */}
        {activeTab === 'AWARDS' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {awards.map((awd) => (
              <div
                key={awd.id}
                className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xs space-y-3 text-center"
              >
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-600 rounded-2xl w-fit mx-auto">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {awd.title}
                </h3>
                <p className="text-xs text-slate-500">{awd.issuingBody}</p>
                <span className="px-2.5 py-0.5 rounded-full text-3xs font-black uppercase bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 inline-block">
                  {awd.year} • {awd.category}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: CONFERENCES */}
        {activeTab === 'CONFERENCES' && (
          <div className="space-y-4">
            {conferences.map((conf) => (
              <div
                key={conf.id}
                className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-3xs font-extrabold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {conf.role}
                    </span>
                    <span className="text-3xs font-bold text-slate-400">{conf.date}</span>
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {conf.eventName}
                  </h3>
                  {conf.paperTitle && (
                    <p className="text-xs text-slate-500 font-medium">
                      Presented Paper: "{conf.paperTitle}"
                    </p>
                  )}
                </div>
                <div className="text-3xs font-bold text-slate-400">{conf.location}</div>
              </div>
            ))}
          </div>
        )}

        {/* Add Paper Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Register Research Paper Publication
              </h3>
              <form onSubmit={handleAddPaper} className="space-y-3">
                <div>
                  <label className="block text-3xs font-bold uppercase text-slate-500 mb-1">
                    Paper Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-3xs font-bold uppercase text-slate-500 mb-1">
                    Journal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newJournal}
                    onChange={(e) => setNewJournal(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-3xs font-bold uppercase text-slate-500 mb-1">
                    DOI Link / ISSN
                  </label>
                  <input
                    type="text"
                    value={newDoi}
                    onChange={(e) => setNewDoi(e.target.value)}
                    placeholder="10.4103/ijrh.ijrh_..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-emerald-700 transition"
                  >
                    Register Paper
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </FacultyLayout>
  );
};
