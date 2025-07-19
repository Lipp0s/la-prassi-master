import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSearchParams } from 'react-router-dom';

// Palette Color Hunt ufficiale
const COLORS = {
  primary: '#522258',      // Viola scuro
  secondary: '#8C3061',    // Viola medio  
  accent: '#C63C51',       // Corallo
  highlight: '#D95F59',    // Corallo chiaro
  text: '#FFFFFF',         // Bianco
  textMuted: '#B0B0B0',    // Grigio chiaro
  glass: 'rgba(255, 255, 255, 0.05)',
  glassBorder: 'rgba(255, 255, 255, 0.1)',
  glassHover: 'rgba(255, 255, 255, 0.08)',
  glassShadow: 'rgba(0, 0, 0, 0.3)',
  shadowHover: 'rgba(217, 95, 89, 0.3)',
  white: '#FFFFFF',
  black: '#000000'
};

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%);
  padding: 2rem;
`;

const Card = styled.div`
  background: rgba(35, 35, 55, 0.95);
  border-radius: 2rem;
  padding: 3rem;
  width: 100%;
  max-width: 500px;
  text-align: center;
  box-shadow: 0 8px 32px 0 ${COLORS.accent}33, 0 2px 12px #000a;
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid ${COLORS.glassBorder};
`;

const Logo = styled.div`
  margin-bottom: 2rem;
  filter: drop-shadow(0 2px 12px ${COLORS.secondary}88);
`;

const Title = styled.h1`
  color: ${COLORS.text};
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const Message = styled.p`
  color: ${COLORS.textMuted};
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const SuccessMessage = styled.div`
  color: #4CAF50;
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 0.75rem;
  padding: 1rem;
  margin-bottom: 2rem;
  font-size: 1rem;
`;

const ErrorMessage = styled.div`
  color: ${COLORS.highlight};
  background: rgba(217, 95, 89, 0.1);
  border: 1px solid rgba(217, 95, 89, 0.2);
  border-radius: 0.75rem;
  padding: 1rem;
  margin-bottom: 2rem;
  font-size: 1rem;
`;

const Link = styled.a`
  color: ${COLORS.accent};
  font-weight: 700;
  text-decoration: underline;
  transition: color 0.3s ease;

  &:hover {
    color: ${COLORS.highlight};
  }
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid ${COLORS.secondary}33;
  border-top: 4px solid ${COLORS.secondary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 2rem auto;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      verifyEmail(token);
    } else {
      setStatus('error');
      setMessage('Token di verifica mancante');
    }
  }, [searchParams]);

  const verifyEmail = async (token) => {
    try {
      const response = await fetch('/backend/verify-email.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token })
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage(data.message || 'Email verificata con successo!');
      } else {
        setStatus('error');
        setMessage(data.message || 'Errore durante la verifica');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Errore di connessione');
    }
  };

  return (
    <Container>
      <Card>
        <Logo>
          <svg width="60" height="60" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="mainGradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                <stop stopColor={COLORS.secondary} />
                <stop offset="1" stopColor={COLORS.primary} />
              </linearGradient>
            </defs>
            <circle cx="20" cy="20" r="18" fill="url(#mainGradient)" stroke="#fff" strokeWidth="2" />
            <polygon points="16,13 29,20 16,27" fill="#fff" opacity="0.95" />
          </svg>
        </Logo>

        <Title>Verifica Email</Title>

        {status === 'loading' && (
          <>
            <Message>Verifica in corso...</Message>
            <Spinner />
          </>
        )}

        {status === 'success' && (
          <>
            <SuccessMessage>{message}</SuccessMessage>
            <Message>
              Il tuo account è stato verificato con successo! Ora puoi accedere alla piattaforma.
            </Message>
            <Link href="/login">Vai al login</Link>
          </>
        )}

        {status === 'error' && (
          <>
            <ErrorMessage>{message}</ErrorMessage>
            <Message>
              Si è verificato un errore durante la verifica. Riprova più tardi o contatta il supporto.
            </Message>
            <Link href="/login">Torna al login</Link>
          </>
        )}
      </Card>
    </Container>
  );
}

export default VerifyEmail; 