import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import videoSections from './videos';
import ReactPlayer from 'react-player';
import screenfull from 'screenfull';
import ReviewForm from './ReviewForm';
import { AiFillStar, AiOutlineStar, AiOutlineClockCircle } from 'react-icons/ai';
import { FaArrowLeft, FaArrowUp, FaArrowDown } from 'react-icons/fa';

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
  max-width: 1500px;
  width: 96vw;
  height: 96vh;
  overflow-y: auto;
  margin: 2.5rem auto;
  padding: 2.5rem 2rem 2.5rem 2rem;
  @media (max-width: 900px) {
    max-width: 100vw;
    width: 100vw;
    height: 100vh;
    border-radius: 0;
    padding: 1rem 0.2rem;
  }
  /* Scrollbar stile home */
  &::-webkit-scrollbar {
    width: 10px;
    background: #232323;
  }
  &::-webkit-scrollbar-thumb {
    background: #A35C7A;
    border-radius: 8px;
  }
  scrollbar-width: thin;
  scrollbar-color: #A35C7A #232323;
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

const ReviewsGridWrapper = styled.div`
  position: relative;
  max-width: 700px;
  margin: 0 auto;
  padding-bottom: 2rem;
  background: rgba(35,35,55,0.98);
  border-radius: 1.5rem;
  box-shadow: 0 2px 16px #A35C7A22;
  margin-top: 2.5rem;
`;
const ReviewsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.2rem;
  /* overflow-y e max-height rimossi */
  padding-right: 6px;
  scrollbar-width: thin;
  scrollbar-color: #A35C7A #232336;
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
  &::-webkit-scrollbar {
    width: 8px;
    background: #232336;
    border-radius: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: #A35C7A;
    border-radius: 8px;
  }
`;
const StickyReviewsHeader = styled.div`
  position: sticky;
  top: 0;
  background: #232336ee;
  z-index: 3;
  padding: 0.7rem 0 0.5rem 0;
  text-align: center;
`;
const SeeReviewsBtn = styled.button`
  display: block;
  margin: 1.1rem auto 0 auto;
  background: none;
  border: 2px solid #A35C7A;
  color: #A35C7A;
  font-weight: 700;
  font-size: 1.08rem;
  border-radius: 18px;
  padding: 0.5rem 1.6rem;
  cursor: pointer;
  transition: background 0.18s, color 0.18s, border 0.18s;
  box-shadow: 0 2px 8px #A35C7A22;
  &:hover, &:focus {
    background: #A35C7A;
    color: #fff;
    outline: none;
    border-color: #7B3F61;
  }
`;
const ScrollShadow = styled.div`
  position: absolute;
  left: 0; right: 0; bottom: 0;
  height: 54px;
  pointer-events: none;
  background: linear-gradient(0deg, #232336ee 80%, transparent 100%);
  z-index: 2;
`;
const ReviewCard = styled.div`
  background: #232336;
  border-radius: 18px;
  box-shadow: 0 2px 16px #A35C7A33;
  border: 1.5px solid #7B3F61;
  padding: 1.3rem 1.2rem 1.1rem 1.2rem;
  display: flex;
  flex-direction: column;
  min-height: 140px;
  position: relative;
`;
const ReviewHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.7rem;
`;
const Avatar = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(120deg, #A35C7A 0%, #7B3F61 100%);
  color: #fff;
  font-weight: 700;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.9rem;
  box-shadow: 0 2px 8px #A35C7A33;
`;
const Username = styled.div`
  font-weight: 600;
  color: #fff;
  font-size: 1.08rem;
  margin-right: 0.7rem;
`;
const Stars = styled.div`
  display: flex;
  align-items: center;
  gap: 0.05rem;
  margin-left: auto;
`;
const ReviewComment = styled.div`
  color: #b0b0b0;
  font-style: italic;
  font-size: 1.04rem;
  margin-bottom: 0.7rem;
  max-height: 6.2em;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
`;
const ReviewFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: auto;
  font-size: 0.85rem;
  color: #b0b0b0;
  opacity: 0.7;
`;
const PlayerTitle = styled.h2`
  color: #eaeaea;
  font-size: 2rem;
  font-weight: 900;
  text-align: center;
  margin: 0 0 1.2rem 0;
  text-shadow: 0 2px 12px #000a;
`;
const BackBtn = styled.button`
  background: none;
  border: none;
  color: #00bcd4;
  font-size: 1.3rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  margin-bottom: 1.2rem;
  margin-left: 0.2rem;
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  transition: background 0.18s, color 0.18s;
  &:hover, &:focus {
    background: #232336;
    color: #fff;
    outline: none;
  }
`;
const PlayerContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  max-height: 80vh;
  aspect-ratio: 16/9;
  margin: 1.5rem auto 2rem auto;
  background: #000;
  border-radius: 2.5rem;
  box-shadow: 0 12px 64px #A35C7A99, 0 2px 16px #000a;
  border: 4px solid #A35C7A;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: box-shadow 0.3s, border 0.3s;
  @media (max-width: 900px) {
    max-width: 100vw;
    max-height: 40vh;
    border-radius: 0;
    border-left: none;
    border-right: none;
  }
`;

const PlayerControls = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(24,24,32,0.92);
  padding: 0.7rem 1.2rem;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 5;
  border-radius: 0 0 3rem 3rem;
`;

const ControlBtn = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  margin: 0 0.5rem;
  cursor: pointer;
  &:hover { color: #ffe066; }
`;

const Time = styled.span`
  color: #ffe066;
  font-size: 1.1rem;
  min-width: 60px;
  text-align: center;
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

const ReviewFormWrapper = styled.div`
  width: 100%;
  max-width: 700px;
  margin: 0 auto 1.5rem auto;
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
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [fullscreen, setFullscreen] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef();
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState("");
  const reviewsGridRef = useRef();
  const reviewsGridScrollRef = useRef();
  const [highlightReviews, setHighlightReviews] = useState(false);

  // Fetch reviews quando cambia il video.id
  useEffect(() => {
    if (!video?.id) return;
    const fetchReviews = async () => {
      setReviewsLoading(true);
      setReviewsError("");
      try {
        const session_token = localStorage.getItem('session_token');
        if (!session_token) {
          setReviews([]);
          setReviewsLoading(false);
          setReviewsError("Devi essere loggato per vedere le recensioni.");
          return;
        }
        const res = await fetch(`http://localhost:8000/get_reviews.php?video_id=${encodeURIComponent(video.id)}`, {
          headers: { 'Authorization': 'Bearer ' + session_token }
        });
        const data = await res.json();
        if (data.success) {
          setReviews(data.reviews);
        } else {
          setReviewsError(data.error || "Errore nel caricamento delle recensioni");
        }
      } catch (err) {
        setReviewsError("Errore di rete");
      }
      setReviewsLoading(false);
    };
    fetchReviews();
  }, [video?.id]);

  // Funzione per ricaricare le recensioni dopo l'invio di una nuova
  const handleReviewAdded = () => {
    if (!video?.id) return;
    setReviewsLoading(true);
    setReviewsError("");
    const session_token = localStorage.getItem('session_token');
    if (!session_token) return;
    fetch(`http://localhost:8000/get_reviews.php?video_id=${encodeURIComponent(video.id)}`, {
      headers: { 'Authorization': 'Bearer ' + session_token }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setReviews(data.reviews);
        else setReviewsError(data.error || "Errore nel caricamento delle recensioni");
        setReviewsLoading(false);
      })
      .catch(() => {
        setReviewsError("Errore di rete");
        setReviewsLoading(false);
      });
  };

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

  // Debug: logga l'id del video
  console.log('video.id:', video.id, typeof video.id);

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

  const formatTime = s => {
    if (isNaN(s)) return '0:00';
    const m = Math.floor(s/60);
    const sec = Math.floor(s%60).toString().padStart(2,'0');
    return `${m}:${sec}`;
  };

  const handleFullscreen = () => {
    if (screenfull.isEnabled && playerRef.current) {
      screenfull.request(playerRef.current.wrapper);
      setFullscreen(true);
    }
  };

  const handleSeeReviews = () => {
    if (reviewsGridRef.current) {
      reviewsGridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Overlay onMouseDown={handleOverlayMouseDown}>
      <Modal ref={modalRef} tabIndex={-1}>
        <BackBtn onClick={() => navigate('/')} aria-label="Torna alla lista">
          <FaArrowLeft /> Torna alla lista
        </BackBtn>
        <TitleRow>
          <ModernLogo />
          <PlayerTitle>{video.title}</PlayerTitle>
        </TitleRow>
        <PlayerContainer ref={playerRef}>
          {loading && !error && <Spinner />}
          {error && video.type === 'youtube' && (
            <div style={{ color: '#e1306c', textAlign: 'center', padding: '2rem', fontWeight: 700 }}>
              Impossibile caricare il video.<br />
              Potrebbe non essere embeddabile o la connessione è lenta.<br />
              <a href={getYoutubeWatchUrl(video.url)} target="_blank" rel="noopener noreferrer" style={{marginTop: '1.5rem', display: 'inline-block', padding: '0.7rem 1.5rem', borderRadius: '1.5rem', border: 'none', background: '#A35C7A', color: '#fff', fontWeight: 700, textDecoration: 'none'}}>Guarda su YouTube</a>
            </div>
          )}
          {!error && (
            <>
              <ReactPlayer
                url={video.url}
                playing={playing}
                muted={muted}
                volume={volume}
                width="100%"
                height="100%"
                controls={false}
                onReady={() => setLoading(false)}
                onError={() => { setLoading(false); setError(true); }}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onProgress={state => setPlayed(state.playedSeconds)}
                onDuration={d => setDuration(d)}
                style={{borderRadius:'2.2rem',background:'#000'}}
              />
              <PlayerControls>
                <ControlBtn onClick={()=>setPlaying(p=>!p)} aria-label={playing?'Pausa':'Play'}>{playing ? '❚❚' : '►'}</ControlBtn>
                <input type="range" min={0} max={duration} value={played} step={0.1} onChange={e=>playerRef.current.seekTo(parseFloat(e.target.value))} style={{flex:1,margin:'0 1rem'}} aria-label="Seek" />
                <Time>{formatTime(played)} / {formatTime(duration)}</Time>
                <ControlBtn onClick={()=>setMuted(m=>!m)} aria-label={muted?'Attiva audio':'Muta'}>{muted ? '🔇' : '🔊'}</ControlBtn>
                <input type="range" min={0} max={1} step={0.01} value={volume} onChange={e=>setVolume(parseFloat(e.target.value))} style={{width:70,margin:'0 0.5rem'}} aria-label="Volume" />
                <ControlBtn onClick={handleFullscreen} aria-label="Fullscreen">⛶</ControlBtn>
              </PlayerControls>
            </>
          )}
        </PlayerContainer>
        {/* Form recensione sotto il player */}
        <ReviewFormWrapper>
          <ReviewForm video_id={video.id?.toString()} onReviewAdded={handleReviewAdded} />
        </ReviewFormWrapper>
        {/* Lista recensioni */}
        <div
          ref={reviewsGridRef}
          style={{
            marginTop: '1.2rem',
            width: '100%',
            maxWidth: 700,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <h3 style={{margin:'0 0 1.1rem 0', color:'#eaeaea', fontWeight:700, fontSize:'1.18rem', textAlign:'left'}}>Recensioni</h3>
          {reviewsLoading ? (
            <div style={{color:'#ffe066',fontWeight:700}}>Caricamento recensioni...</div>
          ) : reviewsError ? (
            <div style={{color:'#ff5252',fontWeight:700}}>{reviewsError}</div>
          ) : reviews.length === 0 ? (
            <div style={{color:'#aaa',textAlign:'center'}}>Nessuna recensione per questo video.</div>
          ) : (
            <div style={{display:'flex', flexDirection:'column', gap:0}}>
              {reviews.map(r => (
                <div key={r.id} style={{display:'flex', alignItems:'flex-start', padding:'0.9rem 0', borderBottom:'1px solid #333', fontSize:'1.05rem'}}>
                  <div style={{width:36, height:36, borderRadius:'50%', background:'linear-gradient(120deg, #A35C7A 0%, #7B3F61 100%)', color:'#fff', fontWeight:700, fontSize:'1.15rem', display:'flex', alignItems:'center', justifyContent:'center', marginRight:13}}>
                    {r.username ? r.username[0].toUpperCase() : '?'}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:2}}>
                      <span style={{fontWeight:600, color:'#fff', fontSize:'1.05rem'}}>{r.username || 'Utente'}</span>
                      <span style={{display:'flex', alignItems:'center', gap:1}}>
                        {[1,2,3,4,5].map(n => (
                          n <= r.rating ? <AiFillStar key={n} color="#ffc107" style={{fontSize:'1.1rem'}} /> : <AiOutlineStar key={n} color="#444" style={{fontSize:'1.1rem'}} />
                        ))}
                      </span>
                      <span style={{color:'#b0b0b0', fontSize:'0.93rem', marginLeft:10, display:'flex', alignItems:'center', gap:2}}>
                        <AiOutlineClockCircle style={{marginRight:2}} />
                        {r.created_at ? new Date(r.created_at).toLocaleString() : ''}
                      </span>
                    </div>
                    <div style={{color:'#b0b0b0', fontStyle:'italic', fontSize:'1.01rem', marginTop:2}}>{r.comment || <span style={{color:'#555'}}>Nessun commento</span>}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </Overlay>
  );
}

export default VideoModal; 