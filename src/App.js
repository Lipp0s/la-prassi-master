import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'sonner';

// Lazy loading per migliorare le performance
const Home = lazy(() => import('./Home'));
const Login = lazy(() => import('./Login'));
const Register = lazy(() => import('./Register'));
const VerifyEmail = lazy(() => import('./VerifyEmail'));
const Profile = lazy(() => import('./Profile'));
const VideoPage = lazy(() => import('./VideoPage'));
const PublicProfile = lazy(() => import('./PublicProfile'));

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

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(120deg, #181818 0%, ${COLORS.primary} 100%);
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100vh;
  overflow-x: hidden;
  position: relative;
  color: ${COLORS.text};
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column;
  gap: 1rem;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid ${COLORS.accent};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.div`
  color: ${COLORS.textMuted};
  font-size: 1.1rem;
`;

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          flexDirection: 'column',
          gap: '1rem',
          color: COLORS.text
        }}>
          <h2>Something went wrong</h2>
          <p>Please refresh the page or try again later.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              background: COLORS.accent,
              color: COLORS.white,
              border: 'none',
              padding: '0.8rem 1.5rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <GoogleOAuthProvider clientId="175770132889-9bcso2m8fpa79iv31q1funakmfn3ced3.apps.googleusercontent.com">
        <Router>
          <AppContainer>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  borderRadius: '1rem',
                  background: COLORS.primary,
                  color: COLORS.text,
                  border: `1px solid ${COLORS.accent}`,
                  boxShadow: '0 4px 24px rgba(230, 82, 31, 0.15)'
                },
                duration: 3500
              }}
            />
            <Suspense fallback={
              <LoadingSpinner>
                <Spinner />
                <LoadingText>Loading Boiolax...</LoadingText>
              </LoadingSpinner>
            }>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/video/:id" element={<VideoPage />} />
                <Route path="/user/:id" element={<PublicProfile />} />
              </Routes>
            </Suspense>
          </AppContainer>
        </Router>
      </GoogleOAuthProvider>
    </ErrorBoundary>
  );
}

export default App;