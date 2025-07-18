<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header("Content-Type: application/json");
include 'db.php';

// Recupera il token dalla Authorization header
$headers = getallheaders();
$auth = isset($headers['Authorization']) ? $headers['Authorization'] : (isset($headers['authorization']) ? $headers['authorization'] : null);
if (!$auth || !preg_match('/Bearer\s+(\S+)/i', $auth, $matches)) {
    http_response_code(401);
    echo json_encode(["success" => false, "error" => "Missing or invalid Authorization header"]);
    exit();
}
$session_token = $matches[1];
$stmt = $conn->prepare("SELECT user_id FROM sessions WHERE session_token = :token AND (expires_at IS NULL OR expires_at > NOW())");
$stmt->execute([':token' => $session_token]);
$session = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$session) {
    http_response_code(401);
    echo json_encode(["success" => false, "error" => "Invalid session token"]);
    exit();
}
$user_id = $session['user_id'];

$stmt2 = $conn->prepare("SELECT video_id FROM favorites WHERE user_id = :user_id");
$stmt2->bindParam(":user_id", $user_id, PDO::PARAM_INT);
$stmt2->execute();
$favorites = $stmt2->fetchAll(PDO::FETCH_COLUMN);
echo json_encode(["success" => true, "favorites" => $favorites]); 