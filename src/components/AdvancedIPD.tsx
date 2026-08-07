import React, { useState } from 'react';
import { IPDBed, UserRole } from '../types';
import { Bed, UserPlus, FileText, CheckCircle2, AlertTriangle, Printer, Activity, HeartPulse, Clock, Plus } from 'lucide-react';

interface AdvancedIPDProps {
  beds: IPDBed[];
  onUpdateBeds: (beds: IPDBed[]) => void;
  userRole: UserRole;
}

export const AdvancedIPD: React.FC<AdvancedIPDProps> = ({ beds, onUpdateBeds, userRole }) => {
  const [localBeds, setLocalBeds] = useState<IPDBed[]>(beds);
  const [selectedWard, setSelectedWard] = useState<string>('All');
  const [editingBed, setEditingBed] = useState<IPDBed | null>(null);
  const [dischargePdfBed, setDischargePdfBed] = useState<IPDBed | null>(null);

  const [admissionForm, setAdmissionForm] = useState({
    patientName: '',
    caseNo: '',
    doctorInCharge: 'Dr. Susmita Chatterjee',
    nursingNote: 'Patient admitted under observation. Start constitutional remedy dose.',
    vitals: 'BP: 120/80 mmHg, Pulse: 72 bpm, Temp: 98.6 F'
  });

  const wards = [
    'All',
    'Dhanvantari Acute Ward',
    'Hahnemann Male IPD',
    'Kent Female IPD',
    'Boenninghausen Pediatric Ward'
  ];

  const filteredBeds = localBeds.filter(b => selectedWard === 'All' || b.wardName === selectedWard);

  const totalOccupied = localBeds.filter(b => b.isOccupied).length;
  const occupancyRate = Math.round((totalOccupied / localBeds.length) * 100);

  const handleOpenAdmitModal = (bed: IPDBed) => {
    setEditingBed(bed);
    if (bed.isOccupied) {
      setAdmissionForm({
        patientName: bed.patientName || '',
        caseNo: bed.caseNo || '',
        doctorInCharge: bed.doctorInCharge || 'Dr. Susmita Chatterjee',
        nursingNote: bed.nursingNote || '',
        vitals: bed.vitals || ''
      });
    } else {
      setAdmissionForm({
        patientName: '',
        caseNo: `IPD/2026/0${Math.floor(100 + Math.random() * 900)}`,
        doctorInCharge: 'Dr. Susmita Chatterjee',
        nursingNote: 'Patient admitted under acute care. Vitals recorded on admission.',
        vitals: 'BP: 120/80 mmHg, Pulse: 74 bpm, Temp: 98.4 F'
      });
    }
  };

  const handleSaveAdmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBed) return;

    const updated = localBeds.map(b => {
      if (b.id === editingBed.id) {
        return {
          ...b,
          isOccupied: true,
          patientName: admissionForm.patientName,
          caseNo: admissionForm.caseNo,
          doctorInCharge: admissionForm.doctorInCharge,
          admissionDate: b.admissionDate || new Date().toISOString().split('T')[0],
          nursingNote: admissionForm.nursingNote,
          vitals: admissionForm.vitals
        };
      }
      return b;
    });

    setLocalBeds(updated);
    onUpdateBeds(updated);
    setEditingBed(null);
  };

  const handleDischargePatient = (bedId: string) => {
    const bedToDischarge = localBeds.find(b => b.id === bedId);
    if (bedToDischarge && bedToDischarge.patientName) {
      setDischargePdfBed(bedToDischarge);
    }

    const updated = localBeds.map(b => {
      if (b.id === bedId) {
        return {
          ...b,
          isOccupied: false,
          patientName: undefined,
          caseNo: undefined,
          doctorInCharge: undefined,
          admissionDate: undefined,
          nursingNote: undefined,
          vitals: undefined
        };
      }
      return b;
    });

    setLocalBeds(updated);
    onUpdateBeds(updated);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HEADER & SUMMARY METRICS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Bed className="w-5 h-5 text-[#002147] dark:text-blue-400" />
              <h3 className="text-sm font-black uppercase tracking-wider text-[#002147] dark:text-white">
                BHMCH Live IPD & Ward Bed Management
              </h3>
            </div>
            <p className="text-3xs text-slate-400 mt-1">
              Dhanvantari Acute Ward & Specialized Homoeopathic Inpatient Units
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-[#002147] text-white rounded-full text-3xs font-bold uppercase tracking-wider">
              {totalOccupied} / {localBeds.length} Occupied ({occupancyRate}%)
            </span>
          </div>
        </div>

        {/* WARD FILTER BUTTONS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {wards.map(ward => (
            <button
              key={ward}
              onClick={() => setSelectedWard(ward)}
              className={`px-3 py-1.5 rounded-xl text-3xs font-bold uppercase tracking-wider transition whitespace-nowrap cursor-pointer ${
                selectedWard === ward
                  ? 'bg-[#002147] text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {ward}
            </button>
          ))}
        </div>
      </div>

      {/* BED STATUS MAP GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBeds.map(bed => (
          <div
            key={bed.id}
            className={`border rounded-3xl p-5 space-y-4 transition-all duration-300 relative ${
              bed.isOccupied
                ? 'bg-white dark:bg-slate-900 border-rose-200 dark:border-rose-950/60 shadow-xs'
                : 'bg-slate-50/50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800'
            }`}
          >
            {/* BED HEADER */}
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-4xs font-mono font-bold text-slate-400 uppercase tracking-widest block">
                  {bed.wardName}
                </span>
                <h4 className="text-base font-black text-[#002147] dark:text-white flex items-center gap-2">
                  <span>Bed {bed.bedNumber}</span>
                  {bed.isOccupied ? (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  )}
                </h4>
              </div>

              <span
                className={`px-2.5 py-1 rounded-full text-4xs font-bold uppercase tracking-wider ${
                  bed.isOccupied
                    ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                    : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                }`}
              >
                {bed.isOccupied ? 'Occupied' : 'Vacant'}
              </span>
            </div>

            {/* OCCUPIED PATIENT DETAILS */}
            {bed.isOccupied ? (
              <div className="space-y-3 text-2xs">
                <div>
                  <strong className="text-3xs text-slate-400 uppercase block">Patient Name</strong>
                  <span className="font-bold text-slate-800 dark:text-slate-100 text-xs">{bed.patientName}</span>
                  <span className="text-4xs font-mono text-slate-400 block">{bed.caseNo}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-3xs bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-850">
                  <div>
                    <strong className="text-slate-400 block uppercase text-4xs">Consultant Doctor</strong>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{bed.doctorInCharge}</span>
                  </div>
                  <div>
                    <strong className="text-slate-400 block uppercase text-4xs">Admission Date</strong>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{bed.admissionDate}</span>
                  </div>
                </div>

                {bed.vitals && (
                  <div className="p-2.5 bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 rounded-xl text-3xs space-y-0.5">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest text-4xs block">
                      Active Vitals
                    </span>
                    <p className="font-mono text-slate-700 dark:text-slate-300 text-3xs">{bed.vitals}</p>
                  </div>
                )}

                {bed.nursingNote && (
                  <p className="text-3xs text-slate-500 italic bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-850">
                    "{bed.nursingNote}"
                  </p>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleOpenAdmitModal(bed)}
                    className="w-1/2 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl font-bold text-3xs uppercase tracking-wider transition cursor-pointer"
                  >
                    Update Round
                  </button>
                  <button
                    onClick={() => handleDischargePatient(bed.id)}
                    className="w-1/2 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-3xs uppercase tracking-wider transition cursor-pointer"
                  >
                    Discharge & Summary
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center space-y-3">
                <p className="text-3xs text-slate-400">Bed is cleaned, sanitized, and ready for fresh admission.</p>
                <button
                  onClick={() => handleOpenAdmitModal(bed)}
                  className="px-4 py-2 bg-[#002147] hover:bg-[#001833] text-white font-bold text-3xs uppercase tracking-wider rounded-xl transition cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Admit Patient Here</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ADMISSION & ROUND MODAL */}
      {editingBed && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-4xs font-bold text-slate-400 uppercase tracking-widest block">Ward Bed Desk</span>
                <h4 className="text-sm font-black text-[#002147] dark:text-white uppercase">
                  {editingBed.isOccupied ? 'Update Nursing Notes & Vitals' : `Admit Patient to Bed ${editingBed.bedNumber}`}
                </h4>
              </div>
              <button onClick={() => setEditingBed(null)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
            </div>

            <form onSubmit={handleSaveAdmission} className="space-y-4 text-3xs font-bold uppercase text-slate-500">
              <div className="space-y-1">
                <label>Patient Full Name</label>
                <input
                  type="text"
                  required
                  value={admissionForm.patientName}
                  onChange={e => setAdmissionForm({ ...admissionForm, patientName: e.target.value })}
                  placeholder="e.g. Smt. Kamala Devi"
                  className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-2xs bg-transparent focus:outline-none font-normal text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label>Case Registration No</label>
                  <input
                    type="text"
                    required
                    value={admissionForm.caseNo}
                    onChange={e => setAdmissionForm({ ...admissionForm, caseNo: e.target.value })}
                    className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-2xs bg-transparent focus:outline-none font-normal text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div className="space-y-1">
                  <label>Consultant Doctor</label>
                  <select
                    value={admissionForm.doctorInCharge}
                    onChange={e => setAdmissionForm({ ...admissionForm, doctorInCharge: e.target.value })}
                    className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-2xs bg-white dark:bg-slate-900 font-normal text-slate-800 dark:text-slate-100"
                  >
                    <option value="Dr. Susmita Chatterjee">Dr. Susmita Chatterjee (Medicine / Surgery)</option>
                    <option value="Dr. Priyanka Maji">Dr. Priyanka Maji (Materia Medica)</option>
                    <option value="Dr. Soumitra De">Dr. Soumitra De (Practice of Medicine)</option>
                    <option value="Dr. Rajesh Patel">Dr. Rajesh Patel (Surgery)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label>Live Vitals Entry</label>
                <input
                  type="text"
                  required
                  value={admissionForm.vitals}
                  onChange={e => setAdmissionForm({ ...admissionForm, vitals: e.target.value })}
                  placeholder="BP: 120/80, Pulse: 72 bpm, SpO2: 98%"
                  className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-2xs bg-transparent focus:outline-none font-normal text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label>Nursing & Doctor Round Notes</label>
                <textarea
                  rows={3}
                  required
                  value={admissionForm.nursingNote}
                  onChange={e => setAdmissionForm({ ...admissionForm, nursingNote: e.target.value })}
                  className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-2xs bg-transparent focus:outline-none font-normal text-slate-800 dark:text-slate-100"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingBed(null)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl"
                >
                  Save Bed Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DISCHARGE SUMMARY PDF MODAL */}
      {dischargePdfBed && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl max-w-lg w-full p-8 space-y-6 shadow-2xl relative border-4 border-double border-slate-300">
            <div className="border border-slate-300 p-6 space-y-6 bg-[#FCFDFE]">
              <div className="text-center border-b-2 border-slate-800 pb-4 space-y-1">
                <h2 className="text-xs font-black uppercase tracking-widest text-[#002147]">
                  BURDWAN HOMOEOPATHIC MEDICAL COLLEGE & HOSPITAL
                </h2>
                <p className="text-[9px] font-bold text-slate-500 uppercase">
                  1, Ramkrishna Road, Burdwan, West Bengal - 713101
                </p>
                <div className="inline-block border border-slate-800 px-3 py-0.5 text-3xs font-black uppercase tracking-wider bg-slate-50 mt-1">
                  OFFICIAL IPD DISCHARGE SUMMARY
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-2 text-3xs font-mono border-b border-slate-200 pb-4">
                <div>
                  <strong className="text-slate-500 uppercase">Patient Name:</strong>
                  <span className="text-slate-900 font-bold block">{dischargePdfBed.patientName}</span>
                </div>
                <div>
                  <strong className="text-slate-500 uppercase">IPD Case No:</strong>
                  <span className="text-[#002147] font-black block">{dischargePdfBed.caseNo}</span>
                </div>
                <div>
                  <strong className="text-slate-500 uppercase">Ward Bed:</strong>
                  <span className="text-slate-900 font-bold block">{dischargePdfBed.wardName} ({dischargePdfBed.bedNumber})</span>
                </div>
                <div>
                  <strong className="text-slate-500 uppercase">Discharge Date:</strong>
                  <span className="text-slate-900 font-bold block">{new Date().toISOString().split('T')[0]}</span>
                </div>
              </div>

              <div className="space-y-3 text-3xs font-mono">
                <div>
                  <strong className="text-slate-500 uppercase block">Attending Consultant:</strong>
                  <span className="text-slate-800 font-bold">{dischargePdfBed.doctorInCharge}</span>
                </div>
                <div>
                  <strong className="text-slate-500 uppercase block">Clinical Outcome:</strong>
                  <span className="text-emerald-700 font-black">Cured / Significant Recovery under Classical Potency</span>
                </div>
              </div>

              <div className="flex justify-between items-end pt-4 text-[8px] font-black uppercase tracking-wider text-slate-400 font-mono">
                <div>
                  <div>Medical Superintendent</div>
                  <div className="text-slate-700 font-bold mt-1">Dr. Partha Sarathi Chakraborty</div>
                </div>
                <div className="text-right">
                  <div className="border-t border-slate-300 pt-1 w-28">Attending Clinician</div>
                  <div className="text-slate-900 font-bold mt-1">{dischargePdfBed.doctorInCharge}</div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setDischargePdfBed(null)}
                className="w-1/2 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs uppercase rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="w-1/2 py-2.5 bg-[#002147] text-white font-bold text-xs uppercase rounded-xl flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Discharge PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
