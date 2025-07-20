import React from 'react';
import styled from 'styled-components';
import { FaTimes, FaPlay } from 'react-icons/fa';

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

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(10px);
  animation: fadeIn 0.3s ease-out;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContent = styled.div`
  background: ${COLORS.white};
  border-radius: 2rem;
  max-width: 95vw;
  max-height: 95vh;
  width: 100%;
  position: relative;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.3s ease-out;
  overflow: hidden;
  
  @keyframes slideIn {
    from { 
      transform: scale(0.9) translateY(20px);
      opacity: 0;
    }
    to { 
      transform: scale(1) translateY(0);
      opacity: 1;
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: rgba(0, 0, 0, 0.7);
  color: ${COLORS.white};
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  transition: all 0.3s ease;
  z-index: 10;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: ${COLORS.accent};
    transform: scale(1.1);
  }
`;

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  border-radius: 2rem;
  overflow: hidden;
  background: ${COLORS.black};
`;

const VideoIframe = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 2rem;
`;

const LoadingMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: ${COLORS.white};
  font-size: 1.2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid ${COLORS.accent};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const VideoInfo = styled.div`
  padding: 2rem;
  background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%);
  color: ${COLORS.text};
`;

const VideoTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: ${COLORS.text};
`;

const VideoMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1rem;
  color: ${COLORS.textMuted};
`;

const PlayIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${COLORS.accent};
  font-weight: 600;
`;

function VideoModal({ videoId, onClose, videoTitle = "Movie Trailer" }) {
  const [isLoading, setIsLoading] = React.useState(true);
  
  console.log('VideoModal received videoId:', videoId);
  
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = React.useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContent>
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>
        
        <VideoContainer>
          <VideoIframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&showinfo=0`}
            title="Video Player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            onLoad={handleIframeLoad}
          />
          {isLoading && (
            <LoadingMessage>
              <LoadingSpinner />
              <div>Loading trailer...</div>
            </LoadingMessage>
          )}
        </VideoContainer>
        
        <VideoInfo>
          <VideoTitle>{videoTitle}</VideoTitle>
          <VideoMeta>
            <PlayIcon>
              <FaPlay />
              Trailer
            </PlayIcon>
            <span>•</span>
            <span>YouTube</span>
            <span>•</span>
            <span>HD Quality</span>
          </VideoMeta>
        </VideoInfo>
      </ModalContent>
    </ModalOverlay>
  );
}

export default VideoModal; 