import React from 'react';
import { Navigate } from 'react-router-dom';

export const FacultyPortalPage: React.FC = () => {
  return <Navigate to="/faculty/dashboard" replace />;
};

