<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

echo "<h1>Test Connessione Database Supabase</h1>";

// Include configuration
require_once __DIR__ . '/config.php';

echo "<h2>Configurazione:</h2>";
echo "<p><strong>Host:</strong> " . DB_HOST . "</p>";
echo "<p><strong>Database:</strong> " . DB_NAME . "</p>";
echo "<p><strong>User:</strong> " . DB_USER . "</p>";
echo "<p><strong>Port:</strong> " . DB_PORT . "</p>";
echo "<p><strong>Password:</strong> " . (empty(DB_PASS) ? "NON IMPOSTATA" : "Impostata") . "</p>";

if (empty(DB_PASS)) {
    echo "<h2 style='color: red;'>ERRORE: Password del database non impostata!</h2>";
    echo "<p>Aggiorna il file config.php con la password corretta.</p>";
    exit;
}

// Test PostgreSQL connection
try {
    $dsn = "pgsql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME;
    $conn = new PDO($dsn, DB_USER, DB_PASS);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "<h2 style='color: green;'>✅ Connessione al database riuscita!</h2>";
    
    // Test query
    $stmt = $conn->query("SELECT version()");
    $version = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "<p><strong>Versione PostgreSQL:</strong> " . $version['version'] . "</p>";
    
    // Check if users table exists
    $stmt = $conn->query("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users')");
    $tableExists = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($tableExists['exists']) {
        echo "<p style='color: green;'>✅ Tabella 'users' esiste</p>";
        
        // Count users
        $stmt = $conn->query("SELECT COUNT(*) as count FROM users");
        $count = $stmt->fetch(PDO::FETCH_ASSOC);
        echo "<p><strong>Numero utenti nel database:</strong> " . $count['count'] . "</p>";
    } else {
        echo "<p style='color: orange;'>⚠️ Tabella 'users' non esiste</p>";
    }
    
} catch(PDOException $e) {
    echo "<h2 style='color: red;'>❌ Errore di connessione:</h2>";
    echo "<p>" . $e->getMessage() . "</p>";
}
?> 