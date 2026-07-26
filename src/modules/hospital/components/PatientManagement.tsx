import React, { useState } from 'react';
import { Card } from '../../../components/common/Card';
import { Input } from '../../../components/common/Input';
import { Select } from '../../../components/common/Select';
import { Badge } from '../../../components/common/Badge';
import { Modal } from '../../../components/common/Modal';
import { Button } from '../../../components/common/Button';
import { Patient } from '../../../types/hospital';
import { hospitalCoreService } from '../../../services/hospitalCoreService';
import {
  Search,
  UserPlus,
  UserCheck,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  FileText,
  Activity,
  History,
  AlertCircle,
  QrCode,
  Printer,
  ShieldAlert,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface PatientManagementProps {
  onIssueTokenForPatient?: (patient: Patient) => void;
}

export const PatientManagement: React.FC<PatientManagementProps> = ({ onIssueTokenForPatient }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // New Patient Registration State
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: 'Male',
    phone: '',
    email: '',
    address: '',
    bloodGroup: 'B+',
    category: 'General',
    emergencyContactName: '',
    emergencyContactPhone: '',
    medicalHistory: '',
    allergies: '',
  });

  const patients = hospitalCoreService.getPatients(searchQuery, genderFilter, categoryFilter);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.age || !formData.phone || !formData.address) {
      toast.error('Please fill in all mandatory patient details.');
      return;
    }

    const created = hospitalCoreService.registerPatient({
      fullName: formData.fullName,
      age: parseInt(formData.age) || 25,
      gender: formData.gender as any,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      bloodGroup: formData.bloodGroup,
      category: formData.category as any,
      emergencyContactName: formData.emergencyContactName,
      emergencyContactPhone: formData.emergencyContactPhone,
      medicalHistory: formData.medicalHistory,
      allergies: formData.allergies,
    });

    toast.success(`Patient Registered Successfully! UHID: ${created.uhid}`);
    setIsRegisterModalOpen(false);
    setSelectedPatient(created);
    setFormData({
      fullName: '',
      age: '',
      gender: 'Male',
      phone: '',
      email: '',
      address: '',
      bloodGroup: 'B+',
      category: 'General',
      emergencyContactName: '',
      emergencyContactPhone: '',
      medicalHistory: '',
      allergies: '',
    });
  };

  const handlePrintUhidCard = (patient: Patient) => {
    toast.success(`Printing UHID Card for ${patient.fullName}...`);
  };

  return (
    <div className="space-y-6">
      {/* Header & Registration Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Patient Search & Registration</h2>
          <p className="text-xs text-slate-500">
            Lookup patient history by UHID/Phone or register new OPD patients
          </p>
        </div>

        <button
          onClick={() => setIsRegisterModalOpen(true)}
          className="flex items-center gap-2 bg-[#002147] hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-sm cursor-pointer"
        >
          <UserPlus className="w-4 h-4 text-[#00A651]" />
          <span>Register New Patient</span>
        </button>
      </div>

      {/* Filter Controls */}
      <Card className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Patient UHID (e.g., BHMC-2026-0001), Name, or Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#002147]"
            />
          </div>

          <Select
            options={[
              { value: 'ALL', label: 'All Genders' },
              { value: 'Male', label: 'Male' },
              { value: 'Female', label: 'Female' },
              { value: 'Other', label: 'Other' },
            ]}
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
          />

          <Select
            options={[
              { value: 'ALL', label: 'All Categories' },
              { value: 'General', label: 'General' },
              { value: 'BPL', label: 'BPL Free Scheme' },
              { value: 'Staff', label: 'Hospital Staff' },
              { value: 'Student', label: 'College Student' },
            ]}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          />
        </div>
      </Card>

      {/* Patient Search Results Table + Profile Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table List */}
        <Card className="lg:col-span-2 p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Found {patients.length} Registered Patients
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-black">
                  <th className="py-2.5 px-3">Patient Name & UHID</th>
                  <th className="py-2.5 px-3">Age / Gender</th>
                  <th className="py-2.5 px-3">Phone</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {patients.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 italic">
                      No matching patients found. Click 'Register New Patient' to add them.
                    </td>
                  </tr>
                ) : (
                  patients.map((pat) => {
                    const isSelected = selectedPatient?.id === pat.id;
                    return (
                      <tr
                        key={pat.id}
                        onClick={() => setSelectedPatient(pat)}
                        className={`hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer transition ${
                          isSelected ? 'bg-blue-50/70 dark:bg-blue-950/40 font-medium' : ''
                        }`}
                      >
                        <td className="py-3 px-3">
                          <p className="font-bold text-slate-900 dark:text-white">{pat.fullName}</p>
                          <p className="text-[10px] font-extrabold text-[#002147] dark:text-blue-400">{pat.uhid}</p>
                        </td>
                        <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                          {pat.age} Yrs • {pat.gender}
                        </td>
                        <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{pat.phone}</td>
                        <td className="py-3 px-3">
                          <Badge variant={pat.category === 'BPL' ? 'warning' : 'primary'}>{pat.category}</Badge>
                        </td>
                        <td className="py-3 px-3 text-right space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPatient(pat);
                            }}
                            className="px-2.5 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 transition"
                          >
                            Profile
                          </button>
                          {onIssueTokenForPatient && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onIssueTokenForPatient(pat);
                              }}
                              className="px-2.5 py-1 text-[11px] font-bold text-white bg-[#00A651] rounded-lg hover:bg-emerald-600 transition"
                            >
                              Issue Token
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Selected Patient Detailed Profile View */}
        <Card className="p-5 space-y-4">
          {!selectedPatient ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <UserCheck className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs font-semibold">Select a patient from the search list to inspect profile & records.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Profile Card Header */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#002147] to-slate-900 text-white space-y-3 relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                      Patient Digital Record
                    </span>
                    <h3 className="font-extrabold text-base leading-tight mt-0.5">{selectedPatient.fullName}</h3>
                    <p className="text-xs text-amber-300 font-mono font-bold mt-1">{selectedPatient.uhid}</p>
                  </div>
                  <Badge variant="accent">{selectedPatient.category}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-white/10 text-slate-200">
                  <p>
                    <span className="text-slate-400">Age/Sex:</span> {selectedPatient.age} Yrs ({selectedPatient.gender})
                  </p>
                  <p>
                    <span className="text-slate-400">Blood Group:</span> {selectedPatient.bloodGroup}
                  </p>
                  <p className="col-span-2">
                    <span className="text-slate-400">Phone:</span> {selectedPatient.phone}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePrintUhidCard(selectedPatient)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold hover:bg-slate-200 transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print UHID Card</span>
                </button>
                {onIssueTokenForPatient && (
                  <button
                    onClick={() => onIssueTokenForPatient(selectedPatient)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-[#00A651] text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>OPD Token</span>
                  </button>
                )}
              </div>

              {/* Demographics & Medical History */}
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-1">
                  <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>Residential Address</span>
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 pl-5">{selectedPatient.address}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-1">
                  <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                    <span>Known Medical History & Miasms</span>
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 pl-5">
                    {selectedPatient.medicalHistory || 'No prior chronic conditions recorded.'}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-1">
                  <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                    <span>Known Allergies</span>
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 pl-5">{selectedPatient.allergies || 'Nil'}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-1">
                  <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Emergency Contact</span>
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 pl-5">
                    {selectedPatient.emergencyContactName || 'N/A'} ({selectedPatient.emergencyContactPhone || 'N/A'})
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* New Patient Registration Modal */}
      <Modal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        title="Register New OPD Patient"
        className="max-w-2xl"
      >
        <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Full Patient Name *"
              placeholder="e.g. Smt. Bratati Chatterji"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                label="Age (Years) *"
                type="number"
                placeholder="35"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                required
              />
              <Select
                label="Gender *"
                options={[
                  { value: 'Male', label: 'Male' },
                  { value: 'Female', label: 'Female' },
                  { value: 'Other', label: 'Other' },
                ]}
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              />
            </div>

            <Input
              label="Phone Number *"
              placeholder="10-digit mobile number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />

            <Select
              label="Category Scheme *"
              options={[
                { value: 'General', label: 'General OPD (Fee ₹20)' },
                { value: 'BPL', label: 'BPL Card Holder (Free)' },
                { value: 'Staff', label: 'College Staff / Dependent (Free)' },
                { value: 'Student', label: 'BHMC Student (Free)' },
              ]}
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />

            <Select
              label="Blood Group"
              options={[
                { value: 'A+', label: 'A+' },
                { value: 'A-', label: 'A-' },
                { value: 'B+', label: 'B+' },
                { value: 'B-', label: 'B-' },
                { value: 'O+', label: 'O+' },
                { value: 'O-', label: 'O-' },
                { value: 'AB+', label: 'AB+' },
                { value: 'AB-', label: 'AB-' },
              ]}
              value={formData.bloodGroup}
              onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
            />

            <Input
              label="Email Address (Optional)"
              type="email"
              placeholder="patient@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <Input
            label="Full Residential Address *"
            placeholder="House no, Street name, Village/City, District & PIN"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Emergency Contact Person"
              placeholder="Guardian / Spouse Name"
              value={formData.emergencyContactName}
              onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
            />
            <Input
              label="Emergency Contact Phone"
              placeholder="Alternative mobile number"
              value={formData.emergencyContactPhone}
              onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Chronic Medical History / Notes"
              placeholder="e.g. Asthma, Diabetes, Hypertension"
              value={formData.medicalHistory}
              onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
            />
            <Input
              label="Known Drug / Food Allergies"
              placeholder="e.g. Dust, Pollen, NSAIDs"
              value={formData.allergies}
              onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="secondary" onClick={() => setIsRegisterModalOpen(false)} type="button">
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Complete Registration & Issue UHID
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
