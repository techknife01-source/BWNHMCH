import React, { useState } from 'react';
import { Card } from '../../../components/common/Card';
import { Select } from '../../../components/common/Select';
import { Input } from '../../../components/common/Input';
import { Badge } from '../../../components/common/Badge';
import { Modal } from '../../../components/common/Modal';
import { Button } from '../../../components/common/Button';
import { hospitalCoreService } from '../../../services/hospitalCoreService';
import { AppointmentRecord, Patient } from '../../../types/hospital';
import { OpdTicketModal } from '../../../components/opd/OpdTicketModal';
import { OpdTicketData } from '../../../services/opdTicketService';
import {
  Calendar as CalendarIcon,
  Clock,
  UserCheck,
  Plus,
  Search,
  CheckCircle,
  XCircle,
  Phone,
  Filter,
  FileText,
  Printer,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const AppointmentCalendarDesk: React.FC = () => {
  const [selectedDoctorId, setSelectedDoctorId] = useState('ALL');
  const [selectedDate, setSelectedDate] = useState('2026-07-28');

  // Book Appointment Modal State
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [patientLookup, setPatientLookup] = useState('');
  const [matchedPatient, setMatchedPatient] = useState<Patient | null>(null);

  // Ticket Preview Modal State
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [activeTicket, setActiveTicket] = useState<OpdTicketData | null>(null);

  const doctors = hospitalCoreService.getDoctors();

  const [bookingData, setBookingData] = useState({
    doctorId: doctors[0]?.id || '',
    appointmentDate: '2026-07-28',
    timeSlot: '10:30 AM',
    symptoms: '',
    bookingChannel: 'Walk-In' as 'Walk-In' | 'Phone Query' | 'Online Portal',
  });

  const appointments = hospitalCoreService.getAppointments(selectedDate, selectedDoctorId);

  const handlePatientLookup = (query: string) => {
    setPatientLookup(query);
    if (!query) return;
    const found = hospitalCoreService.getPatientByUhid(query);
    setMatchedPatient(found || null);
  };

  const openTicketForAppt = (app: AppointmentRecord, patient?: Patient | null) => {
    const p = patient || hospitalCoreService.getPatientByUhid(app.uhid);
    const tokenNum = Math.floor(1 + Math.random() * 20);

    const ticketData: OpdTicketData = {
      appointmentId: app.appointmentNo,
      uhid: app.uhid,
      patientName: app.patientName,
      age: p?.age || 35,
      gender: p?.gender || 'Male',
      phone: app.phone || p?.phone || '',
      email: p?.email || 'patient@example.com',
      doctorName: app.doctorName,
      department: app.department,
      appointmentDate: app.appointmentDate,
      timeSlot: app.timeSlot,
      tokenNumber: tokenNum,
      status: app.status || 'SCHEDULED',
      symptoms: app.symptoms,
      issuedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setActiveTicket(ticketData);
    setTicketModalOpen(true);
  };

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchedPatient) {
      toast.error('Please lookup a registered patient by UHID.');
      return;
    }

    const created = hospitalCoreService.bookAppointment({
      uhid: matchedPatient.uhid,
      patientName: matchedPatient.fullName,
      phone: matchedPatient.phone,
      doctorId: bookingData.doctorId,
      appointmentDate: bookingData.appointmentDate,
      timeSlot: bookingData.timeSlot,
      symptoms: bookingData.symptoms,
      bookingChannel: bookingData.bookingChannel,
    });

    toast.success(`Appointment Booked! #${created.appointmentNo}`);
    setIsBookModalOpen(false);
    setSelectedDate(bookingData.appointmentDate);

    // Automatically open ticket preview after booking!
    openTicketForAppt(created, matchedPatient);
  };

  const handleStatusUpdate = (id: string, status: AppointmentRecord['status']) => {
    hospitalCoreService.updateAppointmentStatus(id, status);
    toast.success(`Appointment status updated to ${status}`);
    setSelectedDoctorId((prev) => prev); // refresh
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Appointment Booking & Calendar</h2>
          <p className="text-xs text-slate-500">
            Schedule advance OPD consultations, phone queries, and view calendar appointments
          </p>
        </div>

        <button
          onClick={() => setIsBookModalOpen(true)}
          className="flex items-center gap-2 bg-[#002147] hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#00A651]" />
          <span>Book Advance Appointment</span>
        </button>
      </div>

      {/* Calendar Filter Controls */}
      <Card className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input
            type="date"
            label="Appointment Date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />

          <Select
            label="Filter Doctor"
            options={[
              { value: 'ALL', label: 'All Doctors' },
              ...doctors.map((d) => ({ value: d.id, label: `${d.name} (${d.department})` })),
            ]}
            value={selectedDoctorId}
            onChange={(e) => setSelectedDoctorId(e.target.value)}
          />

          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedDate('2026-07-28');
                setSelectedDoctorId('ALL');
              }}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </Card>

      {/* Appointments List & Calendar Cards */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-blue-600" />
            <span>Scheduled Appointments for {selectedDate}</span>
          </h3>
          <Badge variant="primary">{appointments.length} Appointments</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {appointments.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400 space-y-2">
              <CalendarIcon className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs italic">No appointments scheduled for this date & doctor selection.</p>
            </div>
          ) : (
            appointments.map((app) => (
              <div
                key={app.id}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 relative"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#002147] dark:text-blue-400">
                      {app.appointmentNo}
                    </span>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white mt-0.5">{app.patientName}</h4>
                    <p className="text-[10px] text-slate-500">UHID: {app.uhid} • Ph: {app.phone}</p>
                  </div>
                  <Badge
                    variant={
                      app.status === 'COMPLETED'
                        ? 'accent'
                        : app.status === 'CHECKED_IN'
                        ? 'primary'
                        : app.status === 'SCHEDULED'
                        ? 'warning'
                        : 'danger'
                    }
                  >
                    {app.status}
                  </Badge>
                </div>

                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-[11px] space-y-1">
                  <p className="font-bold text-slate-800 dark:text-slate-200">{app.doctorName}</p>
                  <p className="text-slate-500">{app.department}</p>
                  <div className="flex justify-between items-center pt-1 border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                    <span>Slot: {app.timeSlot}</span>
                    <span className="text-[10px] text-slate-400">Via: {app.bookingChannel}</span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-500 italic">
                  <span className="font-bold not-italic">Notes:</span> {app.symptoms}
                </p>

                {/* Status Action Buttons */}
                <div className="flex items-center justify-end space-x-1 pt-1">
                  <button
                    onClick={() => openTicketForAppt(app)}
                    className="px-2 py-1 bg-[#002147] hover:bg-slate-800 text-white rounded text-[10px] font-bold transition cursor-pointer flex items-center gap-1"
                  >
                    <FileText className="w-3 h-3 text-[#00A651]" />
                    <span>Ticket PDF</span>
                  </button>
                  {app.status === 'SCHEDULED' && (
                    <button
                      onClick={() => handleStatusUpdate(app.id, 'CHECKED_IN')}
                      className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold transition cursor-pointer"
                    >
                      Check-In Patient
                    </button>
                  )}
                  {app.status !== 'CANCELLED' && app.status !== 'COMPLETED' && (
                    <button
                      onClick={() => handleStatusUpdate(app.id, 'CANCELLED')}
                      className="px-2 py-1 bg-rose-100 dark:bg-rose-950 hover:bg-rose-200 text-rose-700 dark:text-rose-300 rounded text-[10px] font-bold transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Book Appointment Modal */}
      <Modal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        title="Book Advance OPD Appointment"
        className="max-w-lg"
      >
        <form onSubmit={handleBookSubmit} className="space-y-4 text-xs">
          {/* Patient Lookup */}
          <div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <p className="font-bold text-slate-800 dark:text-slate-200">Lookup Registered Patient UHID *</p>
            <Input
              placeholder="Enter Patient UHID (e.g. BHMC-2026-0001)..."
              value={patientLookup}
              onChange={(e) => handlePatientLookup(e.target.value)}
            />

            {matchedPatient ? (
              <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs">
                <p className="font-bold text-emerald-900 dark:text-emerald-200">{matchedPatient.fullName}</p>
                <p className="text-[10px] text-emerald-700 dark:text-emerald-400">
                  UHID: {matchedPatient.uhid} • Phone: {matchedPatient.phone}
                </p>
              </div>
            ) : (
              patientLookup && <p className="text-rose-500 text-[11px]">Patient not found.</p>
            )}
          </div>

          <Select
            label="Consultant Doctor *"
            options={doctors.map((d) => ({ value: d.id, label: `${d.name} (${d.department})` }))}
            value={bookingData.doctorId}
            onChange={(e) => setBookingData({ ...bookingData, doctorId: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              type="date"
              label="Appointment Date *"
              value={bookingData.appointmentDate}
              onChange={(e) => setBookingData({ ...bookingData, appointmentDate: e.target.value })}
              required
            />

            <Select
              label="Time Slot *"
              options={[
                { value: '09:30 AM', label: '09:30 AM' },
                { value: '10:00 AM', label: '10:00 AM' },
                { value: '10:30 AM', label: '10:30 AM' },
                { value: '11:00 AM', label: '11:00 AM' },
                { value: '11:30 AM', label: '11:30 AM' },
                { value: '12:00 PM', label: '12:00 PM' },
              ]}
              value={bookingData.timeSlot}
              onChange={(e) => setBookingData({ ...bookingData, timeSlot: e.target.value })}
            />
          </div>

          <Select
            label="Booking Channel"
            options={[
              { value: 'Walk-In', label: 'Front Desk Walk-In' },
              { value: 'Phone Query', label: 'Reception Phone Query' },
              { value: 'Online Portal', label: 'Online Web Portal' },
            ]}
            value={bookingData.bookingChannel}
            onChange={(e) => setBookingData({ ...bookingData, bookingChannel: e.target.value as any })}
          />

          <Input
            label="Reason / Symptoms for Visit"
            placeholder="e.g. Follow-up consultation for eczema"
            value={bookingData.symptoms}
            onChange={(e) => setBookingData({ ...bookingData, symptoms: e.target.value })}
          />

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="secondary" onClick={() => setIsBookModalOpen(false)} type="button">
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={!matchedPatient}>
              Confirm & Book Appointment
            </Button>
          </div>
        </form>
      </Modal>

      {/* Official OPD Ticket Modal & Preview */}
      <OpdTicketModal
        isOpen={ticketModalOpen}
        onClose={() => setTicketModalOpen(false)}
        ticketData={activeTicket}
        onRegenerate={(updated) => setActiveTicket({ ...updated })}
      />
    </div>
  );
};
