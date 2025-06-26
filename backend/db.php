<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$db_file = __DIR__ . '/users.db';
$conn = new SQLite3($db_file);

// Create table if it doesn't exist
$conn->exec("CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    verification_token TEXT,
    is_verified INTEGER DEFAULT 0
)");
?> 