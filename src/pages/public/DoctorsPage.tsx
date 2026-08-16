import React from 'react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { DoctorScheduleAvailability } from '../../modules/hospital/components/DoctorScheduleAvailability';

export const DoctorsPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <Breadcrumb items={[{ label: 'Doctors & OPD Roster' }]} />
      <DoctorScheduleAvailability />
    </div>
  );
};
