<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
include 'db.php';

$token = isset($_COOKIE['session_token']) ? $_COOKIE['session_token'] : '';
if (!$token) {
    echo json_encode(["success" => false, "error" => "No token"]);
    exit;
}
$stmt = $conn->prepare("DELETE FROM sessions WHERE token = :token");
$stmt->bindValue(":token", $token, SQLITE3_TEXT);
$stmt->execute();
setcookie('session_token', '', [
    'expires' => time() - 3600,
    'path' => '/',
    'secure' => true,
    'httponly' => true,
    'samesite' => 'Strict',
]);
echo json_encode(["success" => true]); 