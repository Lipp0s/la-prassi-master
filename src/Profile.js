import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaStar, FaEdit, FaTrash, FaHeart, FaPlay, FaTimes, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const MAIN_GRADIENT = 'linear-gradient(90deg, #A35C7A 0%, #7B3F61 100%)';

const ProfileContainer = styled.div`
  min-height: 100vh;
  background: #181818;
  color: #fff;
  padding: 2.5rem 1.2rem;
  position: relative;
  z-index: 1;
`;

const AnimatedBackground = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 0;
  background: linear-gradient(120deg, #181818 0%, #A35C7A 100%);
  animation: bgMove 12s ease-in-out infinite alternate;
  @keyframes bgMove {
    0% { background-position: 0% 50%; }
    100% { background-position: 100% 50%; }
  }
`;

const BackButton = styled.button`
  background: rgba(35,35,55,0.82);
  border: 2px solid #A35C7A;
  border-radius: 15px;
  padding: 12px 20px;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 2rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(8px);

  &:hover {
    background: rgba(163,92,122,0.2);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(163,92,122,0.3);
  }
`;

const ProfileHeader = styled.div`
  background: rgba(35,35,55,0.82);
  border-radius: 2.5rem;
  padding: 3rem 2rem;
  margin-bottom: 2.5rem;
  box-shadow: 0 8px 32px #A35C7A22, 0 2px 12px #000a;
  text-align: center;
  border: 2px solid transparent;
  backdrop-filter: blur(8px);
  animation: fadeInCard 0.9s cubic-bezier(.4,2,.6,1);
  
  @keyframes fadeInCard {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const ProfileTitle = styled.h1`
  color: #fff;
  margin: 0 0 10px 0;
  font-size: 2.5rem;
  font-weight: 700;
  background: ${MAIN_GRADIENT};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const ProfileSubtitle = styled.p`
  color: #aaa;
  margin: 0;
  font-size: 1.1rem;
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2.5rem;
  gap: 15px;
`;

const TabButton = styled.button`
  background: ${props => props.active ? 'rgba(163,92,122,0.2)' : 'rgba(35,35,55,0.82)'};
  border: 2px solid ${props => props.active ? '#A35C7A' : 'transparent'};
  border-radius: 20px;
  padding: 15px 30px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 32px #A35C7A33, 0 2px 12px #000a;
  backdrop-filter: blur(8px);

  &:hover {
    background: rgba(163,92,122,0.2);
    border-color: #A35C7A;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(163,92,122,0.3);
  }
`;

const ContentSection = styled.div`
  background: rgba(35,35,55,0.82);
  border-radius: 2.5rem;
  padding: 2.5rem;
  box-shadow: 0 8px 32px #A35C7A22, 0 2px 12px #000a;
  min-height: 400px;
  border: 2px solid transparent;
  backdrop-filter: blur(8px);
  animation: fadeInCard 0.9s cubic-bezier(.4,2,.6,1);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #aaa;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1.5rem;
  opacity: 0.5;
`;

const EmptyText = styled.h3`
  margin: 0 0 10px 0;
  color: #fff;
  font-size: 1.5rem;
`;

const EmptySubtext = styled.p`
  margin: 0;
  color: #aaa;
  font-size: 1.1rem;
`;

const ReviewCard = styled.div`
  background: rgba(24,24,32,0.92);
  border-radius: 1.5rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border-left: 4px solid #A35C7A;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(163,92,122,0.2);
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ReviewVideoId = styled.div`
  font-weight: 600;
  color: #fff;
  font-size: 1.1rem;
`;

const ReviewDate = styled.div`
  color: #aaa;
  font-size: 0.9rem;
`;

const ReviewRating = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 1rem;
`;

const Star = styled(FaStar)`
  color: ${props => props.filled ? '#ffc107' : '#333'};
  font-size: 1.2rem;
`;

const ReviewComment = styled.p`
  color: #ccc;
  margin: 0 0 1rem 0;
  line-height: 1.6;
`;

const ReviewActions = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  background: ${props => props.danger ? 'rgba(220,53,69,0.2)' : 'rgba(163,92,122,0.2)'};
  color: white;
  border: 1px solid ${props => props.danger ? '#dc3545' : '#A35C7A'};
  border-radius: 12px;
  padding: 8px 15px;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.danger ? 'rgba(220,53,69,0.3)' : 'rgba(163,92,122,0.3)'};
    transform: translateY(-1px);
  }
`;

const FavoriteCard = styled.div`
  background: rgba(24,24,32,0.92);
  border-radius: 1.5rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border-left: 4px solid #e1306c;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(225,48,108,0.2);
  }
`;

const FavoriteHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const FavoriteVideoId = styled.div`
  font-weight: 600;
  color: #fff;
  font-size: 1.1rem;
`;

const FavoriteDate = styled.div`
  color: #aaa;
  font-size: 0.9rem;
`;

const FavoriteActions = styled.div`
  display: flex;
  gap: 10px;
`;

const PlayButton = styled.button`
  background: rgba(40,167,69,0.2);
  color: white;
  border: 1px solid #28a745;
  border-radius: 12px;
  padding: 8px 15px;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(40,167,69,0.3);
    transform: translateY(-1px);
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
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const EditModalContent = styled.div`
  background: rgba(35,35,55,0.95);
  border-radius: 2rem;
  padding: 2.5rem;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  border: 2px solid #A35C7A;
  box-shadow: 0 16px 48px rgba(163,92,122,0.3);
  backdrop-filter: blur(8px);
`;

const EditModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const EditModalTitle = styled.h3`
  margin: 0;
  color: #fff;
  font-size: 1.5rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #aaa;
  transition: color 0.3s ease;
  
  &:hover {
    color: #fff;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #fff;
`;

const RatingContainer = styled.div`
  display: flex;
  gap: 5px;
  margin-bottom: 1rem;
`;

const RatingStar = styled(FaStar)`
  color: ${props => props.filled ? '#ffc107' : '#333'};
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #ffc107;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  background: rgba(24,24,32,0.8);
  border: 2px solid #333;
  border-radius: 12px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  color: #fff;

  &:focus {
    outline: none;
    border-color: #A35C7A;
  }

  &::placeholder {
    color: #666;
  }
`;

const SaveButton = styled.button`
  background: rgba(40,167,69,0.2);
  color: white;
  border: 1px solid #28a745;
  border-radius: 12px;
  padding: 12px 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(40,167,69,0.3);
    transform: translateY(-1px);
  }

  &:disabled {
    background: rgba(108,117,125,0.2);
    border-color: #6c757d;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #aaa;
  font-size: 1.2rem;
`;

const Profile = () => {
  const [activeTab, setActiveTab] = useState('reviews');
  const [reviews, setReviews] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const sessionToken = localStorage.getItem('session_token');

  useEffect(() => {
    if (!sessionToken) {
      navigate('/login');
      return;
    }
    loadData();
  }, [sessionToken, navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadReviews(),
        loadFavorites()
      ]);
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const response = await fetch('http://localhost:8000/get_my_reviews.php', {
        headers: {
          'Authorization': `Bearer ${sessionToken}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setReviews(data.reviews);
        }
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const loadFavorites = async () => {
    try {
      const response = await fetch('http://localhost:8000/get_favorites.php', {
        headers: {
          'Authorization': `Bearer ${sessionToken}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setFavorites(data.favorites);
        }
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/delete_review.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`
        },
        body: JSON.stringify({ review_id: reviewId })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setReviews(reviews.filter(review => review.id !== reviewId));
        }
      }
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const handleSaveEdit = async () => {
    if (!editComment.trim()) {
      alert('Please enter a comment');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('http://localhost:8000/edit_review.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`
        },
        body: JSON.stringify({
          review_id: editingReview.id,
          rating: editRating,
          comment: editComment
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setReviews(reviews.map(review => 
            review.id === editingReview.id 
              ? { ...review, rating: editRating, comment: editComment }
              : review
          ));
          setEditingReview(null);
        }
      }
    } catch (error) {
      console.error('Error updating review:', error);
    } finally {
      setSaving(false);
    }
  };

  const handlePlayVideo = (videoId) => {
    navigate(`/?video=${videoId}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <ProfileContainer>
        <AnimatedBackground />
        <LoadingSpinner>Loading profile...</LoadingSpinner>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <AnimatedBackground />
      
      <BackButton onClick={() => navigate('/')}>
        <FaArrowLeft /> Back to Home
      </BackButton>

      <ProfileHeader>
        <ProfileTitle>My Profile</ProfileTitle>
        <ProfileSubtitle>Manage your reviews and favorites</ProfileSubtitle>
      </ProfileHeader>

      <TabsContainer>
        <TabButton 
          active={activeTab === 'reviews'} 
          onClick={() => setActiveTab('reviews')}
        >
          My Reviews ({reviews.length})
        </TabButton>
        <TabButton 
          active={activeTab === 'favorites'} 
          onClick={() => setActiveTab('favorites')}
        >
          My Favorites ({favorites.length})
        </TabButton>
      </TabsContainer>

      <ContentSection>
        {activeTab === 'reviews' && (
          <>
            {reviews.length === 0 ? (
              <EmptyState>
                <EmptyIcon>📝</EmptyIcon>
                <EmptyText>No reviews yet</EmptyText>
                <EmptySubtext>Start watching videos and leave your first review!</EmptySubtext>
              </EmptyState>
            ) : (
              reviews.map(review => (
                <ReviewCard key={review.id}>
                  <ReviewHeader>
                    <ReviewVideoId>Video: {review.video_id}</ReviewVideoId>
                    <ReviewDate>{formatDate(review.created_at)}</ReviewDate>
                  </ReviewHeader>
                  
                  <ReviewRating>
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} filled={star <= review.rating} />
                    ))}
                    <span style={{ marginLeft: '10px', color: '#aaa' }}>
                      {review.rating}/5
                    </span>
                  </ReviewRating>
                  
                  <ReviewComment>{review.comment}</ReviewComment>
                  
                  <ReviewActions>
                    <ActionButton onClick={() => handleEditReview(review)}>
                      <FaEdit /> Edit
                    </ActionButton>
                    <ActionButton danger onClick={() => handleDeleteReview(review.id)}>
                      <FaTrash /> Delete
                    </ActionButton>
                  </ReviewActions>
                </ReviewCard>
              ))
            )}
          </>
        )}

        {activeTab === 'favorites' && (
          <>
            {favorites.length === 0 ? (
              <EmptyState>
                <EmptyIcon>❤️</EmptyIcon>
                <EmptyText>No favorites yet</EmptyText>
                <EmptySubtext>Start adding videos to your favorites!</EmptySubtext>
              </EmptyState>
            ) : (
              favorites.map(favorite => (
                <FavoriteCard key={favorite.id}>
                  <FavoriteHeader>
                    <FavoriteVideoId>Video: {favorite.video_id}</FavoriteVideoId>
                    <FavoriteDate>{formatDate(favorite.created_at)}</FavoriteDate>
                  </FavoriteHeader>
                  
                  <FavoriteActions>
                    <PlayButton onClick={() => handlePlayVideo(favorite.video_id)}>
                      <FaPlay /> Play Video
                    </PlayButton>
                  </FavoriteActions>
                </FavoriteCard>
              ))
            )}
          </>
        )}
      </ContentSection>

      {editingReview && (
        <EditModal>
          <EditModalContent>
            <EditModalHeader>
              <EditModalTitle>Edit Review</EditModalTitle>
              <CloseButton onClick={() => setEditingReview(null)}>
                <FaTimes />
              </CloseButton>
            </EditModalHeader>
            
            <FormGroup>
              <Label>Rating:</Label>
              <RatingContainer>
                {[1, 2, 3, 4, 5].map(star => (
                  <RatingStar
                    key={star}
                    filled={star <= editRating}
                    onClick={() => setEditRating(star)}
                  />
                ))}
                <span style={{ marginLeft: '10px', color: '#aaa' }}>
                  {editRating}/5
                </span>
              </RatingContainer>
            </FormGroup>
            
            <FormGroup>
              <Label>Comment:</Label>
              <TextArea
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                placeholder="Write your review..."
              />
            </FormGroup>
            
            <SaveButton onClick={handleSaveEdit} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </SaveButton>
          </EditModalContent>
        </EditModal>
      )}
    </ProfileContainer>
  );
};

export default Profile; 