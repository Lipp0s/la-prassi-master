import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

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

const RegisterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%);
  padding: 2rem;
  box-shadow: 0 8px 32px 0 ${COLORS.accent}33, 0 2px 12px #000a;
`;

const RegisterCard = styled.div`
  background: rgba(35, 35, 55, 0.95);
  border-radius: 2rem;
  padding: 3rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 32px 0 ${COLORS.accent}33, 0 2px 12px #000a;
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid ${COLORS.glassBorder};
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  filter: drop-shadow(0 2px 12px ${COLORS.secondary}88);
`;

const Title = styled.h1`
  color: ${COLORS.text};
  text-align: center;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: ${COLORS.textMuted};
  font-size: 0.9rem;
  font-weight: 600;
`;

const Input = styled.input`
  padding: 1rem;
  border: 1px solid ${COLORS.glassBorder};
  border-radius: 0.75rem;
  background: ${COLORS.glass};
  color: ${COLORS.text};
  font-size: 1rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);

  &:focus {
    outline: none;
    border-color: ${COLORS.accent};
    box-shadow: 0 4px 16px ${COLORS.accent}44;
    background: ${COLORS.glassHover};
  }

  &::placeholder {
    color: ${COLORS.textMuted};
  }
`;

const RegisterButton = styled.button`
  background: linear-gradient(90deg, ${COLORS.secondary} 0%, ${COLORS.primary} 100%);
  color: ${COLORS.text};
  border: none;
  border-radius: 0.75rem;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 12px ${COLORS.accent}55;

  &:hover {
    background: linear-gradient(90deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 24px ${COLORS.accent}99;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  color: ${COLORS.textMuted};
  font-size: 0.9rem;
`;

const StyledLink = styled(Link)`
  color: ${COLORS.accent};
  text-decoration: none;
  font-weight: 700;
  transition: color 0.3s ease;

  &:hover {
    color: ${COLORS.highlight};
  }
`;

const ErrorMessage = styled.div`
  color: ${COLORS.highlight};
  text-align: center;
  font-size: 0.9rem;
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(217, 95, 89, 0.1);
  border-radius: 0.5rem;
  border: 1px solid rgba(217, 95, 89, 0.2);
`;

const SuccessMessage = styled.div`
  color: #4CAF50;
  text-align: center;
  font-size: 0.9rem;
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 0.5rem;
  border: 1px solid rgba(76, 175, 80, 0.2);
`;



function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Le password non coincidono');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/backend/register.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Registrazione completata! Controlla la tua email per verificare l\'account.');
        setTimeout(() => {
          navigate('/verify-email');
        }, 2000);
      } else {
        setError(data.message || 'Errore durante la registrazione');
      }
    } catch (err) {
      setError('Errore di connessione');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:8000/google-auth.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential: credentialResponse.credential })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Registrazione Google riuscita!');
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('username', data.user.username);
        localStorage.setItem('session_token', data.session_token);
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setError(data.message || 'Errore durante la registrazione Google');
      }
    } catch (err) {
      setError('Errore di connessione');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Errore durante la registrazione con Google');
  };

  return (
    <RegisterContainer>
      <RegisterCard>
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
        
        <Title><span style={{background: `linear-gradient(90deg, ${COLORS.secondary} 0%, ${COLORS.primary} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 900}}>Create your BOIOLAX account</span></Title>
        
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="name">Nome</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Inserisci il tuo nome"
            />
          </InputGroup>
          
          <InputGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Inserisci la tua email"
            />
          </InputGroup>
          
          <InputGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Inserisci la password"
              autoComplete="new-password"
            />
          </InputGroup>
          
          <InputGroup>
            <Label htmlFor="confirmPassword">Conferma Password</Label>
            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Conferma la password"
              autoComplete="new-password"
            />
          </InputGroup>
          
          <RegisterButton type="submit" disabled={loading}>
            {loading ? 'Registrazione in corso...' : 'Registrati'}
          </RegisterButton>
        </Form>
        
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
            theme="filled_black"
            size="large"
            text="signup_with"
            shape="rectangular"
            locale="it"
          />
        </div>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
        
        <LoginLink>
          Hai già un account? <StyledLink to="/login">Accedi</StyledLink>
        </LoginLink>
      </RegisterCard>
    </RegisterContainer>
  );
}

export default Register; 