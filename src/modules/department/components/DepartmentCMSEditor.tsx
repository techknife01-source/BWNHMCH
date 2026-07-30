import React, { useState } from 'react';
import { DepartmentCMSData, FacultyMemberCMS, GalleryItemCMS, DownloadItemCMS } from '../../../types/departmentCms';
import { Button } from '../../../components/common/Button';
import {
  X,
  Save,
  Plus,
  Trash2,
  BookOpen,
  FlaskConical,
  FileText,
  Users,
  Image as ImageIcon,
  Award,
  Download,
  Building2,
  Sparkles,
  Check
} from 'lucide-react';

interface DepartmentCMSEditorProps {
  department: DepartmentCMSData;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: DepartmentCMSData) => void;
}

export const DepartmentCMSEditor: React.FC<DepartmentCMSEditorProps> = ({
  department,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<DepartmentCMSData>({ ...department });
  const [activeTab, setActiveTab] = useState<
    'general' | 'description' | 'academics' | 'faculty' | 'gallery' | 'research' | 'downloads'
  >('general');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1000);
  };

  // Helper string list handlers
  const handleListChange = (field: 'methodology' | 'practical' | 'teachingAids' | 'research' | 'achievements', index: number, value: string) => {
    const list = [...(formData[field] || [])];
    list[index] = value;
    setFormData({ ...formData, [field]: list });
  };

  const addListItem = (field: 'methodology' | 'practical' | 'teachingAids' | 'research' | 'achievements') => {
    setFormData({ ...formData, [field]: [...(formData[field] || []), ''] });
  };

  const removeListItem = (field: 'methodology' | 'practical' | 'teachingAids' | 'research' | 'achievements', index: number) => {
    const list = (formData[field] || []).filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: list });
  };

  // Faculty Handlers
  const addFaculty = () => {
    const newFaculty: FacultyMemberCMS = {
      id: `f-${Date.now()}`,
      name: '',
      designation: 'Assistant Professor',
      qualification: 'M.D. (Hom.)',
      email: '',
      phone: ''
    };
    setFormData({ ...formData, facultyList: [...(formData.facultyList || []), newFaculty] });
  };

  const updateFaculty = (index: number, key: keyof FacultyMemberCMS, val: string) => {
    const list = [...(formData.facultyList || [])];
    list[index] = { ...list[index], [key]: val };
    setFormData({ ...formData, facultyList: list });
  };

  const removeFaculty = (index: number) => {
    setFormData({ ...formData, facultyList: (formData.facultyList || []).filter((_, i) => i !== index) });
  };

  // Gallery Handlers
  const addGalleryItem = () => {
    const newItem: GalleryItemCMS = {
      id: `g-${Date.now()}`,
      url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
      caption: 'Departmental Facility Photograph',
      category: 'General'
    };
    setFormData({ ...formData, gallery: [...(formData.gallery || []), newItem] });
  };

  const updateGallery = (index: number, key: keyof GalleryItemCMS, val: string) => {
    const list = [...(formData.gallery || [])];
    list[index] = { ...list[index], [key]: val };
    setFormData({ ...formData, gallery: list });
  };

  const removeGallery = (index: number) => {
    setFormData({ ...formData, gallery: (formData.gallery || []).filter((_, i) => i !== index) });
  };

  // Download Handlers
  const addDownloadItem = () => {
    const newItem: DownloadItemCMS = {
      id: `d-${Date.now()}`,
      title: 'New Syllabus / Practical Guide',
      url: '/documents/department_resource_document.pdf',
      fileType: 'PDF Document',
      fileSize: '1.5 MB',
      uploadDate: new Date().toISOString().split('T')[0]
    };
    setFormData({ ...formData, downloads: [...(formData.downloads || []), newItem] });
  };

  const updateDownload = (index: number, key: keyof DownloadItemCMS, val: string) => {
    const list = [...(formData.downloads || [])];
    list[index] = { ...list[index], [key]: val };
    setFormData({ ...formData, downloads: list });
  };

  const removeDownload = (index: number) => {
    setFormData({ ...formData, downloads: (formData.downloads || []).filter((_, i) => i !== index) });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-md">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-4xl w-full flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-[#002147] text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-black text-sm border border-emerald-500/30">
              CMS
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">Faculty & Admin CMS Editor</span>
              <h2 className="text-lg sm:text-xl font-extrabold truncate max-w-md">{formData.name}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 overflow-x-auto p-2 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-xs custom-scrollbar">
          {[
            { id: 'general', label: '1. Basic & Banner', icon: Building2 },
            { id: 'description', label: '2. Description', icon: FileText },
            { id: 'academics', label: '3. Methodology & Practical', icon: BookOpen },
            { id: 'faculty', label: '4. Faculty List', icon: Users },
            { id: 'gallery', label: '5. Gallery', icon: ImageIcon },
            { id: 'research', label: '6. Research & Awards', icon: Award },
            { id: 'downloads', label: '7. Downloads', icon: Download },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#002147] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs custom-scrollbar">
          {/* 1. General & Banner */}
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900/50 text-blue-900 dark:text-blue-300 font-semibold">
                Configure the department name, official code, HOD details, and top banner visual styling.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Department Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Department Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Head of Department (HOD)</label>
                  <input
                    type="text"
                    value={formData.hod || ''}
                    onChange={(e) => setFormData({ ...formData, hod: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Years / Scope Covered</label>
                  <input
                    type="text"
                    value={formData.yearsCovered || ''}
                    onChange={(e) => setFormData({ ...formData, yearsCovered: e.target.value })}
                    placeholder="e.g. BHMS 1st Year to 4th Year"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                  />
                </div>
              </div>

              <hr className="border-slate-200 dark:border-slate-800 my-4" />

              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Banner Settings</h4>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Banner Title</label>
                <input
                  type="text"
                  value={formData.banner.title}
                  onChange={(e) => setFormData({ ...formData, banner: { ...formData.banner, title: e.target.value } })}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Banner Subtitle / Tagline</label>
                <textarea
                  rows={2}
                  value={formData.banner.subtitle}
                  onChange={(e) => setFormData({ ...formData, banner: { ...formData.banner, subtitle: e.target.value } })}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Banner Badge Text</label>
                  <input
                    type="text"
                    value={formData.banner.badge || ''}
                    onChange={(e) => setFormData({ ...formData, banner: { ...formData.banner, badge: e.target.value } })}
                    placeholder="e.g. NCH Recognized Core Faculty"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Banner Background Image URL</label>
                  <input
                    type="text"
                    value={formData.banner.bgImageUrl || ''}
                    onChange={(e) => setFormData({ ...formData, banner: { ...formData.banner, bgImageUrl: e.target.value } })}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. Description */}
          {activeTab === 'description' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-900/50 text-emerald-900 dark:text-emerald-300 font-semibold">
                Provide comprehensive introduction, department objectives, and historical academic background.
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Department Description & Overview *</label>
                <textarea
                  rows={8}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl leading-relaxed text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          {/* 3. Methodology & Practical */}
          {activeTab === 'academics' && (
            <div className="space-y-6">
              {/* Methodology */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-emerald-500" /> Teaching & Academic Methodology
                  </h4>
                  <button
                    type="button"
                    onClick={() => addListItem('methodology')}
                    className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-100 rounded-lg font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Add Item
                  </button>
                </div>

                {(formData.methodology || []).map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleListChange('methodology', i, e.target.value)}
                      placeholder={`Methodology item #${i + 1}`}
                      className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => removeListItem('methodology', i)}
                      className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <hr className="border-slate-200 dark:border-slate-800" />

              {/* Practical Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <FlaskConical className="w-4 h-4 text-blue-500" /> Practical Training & Clinical Exposure
                  </h4>
                  <button
                    type="button"
                    onClick={() => addListItem('practical')}
                    className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 hover:bg-blue-100 rounded-lg font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Add Item
                  </button>
                </div>

                {(formData.practical || []).map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleListChange('practical', i, e.target.value)}
                      placeholder={`Practical item #${i + 1}`}
                      className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => removeListItem('practical', i)}
                      className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <hr className="border-slate-200 dark:border-slate-800" />

              {/* Teaching Aids */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-amber-500" /> Teaching Aids & Educational Resources
                  </h4>
                  <button
                    type="button"
                    onClick={() => addListItem('teachingAids')}
                    className="px-2.5 py-1 bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-300 hover:bg-amber-100 rounded-lg font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Add Item
                  </button>
                </div>

                {(formData.teachingAids || []).map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleListChange('teachingAids', i, e.target.value)}
                      placeholder={`Teaching aid item #${i + 1}`}
                      className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => removeListItem('teachingAids', i)}
                      className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Faculty List */}
          {activeTab === 'faculty' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Department Faculty Directory</h4>
                  <p className="text-2xs text-slate-500">Manage professors, associate professors, lecturers, and clinical tutors.</p>
                </div>
                <button
                  type="button"
                  onClick={addFaculty}
                  className="px-3 py-1.5 bg-[#002147] text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Faculty Member
                </button>
              </div>

              {(formData.facultyList || []).map((faculty, i) => (
                <div key={faculty.id || i} className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 relative">
                  <button
                    type="button"
                    onClick={() => removeFaculty(i)}
                    className="absolute top-3 right-3 p-1.5 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/50 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name</label>
                      <input
                        type="text"
                        value={faculty.name}
                        onChange={(e) => updateFaculty(i, 'name', e.target.value)}
                        placeholder="e.g. Dr. A. K. Roy"
                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Designation</label>
                      <input
                        type="text"
                        value={faculty.designation}
                        onChange={(e) => updateFaculty(i, 'designation', e.target.value)}
                        placeholder="e.g. Professor & HOD"
                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Qualification</label>
                      <input
                        type="text"
                        value={faculty.qualification}
                        onChange={(e) => updateFaculty(i, 'qualification', e.target.value)}
                        placeholder="e.g. M.D. (Hom.)"
                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Official Email</label>
                      <input
                        type="email"
                        value={faculty.email || ''}
                        onChange={(e) => updateFaculty(i, 'email', e.target.value)}
                        placeholder="faculty@bwnhmch.com"
                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Contact Phone</label>
                      <input
                        type="text"
                        value={faculty.phone || ''}
                        onChange={(e) => updateFaculty(i, 'phone', e.target.value)}
                        placeholder="+91 94343 00000"
                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 5. Gallery */}
          {activeTab === 'gallery' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Department Visual Gallery</h4>
                  <p className="text-2xs text-slate-500">Laboratory photos, practical sessions, and museum exhibits.</p>
                </div>
                <button
                  type="button"
                  onClick={addGalleryItem}
                  className="px-3 py-1.5 bg-[#002147] text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Image
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(formData.gallery || []).map((img, i) => (
                  <div key={img.id || i} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2 relative">
                    <button
                      type="button"
                      onClick={() => removeGallery(i)}
                      className="absolute top-2 right-2 p-1 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/50 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="h-28 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800">
                      <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Image URL</label>
                      <input
                        type="text"
                        value={img.url}
                        onChange={(e) => updateGallery(i, 'url', e.target.value)}
                        className="w-full px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-2xs"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Caption</label>
                      <input
                        type="text"
                        value={img.caption}
                        onChange={(e) => updateGallery(i, 'caption', e.target.value)}
                        className="w-full px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-2xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. Research & Achievements */}
          {activeTab === 'research' && (
            <div className="space-y-6">
              {/* Research */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-500" /> Research Projects & Focus Areas
                  </h4>
                  <button
                    type="button"
                    onClick={() => addListItem('research')}
                    className="px-2.5 py-1 bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-300 hover:bg-purple-100 rounded-lg font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Add Research
                  </button>
                </div>

                {(formData.research || []).map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleListChange('research', i, e.target.value)}
                      placeholder={`Research area #${i + 1}`}
                      className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => removeListItem('research', i)}
                      className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <hr className="border-slate-200 dark:border-slate-800" />

              {/* Achievements */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-500" /> Departmental Achievements & Awards
                  </h4>
                  <button
                    type="button"
                    onClick={() => addListItem('achievements')}
                    className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-100 rounded-lg font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Add Achievement
                  </button>
                </div>

                {(formData.achievements || []).map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleListChange('achievements', i, e.target.value)}
                      placeholder={`Achievement item #${i + 1}`}
                      className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => removeListItem('achievements', i)}
                      className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. Downloads */}
          {activeTab === 'downloads' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Downloadable Academic Materials</h4>
                  <p className="text-2xs text-slate-500">Syllabus PDFs, practical guides, case record worksheets, and charts.</p>
                </div>
                <button
                  type="button"
                  onClick={addDownloadItem}
                  className="px-3 py-1.5 bg-[#002147] text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Download
                </button>
              </div>

              {(formData.downloads || []).map((item, i) => (
                <div key={item.id || i} className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 relative">
                  <button
                    type="button"
                    onClick={() => removeDownload(i)}
                    className="absolute top-3 right-3 p-1 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/50 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Document Title</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateDownload(i, 'title', e.target.value)}
                      placeholder="e.g. BHMS Practical Lab Logbook Syllabus"
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">File URL</label>
                      <input
                        type="text"
                        value={item.url}
                        onChange={(e) => updateDownload(i, 'url', e.target.value)}
                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-2xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">File Type</label>
                      <input
                        type="text"
                        value={item.fileType}
                        onChange={(e) => updateDownload(i, 'fileType', e.target.value)}
                        placeholder="e.g. PDF Document"
                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-2xs"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">File Size</label>
                      <input
                        type="text"
                        value={item.fileSize}
                        onChange={(e) => updateDownload(i, 'fileSize', e.target.value)}
                        placeholder="e.g. 1.8 MB"
                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-2xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Form Actions Footer */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            {saveSuccess ? (
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                <Check className="w-4 h-4" /> Department CMS Saved Successfully!
              </div>
            ) : (
              <span className="text-2xs text-slate-400">All edits persist immediately in local CMS database.</span>
            )}

            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" onClick={onClose} className="text-xs">
                Cancel
              </Button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#002147] hover:bg-[#001530] text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" /> Save CMS Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
