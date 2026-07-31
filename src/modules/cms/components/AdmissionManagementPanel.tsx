import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import {
  isSuperAdmin,
  isAdmin,
  isPrincipal,
  isVicePrincipal,
  getUserDisplayDesignation,
} from '../../../utils/permissionHelper';
import {
  admissionCmsService,
  AdmissionEvent,
  AdmissionStage,
  AdmissionSettings,
} from '../../../services/admissionCmsService';
import {
  Calendar,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Radio,
  Layers,
  Settings,
  ShieldAlert,
  Sparkles,
  Info,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const AdmissionManagementPanel: React.FC = () => {
  const { user } = useAuth();
  const isAuthorized =
    isSuperAdmin(user) || isAdmin(user) || isPrincipal(user) || isVicePrincipal(user);

  const [stages, setStages] = useState<AdmissionStage[]>([]);
  const [events, setEvents] = useState<AdmissionEvent[]>([]);
  const [settings, setSettings] = useState<AdmissionSettings>(admissionCmsService.getSettings());

  const [editingStage, setEditingStage] = useState<Partial<AdmissionStage> | null>(null);
  const [editingEvent, setEditingEvent] = useState<Partial<AdmissionEvent> | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const loadData = () => {
    setStages(admissionCmsService.getStages());
    setEvents(admissionCmsService.getEvents(false));
    setSettings(admissionCmsService.getSettings());
  };

  useEffect(() => {
    loadData();
    const unsubscribe = admissionCmsService.subscribe(loadData);
    return () => unsubscribe();
  }, []);

  if (!isAuthorized) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
        <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
          Access Restricted to Admission Authorities
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Only Super Admin, Admin, Principal, and Vice Principal accounts are authorized to manage BHMS admission timelines, stages, and settings.
        </p>
      </div>
    );
  }

  // Active Stage control handler
  const handleSetActiveStage = (stageId: string) => {
    admissionCmsService.setActiveStage(stageId);
    toast.success('Active admission stage updated successfully!');
  };

  // Stage CRUD
  const handleSaveStage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStage?.name) return;

    if (editingStage.id) {
      admissionCmsService.updateStage(editingStage.id, editingStage);
      toast.success('Admission stage updated');
    } else {
      admissionCmsService.addStage({
        name: editingStage.name,
        description: editingStage.description || '',
        order: stages.length + 1,
        isCurrentActive: editingStage.isCurrentActive || false,
        status: editingStage.status || 'Upcoming',
      });
      toast.success('New admission stage added');
    }
    setEditingStage(null);
  };

  const handleDeleteStage = (id: string) => {
    if (confirm('Are you sure you want to delete this stage?')) {
      admissionCmsService.deleteStage(id);
      toast.success('Stage deleted');
    }
  };

  const handleMoveStage = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === stages.length - 1)
    )
      return;
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    const stageIds = stages.map((s) => s.id);
    const temp = stageIds[index];
    stageIds[index] = stageIds[newIdx];
    stageIds[newIdx] = temp;
    admissionCmsService.reorderStages(stageIds);
  };

  // Event CRUD
  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent?.event || !editingEvent?.date) return;

    if (editingEvent.id) {
      admissionCmsService.updateEvent(editingEvent.id, editingEvent);
      toast.success('Admission event updated');
    } else {
      admissionCmsService.addEvent({
        event: editingEvent.event,
        date: editingEvent.date,
        description: editingEvent.description || '',
        status: editingEvent.status || 'Upcoming',
        isPublished: editingEvent.isPublished !== undefined ? editingEvent.isPublished : true,
        order: events.length + 1,
      });
      toast.success('New admission event scheduled');
    }
    setEditingEvent(null);
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      admissionCmsService.deleteEvent(id);
      toast.success('Event deleted');
    }
  };

  const handleTogglePublishEvent = (id: string, current: boolean) => {
    admissionCmsService.updateEvent(id, { isPublished: !current });
    toast.success(current ? 'Event unpublished' : 'Event published');
  };

  const handleMoveEvent = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === events.length - 1)
    )
      return;
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    const eventIds = events.map((e) => e.id);
    const temp = eventIds[index];
    eventIds[index] = eventIds[newIdx];
    eventIds[newIdx] = temp;
    admissionCmsService.reorderEvents(eventIds);
  };

  // Settings Save
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    admissionCmsService.updateSettings(settings);
    toast.success('Admission settings saved!');
    setShowSettingsModal(false);
  };

  const currentActiveStage = stages.find((s) => s.isCurrentActive);

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-gradient-to-r from-[#002147] to-[#003366] text-white rounded-3xl shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-2xs font-bold rounded-full uppercase border border-emerald-500/30">
              Authorized CMS Desk
            </span>
            <span className="text-2xs text-slate-300">
              Role: {getUserDisplayDesignation(user)}
            </span>
          </div>
          <h2 className="text-xl font-extrabold mt-1">BHMS Admission & Timeline Control Center</h2>
          <p className="text-xs text-slate-300">
            Manage active counseling stage, schedule important dates, and publish seat matrix guidelines.
          </p>
        </div>

        <button
          onClick={() => setShowSettingsModal(true)}
          className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition cursor-pointer"
        >
          <Settings className="w-4 h-4 text-emerald-400" />
          <span>Edit Portal Settings</span>
        </button>
      </div>

      {/* SECTION 1: ACTIVE ADMISSION STAGE CONTROLLER */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-[#002147] dark:text-[#00A651]">
              <Layers className="w-5 h-5" />
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Active Admission Stage Controller
              </h3>
            </div>
            <p className="text-2xs text-slate-400 mt-0.5">
              Select which counseling stage is currently active. The public Admission page will automatically highlight this stage with an active progress marker.
            </p>
          </div>

          <button
            onClick={() =>
              setEditingStage({
                name: '',
                description: '',
                isCurrentActive: false,
                status: 'Upcoming',
              })
            }
            className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-2xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Stage</span>
          </button>
        </div>

        {/* Current Active Banner */}
        {currentActiveStage && (
          <div className="p-4 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black animate-pulse">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-300">
                  Current Active Stage
                </span>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {currentActiveStage.name}
                </h4>
                {currentActiveStage.description && (
                  <p className="text-2xs text-slate-500">{currentActiveStage.description}</p>
                )}
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-500 text-white text-2xs font-extrabold rounded-full uppercase tracking-wider animate-pulse">
              Currently Open
            </span>
          </div>
        )}

        {/* Stages List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {stages.map((stage, idx) => (
            <div
              key={stage.id}
              className={`p-4 rounded-2xl border transition relative flex flex-col justify-between gap-3 ${
                stage.isCurrentActive
                  ? 'bg-emerald-500/10 border-emerald-500 shadow-sm ring-2 ring-emerald-500/30'
                  : stage.status === 'Completed'
                  ? 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 opacity-90'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xs font-mono font-bold text-slate-400">
                    Stage {stage.order}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                      stage.status === 'Currently Open'
                        ? 'bg-emerald-500 text-white'
                        : stage.status === 'Completed'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {stage.status}
                  </span>
                </div>

                <h5 className="font-extrabold text-xs text-slate-900 dark:text-white leading-snug">
                  {stage.name}
                </h5>
                {stage.description && (
                  <p className="text-3xs text-slate-500 line-clamp-2">{stage.description}</p>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                {!stage.isCurrentActive ? (
                  <button
                    onClick={() => handleSetActiveStage(stage.id)}
                    className="flex-1 py-1 px-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded-lg transition cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Radio className="w-3 h-3" />
                    <span>Set Active</span>
                  </button>
                ) : (
                  <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Active Now</span>
                  </span>
                )}

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleMoveStage(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleMoveStage(idx, 'down')}
                    disabled={idx === stages.length - 1}
                    className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setEditingStage(stage)}
                    className="p-1 text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDeleteStage(stage.id)}
                    className="p-1 text-rose-600 hover:text-rose-800 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: ADMISSION TIMELINE & IMPORTANT DATES */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-[#002147] dark:text-[#00A651]">
              <Calendar className="w-5 h-5" />
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Admission Timeline & Important Dates Manager
              </h3>
            </div>
            <p className="text-2xs text-slate-400 mt-0.5">
              Add, update dates, reorder, mark as active/completed/upcoming, and publish counseling events.
            </p>
          </div>

          <button
            onClick={() =>
              setEditingEvent({
                event: '',
                date: '',
                description: '',
                status: 'Upcoming',
                isPublished: true,
              })
            }
            className="px-4 py-2 bg-[#002147] dark:bg-[#00A651] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add Admission Event</span>
          </button>
        </div>

        {/* Events List */}
        <div className="space-y-3">
          {events.map((evt, idx) => (
            <div
              key={evt.id}
              className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                !evt.isPublished
                  ? 'bg-slate-50 dark:bg-slate-950/60 border-dashed border-slate-300 dark:border-slate-800 opacity-60'
                  : evt.status === 'Active Now'
                  ? 'bg-emerald-500/10 border-emerald-500 ring-1 ring-emerald-500/20'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                      evt.status === 'Active Now'
                        ? 'bg-emerald-500 text-white animate-pulse'
                        : evt.status === 'Completed'
                        ? 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {evt.status}
                  </span>

                  <span className="text-[11px] font-mono font-bold text-[#002147] dark:text-[#00A651]">
                    {evt.date}
                  </span>

                  {!evt.isPublished && (
                    <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                      Unpublished
                    </span>
                  )}
                </div>

                <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">
                  {evt.event}
                </h4>
                {evt.description && (
                  <p className="text-3xs text-slate-500">{evt.description}</p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleTogglePublishEvent(evt.id, evt.isPublished)}
                  className={`p-2 rounded-xl transition cursor-pointer ${
                    evt.isPublished
                      ? 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                      : 'text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                  title={evt.isPublished ? 'Unpublish Event' : 'Publish Event'}
                >
                  {evt.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => handleMoveEvent(idx, 'up')}
                  disabled={idx === 0}
                  className="p-1.5 text-slate-400 hover:text-slate-600 disabled:opacity-30 cursor-pointer"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleMoveEvent(idx, 'down')}
                  disabled={idx === events.length - 1}
                  className="p-1.5 text-slate-400 hover:text-slate-600 disabled:opacity-30 cursor-pointer"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setEditingEvent(evt)}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl transition cursor-pointer"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDeleteEvent(evt.id)}
                  className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EDIT STAGE MODAL */}
      {editingStage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              {editingStage.id ? 'Edit Admission Stage' : 'Add New Admission Stage'}
            </h3>

            <form onSubmit={handleSaveStage} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Stage Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingStage.name || ''}
                  onChange={(e) => setEditingStage({ ...editingStage, name: e.target.value })}
                  placeholder="e.g. Merit List Publication"
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editingStage.description || ''}
                  onChange={(e) =>
                    setEditingStage({ ...editingStage, description: e.target.value })
                  }
                  placeholder="Short description of this stage"
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Status
                  </label>
                  <select
                    value={editingStage.status || 'Upcoming'}
                    onChange={(e) =>
                      setEditingStage({
                        ...editingStage,
                        status: e.target.value as any,
                      })
                    }
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 font-bold"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Currently Open">Currently Open</option>
                    <option value="Upcoming">Upcoming</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 font-bold cursor-pointer text-slate-800 dark:text-slate-200">
                    <input
                      type="checkbox"
                      checked={editingStage.isCurrentActive || false}
                      onChange={(e) =>
                        setEditingStage({ ...editingStage, isCurrentActive: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-[#002147]"
                    />
                    <span>Set as Active Stage</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingStage(null)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#002147] dark:bg-[#00A651] text-white font-bold rounded-xl"
                >
                  Save Stage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT EVENT MODAL */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              {editingEvent.id ? 'Edit Admission Event' : 'Add Admission Event'}
            </h3>

            <form onSubmit={handleSaveEvent} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingEvent.event || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, event: e.target.value })}
                  placeholder="e.g. 1st Round Physical Document Verification"
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Event Date / Schedule *
                </label>
                <input
                  type="text"
                  required
                  value={editingEvent.date || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                  placeholder="e.g. 02 August - 05 August 2026"
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description / Guidelines
                </label>
                <textarea
                  rows={2}
                  value={editingEvent.description || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  placeholder="Details for candidates..."
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Status
                  </label>
                  <select
                    value={editingEvent.status || 'Upcoming'}
                    onChange={(e) =>
                      setEditingEvent({ ...editingEvent, status: e.target.value as any })
                    }
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 font-bold"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Active Now">Active Now</option>
                    <option value="Upcoming">Upcoming</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 font-bold cursor-pointer text-slate-800 dark:text-slate-200">
                    <input
                      type="checkbox"
                      checked={editingEvent.isPublished !== false}
                      onChange={(e) => setEditingEvent({ ...editingEvent, isPublished: e.target.checked })}
                      className="w-4 h-4 rounded text-[#002147]"
                    />
                    <span>Publish Immediately</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#002147] dark:bg-[#00A651] text-white font-bold rounded-xl"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PORTAL SETTINGS MODAL */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Edit Admission Portal Metadata & Seat Matrix
            </h3>

            <form onSubmit={handleSaveSettings} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Main Page Heading
                </label>
                <input
                  type="text"
                  required
                  value={settings.heading}
                  onChange={(e) => setSettings({ ...settings, heading: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Subheading Banner Description
                </label>
                <textarea
                  rows={2}
                  value={settings.subheading}
                  onChange={(e) => setSettings({ ...settings, subheading: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Total Seats
                  </label>
                  <input
                    type="number"
                    value={settings.totalSeats}
                    onChange={(e) => setSettings({ ...settings, totalSeats: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    State Quota (85%)
                  </label>
                  <input
                    type="number"
                    value={settings.stateQuotaSeats}
                    onChange={(e) => setSettings({ ...settings, stateQuotaSeats: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    All India (15%)
                  </label>
                  <input
                    type="number"
                    value={settings.allIndiaQuotaSeats}
                    onChange={(e) => setSettings({ ...settings, allIndiaQuotaSeats: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Helpline Phone
                  </label>
                  <input
                    type="text"
                    value={settings.helplinePhones}
                    onChange={(e) => setSettings({ ...settings, helplinePhones: e.target.value })}
                    className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Helpline Email
                  </label>
                  <input
                    type="email"
                    value={settings.helplineEmail}
                    onChange={(e) => setSettings({ ...settings, helplineEmail: e.target.value })}
                    className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#002147] dark:bg-[#00A651] text-white font-bold rounded-xl"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
