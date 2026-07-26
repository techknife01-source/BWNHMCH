import React, { useState } from 'react';
import {
  Pill,
  Search,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Truck,
  Building2,
  FileText,
  Clock,
  TrendingUp,
  Download,
  ShoppingBag,
} from 'lucide-react';

interface MedicineItem {
  id: string;
  itemCode: string;
  remedyName: string;
  potency: 'Q' | '6CH' | '30CH' | '200CH' | '1M' | '10M' | '3X' | '6X' | '12X';
  category: 'MOTHER_TINCTURE' | 'DILUTION' | 'BIOCHEMIC' | 'TRITURATION' | 'OINTMENT';
  batchNo: string;
  expiryDate: string;
  stockQty: number;
  unit: 'BOTTLE_100ML' | 'BOTTLE_30ML' | 'PACK_25G' | 'TUBE';
  minThreshold: number;
  pricePerUnit: number;
  locationRack: string;
}

interface PharmacyDispense {
  id: string;
  tokenNo: string;
  uhid: string;
  patientName: string;
  doctorName: string;
  prescriptionDetails: string;
  dispensedDate: string;
  totalAmount: number;
  status: 'DISPENSED' | 'PENDING';
}

export const PharmacyErpView: React.FC = () => {
  const [medicines, setMedicines] = useState<MedicineItem[]>([
    {
      id: 'MED-001',
      itemCode: 'HOM-ARN-Q',
      remedyName: 'Arnica Montana',
      potency: 'Q',
      category: 'MOTHER_TINCTURE',
      batchNo: 'BAT-2026-042',
      expiryDate: '2028-11-30',
      stockQty: 48,
      unit: 'BOTTLE_100ML',
      minThreshold: 10,
      pricePerUnit: 140,
      locationRack: 'PHARM-A1-02',
    },
    {
      id: 'MED-002',
      itemCode: 'HOM-NUX-30',
      remedyName: 'Nux Vomica',
      potency: '30CH',
      category: 'DILUTION',
      batchNo: 'BAT-2026-089',
      expiryDate: '2029-05-31',
      stockQty: 8,
      unit: 'BOTTLE_30ML',
      minThreshold: 15,
      pricePerUnit: 65,
      locationRack: 'PHARM-B2-05',
    },
    {
      id: 'MED-003',
      itemCode: 'HOM-BIO-CP6',
      remedyName: 'Calcarea Phosphorica',
      potency: '6X',
      category: 'BIOCHEMIC',
      batchNo: 'BAT-2025-110',
      expiryDate: '2026-09-30',
      stockQty: 22,
      unit: 'PACK_25G',
      minThreshold: 20,
      pricePerUnit: 85,
      locationRack: 'PHARM-C1-01',
    },
    {
      id: 'MED-004',
      itemCode: 'HOM-RHU-200',
      remedyName: 'Rhus Toxicodendron',
      potency: '200CH',
      category: 'DILUTION',
      batchNo: 'BAT-2026-012',
      expiryDate: '2029-01-15',
      stockQty: 35,
      unit: 'BOTTLE_30ML',
      minThreshold: 10,
      pricePerUnit: 70,
      locationRack: 'PHARM-B2-08',
    },
  ]);

  const [dispenses, setDispenses] = useState<PharmacyDispense[]>([
    {
      id: 'DISP-001',
      tokenNo: 'TK-102',
      uhid: 'UHID-2026-8812',
      patientName: 'Subhasish Ghosh',
      doctorName: 'Dr. Debabrata Sen (HOD Organon)',
      prescriptionDetails: 'Arnica Montana Q (10 drops bd) + Calcarea Phos 6X (4 tabs bd)',
      dispensedDate: '2026-07-25 10:30 AM',
      totalAmount: 180,
      status: 'DISPENSED',
    },
  ]);

  const [activeTab, setActiveTab] = useState<'inventory' | 'dispense' | 'alerts' | 'suppliers'>('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Dispense Form
  const [dispenseToken, setDispenseToken] = useState('');
  const [dispenseRemedy, setDispenseRemedy] = useState('');

  const filteredMeds = medicines.filter((m) => {
    const matchesQuery =
      m.remedyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.itemCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.batchNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || m.category === categoryFilter;
    return matchesQuery && matchesCat;
  });

  const lowStockMeds = medicines.filter((m) => m.stockQty <= m.minThreshold);

  const handleDispenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispenseToken || !dispenseRemedy) return;

    const newDispense: PharmacyDispense = {
      id: `DISP-${Date.now()}`,
      tokenNo: dispenseToken,
      uhid: `UHID-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName: 'OPD Patient (' + dispenseToken + ')',
      doctorName: 'OPD Duty Medical Officer',
      prescriptionDetails: dispenseRemedy,
      dispensedDate: new Date().toLocaleString(),
      totalAmount: 120,
      status: 'DISPENSED',
    };

    setDispenses([newDispense, ...dispenses]);
    setDispenseToken('');
    setDispenseRemedy('');
    alert('Medicines dispensed successfully to OPD Patient!');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#001833] text-white p-6 rounded-2xl shadow-md border border-blue-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-500 text-white font-extrabold text-[10px] rounded-full uppercase">
              HOSPITAL PHARMACY ERP
            </span>
            <span className="text-xs text-blue-200">• Homoeopathic Dispensary Register</span>
          </div>
          <h2 className="text-2xl font-black mt-1">Central Pharmacy & Remedy Store Terminal</h2>
          <p className="text-xs text-blue-200">
            Mother Tinctures, Potentized Dilutions, Biochemic Salts, Expiry Batch Alerts & OPD Dispensing Counter
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Opening Add Stock Batch Modal...')}
            className="px-4 py-2 bg-[#00A651] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Stock Batch</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 rounded-lg transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'inventory'
              ? 'bg-[#002147] text-white'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Pill className="w-4 h-4 text-emerald-400" />
          <span>Medicine Inventory ({medicines.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('dispense')}
          className={`px-4 py-2 rounded-lg transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'dispense'
              ? 'bg-[#002147] text-white'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-amber-400" />
          <span>OPD Dispensing Counter</span>
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-4 py-2 rounded-lg transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'alerts'
              ? 'bg-[#002147] text-white'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <span>Low Stock & Expiry Alerts ({lowStockMeds.length})</span>
        </button>
      </div>

      {/* Inventory View */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row gap-3 text-xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search remedy name, item code or batch number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
            >
              <option value="ALL">All Categories</option>
              <option value="MOTHER_TINCTURE">Mother Tinctures (Q)</option>
              <option value="DILUTION">Dilutions (CH)</option>
              <option value="BIOCHEMIC">Biochemic Salts (X)</option>
              <option value="TRITURATION">Trituration Tablets</option>
            </select>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200 dark:border-slate-800">
                    <th className="p-3">Item Code</th>
                    <th className="p-3">Remedy Name & Potency</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Batch & Expiry</th>
                    <th className="p-3">Stock Quantity</th>
                    <th className="p-3">Location Rack</th>
                    <th className="p-3 text-right">Price / Unit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
                  {filteredMeds.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-mono font-bold text-blue-600">{m.itemCode}</td>
                      <td className="p-3">
                        <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{m.remedyName}</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px]">
                            {m.potency}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 font-bold text-slate-600 dark:text-slate-400">{m.category}</td>
                      <td className="p-3 font-mono text-[10px] text-slate-500">
                        <div>Batch: {m.batchNo}</div>
                        <div>Exp: {m.expiryDate}</div>
                      </td>
                      <td className="p-3">
                        {m.stockQty <= m.minThreshold ? (
                          <span className="font-extrabold text-red-600 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> {m.stockQty} {m.unit} (LOW)
                          </span>
                        ) : (
                          <span className="font-bold text-emerald-600">
                            {m.stockQty} {m.unit}
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-mono text-slate-500">{m.locationRack}</td>
                      <td className="p-3 font-extrabold text-right">₹{m.pricePerUnit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Dispense View */}
      {activeTab === 'dispense' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-500" />
              <span>Dispense Remedy Counter</span>
            </h3>

            <form onSubmit={handleDispenseSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  OPD Ticket Token No
                </label>
                <input
                  type="text"
                  placeholder="e.g. TK-105"
                  value={dispenseToken}
                  onChange={(e) => setDispenseToken(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Prescription Remedy Details
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Nux Vomica 30CH (4 pills tds) + Rhus Tox 200CH"
                  value={dispenseRemedy}
                  onChange={(e) => setDispenseRemedy(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#00A651] hover:bg-emerald-600 text-white font-bold rounded-xl transition cursor-pointer"
              >
                Confirm Dispense & Deduct Stock
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Dispensing Audit History</h3>
            <div className="space-y-3 text-xs">
              {dispenses.map((d) => (
                <div key={d.id} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700/60 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono font-bold text-blue-600">{d.tokenNo}</span>
                      <h4 className="font-extrabold text-slate-900 dark:text-white">{d.patientName}</h4>
                      <p className="text-[10px] text-slate-400">{d.doctorName}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full">
                      DISPENSED
                    </span>
                  </div>
                  <p className="font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800 font-mono text-[11px]">
                    {d.prescriptionDetails}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Alerts View */}
      {activeTab === 'alerts' && (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white text-red-600 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span>Low Stock Re-order Threshold Warnings</span>
          </h3>

          <div className="space-y-3 text-xs">
            {lowStockMeds.map((m) => (
              <div key={m.id} className="p-4 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-900 flex justify-between items-center">
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white">{m.remedyName} ({m.potency})</h4>
                  <p className="text-[10px] text-slate-500">Current Stock: {m.stockQty} {m.unit} | Minimum Threshold: {m.minThreshold}</p>
                </div>
                <button
                  onClick={() => alert(`Purchase Order created for ${m.remedyName}...`)}
                  className="px-4 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 cursor-pointer"
                >
                  Create Purchase Requisition
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
