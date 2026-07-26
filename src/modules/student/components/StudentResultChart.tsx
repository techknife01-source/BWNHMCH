import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { SemesterResult } from '../../../types/index';

interface Props {
  results: SemesterResult[];
}

export const StudentResultChart: React.FC<Props> = ({ results }) => {
  const chartData = [...results].reverse().map((res) => ({
    semester: res.semester.replace(' Professional BHMS Year', ' Prof'),
    SGPA: res.sgpa,
    CGPA: res.cgpa,
  }));

  return (
    <div className="w-full h-56">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorSgpa" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorCgpa" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis dataKey="semester" tick={{ fontSize: 11, fill: '#64748B' }} />
          <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: '#64748B' }} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-slate-900 text-white p-2.5 rounded-lg text-xs shadow-xl space-y-1">
                    <p className="font-bold text-slate-200">{payload[0].payload.semester}</p>
                    <p className="text-blue-400">SGPA: <strong>{payload[0].value}</strong></p>
                    <p className="text-emerald-400">Cumulative CGPA: <strong>{payload[1]?.value || payload[0].value}</strong></p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area type="monotone" dataKey="SGPA" stroke="#3B82F6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSgpa)" />
          <Area type="monotone" dataKey="CGPA" stroke="#10B981" strokeWidth={2} strokeDasharray="3 3" fillOpacity={1} fill="url(#colorCgpa)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
