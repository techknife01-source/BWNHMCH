import { useState, useEffect, useCallback } from 'react';
import { assignmentApi } from '../services/api/assignment.api';
import { Assignment } from '../types/index';

export const useAssignments = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssignments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await assignmentApi.getAssignments();
      if (res.data) setAssignments(res.data);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch assignments');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const submitAssignment = async (id: string, formData: FormData) => {
    try {
      const res = await assignmentApi.submitAssignment(id, formData);
      if (res.data) {
        setAssignments((prev) => prev.map((a) => (a.id === id ? res.data : a)));
      }
      return res;
    } catch (err: any) {
      throw err;
    }
  };

  return {
    assignments,
    isLoading,
    error,
    refetch: fetchAssignments,
    submitAssignment,
  };
};
