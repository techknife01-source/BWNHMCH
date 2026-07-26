import { useState, useEffect, useCallback } from 'react';
import { resultApi } from '../services/api/result.api';
import { examApi } from '../services/api/exam.api';
import { SemesterResult, ExamSchedule } from '../types/index';

export const useResults = () => {
  const [results, setResults] = useState<SemesterResult[]>([]);
  const [upcomingExams, setUpcomingExams] = useState<ExamSchedule[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResultsAndExams = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [resData, examData] = await Promise.all([
        resultApi.getResults(),
        examApi.getUpcomingExams(),
      ]);

      if (resData.data) setResults(resData.data);
      if (examData.data) setUpcomingExams(examData.data);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch results and exam schedules');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResultsAndExams();
  }, [fetchResultsAndExams]);

  const downloadGradeSheet = async (resultId: string, semesterName: string) => {
    try {
      const blob = await resultApi.downloadGradeSheet(resultId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `WBUHS_GradeSheet_${semesterName.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Download error:', err);
    }
  };

  return {
    results,
    upcomingExams,
    isLoading,
    error,
    refetch: fetchResultsAndExams,
    downloadGradeSheet,
  };
};
