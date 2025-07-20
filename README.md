# BOIOLAX - Video Review Platform

## Features
- Video dinamici da YouTube per categoria (trailers, gameplay, tutorial)
- Recensioni e rating per ogni video
- Preferiti sincronizzati per utente
- Profilo pubblico e nickname personalizzabile
- Caricamento e modifica immagine profilo
- Media rating per ogni film
- Notifiche toast per azioni utente
- Validazioni front-end robuste
- UI moderna, responsive, accessibile
- Easter egg nascosto (cerca "Boia de"!)

---

## ⚡️ Sviluppo

### 1. Configurazione variabili d'ambiente
- Crea un file `.env` nella root del progetto React con:
  ```
  REACT_APP_API_URL=http://localhost:8000
  REACT_APP_GOOGLE_CLIENT_ID=la-tua-google-client-id.apps.googleusercontent.com
  ```
- **Non committare mai il file `.env` su GitHub!**

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
- Vai su Supabase → Table Editor → favorites/reviews → "RLS" → "Enable RLS"
- Aggiungi policy per favorites/reviews:
  ```sql
  (user_id = auth.uid())
  ```

---

## 🚀 Produzione
- Usa una API key YouTube con quota aumentata
- Attiva sempre le RLS su Supabase
- Usa HTTPS per frontend e backend
- Configura CORS in produzione
- Aggiorna le origini autorizzate su Google Cloud Console per OAuth

---

## 🛠️ Debug & Polish Checklist
- [ ] Preferiti, recensioni e profilo funzionano per ogni utente
- [ ] Il player mostra sempre i controlli e parte correttamente
- [ ] UI responsive e accessibile (focus visibile, alt text descrittivo)
- [ ] Messaggi d’errore chiari e UX sempre fluida
- [ ] Nessun errore/warning in console

---

## 📦 Dipendenze principali
- React
- styled-components
- react-router-dom
- react-player
- sonner (notifiche toast)
- PHP (>=7.4)
- Supabase (PostgreSQL)

---

## Sicurezza & Best Practice
- **Non committare mai file `.env` o chiavi segrete su GitHub!**
- Le chiavi API e OAuth devono essere solo in `.env` (già ignorato da `.gitignore`).
- Se hai committato una chiave per errore, rigenera la chiave e rimuovila dalla cronologia git.

---

## Environment Configuration for API URL & Google OAuth

Per far funzionare il frontend con il backend e Google OAuth, configura il file `.env`:

```
REACT_APP_API_URL=http://localhost:8000
REACT_APP_GOOGLE_CLIENT_ID=la-tua-google-client-id.apps.googleusercontent.com
```

### Esempi di configurazione

#### 1. Sviluppo locale (solo PC)
```
REACT_APP_API_URL=http://localhost:8000
```

#### 2. Accesso da mobile sulla stessa rete (usando l'IP del PC)
```
REACT_APP_API_URL=http://192.168.0.52:8000
```

#### 3. Accesso pubblico/mobile tramite ngrok
- Avvia ngrok: `ngrok http 8000`
- Usa l'URL fornito da ngrok, ad esempio:
```
REACT_APP_API_URL=https://abcd1234.ngrok.io
```

**Nota:**
- Ricordati di aggiornare anche Google Cloud Console con il dominio ngrok tra le origini autorizzate per OAuth.
- Puoi anche creare un file `.env` nella root del progetto React con le variabili sopra e poi lanciare `npm start` normalmente. 