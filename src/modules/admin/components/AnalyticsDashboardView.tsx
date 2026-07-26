import React, { useState } from 'react';
import {
  TrendingUp,
  Users,
  Building2,
  GraduationCap,
  DollarSign,
  PieChart,
  BarChart3,
  Activity,
  Award,
  Calendar,
  Download,
  Filter,
} from 'lucide-react';

export const AnalyticsDashboardView: React.FC = () => {
  const [analyticsCategory, setAnalyticsCategory] = useState<'executive' | 'students' | 'faculty' | 'hospital' | 'finance'>('executive');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#002147] text-white p-6 rounded-2xl shadow-md border border-blue-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-amber-400 text-slate-900 font-extrabold text-[10px] rounded-full uppercase">
              EXECUTIVE ANALYTICS TERMINAL
            </span>
            <span className="text-xs text-blue-200">• Institutional KPI Intelligence</span>
          </div>
          <h2 className="text-2xl font-black mt-1">Cross-Functional ERP Analytics & Business Intelligence</h2>
          <p className="text-xs text-blue-200">
            Real-time visual metrics across academic enrollment, faculty research output, hospital IPD bed occupancy & treasury revenue
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Generating Executive Analytics PDF Briefing...')}
            className="px-4 py-2 bg-[#00A651] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download BI Report (PDF)</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setAnalyticsCategory('executive')}
          className={`px-4 py-2 rounded-lg transition cursor-pointer flex items-center gap-2 ${
            analyticsCategory === 'executive'
              ? 'bg-[#002147] text-white'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <PieChart className="w-4 h-4 text-amber-400" />
          <span>Executive Overview</span>
        </button>

        <button
          onClick={() => setAnalyticsCategory('students')}
          className={`px-4 py-2 rounded-lg transition cursor-pointer flex items-center gap-2 ${
            analyticsCategory === 'students'
              ? 'bg-[#002147] text-white'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-emerald-400" />
          <span>Student Academics & Pass %</span>
        </button>

        <button
          onClick={() => setAnalyticsCategory('faculty')}
          className={`px-4 py-2 rounded-lg transition cursor-pointer flex items-center gap-2 ${
            analyticsCategory === 'faculty'
              ? 'bg-[#002147] text-white'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Award className="w-4 h-4 text-purple-400" />
          <span>Faculty Research Output</span>
        </button>

        <button
          onClick={() => setAnalyticsCategory('hospital')}
          className={`px-4 py-2 rounded-lg transition cursor-pointer flex items-center gap-2 ${
            analyticsCategory === 'hospital'
              ? 'bg-[#002147] text-white'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4 text-blue-400" />
          <span>Hospital IPD/OPD Footfall</span>
        </button>

        <button
          onClick={() => setAnalyticsCategory('finance')}
          className={`px-4 py-2 rounded-lg transition cursor-pointer flex items-center gap-2 ${
            analyticsCategory === 'finance'
              ? 'bg-[#002147] text-white'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <span>Treasury Revenue vs Expense</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <p className="text-xs text-slate-500 font-medium">Total Active BHMS Scholars</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white">252 Students</p>
          <p className="text-[10px] text-emerald-600 font-bold">↑ 98.2% Class Attendance Avg</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <p className="text-xs text-slate-500 font-medium">Monthly Hospital OPD Footfall</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white">4,280 Patients</p>
          <p className="text-[10px] text-blue-600 font-bold">↑ 84% IPD Bed Occupancy</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <p className="text-xs text-slate-500 font-medium">Faculty Research Publications</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white">18 Papers (2026)</p>
          <p className="text-[10px] text-purple-600 font-bold">Indexed in Scopus & PubMed</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <p className="text-xs text-slate-500 font-medium">Tuition Fee Collection Rate</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white">94.8%</p>
          <p className="text-[10px] text-emerald-600 font-bold">₹1.28 Cr Dues Reconciled</p>
        </div>
      </div>

      {/* Analytics Main View */}
      {analyticsCategory === 'executive' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-500" />
              <span>BHMS Academic Passing Percentage by Year</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between mb-1 font-bold"><span>1st BHMS Professional</span><span className="text-emerald-600">92.5%</span></div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '92.5%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1 font-bold"><span>2nd BHMS Professional</span><span className="text-emerald-600">95.0%</span></div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1 font-bold"><span>3rd BHMS Professional</span><span className="text-emerald-600">89.8%</span></div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '89.8%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1 font-bold"><span>4th BHMS Professional</span><span className="text-emerald-600">98.1%</span></div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '98.1%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              <span>50-Bed IPD Clinical Ward Occupancy Ratio</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex justify-between items-center">
                <span>Male Ward (20 Beds Capacity)</span>
                <span className="font-extrabold text-blue-600">18 Beds Occupied (90%)</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex justify-between items-center">
                <span>Female Ward (20 Beds Capacity)</span>
                <span className="font-extrabold text-blue-600">16 Beds Occupied (80%)</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex justify-between items-center">
                <span>Paediatric Ward (10 Beds Capacity)</span>
                <span className="font-extrabold text-blue-600">8 Beds Occupied (80%)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
