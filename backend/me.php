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
$stmt = $conn->prepare("SELECT username, expires_at FROM sessions WHERE token = :token");
$stmt->bindValue(":token", $token, SQLITE3_TEXT);
$res = $stmt->execute();
$row = $res->fetchArray(SQLITE3_ASSOC);
if (!$row || $row['expires_at'] < time()) {
    echo json_encode(["success" => false, "error" => "Invalid or expired token"]);
    exit;
}
echo json_encode(["success" => true, "username" => $row['username']]); 