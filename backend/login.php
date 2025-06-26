<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
include 'db.php';

$data = json_decode(file_get_contents("php://input"));
if (!isset($data->username) || !isset($data->password)) {
    echo json_encode(["success" => false, "error" => "Missing fields"]);
    exit;
}
$username = trim($data->username);
$password = $data->password;

$stmt = $conn->prepare("SELECT * FROM users WHERE username = :user OR email = :user");
$stmt->bindValue(":user", $username, SQLITE3_TEXT);
$result = $stmt->execute();
$user = $result->fetchArray(SQLITE3_ASSOC);

if ($user && password_verify($password, $user['password'])) {
    if (!$user['is_verified']) {
        echo json_encode(["success" => false, "error" => "Email non verificata!"]);
        exit;
    }
    // Genera token di sessione random
    $token = bin2hex(random_bytes(32));
    $expires = time() + 60*60*24*7; // 7 giorni
    $stmt2 = $conn->prepare("INSERT INTO sessions (token, username, expires_at) VALUES (:token, :username, :expires)");
    $stmt2->bindValue(":token", $token, SQLITE3_TEXT);
    $stmt2->bindValue(":username", $user['username'], SQLITE3_TEXT);
    $stmt2->bindValue(":expires", $expires, SQLITE3_INTEGER);
    $stmt2->execute();
    setcookie('session_token', $token, [
        'expires' => $expires,
        'path' => '/',
        'secure' => true,
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
    echo json_encode(["success" => true, "username" => $user['username']]);
    exit;
} else {
    echo json_encode(["success" => false, "error" => "Invalid credentials"]);
}
$stmt->close();
$conn->close();
?> 