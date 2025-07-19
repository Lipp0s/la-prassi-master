import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTimes, FaHeart, FaRegHeart, FaShareAlt, FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

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

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
  backdrop-filter: blur(8px);
`;

const ModalContent = styled.div`
  background: rgba(35, 35, 55, 0.95);
  border-radius: 3rem;
  box-shadow: 0 12px 48px 0 ${COLORS.accent}55, 0 2px 12px #000a;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: modalPopIn 0.38s cubic-bezier(.4,2,.6,1);
  border: none;
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid ${COLORS.glassBorder};

  @keyframes modalPopIn {
    from { opacity: 0; transform: scale(0.9) translateY(-20px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.2rem;
  right: 1.2rem;
  background: linear-gradient(120deg, ${COLORS.secondary} 0%, ${COLORS.primary} 100%);
  border: none;
  color: ${COLORS.text};
  font-size: 2.2rem;
  cursor: pointer;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 12px ${COLORS.secondary}33, 0 2px 8px #000a;
  transition: background 0.2s, box-shadow 0.2s, color 0.2s, transform 0.2s;
  z-index: 2;
  &:hover, &:focus {
    background: linear-gradient(120deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%);
    color: ${COLORS.text};
    box-shadow: 0 4px 24px ${COLORS.accent}55, 0 2px 12px #000a;
    outline: none;
    transform: scale(1.12) rotate(-8deg);
  }
`;

const VideoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 2rem;
  padding: 2rem;
  background: rgba(24, 24, 32, 0.8);
  border-radius: 3rem;
  box-shadow: 0 8px 40px 0 ${COLORS.accent}33, 0 2px 12px #000a;
  border: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 88vw;
  max-width: 1200px;
  aspect-ratio: 16/9;
  overflow: hidden;
`;

const VideoPlayer = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 2rem;
  box-shadow: 0 8px 32px 0 ${COLORS.accent}33, 0 2px 12px #000a;
`;

const VideoControls = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 0 0 2rem 2rem;

  ${VideoContainer}:hover & {
    opacity: 1;
  }
`;

const ControlButton = styled.button`
  background: ${COLORS.glass};
  color: ${COLORS.text};
  border: 1px solid ${COLORS.glassBorder};
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);

  &:hover {
    background: ${COLORS.accent};
    transform: scale(1.1);
    box-shadow: 0 4px 16px ${COLORS.accent}44;
  }
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => props.$progress}%;
    background: ${COLORS.accent};
    border-radius: 3px;
    transition: width 0.1s ease;
  }
`;

const LoadingSpinner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 54px;
  height: 54px;
  border: 5px solid ${COLORS.accent}33;
  border-top: 5px solid ${COLORS.accent};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  z-index: 10;
  pointer-events: none;
  @keyframes spin {
    0% { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
  }
`;

const VideoInfo = styled.div`
  padding: 2rem;
  text-align: center;
  max-width: 800px;
`;

const VideoTitle = styled.h2`
  color: ${COLORS.text};
  font-size: 2rem;
  font-weight: 900;
  margin-bottom: 1rem;
  letter-spacing: 0.04em;
  text-align: center;
`;

const VideoDescription = styled.p`
  color: ${COLORS.textMuted};
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  text-align: center;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
`;

const ActionButton = styled.button`
  background: ${props => props.$primary ? `linear-gradient(120deg, ${COLORS.secondary} 0%, ${COLORS.primary} 100%)` : COLORS.glass};
  color: ${COLORS.text};
  border: 1px solid ${props => props.$primary ? 'transparent' : COLORS.glassBorder};
  border-radius: 1.5rem;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);

  &:hover {
    background: ${props => props.$primary ? `linear-gradient(120deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)` : COLORS.glassHover};
    transform: translateY(-2px);
    box-shadow: 0 8px 24px ${COLORS.shadowHover};
  }
`;

const YouTubeLink = styled.a`
  background: ${COLORS.accent};
  color: ${COLORS.text};
  text-decoration: none;
  padding: 1rem 2rem;
  border-radius: 1.5rem;
  font-weight: 700;
  transition: all 0.3s ease;
  display: inline-block;
  margin-top: 1rem;

  &:hover {
    background: ${COLORS.highlight};
    transform: translateY(-2px);
    box-shadow: 0 8px 24px ${COLORS.shadowHover};
  }
`;

const FavoriteButton = styled.button`
  background: ${props => props.$favorited ? COLORS.accent : COLORS.glass};
  color: ${props => props.$favorited ? COLORS.text : COLORS.textMuted};
  border: 1px solid ${props => props.$favorited ? 'transparent' : COLORS.glassBorder};
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);

  &:hover {
    background: ${COLORS.accent};
    color: ${COLORS.text};
    transform: scale(1.1);
    box-shadow: 0 4px 16px ${COLORS.accent}44;
  }
`;

const ShareButton = styled.button`
  background: ${COLORS.glass};
  color: ${COLORS.textMuted};
  border: 1px solid ${COLORS.glassBorder};
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);

  &:hover {
    background: ${COLORS.accent};
    color: ${COLORS.text};
    transform: scale(1.1);
    box-shadow: 0 4px 16px ${COLORS.accent}44;
  }
`;

const VideoModal = ({ video, onClose, onToggleFavorite }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = React.useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => setIsLoading(false);
    const handleTimeUpdate = () => {
      setProgress((video.currentTime / video.duration) * 100);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleProgressClick = (e) => {
    const video = videoRef.current;
    if (!video) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    video.currentTime = percentage * video.duration;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: video.title,
          text: video.description,
          url: video.url
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(video.url);
        alert('Link copiato negli appunti!');
      } catch (error) {
        console.log('Error copying to clipboard:', error);
      }
    }
  };

  const isFavorite = localStorage.getItem('favorites')?.includes(video.id);

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>

        <VideoContainer>
          {isLoading && <LoadingSpinner />}
          <VideoPlayer
            ref={videoRef}
            src={video.url}
            poster={video.thumbnail}
            onLoadStart={() => setIsLoading(true)}
            onCanPlay={() => setIsLoading(false)}
          />
          
          <VideoControls>
            <ControlButton onClick={togglePlay}>
              {isPlaying ? <FaPause /> : <FaPlay />}
            </ControlButton>
            
            <ProgressBar 
              $progress={progress} 
              onClick={handleProgressClick}
            />
            
            <ControlButton onClick={toggleMute}>
              {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
            </ControlButton>
          </VideoControls>
        </VideoContainer>

        <VideoInfo>
          <VideoTitle>{video.title}</VideoTitle>
          <VideoDescription>{video.description}</VideoDescription>
          
          <ActionButtons>
            <FavoriteButton
              $favorited={isFavorite}
              onClick={() => onToggleFavorite(video.id)}
            >
              {isFavorite ? <FaHeart /> : <FaRegHeart />}
            </FavoriteButton>
            
            <ShareButton onClick={handleShare}>
              <FaShareAlt />
            </ShareButton>
          </ActionButtons>

          {video.youtubeUrl && (
            <YouTubeLink 
              href={video.youtubeUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{padding: '0.8rem 2rem', fontSize: '1.1rem', borderRadius: 18, background: COLORS.accent, color: COLORS.text, border: 'none', cursor: 'pointer', fontWeight: 700, boxShadow: `0 2px 12px ${COLORS.accent}33`}}
            >
              Guarda su YouTube
            </YouTubeLink>
          )}
        </VideoInfo>
      </ModalContent>
    </ModalOverlay>
  );
};

export default VideoModal; 