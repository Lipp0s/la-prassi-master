import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import { FaYoutube, FaPlayCircle } from 'react-icons/fa';
import videoSections from './videos';
const logo = process.env.PUBLIC_URL + '/logo192.png';

const MAIN_COLOR = '#A35C7A';
const MAIN_GRADIENT = 'linear-gradient(90deg, #A35C7A 0%, #7B3F61 100%)';

const FeaturedSection = styled.section`
  position: relative;
  width: 100vw;
  max-width: 100vw;
  height: 56vw;
  max-height: 60vh;
  min-height: 320px;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  background: #111;
  @media (max-width: 600px) {
    height: 60vw;
    min-height: 180px;
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
  margin-bottom: 2.5rem;
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
  padding: 1.5rem 0.5rem 1.5rem 0.5rem;
  margin: 0 1.2rem;
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
  padding: 0 1.5rem 1.5rem 1.5rem;
  scroll-snap-type: x mandatory;
  &::-webkit-scrollbar {
    height: 10px;
    background: #232323;
  }
  &::-webkit-scrollbar-thumb {
    background: #e1306c;
    border-radius: 8px;
  }
  @media (max-width: 600px) {
    gap: 1rem;
    padding: 0 0.5rem 1.2rem 0.5rem;
  }
`;

const Card = styled.div`
  background: linear-gradient(120deg, #232336 60%, #2d1e2f 100%);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 16px #000a, 0 2px 12px #A35C7A22;
  text-decoration: none;
  color: #fff;
  transition: transform 0.32s cubic-bezier(.4,2,.6,1), box-shadow 0.32s cubic-bezier(.4,2,.6,1), border 0.32s cubic-bezier(.4,2,.6,1);
  display: flex;
  flex-direction: column;
  cursor: pointer;
  min-width: 220px;
  max-width: 260px;
  scroll-snap-align: start;
  border: 2px solid transparent;
  animation: fadeInCard 0.9s cubic-bezier(.4,2,.6,1);
  outline: none;
  position: relative;
  &:hover {
    transform: scale(1.09) translateY(-6px);
    box-shadow: 0 16px 48px 0 #A35C7A55, 0 8px 32px #000a;
    border: 2px solid ${MAIN_COLOR};
    z-index: 2;
  }
  &:focus {
    border: 2px solid #fff;
    box-shadow: 0 0 0 3px #A35C7A88, 0 2px 12px #000a;
  }
  @media (max-width: 600px) {
    min-width: 170px;
    max-width: 200px;
    border-radius: 10px;
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
`;

const Thumb = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.32s cubic-bezier(.4,2,.6,1), box-shadow 0.32s cubic-bezier(.4,2,.6,1);
  will-change: transform;
  border-radius: 0;
  box-shadow: 0 2px 8px #0008;
  transform: scale(1.18);
  ${Card}:hover & {
    transform: scale(1.25);
    box-shadow: 0 8px 32px #A35C7A44, 0 2px 12px #000a;
  }
`;

const CardContent = styled.div`
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
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
  margin-bottom: 0.7rem;
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
  }
`;

const CardOverlay = styled.div`
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(20,20,30,0.18);
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.28s cubic-bezier(.4,2,.6,1);
  pointer-events: none;
  z-index: 3;
  ${Card}:hover & {
    opacity: 1;
  }
`;

const PlayIcon = styled(FaPlayCircle)`
  color: #fff;
  font-size: 3.2rem;
  filter: drop-shadow(0 2px 12px #A35C7A88);
  opacity: 0.92;
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
  box-shadow: 0 2px 16px #A35C7A22, 0 1px 8px #000a;
  backdrop-filter: blur(10px) saturate(1.1);
  margin-bottom: 0.5rem;
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

const LogoImg = styled.img`
  width: 38px;
  height: 38px;
  filter: drop-shadow(0 2px 12px #A35C7A88);
  transition: transform 0.22s cubic-bezier(.4,2,.6,1);
  &:hover {
    transform: scale(1.13) rotate(-8deg);
  }
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

function Home() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState("");
  const [showModal, setShowModal] = useState(false);

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
    navigate(`/video/${id}`);
  };

  // Use the second video of the first section as the featured intro
  const featured = videoSections[0].videos[1];
  // Add autoplay, mute, and loop params for YouTube autoplay and looping
  const getAutoplayUrl = (url) => {
    const base = url.includes('?') ? `${url}&` : `${url}?`;
    return `${base}autoplay=1&mute=1&loop=1&playlist=${featured.url.split('/embed/')[1]}`;
  };

  return (
    <>
      <NavbarFade>
        <Navbar>
          <LogoWrap to="/">
            <LogoImg src={logo} alt="BOIOLAX logo" />
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
            src={getAutoplayUrl(featured.url)}
            title={featured.title}
            frameBorder="0"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            autoPlay
            muted
            loop
            playsInline
          />
          <FeaturedOverlay>
            <FeaturedTitle>{featured.title}</FeaturedTitle>
            <WatchButton onClick={() => handleCardClick(featured.id)}>
              ▶ Watch
            </WatchButton>
          </FeaturedOverlay>
        </FeaturedSection>
        {videoSections.map((section) => (
          <SectionWrapper key={section.title}>
            <SectionBg>
              <SectionTitle>{section.title}</SectionTitle>
              <Row>
                {section.videos.map((video) => (
                  <Card
                    key={video.id}
                    onClick={() => handleCardClick(video.id)}
                    tabIndex={0}
                    onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleCardClick(video.id)}
                    aria-label={`Play ${video.title}`}
                  >
                    <ThumbWrapper>
                      <Thumb src={video.thumb} alt={video.title} />
                      <CardOverlay>
                        <PlayIcon />
                      </CardOverlay>
                    </ThumbWrapper>
                    <CardContent>
                      <FaYoutube color={MAIN_COLOR} size={24} />
                      <Title>{video.title}</Title>
                    </CardContent>
                  </Card>
                ))}
              </Row>
            </SectionBg>
          </SectionWrapper>
        ))}
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
    </>
  );
}

export default Home; 