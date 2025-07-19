<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header("Content-Type: application/json");
include 'db.php';

$data = json_decode(file_get_contents("php://input"), true);
$token = null;
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    $auth = $_SERVER['HTTP_AUTHORIZATION'];
    if (stripos($auth, 'Bearer ') === 0) {
        $token = substr($auth, 7);
    }
}
if (!$token && isset($data['session_token'])) {
    $token = $data['session_token'];
}
if (!$token) {
    echo json_encode(["success" => false, "error" => "Missing session token"]);
    exit;
}
if (!isset($data['rating']) || !is_numeric($data['rating']) || $data['rating'] < 1 || $data['rating'] > 5) {
    echo json_encode(["success" => false, "error" => "Invalid rating"]);
    exit;
}
if (!isset($data['video_id']) || !$data['video_id']) {
    echo json_encode(["success" => false, "error" => "Missing or invalid video_id"]);
    exit;
}
$comment = isset($data['comment']) ? trim($data['comment']) : null;
$video_id = $data['video_id'];

// DEBUG LOG
error_log('Ricevuto token: ' . $token);
error_log('Ora server PHP: ' . date('Y-m-d H:i:s'));

try {
    // Valida il token e recupera user_id
    $sql = "SELECT user_id FROM sessions WHERE session_token = :token AND (expires_at IS NULL OR expires_at > NOW())";
    error_log('Query validazione: ' . $sql);
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(":token", $token, PDO::PARAM_STR);
    $stmt->execute();
    $session = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$session) {
        echo json_encode(["success" => false, "error" => "Invalid or expired session"]);
        exit;
    }
    $user_id = $session['user_id'];
    // Inserisci la recensione
    $stmt2 = $conn->prepare("INSERT INTO reviews (user_id, video_id, rating, comment) VALUES (:user_id, :video_id, :rating, :comment)");
    $stmt2->bindParam(":user_id", $user_id, PDO::PARAM_INT);
    $stmt2->bindParam(":video_id", $video_id, PDO::PARAM_STR);
    $stmt2->bindParam(":rating", $data['rating'], PDO::PARAM_INT);
    $stmt2->bindParam(":comment", $comment, PDO::PARAM_STR);
    $stmt2->execute();
    echo json_encode(["success" => true, "message" => "Review added!"]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => "Database error: " . $e->getMessage()]);
}
?> 