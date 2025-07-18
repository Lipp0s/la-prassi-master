import React, { useState } from 'react';
import styled from 'styled-components';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';

const Card = styled.div`
  background: #2c2f3a;
  border-radius: 18px;
  box-shadow: 0 2px 16px #0006;
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  max-width: 480px;
  margin: 0 auto 2.5rem auto;
  color: #eaeaea;
`;
const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.2rem;
  text-align: center;
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
  color: ${props => props.filled ? '#ffc107' : '#444'};
  transition: color 0.18s;
  &:hover, &:focus {
    color: #ffc107;
    outline: none;
  }
`;
const SelectedText = styled.div`
  text-align: center;
  color: #b0b0b0;
  font-size: 1rem;
  margin-bottom: 1.1rem;
`;
const StyledTextarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  border-radius: 12px;
  border: none;
  padding: 1rem;
  font-size: 1.08rem;
  background: #232336;
  color: #eaeaea;
  box-shadow: 0 2px 8px #0003;
  margin-bottom: 1.2rem;
  resize: vertical;
  transition: box-shadow 0.2s;
  &:focus {
    box-shadow: 0 4px 16px #00bcd444;
    outline: none;
  }
`;
const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
`;
const SendButton = styled.button`
  background: #00bcd4;
  color: #fff;
  font-weight: 700;
  font-size: 1.08rem;
  border: none;
  border-radius: 12px;
  padding: 0.7rem 2.2rem;
  box-shadow: 0 2px 12px #00bcd433;
  cursor: pointer;
  transition: background 0.18s, box-shadow 0.18s, transform 0.18s;
  &:hover, &:focus {
    background: #0097a7;
    box-shadow: 0 4px 24px #00bcd488;
    transform: scale(1.04);
    outline: none;
  }
  &:disabled {
    background: #444;
    color: #aaa;
    cursor: not-allowed;
  }
`;
const Message = styled.div`
  margin-top: 1.1rem;
  text-align: center;
  color: ${props => props.success ? '#4caf50' : '#ff5252'};
  font-weight: 600;
`;
const Spinner = styled.div`
  display: inline-block;
  width: 22px;
  height: 22px;
  border: 3px solid #00bcd4;
  border-top: 3px solid #232336;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-left: 0.7rem;
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ReviewForm = ({ video_id, onReviewAdded }) => {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
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
      setMessage('Devi essere loggato per lasciare una recensione.');
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
        body: JSON.stringify({ rating, comment, video_id })
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Recensione inviata!');
        setSuccess(true);
        setComment('');
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
    <Card>
      <form onSubmit={handleSubmit}>
        <Title>Lascia una recensione</Title>
        <StarRow>
          {[1,2,3,4,5].map(n => (
            <StarButton
              key={n}
              type="button"
              filled={hover ? n <= hover : n <= rating}
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              aria-label={`Dai ${n} stelle`}
              tabIndex={0}
            >
              {hover ? (n <= hover ? <AiFillStar /> : <AiOutlineStar />) : (n <= rating ? <AiFillStar /> : <AiOutlineStar />)}
            </StarButton>
          ))}
        </StarRow>
        <SelectedText>Hai dato {rating} stelle</SelectedText>
        <StyledTextarea
          placeholder="Scrivi un commento (opzionale)"
          value={comment}
          onChange={e => setComment(e.target.value)}
          disabled={loading}
          maxLength={600}
        />
        <ButtonRow>
          <SendButton type="submit" disabled={loading}>{loading ? 'Invio in corso...' : 'Invia'}{loading && <Spinner />}</SendButton>
        </ButtonRow>
        {message && <Message success={success}>{message}</Message>}
      </form>
    </Card>
  );
};

export default ReviewForm; 