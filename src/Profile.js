import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEdit, FaSignOutAlt, FaCamera, FaStar, FaRegHeart, FaTrash } from 'react-icons/fa';
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

const ProfileContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 50%, ${COLORS.accent} 100%);
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const ProfileCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 2rem;
  padding: 3rem;
  max-width: 1000px;
  width: 100%;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(251, 158, 58, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
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

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 900;
  color: ${COLORS.text};
  margin-bottom: 2rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const UserIcon = styled.div`
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

const UserDetails = styled.div`
  text-align: left;
`;

const Username = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${COLORS.text};
  margin-bottom: 0.5rem;
`;

const Email = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${COLORS.textMuted};
  font-size: 1rem;
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
`;

const Tab = styled.button`
  background: ${props => props.$active ? COLORS.accent : 'transparent'};
  color: ${props => props.$active ? COLORS.white : COLORS.text};
  border: 2px solid ${COLORS.accent};
  padding: 1rem 2rem;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  
  &:hover {
    background: ${COLORS.accent};
    color: ${COLORS.white};
    transform: translateY(-2px);
  }
`;

const Section = styled.div`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${COLORS.text};
  margin-bottom: 2rem;
  text-align: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const VideoCard = styled.div`
  background: rgba(255, 255, 255, 0.8);
  border-radius: 1rem;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(251, 158, 58, 0.2);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    border-color: ${COLORS.accent};
  }
`;

const VideoThumb = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
`;

const VideoTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${COLORS.text};
  margin: 1rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const VideoChannel = styled.p`
  color: ${COLORS.textMuted};
  margin: 0 1rem 1rem 1rem;
  font-size: 0.9rem;
`;

const ReviewCard = styled.div`
  background: rgba(255, 255, 255, 0.8);
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid rgba(251, 158, 58, 0.2);
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
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

const ReviewText = styled.p`
  color: ${COLORS.textMuted};
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const ReviewDate = styled.div`
  color: ${COLORS.textMuted};
  font-size: 0.9rem;
  font-style: italic;
`;

const ActionButtons = styled.div`
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

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${COLORS.textMuted};
`;

const Button = styled.button`
  background: ${props => props.secondary ? 'transparent' : COLORS.accent};
  color: ${props => props.secondary ? COLORS.text : COLORS.white};
  border: ${props => props.secondary ? `2px solid ${COLORS.accent}` : 'none'};
  padding: 1rem 2rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  margin: 0 0.5rem;
  
  &:hover {
    background: ${props => props.secondary ? COLORS.accent : COLORS.highlight};
    color: ${COLORS.white};
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
  background: rgba(255, 255, 255, 0.95);
  border-radius: 1rem;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(251, 158, 58, 0.2);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  color: ${COLORS.text};
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  box-sizing: border-box;
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 0.8rem 1.2rem 0.8rem 2.5rem;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(251, 158, 58, 0.3);
  border-radius: 0.75rem;
  color: ${COLORS.text};
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${COLORS.accent};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.8rem;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(251, 158, 58, 0.3);
  border-radius: 0.5rem;
  color: ${COLORS.text};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${COLORS.accent};
  }
  
  option {
    background: ${COLORS.white};
    color: ${COLORS.text};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(251, 158, 58, 0.3);
  border-radius: 0.5rem;
  color: ${COLORS.text};
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${COLORS.accent};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
`;

function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({ nickname: '', profile_picture_url: '' });
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
  const [editingNickname, setEditingNickname] = useState(false);
  const [nicknameInput, setNicknameInput] = useState(userData?.nickname || '');
  const [nicknameError, setNicknameError] = useState('');

  const API_URL = 'http://localhost:8000';

  const loadUserData = React.useCallback(async () => {
    const sessionToken = localStorage.getItem('sessionToken');
    if (!sessionToken) {
      navigate('/login');
      return;
    }

    try {
      const API_URL = 'http://localhost:8000';
      
      // Load user profile
      const profileResponse = await fetch(`${API_URL}/get_user_profile.php`, {
        headers: { 'Authorization': 'Bearer ' + sessionToken }
      });
      const profileData = await profileResponse.json();
      
      if (profileData.success) {
        setUserData(profileData.user);
        setFormData({
          nickname: profileData.user.nickname || '',
          profile_picture_url: profileData.user.profile_picture_url || ''
        });
      } else {
        toast.error(profileData.message || 'Failed to load profile');
        navigate('/login');
        return;
      }

      // Load favorites
      const favoritesResponse = await fetch(`${API_URL}/get_favorites.php`, {
        headers: { 'Authorization': 'Bearer ' + sessionToken }
      });
      const favoritesData = await favoritesResponse.json();
      
      if (favoritesData.success) {
        const favorites = favoritesData.favorites || [];
        
        // Load full video details for favorites
        const favoritesWithDetails = [];
        for (const videoId of favorites) {
          try {
            const videoResponse = await fetch(`${API_URL}/get_movies.php`);
            const videoData = await videoResponse.json();
            
            if (videoData.success && videoData.movies) {
              const video = videoData.movies.find(v => v.id === parseInt(videoId));
              if (video) {
                favoritesWithDetails.push(video);
              }
            }
          } catch (error) {
            console.error(`Error loading video ${videoId}:`, error);
          }
        }
        
        setFavorites(favoritesWithDetails);
      }

      // Load reviews
      const reviewsResponse = await fetch(`${API_URL}/get_my_reviews.php`, {
        headers: { 'Authorization': 'Bearer ' + sessionToken }
      });
      const reviewsData = await reviewsResponse.json();
      
      if (reviewsData.success) {
        const reviews = reviewsData.reviews || [];
        
        // Load video details for reviews
        const reviewsWithVideoInfo = [];
        for (const review of reviews) {
          try {
            const videoResponse = await fetch(`${API_URL}/get_movies.php`);
            const videoData = await videoResponse.json();
            
            if (videoData.success && videoData.movies) {
              const video = videoData.movies.find(v => v.id === parseInt(review.video_id));
              if (video) {
                reviewsWithVideoInfo.push({
                  ...review,
                  video_title: video.title,
                  video_thumb: video.poster_url,
                  video_channel: video.release_date
                });
              } else {
                reviewsWithVideoInfo.push({
                  ...review,
                  video_title: 'Video not found',
                  video_thumb: 'https://via.placeholder.com/300x200/FCEF91/2C2C2C?text=Video+Not+Found',
                  video_channel: 'Unknown'
                });
              }
            }
          } catch (error) {
            console.error(`Error loading video ${review.video_id}:`, error);
            reviewsWithVideoInfo.push({
              ...review,
              video_title: 'Error loading video',
              video_thumb: 'https://via.placeholder.com/300x200/FCEF91/2C2C2C?text=Error',
              video_channel: 'Error'
            });
          }
        }
        
        setReviews(reviewsWithVideoInfo);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Connection error');
      navigate('/login');
    }
    
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const handleLogout = () => {
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('userInfo');
    toast('Logged out successfully!', { type: 'success' });
    navigate('/');
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
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    const sessionToken = localStorage.getItem('sessionToken');
    try {
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
        toast.success('Review deleted!');
        setReviews(reviews.filter(r => r.id !== reviewId));
      } else {
        toast.error('Error deleting review');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Connection error');
    }
  };

  const handleSaveReview = async () => {
    const sessionToken = localStorage.getItem('sessionToken');
    try {
      const response = await fetch(`${API_URL}/edit_review.php`, {
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
        alert('Review updated successfully!');
      } else {
        alert('Error updating review');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Connection error');
    }
  };

  const handleNicknameSave = async () => {
    setNicknameError('');
    if (!nicknameInput.trim()) {
      setNicknameError('Nickname is required');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('nickname', nicknameInput.trim());
      const sessionToken = localStorage.getItem('sessionToken');
      const response = await fetch(`${API_URL}/update_profile.php`, {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + sessionToken },
        body: formData
      });
      const result = await response.json();
      if (result.success) {
        toast.success('Profile updated!');
        setEditingNickname(false);
        setNicknameError('');
        setNicknameInput(nicknameInput.trim());
        userData.nickname = nicknameInput.trim();
        localStorage.setItem('userInfo', JSON.stringify(userData));
      } else {
        toast.error(result.message || 'Failed to update profile.');
        setNicknameError(result.message || 'Failed to update profile.');
      }
    } catch (error) {
      setNicknameError('Connection error. Please try again.');
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
            <div style={{ color: COLORS.accent, fontSize: '1.2rem' }}>Loading...</div>
          </div>
        </ProfileCard>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <ProfileCard>
        <BackButton onClick={() => navigate('/')}>
          ← Back to Home
        </BackButton>

        <Header>
          <Title>User Profile</Title>
          <UserInfo>
            <UserIcon>
              <FaUser />
            </UserIcon>
            <UserDetails>
              <Username>{userData?.nickname ? userData.nickname : 'Choose your nickname!'}</Username>
              {/* Optionally, show email in a smaller, muted style below or remove entirely */}
              {/* <Email><FaEnvelope />{user.email}</Email> */}
            </UserDetails>
          </UserInfo>
        </Header>

        <TabsContainer>
          <Tab 
            $active={activeTab === 'favorites'} 
            onClick={() => setActiveTab('favorites')}
          >
            Favorites ({favorites.length})
          </Tab>
          <Tab 
            $active={activeTab === 'reviews'} 
            onClick={() => setActiveTab('reviews')}
          >
            My Reviews ({reviews.length})
          </Tab>
        </TabsContainer>

        {activeTab === 'favorites' && (
          <Section>
            <SectionTitle>Your Favorite Videos</SectionTitle>
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
                <h3>No favorite videos</h3>
                <p>Videos you add to favorites will appear here</p>
              </EmptyState>
            )}
          </Section>
        )}

        {activeTab === 'reviews' && (
          <Section>
            <SectionTitle>Your Reviews</SectionTitle>
            {reviews.length > 0 ? (
              <Grid>
                {reviews.map((review) => (
                  <ReviewCard key={review.id}>
                    <ReviewHeader>
                      <div>
                        <ReviewTitle>{review.title}</ReviewTitle>
                        <div style={{ color: COLORS.textMuted, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                          For: {review.video_title}
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
                        <ActionButton $delete onClick={() => handleDeleteReview(review.id)}>
                          <FaTrash />
                        </ActionButton>
                      </ActionButtons>
                    </ReviewHeader>
                    <ReviewText>{review.review}</ReviewText>
                    <ReviewDate>
                      Published on {new Date(review.created_at).toLocaleDateString('en-US')}
                    </ReviewDate>
                  </ReviewCard>
                ))}
              </Grid>
            ) : (
              <EmptyState>
                <FaStar style={{ fontSize: '3rem', marginBottom: '1rem', color: COLORS.textMuted }} />
                <h3>No reviews</h3>
                <p>Reviews you write will appear here</p>
              </EmptyState>
            )}
          </Section>
        )}

        <Section>
          <SectionTitle>Nickname</SectionTitle>
          {editingNickname || !userData?.nickname ? (
            <div style={{ maxWidth: 400, margin: '0 auto', textAlign: 'center' }}>
              <input
                type="text"
                value={nicknameInput}
                onChange={e => setNicknameInput(e.target.value)}
                placeholder="Choose your nickname"
                style={{ padding: '0.8rem 1.2rem', borderRadius: '0.75rem', border: '1px solid #ccc', width: '100%', fontSize: '1.1rem' }}
              />
              {nicknameError && <div style={{ color: '#e74c3c', marginTop: 8 }}>{nicknameError}</div>}
              <Button style={{ marginTop: 16 }} onClick={handleNicknameSave}>Save Nickname</Button>
              {userData?.nickname && (
                <Button $secondary style={{ marginLeft: 8 }} onClick={() => setEditingNickname(false)}>Cancel</Button>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>{userData.nickname}</span>
              <Button $secondary style={{ marginLeft: 16 }} onClick={() => setEditingNickname(true)}>Edit</Button>
            </div>
          )}
        </Section>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Button secondary onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </ProfileCard>

      {editingReview && (
        <EditModal>
          <EditForm>
            <h3 style={{ marginBottom: '1.5rem', color: COLORS.text }}>Edit Review</h3>
            
            <FormGroup>
              <Label>Title</Label>
              <InputWrapper>
                <Input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  placeholder="Review title"
                />
              </InputWrapper>
            </FormGroup>

            <FormGroup>
              <Label>Rating</Label>
              <Select
                value={editForm.rating}
                onChange={(e) => setEditForm({ ...editForm, rating: parseInt(e.target.value) })}
              >
                <option value={1}>1 star</option>
                <option value={2}>2 stars</option>
                <option value={3}>3 stars</option>
                <option value={4}>4 stars</option>
                <option value={5}>5 stars</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Review</Label>
              <TextArea
                value={editForm.review}
                onChange={(e) => setEditForm({ ...editForm, review: e.target.value })}
                placeholder="Write your review..."
              />
            </FormGroup>

            <ButtonGroup>
              <Button onClick={handleSaveReview}>
                Save Changes
              </Button>
              <Button secondary onClick={() => setEditingReview(null)}>
                Cancel
              </Button>
            </ButtonGroup>
          </EditForm>
        </EditModal>
      )}
    </ProfileContainer>
  );
}

export default Profile; 