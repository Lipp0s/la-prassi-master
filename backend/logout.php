<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header("Content-Type: application/json");
include 'db.php';

// Recupera il token dalla Authorization header o da query param
$token = null;
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    $auth = $_SERVER['HTTP_AUTHORIZATION'];
    if (stripos($auth, 'Bearer ') === 0) {
        $token = substr($auth, 7);
    }
}
if (!$token && isset($_GET['session_token'])) {
    $token = $_GET['session_token'];
}
if (!$token) {
    echo json_encode(["success" => false, "error" => "Missing session token"]);
    exit;
}

try {
    $stmt = $conn->prepare("DELETE FROM sessions WHERE session_token = :token");
    $stmt->bindParam(":token", $token, PDO::PARAM_STR);
    $stmt->execute();
    echo json_encode(["success" => true, "message" => "Logged out"]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => "Database error: " . $e->getMessage()]);
}
?> 