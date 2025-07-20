import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';

const COLORS = {
  primary: '#FCEF91',
  secondary: '#FB9E3A',
  accent: '#E6521F',
  highlight: '#EA2F14',
  text: '#2C2C2C',
  textMuted: '#666666',
  white: '#FFFFFF',
};

const Page = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 50%, ${COLORS.accent} 100%);
  padding: 2rem;
`;
const Card = styled.div`
  background: rgba(255,255,255,0.95);
  border-radius: 2rem;
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
  border: 1px solid rgba(251, 158, 58, 0.2);
`;
const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid ${COLORS.accent};
  margin-bottom: 1rem;
`;
const Nick = styled.h2`
  font-size: 2rem;
  font-weight: 900;
  color: ${COLORS.text};
  margin-bottom: 0.5rem;
`;
const SectionTitle = styled.h3`
  font-size: 1.3rem;
  color: ${COLORS.accent};
  margin-top: 2rem;
`;
const ReviewCard = styled.div`
  background: ${COLORS.primary};
  border-radius: 1rem;
  margin: 1rem 0;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
`;
const ReviewTitle = styled.div`
  font-weight: 700;
  color: ${COLORS.text};
`;
const ReviewText = styled.div`
  color: ${COLORS.textMuted};
  margin: 0.5rem 0;
`;
const ReviewMeta = styled.div`
  font-size: 0.9rem;
  color: ${COLORS.textMuted};
`;

export default function PublicProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const API_URL = 'http://localhost:8000';
        const res = await fetch(`${API_URL}/get_user_public.php?id=${id}`);
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
          setReviews(data.reviews);
        } else {
          setError(data.message || 'User not found');
        }
      } catch (e) {
        setError('Connection error');
      }
      setLoading(false);
    }
    fetchData();
  }, [id]);

  if (loading) return <Page><Card>Loading...</Card></Page>;
  if (error) return <Page><Card>{error}</Card></Page>;

  return (
    <Page>
      <Card style={{ textAlign: 'center' }}>
        {user.profile_picture_url && <Avatar src={user.profile_picture_url} alt={user.nickname} />}
        <Nick>{user.nickname || 'User'}</Nick>
        <SectionTitle>Reviews</SectionTitle>
        {reviews.length === 0 ? (
          <div style={{ color: COLORS.textMuted }}>No reviews yet.</div>
        ) : (
          reviews.map(r => (
            <ReviewCard key={r.id}>
              <ReviewTitle>{r.title}</ReviewTitle>
              <ReviewText>{r.review}</ReviewText>
              <ReviewMeta>
                Rating: {r.rating}/5 &middot; {new Date(r.created_at).toLocaleDateString('en-US')}
                {r.video_id && (
                  <>
                    {' '}|{' '}
                    <Link to={`/video/${r.video_id}`} style={{ color: COLORS.accent }}>View Video</Link>
                  </>
                )}
              </ReviewMeta>
            </ReviewCard>
          ))
        )}
      </Card>
    </Page>
  );
} 