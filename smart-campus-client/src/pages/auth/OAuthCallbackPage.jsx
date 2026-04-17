import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Spinner } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import './AuthPages.css';

const OAuthCallbackPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { applySession } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const userId = params.get('userId');
    const fullName = params.get('fullName');
    const email = params.get('email');
    const role = params.get('role');
    const redirectPath = params.get('redirectPath') || '/';

    if (!token || !email) {
      setError('Unable to complete Google sign-in.');
      return;
    }

    applySession({
      token,
      userId,
      fullName,
      email,
      role,
      redirectPath,
    });

    navigate(redirectPath, { replace: true });
  }, [applySession, location.search, navigate]);

  return (
    <div className="auth-page">
      <Container className="auth-shell text-center">
        <div className="auth-card modern-card">
          {error ? (
            <div className="login-inline-alert danger">{error}</div>
          ) : (
            <>
              <Spinner animation="border" />
              <p className="mt-3 mb-0">Completing Google sign-in...</p>
            </>
          )}
        </div>
      </Container>
    </div>
  );
};

export default OAuthCallbackPage;
