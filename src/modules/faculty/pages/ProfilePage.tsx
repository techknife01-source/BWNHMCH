import React from 'react';
import { FacultyLayout } from '../layout/FacultyLayout';
import { FacultyProfileContainer } from '../profile/FacultyProfileContainer';

export const ProfilePage: React.FC = () => {
  return (
    <FacultyLayout pageTitle="Faculty Profile">
      <FacultyProfileContainer />
    </FacultyLayout>
  );
};
