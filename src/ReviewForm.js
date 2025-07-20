import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaStar } from 'react-icons/fa';

const COLORS = {
  primary: '#522258',
  secondary: '#8C3061',
  accent: '#C63C51',
  highlight: '#D95F59',
  text: '#FFFFFF',
  textMuted: '#B0B0B0',
  glass: 'rgba(255, 255, 255, 0.05)',
  glassBorder: 'rgba(255, 255, 255, 0.1)',
  glassHover: 'rgba(255, 255, 255, 0.08)',
  glassShadow: 'rgba(0, 0, 0, 0.3)',
  shadowHover: 'rgba(217, 95, 89, 0.3)',
  white: '#FFFFFF',
  black: '#000000'
};

const FormContainer = styled.div`
  width: 100%;
`;

const FormTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 900;
  color: ${COLORS.text};
  margin-bottom: 2rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: ${COLORS.text};
  font-weight: 600;
  font-size: 1rem;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  box-sizing: border-box;
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 1rem 1.2rem 1rem 2.5rem;
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(251, 158, 58, 0.3);
  border-radius: 0.75rem;
  color: ${COLORS.text};
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${COLORS.accent};
    box-shadow: 0 0 20px rgba(230, 82, 31, 0.3);
  }

  &::placeholder {
    color: ${COLORS.textMuted};
  }
`;

const TextArea = styled.textarea`
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  color: ${COLORS.text};
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${COLORS.accent};
    box-shadow: 0 0 20px rgba(198, 60, 81, 0.3);
  }
  
  &::placeholder {
    color: ${COLORS.textMuted};
  }
`;

const RatingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const StarsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const StarButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.$filled ? '#FFD700' : COLORS.textMuted};
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    color: #FFD700;
    transform: scale(1.2);
  }
`;

const RatingText = styled.span`
  color: ${COLORS.textMuted};
  font-size: 0.9rem;
  margin-left: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const Button = styled.button`
  background: ${props => props.$secondary ? 'transparent' : COLORS.accent};
  color: ${props => props.$secondary ? COLORS.text : COLORS.white};
  border: ${props => props.$secondary ? `2px solid ${COLORS.accent}` : 'none'};
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.$secondary ? COLORS.accent : COLORS.highlight};
    transform: translateY(-2px);
  }
  
  &:disabled {
    background: ${COLORS.textMuted};
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  background: rgba(231, 76, 60, 0.2);
  border: 1px solid #e74c3c;
  color: #e74c3c;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const SuccessMessage = styled.div`
  background: rgba(46, 204, 113, 0.2);
  border: 1px solid #2ecc71;
  color: #2ecc71;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const getRatingText = (rating) => {
  switch (rating) {
    case 1: return 'Very Poor';
    case 2: return 'Poor';
    case 3: return 'Average';
    case 4: return 'Good';
    case 5: return 'Excellent';
    default: return 'Select rating';
  }
};

function ReviewForm({ videoId, editingReview, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    rating: 5,
    review: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (editingReview) {
      setFormData({
        title: editingReview.title,
        rating: editingReview.rating,
        review: editingReview.review
      });
    }
  }, [editingReview]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleRatingChange = (rating) => {
    setFormData({
      ...formData,
      rating
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.title.trim()) {
      setError('Please enter a review title');
      setLoading(false);
      return;
    }

    if (!formData.review.trim()) {
      setError('Please enter a review');
      setLoading(false);
      return;
    }

    if (formData.rating < 1 || formData.rating > 5) {
      setError('Please select a rating');
      setLoading(false);
      return;
    }

    const sessionToken = localStorage.getItem('sessionToken');
    if (!sessionToken) {
      setError('You must be logged in to write a review');
      setLoading(false);
      return;
    }

    try {
      const endpoint = editingReview ? 'edit_review.php' : 'add_review.php';
      const body = editingReview 
        ? {
            review_id: editingReview.id,
            title: formData.title,
            rating: formData.rating,
            review: formData.review
          }
        : {
            video_id: videoId,
            title: formData.title,
            rating: formData.rating,
            review: formData.review
          };

      const API_URL = 'http://localhost:8000';
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + sessionToken
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(editingReview ? 'Review updated successfully!' : 'Review added successfully!');
        
        // Create the review object for the callback
        const reviewData = {
          id: editingReview ? editingReview.id : data.review_id,
          title: formData.title,
          rating: formData.rating,
          review: formData.review,
          video_id: videoId,
          created_at: new Date().toISOString(),
          username: JSON.parse(localStorage.getItem('userInfo')).name || 'User',
          email: JSON.parse(localStorage.getItem('userInfo')).email
        };

        setTimeout(() => {
          onSuccess(reviewData);
        }, 1500);
      } else {
        setError(data.message || 'Failed to save review. Please try again.');
      }
    } catch (error) {
      console.error('Review submission error:', error);
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <FormTitle>
        {editingReview ? 'Edit Review' : 'Write a Review'}
      </FormTitle>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="title">Review Title</Label>
          <InputWrapper>
            <Input
              type="text"
              id="title"
              name="title"
              placeholder="Enter a title for your review"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </InputWrapper>
        </FormGroup>

        <RatingContainer>
          <Label>Rating</Label>
          <StarsContainer>
            {[1, 2, 3, 4, 5].map((star) => (
              <StarButton
                key={star}
                type="button"
                $filled={star <= formData.rating}
                onClick={() => handleRatingChange(star)}
              >
                <FaStar />
              </StarButton>
            ))}
            <RatingText>{getRatingText(formData.rating)}</RatingText>
          </StarsContainer>
        </RatingContainer>

        <FormGroup>
          <Label htmlFor="review">Review</Label>
          <TextArea
            id="review"
            name="review"
            placeholder="Share your thoughts about this video..."
            value={formData.review}
            onChange={handleInputChange}
            required
          />
        </FormGroup>

        <ButtonGroup>
          <Button type="button" $secondary onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading 
              ? (editingReview ? 'Updating...' : 'Submitting...') 
              : (editingReview ? 'Update Review' : 'Submit Review')
            }
          </Button>
        </ButtonGroup>
      </Form>
    </FormContainer>
  );
}

export default ReviewForm; 