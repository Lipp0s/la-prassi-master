# Configurazione Google Sign-In per BOIOLAX

## Il sistema è stato ripristinato per usare Google Sign-In JavaScript SDK

### Cosa è stato fatto:
1. ✅ Aggiunto lo script Google Sign-In al file `public/index.html`
2. ✅ Aggiunto il provider Google OAuth al file `src/App.js`
3. ✅ Ripristinato i componenti GoogleLogin in `src/Login.js` e `src/Register.js`
4. ✅ Il file `backend/google-auth.php` è già configurato per ricevere i token JWT

### Cosa devi fare:

#### 1. Ottieni le credenziali Google OAuth
1. Vai su [Google Cloud Console](https://console.developers.google.com/)
2. Seleziona il tuo progetto esistente
3. Vai su "APIs & Services" > "Credentials"
4. Trova il tuo "OAuth 2.0 Client ID" esistente o creane uno nuovo
5. Copia il **Client ID**

#### 2. Configura il Client ID
Modifica il file `src/App.js` e sostituisci:
```javascript
<GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
```
con:
```javascript
<GoogleOAuthProvider clientId="IL_TUO_CLIENT_ID_QUI">
```

#### 3. Configura gli URI di reindirizzamento
Nel tuo progetto Google Cloud Console, aggiungi questi URI autorizzati:
- `http://localhost:3000`
- `http://localhost:3000/`
- Se usi ngrok: `https://your-ngrok-url.ngrok-free.app`

#### 4. Testa il sistema
1. Avvia il server React: `npm start`
2. Avvia il server PHP: `php -S localhost:8000 -t backend`
3. Vai su `http://localhost:3000/login`
4. Clicca su "Accedi con Google"

### Come funziona ora:
- Il sistema usa Google Sign-In JavaScript SDK
- Quando l'utente clicca "Accedi con Google", si apre il popup di Google
- Google invia un token JWT al frontend
- Il frontend invia il token al backend (`google-auth.php`)
- Il backend verifica il token e crea/aggiorna l'utente nel database
- L'utente viene reindirizzato alla home page

### Vantaggi di questo sistema:
- ✅ Più sicuro (token JWT verificati da Google)
- ✅ Migliore UX (popup nativo di Google)
- ✅ Funziona sia per login che registrazione automaticamente
- ✅ Supporta One Tap login

### Risoluzione problemi:
- **Errore "popup_closed_by_user"**: L'utente ha chiuso il popup
- **Errore "access_denied"**: L'utente ha negato i permessi
- **Errore "invalid_client"**: Client ID non configurato correttamente
- **Pagina bianca**: Controlla la console del browser per errori JavaScript 