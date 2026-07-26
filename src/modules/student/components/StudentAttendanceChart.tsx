import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';
import { SubjectAttendance } from '../../../types/index';

interface Props {
  subjectWise: SubjectAttendance[];
}

export const StudentAttendanceChart: React.FC<Props> = ({ subjectWise }) => {
  const data = subjectWise.map((item) => ({
    name: item.subjectCode,
    fullName: item.subjectName,
    percentage: item.percentage,
    attended: item.attendedClasses,
    total: item.totalClasses,
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} interval={0} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B' }} unit="%" />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="bg-slate-900 text-white p-2.5 rounded-lg text-xs shadow-xl space-y-1">
                    <p className="font-bold text-amber-300">{item.fullName}</p>
                    <p>Attendance: <strong>{item.percentage}%</strong></p>
                    <p className="text-slate-300">Classes: {item.attended} / {item.total}</p>
                    {item.percentage < 75 ? (
                      <p className="text-red-400 font-medium">⚠️ Below 75% WBUHS Eligibility Criteria</p>
                    ) : (
                      <p className="text-emerald-400 font-medium">✓ Eligible for University Exams</p>
                    )}
                  </div>
                );
              }
              return null;
            }}
          />
          <ReferenceLine y={75} stroke="#EF4444" strokeDasharray="4 4" label={{ value: 'WBUHS Min 75%', fill: '#EF4444', fontSize: 10, position: 'top' }} />
          <Bar dataKey="percentage" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.percentage >= 85 ? '#10B981' : entry.percentage >= 75 ? '#3B82F6' : '#EF4444'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
