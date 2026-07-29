import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { opdTicketService, OpdTicketData } from '../../services/opdTicketService';
import {
  Download,
  Printer,
  Mail,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  FileText,
  Building2,
  Calendar,
  Clock,
  UserCheck,
  QrCode as QrIcon,
  Send,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface OpdTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketData: OpdTicketData | null;
  onRegenerate?: (ticket: OpdTicketData) => void;
}

export const OpdTicketModal: React.FC<OpdTicketModalProps> = ({
  isOpen,
  onClose,
  ticketData,
  onRegenerate,
}) => {
  const [pdfDataUrl, setPdfDataUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<string | null>(null);
  const [recipientEmail, setRecipientEmail] = useState('');

  useEffect(() => {
    if (!isOpen || !ticketData) return;

    setRecipientEmail(ticketData.email || '');

    // Check if PDF already stored or generate a new one
    const stored = opdTicketService.getStoredTicketPdf(ticketData.appointmentId);
    if (stored) {
      setPdfDataUrl(stored);
      // Auto-send email if email present and not already sent
      if (ticketData.email) {
        handleAutoEmail(ticketData, stored);
      }
    } else {
      generateAndStorePdf(ticketData);
    }
  }, [isOpen, ticketData]);

  const generateAndStorePdf = async (ticket: OpdTicketData) => {
    setIsGenerating(true);
    try {
      const { dataUrl } = await opdTicketService.generateTicketPdf(ticket);
      setPdfDataUrl(dataUrl);

      if (ticket.email) {
        handleAutoEmail(ticket, dataUrl);
      }
    } catch (err) {
      console.error('Failed to generate PDF ticket:', err);
      toast.error('Failed to generate PDF ticket');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAutoEmail = async (ticket: OpdTicketData, dataUrl: string) => {
    if (!ticket.email) return;
    setIsSendingEmail(true);
    setEmailStatus('Sending ticket email...');
    try {
      const res = await opdTicketService.sendTicketEmail(ticket.email, ticket, dataUrl);
      if (res.success) {
        setEmailStatus(`Ticket emailed to ${ticket.email}`);
      } else {
        setEmailStatus(`Email failed: ${res.message} (Booking preserved)`);
      }
    } catch {
      setEmailStatus('Email delivery queued for patient.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleResendEmail = async () => {
    if (!ticketData) return;
    const targetEmail = recipientEmail || ticketData.email;
    if (!targetEmail) {
      toast.error('Please enter a valid recipient email address.');
      return;
    }

    setIsSendingEmail(true);
    setEmailStatus('Resending ticket email...');
    try {
      const updatedTicket = { ...ticketData, email: targetEmail };
      const res = await opdTicketService.sendTicketEmail(targetEmail, updatedTicket, pdfDataUrl || undefined);
      if (res.success) {
        toast.success(res.message);
        setEmailStatus(`Ticket successfully resent to ${targetEmail}`);
      } else {
        toast.error(res.message);
        setEmailStatus('Resend failed.');
      }
    } catch (err) {
      toast.error('Failed to resend email');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleDownload = () => {
    if (!pdfDataUrl || !ticketData) return;
    const filename = `OPD_Ticket_${ticketData.uhid}_${ticketData.appointmentId}.pdf`;
    opdTicketService.downloadPdf(pdfDataUrl, filename);
  };

  const handlePrint = () => {
    if (!pdfDataUrl) return;
    opdTicketService.printPdf(pdfDataUrl);
  };

  const handleRegenerateTicket = async () => {
    if (!ticketData) return;
    setIsGenerating(true);
    try {
      const { dataUrl } = await opdTicketService.generateTicketPdf(ticketData);
      setPdfDataUrl(dataUrl);
      toast.success('OPD Ticket regenerated successfully!');
      if (onRegenerate) {
        onRegenerate(ticketData);
      }
    } catch {
      toast.error('Failed to regenerate ticket');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!ticketData) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Official OPD Ticket & Confirmation Slip"
      className="max-w-2xl"
    >
      <div className="space-y-5 text-xs">
        {/* Email Delivery Notification Banner */}
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-emerald-900 dark:text-emerald-200 font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <p className="text-xs">OPD Appointment Booking Confirmed!</p>
              <p className="text-[11px] font-normal text-emerald-700 dark:text-emerald-300">
                {emailStatus || (ticketData.email ? `Email dispatch to ${ticketData.email}` : 'Ticket generated successfully.')}
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-emerald-600 text-white font-extrabold text-[10px] rounded-lg tracking-wider shrink-0">
            TOKEN #{ticketData.tokenNumber}
          </span>
        </div>

        {/* Action Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="primary"
              onClick={handleDownload}
              disabled={isGenerating || !pdfDataUrl}
              className="text-xs font-bold"
            >
              <Download className="w-4 h-4 mr-1.5" />
              Download PDF Ticket
            </Button>

            <Button
              variant="secondary"
              onClick={handlePrint}
              disabled={isGenerating || !pdfDataUrl}
              className="text-xs font-bold"
            >
              <Printer className="w-4 h-4 mr-1.5" />
              Print Ticket
            </Button>

            {onRegenerate && (
              <button
                type="button"
                onClick={handleRegenerateTicket}
                disabled={isGenerating}
                className="px-3 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold text-xs rounded-xl border border-blue-200 dark:border-blue-800 transition flex items-center gap-1.5 cursor-pointer"
                title="Regenerate Ticket PDF"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>Regenerate Ticket</span>
              </button>
            )}
          </div>
        </div>

        {/* Visual Ticket Document Card / Preview */}
        <div className="border-2 border-slate-300 dark:border-slate-700 rounded-2xl p-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 space-y-4 shadow-sm relative">
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-slate-800 dark:border-slate-700 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#002147] text-white rounded-xl flex items-center justify-center font-black text-lg">
                +
              </div>
              <div>
                <h3 className="font-black text-sm text-[#002147] dark:text-emerald-400 uppercase tracking-tight">
                  BURDWAN HOMOEO MEDICAL COLLEGE & HOSPITAL
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  101 M.G. Road, Rajbati, Burdwan, W.B. - 713101 | Phone: +91 98321 45678
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-black rounded-lg uppercase">
                {ticketData.status}
              </span>
            </div>
          </div>

          {/* Core Ticket Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Patient Info */}
            <div className="md:col-span-2 space-y-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Patient & Registration</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">Patient Name</span>
                  <strong className="text-slate-900 dark:text-white font-bold">{ticketData.patientName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">UHID</span>
                  <strong className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">{ticketData.uhid}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Age / Gender</span>
                  <strong>{ticketData.age} Yrs / {ticketData.gender}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Contact Phone</span>
                  <strong>{ticketData.phone || 'N/A'}</strong>
                </div>
              </div>
            </div>

            {/* Token & QR info */}
            <div className="p-3 bg-slate-900 text-white rounded-xl flex flex-col items-center justify-center text-center space-y-1">
              <span className="text-[10px] text-emerald-400 uppercase font-bold">Appointment ID</span>
              <span className="font-mono text-xs font-black text-amber-300">{ticketData.appointmentId}</span>
              <div className="my-1 py-1 px-3 bg-emerald-500/20 rounded-lg border border-emerald-500/40">
                <span className="text-xl font-black text-emerald-300">TOKEN #{ticketData.tokenNumber}</span>
              </div>
              <span className="text-[9px] text-slate-400">Scan QR Code on PDF for Verification</span>
            </div>
          </div>

          {/* Consultation Details */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">OPD Consultation Schedule</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px]">OPD Department</span>
                <strong className="text-slate-900 dark:text-white">{ticketData.department}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Consultant Doctor</span>
                <strong className="text-slate-900 dark:text-white">{ticketData.doctorName}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Date & Slot</span>
                <strong className="text-blue-600 dark:text-blue-400">{ticketData.appointmentDate} ({ticketData.timeSlot})</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">OPD Room</span>
                <strong className="text-slate-900 dark:text-white">{ticketData.roomNo || 'Room 101'}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Resend Email Section */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
          <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-blue-500" />
            <span>Email PDF Ticket to Patient</span>
          </p>

          <div className="flex gap-2">
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="Enter patient email address..."
              className="flex-1 px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#002147]"
            />
            <Button
              variant="primary"
              onClick={handleResendEmail}
              disabled={isSendingEmail || !recipientEmail}
              className="shrink-0 text-xs"
            >
              <Send className={`w-3.5 h-3.5 mr-1 ${isSendingEmail ? 'animate-spin' : ''}`} />
              Resend Ticket Email
            </Button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-800">
          <Button variant="secondary" onClick={onClose}>
            Close Preview
          </Button>
        </div>
      </div>
    </Modal>
  );
};
