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

// Recupera il token dalla Authorization header
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
if (!isset($data['video_id']) || !$data['video_id']) {
    echo json_encode(["success" => false, "error" => "Missing or invalid video_id"]);
    exit;
}

try {
    // Valida il token e recupera user_id
    $stmt = $conn->prepare("SELECT user_id FROM sessions WHERE session_token = :token AND (expires_at IS NULL OR expires_at > NOW())");
    $stmt->bindParam(":token", $token, PDO::PARAM_STR);
    $stmt->execute();
    $session = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$session) {
        echo json_encode(["success" => false, "error" => "Invalid or expired session"]);
        exit;
    }
    $user_id = $session['user_id'];
    $video_id = $data['video_id'];

    // Controlla se già nei preferiti
    $stmt2 = $conn->prepare("SELECT id FROM favorites WHERE user_id = :user_id AND video_id = :video_id");
    $stmt2->bindParam(":user_id", $user_id, PDO::PARAM_INT);
    $stmt2->bindParam(":video_id", $video_id, PDO::PARAM_STR);
    $stmt2->execute();
    $fav = $stmt2->fetch(PDO::FETCH_ASSOC);

    if ($fav) {
        // Se già preferito, rimuovi
        $stmt3 = $conn->prepare("DELETE FROM favorites WHERE id = :id");
        $stmt3->bindParam(":id", $fav['id'], PDO::PARAM_INT);
        $stmt3->execute();
        echo json_encode(["success" => true, "favorited" => false]);
    } else {
        // Altrimenti aggiungi
        $stmt3 = $conn->prepare("INSERT INTO favorites (user_id, video_id) VALUES (:user_id, :video_id)");
        $stmt3->bindParam(":user_id", $user_id, PDO::PARAM_INT);
        $stmt3->bindParam(":video_id", $video_id, PDO::PARAM_STR);
        $stmt3->execute();
        echo json_encode(["success" => true, "favorited" => true]);
    }
} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => "Database error: " . $e->getMessage()]);
}
?>