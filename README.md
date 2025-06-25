# Backend Sicuro per Login e Registrazione

## 1. Configurazione variabili d'ambiente

Crea un file `.env` nella cartella `backend/` con il seguente contenuto (modifica le credenziali secondo il tuo ambiente):

```
DB_HOST=127.0.0.1
DB_NAME=la_prassi
DB_USER=root
DB_PASS=
```

Per caricare le variabili d'ambiente in locale puoi usare:

```bash
export $(cat backend/.env | xargs)
```

## 2. Creazione database e tabella

Accedi a MySQL e lancia:

```sql
CREATE DATABASE la_prassi;
USE la_prassi;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);
```

## 3. Avvio backend PHP

```bash
php -S localhost:8000 -t backend
```

## 4. Frontend

Assicurati che le chiamate fetch puntino a `http://localhost:8000/register.php` e `http://localhost:8000/login.php`. 