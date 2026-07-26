import React from 'react';
import { DashboardLayout } from './DashboardLayout';
import { DashboardContent } from './DashboardContent';

export const DashboardPage: React.FC = () => {
  return (
    <DashboardLayout>
      <DashboardContent />
    </DashboardLayout>
  );
};

export default DashboardPage;
