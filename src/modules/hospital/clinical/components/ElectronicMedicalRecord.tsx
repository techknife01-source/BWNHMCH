import React, { useState } from 'react';
import { Card } from '../../../../components/common/Card';
import { Badge } from '../../../../components/common/Badge';
import { Input } from '../../../../components/common/Input';
import { Select } from '../../../../components/common/Select';
import { Textarea } from '../../../../components/common/Textarea';
import { Button } from '../../../../components/common/Button';
import { Modal } from '../../../../components/common/Modal';
import { hospitalClinicalService } from '../../../../services/hospitalClinicalService';
import { hospitalCoreService } from '../../../../services/hospitalCoreService';
import {
  IpdAdmission,
  ClinicalNote,
  PrescriptionRecord,
  PrescriptionItem,
  TreatmentPlan,
  NursingNote,
  VitalSignRecord,
  InvestigationRequest,
  PatientMedicalProfile,
  TimelineEvent,
  AllergyInfo,
} from '../../../../types/clinical';
import {
  FileText,
  Clock,
  Activity,
  Stethoscope,
  Pill,
  ClipboardList,
  HeartPulse,
  FlaskConical,
  History,
  AlertTriangle,
  Plus,
  CheckCircle2,
  Calendar,
  UserCheck,
  Bed,
  Layers,
  Thermometer,
  ShieldAlert,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ElectronicMedicalRecordProps {
  initialIpdNo?: string;
}

export const ElectronicMedicalRecord: React.FC<ElectronicMedicalRecordProps> = ({
  initialIpdNo,
}) => {
  const admissions = hospitalClinicalService.getAdmissions();
  const doctors = hospitalCoreService.getDoctors();

  const [selectedIpdNo, setSelectedIpdNo] = useState<string>(
    initialIpdNo || admissions[0]?.ipdNo || 'IPD-2026-0001'
  );

  const [activeTab, setActiveTab] = useState<
    | 'timeline'
    | 'notes'
    | 'diagnosis'
    | 'prescription'
    | 'treatment'
    | 'vitals_nursing'
    | 'investigations'
    | 'history_allergies'
  >('timeline');

  const currentAdmission = hospitalClinicalService.getAdmissionByIpdNo(selectedIpdNo) || admissions[0];

  // Forms State
  // 1. Clinical Note Form
  const [noteForm, setNoteForm] = useState({
    noteType: 'Daily Ward Round' as const,
    subjectiveSymptoms: '',
    objectiveFindings: '',
    assessment: '',
    plan: '',
  });

  // 2. Prescription Builder
  const [rxRemedies, setRxRemedies] = useState<Omit<PrescriptionItem, 'id'>[]>([
    {
      remedyName: 'Arsenicum Album',
      potency: '30C',
      dosage: 'TDS (3 Times Daily)',
      repetitionDays: '3 Days',
      vehicle: 'Globules No. 20',
      instructions: 'Take 4 globules on empty stomach',
    },
  ]);
  const [rxAdvice, setRxAdvice] = useState({
    auxiliaryAdvice: 'Keep patient warm, avoid direct cold airflow or cold drinks.',
    dietaryRegimen: 'Warm sago, non-spicy vegetable broth, distilled water.',
  });

  // 3. Treatment Plan Form
  const currentPlan = currentAdmission ? hospitalClinicalService.getTreatmentPlan(currentAdmission.ipdNo) : undefined;
  const [tpForm, setTpForm] = useState({
    miasmaticDiagnosis: currentPlan?.miasmaticDiagnosis || currentAdmission?.miasmaticDiagnosis || 'Psora',
    potencyProgressionStrategy: currentPlan?.potencyProgressionStrategy || 'Start 30C Centesimal, scale to 200C upon improvement.',
    dietaryRegimen: currentPlan?.dietaryRegimen || 'Light homoeopathic diet, avoid camphor, mint, and raw onions.',
    lifestyleAdvice: currentPlan?.lifestyleAdvice || 'Adequate rest, room aeration, warm compress for joints.',
    repertorialBasis: currentPlan?.repertorialBasis || 'Kent Repertory: Mind restlessness + Physical Chilliness.',
    targetOutcomeDays: currentPlan?.targetOutcomeDays || 7,
  });

  // 4. Vitals Form
  const [vitalForm, setVitalForm] = useState({
    bpSystolic: 120,
    bpDiastolic: 80,
    pulseRate: 76,
    temperatureF: 98.4,
    spO2: 98,
    respRate: 18,
    bloodSugarMgDl: 105,
    recordedBy: 'Sr. Nurse Sima Das',
  });

  // 5. Nursing Note Form
  const [nursingForm, setNursingForm] = useState({
    shift: 'Morning Shift (7 AM - 3 PM)' as const,
    careGiven: '',
    medicationAdministered: '',
    patientCondition: 'Stable' as const,
    nurseName: 'Duty Nurse',
  });

  // 6. Investigation Request Form
  const [invForm, setInvForm] = useState({
    testCategory: 'Haematology' as const,
    testsRequested: 'Complete Blood Count (CBC), ESR',
    urgency: 'Routine' as const,
    requestedBy: currentAdmission?.admittingDoctorName || 'Duty Doctor',
  });

  // 7. Medical Profile & Allergy Form
  const currentProfile = currentAdmission ? hospitalClinicalService.getMedicalProfile(currentAdmission.uhid) : null;
  const [profileForm, setProfileForm] = useState<PatientMedicalProfile>(
    currentProfile || {
      uhid: currentAdmission?.uhid || '',
      chiefComplaints: '',
      hpi: '',
      pastMedicalHistory: '',
      familyHistory: '',
      personalHistory: '',
      thermalPreference: 'Chilly Patient',
      miasmaticBackground: 'Psoric',
      allergies: [],
    }
  );

  const [newAllergen, setNewAllergen] = useState({
    allergen: '',
    category: 'Drug / Remedy' as const,
    severity: 'Moderate' as const,
    reaction: '',
  });

  if (!currentAdmission) {
    return (
      <Card className="p-8 text-center text-slate-500">
        <p className="text-sm italic">No active IPD patient records found.</p>
      </Card>
    );
  }

  const timelineEvents = hospitalClinicalService.getTimeline(currentAdmission.ipdNo);
  const clinicalNotes = hospitalClinicalService.getClinicalNotes(currentAdmission.ipdNo);
  const prescriptions = hospitalClinicalService.getPrescriptions(currentAdmission.ipdNo);
  const nursingNotes = hospitalClinicalService.getNursingNotes(currentAdmission.ipdNo);
  const vitalsHistory = hospitalClinicalService.getVitals(currentAdmission.ipdNo);
  const investigations = hospitalClinicalService.getInvestigations(currentAdmission.ipdNo);
  const medicalProfile = hospitalClinicalService.getMedicalProfile(currentAdmission.uhid);

  // Submit Handlers
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    hospitalClinicalService.addClinicalNote({
      ipdNo: currentAdmission.ipdNo,
      uhid: currentAdmission.uhid,
      doctorId: currentAdmission.admittingDoctorId,
      doctorName: currentAdmission.admittingDoctorName,
      noteType: noteForm.noteType,
      subjectiveSymptoms: noteForm.subjectiveSymptoms,
      objectiveFindings: noteForm.objectiveFindings,
      assessment: noteForm.assessment,
      plan: noteForm.plan,
    });
    toast.success('Clinical Note Recorded!');
    setNoteForm({ noteType: 'Daily Ward Round', subjectiveSymptoms: '', objectiveFindings: '', assessment: '', plan: '' });
  };

  const handleAddRemedyRow = () => {
    setRxRemedies([
      ...rxRemedies,
      {
        remedyName: 'Sac Lac (Sugar of Milk)',
        potency: '30C',
        dosage: 'BD (Twice Daily)',
        repetitionDays: '3 Days',
        vehicle: 'Sugar of Milk (Sac Lac)',
        instructions: 'Take after food',
      },
    ]);
  };

  const handleRemoveRemedyRow = (index: number) => {
    setRxRemedies(rxRemedies.filter((_, i) => i !== index));
  };

  const handleSavePrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (rxRemedies.length === 0) {
      toast.error('Add at least one remedy to prescription.');
      return;
    }

    hospitalClinicalService.addPrescription({
      ipdNo: currentAdmission.ipdNo,
      uhid: currentAdmission.uhid,
      patientName: currentAdmission.patientName,
      doctorName: currentAdmission.admittingDoctorName,
      remedies: rxRemedies.map((r, i) => ({ ...r, id: `rxi-${Date.now()}-${i}` })),
      auxiliaryAdvice: rxAdvice.auxiliaryAdvice,
      dietaryRegimen: rxAdvice.dietaryRegimen,
    });

    toast.success('Homoeopathic Prescription Saved & Sent to Pharmacy!');
  };

  const handleSaveTreatmentPlan = (e: React.FormEvent) => {
    e.preventDefault();
    hospitalClinicalService.saveTreatmentPlan({
      ipdNo: currentAdmission.ipdNo,
      uhid: currentAdmission.uhid,
      patientName: currentAdmission.patientName,
      miasmaticDiagnosis: tpForm.miasmaticDiagnosis,
      potencyProgressionStrategy: tpForm.potencyProgressionStrategy,
      dietaryRegimen: tpForm.dietaryRegimen,
      lifestyleAdvice: tpForm.lifestyleAdvice,
      repertorialBasis: tpForm.repertorialBasis,
      targetOutcomeDays: Number(tpForm.targetOutcomeDays) || 7,
    });
    toast.success('Homoeopathic Treatment Plan Updated!');
  };

  const handleAddVitals = (e: React.FormEvent) => {
    e.preventDefault();
    hospitalClinicalService.addVitalSign({
      ipdNo: currentAdmission.ipdNo,
      uhid: currentAdmission.uhid,
      bpSystolic: Number(vitalForm.bpSystolic),
      bpDiastolic: Number(vitalForm.bpDiastolic),
      pulseRate: Number(vitalForm.pulseRate),
      temperatureF: Number(vitalForm.temperatureF),
      spO2: Number(vitalForm.spO2),
      respRate: Number(vitalForm.respRate),
      bloodSugarMgDl: Number(vitalForm.bloodSugarMgDl) || undefined,
      recordedBy: vitalForm.recordedBy,
    });
    toast.success('Vital Signs Recorded!');
  };

  const handleAddNursingNote = (e: React.FormEvent) => {
    e.preventDefault();
    hospitalClinicalService.addNursingNote({
      ipdNo: currentAdmission.ipdNo,
      uhid: currentAdmission.uhid,
      nurseName: nursingForm.nurseName,
      shift: nursingForm.shift,
      careGiven: nursingForm.careGiven,
      medicationAdministered: nursingForm.medicationAdministered,
      patientCondition: nursingForm.patientCondition,
    });
    toast.success('Nursing Shift Note Saved!');
    setNursingForm({ ...nursingForm, careGiven: '', medicationAdministered: '' });
  };

  const handleAddInvestigation = (e: React.FormEvent) => {
    e.preventDefault();
    const testsArray = invForm.testsRequested.split(',').map((s) => s.trim()).filter(Boolean);
    hospitalClinicalService.addInvestigationRequest({
      ipdNo: currentAdmission.ipdNo,
      uhid: currentAdmission.uhid,
      patientName: currentAdmission.patientName,
      requestedBy: invForm.requestedBy,
      testCategory: invForm.testCategory,
      testsRequested: testsArray,
      urgency: invForm.urgency,
    });
    toast.success('Lab Investigation Requisition Submitted!');
    setInvForm({ ...invForm, testsRequested: '' });
  };

  const handleAddAllergy = () => {
    if (!newAllergen.allergen) return;
    const updatedAllergies: AllergyInfo[] = [
      ...medicalProfile.allergies,
      { ...newAllergen, id: `alg-${Date.now()}` },
    ];
    const updated = { ...medicalProfile, allergies: updatedAllergies };
    hospitalClinicalService.saveMedicalProfile(updated);
    setNewAllergen({ allergen: '', category: 'Drug / Remedy', severity: 'Moderate', reaction: '' });
    toast.success('Allergy recorded.');
  };

  const handleSaveMedicalHistory = (e: React.FormEvent) => {
    e.preventDefault();
    hospitalClinicalService.saveMedicalProfile(profileForm);
    toast.success('Patient Case History Updated!');
  };

  return (
    <div className="space-y-6">
      {/* Top Patient Search Bar */}
      <Card className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            <span>Electronic Medical Record (EMR) & Clinical Workstation</span>
          </h2>
          <p className="text-xs text-slate-500">
            Homoeopathic Case History, Daily Rounds, Miasms, Prescriptions, Vitals & Timeline
          </p>
        </div>

        <Select
          label="Active IPD Patient Selection"
          options={admissions.map((a) => ({
            value: a.ipdNo,
            label: `${a.patientName} (${a.ipdNo} • ${a.wardName} ${a.bedNo})`,
          }))}
          value={selectedIpdNo}
          onChange={(e) => setSelectedIpdNo(e.target.value)}
          className="w-72"
        />
      </Card>

      {/* Patient Clinical Banner */}
      <Card className="p-5 bg-gradient-to-r from-[#002147] to-slate-900 text-white space-y-4 shadow-lg relative overflow-hidden">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-700/80 pb-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center font-black text-xl text-blue-300 shrink-0">
              {currentAdmission.patientName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-lg text-white">{currentAdmission.patientName}</h3>
                <span className="text-xs px-2 py-0.5 rounded bg-blue-500/30 text-blue-200 font-bold font-mono">
                  {currentAdmission.ipdNo}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-200 font-bold font-mono">
                  UHID: {currentAdmission.uhid}
                </span>
                <Badge variant="accent">{currentAdmission.status}</Badge>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {currentAdmission.gender}, {currentAdmission.age} Yrs • Blood Group: <span className="font-bold text-rose-300">{currentAdmission.bloodGroup}</span> • Attendant: {currentAdmission.attendantName} ({currentAdmission.attendantPhone})
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Ward & Bed</p>
              <p className="font-extrabold text-emerald-400">{currentAdmission.wardName} • {currentAdmission.bedNo}</p>
            </div>

            <div className="px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Admitting Doctor</p>
              <p className="font-bold text-blue-300">{currentAdmission.admittingDoctorName}</p>
            </div>

            <div className="px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Miasmatic Diagnosis</p>
              <p className="font-bold text-amber-300">{currentAdmission.miasmaticDiagnosis}</p>
            </div>
          </div>
        </div>

        {/* Diagnosis & Allergy Quick Strip */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-400">Primary Diagnosis:</span>
            <span className="font-semibold text-slate-100 italic bg-white/10 px-2 py-1 rounded-lg">
              {currentAdmission.primaryDiagnosis}
            </span>
          </div>

          {medicalProfile.allergies.length > 0 && (
            <div className="flex items-center space-x-1 text-rose-300 bg-rose-950/50 border border-rose-800/50 px-2.5 py-1 rounded-lg">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
              <span className="font-bold">Known Allergies:</span>
              <span className="text-[11px]">
                {medicalProfile.allergies.map((a) => `${a.allergen} (${a.severity})`).join(', ')}
              </span>
            </div>
          )}
        </div>
      </Card>

      {/* Workstation Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('timeline')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'timeline'
              ? 'bg-[#002147] text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Patient Timeline</span>
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'notes'
              ? 'bg-[#002147] text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
          }`}
        >
          <Stethoscope className="w-3.5 h-3.5 text-blue-400" />
          <span>Clinical Notes & Rounds</span>
        </button>

        <button
          onClick={() => setActiveTab('prescription')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'prescription'
              ? 'bg-[#002147] text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
          }`}
        >
          <Pill className="w-3.5 h-3.5 text-emerald-400" />
          <span>Homoeopathic Prescription</span>
        </button>

        <button
          onClick={() => setActiveTab('treatment')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'treatment'
              ? 'bg-[#002147] text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          <span>Treatment Plan</span>
        </button>

        <button
          onClick={() => setActiveTab('vitals_nursing')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'vitals_nursing'
              ? 'bg-[#002147] text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
          }`}
        >
          <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
          <span>Vitals & Nursing Notes</span>
        </button>

        <button
          onClick={() => setActiveTab('investigations')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'investigations'
              ? 'bg-[#002147] text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
          }`}
        >
          <FlaskConical className="w-3.5 h-3.5 text-cyan-400" />
          <span>Investigations ({investigations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history_allergies')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'history_allergies'
              ? 'bg-[#002147] text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
          }`}
        >
          <ClipboardList className="w-3.5 h-3.5" />
          <span>Case History & Allergies</span>
        </button>
      </div>

      {/* Tab Panes */}
      {/* 1. Patient Timeline */}
      {activeTab === 'timeline' && (
        <Card className="p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <History className="w-4 h-4 text-blue-600" />
              <span>Chronological Patient Clinical Care Timeline</span>
            </h3>
            <Badge variant="primary">{timelineEvents.length} Clinical Milestones</Badge>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
            {timelineEvents.map((ev) => (
              <div key={ev.id} className="relative group">
                <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                  •
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex justify-between items-start">
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white">{ev.title}</span>
                    <span className="text-[10px] font-bold text-slate-400">{ev.timestamp}</span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300">{ev.description}</p>
                  <p className="text-[10px] text-slate-400 font-semibold pt-1">Logged by: {ev.performerName}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 2. Clinical Notes & Ward Rounds */}
      {activeTab === 'notes' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Note Logger */}
          <Card className="p-5 space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Record Ward Round / Consultant Note</h3>
              <p className="text-xs text-slate-500">Document SOAP (Subjective, Objective, Assessment, Plan)</p>
            </div>

            <form onSubmit={handleAddNote} className="space-y-3 text-xs">
              <Select
                label="Note Type *"
                options={[
                  { value: 'Daily Ward Round', label: 'Daily Doctor Ward Round' },
                  { value: 'Consultant Note', label: 'HOD / Senior Consultant Review' },
                  { value: 'Initial Case History', label: 'Initial IPD Case History' },
                  { value: 'Emergency Note', label: 'Emergency Night Note' },
                ]}
                value={noteForm.noteType}
                onChange={(e) => setNoteForm({ ...noteForm, noteType: e.target.value as any })}
              />

              <Textarea
                label="Subjective Symptoms & Modalities *"
                placeholder="Chief complaints today, modalities (aggravation/amelioration), desires, mental state..."
                rows={3}
                value={noteForm.subjectiveSymptoms}
                onChange={(e) => setNoteForm({ ...noteForm, subjectiveSymptoms: e.target.value })}
                required
              />

              <Textarea
                label="Objective Physical Findings & Systemic Exam *"
                placeholder="Lung auscultation, tongue, pulse, abdominal palpation, edema..."
                rows={3}
                value={noteForm.objectiveFindings}
                onChange={(e) => setNoteForm({ ...noteForm, objectiveFindings: e.target.value })}
                required
              />

              <Textarea
                label="Miasmatic Assessment & Progress *"
                placeholder="Evaluating response to remedy, miasmatic direction of cure..."
                rows={2}
                value={noteForm.assessment}
                onChange={(e) => setNoteForm({ ...noteForm, assessment: e.target.value })}
                required
              />

              <Textarea
                label="Therapeutic Plan / Remedy Adjustment *"
                placeholder="Continue remedy, change potency, repeat Sac Lac, or auxiliary care..."
                rows={2}
                value={noteForm.plan}
                onChange={(e) => setNoteForm({ ...noteForm, plan: e.target.value })}
                required
              />

              <div className="flex justify-end pt-2">
                <Button variant="primary" type="submit">
                  Save Clinical Note
                </Button>
              </div>
            </form>
          </Card>

          {/* Historical Clinical Notes */}
          <Card className="p-5 space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Ward Round Progress History</h3>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {clinicalNotes.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No ward round notes logged yet.</p>
              ) : (
                clinicalNotes.map((note) => (
                  <div key={note.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between items-start">
                      <span className="font-extrabold text-[#002147] dark:text-blue-400">{note.noteType}</span>
                      <span className="text-[10px] text-slate-400">{note.timestamp}</span>
                    </div>

                    <div className="space-y-1 text-slate-700 dark:text-slate-300">
                      <p><span className="font-bold text-slate-900 dark:text-white">S:</span> {note.subjectiveSymptoms}</p>
                      <p><span className="font-bold text-slate-900 dark:text-white">O:</span> {note.objectiveFindings}</p>
                      <p><span className="font-bold text-slate-900 dark:text-white">A:</span> {note.assessment}</p>
                      <p><span className="font-bold text-slate-900 dark:text-white">P:</span> {note.plan}</p>
                    </div>

                    <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800 font-semibold">
                      Recorded by: {note.doctorName}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      )}

      {/* 3. Homoeopathic Prescription UI */}
      {activeTab === 'prescription' && (
        <Card className="p-5 space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Pill className="w-5 h-5 text-emerald-600" />
                <span>Homoeopathic Remedy Prescription Builder</span>
              </h3>
              <p className="text-xs text-slate-500">Select remedies, centesimal/LM potencies, dose frequency, and vehicle</p>
            </div>

            <Button variant="secondary" onClick={handleAddRemedyRow} className="text-xs flex items-center gap-1">
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>Add Remedy Row</span>
            </Button>
          </div>

          <form onSubmit={handleSavePrescription} className="space-y-6 text-xs">
            {/* Remedies List */}
            <div className="space-y-4">
              {rxRemedies.map((remedy, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 relative">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-xs text-[#002147] dark:text-blue-400">
                      Remedy #{idx + 1}
                    </span>
                    {rxRemedies.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveRemedyRow(idx)}
                        className="text-rose-500 hover:text-rose-700 font-bold text-[11px] cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    <Input
                      label="Homoeopathic Remedy Name *"
                      placeholder="e.g. Arsenicum Album"
                      value={remedy.remedyName}
                      onChange={(e) => {
                        const updated = [...rxRemedies];
                        updated[idx].remedyName = e.target.value;
                        setRxRemedies(updated);
                      }}
                      required
                    />

                    <Select
                      label="Potency Scale *"
                      options={[
                        { value: '30C', label: '30C (Centesimal)' },
                        { value: '200C', label: '200C (Centesimal)' },
                        { value: '1M', label: '1M (1000C)' },
                        { value: '10M', label: '10M' },
                        { value: '50M', label: '50M' },
                        { value: 'CM', label: 'CM' },
                        { value: '6C', label: '6C' },
                        { value: '3C', label: '3C' },
                        { value: 'Q (Mother Tincture)', label: 'Q (Mother Tincture)' },
                        { value: 'LM1', label: 'LM1 (50-Millesimal)' },
                        { value: 'LM2', label: 'LM2 (50-Millesimal)' },
                      ]}
                      value={remedy.potency}
                      onChange={(e) => {
                        const updated = [...rxRemedies];
                        updated[idx].potency = e.target.value as any;
                        setRxRemedies(updated);
                      }}
                    />

                    <Select
                      label="Dosage Frequency *"
                      options={[
                        { value: 'TDS (3 Times Daily)', label: 'TDS (3 Times Daily)' },
                        { value: 'BD (Twice Daily)', label: 'BD (Twice Daily)' },
                        { value: '1 Dose Daily', label: '1 Dose Daily' },
                        { value: 'QID (4 Times Daily)', label: 'QID (4 Times Daily)' },
                        { value: 'Single Dose Stat', label: 'Single Dose Stat' },
                        { value: 'SOS (As Needed)', label: 'SOS (As Needed)' },
                      ]}
                      value={remedy.dosage}
                      onChange={(e) => {
                        const updated = [...rxRemedies];
                        updated[idx].dosage = e.target.value as any;
                        setRxRemedies(updated);
                      }}
                    />

                    <Select
                      label="Vehicle / Media *"
                      options={[
                        { value: 'Globules No. 20', label: 'Globules No. 20' },
                        { value: 'Sugar of Milk (Sac Lac)', label: 'Sugar of Milk (Sac Lac)' },
                        { value: 'Distilled Water Liquid', label: 'Distilled Water Liquid' },
                        { value: 'Mother Tincture Drop', label: 'Mother Tincture Drop' },
                        { value: 'Ointment', label: 'Ointment / External' },
                      ]}
                      value={remedy.vehicle}
                      onChange={(e) => {
                        const updated = [...rxRemedies];
                        updated[idx].vehicle = e.target.value as any;
                        setRxRemedies(updated);
                      }}
                    />

                    <Input
                      label="Duration / Repetition"
                      placeholder="e.g. 3 Days"
                      value={remedy.repetitionDays}
                      onChange={(e) => {
                        const updated = [...rxRemedies];
                        updated[idx].repetitionDays = e.target.value;
                        setRxRemedies(updated);
                      }}
                    />

                    <Input
                      label="Special Instructions"
                      placeholder="e.g. Empty stomach morning"
                      value={remedy.instructions}
                      onChange={(e) => {
                        const updated = [...rxRemedies];
                        updated[idx].instructions = e.target.value;
                        setRxRemedies(updated);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Regimen & Auxiliary Advice */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <Textarea
                label="Dietary Regimen & Restrictions"
                rows={2}
                value={rxAdvice.dietaryRegimen}
                onChange={(e) => setRxAdvice({ ...rxAdvice, dietaryRegimen: e.target.value })}
              />

              <Textarea
                label="Auxiliary / Nursing Care Instructions"
                rows={2}
                value={rxAdvice.auxiliaryAdvice}
                onChange={(e) => setRxAdvice({ ...rxAdvice, auxiliaryAdvice: e.target.value })}
              />
            </div>

            <div className="flex justify-end">
              <Button variant="primary" type="submit" className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Issue Homoeopathic Prescription</span>
              </Button>
            </div>
          </form>

          {/* Active Prescription History */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">Issued Prescriptions History</h4>
            {prescriptions.map((rx) => (
              <div key={rx.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span className="font-bold text-slate-800 dark:text-slate-200">Prescribed by {rx.doctorName}</span>
                  <span className="text-[10px] text-slate-400">{rx.timestamp}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {rx.remedies.map((r, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-0.5">
                      <p className="font-extrabold text-[#002147] dark:text-blue-400">{r.remedyName} <span className="text-emerald-600 font-bold">({r.potency})</span></p>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">{r.dosage} • {r.vehicle} • {r.repetitionDays}</p>
                      <p className="text-[10px] text-slate-400 italic">{r.instructions}</p>
                    </div>
                  ))}
                </div>

                <div className="p-2 bg-amber-50 dark:bg-amber-950/20 rounded-lg text-[11px] text-amber-900 dark:text-amber-200">
                  <p><span className="font-bold">Diet & Regimen:</span> {rx.dietaryRegimen}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 4. Treatment Plan */}
      {activeTab === 'treatment' && (
        <Card className="p-5 space-y-4 max-w-3xl">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Homoeopathic Constitutional Treatment Plan</h3>
            <p className="text-xs text-slate-500">Miasmatic strategy, potency progression, repertorial analysis basis</p>
          </div>

          <form onSubmit={handleSaveTreatmentPlan} className="space-y-4 text-xs">
            <Input
              label="Miasmatic Diagnosis Basis *"
              value={tpForm.miasmaticDiagnosis}
              onChange={(e) => setTpForm({ ...tpForm, miasmaticDiagnosis: e.target.value })}
            />

            <Textarea
              label="Potency Progression Strategy *"
              rows={2}
              value={tpForm.potencyProgressionStrategy}
              onChange={(e) => setTpForm({ ...tpForm, potencyProgressionStrategy: e.target.value })}
            />

            <Textarea
              label="Repertorial Basis & Key Symptoms *"
              rows={2}
              value={tpForm.repertorialBasis}
              onChange={(e) => setTpForm({ ...tpForm, repertorialBasis: e.target.value })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Textarea
                label="Dietary Regimen"
                rows={2}
                value={tpForm.dietaryRegimen}
                onChange={(e) => setTpForm({ ...tpForm, dietaryRegimen: e.target.value })}
              />

              <Textarea
                label="Lifestyle & Auxiliary Advice"
                rows={2}
                value={tpForm.lifestyleAdvice}
                onChange={(e) => setTpForm({ ...tpForm, lifestyleAdvice: e.target.value })}
              />
            </div>

            <Input
              label="Target Outcome Hospital Days *"
              type="number"
              value={tpForm.targetOutcomeDays}
              onChange={(e) => setTpForm({ ...tpForm, targetOutcomeDays: Number(e.target.value) })}
            />

            <div className="flex justify-end pt-2">
              <Button variant="primary" type="submit">
                Save Treatment Plan
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* 5. Vitals & Nursing Notes */}
      {activeTab === 'vitals_nursing' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Vitals Section */}
          <Card className="p-5 space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-rose-500" />
                <span>Log Vital Signs</span>
              </h3>
            </div>

            <form onSubmit={handleAddVitals} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="BP Systolic (mmHg)"
                  type="number"
                  value={vitalForm.bpSystolic}
                  onChange={(e) => setVitalForm({ ...vitalForm, bpSystolic: Number(e.target.value) })}
                />
                <Input
                  label="BP Diastolic (mmHg)"
                  type="number"
                  value={vitalForm.bpDiastolic}
                  onChange={(e) => setVitalForm({ ...vitalForm, bpDiastolic: Number(e.target.value) })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Pulse Rate (/min)"
                  type="number"
                  value={vitalForm.pulseRate}
                  onChange={(e) => setVitalForm({ ...vitalForm, pulseRate: Number(e.target.value) })}
                />
                <Input
                  label="Temperature (°F)"
                  type="number"
                  step="0.1"
                  value={vitalForm.temperatureF}
                  onChange={(e) => setVitalForm({ ...vitalForm, temperatureF: Number(e.target.value) })}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Input
                  label="SpO2 (%)"
                  type="number"
                  value={vitalForm.spO2}
                  onChange={(e) => setVitalForm({ ...vitalForm, spO2: Number(e.target.value) })}
                />
                <Input
                  label="Resp Rate (/min)"
                  type="number"
                  value={vitalForm.respRate}
                  onChange={(e) => setVitalForm({ ...vitalForm, respRate: Number(e.target.value) })}
                />
                <Input
                  label="Blood Sugar (mg/dL)"
                  type="number"
                  value={vitalForm.bloodSugarMgDl}
                  onChange={(e) => setVitalForm({ ...vitalForm, bloodSugarMgDl: Number(e.target.value) })}
                />
              </div>

              <Input
                label="Recorded By Nurse"
                value={vitalForm.recordedBy}
                onChange={(e) => setVitalForm({ ...vitalForm, recordedBy: e.target.value })}
              />

              <Button variant="primary" type="submit" className="w-full">
                Record Vitals Entry
              </Button>
            </form>

            {/* Vitals History Log */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-2">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">Recent Vitals Trend</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {vitalsHistory.map((v) => (
                  <div key={v.id} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">
                        BP: {v.bpSystolic}/{v.bpDiastolic} • Pulse: {v.pulseRate} • SpO2: {v.spO2}%
                      </p>
                      <p className="text-[10px] text-slate-500">Temp: {v.temperatureF}°F • RR: {v.respRate}/min • Sugar: {v.bloodSugarMgDl || 'N/A'}</p>
                    </div>
                    <span className="text-[10px] text-slate-400">{v.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Nursing Notes Section */}
          <Card className="p-5 space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Record Nursing Shift Note</h3>
            </div>

            <form onSubmit={handleAddNursingNote} className="space-y-3 text-xs">
              <Select
                label="Nursing Shift *"
                options={[
                  { value: 'Morning Shift (7 AM - 3 PM)', label: 'Morning Shift (7 AM - 3 PM)' },
                  { value: 'Evening Shift (3 PM - 11 PM)', label: 'Evening Shift (3 PM - 11 PM)' },
                  { value: 'Night Shift (11 PM - 7 AM)', label: 'Night Shift (11 PM - 7 AM)' },
                ]}
                value={nursingForm.shift}
                onChange={(e) => setNursingForm({ ...nursingForm, shift: e.target.value as any })}
              />

              <Textarea
                label="Care Given & Patient Comfort *"
                placeholder="Sponge bath, bed linen change, oral care..."
                rows={2}
                value={nursingForm.careGiven}
                onChange={(e) => setNursingForm({ ...nursingForm, careGiven: e.target.value })}
                required
              />

              <Textarea
                label="Medication & Homoeopathic Dose Administered *"
                placeholder="Remedies given as per prescription..."
                rows={2}
                value={nursingForm.medicationAdministered}
                onChange={(e) => setNursingForm({ ...nursingForm, medicationAdministered: e.target.value })}
                required
              />

              <Select
                label="Patient Clinical Condition *"
                options={[
                  { value: 'Stable', label: 'Stable' },
                  { value: 'Improving', label: 'Improving' },
                  { value: 'Critical', label: 'Critical' },
                  { value: 'Guarded', label: 'Guarded' },
                ]}
                value={nursingForm.patientCondition}
                onChange={(e) => setNursingForm({ ...nursingForm, patientCondition: e.target.value as any })}
              />

              <Button variant="primary" type="submit" className="w-full">
                Save Nursing Shift Note
              </Button>
            </form>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-2">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">Nursing Shift Log History</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {nursingNotes.map((nn) => (
                  <div key={nn.id} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{nn.shift}</span>
                      <Badge variant={nn.patientCondition === 'Stable' || nn.patientCondition === 'Improving' ? 'accent' : 'danger'}>
                        {nn.patientCondition}
                      </Badge>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400"><span className="font-bold">Care:</span> {nn.careGiven}</p>
                    <p className="text-slate-600 dark:text-slate-400"><span className="font-bold">Med:</span> {nn.medicationAdministered}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* 6. Investigations */}
      {activeTab === 'investigations' && (
        <Card className="p-5 space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-cyan-600" />
                <span>Lab & Radiology Requisitions</span>
              </h3>
              <p className="text-xs text-slate-500">Order tests and review published diagnostic lab reports</p>
            </div>
          </div>

          {/* New Requisition Form */}
          <form onSubmit={handleAddInvestigation} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
            <p className="font-bold text-slate-900 dark:text-white">Create New Test Requisition</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Select
                label="Test Category *"
                options={[
                  { value: 'Haematology', label: 'Haematology (CBC, ESR, AEC)' },
                  { value: 'Biochemistry', label: 'Biochemistry (LFT, KFT, LFT)' },
                  { value: 'Pathology', label: 'Pathology & Cytology' },
                  { value: 'Radiology / X-Ray', label: 'Radiology / X-Ray PA View' },
                  { value: 'ECG', label: 'ECG (12 Lead)' },
                  { value: 'Stool & Urine', label: 'Stool & Urine Routine' },
                ]}
                value={invForm.testCategory}
                onChange={(e) => setInvForm({ ...invForm, testCategory: e.target.value as any })}
              />

              <Input
                label="Tests Requested (Comma separated) *"
                placeholder="e.g. CBC, ESR, Absolute Eosinophil Count"
                value={invForm.testsRequested}
                onChange={(e) => setInvForm({ ...invForm, testsRequested: e.target.value })}
                required
              />

              <Select
                label="Urgency *"
                options={[
                  { value: 'Routine', label: 'Routine' },
                  { value: 'Urgent', label: 'Urgent' },
                  { value: 'STAT / Emergency', label: 'STAT / Emergency' },
                ]}
                value={invForm.urgency}
                onChange={(e) => setInvForm({ ...invForm, urgency: e.target.value as any })}
              />
            </div>

            <div className="flex justify-end pt-1">
              <Button variant="primary" type="submit">
                Submit Requisition
              </Button>
            </div>
          </form>

          {/* Investigations History List */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">Ordered Tests & Reports</h4>
            {investigations.map((inv) => (
              <div key={inv.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-extrabold text-slate-900 dark:text-white">{inv.testCategory}</span>
                    <span className="text-[10px] text-slate-500 ml-2">Requisition Date: {inv.requisitionDate}</span>
                  </div>
                  <Badge variant={inv.status === 'COMPLETED' || inv.status === 'REPORT_READY' ? 'accent' : 'warning'}>
                    {inv.status}
                  </Badge>
                </div>

                <p className="text-slate-700 dark:text-slate-300 font-semibold">
                  Tests: {inv.testsRequested.join(', ')}
                </p>

                {inv.reportFindings ? (
                  <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-900 dark:text-emerald-200">
                    <p className="font-bold">Report Findings / Lab Impression:</p>
                    <p>{inv.reportFindings}</p>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 italic">Report pending lab processing.</p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 7. Case History & Allergies */}
      {activeTab === 'history_allergies' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Case History Form */}
          <Card className="p-5 space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Homoeopathic Case Record</h3>
            </div>

            <form onSubmit={handleSaveMedicalHistory} className="space-y-3 text-xs">
              <Textarea
                label="Chief Complaints & Modalities *"
                rows={3}
                value={profileForm.chiefComplaints}
                onChange={(e) => setProfileForm({ ...profileForm, chiefComplaints: e.target.value })}
              />

              <Textarea
                label="History of Present Illness (HPI) *"
                rows={3}
                value={profileForm.hpi}
                onChange={(e) => setProfileForm({ ...profileForm, hpi: e.target.value })}
              />

              <Textarea
                label="Past Medical History & Suppressions *"
                rows={2}
                value={profileForm.pastMedicalHistory}
                onChange={(e) => setProfileForm({ ...profileForm, pastMedicalHistory: e.target.value })}
              />

              <Textarea
                label="Family History *"
                rows={2}
                value={profileForm.familyHistory}
                onChange={(e) => setProfileForm({ ...profileForm, familyHistory: e.target.value })}
              />

              <Textarea
                label="Personal Generals (Thirst, Cravings, Sleep, Mind) *"
                rows={2}
                value={profileForm.personalHistory}
                onChange={(e) => setProfileForm({ ...profileForm, personalHistory: e.target.value })}
              />

              <Select
                label="Thermal Preference *"
                options={[
                  { value: 'Hot Patient', label: 'Hot Patient (< Heat, > Cold)' },
                  { value: 'Chilly Patient', label: 'Chilly Patient (< Cold, > Warmth)' },
                  { value: 'Ambithermal', label: 'Ambithermal' },
                ]}
                value={profileForm.thermalPreference}
                onChange={(e) => setProfileForm({ ...profileForm, thermalPreference: e.target.value as any })}
              />

              <Button variant="primary" type="submit" className="w-full">
                Save Case History Profile
              </Button>
            </form>
          </Card>

          {/* Allergies Manager */}
          <Card className="p-5 space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                <span>Allergy & Hypersensitivity Information</span>
              </h3>
            </div>

            {/* Add Allergy Box */}
            <div className="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 space-y-3 text-xs">
              <p className="font-bold text-rose-950 dark:text-rose-300">Add Known Allergen</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Input
                  placeholder="Allergen e.g. Penicillin, Sulfur, Dust"
                  value={newAllergen.allergen}
                  onChange={(e) => setNewAllergen({ ...newAllergen, allergen: e.target.value })}
                />

                <Select
                  options={[
                    { value: 'Drug / Remedy', label: 'Drug / Remedy' },
                    { value: 'Food', label: 'Food Allergy' },
                    { value: 'Environmental', label: 'Environmental' },
                    { value: 'Contact', label: 'Contact Dermatitis' },
                  ]}
                  value={newAllergen.category}
                  onChange={(e) => setNewAllergen({ ...newAllergen, category: e.target.value as any })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Select
                  options={[
                    { value: 'Mild', label: 'Mild Severity' },
                    { value: 'Moderate', label: 'Moderate Severity' },
                    { value: 'Severe / Anaphylactic', label: 'Severe / Anaphylactic' },
                  ]}
                  value={newAllergen.severity}
                  onChange={(e) => setNewAllergen({ ...newAllergen, severity: e.target.value as any })}
                />

                <Input
                  placeholder="Reaction e.g. Bronchospasm, Urticaria"
                  value={newAllergen.reaction}
                  onChange={(e) => setNewAllergen({ ...newAllergen, reaction: e.target.value })}
                />
              </div>

              <Button variant="danger" type="button" onClick={handleAddAllergy} className="w-full text-xs">
                Add Allergy Warning
              </Button>
            </div>

            {/* Allergy List */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">Logged Allergies</h4>
              {medicalProfile.allergies.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No known drug or environmental allergies logged.</p>
              ) : (
                medicalProfile.allergies.map((alg) => (
                  <div key={alg.id} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{alg.allergen}</p>
                      <p className="text-[10px] text-slate-500">{alg.category} • Reaction: {alg.reaction}</p>
                    </div>
                    <Badge variant={alg.severity.includes('Severe') ? 'danger' : 'warning'}>
                      {alg.severity}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
