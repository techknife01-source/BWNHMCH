import React from 'react';
import { Card } from '../common/Card';
import { Award, Download, CheckCircle2, ChevronRight } from 'lucide-react';
import { SemesterResult } from '../../types/index';

interface ResultCardProps {
  result: SemesterResult;
  onDownloadPdf?: (id: string, name: string) => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, onDownloadPdf }) => {
  return (
    <Card className="p-6 border border-slate-200/80 dark:border-slate-800 space-y-4 hover:shadow-md transition">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded tracking-wider">
            Academic Year {result.academicYear}
          </span>
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-1">
            {result.semester}
          </h3>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-2xs text-slate-400 font-bold block uppercase">SGPA</span>
            <span className="text-lg font-black text-[#002147] dark:text-[#00A651]">{result.sgpa.toFixed(2)}</span>
          </div>
          <div className="text-right border-l border-slate-200 dark:border-slate-800 pl-4">
            <span className="text-2xs text-slate-400 font-bold block uppercase">CGPA</span>
            <span className="text-lg font-black text-emerald-600">{result.cgpa.toFixed(2)}</span>
          </div>

          {onDownloadPdf && (
            <button
              onClick={() => onDownloadPdf(result.id, result.semester)}
              className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-[#002147] hover:text-white dark:hover:bg-[#00A651] text-slate-700 dark:text-slate-200 rounded-xl transition cursor-pointer"
              title="Download Grade Sheet PDF"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-[10px] font-black uppercase text-slate-400 border-b border-slate-100 dark:border-slate-800">
              <th className="py-2 font-bold">Subject Code & Name</th>
              <th className="py-2 font-bold text-center">Internal</th>
              <th className="py-2 font-bold text-center">Univ. Exam</th>
              <th className="py-2 font-bold text-center">Total</th>
              <th className="py-2 font-bold text-right">Grade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {result.subjects.map((s) => (
              <tr key={s.code} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                <td className="py-2 font-semibold text-slate-800 dark:text-slate-200">
                  <span className="text-[10px] font-mono text-slate-400 mr-2">{s.code}</span>
                  {s.name}
                </td>
                <td className="py-2 text-center text-slate-600 dark:text-slate-400">{s.internalMarks}</td>
                <td className="py-2 text-center text-slate-600 dark:text-slate-400">{s.universityMarks}</td>
                <td className="py-2 text-center font-bold text-slate-900 dark:text-white">{s.totalMarks}</td>
                <td className="py-2 text-right font-black text-emerald-600 dark:text-emerald-400">{s.grade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
