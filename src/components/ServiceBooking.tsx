/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ServiceBooking } from '../types';
import { MOCK_BOOKINGS } from '../data/mockData';
import { CheckCircle, UploadCloud, Calendar as CalendarIcon, Clock, ChevronRight, FileText, Check, Landmark, Award } from 'lucide-react';

export const ServiceBookingModule: React.FC<{ studentId: string; studentName: string }> = ({
  studentId,
  studentName
}) => {
  const [bookings, setBookings] = useState<ServiceBooking[]>(MOCK_BOOKINGS);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedService, setSelectedService] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [successBooking, setSuccessBooking] = useState<ServiceBooking | null>(null);

  // Form files state
  const [isDragging, setIsDragging] = useState(false);

  const services = [
    { id: 'transcript', name: 'Academic Transcript Issue', desc: 'Official transcripts of all professional BHMS years.', docs: ['BHMS I, II, III & IV Marksheets', 'College ID Card'] },
    { id: 'noc', name: 'NOC for Hospital Internship', desc: 'No-Objection Certificate for rotational internship at associated hospitals.', docs: ['BHMS Provisional Pass Certificate', 'Clinical Posting Logbook Copy'] },
    { id: 'lib', name: 'Library Card Extension', desc: 'Requesting permission to issue 4 standard homeopathic text books.', docs: ['Current Library Card Receipt'] },
    { id: 'scholarship', name: 'Scholarship Application Verification', desc: 'Verification of state or national AYUSH merit scholarships.', docs: ['Income Certificate', 'NEET Rank Card', 'Aadhar Card'] }
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = (Array.from(e.dataTransfer.files) as File[]).map(f => f.name);
      setUploadedFiles(prev => [...prev, ...filesArray]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = (Array.from(e.target.files) as File[]).map(f => f.name);
      setUploadedFiles(prev => [...prev, ...filesArray]);
    }
  };

  const clearFiles = () => {
    setUploadedFiles([]);
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !selectedService) return;
    if (currentStep === 2 && uploadedFiles.length === 0) return;
    if (currentStep === 3 && (!selectedDate || !selectedTime)) return;
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleConfirmBooking = () => {
    const newBooking: ServiceBooking = {
      id: `bk_${Date.now()}`,
      serviceType: selectedService,
      studentId,
      studentName,
      bookingDate: new Date().toISOString().split('T')[0],
      prefDate: selectedDate,
      prefTime: selectedTime,
      documentsUploaded: uploadedFiles,
      status: 'Pending',
      history: [
        {
          status: 'Submitted',
          note: 'Request initiated by student with necessary documents.',
          date: new Date().toISOString().split('T')[0]
        }
      ]
    };

    setBookings([newBooking, ...bookings]);
    setSuccessBooking(newBooking);
    setCurrentStep(5); // Show success/confirmation
  };

  const handleResetWizard = () => {
    setCurrentStep(1);
    setSelectedService('');
    setUploadedFiles([]);
    setSelectedDate('');
    setSelectedTime('');
    setSuccessBooking(null);
  };

  return (
    <div className="space-y-8" id="booking_module_root">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 font-sans tracking-tight">
            Student Service Booking Center
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Apply, submit verification papers, and trace student welfare & clinical certificates live.
          </p>
        </div>
        <button
          onClick={handleResetWizard}
          className="px-4 py-2 text-xs font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition"
        >
          New Document Request
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT/MAIN COLUMN: SERVICE WIZARD */}
        <div className="lg:col-span-2 space-y-6">
          {/* STEP INDICATOR */}
          {currentStep <= 4 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between text-3xs font-bold uppercase tracking-wider text-slate-400">
                <span className={currentStep >= 1 ? 'text-blue-600' : ''}>1. Service</span>
                <ChevronRight className="w-4 h-4" />
                <span className={currentStep >= 2 ? 'text-blue-600' : ''}>2. Documents</span>
                <ChevronRight className="w-4 h-4" />
                <span className={currentStep >= 3 ? 'text-blue-600' : ''}>3. Schedule</span>
                <ChevronRight className="w-4 h-4" />
                <span className={currentStep >= 4 ? 'text-blue-600' : ''}>4. Verify</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-blue-600 h-full transition-all duration-300"
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* STEP 1: SELECT SERVICE */}
          {currentStep === 1 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                Select Required Service
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {services.map(s => (
                  <label
                    key={s.id}
                    onClick={() => setSelectedService(s.name)}
                    className={`p-4 border rounded-xl flex items-start space-x-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all ${
                      selectedService === s.name
                        ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/20'
                        : 'border-slate-100 dark:border-slate-800'
                    }`}
                  >
                    <input
                      type="radio"
                      name="selected_service"
                      checked={selectedService === s.name}
                      onChange={() => setSelectedService(s.name)}
                      className="mt-1 accent-blue-600"
                    />
                    <div className="space-y-1">
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">
                        {s.name}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 block">
                        {s.desc}
                      </span>
                      <div className="flex flex-wrap gap-1.5 pt-1.5">
                        {s.docs.map((d, i) => (
                          <span
                            key={i}
                            className="text-3xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                          >
                            Requires: {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex justify-end pt-2">
                <button
                  disabled={!selectedService}
                  onClick={handleNextStep}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center space-x-1.5"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: UPLOAD DOCUMENTS */}
          {currentStep === 2 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-5">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                  Upload Required Credentials
                </h3>
                <p className="text-xs text-slate-400">
                  Please upload PDFs, high-quality JPGs or marksheets supporting: <span className="font-semibold text-slate-600 dark:text-slate-300">"{selectedService}"</span>
                </p>
              </div>

              {/* Drag Drop Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50/20 dark:bg-blue-950/10'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <UploadCloud className="w-10 h-10 text-slate-400" />
                  <span className="text-xs text-slate-600 dark:text-slate-300 block">
                    Drag and drop your transcript/identity files here or
                  </span>
                  <label className="px-3 py-1.5 rounded-lg text-2xs font-bold text-white bg-slate-700 dark:bg-slate-800 hover:brightness-110 cursor-pointer transition">
                    Browse Files
                    <input
                      type="file"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                      accept=".pdf,.png,.jpg,.jpeg"
                    />
                  </label>
                  <span className="text-3xs text-slate-400 block">
                    Supported: PDF, JPG, PNG (Max 5MB each)
                  </span>
                </div>
              </div>

              {/* Uploaded File List */}
              {uploadedFiles.length > 0 && (
                <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-2xs font-semibold text-slate-500 dark:text-slate-400">
                      Uploaded Documents ({uploadedFiles.length})
                    </span>
                    <button
                      onClick={clearFiles}
                      className="text-3xs font-bold text-rose-500 hover:underline"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {uploadedFiles.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg"
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                          <span className="text-xs font-mono text-slate-700 dark:text-slate-300 truncate">
                            {f}
                          </span>
                        </div>
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-2">
                <button
                  onClick={handlePrevStep}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 transition"
                >
                  Back
                </button>
                <button
                  disabled={uploadedFiles.length === 0}
                  onClick={handleNextStep}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center space-x-1.5"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SCHEDULE DATE AND TIME */}
          {currentStep === 3 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-5">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                Select Verification Schedule
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date Input */}
                <div className="space-y-2">
                  <label className="text-2xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    <span>Preferred Appointment Date</span>
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    min="2026-07-20"
                    onChange={e => setSelectedDate(e.target.value)}
                    className="w-full p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-3xs text-slate-400 block">
                    Note: Document counters open Monday - Friday.
                  </span>
                </div>

                {/* Time Slot Selection */}
                <div className="space-y-2">
                  <label className="text-2xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Select Time Slot</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM'].map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setSelectedTime(t)}
                        className={`p-3 border rounded-xl text-xs font-semibold text-center transition ${
                          selectedTime === t
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                            : 'border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  onClick={handlePrevStep}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 transition"
                >
                  Back
                </button>
                <button
                  disabled={!selectedDate || !selectedTime}
                  onClick={handleNextStep}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center space-x-1.5"
                >
                  <span>Review Booking</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: CONFIRMATION PREVIEW */}
          {currentStep === 4 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                  Review & Sign Submission
                </h3>
                <p className="text-xs text-slate-400">
                  Verify the information before signing and routing to the college administrative queue.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl space-y-1.5">
                  <span className="text-3xs font-bold text-slate-400 uppercase block">Requested Service</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">{selectedService}</span>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl space-y-1.5">
                  <span className="text-3xs font-bold text-slate-400 uppercase block">Verification Appointment</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">
                    {selectedDate} at {selectedTime}
                  </span>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl space-y-1.5 md:col-span-2">
                  <span className="text-3xs font-bold text-slate-400 uppercase block">Uploaded Documents ({uploadedFiles.length})</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {uploadedFiles.map((f, i) => (
                      <span
                        key={i}
                        className="text-3xs font-mono font-medium px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 inline-flex items-center space-x-1"
                      >
                        <FileText className="w-3 h-3 text-blue-500" />
                        <span>{f}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-blue-50/40 dark:bg-blue-950/20 border border-blue-100/40 dark:border-blue-900/40 p-4 rounded-xl flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="agree_terms"
                  defaultChecked
                  className="mt-1 accent-blue-600"
                />
                <label htmlFor="agree_terms" className="text-2xs text-slate-500 dark:text-slate-400 leading-relaxed cursor-pointer select-none">
                  I solemnly declare that the attached marksheet uploads and registration numbers match my genuine academic identity issued by the National Commission for Homoeopathy.
                </label>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  onClick={handlePrevStep}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirmBooking}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 transition"
                >
                  Submit Application
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: SUCCESS & STATUS TIMELINE DISPLAY */}
          {currentStep === 5 && successBooking && (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-2xl shadow-sm space-y-6 text-center">
              <div className="mx-auto w-12 h-12 bg-emerald-100 dark:bg-emerald-950/60 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <CheckCircle className="w-8 h-8 animate-bounce" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  Application Logged Successfully
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Your request for <span className="font-bold text-slate-700 dark:text-slate-300">"{successBooking.serviceType}"</span> has been logged under ID <span className="font-mono text-blue-600 font-bold">{successBooking.id}</span>.
                </p>
              </div>

              <div className="border border-slate-50 dark:border-slate-800/80 rounded-xl p-4 max-w-sm mx-auto text-left space-y-2">
                <div className="flex justify-between text-2xs font-medium text-slate-400">
                  <span>Student</span>
                  <span className="text-slate-800 dark:text-slate-200 font-bold">{successBooking.studentName}</span>
                </div>
                <div className="flex justify-between text-2xs font-medium text-slate-400">
                  <span>Audit Slot</span>
                  <span className="text-slate-800 dark:text-slate-200 font-bold">
                    {successBooking.prefDate} at {successBooking.prefTime}
                  </span>
                </div>
                <div className="flex justify-between text-2xs font-medium text-slate-400">
                  <span>Queue Status</span>
                  <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 font-bold text-3xs uppercase">
                    {successBooking.status}
                  </span>
                </div>
              </div>

              <div className="flex justify-center space-x-3 pt-2">
                <button
                  onClick={handleResetWizard}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 transition"
                >
                  Create Another Request
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: BOOKINGS HISTORY & LIVE TIMELINE */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
              Pending Applications Status
            </h3>

            <div className="space-y-3">
              {bookings.map(b => (
                <div
                  key={b.id}
                  className="p-3.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-100/40 dark:border-slate-800 rounded-xl space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block leading-tight">
                        {b.serviceType}
                      </span>
                      <span className="text-3xs font-mono text-slate-400 block mt-0.5">
                        ID: {b.id} • {b.bookingDate}
                      </span>
                    </div>
                    <span
                      className={`text-3xs font-bold px-2 py-0.5 rounded uppercase shrink-0 ${
                        b.status === 'Completed'
                          ? 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/20'
                          : b.status === 'Approved'
                          ? 'text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/20'
                          : 'text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/20'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>

                  {/* MINI STATUS TIMELINE */}
                  <div className="border-t border-slate-100 dark:border-slate-800/80 pt-2.5 space-y-2">
                    <span className="text-3xs font-bold uppercase tracking-wider text-slate-400 block">
                      History Timeline
                    </span>
                    <div className="relative pl-4 space-y-2.5 border-l border-slate-200 dark:border-slate-800 ml-1.5">
                      {b.history.map((h, hIdx) => (
                        <div key={hIdx} className="relative">
                          {/* Circle marker */}
                          <span className="absolute -left-[20.5px] top-1 w-2.5 h-2.5 rounded-full border bg-white dark:bg-slate-900 border-blue-500"></span>
                          <div>
                            <span className="text-3xs font-bold text-slate-700 dark:text-slate-300 block leading-none">
                              {h.status}
                            </span>
                            <span className="text-3xs text-slate-500 dark:text-slate-400 block mt-0.5 leading-tight">
                              {h.note}
                            </span>
                            <span className="text-4xs text-slate-400 block mt-0.5">
                              {h.date}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
