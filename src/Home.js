import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaShareAlt, FaSearch } from 'react-icons/fa';
// import videoSections from './videos';

const logo = process.env.PUBLIC_URL + '/logo192.png';

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

const MAIN_GRADIENT = `linear-gradient(90deg, ${COLORS.secondary} 0%, ${COLORS.primary} 100%)`;

const ModernLogo = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="mainGradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor={COLORS.secondary} />
        <stop offset="1" stopColor={COLORS.primary} />
      </linearGradient>
    </defs>
    <circle cx="20" cy="20" r="18" fill="url(#mainGradient)" stroke="#fff" strokeWidth="2" />
    <polygon points="16,13 29,20 16,27" fill="#fff" opacity="0.95" />
  </svg>
);

const AnimatedSection = styled.div`
  background: rgba(24,24,32,0.92);
  border-radius: 3rem;
  box-shadow: 0 8px 32px ${COLORS.accent}22, 0 2px 12px #000a;
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
  color: ${COLORS.text};
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

const SkeletonCard = styled.div`
  background: #23233655;
  border-radius: 2.5rem;
  min-width: 260px;
  max-width: 320px;
  height: 200px;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: skeletonPulse 1.2s infinite alternate;
  @keyframes skeletonPulse {
    from { opacity: 0.5; }
    to { opacity: 1; }
  }
`;
const SkeletonThumb = styled.div`
  width: 100%;
  height: 70%;
  background: #333a;
`;
const SkeletonText = styled.div`
  width: 80%;
  height: 18px;
  background: #444a;
  border-radius: 8px;
  margin: 12px 10% 0 10%;
`;
const SkeletonTextSmall = styled.div`
  width: 50%;
  height: 12px;
  background: #4446;
  border-radius: 6px;
  margin: 8px 10% 0 10%;
`;

const GlassCardLink = styled(Link)`
  background: rgba(35,35,55,0.82);
  border-radius: 2.5rem;
  overflow: hidden;
  box-shadow: 0 4px 32px ${COLORS.accent}33, 0 2px 12px #000a;
  text-decoration: none;
  color: ${COLORS.text};
  display: flex;
  flex-direction: column;
  min-width: 260px;
  max-width: 320px;
  height: 200px;
  scroll-snap-align: start;
  border: 2.5px solid transparent;
  outline: none;
  position: relative;
  backdrop-filter: blur(8px) saturate(1.1);
  transition: transform 0.32s cubic-bezier(.4,2,.6,1), box-shadow 0.32s cubic-bezier(.4,2,.6,1), border 0.32s cubic-bezier(.4,2,.6,1);
  animation: fadeInCard 0.9s cubic-bezier(.4,2,.6,1);
  &:hover {
    transform: scale(1.04) translateY(-4px) rotate(-0.5deg);
    box-shadow: 0 16px 48px 0 ${COLORS.accent}99, 0 8px 32px #000a;
    border: 2.5px solid ${COLORS.accent};
    z-index: 3;
  }
  &.favorite {
    border: 2.5px solid ${COLORS.highlight};
    box-shadow: 0 0 0 2px ${COLORS.highlight}55, 0 4px 32px ${COLORS.accent}33;
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
    box-shadow: 0 8px 32px ${COLORS.highlight}33, 0 2px 12px #000a;
    filter: brightness(1.08) grayscale(0);
  }
`;

const CardInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(24,24,32,0.82);
  color: ${COLORS.text};
  font-size: 0.98rem;
  padding: 0.7rem 1rem 0.7rem 1rem;
  opacity: 1;
  transform: none;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;
const CardTitle = styled.div`
  font-weight: 700;
  font-size: 1.08rem;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const CardChannel = styled.div`
  font-size: 0.93rem;
  color: ${COLORS.textMuted};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const HeartBtn = styled.button`
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  margin-left: 8px;
  font-size: 1.6rem;
  display: inline-flex;
  align-items: center;
  transition: transform 0.18s;
  &:active {
    transform: scale(1.25) rotate(-10deg);
  }
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
  box-shadow: 0 8px 32px ${COLORS.accent}22, 0 2px 12px #000a;
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
  color: ${COLORS.text};
  width: 100%;
  background: linear-gradient(180deg,rgba(0,0,0,0.0) 40%,rgba(0,0,0,0.7) 100%);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  border-radius: 0 0 2.5rem 2.5rem;
  box-shadow: 0 8px 32px ${COLORS.accent}33, 0 2px 12px #000a;
`;

const FeaturedTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 900;
  margin: 0 0 1rem 0;
  text-shadow: 0 4px 24px #000a;
`;

const WatchButton = styled.button`
  background: ${MAIN_GRADIENT};
  color: ${COLORS.text};
  font-size: 1.2rem;
  font-weight: bold;
  border: none;
  border-radius: 32px;
  padding: 0.7rem 2.2rem;
  margin-top: 0.5rem;
  box-shadow: 0 2px 12px ${COLORS.accent}55;
  cursor: pointer;
  transition: background 0.32s, transform 0.32s, box-shadow 0.32s;
  outline: none;
  letter-spacing: 0.04em;
  &:hover {
    background: linear-gradient(90deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%);
    transform: scale(1.06);
    box-shadow: 0 4px 24px ${COLORS.accent}99;
  }
`;

const AppFade = styled.div`
  animation: appFadeIn 1.2s cubic-bezier(.4,2,.6,1);
  @keyframes appFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SectionWrapper = styled.div`
  margin-top: 3.5rem;
  margin-bottom: 4.5rem;
  animation: fadeIn 0.7s cubic-bezier(.4,2,.6,1);
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(32px); }
    to { opacity: 1; transform: translateY(0); }
  }
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 2rem;
  box-sizing: border-box;
`;

const SectionBg = styled.div`
  background: #181818ee;
  border-radius: 0.7rem;
  box-shadow: 0 2px 16px 0 #000a;
  padding: 1.5rem 1.2rem 1.5rem 1.2rem;
  margin: 0 auto;
  width: 100%;
  max-width: 1200px;
  box-sizing: border-box;
`;

const SectionTitle = styled.h2`
  color: ${COLORS.text};
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
  width: 100%;
  box-sizing: border-box;
  @media (max-width: 900px) {
    gap: 1rem;
    padding: 0 0 1.2rem 0;
    min-height: 130px;
    flex-wrap: wrap;
    justify-content: center;
  }
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0.7rem;
    min-height: 0;
  }
  &::-webkit-scrollbar {
    height: 10px;
    background: #232323;
  }
  &::-webkit-scrollbar-thumb {
    background: ${COLORS.highlight};
    border-radius: 8px;
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
  background: linear-gradient(90deg, ${COLORS.secondary} 0%, ${COLORS.highlight} 50%, ${COLORS.primary} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  text-shadow: 0 8px 48px ${COLORS.secondary}33, 0 2px 12px #000a, 0 0px 32px ${COLORS.highlight}44;
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
  background: linear-gradient(90deg, ${COLORS.secondary} 0%, ${COLORS.primary} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  text-shadow: 0 2px 12px ${COLORS.secondary}33, 0 1px 6px #000a;
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1.1rem;
`;

const NavBtn = styled(Link)`
  background: linear-gradient(90deg, ${COLORS.secondary} 0%, ${COLORS.primary} 100%);
  color: ${COLORS.text};
  font-size: 1.05rem;
  font-weight: 700;
  border: none;
  border-radius: 22px;
  padding: 0.5rem 1.4rem;
  box-shadow: 0 2px 8px ${COLORS.secondary}33;
  text-decoration: none;
  transition: background 0.22s, transform 0.22s, box-shadow 0.22s;
  outline: none;
  &:hover {
    background: linear-gradient(90deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%);
    transform: scale(1.07);
    box-shadow: 0 4px 16px ${COLORS.secondary}55;
  }
`;

const BackBtn = styled.button`
  position: absolute;
  top: 1.2rem;
  left: 1.2rem;
  background: rgba(30,30,40,0.7);
  border: none;
  color: ${COLORS.text};
  font-size: 1.1rem;
  font-weight: 700;
  border-radius: 18px;
  padding: 0.5rem 1.3rem 0.5rem 2.2rem;
  box-shadow: 0 2px 12px ${COLORS.secondary}33, 0 2px 8px #000a;
  cursor: pointer;
  z-index: 3;
  transition: background 0.22s, box-shadow 0.22s, color 0.22s, transform 0.22s;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  &:hover, &:focus {
    background: linear-gradient(120deg, ${COLORS.secondary} 0%, ${COLORS.primary} 100%);
    color: ${COLORS.text};
    box-shadow: 0 4px 24px ${COLORS.secondary}55, 0 2px 12px #000a;
    outline: none;
    transform: scale(1.08);
  }
`;

const BackLogo = styled.img`
  width: 22px;
  height: 22px;
  margin-right: 0.5rem;
  filter: drop-shadow(0 2px 8px ${COLORS.secondary}88);
`;

// 1. Scroll to Top Button
const ScrollTopBtn = styled.button`
  position: fixed;
  right: 2.2rem;
  bottom: 2.2rem;
  z-index: 100;
  background: linear-gradient(120deg, ${COLORS.secondary} 0%, ${COLORS.primary} 100%);
  color: ${COLORS.text};
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  box-shadow: 0 2px 12px ${COLORS.secondary}33, 0 2px 8px #000a;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.85;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s, opacity 0.2s;
  &:hover {
    background: linear-gradient(120deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%);
    transform: scale(1.12);
    opacity: 1;
  }
`;

// 4. Animated Loading Spinner
const Spinner = styled.div`
  width: 72px;
  height: 72px;
  border: 7px solid ${COLORS.secondary}33;
  border-top: 7px solid ${COLORS.secondary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 3rem auto 1rem auto;
  display: block;
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
  color: ${COLORS.text};
  padding: 1rem 2rem;
  border-radius: 2rem;
  box-shadow: 0 2px 12px ${COLORS.secondary}33, 0 2px 8px #000a;
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
  color: ${COLORS.text};
  font-size: 1.1rem;
  outline: none;
  flex: 1;
  margin-left: 0.7rem;
`;

const highlightText = (text, search) => {
  if (!search) return text;
  const regex = new RegExp(`(${search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.split(regex).map((part, i) =>
    regex.test(part) ? <mark key={i} style={{background:'#ffe066',color:'#7B3F61',padding:'0 2px',borderRadius:3}}>{part}</mark> : part
  );
};

const CATEGORIES = [
  { key: 'trailers', label: 'Trailers' },
  { key: 'gameplay', label: 'Gameplay' },
  { key: 'tutorial', label: 'Tutorial' },
];

const AppContainer = styled.div`
  min-height: 100vh !important;
  background: #000000 !important;
  margin: 0 !important;
  padding: 0 !important;
  width: 100% !important;
  height: 100vh !important;
  overflow-x: hidden !important;
  position: relative !important;
  color: ${COLORS.text};
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
`;

// Header con glass effect originale
const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: ${COLORS.glass};
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid ${COLORS.glassBorder};
  padding: 1rem 0;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// Hero Section originale - RIMOSSA
// const HeroSection = styled.section`
//   padding: 8rem 0 4rem 0;
//   text-align: center;
//   position: relative;
//   z-index: 1;
// `;

// const HeroTitle = styled.h1`
//   font-size: 4.5rem;
//   font-weight: 900;
//   color: ${COLORS.white};
//   margin-bottom: 1.5rem;
//   line-height: 1.1;
//   text-shadow: 0 4px 8px rgba(0,0,0,0.3);
// `;

// const HeroSubtitle = styled.p`
//   font-size: 1.25rem;
//   color: rgba(255,255,255,0.9);
//   margin-bottom: 2rem;
//   width: 100%;
//   font-weight: 400;
// `;

// FeaturedSection - RIMOSSA
// const FeaturedSection = styled.section`
//   position: relative;
//   width: 100%;
//   max-width: 100%;
//   height: 56vw;
//   max-height: 60vh;
//   min-height: 320px;
//   overflow: hidden;
//   display: flex;
//   align-items: flex-end;
//   background: #111;
//   margin: 0 auto;
//   border-radius: 1.5rem;
//   box-shadow: 0 8px 32px ${COLORS.accent}22, 0 2px 12px #000a;
//   margin-top: 3rem;
//   @media (max-width: 600px) {
//     height: 60vw;
//     min-height: 180px;
//     border-radius: 0.7rem;
//     margin-top: 2rem;
//   }
// `;

// const FeaturedVideo = styled.video`
//   position: absolute;
//   top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;
//   z-index: 1;
//   filter: brightness(0.7) blur(0.5px);
// `;

// const FeaturedOverlay = styled.div`
//   position: relative;
//   z-index: 2;
//   padding: 2.5rem 2rem 3.5rem 2rem;
//   color: ${COLORS.text};
//   width: 100%;
//   background: linear-gradient(180deg,rgba(0,0,0,0.0) 40%,rgba(0,0,0,0.7) 100%);
//   display: flex;
//   flex-direction: column;
//   align-items: flex-start;
//   justify-content: flex-end;
//   border-radius: 0 0 2.5rem 2.5rem;
//   box-shadow: 0 8px 32px ${COLORS.accent}33, 0 2px 12px #000a;
// `;

// const FeaturedTitle = styled.h2`
//   font-size: 2.5rem;
//   font-weight: 900;
//   margin: 0 0 1rem 0;
//   text-shadow: 0 4px 24px #000a;
// `;

// const WatchButton = styled.button`
//   background: ${MAIN_GRADIENT};
//   color: ${COLORS.text};
//   font-size: 1.2rem;
//   font-weight: bold;
//   border: none;
//   border-radius: 32px;
//   padding: 0.7rem 2.2rem;
//   margin-top: 0.5rem;
//   box-shadow: 0 2px 12px ${COLORS.accent}55;
//   cursor: pointer;
//   transition: background 0.32s, transform 0.32s, box-shadow 0.32s;
//   outline: none;
//   letter-spacing: 0.04em;
//   &:hover {
//     background: linear-gradient(90deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%);
//     transform: scale(1.06);
//     box-shadow: 0 4px 24px ${COLORS.accent}99;
//   }
// `;

// Video Grid con glass effect originale
const VideoSection = styled.section`
  margin-bottom: 5rem;
  padding: 0;
  position: relative;
  z-index: 1;
  background: #000000;
`;

function Home() {
  // Funzioni di cache locale per i video per categoria
  function getCachedVideos(category) {
    const key = `yt_videos_${category}`;
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    try {
      const { timestamp, videos } = JSON.parse(cached);
      // Valido per 1 ora
      if (Date.now() - timestamp < 60 * 60 * 1000) return videos;
    } catch {}
    return null;
  }
  function setCachedVideos(category, videos) {
    const key = `yt_videos_${category}`;
    localStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), videos }));
  }

  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showScroll, setShowScroll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryVideos, setCategoryVideos] = useState({});
  const [categoryLoading, setCategoryLoading] = useState({});
  const [categoryError, setCategoryError] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState("");
  const [fallbackActive, setFallbackActive] = useState({});

  useEffect(() => {
    const onScroll = () => setShowScroll(window.scrollY > 200);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

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
    window.location.href = "/login";
  };

  const handleCardClick = (id) => {
    // Aggiorna recently watched
    let recent = [];
    try {
      recent = JSON.parse(localStorage.getItem('recent') || '[]');
    } catch { recent = []; }
    let rec = [id, ...recent.filter(r => r !== id)].slice(0, 10);
    localStorage.setItem('recent', JSON.stringify(rec));
    const allLoadedVideos = Object.values(categoryVideos).flat();
    const video = allLoadedVideos.find(v => v && v.id === id);
    navigate(`/video/${id}`, { state: { video } });
  };

  // Funzione per forzare il refresh di una categoria
  const refreshCategory = (catKey) => {
    setCategoryLoading(prev => ({ ...prev, [catKey]: true }));
    setCategoryError(prev => ({ ...prev, [catKey]: null }));
    fetch(`http://localhost:8000/youtube_videos.php?category=${catKey}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.videos && data.videos.length > 0) {
          setCategoryVideos(prev => {
            // Aggiorna la cache solo se i dati sono diversi
            const prevVideos = prev[catKey] || [];
            const isDifferent = JSON.stringify(prevVideos) !== JSON.stringify(data.videos);
            if (isDifferent) setCachedVideos(catKey, data.videos);
            return { ...prev, [catKey]: data.videos };
          });
          setFallbackActive(prev => ({ ...prev, [catKey]: false }));
        } else {
          // Fallback: video statici
          const fallback = [
            {
              id: 'aqz-KE-bpKQ',
              title: 'Big Buck Bunny',
              description: 'A short animated film by Blender Foundation',
              thumb: 'https://img.youtube.com/vi/aqz-KE-bpKQ/hqdefault.jpg',
              channel: 'Blender Foundation',
            },
            {
              id: 'eRsGyueVLvQ',
              title: 'Sintel',
              description: 'Another Blender Foundation open movie',
              thumb: 'https://img.youtube.com/vi/eRsGyueVLvQ/hqdefault.jpg',
              channel: 'Blender Foundation',
            },
            {
              id: 'R6MlUcmOul8',
              title: 'Tears of Steel',
              description: 'Blender Foundation sci-fi short',
              thumb: 'https://img.youtube.com/vi/R6MlUcmOul8/hqdefault.jpg',
              channel: 'Blender Foundation',
            },
            {
              id: 'SkVqJ1SGeL0',
              title: 'Caminandes 3: Llama Drama',
              description: 'Blender Foundation comedy short',
              thumb: 'https://img.youtube.com/vi/SkVqJ1SGeL0/hqdefault.jpg',
              channel: 'Blender Foundation',
            },
            {
              id: 'WhWc3b3KhnY',
              title: 'Spring',
              description: 'Blender Foundation fantasy short',
              thumb: 'https://img.youtube.com/vi/WhWc3b3KhnY/hqdefault.jpg',
              channel: 'Blender Foundation',
            },
          ];
          setCategoryVideos(prev => ({ ...prev, [catKey]: fallback }));
          setCachedVideos(catKey, fallback);
          setFallbackActive(prev => ({ ...prev, [catKey]: true }));
        }
        setCategoryLoading(prev => ({ ...prev, [catKey]: false }));
      })
      .catch(() => {
        // Fallback: video statici se errore di rete
        const fallback = [
          {
            id: 'aqz-KE-bpKQ',
            title: 'Big Buck Bunny',
            description: 'A short animated film by Blender Foundation',
            thumb: 'https://img.youtube.com/vi/aqz-KE-bpKQ/hqdefault.jpg',
            channel: 'Blender Foundation',
          },
          {
            id: 'eRsGyueVLvQ',
            title: 'Sintel',
            description: 'Another Blender Foundation open movie',
            thumb: 'https://img.youtube.com/vi/eRsGyueVLvQ/hqdefault.jpg',
            channel: 'Blender Foundation',
          },
          {
            id: 'R6MlUcmOul8',
            title: 'Tears of Steel',
            description: 'Blender Foundation sci-fi short',
            thumb: 'https://img.youtube.com/vi/R6MlUcmOul8/hqdefault.jpg',
            channel: 'Blender Foundation',
          },
          {
            id: 'SkVqJ1SGeL0',
            title: 'Caminandes 3: Llama Drama',
            description: 'Blender Foundation comedy short',
            thumb: 'https://img.youtube.com/vi/SkVqJ1SGeL0/hqdefault.jpg',
            channel: 'Blender Foundation',
          },
          {
            id: 'WhWc3b3KhnY',
            title: 'Spring',
            description: 'Blender Foundation fantasy short',
            thumb: 'https://img.youtube.com/vi/WhWc3b3KhnY/hqdefault.jpg',
            channel: 'Blender Foundation',
          },
        ];
        setCategoryVideos(prev => ({ ...prev, [catKey]: fallback }));
        setCachedVideos(catKey, fallback);
        setFallbackActive(prev => ({ ...prev, [catKey]: true }));
        setCategoryLoading(prev => ({ ...prev, [catKey]: false }));
      });
  };

  useEffect(() => {
    CATEGORIES.forEach(cat => {
      const cached = getCachedVideos(cat.key);
      if (cached) {
        setCategoryVideos(prev => ({ ...prev, [cat.key]: cached }));
        setCategoryLoading(prev => ({ ...prev, [cat.key]: false }));
        return;
      }
      refreshCategory(cat.key);
    });
  }, []);

  // Featured video - RIMOSSO
  // const featured = (categoryVideos[CATEGORIES[0].key] && categoryVideos[CATEGORIES[0].key][0]) || null;

  // Carica i preferiti dell'utente
  useEffect(() => {
    const session_token = localStorage.getItem('session_token');
    if (!session_token) return;
    fetch('http://localhost:8000/get_favorites.php', {
      headers: { 'Authorization': 'Bearer ' + session_token }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setFavorites(data.favorites || []);
      });
  }, []);

  const toggleFavorite = (video_id) => {
    const session_token = localStorage.getItem('session_token');
    if (!session_token) return;
    fetch('http://localhost:8000/toggle_favorite.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + session_token },
      body: JSON.stringify({ video_id })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setFavorites(favs => data.favorited ? [...favs, video_id] : favs.filter(f => f !== video_id));
        }
      });
  };

  // useMemo per i video filtrati
  const filteredCategoryVideos = useMemo(() => {
    const result = {};
    CATEGORIES.forEach(cat => {
      if (!search) {
        result[cat.key] = categoryVideos[cat.key] || [];
      } else {
        const lower = search.toLowerCase();
        result[cat.key] = (categoryVideos[cat.key] || []).filter(v =>
          v.title.toLowerCase().includes(lower) || (v.description || '').toLowerCase().includes(lower)
        );
      }
    });
    return result;
  }, [search, categoryVideos]);

  // Recently watched videos (from localStorage, filtered by loaded videos)
  let recent = [];
  try {
    recent = JSON.parse(localStorage.getItem('recent') || '[]');
  } catch { recent = []; }
  const allLoadedVideos = Object.values(categoryVideos).flat();
  const recentVideos = recent.map(id => allLoadedVideos.find(v => v && v.id === id)).filter(Boolean);

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
        
        {/* Hero Section RIMOSSA - solo questa parte è stata rimossa */}
        {/* {featured && (
          <FeaturedSection>
            <FeaturedVideo
              as="iframe"
              src={`https://www.youtube.com/embed/${featured.id}?autoplay=1&mute=1&loop=1&playlist=${featured.id}&controls=0&showinfo=0&modestbranding=1&rel=0`}
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
        )} */}

        {loading ? (
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'220px'}}>
            <Spinner />
            <div style={{color:'#ffe066',fontWeight:700,fontSize:'1.2rem',marginTop:'1rem'}}>Loading...</div>
          </div>
        ) : (
          <>
            {/* Search bar */}
            <SearchBar>
              <FaSearch />
              <SearchInput
                placeholder="Search for a video..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button onClick={()=>setSearch('')} style={{background:'none',border:'none',color:'#fff',fontSize:18,cursor:'pointer',marginLeft:4}} aria-label="Clear search">×</button>
              )}
            </SearchBar>

            {/* Dynamic video sections by category */}
            {CATEGORIES.map(cat => (
              <SectionWrapper key={cat.key}>
                <SectionTitle>{cat.label}</SectionTitle>
                {fallbackActive[cat.key] && (
                  <div style={{color:'#ffe066',fontWeight:700,marginBottom:8}}>You are seeing example videos due to API limits.</div>
                )}
                <button onClick={() => refreshCategory(cat.key)} style={{marginLeft:12,marginBottom:8,padding:'0.3rem 1.1rem',borderRadius:12,border:'1.5px solid #A35C7A',background:'#232336',color:'#fff',cursor:'pointer',fontWeight:600}}>Refresh</button>
                {categoryLoading[cat.key] ? (
                  <Row>
                    {[...Array(5)].map((_, i) => (
                      <SkeletonCard key={i}>
                        <SkeletonThumb />
                        <SkeletonText />
                        <SkeletonTextSmall />
                      </SkeletonCard>
                    ))}
                  </Row>
                ) : categoryError[cat.key] ? (
                  <div style={{color:'#ff5252',fontWeight:700}}>{categoryError[cat.key]}</div>
                ) : filteredCategoryVideos[cat.key] && filteredCategoryVideos[cat.key].length > 0 ? (
                  <Row>
                    {filteredCategoryVideos[cat.key].map(video => (
                      <GlassCardLink
                        key={video.id}
                        to={`/video/${video.id}`}
                        state={{ video }}
                        className={favorites.includes(video.id) ? 'favorite' : ''}
                        tabIndex={0}
                        style={{outline:'none'}}
                      >
                        <ThumbWrapper>
                          <Thumb src={video.thumb} alt={`Thumbnail for ${video.title} by ${video.channel}`} />
                        </ThumbWrapper>
                        <CardInfo>
                          <CardTitle>{video.title}</CardTitle>
                          <CardChannel>{video.channel}</CardChannel>
                          <HeartBtn onClick={e => { e.stopPropagation(); toggleFavorite(video.id); }}>
                            {favorites.includes(video.id)
                              ? <FaHeart style={{ color: '#e1306c' }} />
                              : <FaRegHeart style={{ color: '#fff' }} />}
                          </HeartBtn>
                        </CardInfo>
                      </GlassCardLink>
                    ))}
                  </Row>
                ) : (
                  <div style={{color:'#aaa'}}>No videos found.</div>
                )}
              </SectionWrapper>
            ))}

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
                          onClick={() => handleCardClick(video.id)}
                        >
                          <ThumbWrapper>
                            <Thumb src={video.thumb} alt={`Thumbnail for ${video.title} by ${video.channel}`} />
                          </ThumbWrapper>
                          <CardInfo>
                            <CardTitle>{highlightText(video.title, search)}</CardTitle>
                            <CardChannel>{video.channel}</CardChannel>
                            <HeartBtn onClick={e => { e.stopPropagation(); toggleFavorite(video.id); }}>
                              {favorites.includes(video.id)
                                ? <FaHeart style={{ color: '#e1306c' }} />
                                : <FaRegHeart style={{ color: '#fff' }} />}
                            </HeartBtn>
                          </CardInfo>
                        </GlassCardLink>
                      ))}
                    </Row>
                  </SectionBg>
                </AnimatedSection>
              </SectionWrapper>
            )}
            {/* No videos found message for search */}
            {CATEGORIES.every(cat => filteredCategoryVideos[cat.key].length === 0) && (
              <div style={{textAlign:'center',color:'#aaa',margin:'2.5rem 0',fontSize:'1.2rem'}}>No videos found</div>
            )}
          </>
        )}
        {loggedIn && (
          <div style={{textAlign: 'center', margin: '2rem 0'}}>
            <button style={{padding: '0.8rem 2rem', fontSize: '1.1rem', borderRadius: 18, background: '#A35C7A', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, boxShadow: '0 2px 12px #A35C7A33', marginRight: '1rem'}}
              onClick={() => navigate('/profile')}
            >
              Il Mio Profilo
            </button>
            <button style={{padding: '0.8rem 2rem', fontSize: '1.1rem', borderRadius: 18, background: '#C63C51', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, boxShadow: '0 2px 12px #C63C5133'}}
              onClick={() => setShowModal(true)}
            >
              Info Utente
            </button>
          </div>
        )}
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
          <ScrollTopBtn onClick={scrollToTop} title="Back to top">↑</ScrollTopBtn>
        )}
      </AppFade>
    </>
  );
}

export default Home; 