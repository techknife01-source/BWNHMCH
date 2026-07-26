import React from 'react';
import { DashboardContent } from '../dashboard/DashboardContent';
import { FacultyLayout } from '../layout/FacultyLayout';

export const DashboardPage: React.FC = () => {
  return (
    <FacultyLayout pageTitle="Dashboard">
      <DashboardContent />
    </FacultyLayout>
  );
};

export default DashboardPage;
