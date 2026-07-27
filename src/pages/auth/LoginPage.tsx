import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { User, Lock, KeyRound } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const notification = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameOrEmail || !password) {
      notification.error('Please enter both username/email and password');
      return;
    }

    try {
      setIsLoading(true);
      await login({ usernameOrEmail, password });
      notification.success('Signed in successfully');
      navigate('/portal/dashboard');
    } catch (err: any) {
      notification.error(err.response?.data?.message || err.message || 'Invalid authentication credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-black text-white">Digital Portal Sign In</h2>
        <p className="text-xs text-slate-400">Enter your credentials to access your ERP desk</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Username or Institutional Email"
          value={usernameOrEmail}
          onChange={(e) => setUsernameOrEmail(e.target.value)}
          placeholder="admin / student / doctor"
          leftIcon={<User className="h-4 w-4" />}
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          leftIcon={<Lock className="h-4 w-4" />}
        />

        <div className="flex items-center justify-between text-xs pt-1">
          <Link to="/forgot-password" className="text-blue-400 hover:underline">
            Forgot Password?
          </Link>
        </div>

        <Button variant="primary" type="submit" isLoading={isLoading} className="w-full font-bold">
          <KeyRound className="h-4 w-4" />
          <span>Authenticate & Proceed</span>
        </Button>
      </form>

      <div className="pt-4 border-t border-slate-800 text-center space-y-2">
        <p className="text-[11px] text-slate-400">Quick role gateways:</p>
        <div className="flex justify-center space-x-3 text-xs text-blue-400">
          <Link to="/login/student" className="hover:underline">Student Desk</Link>
          <span>•</span>
          <Link to="/login/faculty" className="hover:underline">Faculty Desk</Link>
          <span>•</span>
          <Link to="/login/admin" className="hover:underline">Admin Desk</Link>
        </div>
      </div>
    </div>
  );
};
