import React, { useEffect } from 'react';
import AuthLayout from '../layout/AuthLayout';
import SignupRitual from '../components/auth/SignupRitual';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const { isGuest, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isGuest) {
      navigate('/nexus');
    }
  }, [isGuest, isLoading, navigate]);

  return (
    <AuthLayout>
      <SignupRitual />
    </AuthLayout>
  );
};

export default SignupPage;
