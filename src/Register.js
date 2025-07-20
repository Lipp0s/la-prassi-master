import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaGoogle, FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { toast } from 'sonner';

const COLORS = {
  primary: '#FCEF91',
  secondary: '#FB9E3A',
  accent: '#E6521F',
  highlight: '#EA2F14',
  text: '#2C2C2C',
  textMuted: '#666666',
  glass: 'rgba(252, 239, 145, 0.1)',
  glassBorder: 'rgba(251, 158, 58, 0.2)',
  glassHover: 'rgba(252, 239, 145, 0.15)',
  glassShadow: 'rgba(0, 0, 0, 0.2)',
  shadowHover: 'rgba(230, 82, 31, 0.3)',
  white: '#FFFFFF',
  black: '#000000'
};

const RegisterContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 50%, ${COLORS.accent} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const RegisterCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 2rem;
  padding: 3rem;
  max-width: 500px;
  width: 100%;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(251, 158, 58, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 900;
  color: ${COLORS.text};
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  color: ${COLORS.textMuted};
  font-size: 1.1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  position: relative;
`;

const Label = styled.label`
  display: block;
  color: ${COLORS.text};
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  box-sizing: border-box;
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 1rem 1.2rem 1rem 2.5rem;
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(251, 158, 58, 0.3);
  border-radius: 0.75rem;
  color: ${COLORS.text};
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${COLORS.accent};
    box-shadow: 0 0 20px rgba(230, 82, 31, 0.3);
  }

  &::placeholder {
    color: ${COLORS.textMuted};
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${COLORS.textMuted};
  font-size: 1.2rem;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${COLORS.textMuted};
  cursor: pointer;
  font-size: 1.2rem;
  transition: color 0.3s ease;

  &:hover {
    color: ${COLORS.text};
  }
`;

const SubmitButton = styled.button`
  background: ${COLORS.accent};
  color: ${COLORS.white};
  border: none;
  padding: 1rem;
  border-radius: 1rem;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  
  &:hover {
    background: ${COLORS.highlight};
    transform: translateY(-2px);
  }
  
  &:disabled {
    background: ${COLORS.textMuted};
    cursor: not-allowed;
    transform: none;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 2rem 0;
  color: ${COLORS.textMuted};
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(251, 158, 58, 0.3);
  }
  
  span {
    padding: 0 1rem;
    font-size: 0.9rem;
  }
`;

const GoogleButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: ${COLORS.white};
  color: ${COLORS.black};
  border: none;
  padding: 1rem;
  border-radius: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 2rem;
  color: ${COLORS.textMuted};
`;

const FooterLink = styled(Link)`
  color: ${COLORS.accent};
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
  
  &:hover {
    color: ${COLORS.highlight};
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

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setProfilePicPreview(URL.createObjectURL(file));
    } else {
      setProfilePic(null);
      setProfilePicPreview(null);
    }
  };

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePassword = (password) => password.length >= 8;

  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!formData.email || !validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!formData.password || !validatePassword(formData.password)) {
      errors.password = 'Password must be at least 8 characters.';
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }
    if (!formData.name || formData.name.trim() === '') {
      errors.name = 'Nickname is required.';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      toast.error('Please fix the errors in the form.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('password', formData.password);
      if (profilePic) data.append('profile_picture', profilePic);

      const API_URL = 'http://localhost:8000';
      const response = await fetch(`${API_URL}/register.php`, {
        method: 'POST',
        body: data
      });
      const result = await response.json();
      if (result.success) {
        toast.success('Registration successful! Check your email to verify your account.');
        setSuccess('Registration successful! Check your email to verify your account.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        toast.error(result.message || 'Registration failed. Please try again.');
        setError(result.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Connection error. Please try again.');
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');

    try {
      const API_URL = 'http://localhost:8000';
      const response = await fetch(`${API_URL}/google-auth.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential: credentialResponse.credential
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Google registration successful!');
        setSuccess('Google registration successful! Redirecting...');
        localStorage.setItem('sessionToken', data.session_token);
        localStorage.setItem('userInfo', JSON.stringify(data.user));
        
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        toast.error(data.message || 'Google registration failed. Please try again.');
        setError(data.message || 'Google registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Google registration error:', error);
      toast.error('Connection error. Please try again.');
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error('Google registration failed. Please try again.');
    setError('Google registration failed. Please try again.');
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <Header>
          <Title>Create Account</Title>
          <Subtitle>Join us and start exploring amazing videos</Subtitle>
        </Header>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">Full Name</Label>
            <InputWrapper>
              <InputIcon>
                <FaUser />
              </InputIcon>
              <Input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </InputWrapper>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="profile_picture">Profile Picture</Label>
            <Input
              type="file"
              id="profile_picture"
              name="profile_picture"
              accept="image/*"
              onChange={handleProfilePicChange}
              style={{ padding: 0 }}
            />
            {profilePicPreview && (
              <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <img src={profilePicPreview} alt="Profile Preview" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '2px solid #FB9E3A' }} />
              </div>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="email">Email Address</Label>
            <InputWrapper>
              <InputIcon>
                <FaEnvelope />
              </InputIcon>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
                autoComplete="email"
              />
              {formErrors.email && <ErrorMessage>{formErrors.email}</ErrorMessage>}
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="nickname">Nickname</Label>
            <InputWrapper>
              <Input
                type="text"
                id="nickname"
                name="nickname"
                placeholder="Choose a nickname"
                value={formData.name}
                onChange={handleInputChange}
                required
                autoComplete="username"
              />
              {formErrors.name && <ErrorMessage>{formErrors.name}</ErrorMessage>}
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <InputWrapper>
              <InputIcon>
                <FaLock />
              </InputIcon>
              <Input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
                autoComplete="new-password"
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </PasswordToggle>
              {formErrors.password && <ErrorMessage>{formErrors.password}</ErrorMessage>}
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <InputWrapper>
              <InputIcon>
                <FaLock />
              </InputIcon>
              <Input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                autoComplete="new-password"
              />
              {formErrors.confirmPassword && <ErrorMessage>{formErrors.confirmPassword}</ErrorMessage>}
            </InputWrapper>
          </FormGroup>

          <SubmitButton type="submit" disabled={loading || Object.keys(formErrors).length > 0}>
            {loading ? 'Registering...' : 'Sign Up'}
          </SubmitButton>
        </Form>

        <Divider>
          <span>or continue with</span>
        </Divider>

        <GoogleOAuthProvider clientId="175770132889-9bcso2m8fpa79iv31q1funakmfn3ced3.apps.googleusercontent.com">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            render={({ onClick }) => (
              <GoogleButton onClick={onClick}>
                <FaGoogle />
                Continue with Google
              </GoogleButton>
            )}
          />
        </GoogleOAuthProvider>

        <Footer>
          Already have an account?{' '}
          <FooterLink to="/login">Sign in here</FooterLink>
        </Footer>
      </RegisterCard>
    </RegisterContainer>
  );
}

export default Register; 