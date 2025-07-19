import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaEdit, FaTrash, FaStar, FaUser, FaEnvelope } from 'react-icons/fa';

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

const ProfileContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%);
  padding: 2rem;
  color: ${COLORS.text};
`;

const ProfileCard = styled.div`
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

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(90deg, ${COLORS.secondary} 0%, ${COLORS.primary} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: ${COLORS.glass};
  border-radius: 1rem;
  border: 1px solid ${COLORS.glassBorder};
`;

const UserIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${COLORS.secondary} 0%, ${COLORS.primary} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: ${COLORS.text};
`;

const UserDetails = styled.div`
  text-align: left;
`;

const Username = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: ${COLORS.text};
`;

const Email = styled.p`
  color: ${COLORS.textMuted};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid ${COLORS.glassBorder};
`;

const Tab = styled.button`
  background: ${props => props.active ? COLORS.accent : 'transparent'};
  color: ${COLORS.text};
  border: none;
  padding: 1rem 2rem;
  border-radius: 0.75rem 0.75rem 0 0;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? COLORS.accent : COLORS.glassHover};
  }
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: ${COLORS.text};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const Card = styled.div`
  background: ${COLORS.glass};
  border: 1px solid ${COLORS.glassBorder};
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${COLORS.glassHover};
    transform: translateY(-2px);
    box-shadow: 0 4px 24px ${COLORS.accent}33;
  }
`;

const VideoCard = styled(Card)`
  cursor: pointer;
`;

const VideoThumb = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
`;

const VideoTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${COLORS.text};
`;

const VideoChannel = styled.p`
  color: ${COLORS.textMuted};
  font-size: 0.9rem;
`;

const ReviewCard = styled(Card)`
  position: relative;
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const ReviewTitle = styled.h4`
  font-size: 1.1rem;
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

const ReviewDate = styled.p`
  color: ${COLORS.textMuted};
  font-size: 0.8rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  position: absolute;
  top: 1rem;
  right: 1rem;
`;

const ActionButton = styled.button`
  background: ${props => props.delete ? COLORS.highlight : COLORS.accent};
  color: ${COLORS.text};
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${COLORS.textMuted};
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
  
  &:hover {
    background: ${COLORS.highlight};
    transform: translateY(-2px);
  }
`;

const EditModal = styled.div`
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

const EditForm = styled.div`
  background: rgba(35, 35, 55, 0.95);
  border-radius: 1rem;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  backdrop-filter: blur(20px);
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: ${COLORS.text};
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${COLORS.glassBorder};
  border-radius: 0.5rem;
  background: ${COLORS.glass};
  color: ${COLORS.text};
  
  &:focus {
    outline: none;
    border-color: ${COLORS.accent};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${COLORS.glassBorder};
  border-radius: 0.5rem;
  background: ${COLORS.glass};
  color: ${COLORS.text};
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${COLORS.accent};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${COLORS.glassBorder};
  border-radius: 0.5rem;
  background: ${COLORS.glass};
  color: ${COLORS.text};
  
  &:focus {
    outline: none;
    border-color: ${COLORS.accent};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const Button = styled.button`
  background: ${props => props.secondary ? 'transparent' : COLORS.accent};
  color: ${COLORS.text};
  border: 1px solid ${props => props.secondary ? COLORS.glassBorder : 'transparent'};
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.secondary ? COLORS.glassHover : COLORS.highlight};
  }
`;

function Profile() {
  const [activeTab, setActiveTab] = useState('favorites');
  const [favorites, setFavorites] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    rating: 5,
    review: ''
  });
  const navigate = useNavigate();

  const user = localStorage.getItem('username');
  const sessionToken = localStorage.getItem('session_token');

  useEffect(() => {
    if (!sessionToken) {
      navigate('/login');
      return;
    }
    
    loadUserData();
  }, [sessionToken, navigate]);

  const loadUserData = async () => {
    try {
      // Carica preferiti
      const favoritesResponse = await fetch('http://localhost:8000/get_favorites.php', {
        headers: { 'Authorization': 'Bearer ' + sessionToken }
      });
      const favoritesData = await favoritesResponse.json();
      
      if (favoritesData.success) {
        const favoriteIds = favoritesData.favorites || [];
        
        // Carica i dettagli dei video preferiti
        const videoDetails = [];
        for (const videoId of favoriteIds) {
          try {
            const videoResponse = await fetch(`http://localhost:8000/youtube_videos.php?category=trailers`);
            const videoData = await videoResponse.json();
            
            if (videoData.success && videoData.videos) {
              const video = videoData.videos.find(v => v.id === videoId);
              if (video) {
                videoDetails.push(video);
              }
            }
          } catch (error) {
            console.error(`Errore nel caricamento del video ${videoId}:`, error);
          }
        }
        
        setFavorites(videoDetails);
      }

      // Carica recensioni
      const reviewsResponse = await fetch('http://localhost:8000/get_my_reviews.php', {
        headers: { 'Authorization': 'Bearer ' + sessionToken }
      });
      const reviewsData = await reviewsResponse.json();
      
      if (reviewsData.success) {
        const reviews = reviewsData.reviews || [];
        
        // Carica i dettagli dei video per le recensioni
        const reviewsWithVideoInfo = [];
        for (const review of reviews) {
          try {
            const videoResponse = await fetch(`http://localhost:8000/youtube_videos.php?category=trailers`);
            const videoData = await videoResponse.json();
            
            if (videoData.success && videoData.videos) {
              const video = videoData.videos.find(v => v.id === review.video_id);
              if (video) {
                reviewsWithVideoInfo.push({
                  ...review,
                  video_title: video.title,
                  video_thumb: video.thumb,
                  video_channel: video.channel
                });
              } else {
                reviewsWithVideoInfo.push({
                  ...review,
                  video_title: 'Video non trovato',
                  video_thumb: 'https://via.placeholder.com/300x200/522258/ffffff?text=Video+Non+Trovato',
                  video_channel: 'Unknown'
                });
              }
            }
          } catch (error) {
            console.error(`Errore nel caricamento del video ${review.video_id}:`, error);
            reviewsWithVideoInfo.push({
              ...review,
              video_title: 'Errore nel caricamento',
              video_thumb: 'https://via.placeholder.com/300x200/522258/ffffff?text=Errore',
              video_channel: 'Error'
            });
          }
        }
        
        setReviews(reviewsWithVideoInfo);
      }
    } catch (error) {
      console.error('Errore nel caricamento dati:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('session_token');
    navigate('/login');
  };

  const handleVideoClick = (videoId) => {
    navigate(`/video/${videoId}`);
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setEditForm({
      title: review.title,
      rating: review.rating,
      review: review.review
    });
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Sei sicuro di voler eliminare questa recensione?')) {
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/delete_review.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + sessionToken
        },
        body: JSON.stringify({ review_id: reviewId })
      });

      const data = await response.json();
      
      if (data.success) {
        setReviews(reviews.filter(r => r.id !== reviewId));
        alert('Recensione eliminata con successo!');
      } else {
        alert('Errore nell\'eliminazione della recensione');
      }
    } catch (error) {
      console.error('Errore:', error);
      alert('Errore di connessione');
    }
  };

  const handleSaveReview = async () => {
    try {
      const response = await fetch('http://localhost:8000/edit_review.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + sessionToken
        },
        body: JSON.stringify({
          review_id: editingReview.id,
          title: editForm.title,
          rating: editForm.rating,
          review: editForm.review
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setReviews(reviews.map(r => 
          r.id === editingReview.id 
            ? { ...r, title: editForm.title, rating: editForm.rating, review: editForm.review }
            : r
        ));
        setEditingReview(null);
        alert('Recensione aggiornata con successo!');
      } else {
        alert('Errore nell\'aggiornamento della recensione');
      }
    } catch (error) {
      console.error('Errore:', error);
      alert('Errore di connessione');
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar key={i} style={{ color: i < rating ? '#FFD700' : '#444' }} />
    ));
  };

  if (loading) {
    return (
      <ProfileContainer>
        <ProfileCard>
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ color: COLORS.accent, fontSize: '1.2rem' }}>Caricamento...</div>
          </div>
        </ProfileCard>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <ProfileCard>
        <BackButton onClick={() => navigate('/')}>
          ← Torna alla Home
        </BackButton>

        <Header>
          <Title>Profilo Utente</Title>
          <UserInfo>
            <UserIcon>
              <FaUser />
            </UserIcon>
            <UserDetails>
              <Username>{user}</Username>
              <Email>
                <FaEnvelope />
                {user}@example.com
              </Email>
            </UserDetails>
          </UserInfo>
        </Header>

        <TabsContainer>
          <Tab 
            active={activeTab === 'favorites'} 
            onClick={() => setActiveTab('favorites')}
          >
            Preferiti ({favorites.length})
          </Tab>
          <Tab 
            active={activeTab === 'reviews'} 
            onClick={() => setActiveTab('reviews')}
          >
            Le Mie Recensioni ({reviews.length})
          </Tab>
        </TabsContainer>

        {activeTab === 'favorites' && (
          <Section>
            <SectionTitle>I Tuoi Video Preferiti</SectionTitle>
            {favorites.length > 0 ? (
              <Grid>
                {favorites.map((video) => (
                  <VideoCard key={video.id} onClick={() => handleVideoClick(video.id)}>
                    <VideoThumb src={video.thumb} alt={video.title} />
                    <VideoTitle>{video.title}</VideoTitle>
                    <VideoChannel>{video.channel}</VideoChannel>
                  </VideoCard>
                ))}
              </Grid>
            ) : (
              <EmptyState>
                <FaRegHeart style={{ fontSize: '3rem', marginBottom: '1rem', color: COLORS.textMuted }} />
                <h3>Nessun video preferito</h3>
                <p>I video che aggiungi ai preferiti appariranno qui</p>
              </EmptyState>
            )}
          </Section>
        )}

        {activeTab === 'reviews' && (
          <Section>
            <SectionTitle>Le Tue Recensioni</SectionTitle>
            {reviews.length > 0 ? (
              <Grid>
                {reviews.map((review) => (
                  <ReviewCard key={review.id}>
                    <ReviewHeader>
                      <div>
                        <ReviewTitle>{review.title}</ReviewTitle>
                        <div style={{ color: COLORS.textMuted, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                          Per: {review.video_title}
                        </div>
                        <ReviewRating>
                          {renderStars(review.rating)}
                          <span style={{ marginLeft: '0.5rem', color: COLORS.textMuted }}>
                            ({review.rating}/5)
                          </span>
                        </ReviewRating>
                      </div>
                      <ActionButtons>
                        <ActionButton onClick={() => handleEditReview(review)}>
                          <FaEdit />
                        </ActionButton>
                        <ActionButton delete onClick={() => handleDeleteReview(review.id)}>
                          <FaTrash />
                        </ActionButton>
                      </ActionButtons>
                    </ReviewHeader>
                    <ReviewText>{review.review}</ReviewText>
                    <ReviewDate>
                      Pubblicata il {new Date(review.created_at).toLocaleDateString('it-IT')}
                    </ReviewDate>
                  </ReviewCard>
                ))}
              </Grid>
            ) : (
              <EmptyState>
                <FaStar style={{ fontSize: '3rem', marginBottom: '1rem', color: COLORS.textMuted }} />
                <h3>Nessuna recensione</h3>
                <p>Le recensioni che scrivi appariranno qui</p>
              </EmptyState>
            )}
          </Section>
        )}

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Button secondary onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </ProfileCard>

      {editingReview && (
        <EditModal>
          <EditForm>
            <h3 style={{ marginBottom: '1.5rem', color: COLORS.text }}>Modifica Recensione</h3>
            
            <FormGroup>
              <Label>Titolo</Label>
              <Input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                placeholder="Titolo della recensione"
              />
            </FormGroup>

            <FormGroup>
              <Label>Valutazione</Label>
              <Select
                value={editForm.rating}
                onChange={(e) => setEditForm({ ...editForm, rating: parseInt(e.target.value) })}
              >
                <option value={1}>1 stella</option>
                <option value={2}>2 stelle</option>
                <option value={3}>3 stelle</option>
                <option value={4}>4 stelle</option>
                <option value={5}>5 stelle</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Recensione</Label>
              <TextArea
                value={editForm.review}
                onChange={(e) => setEditForm({ ...editForm, review: e.target.value })}
                placeholder="Scrivi la tua recensione..."
              />
            </FormGroup>

            <ButtonGroup>
              <Button onClick={handleSaveReview}>
                Salva Modifiche
              </Button>
              <Button secondary onClick={() => setEditingReview(null)}>
                Annulla
              </Button>
            </ButtonGroup>
          </EditForm>
        </EditModal>
      )}
    </ProfileContainer>
  );
}

export default Profile; 