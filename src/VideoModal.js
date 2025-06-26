import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import videoSections from './videos';

// Modern SVG Logo as a React component
const ModernLogo = () => (
  <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="mainGradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#A35C7A" />
        <stop offset="1" stopColor="#7B3F61" />
      </linearGradient>
    </defs>
    <circle cx="20" cy="20" r="18" fill="url(#mainGradient)" stroke="#fff" strokeWidth="2" />
    <polygon points="16,13 29,20 16,27" fill="#fff" opacity="0.95" />
  </svg>
);

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(24,24,32,0.92);
  backdrop-filter: blur(16px) saturate(1.2);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeInOverlay 0.32s cubic-bezier(.4,2,.6,1);
  @keyframes fadeInOverlay {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const Modal = styled.div`
  background: rgba(35,35,55,0.98);
  border-radius: 3rem;
  box-shadow: 0 12px 48px 0 #A35C7A55, 0 2px 12px #000a;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: modalPopIn 0.38s cubic-bezier(.4,2,.6,1);
  border: none;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 1.2rem;
  right: 1.2rem;
  background: linear-gradient(120deg, #A35C7A 0%, #7B3F61 100%);
  border: none;
  color: #fff;
  font-size: 2.2rem;
  cursor: pointer;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 12px #A35C7A33, 0 2px 8px #000a;
  transition: background 0.2s, box-shadow 0.2s, color 0.2s, transform 0.2s;
  z-index: 2;
  &:hover, &:focus {
    background: linear-gradient(120deg, #7B3F61 0%, #A35C7A 100%);
    color: #fff;
    box-shadow: 0 4px 24px #A35C7A55, 0 2px 12px #000a;
    outline: none;
    transform: scale(1.12) rotate(-8deg);
  }
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 1.2rem;
`;

const Title = styled.h2`
  margin: 0;
  color: #fff;
  font-size: 2.1rem;
  font-weight: 900;
  text-align: center;
  text-shadow: 0 2px 12px #000a;
`;

const PlayerContainer = styled.div`
  background: rgba(24,24,32,0.92);
  border-radius: 3rem;
  box-shadow: 0 8px 40px 0 #A35C7A33, 0 2px 12px #000a;
  border: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 88vw;
  max-width: 900px;
  aspect-ratio: 16/9;
  overflow: hidden;
  animation: ${fadeIn} 0.4s cubic-bezier(.4,2,.6,1) both;
  pointer-events: auto;
  @media (max-width: 600px) {
    max-width: 100vw;
    border-radius: 0;
    border: none;
  }
`;

const StyledIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  background: #000;
  display: block;
  border-radius: 3rem;
  pointer-events: auto;
`;

const Spinner = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 54px;
  height: 54px;
  border: 5px solid #A35C7A33;
  border-top: 5px solid #A35C7A;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  z-index: 10;
  pointer-events: none;
  @keyframes spin {
    0% { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
  }
`;

function getPlayableUrl(video) {
  if (video.type === 'youtube') {
    return video.url.includes('?')
      ? video.url + '&autoplay=1&mute=1'
      : video.url + '?autoplay=1&mute=1';
  }
  return video.url;
}

function VideoModal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const modalRef = useRef();
  const video = videoSections.flatMap(section => section.videos).find(v => v.id === id);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') navigate('/');
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [navigate]);

  // Timeout for loading spinner
  useEffect(() => {
    if (!loading) return;
    const timeout = setTimeout(() => setError(true), 8000);
    return () => clearTimeout(timeout);
  }, [loading]);

  if (!video) return null;

  const handleOverlayMouseDown = (e) => {
    if (e.target === e.currentTarget) {
      navigate('/');
    }
  };

  // Helper to get YouTube watch URL
  const getYoutubeWatchUrl = (url) => {
    const match = url.match(/\/embed\/([\w-]+)/);
    return match ? `https://www.youtube.com/watch?v=${match[1]}` : url;
  };

  return (
    <Overlay onMouseDown={handleOverlayMouseDown}>
      <Modal ref={modalRef}>
        <CloseBtn onClick={() => navigate('/')} aria-label="Close video">
          <FaTimes />
        </CloseBtn>
        <TitleRow>
          <ModernLogo />
          <Title>{video.title}</Title>
        </TitleRow>
        <PlayerContainer>
          {loading && !error && <Spinner />}
          {error && video.type === 'youtube' && (
            <div style={{ color: '#e1306c', textAlign: 'center', padding: '2rem', fontWeight: 700 }}>
              Impossibile caricare il video.<br />
              Potrebbe non essere embeddabile o la connessione è lenta.<br />
              <a href={getYoutubeWatchUrl(video.url)} target="_blank" rel="noopener noreferrer" style={{marginTop: '1.5rem', display: 'inline-block', padding: '0.7rem 1.5rem', borderRadius: '1.5rem', border: 'none', background: '#A35C7A', color: '#fff', fontWeight: 700, textDecoration: 'none'}}>Guarda su YouTube</a>
            </div>
          )}
          {!error && video.type === 'youtube' && (
            <StyledIframe
              src={getPlayableUrl(video)}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              title={video.title}
              onLoad={() => setLoading(false)}
              onError={() => { setLoading(false); setError(true); }}
            />
          )}
          {!error && video.type !== 'youtube' && (
            <video
              src={video.url}
              controls
              autoPlay
              style={{ width: '100%', height: '100%', borderRadius: '3rem', background: '#000' }}
              onLoadedData={() => setLoading(false)}
              onError={() => { setLoading(false); setError(true); }}
            />
          )}
        </PlayerContainer>
      </Modal>
    </Overlay>
  );
}

export default VideoModal; 