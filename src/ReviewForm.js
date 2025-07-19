import React, { useState } from 'react';
import styled from 'styled-components';
import { FaStar, FaRegStar, FaTimes } from 'react-icons/fa';

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

const Card = styled.div`
  background: rgba(35, 35, 55, 0.95);
  border-radius: 2rem;
  box-shadow: 0 8px 32px 0 ${COLORS.accent}33, 0 2px 12px #000a;
  padding: 2.5rem;
  max-width: 500px;
  width: 100%;
  color: ${COLORS.text};
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid ${COLORS.glassBorder};
  position: relative;
`;
const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: ${COLORS.accent};
  border: none;
  color: ${COLORS.text};
  font-size: 1.2rem;
  cursor: pointer;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${COLORS.highlight};
    transform: scale(1.1);
  }
`;

const Title = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-align: center;
  color: ${COLORS.text};
`;
const StarRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  margin-bottom: 0.5rem;
`;
const StarButton = styled.button`
  background: none;
  border: none;
  padding: 0.2rem;
  cursor: pointer;
  font-size: 2.1rem;
  color: ${props => props.filled ? '#FFD700' : COLORS.textMuted};
  transition: color 0.18s;
  &:hover, &:focus {
    color: #FFD700;
    outline: none;
  }
`;
const SelectedText = styled.div`
  text-align: center;
  color: ${COLORS.textMuted};
  font-size: 1rem;
  margin-bottom: 1.1rem;
`;
const StyledTextarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  border-radius: 12px;
  border: 1px solid ${COLORS.glassBorder};
  padding: 1rem;
  font-size: 1.08rem;
  background: ${COLORS.glass};
  color: ${COLORS.text};
  box-shadow: 0 2px 8px #0003;
  margin-bottom: 1.2rem;
  resize: vertical;
  transition: box-shadow 0.2s;
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  
  &:focus {
    box-shadow: 0 4px 16px ${COLORS.accent}44;
    outline: none;
    border-color: ${COLORS.accent};
  }
  
  &::placeholder {
    color: ${COLORS.textMuted};
  }
`;
const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
`;
const SendButton = styled.button`
  background: ${COLORS.accent};
  color: ${COLORS.text};
  font-weight: 700;
  font-size: 1.08rem;
  border: none;
  border-radius: 12px;
  padding: 0.7rem 2.2rem;
  box-shadow: 0 2px 12px ${COLORS.accent}33;
  cursor: pointer;
  transition: background 0.18s, box-shadow 0.18s, transform 0.18s;
  &:hover, &:focus {
    background: ${COLORS.highlight};
    box-shadow: 0 4px 24px ${COLORS.accent}88;
    transform: scale(1.04);
    outline: none;
  }
  &:disabled {
    background: ${COLORS.textMuted};
    color: ${COLORS.text};
    cursor: not-allowed;
  }
`;
const Message = styled.div`
  margin-top: 1.1rem;
  text-align: center;
  color: ${props => props.success ? '#4caf50' : COLORS.highlight};
  font-weight: 600;
`;
const Spinner = styled.div`
  display: inline-block;
  width: 22px;
  height: 22px;
  border: 3px solid ${COLORS.accent};
  border-top: 3px solid ${COLORS.glass};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-left: 0.7rem;
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ReviewForm = ({ video_id, onReviewAdded, onClose }) => {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setSuccess(false);
    const session_token = localStorage.getItem('session_token');
    if (!session_token) {
      setMessage('Devi essere loggato per scrivere una recensione.');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('http://localhost:8000/add_review.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + session_token
        },
        body: JSON.stringify({ rating, comment, video_id, title })
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Recensione inviata!');
        setSuccess(true);
        setComment('');
        setTitle('');
        setRating(5);
        if (onReviewAdded) onReviewAdded();
      } else {
        setMessage(data.error || 'Errore');
        setSuccess(false);
      }
    } catch (err) {
      setMessage('Errore di rete');
      setSuccess(false);
    }
    setLoading(false);
  };

  return (
    <ModalOverlay>
      <Card>
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>
        <form onSubmit={handleSubmit}>
          <Title>Scrivi una Recensione</Title>
        <StarRow>
          {[1,2,3,4,5].map(n => (
            <StarButton
              key={n}
              type="button"
              filled={hover ? n <= hover : n <= rating}
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              aria-label={`Give ${n} stars`}
              tabIndex={0}
            >
              {hover ? (n <= hover ? <FaStar /> : <FaRegStar />) : (n <= rating ? <FaStar /> : <FaRegStar />)}
            </StarButton>
          ))}
        </StarRow>
        <SelectedText>Hai dato {rating} stelle</SelectedText>
        
        <StyledTextarea
          placeholder="Titolo della recensione (opzionale)"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={loading}
          maxLength={100}
          style={{ minHeight: '60px', marginBottom: '1rem' }}
        />
        
        <StyledTextarea
          placeholder="Scrivi un commento (opzionale)"
          value={comment}
          onChange={e => setComment(e.target.value)}
          disabled={loading}
          maxLength={600}
        />
        <ButtonRow>
          <SendButton type="submit" disabled={loading}>{loading ? 'Invio...' : 'Invia'}{loading && <Spinner />}</SendButton>
        </ButtonRow>
        {message && <Message success={success}>{message}</Message>}
      </form>
    </Card>
    </ModalOverlay>
  );
};

export default ReviewForm; 