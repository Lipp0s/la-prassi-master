import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
// import logo from './logo.svg';
const logo = process.env.PUBLIC_URL + '/logo192.png';

const Accent = '#A35C7A';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
`;

const Glass = styled.div`
  background: rgba(30, 30, 40, 0.82);
  box-shadow: 0 8px 32px 0 #A35C7A33, 0 2px 12px #000a;
  border-radius: 24px;
  padding: 2.5rem 2.5rem 2rem 2.5rem;
  min-width: 340px;
  max-width: 94vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  backdrop-filter: blur(12px) saturate(1.2);
  position: relative;
`;

const Logo = styled.img`
  width: 64px;
  height: 64px;
  margin-bottom: 1.2rem;
  filter: drop-shadow(0 2px 12px #A35C7A88);
`;

const Title = styled.h2`
  color: #fff;
  font-size: 2rem;
  font-weight: 900;
  margin-bottom: 2rem;
  letter-spacing: 0.04em;
  text-align: center;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const Input = styled.input`
  padding: 0.9rem 1.2rem;
  border-radius: 12px;
  border: none;
  background: rgba(255,255,255,0.08);
  color: #fff;
  font-size: 1.1rem;
  outline: none;
  box-shadow: 0 2px 8px #0003;
  transition: background 0.2s, box-shadow 0.2s;
  &:focus {
    background: rgba(255,255,255,0.16);
    box-shadow: 0 4px 16px #A35C7A44;
  }
`;

const Button = styled.button`
  background: linear-gradient(90deg, #A35C7A 0%, #7B3F61 100%);
  color: #fff;
  font-size: 1.2rem;
  font-weight: bold;
  border: none;
  border-radius: 32px;
  padding: 0.9rem 0;
  margin-top: 0.5rem;
  box-shadow: 0 2px 12px #A35C7A55;
  cursor: pointer;
  transition: background 0.32s, transform 0.32s, box-shadow 0.32s;
  outline: none;
  letter-spacing: 0.04em;
  &:hover {
    background: linear-gradient(90deg, #7B3F61 0%, #A35C7A 100%);
    transform: scale(1.04);
    box-shadow: 0 4px 24px #A35C7A99;
  }
`;

const BottomText = styled.div`
  color: #bbb;
  font-size: 1rem;
  margin-top: 1.5rem;
  text-align: center;
`;

const FadeIn = styled.div`
  animation: fadeInLogin 0.8s cubic-bezier(.4,2,.6,1);
  @keyframes fadeInLogin {
    from { opacity: 0; transform: translateY(32px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
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
  padding: 0.5rem 1.3rem;
  box-shadow: 0 2px 12px #A35C7A33, 0 2px 8px #000a;
  cursor: pointer;
  z-index: 2;
  transition: background 0.22s, box-shadow 0.22s, color 0.22s, transform 0.22s;
  &:hover, &:focus {
    background: linear-gradient(120deg, #A35C7A 0%, #7B3F61 100%);
    color: #fff;
    box-shadow: 0 4px 24px #A35C7A55, 0 2px 12px #000a;
    outline: none;
    transform: scale(1.08);
  }
`;

function Login() {
  console.log('Render Login.js');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('handleSubmit chiamato');
    if (!username || !password) {
      setMessage("Username and password are required!");
      return;
    }
    if (password.length < 6) {
      setMessage("Password must be at least 6 characters!");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("http://localhost:8000/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      console.log('Risposta login:', data); // LOG DI DEBUG
      if (data.success) {
        setMessage("Login successful! Redirecting...");
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("username", username);
        if (data.session_token) {
          localStorage.setItem("session_token", data.session_token);
        }
        setTimeout(() => navigate("/"), 1200);
      } else {
        setMessage("Login failed: " + data.error);
      }
    } catch (err) {
      setMessage("Login failed: Network error");
    }
    setLoading(false);
  };

  return (
    <Container>
      <FadeIn>
        <Glass>
          <BackBtn onClick={() => navigate(-1)} aria-label="Back">← Back</BackBtn>
          <Logo src={logo} alt="BOIOLAX logo" />
          <Title>Sign In to <span style={{background: 'linear-gradient(90deg, #A35C7A 0%, #7B3F61 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 900}}>BOIOLAX</span></Title>
          <Form onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoFocus
              disabled={loading}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <Button type="submit" disabled={loading}>{loading ? "Signing In..." : "Sign In"}</Button>
            {message && <div style={{ color: message.startsWith("Login successful") ? "#4caf50" : "#ff5252", marginTop: 10, textAlign: "center" }}>{message}</div>}
          </Form>
          <div style={{ width: '100%', margin: '18px 0 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <GoogleLogin
              onSuccess={async credentialResponse => {
                setMessage('Login Google in corso...');
                try {
                  const res = await fetch('http://localhost:8000/google-auth.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ credential: credentialResponse.credential })
                  });
                  const data = await res.json();
                  if (data.success) {
                    setMessage('Login Google riuscito!');
                    localStorage.setItem('loggedIn', 'true');
                    localStorage.setItem('username', data.user.username);
                    if (data.session_token) {
                      localStorage.setItem("session_token", data.session_token);
                    }
                    setTimeout(() => navigate('/'), 1200);
                  } else {
                    setMessage('Login Google fallito: ' + data.error);
                  }
                } catch (err) {
                  setMessage('Login Google fallito: Network error');
                }
              }}
              onError={() => {
                setMessage('Errore nel login con Google');
              }}
              width="260"
            />
          </div>
          <BottomText>
            New to BOIOLAX? <Link to="/register" style={{ color: Accent, textDecoration: 'none', fontWeight: 700 }}>Create an account</Link>
          </BottomText>
        </Glass>
      </FadeIn>
    </Container>
  );
}

export default Login; 