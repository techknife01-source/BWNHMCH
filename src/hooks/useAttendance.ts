import { useState, useEffect, useCallback } from 'react';
import { attendanceApi } from '../services/api/attendance.api';
import { AttendanceSummary, AttendanceRecord } from '../types/index';

export const useAttendance = () => {
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAttendance = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [sumRes, recRes] = await Promise.all([
        attendanceApi.getSummary(),
        attendanceApi.getDailyRecords(),
      ]);

      if (sumRes.data) setSummary(sumRes.data);
      if (recRes.data) setRecords(recRes.data);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch attendance data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const downloadReport = async () => {
    try {
      const blob = await attendanceApi.downloadAttendanceReport();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Student_Attendance_Report.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Download error:', err);
    }
  };

  return {
    summary,
    records,
    isLoading,
    error,
    refetch: fetchAttendance,
    downloadReport,
  };
};
