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
    password TEXT NOT NULL,
    email TEXT
)");

// Ensure email, is_verified, and verification_token columns exist
$columns = [];
foreach ($conn->query("PRAGMA table_info(users)") as $column) {
    $columns[] = $column['name'];
}
if (!in_array('email', $columns)) {
    $conn->exec("ALTER TABLE users ADD COLUMN email TEXT");
}
if (!in_array('is_verified', $columns)) {
    $conn->exec("ALTER TABLE users ADD COLUMN is_verified INTEGER DEFAULT 0");
}
if (!in_array('verification_token', $columns)) {
    $conn->exec("ALTER TABLE users ADD COLUMN verification_token TEXT");
}
?> 