import React, { useState } from 'react';

const ReviewForm = ({ video_id, onReviewAdded }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
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
        setComment('');
        setRating(5);
        if (onReviewAdded) onReviewAdded();
      } else {
        setMessage(data.error || 'Errore');
      }
    } catch (err) {
      setMessage('Errore di rete');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto' }}>
      <h3>Lascia una recensione</h3>
      <div>
        <label>Voto: </label>
        {[1,2,3,4,5].map(n => (
          <label key={n}>
            <input
              type="radio"
              name="rating"
              value={n}
              checked={rating === n}
              onChange={() => setRating(n)}
              disabled={loading}
            />
            {n}★
          </label>
        ))}
      </div>
      <div>
        <textarea
          placeholder="Scrivi un commento (opzionale)"
          value={comment}
          onChange={e => setComment(e.target.value)}
          rows={4}
          style={{ width: '100%' }}
          disabled={loading}
        />
      </div>
      <button type="submit" disabled={loading}>Invia</button>
      {message && <div style={{ marginTop: 10 }}>{message}</div>}
    </form>
  );
};

export default ReviewForm; 