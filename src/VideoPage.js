import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaHeart, FaRegHeart, FaPlay, FaStar, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import VideoModal from './VideoModal';
import ReviewForm from './ReviewForm';
import { toast } from 'sonner';

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

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 50%, ${COLORS.accent} 100%);
  padding: 2rem;
`;

const BackButton = styled.button`
  background: ${COLORS.accent};
  color: ${COLORS.white};
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  margin-bottom: 2rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${COLORS.highlight};
    transform: translateY(-2px);
  }
`;

const VideoContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const VideoSection = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 2rem;
  padding: 2rem;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(251, 158, 58, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
`;

const VideoThumbnail = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 1rem;
  overflow: hidden;
  margin-bottom: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
  }
`;

const VideoImage = styled.img`
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
  color: ${COLORS.white};
`;

const VideoInfo = styled.div`
  color: ${COLORS.text};
`;

const VideoTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 900;
  margin-bottom: 1rem;
  line-height: 1.3;
`;

const VideoChannel = styled.p`
  color: ${COLORS.textMuted};
  font-size: 1.1rem;
  margin-bottom: 1rem;
`;

const VideoActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const FavoriteButton = styled.button`
  background: ${props => props.$isFavorite ? COLORS.highlight : COLORS.accent};
  color: ${COLORS.white};
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  &:hover {
    background: ${COLORS.highlight};
    transform: translateY(-2px);
  }
`;

const WatchButton = styled.button`
  background: ${COLORS.accent};
  color: ${COLORS.white};
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  &:hover {
    background: ${COLORS.highlight};
    transform: translateY(-2px);
  }
`;

const ReviewsSection = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 2rem;
  padding: 2rem;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(251, 158, 58, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
`;

const ReviewsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const ReviewsTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 900;
  color: ${COLORS.text};
`;

const AddReviewButton = styled.button`
  background: ${COLORS.accent};
  color: ${COLORS.white};
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${COLORS.highlight};
    transform: translateY(-2px);
  }
`;

const ReviewsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ReviewCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const ReviewInfo = styled.div`
  flex: 1;
`;

const ReviewTitle = styled.h4`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${COLORS.text};
  margin-bottom: 0.5rem;
`;

const ReviewRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  margin-bottom: 0.5rem;
`;

const ReviewAuthor = styled.div`
  color: ${COLORS.textMuted};
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const ReviewDate = styled.div`
  color: ${COLORS.textMuted};
  font-size: 0.8rem;
  font-style: italic;
`;

const ReviewText = styled.p`
  color: ${COLORS.textMuted};
  line-height: 1.6;
`;

const ReviewActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: ${props => props.$delete ? '#e74c3c' : COLORS.accent};
  color: ${COLORS.white};
  border: none;
  padding: 0.5rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    transform: scale(1.1);
    background: ${props => props.$delete ? '#c0392b' : COLORS.highlight};
  }
`;

const EmptyReviews = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: ${COLORS.textMuted};
`;

const Modal = styled.div`
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
`;

const ModalContent = styled.div`
  background: rgba(35, 35, 55, 0.95);
  border-radius: 1rem;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: ${COLORS.textMuted};
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.3s ease;
  
  &:hover {
    color: ${COLORS.text};
  }
`;

function VideoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [video, setVideo] = useState(location.state?.video || null);
  const [reviews, setReviews] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  console.log('VideoPage loaded, video:', video);
  console.log('VideoPage id:', id);

  const loadVideo = React.useCallback(async () => {
    if (video) {
      setLoading(false);
      return;
    }

    try {
      const API_URL = 'http://localhost:8000';
      const response = await fetch(`${API_URL}/get_movies.php`);
      const data = await response.json();
      console.log('loadVideo response:', data);
      if (data.success && data.movies) {
        const foundVideo = data.movies.find(v => v.id === parseInt(id));
        console.log('foundVideo:', foundVideo);
        if (foundVideo) {
          setVideo(foundVideo);
        }
      }
    } catch (error) {
      console.error('Error loading movie:', error);
    }
    setLoading(false);
  }, [video, id]);

  const loadFavorites = async () => {
    const sessionToken = localStorage.getItem('sessionToken');
    if (!sessionToken) return;

    try {
      const API_URL = 'http://localhost:8000';
      const response = await fetch(`${API_URL}/get_favorites.php`, {
        headers: { 'Authorization': 'Bearer ' + sessionToken }
      });
      const data = await response.json();
      if (data.success) {
        setFavorites(data.favorites || []);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const loadReviews = React.useCallback(async () => {
    if (!id) return;
    
    try {
      const API_URL = 'http://localhost:8000';
      const response = await fetch(`${API_URL}/get_reviews.php?video_id=${id}`);
      const data = await response.json();
      if (data.success) {
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  }, [id]);

  useEffect(() => {
    const sessionToken = localStorage.getItem('sessionToken');
    const userInfo = localStorage.getItem('userInfo');
    
    if (sessionToken && userInfo) {
      setLoggedIn(true);
      setCurrentUser(JSON.parse(userInfo));
    }
    
    loadVideo();
    loadFavorites();
    if (id) {
      loadReviews();
    }
  }, [id, loadVideo, loadReviews]);

  const toggleFavorite = async () => {
    if (!loggedIn) {
      toast.error('You must be logged in to add favorites');
      return;
    }

    const sessionToken = localStorage.getItem('sessionToken');
    try {
      const API_URL = 'http://localhost:8000';
      const response = await fetch(`${API_URL}/toggle_favorite.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + sessionToken
        },
        body: JSON.stringify({ video_id: id })
      });
      const data = await response.json();
      if (data.success) {
        toast.success(isFavorite ? 'Removed from favorites!' : 'Added to favorites!');
        setFavorites(prev => 
          prev.includes(id) 
            ? prev.filter(favId => favId !== id)
            : [...prev, id]
        );
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowReviewForm(true);
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    const sessionToken = localStorage.getItem('sessionToken');
    try {
      const API_URL = 'http://localhost:8000';
      const response = await fetch(`${API_URL}/delete_review.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + sessionToken
        },
        body: JSON.stringify({ review_id: reviewId })
      });
      const data = await response.json();
      
      if (data.success) {
        toast.success('Review deleted successfully!');
        setReviews(reviews.filter(r => r.id !== reviewId));
      } else {
        toast.error('Error deleting review');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Connection error');
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar key={i} style={{ color: i < rating ? '#FFD700' : '#444' }} />
    ));
  };

  const handleVideoClick = () => {
    console.log('Video clicked, trailer_id:', video.trailer_id);
    if (video.trailer_id) {
      setShowVideoModal(true);
    } else {
      toast.error('No trailer available for this movie');
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ color: COLORS.accent, fontSize: '1.2rem' }}>Loading...</div>
        </div>
      </PageContainer>
    );
  }

  if (!video) {
    return (
      <PageContainer>
        <BackButton onClick={() => navigate('/')}>← Back to Home</BackButton>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ color: COLORS.accent, fontSize: '1.2rem' }}>Video not found</div>
        </div>
      </PageContainer>
    );
  }

  const isFavorite = favorites.includes(id);

  return (
    <PageContainer>
      <BackButton onClick={() => navigate('/')}>← Back to Home</BackButton>
      
      <VideoContainer>
        <VideoSection>
          <VideoThumbnail onClick={handleVideoClick}>
            <VideoImage src={video.poster_url} alt={video.title} />
            <PlayOverlay>
              <PlayButton>
                <FaPlay />
              </PlayButton>
            </PlayOverlay>
          </VideoThumbnail>
          
          <VideoInfo>
            <VideoTitle>{video.title}</VideoTitle>
            <VideoChannel>{video.release_date}</VideoChannel>
            {video.average_rating !== null && video.average_rating !== undefined && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '1.1rem', color: COLORS.accent, margin: '0.5rem 0' }}>
                <FaStar style={{ color: '#FFD700' }} />
                {video.average_rating}/5
              </div>
            )}
            {video.overview && (
              <div style={{ margin: '1rem 0', color: COLORS.textMuted, lineHeight: '1.6' }}>
                {video.overview}
              </div>
            )}
            
            <VideoActions>
              <FavoriteButton 
                $isFavorite={isFavorite}
                onClick={toggleFavorite}
              >
                {isFavorite ? <FaHeart /> : <FaRegHeart />}
                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </FavoriteButton>
              
              {video.trailer_id ? (
                <WatchButton onClick={() => setShowVideoModal(true)}>
                  <FaPlay />
                  Watch Trailer
                </WatchButton>
              ) : (
                <WatchButton disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                  <FaPlay />
                  No Trailer Available
                </WatchButton>
              )}
            </VideoActions>
          </VideoInfo>
        </VideoSection>

        <ReviewsSection>
          <ReviewsHeader>
            <ReviewsTitle>Reviews ({reviews.length})</ReviewsTitle>
            {loggedIn && (
              <AddReviewButton onClick={() => setShowReviewForm(true)}>
                Write Review
              </AddReviewButton>
            )}
          </ReviewsHeader>

          {reviews.length > 0 ? (
            <ReviewsList>
              {reviews.map((review) => (
                <ReviewCard key={review.id}>
                  <ReviewHeader>
                    <ReviewInfo>
                      <ReviewTitle>{review.title}</ReviewTitle>
                      <ReviewRating>
                        {renderStars(review.rating)}
                        <span style={{ marginLeft: '0.5rem', color: COLORS.textMuted }}>
                          ({review.rating}/5)
                        </span>
                      </ReviewRating>
                      <ReviewAuthor>
                        By: <Link to={`/user/${review.user_id}`} style={{ color: COLORS.accent, textDecoration: 'underline', fontWeight: 600 }}>
                          {review.nickname ? review.nickname : 'User'}
                        </Link>
                      </ReviewAuthor>
                      <ReviewDate>
                        {new Date(review.created_at).toLocaleDateString('en-US')}
                      </ReviewDate>
                    </ReviewInfo>
                    
                    {loggedIn && currentUser && (
                      (currentUser.email === review.email || currentUser.name === review.username) && (
                        <ReviewActions>
                          <ActionButton onClick={() => handleEditReview(review)}>
                            <FaEdit />
                          </ActionButton>
                          <ActionButton $delete onClick={() => handleDeleteReview(review.id)}>
                            <FaTrash />
                          </ActionButton>
                        </ReviewActions>
                      )
                    )}
                  </ReviewHeader>
                  <ReviewText>{review.review}</ReviewText>
                </ReviewCard>
              ))}
            </ReviewsList>
          ) : (
            <EmptyReviews>
              <FaStar style={{ fontSize: '3rem', marginBottom: '1rem', color: COLORS.textMuted }} />
              <h3>No reviews yet</h3>
              <p>Be the first to write a review for this video!</p>
            </EmptyReviews>
          )}
        </ReviewsSection>
      </VideoContainer>

      {showVideoModal && video.trailer_id && (
        <VideoModal 
          videoId={video.trailer_id} 
          videoTitle={video.title}
          onClose={() => setShowVideoModal(false)} 
        />
      )}

      {showReviewForm && (
        <Modal>
          <ModalContent>
            <CloseButton onClick={() => {
              setShowReviewForm(false);
              setEditingReview(null);
            }}>
              <FaTimes />
            </CloseButton>
            <ReviewForm
              videoId={id}
              editingReview={editingReview}
              onSuccess={(newReview) => {
                if (editingReview) {
                  setReviews(reviews.map(r => 
                    r.id === editingReview.id ? newReview : r
                  ));
                } else {
                  setReviews([newReview, ...reviews]);
                }
                setShowReviewForm(false);
                setEditingReview(null);
              }}
              onCancel={() => {
                setShowReviewForm(false);
                setEditingReview(null);
              }}
            />
          </ModalContent>
        </Modal>
      )}
    </PageContainer>
  );
}

export default VideoPage; 