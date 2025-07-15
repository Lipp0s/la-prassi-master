#!/bin/bash

# Avvia backend PHP su porta 8000 servendo la cartella backend, ascoltando su tutte le interfacce
php -S 0.0.0.0:8000 -t backend > backend-php.log 2>&1 &
BACKEND_PID=$!
echo "[PHP] Backend avviato su http://0.0.0.0:8000 (PID $BACKEND_PID)"
echo "[PHP] Puoi accedere da altri dispositivi su: http://<IP-DEL-PC>:8000"

# Avvia frontend React se package.json esiste
if [ -f package.json ]; then
  echo "[React] Avvio frontend su http://localhost:3000 ..."
  npm start
elif [ -f src/package.json ]; then
  echo "[React] Avvio frontend su http://localhost:3000 ..."
  npm start --prefix src
else
  echo "[React] Nessun frontend React trovato!"
fi

# Quando chiudi lo script, termina anche il backend PHP
trap "kill $BACKEND_PID" EXIT