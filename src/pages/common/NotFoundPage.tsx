import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center p-6 space-y-4">
      <span className="text-6xl font-black text-blue-600">404</span>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Page Not Found</h1>
      <p className="text-xs text-slate-500 max-w-md">
        The requested page or portal desk does not exist or may have been relocated.
      </p>
      <Link to="/">
        <Button variant="primary">
          <Home className="h-4 w-4" />
          <span>Return to Homepage</span>
        </Button>
      </Link>
    </div>
  );
};
