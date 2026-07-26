import React, { useState } from 'react';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Select } from '../../../components/common/Select';
import { Badge } from '../../../components/common/Badge';
import { Modal } from '../../../components/common/Modal';
import { Input } from '../../../components/common/Input';
import { hospitalCoreService } from '../../../services/hospitalCoreService';
import { OpdToken, Patient, DoctorSchedule } from '../../../types/hospital';
import {
  Ticket,
  Clock,
  Play,
  CheckCircle,
  XCircle,
  RotateCcw,
  Printer,
  UserCheck,
  Stethoscope,
  Filter,
  Plus,
  Volume2,
  Building2,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface OpdTokenQueueProps {
  initialPatient?: Patient | null;
  onClearInitialPatient?: () => void;
}

export const OpdTokenQueue: React.FC<OpdTokenQueueProps> = ({ initialPatient, onClearInitialPatient }) => {
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedDoctorId, setSelectedDoctorId] = useState('ALL');

  // OPD Token Issue Modal State
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [patientLookupQuery, setPatientLookupQuery] = useState('');
  const [matchedPatient, setMatchedPatient] = useState<Patient | null>(initialPatient || null);

  const doctors = hospitalCoreService.getDoctors();
  const departments = hospitalCoreService.getDepartments();

  const [issueData, setIssueData] = useState({
    department: 'Organon of Medicine',
    doctorId: doctors[0]?.id || '',
    symptoms: '',
    feeExempt: false,
    bp: '120/80',
    pulse: '76',
    temp: '98.4 F',
    weightKg: '68',
  });

  // Ticket Preview Modal State
  const [printedTicket, setPrintedTicket] = useState<OpdToken | null>(null);

  const tokens = hospitalCoreService.getTokens(selectedDepartment, selectedStatus, selectedDoctorId);

  // Filter available doctors when department changes
  const availableDocsForDept = doctors.filter((d) => d.department === issueData.department);

  const handlePatientLookup = (query: string) => {
    setPatientLookupQuery(query);
    if (!query) return;
    const found = hospitalCoreService.getPatientByUhid(query);
    if (found) {
      setMatchedPatient(found);
      if (found.category === 'BPL' || found.category === 'Staff' || found.category === 'Student') {
        setIssueData((prev) => ({ ...prev, feeExempt: true }));
      }
    } else {
      setMatchedPatient(null);
    }
  };

  const handleIssueTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!matchedPatient) {
      toast.error('Please lookup a valid registered patient by UHID or Name.');
      return;
    }

    const issuedToken = hospitalCoreService.issueOpdToken({
      uhid: matchedPatient.uhid,
      patientName: matchedPatient.fullName,
      age: matchedPatient.age,
      gender: matchedPatient.gender,
      phone: matchedPatient.phone,
      department: issueData.department,
      doctorId: issueData.doctorId,
      symptoms: issueData.symptoms,
      feeExempt: issueData.feeExempt,
      vitalSigns: {
        bp: issueData.bp,
        pulse: issueData.pulse,
        temp: issueData.temp,
        weightKg: parseFloat(issueData.weightKg) || undefined,
      },
    });

    toast.success(`OPD Token Issued! Ticket #${issuedToken.tokenCode}`);
    setPrintedTicket(issuedToken);
    setIsIssueModalOpen(false);
    if (onClearInitialPatient) onClearInitialPatient();
  };

  const handleStatusChange = (tokenId: string, status: OpdToken['status']) => {
    hospitalCoreService.updateTokenStatus(tokenId, status);
    toast.success(`Token status updated to ${status}`);
    // Force re-render
    setSelectedStatus((prev) => prev);
  };

  const handleCallNext = (docId: string) => {
    const next = hospitalCoreService.callNextToken(docId);
    if (next) {
      toast.success(`Calling Token #${next.tokenNumber} (${next.patientName}) to Room ${next.roomNo}`);
    } else {
      toast.error('No waiting patients in line for this doctor.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & OPD Ticket Issuance Trigger */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">OPD Registration & Token Queue</h2>
          <p className="text-xs text-slate-500">
            Real-time OPD token issuing desk and live doctor counter management
          </p>
        </div>

        <button
          onClick={() => setIsIssueModalOpen(true)}
          className="flex items-center gap-2 bg-[#00A651] hover:bg-emerald-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Issue OPD Registration Ticket</span>
        </button>
      </div>

      {/* Doctor Call-Next Live Bar */}
      <Card className="p-4 bg-slate-900 text-white space-y-3">
        <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
          <Volume2 className="w-4 h-4 text-emerald-400" />
          <span>Doctor Consultation Counters Live Call Control</span>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-bold text-white">{doc.name}</p>
                <p className="text-[10px] text-slate-400">{doc.department} • {doc.roomNo}</p>
                <p className="text-[11px] text-emerald-400 font-extrabold mt-1">
                  Serving: {doc.currentServingToken ? `Token #${doc.currentServingToken}` : 'None'}
                </p>
              </div>

              <button
                onClick={() => handleCallNext(doc.id)}
                disabled={!doc.isAvailable}
                className="px-3 py-1.5 bg-[#00A651] hover:bg-emerald-600 disabled:bg-slate-700 text-white text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1"
              >
                <Play className="w-3 h-3 fill-white" />
                <span>Call Next</span>
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Filter Toolbar */}
      <Card className="p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Select
            label="Department"
            options={[
              { value: 'ALL', label: 'All Departments' },
              ...departments.map((d) => ({ value: d.name, label: d.name })),
            ]}
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          />

          <Select
            label="Token Status"
            options={[
              { value: 'ALL', label: 'All Statuses' },
              { value: 'WAITING', label: 'WAITING in Queue' },
              { value: 'IN_CONSULTATION', label: 'IN CONSULTATION' },
              { value: 'COMPLETED', label: 'COMPLETED' },
              { value: 'SKIPPED', label: 'SKIPPED' },
            ]}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          />

          <Select
            label="Filter Doctor"
            options={[
              { value: 'ALL', label: 'All Doctors' },
              ...doctors.map((d) => ({ value: d.id, label: d.name })),
            ]}
            value={selectedDoctorId}
            onChange={(e) => setSelectedDoctorId(e.target.value)}
          />
        </div>
      </Card>

      {/* Token Table List */}
      <Card className="p-4 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Showing {tokens.length} OPD Tokens Issued
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-black">
                <th className="py-2.5 px-3">Token #</th>
                <th className="py-2.5 px-3">Patient Name & UHID</th>
                <th className="py-2.5 px-3">Department & Doctor</th>
                <th className="py-2.5 px-3">Fee & Vitals</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Queue Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {tokens.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 italic">
                    No tokens found for the selected filters.
                  </td>
                </tr>
              ) : (
                tokens.map((tok) => (
                  <tr key={tok.id} className="hover:bg-slate-50 dark:hover:bg-slate-900 transition">
                    <td className="py-3 px-3 font-black">
                      <span className="px-2.5 py-1 bg-[#002147] text-white rounded-lg text-xs">
                        #{tok.tokenNumber} ({tok.tokenCode})
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-900 dark:text-white">{tok.patientName}</p>
                      <p className="text-[10px] text-slate-500">
                        {tok.uhid} • {tok.age}Yrs ({tok.gender})
                      </p>
                    </td>

                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{tok.department}</p>
                      <p className="text-[10px] text-slate-500">
                        {tok.doctorName} ({tok.roomNo})
                      </p>
                    </td>

                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-900 dark:text-white">
                        ₹{tok.fee} <span className="text-[10px] text-slate-400">({tok.paymentStatus})</span>
                      </p>
                      {tok.vitalSigns && (
                        <p className="text-[10px] text-slate-500">
                          BP: {tok.vitalSigns.bp} | Temp: {tok.vitalSigns.temp}
                        </p>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      <Badge
                        variant={
                          tok.status === 'COMPLETED'
                            ? 'accent'
                            : tok.status === 'IN_CONSULTATION'
                            ? 'primary'
                            : tok.status === 'WAITING'
                            ? 'warning'
                            : 'danger'
                        }
                      >
                        {tok.status}
                      </Badge>
                    </td>

                    <td className="py-3 px-3 text-right space-x-1">
                      {tok.status === 'WAITING' && (
                        <button
                          onClick={() => handleStatusChange(tok.id, 'IN_CONSULTATION')}
                          className="px-2 py-1 text-[10px] font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
                        >
                          Start Consult
                        </button>
                      )}

                      {tok.status === 'IN_CONSULTATION' && (
                        <button
                          onClick={() => handleStatusChange(tok.id, 'COMPLETED')}
                          className="px-2 py-1 text-[10px] font-bold text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition"
                        >
                          Complete
                        </button>
                      )}

                      <button
                        onClick={() => setPrintedTicket(tok)}
                        className="px-2 py-1 text-[10px] font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-md hover:bg-slate-200 transition"
                      >
                        <Printer className="w-3 h-3 inline" /> Slip
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* OPD Token Issue Modal */}
      <Modal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        title="Issue OPD Registration Token Slip"
        className="max-w-xl"
      >
        <form onSubmit={handleIssueTokenSubmit} className="space-y-4 text-xs">
          {/* Patient Lookup */}
          <div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <p className="font-bold text-slate-800 dark:text-slate-200">1. Lookup Registered Patient</p>
            <div className="flex gap-2">
              <Input
                placeholder="Enter Patient UHID (e.g. BHMC-2026-0001)..."
                value={patientLookupQuery}
                onChange={(e) => handlePatientLookup(e.target.value)}
                className="flex-1"
              />
            </div>

            {matchedPatient ? (
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-emerald-900 dark:text-emerald-200">{matchedPatient.fullName}</p>
                  <p className="text-[10px] text-emerald-700 dark:text-emerald-400">
                    {matchedPatient.uhid} • {matchedPatient.age}Yrs ({matchedPatient.gender}) • Category: {matchedPatient.category}
                  </p>
                </div>
                <Badge variant="accent">VERIFIED</Badge>
              </div>
            ) : (
              patientLookupQuery && (
                <p className="text-rose-500 text-[11px] font-semibold">
                  Patient not found. Register them first under Patient Search.
                </p>
              )
            )}
          </div>

          {/* Department & Doctor Assignment */}
          <div className="space-y-3">
            <p className="font-bold text-slate-800 dark:text-slate-200">2. OPD Department & Doctor Selection</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                label="OPD Department *"
                options={departments.map((d) => ({ value: d.name, label: `${d.name} (${d.opdRoom})` }))}
                value={issueData.department}
                onChange={(e) => {
                  const dept = e.target.value;
                  const firstDoc = doctors.find((d) => d.department === dept);
                  setIssueData({
                    ...issueData,
                    department: dept,
                    doctorId: firstDoc ? firstDoc.id : doctors[0]?.id || '',
                  });
                }}
              />

              <Select
                label="Consultant Doctor *"
                options={
                  availableDocsForDept.length > 0
                    ? availableDocsForDept.map((d) => ({
                        value: d.id,
                        label: `${d.name} (${d.isAvailable ? 'Available' : 'Off-duty'})`,
                      }))
                    : [{ value: '', label: 'No doctors in department' }]
                }
                value={issueData.doctorId}
                onChange={(e) => setIssueData({ ...issueData, doctorId: e.target.value })}
              />
            </div>
          </div>

          {/* Vitals Recording */}
          <div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <p className="font-bold text-slate-800 dark:text-slate-200">3. Primary Vitals at Reception Desk</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <Input
                label="BP (mmHg)"
                placeholder="120/80"
                value={issueData.bp}
                onChange={(e) => setIssueData({ ...issueData, bp: e.target.value })}
              />
              <Input
                label="Pulse (/min)"
                placeholder="76"
                value={issueData.pulse}
                onChange={(e) => setIssueData({ ...issueData, pulse: e.target.value })}
              />
              <Input
                label="Temp (°F)"
                placeholder="98.4"
                value={issueData.temp}
                onChange={(e) => setIssueData({ ...issueData, temp: e.target.value })}
              />
              <Input
                label="Weight (Kg)"
                placeholder="68"
                value={issueData.weightKg}
                onChange={(e) => setIssueData({ ...issueData, weightKg: e.target.value })}
              />
            </div>
          </div>

          <Input
            label="Chief Complaints / Symptoms"
            placeholder="e.g. Headache, Rhinitis, Joint pain"
            value={issueData.symptoms}
            onChange={(e) => setIssueData({ ...issueData, symptoms: e.target.value })}
          />

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="secondary" onClick={() => setIsIssueModalOpen(false)} type="button">
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={!matchedPatient}>
              Generate & Print OPD Token Ticket
            </Button>
          </div>
        </form>
      </Modal>

      {/* Printable OPD Ticket Slip Modal */}
      {printedTicket && (
        <Modal
          isOpen={!!printedTicket}
          onClose={() => setPrintedTicket(null)}
          title="Official OPD Registration Slip"
          className="max-w-md"
        >
          <div className="p-4 bg-white text-slate-900 border-2 border-slate-900 rounded-xl space-y-4 font-mono text-xs">
            <div className="text-center border-b border-slate-300 pb-2 space-y-0.5">
              <h3 className="font-extrabold text-sm uppercase">BURDWAN HOMOEO MEDICAL COLLEGE</h3>
              <p className="text-[10px]">101 M.G. Road, Burdwan, W.B. - 713101</p>
              <p className="text-[10px] font-bold">OPD REGISTRATION SLIP</p>
            </div>

            <div className="text-center my-2 p-2 bg-slate-100 rounded-lg">
              <p className="text-2xl font-black tracking-widest text-[#002147]">{printedTicket.tokenCode}</p>
              <p className="text-xs font-bold text-emerald-700">TOKEN NUMBER #{printedTicket.tokenNumber}</p>
            </div>

            <div className="space-y-1 text-[11px]">
              <p><span className="font-bold">Patient Name:</span> {printedTicket.patientName}</p>
              <p><span className="font-bold">UHID:</span> {printedTicket.uhid}</p>
              <p><span className="font-bold">Age / Gender:</span> {printedTicket.age} Yrs / {printedTicket.gender}</p>
              <p><span className="font-bold">Department:</span> {printedTicket.department}</p>
              <p><span className="font-bold">Doctor:</span> {printedTicket.doctorName}</p>
              <p><span className="font-bold">OPD Room:</span> {printedTicket.roomNo}</p>
              <p><span className="font-bold">Registration Fee:</span> ₹{printedTicket.fee} ({printedTicket.paymentStatus})</p>
              <p><span className="font-bold">Issued At:</span> {printedTicket.issuedAt}</p>
            </div>

            {printedTicket.vitalSigns && (
              <div className="p-2 bg-slate-50 border border-slate-200 rounded text-[10px] grid grid-cols-2 gap-1">
                <p>BP: {printedTicket.vitalSigns.bp}</p>
                <p>Pulse: {printedTicket.vitalSigns.pulse}</p>
                <p>Temp: {printedTicket.vitalSigns.temp}</p>
                <p>Weight: {printedTicket.vitalSigns.weightKg} kg</p>
              </div>
            )}

            <div className="text-center pt-2 border-t border-slate-300 text-[9px] text-slate-500">
              <p>Please wait in the OPD waiting lobby until your Token Number is called.</p>
              <p>Valid for today's OPD consultation only.</p>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <Button variant="primary" onClick={() => {
                toast.success('Printing Token Ticket...');
                setPrintedTicket(null);
              }}>
                <Printer className="w-4 h-4 mr-1" /> Print Slip
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
