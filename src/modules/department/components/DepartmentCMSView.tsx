import React, { useState } from 'react';
import { DepartmentCMSData } from '../../../types/departmentCms';
import { departmentCmsService } from '../../../services/departmentCmsService';
import { DepartmentCMSEditor } from './DepartmentCMSEditor';
import { Card } from '../../../components/common/Card';
import { useAuth } from '../../../contexts/AuthContext';
import { isFacultyUser, isAdmin, isSuperAdmin, isPrincipal, isHOD } from '../../../utils/permissionHelper';
import {
  BookOpen,
  FlaskConical,
  FileText,
  Users,
  Image as ImageIcon,
  Award,
  Download,
  Building2,
  Sparkles,
  Edit,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  UserCheck,
  Mail,
  Phone,
  FileDown,
  Lock,
  Layers,
  Sparkle
} from 'lucide-react';

interface DepartmentCMSViewProps {
  departmentId: string;
  onBackToList?: () => void;
}

export const DepartmentCMSView: React.FC<DepartmentCMSViewProps> = ({
  departmentId,
  onBackToList
}) => {
  const { user } = useAuth();
  const [deptData, setDeptData] = useState<DepartmentCMSData | undefined>(() =>
    departmentCmsService.getDepartmentById(departmentId)
  );

  React.useEffect(() => {
    const reload = () => {
      setDeptData(departmentCmsService.getDepartmentById(departmentId));
    };
    reload();
    window.addEventListener('bhmch_department_cms_updated', reload);
    return () => {
      window.removeEventListener('bhmch_department_cms_updated', reload);
    };
  }, [departmentId]);

  const [editorOpen, setEditorOpen] = useState(false);
  const [adminPreviewOverride, setAdminPreviewOverride] = useState(false);

  // Check role-based permission: Faculty/Admin/Principal/HOD can edit
  const isAuthorizedRole =
    isAdmin(user) ||
    isSuperAdmin(user) ||
    isFacultyUser(user) ||
    isPrincipal(user) ||
    isHOD(user);

  const canEdit = isAuthorizedRole || adminPreviewOverride;

  if (!deptData) {
    return (
      <div className="p-8 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 text-center space-y-3">
        <Building2 className="w-12 h-12 text-slate-400 mx-auto" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Department Not Found</h3>
        <p className="text-xs text-slate-500">The requested department data could not be located in the CMS database.</p>
        {onBackToList && (
          <button
            onClick={onBackToList}
            className="px-4 py-2 bg-[#002147] text-white text-xs font-bold rounded-xl"
          >
            Return to Departments
          </button>
        )}
      </div>
    );
  }

  const handleSaveCMS = (updated: DepartmentCMSData) => {
    const saved = departmentCmsService.saveDepartment(updated, user?.fullName || 'Faculty/Admin User');
    setDeptData(saved);
  };

  return (
    <div className="space-y-10">
      {/* Top CMS Header & Role Access Bar */}
      <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          {onBackToList && (
            <button
              onClick={onBackToList}
              className="px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              ← Back to All Departments
            </button>
          )}
          <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold rounded-lg uppercase tracking-wider text-[10px]">
            {deptData.code}
          </span>
          <span className="text-slate-500 font-medium">CMS Status: Active & Editable</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Toggle Admin Edit Mode Preview for Testing */}
          <button
            onClick={() => setAdminPreviewOverride(!adminPreviewOverride)}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer text-xs ${
              canEdit
                ? 'bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{canEdit ? 'Admin Edit Allowed' : 'Student View Only (Click to Edit)'}</span>
          </button>

          {canEdit ? (
            <button
              onClick={() => setEditorOpen(true)}
              className="px-4 py-2 bg-[#002147] hover:bg-[#001530] text-white font-extrabold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <Edit className="w-4 h-4 text-emerald-400" />
              <span>Edit Department CMS</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-slate-500 font-semibold px-3 py-1.5 bg-slate-200/60 dark:bg-slate-800/60 rounded-xl">
              <Lock className="w-3.5 h-3.5" />
              <span>Student / Public Read-Only</span>
            </div>
          )}
        </div>
      </div>

      {/* 1. BANNER & DEPARTMENT NAME */}
      <div className="rounded-3xl bg-[#002147] text-white p-8 sm:p-12 shadow-xl space-y-4 relative overflow-hidden">
        {deptData.banner.bgImageUrl && (
          <div className="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none">
            <img src={deptData.banner.bgImageUrl} alt="Department Banner Background" className="w-full h-full object-cover" />
          </div>
        )}

        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-black rounded-full uppercase tracking-wider border border-emerald-500/30">
              {deptData.banner.badge || 'NCH Recognized Faculty'}
            </span>
            {deptData.yearsCovered && (
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-bold rounded-full border border-blue-500/30">
                Scope: {deptData.yearsCovered}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            {deptData.banner.title || deptData.name}
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            {deptData.banner.subtitle}
          </p>

          {deptData.hod && (
            <div className="pt-2 flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <UserCheck className="w-4 h-4" />
              <span>Head of Department: {deptData.hod}</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. DESCRIPTION / OVERVIEW */}
      <Card className="p-6 sm:p-8 space-y-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="space-y-1">
          <span className="text-2xs font-black uppercase tracking-wider text-emerald-600">Department Overview</span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            About {deptData.name}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal whitespace-pre-line">
          {deptData.description}
        </p>
      </Card>

      {/* 3 & 4 & 5. METHODOLOGY, PRACTICAL & TEACHING AIDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Methodology */}
        <Card className="p-6 space-y-4 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Teaching & Methodology</h3>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {(deptData.methodology || []).map((m, i) => (
                <li key={i} className="flex items-start gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                  <span className="text-emerald-500 font-black">•</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        {/* Practical Training */}
        <Card className="p-6 space-y-4 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600">
              <FlaskConical className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Practical & Clinical Exposure</h3>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {(deptData.practical || []).map((p, i) => (
                <li key={i} className="flex items-start gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                  <span className="text-blue-500 font-black">•</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        {/* Teaching Aids */}
        <Card className="p-6 space-y-4 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950 flex items-center justify-center text-amber-600">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Teaching Aids & Resources</h3>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {(deptData.teachingAids || []).map((ta, i) => (
                <li key={i} className="flex items-start gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                  <span className="text-amber-500 font-black">•</span>
                  <span>{ta}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      {/* 6. FACULTY LIST */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xs font-black uppercase tracking-wider text-emerald-600">Academic Roster</span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-emerald-600" />
              Department Faculty Members
            </h2>
          </div>
          <span className="text-xs font-extrabold text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
            {(deptData.facultyList || []).length} Official Faculty
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(deptData.facultyList || []).map((faculty) => (
            <Card key={faculty.id} className="p-5 border border-slate-200/80 dark:border-slate-800 hover:shadow-md transition space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#002147] text-white flex items-center justify-center font-black text-sm shrink-0">
                  {faculty.name.replace(/^(Dr\.|Prof\.|Mr\.|Mrs\.)\s*/i, '').charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{faculty.name}</h4>
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{faculty.designation}</p>
                  <p className="text-2xs text-slate-500 font-medium">{faculty.qualification}</p>
                </div>
              </div>

              {faculty.specialization && (
                <p className="text-2xs bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                  <strong className="text-slate-800 dark:text-slate-200">Specialization:</strong> {faculty.specialization}
                </p>
              )}

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1 text-2xs text-slate-500">
                {faculty.email && (
                  <div className="flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{faculty.email}</span>
                  </div>
                )}
                {faculty.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{faculty.phone}</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 7. GALLERY */}
      {deptData.gallery && deptData.gallery.length > 0 && (
        <div className="space-y-4">
          <div>
            <span className="text-2xs font-black uppercase tracking-wider text-emerald-600">Visual Archives</span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <ImageIcon className="w-6 h-6 text-blue-600" />
              Department Gallery & Facilities
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {deptData.gallery.map((img) => (
              <Card key={img.id} className="p-3 border border-slate-200/80 dark:border-slate-800 overflow-hidden space-y-2 group">
                <div className="h-48 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 relative">
                  <img
                    src={img.url}
                    alt={img.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  {img.category && (
                    <span className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md backdrop-blur-xs">
                      {img.category}
                    </span>
                  )}
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 px-1 leading-snug">
                  {img.caption}
                </p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 8 & 9. RESEARCH & ACHIEVEMENTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Research */}
        <Card className="p-6 space-y-4 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
            <Sparkles className="w-5 h-5" />
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Research Projects & Focus Areas</h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            {(deptData.research || []).map((r, i) => (
              <li key={i} className="p-3 bg-purple-50/50 dark:bg-purple-950/30 rounded-xl border border-purple-100 dark:border-purple-900/50 font-medium">
                " {r} "
              </li>
            ))}
          </ul>
        </Card>

        {/* Achievements */}
        <Card className="p-6 space-y-4 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <Award className="w-5 h-5" />
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Departmental Achievements & Recognitions</h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            {(deptData.achievements || []).map((a, i) => (
              <li key={i} className="p-3 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-xl border border-emerald-100 dark:border-emerald-900/50 font-semibold text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* 10. DOWNLOADS */}
      <Card className="p-6 sm:p-8 space-y-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xs font-black uppercase tracking-wider text-emerald-600">Syllabus & Course Material</span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Download className="w-6 h-6 text-blue-600" />
              Downloadable Academic Materials
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(deptData.downloads || []).map((dl) => (
            <div
              key={dl.id}
              className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 hover:border-blue-400 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                  <FileDown className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{dl.title}</h4>
                  <p className="text-2xs text-slate-500 mt-0.5">
                    {dl.fileType} • {dl.fileSize} {dl.uploadDate && `• Uploaded: ${dl.uploadDate}`}
                  </p>
                </div>
              </div>

              <a
                href={dl.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-[#002147] hover:bg-[#001530] text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1 shrink-0"
              >
                <span>Download</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </Card>

      {/* CMS Modal Editor */}
      {editorOpen && (
        <DepartmentCMSEditor
          department={deptData}
          isOpen={editorOpen}
          onClose={() => setEditorOpen(false)}
          onSave={handleSaveCMS}
        />
      )}
    </div>
  );
};
