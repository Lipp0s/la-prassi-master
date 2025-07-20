<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Include configuration
require_once __DIR__ . '/config.php';

// PostgreSQL connection with SSL
try {
    $dsn = "pgsql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";sslmode=" . DB_SSL_MODE;
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];
    
    $conn = new PDO($dsn, DB_USER, DB_PASS, $options);

    // Create users table if it doesn't exist
$conn->exec("CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        verification_token VARCHAR(255),
        is_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    
} catch(PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

// Ensure users table has nickname and profile_picture_url columns
try {
    $conn->exec("ALTER TABLE users ADD COLUMN nickname TEXT UNIQUE NOT NULL");
} catch (Exception $e) {}
try {
    $conn->exec("ALTER TABLE users ADD COLUMN profile_picture_url TEXT");
} catch (Exception $e) {}

try {
    $conn->exec("ALTER TABLE users ALTER COLUMN nickname DROP NOT NULL");
} catch (Exception $e) {}

// Crea la tabella movies se non esiste
try {
    $conn->exec("CREATE TABLE IF NOT EXISTS movies (
        id INTEGER PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        overview TEXT,
        poster_url TEXT,
        release_date DATE,
        vote_average FLOAT,
        trailer_id VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
} catch (Exception $e) {}

$db = $conn;
?> 