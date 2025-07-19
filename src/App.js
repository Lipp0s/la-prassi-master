import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import VerifyEmail from './VerifyEmail';
import Profile from './Profile';
import VideoPage from './VideoPage';

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

function App() {
  return (
    <GoogleOAuthProvider clientId="175770132889-9bcso2m8fpa79iv31q1funakmfn3ced3.apps.googleusercontent.com">
      <Router>
        <AppContainer>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/video/:id" element={<VideoPage />} />
          </Routes>
        </AppContainer>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;