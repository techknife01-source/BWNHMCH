import React from 'react';
import { NoticeBoardView } from '../../../components/notice/NoticeBoardView';

export const CircularsView: React.FC = () => {
  return (
    <div className="space-y-4">
      <NoticeBoardView initialRole="ADMIN" />
    </div>
  );
};
