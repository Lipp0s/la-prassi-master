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
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php_errors.log');
header("Content-Type: application/json");

include 'db.php';

// --- AUTENTICAZIONE SESSIONE ---
$headers = getallheaders();
$auth = isset($headers['Authorization']) ? $headers['Authorization'] : (isset($headers['authorization']) ? $headers['authorization'] : null);

if (!$auth || !preg_match('/Bearer\s+(\S+)/i', $auth, $matches)) {
    http_response_code(401);
    echo json_encode(["success" => false, "error" => "Missing or invalid Authorization header"]);
    exit();
}

$session_token = $matches[1];
$stmt = $conn->prepare("SELECT s.user_id FROM sessions s WHERE s.session_token = :token");
$stmt->execute([':token' => $session_token]);
$session = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$session) {
    http_response_code(401);
    echo json_encode(["success" => false, "error" => "Invalid session token"]);
    exit();
}

$user_id = $session['user_id'];

try {
    $sql = "SELECT r.id, r.rating, r.comment, r.created_at, r.video_id, r.user_id 
            FROM reviews r 
            WHERE r.user_id = :user_id 
            ORDER BY r.created_at DESC";
    
    $stmt = $conn->prepare($sql);
    $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->execute();
    
    $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        "success" => true, 
        "reviews" => $reviews
    ]);
    
} catch (PDOException $e) {
    error_log("Database error in get_my_reviews: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        "success" => false, 
        "error" => "Database error: " . $e->getMessage()
    ]);
}
?> 