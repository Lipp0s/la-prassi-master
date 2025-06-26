import React, { useEffect, useState } from 'react';

const VerifyEmail = () => {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Token mancante.');
      return;
    }
    fetch('http://localhost:8000/verify-email.php?token=' + token)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStatus('success');
          setMessage(data.message || 'Email verificata! Ora puoi accedere.');
        } else {
          setStatus('error');
          setMessage(data.error || 'Errore nella verifica.');
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('Errore di rete.');
      });
  }, []);

  return (
    <div style={{maxWidth: 480, margin: '6rem auto', background: '#232336', color: '#fff', padding: '2.5rem 2rem', borderRadius: 18, boxShadow: '0 2px 12px #0008', textAlign: 'center'}}>
      <h2>Verifica Email</h2>
      {status === 'loading' && <p>Verifica in corso...</p>}
      {status !== 'loading' && <p>{message}</p>}
      {status === 'success' && <a href="/login" style={{color:'#A35C7A', fontWeight:700, textDecoration:'underline'}}>Vai al login</a>}
    </div>
  );
};

export default VerifyEmail; 