import React, { useState } from 'react';
import { PharmacyItem } from '../types';
import { Pill, AlertTriangle, Search, Plus, CheckCircle, PackageCheck, ShoppingCart } from 'lucide-react';

interface PharmacyModuleProps {
  inventory: PharmacyItem[];
  onUpdateInventory: (items: PharmacyItem[]) => void;
}

export const PharmacyModule: React.FC<PharmacyModuleProps> = ({ inventory, onUpdateInventory }) => {
  const [items, setItems] = useState<PharmacyItem[]>(inventory);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [newItem, setNewItem] = useState<Partial<PharmacyItem>>({
    name: '',
    potency: '30C',
    form: 'Dilution',
    batchNo: `TH-${new Date().getFullYear()}-01`,
    expiryDate: '2028-12-31',
    stockQuantity: 100,
    reorderLevel: 20,
    pricePerUnit: 75
  });

  const filteredItems = items.filter(
    i => i.name.toLowerCase().includes(search.toLowerCase()) || i.batchNo.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const createdItem: PharmacyItem = {
      id: `ph_${Date.now()}`,
      name: newItem.name || 'Unnamed Remedy',
      potency: newItem.potency || '30C',
      form: (newItem.form as any) || 'Dilution',
      batchNo: newItem.batchNo || 'BATCH-00',
      expiryDate: newItem.expiryDate || '2029-12-31',
      stockQuantity: newItem.stockQuantity || 50,
      reorderLevel: newItem.reorderLevel || 15,
      pricePerUnit: newItem.pricePerUnit || 50
    };

    const updated = [createdItem, ...items];
    setItems(updated);
    onUpdateInventory(updated);
    setShowAddModal(false);
  };

  const updateQuantity = (id: string, delta: number) => {
    const updated = items.map(item => {
      if (item.id === id) {
        return { ...item, stockQuantity: Math.max(0, item.stockQuantity + delta) };
      }
      return item;
    });
    setItems(updated);
    onUpdateInventory(updated);
  };

  const lowStockCount = items.filter(i => i.stockQuantity <= i.reorderLevel).length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HEADER & ALERTS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-[#002147] dark:text-blue-400" />
            <h3 className="text-sm font-black uppercase tracking-wider text-[#002147] dark:text-white">
              BHMCH Hospital Pharmacy & Stock Dispensary
            </h3>
          </div>
          <p className="text-3xs text-slate-400 mt-1">
            Real-time tracking of homoeopathic dilutions, mother tinctures, triturations, and globules.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {lowStockCount > 0 && (
            <span className="px-3 py-1.5 bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800 rounded-2xl text-4xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>{lowStockCount} Low Stock Alerts</span>
            </span>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#002147] hover:bg-[#001833] text-white font-bold text-3xs uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Stock Batch</span>
          </button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search medicine, batch number..."
            className="w-full pl-9 pr-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-xl text-3xs bg-transparent focus:outline-none focus:border-[#002147]"
          />
        </div>
        <span className="text-4xs font-mono text-slate-400 font-bold uppercase">
          Total SKUs: {items.length}
        </span>
      </div>

      {/* INVENTORY TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl overflow-x-auto text-2xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-4xs font-bold uppercase tracking-wider">
              <th className="py-2.5">Remedy Name</th>
              <th className="py-2.5">Potency & Form</th>
              <th className="py-2.5">Batch No</th>
              <th className="py-2.5">Expiry Date</th>
              <th className="py-2.5">Price / Unit</th>
              <th className="py-2.5">In-Stock Qty</th>
              <th className="py-2.5 text-right">Stock Control</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(item => {
              const isLow = item.stockQuantity <= item.reorderLevel;
              return (
                <tr key={item.id} className="border-b border-slate-50 dark:border-slate-850 hover:bg-slate-50/50">
                  <td className="py-3 font-bold text-slate-800 dark:text-slate-100">{item.name}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 rounded text-4xs font-mono font-bold">
                      {item.potency} ({item.form})
                    </span>
                  </td>
                  <td className="py-3 font-mono text-slate-500 text-3xs">{item.batchNo}</td>
                  <td className="py-3 font-mono text-slate-500 text-3xs">{item.expiryDate}</td>
                  <td className="py-3 font-bold text-slate-700 dark:text-slate-300">₹{item.pricePerUnit}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-4xs font-mono font-bold ${
                        isLow ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {item.stockQuantity} Units {isLow && '⚠️'}
                    </span>
                  </td>
                  <td className="py-3 text-right space-x-1 whitespace-nowrap">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded font-bold text-4xs"
                    >
                      - Dispense
                    </button>
                    <button
                      onClick={() => updateQuantity(item.id, 10)}
                      className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950 text-4xs font-bold rounded"
                    >
                      + Refill
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ADD ITEM MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h4 className="text-sm font-black text-[#002147] dark:text-white uppercase">Add Pharmacy Stock Batch</h4>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4 text-3xs font-bold uppercase text-slate-500">
              <div className="space-y-1">
                <label>Remedy Name</label>
                <input
                  type="text"
                  required
                  value={newItem.name}
                  onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="e.g. Bryonia Alba"
                  className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-2xs bg-transparent focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label>Potency</label>
                  <input
                    type="text"
                    required
                    value={newItem.potency}
                    onChange={e => setNewItem({ ...newItem, potency: e.target.value })}
                    placeholder="30C / 200C / 1M"
                    className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-2xs bg-transparent focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label>Form</label>
                  <select
                    value={newItem.form}
                    onChange={e => setNewItem({ ...newItem, form: e.target.value as any })}
                    className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-2xs bg-white dark:bg-slate-900"
                  >
                    <option value="Dilution">Dilution</option>
                    <option value="Globules">Globules</option>
                    <option value="Mother Tincture">Mother Tincture</option>
                    <option value="Ointment">Ointment</option>
                    <option value="Trituration">Trituration</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label>Batch No</label>
                  <input
                    type="text"
                    required
                    value={newItem.batchNo}
                    onChange={e => setNewItem({ ...newItem, batchNo: e.target.value })}
                    className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-2xs bg-transparent focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label>Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={newItem.expiryDate}
                    onChange={e => setNewItem({ ...newItem, expiryDate: e.target.value })}
                    className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-2xs bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label>Stock Qty</label>
                  <input
                    type="number"
                    required
                    value={newItem.stockQuantity}
                    onChange={e => setNewItem({ ...newItem, stockQuantity: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-2xs bg-transparent focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label>Price per unit (₹)</label>
                  <input
                    type="number"
                    required
                    value={newItem.pricePerUnit}
                    onChange={e => setNewItem({ ...newItem, pricePerUnit: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-2xs bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl"
                >
                  Save Stock Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
