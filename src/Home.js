import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaShareAlt, FaSearch } from 'react-icons/fa';
import videoSections from './videos';

const logo = process.env.PUBLIC_URL + '/logo192.png';

const MAIN_GRADIENT = 'linear-gradient(90deg, #A35C7A 0%, #7B3F61 100%)';

const ModernLogo = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="mainGradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#A35C7A" />
        <stop offset="1" stopColor="#7B3F61" />
      </linearGradient>
    </defs>
    <circle cx="20" cy="20" r="18" fill="url(#mainGradient)" stroke="#fff" strokeWidth="2" />
    <polygon points="16,13 29,20 16,27" fill="#fff" opacity="0.95" />
  </svg>
);

const AnimatedSection = styled.div`
  background: rgba(24,24,32,0.92);
  border-radius: 3rem;
  box-shadow: 0 8px 32px #A35C7A22, 0 2px 12px #000a;
  margin: 0 auto 2.5rem auto;
  padding: 2.5rem 1.2rem 2.5rem 1.2rem;
  max-width: 1200px;
  border: none;
  animation: borderAnim 4s linear infinite alternate;
  @keyframes borderAnim {
    0% { border-image-slice: 1 1 1 1; }
    100% { border-image-slice: 1 1 1 1; }
  }
`;

const GlassCard = styled.div`
  background: rgba(35,35,55,0.82);
  border-radius: 2.5rem;
  overflow: hidden;
  box-shadow: none;
  text-decoration: none;
  color: #fff;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  min-width: 260px;
  max-width: 320px;
  height: 200px;
  scroll-snap-align: start;
  border: none;
  outline: none;
  position: relative;
  backdrop-filter: none;
`;

const GlassCardLink = styled(Link)`
  background: rgba(35,35,55,0.82);
  border-radius: 2.5rem;
  overflow: hidden;
  box-shadow: 0 4px 32px #A35C7A33, 0 2px 12px #000a;
  text-decoration: none;
  color: #fff;
  display: flex;
  flex-direction: column;
  min-width: 260px;
  max-width: 320px;
  height: 200px;
  scroll-snap-align: start;
  border: none;
  outline: none;
  position: relative;
  backdrop-filter: blur(8px) saturate(1.1);
  transition: transform 0.32s cubic-bezier(.4,2,.6,1), box-shadow 0.32s cubic-bezier(.4,2,.6,1), border 0.32s cubic-bezier(.4,2,.6,1);
  animation: fadeInCard 0.9s cubic-bezier(.4,2,.6,1);
  &:hover {
    transform: scale(1.04) translateY(-4px) rotate(-0.5deg);
    box-shadow: 0 16px 48px 0 #A35C7A99, 0 8px 32px #000a;
    border: none;
    z-index: 3;
  }
`;

const ThumbWrapper = styled.div`
  width: 100%;
  aspect-ratio: 16/9;
  background: #222;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 70%;
`;

const Thumb = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0;
  box-shadow: 0 2px 8px #0008;
  transform: scale(1.0);
  filter: brightness(0.92) grayscale(0.1);
  transition: transform 0.32s cubic-bezier(.4,2,.6,1), box-shadow 0.32s cubic-bezier(.4,2,.6,1), filter 0.32s cubic-bezier(.4,2,.6,1);
  will-change: transform, filter;
  ${GlassCardLink}:hover & {
    transform: scale(1.06) rotate(-0.5deg);
    box-shadow: 0 8px 32px #e1306c33, 0 2px 12px #000a;
    filter: brightness(1.08) grayscale(0);
  }
`;

const CardInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(24,24,32,0.82);
  color: #fff;
  font-size: 0.98rem;
  padding: 0.7rem 1rem;
  opacity: 1;
  transform: none;
`;

const FeaturedSection = styled.section`
  position: relative;
  width: 100%;
  max-width: 100%;
  height: 56vw;
  max-height: 60vh;
  min-height: 320px;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  background: #111;
  margin: 0 auto;
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px #A35C7A22, 0 2px 12px #000a;
  margin-top: 3rem;
  @media (max-width: 600px) {
    height: 60vw;
    min-height: 180px;
    border-radius: 0.7rem;
    margin-top: 2rem;
  }
`;

const FeaturedVideo = styled.video`
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;
  z-index: 1;
  filter: brightness(0.7) blur(0.5px);
`;

const FeaturedOverlay = styled.div`
  position: relative;
  z-index: 2;
  padding: 2.5rem 2rem 3.5rem 2rem;
  color: #fff;
  width: 100%;
  background: linear-gradient(180deg,rgba(0,0,0,0.0) 40%,rgba(0,0,0,0.7) 100%);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  border-radius: 0 0 2.5rem 2.5rem;
  box-shadow: 0 8px 32px #A35C7A33, 0 2px 12px #000a;
`;

const FeaturedTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 900;
  margin: 0 0 1rem 0;
  text-shadow: 0 4px 24px #000a;
`;

const WatchButton = styled.button`
  background: ${MAIN_GRADIENT};
  color: #fff;
  font-size: 1.2rem;
  font-weight: bold;
  border: none;
  border-radius: 32px;
  padding: 0.7rem 2.2rem;
  margin-top: 0.5rem;
  box-shadow: 0 2px 12px #A35C7A55;
  cursor: pointer;
  transition: background 0.32s, transform 0.32s, box-shadow 0.32s;
  outline: none;
  letter-spacing: 0.04em;
  &:hover {
    background: linear-gradient(90deg, #7B3F61 0%, #A35C7A 100%);
    transform: scale(1.06);
    box-shadow: 0 4px 24px #A35C7A99;
  }
`;

const AppFade = styled.div`
  animation: appFadeIn 1.2s cubic-bezier(.4,2,.6,1);
  @keyframes appFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const SectionWrapper = styled.div`
  margin-top: 3.5rem;
  margin-bottom: 3.5rem;
  animation: fadeIn 0.7s cubic-bezier(.4,2,.6,1);
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(32px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const SectionBg = styled.div`
  background: #181818ee;
  border-radius: 0.7rem;
  box-shadow: 0 2px 16px 0 #000a;
  padding: 1.5rem 1.2rem 1.5rem 1.2rem;
  margin: 0 auto;
  width: 100%;
  max-width: 1200px;
`;

const SectionTitle = styled.h2`
  color: #fff;
  font-size: 1.5rem;
  font-weight: 900;
  margin: 0 0 1.2rem 1.5rem;
  letter-spacing: 0.04em;
  text-shadow: 0 2px 8px #000a;
  position: relative;
  display: inline-block;
  &::after {
    content: '';
    display: block;
    width: 36px;
    height: 4px;
    background: ${MAIN_GRADIENT};
    border-radius: 2px;
    margin-top: 0.3rem;
    margin-left: 2px;
    animation: underlineAnim 2.5s infinite alternate cubic-bezier(.4,2,.6,1);
  }
  @keyframes underlineAnim {
    from { width: 36px; }
    to { width: 60px; }
  }
`;

const Row = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 1.5rem;
  padding: 0 0 1.5rem 0;
  scroll-snap-type: x mandatory;
  min-height: 220px;
  &::-webkit-scrollbar {
    height: 10px;
    background: #232323;
  }
  &::-webkit-scrollbar-thumb {
    background: #e1306c;
    border-radius: 8px;
  }
  @media (max-width: 900px) {
    gap: 1rem;
    padding: 0 0 1.2rem 0;
    min-height: 130px;
  }
`;

const Title = styled.h3`
  font-size: 1.1rem;
  margin: 0;
  flex: 1;
`;

const MainTitle = styled.h1`
  width: 100%;
  text-align: center;
  font-size: 4.2rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  margin: 0;
  margin-top: 2.2rem;
  margin-bottom: 7rem;
  background: linear-gradient(90deg, #A35C7A 0%, #e1306c 50%, #7B3F61 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  text-shadow: 0 8px 48px #A35C7A33, 0 2px 12px #000a, 0 0px 32px #e1306c44;
  animation: titlePop 1.2s cubic-bezier(.4,2,.6,1);
  @keyframes titlePop {
    from { opacity: 0; transform: scale(0.92) translateY(-32px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
  @media (max-width: 600px) {
    font-size: 2.1rem;
    margin-top: 1.2rem;
    margin-bottom: 3.5rem;
  }
`;

const NavbarFade = styled.div`
  animation: navbarFadeIn 0.7s cubic-bezier(.4,2,.6,1);
  @keyframes navbarFadeIn {
    from { opacity: 0; transform: translateY(-24px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Navbar = styled.nav`
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.7rem 1.2rem 0.7rem 1.2rem;
  background: rgba(30, 30, 40, 0.72);
  box-shadow: 0 2px 8px #000a;
  border: 1.5px solid rgba(255,255,255,0.13);
  border-radius: 2.5rem;
  border: none;
  backdrop-filter: blur(10px) saturate(1.1);
  margin-top: 2.5rem;
  margin-bottom: 2.5rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
`;

const LogoWrap = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  text-decoration: none;
`;

const LogoText = styled.span`
  font-size: 1.45rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  background: linear-gradient(90deg, #A35C7A 0%, #7B3F61 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  text-shadow: 0 2px 12px #A35C7A33, 0 1px 6px #000a;
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1.1rem;
`;

const NavBtn = styled(Link)`
  background: linear-gradient(90deg, #A35C7A 0%, #7B3F61 100%);
  color: #fff;
  font-size: 1.05rem;
  font-weight: 700;
  border: none;
  border-radius: 22px;
  padding: 0.5rem 1.4rem;
  box-shadow: 0 2px 8px #A35C7A33;
  text-decoration: none;
  transition: background 0.22s, transform 0.22s, box-shadow 0.22s;
  outline: none;
  &:hover {
    background: linear-gradient(90deg, #7B3F61 0%, #A35C7A 100%);
    transform: scale(1.07);
    box-shadow: 0 4px 16px #A35C7A55;
  }
`;

const BackBtn = styled.button`
  position: absolute;
  top: 1.2rem;
  left: 1.2rem;
  background: rgba(30,30,40,0.7);
  border: none;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 700;
  border-radius: 18px;
  padding: 0.5rem 1.3rem 0.5rem 2.2rem;
  box-shadow: 0 2px 12px #A35C7A33, 0 2px 8px #000a;
  cursor: pointer;
  z-index: 3;
  transition: background 0.22s, box-shadow 0.22s, color 0.22s, transform 0.22s;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  &:hover, &:focus {
    background: linear-gradient(120deg, #A35C7A 0%, #7B3F61 100%);
    color: #fff;
    box-shadow: 0 4px 24px #A35C7A55, 0 2px 12px #000a;
    outline: none;
    transform: scale(1.08);
  }
`;

const BackLogo = styled.img`
  width: 22px;
  height: 22px;
  margin-right: 0.5rem;
  filter: drop-shadow(0 2px 8px #A35C7A88);
`;

// 1. Scroll to Top Button
const ScrollTopBtn = styled.button`
  position: fixed;
  right: 2.2rem;
  bottom: 2.2rem;
  z-index: 100;
  background: linear-gradient(120deg, #A35C7A 0%, #7B3F61 100%);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  box-shadow: 0 2px 12px #A35C7A33, 0 2px 8px #000a;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.85;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s, opacity 0.2s;
  &:hover {
    background: linear-gradient(120deg, #7B3F61 0%, #A35C7A 100%);
    transform: scale(1.12);
    opacity: 1;
  }
`;

// 4. Animated Loading Spinner
const Spinner = styled.div`
  width: 54px;
  height: 54px;
  border: 5px solid #A35C7A33;
  border-top: 5px solid #A35C7A;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 2rem auto;
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Toast notification
const Toast = styled.div`
  position: fixed;
  bottom: 2.5rem;
  left: 50%;
  transform: translateX(-50%);
  background: #232336;
  color: #fff;
  padding: 1rem 2rem;
  border-radius: 2rem;
  box-shadow: 0 2px 12px #A35C7A33, 0 2px 8px #000a;
  font-size: 1.1rem;
  opacity: 0.97;
  z-index: 9999;
  pointer-events: none;
  animation: fadeInToast 0.3s, fadeOutToast 0.3s 2.2s;
  @keyframes fadeInToast { from { opacity: 0; } to { opacity: 0.97; } }
  @keyframes fadeOutToast { from { opacity: 0.97; } to { opacity: 0; } }
`;

// Search bar
const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: #232336;
  border-radius: 2rem;
  padding: 0.5rem 1.2rem;
  margin: 2rem auto 1.5rem auto;
  max-width: 420px;
  box-shadow: 0 2px 8px #000a;
`;
const SearchInput = styled.input`
  background: transparent;
  border: none;
  color: #fff;
  font-size: 1.1rem;
  outline: none;
  flex: 1;
  margin-left: 0.7rem;
`;

function Home() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState("");
  const [showModal, setShowModal] = useState(false);

  // 1. Scroll to Top
  const [showScroll, setShowScroll] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowScroll(window.scrollY > 200);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // 4. Simulate loading spinner for videos (replace with real loading if needed)
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const logged = localStorage.getItem("loggedIn");
    const username = localStorage.getItem("username");
    setLoggedIn(logged === "true");
    setUser(username || "");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("username");
    setLoggedIn(false);
    setUser("");
    window.location.reload();
  };

  const handleCardClick = (id) => {
    addRecent(id);
    navigate(`/video/${id}`);
  };

  // Use the second video of the first section as the featured intro
  const featured = videoSections[0].videos[1];

  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('favorites') || '[]');
    } catch { return []; }
  });
  const [recent, setRecent] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('recent') || '[]');
    } catch { return []; }
  });
  const [toast, setToast] = useState('');
  const [search, setSearch] = useState('');
  const [filteredSections, setFilteredSections] = useState(videoSections);
  const [activeCard, setActiveCard] = useState(null);
  const [rowRefs] = useState(() => []);

  // 4. Search bar filter
  useEffect(() => {
    if (!search) {
      setFilteredSections(videoSections);
      return;
    }
    const lower = search.toLowerCase();
    setFilteredSections(
      videoSections.map(section => ({
        ...section,
        videos: section.videos.filter(v => v.title.toLowerCase().includes(lower) || (v.description || '').toLowerCase().includes(lower))
      })).filter(section => section.videos.length > 0)
    );
  }, [search]);

  // 2. Favorite/like
  const toggleFavorite = id => {
    let favs = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id];
    setFavorites(favs);
    localStorage.setItem('favorites', JSON.stringify(favs));
    setToast(favorites.includes(id) ? 'Rimosso dai preferiti' : 'Aggiunto ai preferiti');
  };

  // 3. Recently watched
  const addRecent = id => {
    let rec = [id, ...recent.filter(r => r !== id)].slice(0, 10);
    setRecent(rec);
    localStorage.setItem('recent', JSON.stringify(rec));
  };

  // 5. Toast notifications
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  // 6. Share button
  const shareVideo = (id) => {
    const url = window.location.origin + '/video/' + id;
    navigator.clipboard.writeText(url);
    setToast('Link copiato!');
  };

  // 1. Keyboard accessibility
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setActiveCard(null);
      if (['ArrowRight', 'ArrowLeft'].includes(e.key) && filteredSections.length > 0) {
        let flat = filteredSections.flatMap(s => s.videos);
        if (!flat.length) return;
        let idx = flat.findIndex(v => v.id === activeCard);
        if (idx === -1) idx = 0;
        if (e.key === 'ArrowRight') idx = (idx + 1) % flat.length;
        if (e.key === 'ArrowLeft') idx = (idx - 1 + flat.length) % flat.length;
        setActiveCard(flat[idx].id);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeCard, filteredSections]);

  // 8. Swipe gestures for mobile
  useEffect(() => {
    rowRefs.forEach(ref => {
      if (!ref) return;
      let startX = null;
      ref.ontouchstart = e => startX = e.touches[0].clientX;
      ref.ontouchmove = e => {
        if (startX === null) return;
        let dx = e.touches[0].clientX - startX;
        ref.scrollLeft -= dx;
        startX = e.touches[0].clientX;
      };
      ref.ontouchend = () => startX = null;
    });
  });

  // 3. Get recently watched videos
  const recentVideos = recent.map(id => videoSections.flatMap(s => s.videos).find(v => v.id === id)).filter(Boolean);

  return (
    <>
      {/* Navbar without theme toggle */}
      <NavbarFade>
        <Navbar>
          <LogoWrap to="/">
            <ModernLogo />
            <LogoText>BOIOLAX</LogoText>
          </LogoWrap>
          <NavActions>
            {loggedIn ? (
              <>
                <span style={{ color: '#fff', fontWeight: 700, marginRight: 12 }}>Welcome{user ? `, ${user.includes('@') ? user.split('@')[0] : user}` : ''}!</span>
                <NavBtn as="button" onClick={handleLogout}>Logout</NavBtn>
              </>
            ) : (
              <>
                <NavBtn to="/login">Login</NavBtn>
                <NavBtn to="/register">Register</NavBtn>
              </>
            )}
          </NavActions>
        </Navbar>
      </NavbarFade>
      <AppFade>
        {/* Show Back button if not on root */}
        {window.location.pathname !== '/' && (
          <BackBtn onClick={() => navigate(-1)} aria-label="Back">
            <BackLogo src={logo} alt="Back to home" />
            Back
          </BackBtn>
        )}
        <MainTitle>BOIOLAX</MainTitle>
        <FeaturedSection>
          <FeaturedVideo
            as="iframe"
            src="https://www.youtube.com/embed/Uc9m1G6qYyg?autoplay=1&mute=1&loop=1&playlist=Uc9m1G6qYyg&controls=0&showinfo=0&modestbranding=1&rel=0"
            title="Featured Preview"
            frameBorder="0"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            style={{ pointerEvents: 'none' }}
            tabIndex={-1}
          />
          <FeaturedOverlay>
            <FeaturedTitle>{featured.title}</FeaturedTitle>
            <WatchButton onClick={() => handleCardClick(featured.id)}>
              ▶ Watch
            </WatchButton>
          </FeaturedOverlay>
        </FeaturedSection>
        {loading ? <Spinner /> : (
          <>
            {/* Toast notification */}
            {toast && <Toast>{toast}</Toast>}
            {/* Search bar */}
            <SearchBar>
              <FaSearch />
              <SearchInput
                placeholder="Cerca un video..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </SearchBar>
            {/* Recently Watched */}
            {recentVideos.length > 0 && (
              <SectionWrapper>
                <AnimatedSection>
                  <SectionBg>
                    <SectionTitle>Visti di recente</SectionTitle>
                    <Row>
                      {recentVideos.map(video => (
                        <GlassCardLink
                          key={video.id}
                          to={`/video/${video.id}`}
                          onClick={() => addRecent(video.id)}
                        >
                          <ThumbWrapper>
                            <Thumb src={video.thumb} alt={video.title} />
                          </ThumbWrapper>
                          <CardInfo>
                            <Title>{video.title}</Title>
                            <FaShareAlt onClick={e => { e.stopPropagation(); shareVideo(video.id); }} style={{ cursor: 'pointer', marginLeft: 8 }} title="Copia link" />
                            {favorites.includes(video.id) ? (
                              <FaHeart onClick={e => { e.stopPropagation(); toggleFavorite(video.id); }} style={{ color: '#e1306c', cursor: 'pointer', marginLeft: 8 }} title="Rimuovi dai preferiti" />
                            ) : (
                              <FaRegHeart onClick={e => { e.stopPropagation(); toggleFavorite(video.id); }} style={{ color: '#fff', cursor: 'pointer', marginLeft: 8 }} title="Aggiungi ai preferiti" />
                            )}
                          </CardInfo>
                        </GlassCardLink>
                      ))}
                    </Row>
                  </SectionBg>
                </AnimatedSection>
              </SectionWrapper>
            )}
            {/* Video Sections */}
            {filteredSections.map((section, i) => (
              <SectionWrapper key={section.title}>
                <AnimatedSection>
                  <SectionBg>
                    <SectionTitle>{section.title}</SectionTitle>
                    <Row ref={el => rowRefs[i] = el}>
                      {section.videos.map(video => (
                        <GlassCardLink
                          key={video.id}
                          to={`/video/${video.id}`}
                          onClick={() => addRecent(video.id)}
                        >
                          <ThumbWrapper>
                            <Thumb src={video.thumb} alt={video.title} />
                          </ThumbWrapper>
                          <CardInfo>
                            <Title>{video.title}</Title>
                            <FaShareAlt onClick={e => { e.stopPropagation(); shareVideo(video.id); }} style={{ cursor: 'pointer', marginLeft: 8 }} title="Copia link" />
                            {favorites.includes(video.id) ? (
                              <FaHeart onClick={e => { e.stopPropagation(); toggleFavorite(video.id); }} style={{ color: '#e1306c', cursor: 'pointer', marginLeft: 8 }} title="Rimuovi dai preferiti" />
                            ) : (
                              <FaRegHeart onClick={e => { e.stopPropagation(); toggleFavorite(video.id); }} style={{ color: '#fff', cursor: 'pointer', marginLeft: 8 }} title="Aggiungi ai preferiti" />
                            )}
                          </CardInfo>
                        </GlassCardLink>
                      ))}
                    </Row>
                  </SectionBg>
                </AnimatedSection>
              </SectionWrapper>
            ))}
          </>
        )}
        {loggedIn && (
          <div style={{textAlign: 'center', margin: '2rem 0'}}>
            <button style={{padding: '0.8rem 2rem', fontSize: '1.1rem', borderRadius: 18, background: '#A35C7A', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, boxShadow: '0 2px 12px #A35C7A33'}}
              onClick={() => setShowModal(true)}
            >
              Open User Feature
            </button>
          </div>
        )}
      </AppFade>
      {showModal && (
        <div style={{position: 'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000}}>
          <div style={{background:'#232336', color:'#fff', padding:'2rem 2.5rem', borderRadius:18, boxShadow:'0 2px 12px #0008', minWidth:320, textAlign:'center', position:'relative'}}>
            <h2 style={{marginBottom:'1rem'}}>User Profile</h2>
            <div style={{marginBottom:'1.2rem'}}>
              <strong>Username:</strong> {user}
            </div>
            <div style={{marginBottom:'1.2rem'}}>
              <strong>Email:</strong> (hidden for now)
            </div>
            <div style={{marginBottom:'1.2rem', color:'#aaa'}}>
              More profile features coming soon!
            </div>
            <button onClick={() => setShowModal(false)} style={{marginTop:'1rem', padding:'0.5rem 1.5rem', borderRadius:12, background:'#A35C7A', color:'#fff', border:'none', fontWeight:700, cursor:'pointer'}}>Close</button>
          </div>
        </div>
      )}
      {/* 1. Scroll to Top Button */}
      {showScroll && (
        <ScrollTopBtn onClick={scrollToTop} title="Torna su">↑</ScrollTopBtn>
      )}
    </>
  );
}

export default Home; 