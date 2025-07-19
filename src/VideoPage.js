import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaArrowLeft, FaStar, FaUser } from 'react-icons/fa';
import VideoModal from './VideoModal';
import ReviewForm from './ReviewForm';

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

const VideoPageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%);
  padding: 2rem;
  color: ${COLORS.text};
`;

const BackButton = styled.button`
  background: ${COLORS.accent};
  color: ${COLORS.text};
  border: none;
  border-radius: 0.75rem;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: ${COLORS.highlight};
    transform: translateY(-2px);
  }
`;

const VideoCard = styled.div`
  background: rgba(35, 35, 55, 0.95);
  border-radius: 2rem;
  padding: 3rem;
  max-width: 1200px;
  margin: 0 auto;
  box-shadow: 0 8px 32px 0 ${COLORS.accent}33, 0 2px 12px #000a;
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid ${COLORS.glassBorder};
`;

const VideoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 2rem;
`;

const VideoInfo = styled.div`
  flex: 1;
`;

const VideoTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: ${COLORS.text};
`;

const VideoChannel = styled.p`
  color: ${COLORS.textMuted};
  font-size: 1.2rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const VideoDescription = styled.p`
  color: ${COLORS.textMuted};
  line-height: 1.6;
  font-size: 1rem;
`;

const VideoThumbnail = styled.div`
  position: relative;
  width: 300px;
  height: 200px;
  border-radius: 1rem;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 32px ${COLORS.accent}44;
  }
`;

const ThumbImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PlayOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  ${VideoThumbnail}:hover & {
    opacity: 1;
  }
`;

const PlayButton = styled.div`
  width: 80px;
  height: 80px;
  background: ${COLORS.accent};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: ${COLORS.text};
  box-shadow: 0 4px 24px ${COLORS.accent}55;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const ActionButton = styled.button`
  background: ${props => props.primary ? COLORS.accent : 'transparent'};
  color: ${COLORS.text};
  border: 1px solid ${props => props.primary ? 'transparent' : COLORS.glassBorder};
  border-radius: 0.75rem;
  padding: 1rem 2rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: ${props => props.primary ? COLORS.highlight : COLORS.glassHover};
    transform: translateY(-2px);
  }
`;

const ReviewsSection = styled.div`
  margin-top: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: ${COLORS.text};
`;

const ReviewsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ReviewCard = styled.div`
  background: ${COLORS.glass};
  border: 1px solid ${COLORS.glassBorder};
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${COLORS.glassHover};
    transform: translateY(-2px);
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const ReviewTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${COLORS.text};
  margin-bottom: 0.5rem;
`;

const ReviewRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #FFD700;
  font-size: 0.9rem;
`;

const ReviewText = styled.p`
  color: ${COLORS.textMuted};
  line-height: 1.5;
  margin-bottom: 1rem;
`;

const ReviewMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${COLORS.textMuted};
  font-size: 0.9rem;
`;

const ReviewAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${COLORS.textMuted};
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  color: ${COLORS.accent};
  font-size: 1.2rem;
`;

function VideoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [video, setVideo] = useState(location.state?.video || null);
  const [reviews, setReviews] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(!video);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const sessionToken = localStorage.getItem('session_token');
  const loggedIn = localStorage.getItem('loggedIn') === 'true';

  useEffect(() => {
    if (!video) {
      loadVideo();
    }
    loadReviews();
    loadFavorites();
  }, [id, video]);

  const loadVideo = async () => {
    try {
      // Per ora, cerchiamo il video tra quelli caricati
      // In futuro, potremmo creare un'API specifica per ottenere un singolo video
      const response = await fetch(`http://localhost:8000/youtube_videos.php?category=trailers`);
      const data = await response.json();
      
      if (data.success && data.videos) {
        const foundVideo = data.videos.find(v => v.id === id);
        if (foundVideo) {
          setVideo(foundVideo);
        } else {
          // Se non lo troviamo, creiamo un video di fallback
          setVideo({
            id: id,
            title: 'Video non trovato',
            description: 'Questo video non è disponibile al momento.',
            channel: 'Unknown',
            thumb: 'https://via.placeholder.com/300x200/522258/ffffff?text=Video+Non+Trovato'
          });
        }
      }
    } catch (error) {
      console.error('Errore nel caricamento del video:', error);
      setVideo({
        id: id,
        title: 'Errore nel caricamento',
        description: 'Si è verificato un errore nel caricamento del video.',
        channel: 'Error',
        thumb: 'https://via.placeholder.com/300x200/522258/ffffff?text=Errore'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    if (!id) return;
    
    try {
      const response = await fetch(`http://localhost:8000/get_reviews.php?video_id=${id}`);
      const data = await response.json();
      
      if (data.success) {
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error('Errore nel caricamento delle recensioni:', error);
    }
  };

  const loadFavorites = async () => {
    if (!sessionToken) return;
    
    try {
      const response = await fetch('http://localhost:8000/get_favorites.php', {
        headers: { 'Authorization': 'Bearer ' + sessionToken }
      });
      const data = await response.json();
      
      if (data.success) {
        setFavorites(data.favorites || []);
      }
    } catch (error) {
      console.error('Errore nel caricamento dei preferiti:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!loggedIn) {
      alert('Devi essere loggato per aggiungere ai preferiti');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/toggle_favorite.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + sessionToken
        },
        body: JSON.stringify({ video_id: id })
      });

      const data = await response.json();
      
      if (data.success) {
        setFavorites(favs => data.favorited ? [...favs, id] : favs.filter(f => f !== id));
      }
    } catch (error) {
      console.error('Errore nel toggle dei preferiti:', error);
    }
  };

  const handleReviewAdded = () => {
    loadReviews();
    setShowReviewForm(false);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar key={i} style={{ color: i < rating ? '#FFD700' : '#444' }} />
    ));
  };

  if (loading) {
    return (
      <VideoPageContainer>
        <LoadingSpinner>Caricamento video...</LoadingSpinner>
      </VideoPageContainer>
    );
  }

  if (!video) {
    return (
      <VideoPageContainer>
        <BackButton onClick={() => navigate('/')}>
          <FaArrowLeft />
          Torna alla Home
        </BackButton>
        <VideoCard>
          <EmptyState>
            <h2>Video non trovato</h2>
            <p>Il video che stai cercando non esiste o non è disponibile.</p>
          </EmptyState>
        </VideoCard>
      </VideoPageContainer>
    );
  }

  const isFavorite = favorites.includes(id);

  return (
    <VideoPageContainer>
      <BackButton onClick={() => navigate('/')}>
        <FaArrowLeft />
        Torna alla Home
      </BackButton>

      <VideoCard>
        <VideoHeader>
          <VideoInfo>
            <VideoTitle>{video.title}</VideoTitle>
            <VideoChannel>
              <FaUser />
              {video.channel}
            </VideoChannel>
            <VideoDescription>{video.description}</VideoDescription>
            
            <ActionButtons>
              <ActionButton primary onClick={() => setShowVideoModal(true)}>
                ▶ Guarda Video
              </ActionButton>
              <ActionButton onClick={toggleFavorite}>
                {isFavorite ? <FaHeart style={{ color: '#e1306c' }} /> : <FaRegHeart />}
                {isFavorite ? 'Rimuovi dai Preferiti' : 'Aggiungi ai Preferiti'}
              </ActionButton>
              {loggedIn && (
                <ActionButton onClick={() => setShowReviewForm(true)}>
                  ✍ Scrivi Recensione
                </ActionButton>
              )}
            </ActionButtons>
          </VideoInfo>

          <VideoThumbnail onClick={() => setShowVideoModal(true)}>
            <ThumbImage src={video.thumb} alt={video.title} />
            <PlayOverlay>
              <PlayButton>▶</PlayButton>
            </PlayOverlay>
          </VideoThumbnail>
        </VideoHeader>

        <ReviewsSection>
          <SectionTitle>Recensioni ({reviews.length})</SectionTitle>
          
          {reviews.length > 0 ? (
            <ReviewsList>
              {reviews.map((review) => (
                <ReviewCard key={review.id}>
                  <ReviewHeader>
                    <div>
                      <ReviewTitle>{review.title}</ReviewTitle>
                      <ReviewRating>
                        {renderStars(review.rating)}
                        <span style={{ marginLeft: '0.5rem', color: COLORS.textMuted }}>
                          ({review.rating}/5)
                        </span>
                      </ReviewRating>
                    </div>
                  </ReviewHeader>
                  <ReviewText>{review.review}</ReviewText>
                  <ReviewMeta>
                    <ReviewAuthor>
                      <FaUser />
                      {review.username}
                    </ReviewAuthor>
                    <span>{new Date(review.created_at).toLocaleDateString('it-IT')}</span>
                  </ReviewMeta>
                </ReviewCard>
              ))}
            </ReviewsList>
          ) : (
            <EmptyState>
              <h3>Nessuna recensione</h3>
              <p>Sii il primo a scrivere una recensione per questo video!</p>
            </EmptyState>
          )}
        </ReviewsSection>
      </VideoCard>

      {showVideoModal && (
        <VideoModal
          video={video}
          onClose={() => setShowVideoModal(false)}
          onToggleFavorite={toggleFavorite}
        />
      )}

      {showReviewForm && (
        <ReviewForm
          video_id={id}
          onReviewAdded={handleReviewAdded}
          onClose={() => setShowReviewForm(false)}
        />
      )}
    </VideoPageContainer>
  );
}

export default VideoPage; 