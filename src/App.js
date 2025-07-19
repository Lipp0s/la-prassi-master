import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import Home from './Home';
import VideoModal from './VideoModal';
import Login from './Login';
import Register from './Register';
import VerifyEmail from './VerifyEmail';
import Profile from './Profile';
import { GoogleOAuthProvider } from '@react-oauth/google';

const GlobalStyle = createGlobalStyle`
  body {
    background: #181818;
    color: #fff;
    margin: 0;
    font-family: 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    overflow-x: hidden;
  }
  *, *:before, *:after {
    box-sizing: border-box;
  }
`;

const AnimatedBackground = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 0;
  background: linear-gradient(120deg, #181818 0%, #A35C7A 100%);
  animation: bgMove 12s ease-in-out infinite alternate;
  @keyframes bgMove {
    0% { background-position: 0% 50%; }
    100% { background-position: 100% 50%; }
  }
`;

const AppContainer = styled.div`
  position: relative;
  z-index: 1;
  min-height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2.5rem 1.2rem 2.5rem 1.2rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

function App() {
  return (
    <GoogleOAuthProvider clientId="175770132889-9bcso2m8fpa79iv31q1funakmfn3ced3.apps.googleusercontent.com">
      <Router>
        <GlobalStyle />
        <AnimatedBackground />
        <AppContainer>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/video/:id" element={<VideoModal />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </AppContainer>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;