import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import videoSections from './videos';
import { keyframes } from 'styled-components';
const logo = process.env.PUBLIC_URL + '/logo192.png';

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.82);
  backdrop-filter: blur(8px) saturate(1.1);
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
  background: rgba(35,35,43,0.98);
  border-radius: 20px;
  padding: 2rem 2rem 1.5rem 2rem;
  max-width: 92vw;
  max-height: 92vh;
  box-shadow: 0 8px 40px 0 #000a, 0 2px 12px #A35C7A33;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: modalPopIn 0.38s cubic-bezier(.4,2,.6,1);
  @keyframes modalPopIn {
    from { opacity: 0; transform: scale(0.96); }
    to { opacity: 1; transform: scale(1); }
  }
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 1.2rem;
  right: 1.2rem;
  background: rgba(30,30,40,0.7);
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
    background: linear-gradient(120deg, #A35C7A 0%, #7B3F61 100%);
    color: #fff;
    box-shadow: 0 4px 24px #A35C7A55, 0 2px 12px #000a;
    outline: none;
    transform: scale(1.08);
  }
`;

const Title = styled.h2`
  margin: 0 0 1rem 0;
  color: #fff;
`;

const PlayerContainer = styled.div`
  background: #181828ee;
  border-radius: 18px;
  box-shadow: 0 8px 40px 0 #A35C7A33, 0 2px 12px #000a;
  border: 2.5px solid #A35C7A55;
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
  @media (max-width: 600px) {
    max-width: 100vw;
    border-radius: 0;
    border-width: 0 0 2.5px 0;
  }
`;

const StyledIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  background: #000;
  display: block;
`;

const DeviceFrame = styled.div`
  background: #222;
  border-radius: 36px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.7), 0 0 0 8px #111;
  padding: 1.5rem 0.7rem;
  width: 340px;
  height: 700px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  @media (max-width: 400px) {
    width: 98vw;
    height: 70vw;
    min-height: 400px;
    min-width: 220px;
  }
`;

const DeviceNotch = styled.div`
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 12px;
  background: #333;
  border-radius: 8px;
`;

const InstaFrame = styled.iframe`
  width: 100%;
  height: 600px;
  border: none;
  border-radius: 24px;
  background: #000;
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
  @keyframes spin {
    0% { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
  }
`;

const BackBtn = styled.button`
  position: absolute;
  top: 1.2rem;
  left: 1.2rem;
  background: rgba(30,30,40,0.7);
  border: none;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 700;
  border-radius: 18px;
  padding: 0.5rem 1.3rem 0.5rem 2.2rem;
  box-shadow: 0 2px 12px #A35C7A33, 0 2px 8px #000a;
  cursor: pointer;
  z-index: 3;
  transition: background 0.22s, box-shadow 0.22s, color 0.22s, transform 0.22s;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  &:hover, &:focus {
    background: linear-gradient(120deg, #A35C7A 0%, #7B3F61 100%);
    color: #fff;
    box-shadow: 0 4px 24px #A35C7A55, 0 2px 12px #000a;
    outline: none;
    transform: scale(1.08);
  }
`;

const BackLogo = styled.img`
  width: 22px;
  height: 22px;
  margin-right: 0.5rem;
  filter: drop-shadow(0 2px 8px #A35C7A88);
`;

const ModalFade = styled.div`
  animation: modalFadeIn 0.7s cubic-bezier(.4,2,.6,1);
  @keyframes modalFadeIn {
    from { opacity: 0; transform: scale(0.97) translateY(32px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
`;

function VideoModal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const modalRef = useRef();
  const video = videoSections.flatMap(section => section.videos).find(v => v.id === id);
  const [loading, setLoading] = useState(true);

  // Close on Escape key
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') navigate('/');
      // Focus trap
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

  if (!video) return null;

  return (
    <Overlay onClick={() => navigate('/')}> 
      <ModalFade>
        <Modal ref={modalRef} onClick={e => e.stopPropagation()}>
          <BackBtn onClick={() => navigate(-1)} aria-label="Back">
            <BackLogo src={logo} alt="Back to home" />
            Back
          </BackBtn>
          <CloseBtn onClick={() => navigate('/')} aria-label="Close video">
            <FaTimes />
          </CloseBtn>
          <Title style={{color: '#fff', marginBottom: 12, textAlign: 'center', textShadow: '0 2px 12px #000a'}}>{video.title}</Title>
          <PlayerContainer>
            {loading && <Spinner />}
            <StyledIframe
              src={video.url}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              title={video.title}
              onLoad={() => setLoading(false)}
            />
          </PlayerContainer>
        </Modal>
      </ModalFade>
    </Overlay>
  );
}

export default VideoModal; 