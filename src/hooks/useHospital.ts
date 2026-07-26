import { useState, useEffect, useCallback } from 'react';
import { hospitalApi } from '../services/api/hospital.api';
import { Doctor, HospitalAppointment } from '../types/index';

export const useHospital = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<HospitalAppointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHospitalData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [docRes, appRes] = await Promise.all([
        hospitalApi.getDoctors(),
        hospitalApi.getMyAppointments(),
      ]);

      if (docRes.data) setDoctors(docRes.data);
      if (appRes.data) setAppointments(appRes.data);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch hospital data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHospitalData();
  }, [fetchHospitalData]);

  const bookAppointment = async (data: { doctorId: string; appointmentDate: string; timeSlot: string; symptoms: string }) => {
    try {
      const res = await hospitalApi.bookAppointment(data);
      if (res.data) {
        setAppointments((prev) => [res.data, ...prev]);
      }
      return res;
    } catch (err: any) {
      throw err;
    }
  };

  return {
    doctors,
    appointments,
    isLoading,
    error,
    refetch: fetchHospitalData,
    bookAppointment,
  };
};
