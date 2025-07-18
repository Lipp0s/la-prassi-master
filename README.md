# BOIOLAX - Video Review Platform

## Features
- Video dinamici da YouTube per categoria (trailers, gameplay, tutorial)
- Recensioni e rating per ogni video
- Preferiti sincronizzati per utente
- Cache locale intelligente per risparmiare quota API
- Fallback automatico a video statici se la quota API è esaurita
- UI moderna, responsive, accessibile

---

## ⚡️ Sviluppo

### 1. Configurazione YouTube API Key
- Crea una API key su Google Cloud Console
- Abilita la YouTube Data API v3
- Inserisci la chiave in `backend/youtube_videos.php`:
  ```php
  $API_KEY = 'LA_TUA_API_KEY';
  ```

### 2. Avvio Backend
- Avvia il server PHP nella cartella backend:
  ```bash
  php -S localhost:8000 -t backend
  ```

### 3. Avvio Frontend
- Installa le dipendenze:
  ```bash
  npm install
  ```
- Avvia React:
  ```bash
  npm start
  ```

### 4. Supabase: Attiva Row-Level Security (RLS)
- Vai su Supabase → Table Editor → favorites → "RLS" → "Enable RLS"
- Aggiungi policy per favorites:
  - Solo l’utente può vedere i propri preferiti:
    ```sql
    (user_id = auth.uid())
    ```
  - Solo l’utente può inserire/rimuovere i propri preferiti:
    ```sql
    (user_id = auth.uid())
    ```
- Ripeti per la tabella reviews:
  - Policy:
    ```sql
    (user_id = auth.uid())
    ```

---

## 🚀 Produzione
- Usa una API key YouTube con quota aumentata (richiedi aumento su Google Cloud)
- Attiva sempre le RLS su Supabase
- Usa HTTPS per frontend e backend
- Configura CORS in produzione

---

## 🛠️ Debug & Polish Checklist
- [ ] Preferiti e recensioni funzionano per ogni utente
- [ ] Il player mostra sempre i controlli e parte correttamente
- [ ] La cache locale funziona e si aggiorna solo se i dati cambiano
- [ ] Il fallback ai video statici scatta solo se la quota API è esaurita o la fetch fallisce
- [ ] Il bottone Refresh aggiorna la cache e la UI
- [ ] Nessun errore/warning in console
- [ ] UI responsive e accessibile (focus visibile, alt text descrittivo)
- [ ] Messaggi d’errore chiari e UX sempre fluida

---

## 📦 Dipendenze principali
- React
- styled-components
- react-router-dom
- react-player
- PHP (>=7.4)
- Supabase (PostgreSQL)

---

## Note
- Per sviluppo, la quota API YouTube è limitata: usa la cache e il fallback per non bloccare la UX.
- In produzione, monitora la quota e ottimizza le fetch. 