import React from 'react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { HospitalStaffDirectory } from '../../modules/hospital/components/HospitalStaffDirectory';

export const StaffPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <Breadcrumb items={[{ label: 'Staff Directory' }]} />
      <HospitalStaffDirectory />
    </div>
  );
};
