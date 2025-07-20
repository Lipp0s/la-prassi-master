import React, { useEffect, useState, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaSearch, FaPlay, FaStar } from 'react-icons/fa';

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

const MAIN_GRADIENT = `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 50%, ${COLORS.accent} 100%)`;

const HeroSection = styled.section`
  min-height: 100vh;
  background: ${MAIN_GRADIENT};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(0,0,0,0.05)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
    opacity: 0.5;
  }
`;

const HeroContent = styled.div`
  text-align: center;
  z-index: 2;
  max-width: 800px;
  padding: 0 2rem;
`;

const HeroTitle = styled.h1`
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 900;
  color: ${COLORS.text};
  margin-bottom: 1.5rem;
  background: linear-gradient(45deg, ${COLORS.text}, ${COLORS.highlight});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: titleGlow 3s ease-in-out infinite alternate;
  
  @keyframes titleGlow {
    from { filter: drop-shadow(0 0 20px rgba(234, 47, 20, 0.3)); }
    to { filter: drop-shadow(0 0 30px rgba(234, 47, 20, 0.6)); }
  }
`;

const HeroSubtitle = styled.p`
  font-size: clamp(1.2rem, 3vw, 1.5rem);
  color: ${COLORS.textMuted};
  margin-bottom: 3rem;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const CTAButton = styled.button`
  background: linear-gradient(45deg, ${COLORS.accent}, ${COLORS.highlight});
  color: ${COLORS.white};
  border: none;
  padding: 1rem 3rem;
  font-size: 1.2rem;
  font-weight: 700;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(230, 82, 31, 0.3);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(230, 82, 31, 0.4);
  }
`;

const Navbar = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(252, 239, 145, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(251, 158, 58, 0.2);
  padding: 1rem 2rem;
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: ${COLORS.text};
  font-size: 1.5rem;
  font-weight: 900;
`;

const NavActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const NavButton = styled.button`
  background: ${props => props.$primary ? COLORS.accent : 'transparent'};
  color: ${props => props.$primary ? COLORS.white : COLORS.text};
  border: ${props => props.$primary ? 'none' : `2px solid ${COLORS.accent}`};
  padding: 0.5rem 1.5rem;
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

const MainContent = styled.main`
  background: ${COLORS.primary};
  min-height: 100vh;
`;

const Section = styled.section`
  padding: 5rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const SearchContainer = styled.div`
  max-width: 600px;
  margin: 0 auto 4rem auto;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1.5rem 3rem 1.5rem 1.5rem;
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(251, 158, 58, 0.3);
  border-radius: 50px;
  color: ${COLORS.text};
  font-size: 1.1rem;
  backdrop-filter: blur(10px);
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

const SearchIcon = styled(FaSearch)`
  position: absolute;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${COLORS.textMuted};
  font-size: 1.2rem;
`;

const VideoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const VideoCard = styled(Link)`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  overflow: hidden;
  text-decoration: none;
  color: ${COLORS.text};
  transition: all 0.3s ease;
  border: 1px solid rgba(251, 158, 58, 0.2);
  backdrop-filter: blur(10px);
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    border-color: ${COLORS.accent};
  }
`;

const VideoThumbnail = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(230, 82, 31, 0.3), rgba(234, 47, 20, 0.3));
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  ${VideoCard}:hover &::before {
    opacity: 1;
  }
`;

const VideoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  ${VideoCard}:hover & {
    transform: scale(1.1);
  }
`;

const PlayButton = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background: rgba(230, 82, 31, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
  
  ${VideoCard}:hover & {
    opacity: 1;
  }
`;

const VideoInfo = styled.div`
  padding: 1.5rem;
`;

const VideoTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const VideoMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const VideoChannel = styled.span`
  color: ${COLORS.textMuted};
  font-size: 0.9rem;
`;

const FavoriteButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.$isFavorite ? COLORS.highlight : COLORS.textMuted};
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  
  &:hover {
    color: ${COLORS.highlight};
    transform: scale(1.2);
  }
`;

const LoadingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const LoadingCard = styled.div`
  background: rgba(251, 158, 58, 0.1);
  border-radius: 20px;
  height: 300px;
  animation: pulse 1.5s infinite;
  
  @keyframes pulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }
`;

const CategoryTabs = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
`;

const CategoryTab = styled.button`
  background: ${props => props.$active ? COLORS.accent : 'transparent'};
  color: ${props => props.$active ? COLORS.white : COLORS.text};
  border: 2px solid ${COLORS.accent};
  padding: 0.8rem 2rem;
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

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${COLORS.textMuted};
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 2rem;
  color: ${COLORS.accent};
`;

const ScrollToTop = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: ${COLORS.accent};
  color: ${COLORS.white};
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 20px rgba(230, 82, 31, 0.3);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(230, 82, 31, 0.4);
  }
`;

const EasterEgg = styled.div`
  position: fixed;
  right: 18px;
  bottom: 18px;
  background: rgba(230, 82, 31, 0.92);
  color: #fff;
  font-weight: bold;
  font-size: 1.1rem;
  padding: 0.5rem 1.2rem;
  border-radius: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  z-index: 9999;
  opacity: 0.85;
  letter-spacing: 1px;
  user-select: none;
`;

const CATEGORIES = [
  { key: 'trailers', label: 'Trailers', icon: '🎬' },
  { key: 'music', label: 'Music', icon: '🎵' },
  { key: 'gaming', label: 'Gaming', icon: '🎮' },
  { key: 'tech', label: 'Technology', icon: '💻' },
  { key: 'sports', label: 'Sports', icon: '⚽' }
];

function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('trailers');
  const [videos, setVideos] = useState({});
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const clickCount = useRef(0);
  const lastClickTime = useRef(0);

  useEffect(() => {
    const sessionToken = localStorage.getItem('sessionToken');
    const userInfo = localStorage.getItem('userInfo');
    
    if (sessionToken && userInfo) {
      setLoggedIn(true);
      setUser(JSON.parse(userInfo));
      loadFavorites(sessionToken);
    }
  }, []);

  const loadFavorites = async (token) => {
    try {
      const API_URL = 'http://localhost:8000';
      const response = await fetch(`${API_URL}/get_favorites.php`, {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = await response.json();
      if (data.success) {
        setFavorites(data.favorites || []);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const loadVideos = async (category) => {
    setLoading(true);
    try {
      const API_URL = 'http://localhost:8000';
      const response = await fetch(`${API_URL}/get_movies.php`);
      const data = await response.json();
      if (data.success) {
        setVideos(prev => ({ ...prev, [category]: data.movies }));
      }
    } catch (error) {
      console.error('Error loading movies:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadVideos(activeCategory);
  }, [activeCategory]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFavorite = async (videoId) => {
    if (!loggedIn) {
      alert('You must be logged in to add favorites');
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
        body: JSON.stringify({ video_id: videoId })
      });
      const data = await response.json();
      if (data.success) {
        setFavorites(prev => 
          prev.includes(videoId) 
            ? prev.filter(id => id !== videoId)
            : [...prev, videoId]
        );
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('userInfo');
    setLoggedIn(false);
    setUser('');
    setFavorites([]);
  };

  const filteredVideos = useMemo(() => {
    const categoryVideos = videos[activeCategory] || [];
    if (!search) return categoryVideos;
    
    const lowerSearch = search.toLowerCase();
    return categoryVideos.filter(video =>
      video.title.toLowerCase().includes(lowerSearch) ||
      video.channel.toLowerCase().includes(lowerSearch)
    );
  }, [videos, activeCategory, search]);

  const handleLogoClick = () => {
    const now = Date.now();
    if (now - lastClickTime.current < 800) {
      clickCount.current += 1;
    } else {
      clickCount.current = 1;
    }
    lastClickTime.current = now;
    if (clickCount.current >= 5) {
      setShowEasterEgg(true);
      clickCount.current = 0;
    }
  };

  return (
    <>
      <Navbar>
        <NavContainer>
          <Logo onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
            <span style={{ fontSize: '2rem' }}>🎬</span>
            BOIOLAX
          </Logo>
          <NavActions>
            {loggedIn ? (
              <>
                <span style={{ color: COLORS.textMuted }}>
                  Hello, {user && user.nickname ? user.nickname : (user && user.name ? user.name : user && user.email ? user.email : 'User')}
                </span>
                <NavButton onClick={() => navigate('/profile')}>Profile</NavButton>
                <NavButton onClick={handleLogout}>Logout</NavButton>
              </>
            ) : (
              <>
                <NavButton onClick={() => navigate('/login')}>Login</NavButton>
                <NavButton $primary onClick={() => navigate('/register')}>Sign Up</NavButton>
              </>
            )}
          </NavActions>
        </NavContainer>
      </Navbar>

      <HeroSection>
        <HeroContent>
          <HeroTitle>Discover Amazing Videos</HeroTitle>
          <HeroSubtitle>
            The ultimate platform to explore, discover and share the best video content on the web
          </HeroSubtitle>
          
          <CTAButton onClick={() => document.getElementById('main-content').scrollIntoView({ behavior: 'smooth' })}>
            Start Exploring
          </CTAButton>
        </HeroContent>
      </HeroSection>

      <MainContent id="main-content">
        <Section>
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="Search videos, channels, categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <SearchIcon />
          </SearchContainer>

          <CategoryTabs>
            {CATEGORIES.map(category => (
              <CategoryTab
                key={category.key}
                $active={activeCategory === category.key}
                onClick={() => setActiveCategory(category.key)}
              >
                {category.icon} {category.label}
              </CategoryTab>
            ))}
          </CategoryTabs>

          {loading ? (
            <LoadingGrid>
              {[...Array(6)].map((_, i) => (
                <LoadingCard key={i} />
              ))}
            </LoadingGrid>
          ) : filteredVideos.length > 0 ? (
            <VideoGrid>
              {filteredVideos.map(video => (
                <VideoCard key={video.id} to={`/video/${video.id}`}>
                  <VideoThumbnail>
                    <VideoImage src={video.poster_url} alt={video.title} />
                    <PlayButton>
                      <FaPlay />
                    </PlayButton>
                  </VideoThumbnail>
                  <VideoInfo>
                    <VideoTitle>{video.title}</VideoTitle>
                    <VideoMeta>
                      <VideoChannel>{video.release_date}</VideoChannel>
                      {video.average_rating !== null && video.average_rating !== undefined && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '1rem', color: COLORS.accent }}>
                          <FaStar style={{ color: '#FFD700' }} />
                          {video.average_rating}/5
                        </span>
                      )}
                      <FavoriteButton
                        $isFavorite={favorites.includes(video.id)}
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFavorite(video.id);
                        }}
                      >
                        {favorites.includes(video.id) ? <FaHeart /> : <FaRegHeart />}
                      </FavoriteButton>
                    </VideoMeta>
                  </VideoInfo>
                </VideoCard>
              ))}
            </VideoGrid>
          ) : (
            <EmptyState>
              <EmptyIcon>🔍</EmptyIcon>
              <h3>No videos found</h3>
              <p>Try adjusting your search filters or change category</p>
            </EmptyState>
          )}
        </Section>
      </MainContent>

      {showScrollTop && (
        <ScrollToTop onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          ↑
        </ScrollToTop>
      )}
      {showEasterEgg && <EasterEgg>Boia de, love u George 💖</EasterEgg>}
    </>
  );
}

export default Home; 