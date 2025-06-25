import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import Home from './Home';
import VideoModal from './VideoModal';
import Login from './Login';
import Register from './Register';

const GlobalStyle = createGlobalStyle`
  body {
    background: #181818;
    color: #fff;
    margin: 0;
    font-family: 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    overflow-x: hidden;
  }
`;

const bgAnim = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const Background = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 0;
  background: linear-gradient(120deg, #1e1e2f 0%, #232323 50%, #e1306c 100%);
  background-size: 200% 200%;
  animation: ${bgAnim} 18s ease-in-out infinite;
  filter: blur(0px) brightness(0.9);
`;

const AppContainer = styled.div`
  min-height: 100vh;
  position: relative;
  z-index: 1;
`;

function App() {
  return (
    <Router>
      <GlobalStyle />
      <Background />
      <AppContainer>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/video/:id" element={<VideoModal />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </AppContainer>
    </Router>
  );
}

export default App;
