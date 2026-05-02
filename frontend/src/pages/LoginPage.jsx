import React, { useEffect } from 'react';
import AuthLayout from '../layout/AuthLayout';
import LoginPortal from '../components/auth/LoginPortal';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { isGuest, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isGuest) {
      navigate('/nexus');
    }
  }, [isGuest, isLoading, navigate]);

  return (
    <AuthLayout>
      <LoginPortal />
    </AuthLayout>
  );
};

export default LoginPage;
