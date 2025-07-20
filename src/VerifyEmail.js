import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { FaEnvelope, FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';

const COLORS = {
  primary: '#522258',
  secondary: '#8C3061',
  accent: '#C63C51',
  highlight: '#D95F59',
  text: '#FFFFFF',
  textMuted: '#B0B0B0',
  glass: 'rgba(255, 255, 255, 0.05)',
  glassBorder: 'rgba(255, 255, 255, 0.1)',
  glassHover: 'rgba(255, 255, 255, 0.08)',
  glassShadow: 'rgba(0, 0, 0, 0.3)',
  shadowHover: 'rgba(217, 95, 89, 0.3)',
  white: '#FFFFFF',
  black: '#000000'
};

const VerifyContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 50%, ${COLORS.accent} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const VerifyCard = styled.div`
  background: rgba(35, 35, 55, 0.9);
  border-radius: 2rem;
  padding: 3rem;
  max-width: 500px;
  width: 100%;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  text-align: center;
`;

const EmailIcon = styled.div`
  width: 80px;
  height: 80px;
  background: ${COLORS.accent};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem auto;
  font-size: 2rem;
  color: ${COLORS.text};
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  background: #2ecc71;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem auto;
  font-size: 2rem;
  color: ${COLORS.text};
`;

const ErrorIcon = styled.div`
  width: 80px;
  height: 80px;
  background: #e74c3c;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem auto;
  font-size: 2rem;
  color: ${COLORS.text};
`;

const LoadingIcon = styled.div`
  width: 80px;
  height: 80px;
  background: ${COLORS.accent};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem auto;
  font-size: 2rem;
  color: ${COLORS.text};
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 900;
  color: ${COLORS.text};
  margin-bottom: 1rem;
`;

const Message = styled.p`
  color: ${COLORS.textMuted};
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const Button = styled.button`
  background: ${COLORS.accent};
  color: ${COLORS.text};
  border: none;
  padding: 1rem 2rem;
  border-radius: 1rem;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${COLORS.highlight};
    transform: translateY(-2px);
  }
`;

const ErrorMessage = styled.div`
  background: rgba(231, 76, 60, 0.2);
  border: 1px solid #e74c3c;
  color: #e74c3c;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const SuccessMessage = styled.div`
  background: rgba(46, 204, 113, 0.2);
  border: 1px solid #2ecc71;
  color: #2ecc71;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  text-align: center;
`;

function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setError('Invalid verification link');
      return;
    }

    verifyEmail(token);
  }, [searchParams]);

  const verifyEmail = async (token) => {
    try {
      const API_URL = 'http://localhost:8000';
      const response = await fetch(`${API_URL}/verify.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token })
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage('Your email has been verified successfully! You can now sign in to your account.');
      } else {
        setStatus('error');
        setError(data.message || 'Email verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('error');
      setError('Connection error. Please try again.');
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <>
            <LoadingIcon>
              <FaSpinner />
            </LoadingIcon>
            <Title>Verifying Email</Title>
            <Message>Please wait while we verify your email address...</Message>
          </>
        );

      case 'success':
        return (
          <>
            <SuccessIcon>
              <FaCheckCircle />
            </SuccessIcon>
            <Title>Email Verified!</Title>
            <Message>{message}</Message>
            <Button onClick={() => navigate('/login')}>
              Go to Login
            </Button>
          </>
        );

      case 'error':
        return (
          <>
            <ErrorIcon>
              <FaTimesCircle />
            </ErrorIcon>
            <Title>Verification Failed</Title>
            <Message>{error}</Message>
            <Button onClick={() => navigate('/login')}>
              Go to Login
            </Button>
          </>
        );

      default:
        return (
          <>
            <EmailIcon>
              <FaEnvelope />
            </EmailIcon>
            <Title>Email Verification</Title>
            <Message>Please check your email and click the verification link to activate your account.</Message>
            <Button onClick={() => navigate('/login')}>
              Back to Login
            </Button>
          </>
        );
    }
  };

  return (
    <VerifyContainer>
      <VerifyCard>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {message && <SuccessMessage>{message}</SuccessMessage>}
        {renderContent()}
      </VerifyCard>
    </VerifyContainer>
  );
}

export default VerifyEmail; 