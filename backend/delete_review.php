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

// --- VALIDAZIONE INPUT ---
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['review_id']) || !is_numeric($input['review_id'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Missing or invalid review_id"]);
    exit();
}

$review_id = (int)$input['review_id'];

try {
    // Verifica che la recensione appartenga all'utente
    $stmt = $conn->prepare("SELECT id FROM reviews WHERE id = :review_id AND user_id = :user_id");
    $stmt->bindValue(':review_id', $review_id, PDO::PARAM_INT);
    $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->execute();
    
    if (!$stmt->fetch()) {
        http_response_code(403);
        echo json_encode(["success" => false, "error" => "Review not found or access denied"]);
        exit();
    }
    
    // Elimina la recensione
    $stmt = $conn->prepare("DELETE FROM reviews WHERE id = :review_id AND user_id = :user_id");
    $stmt->bindValue(':review_id', $review_id, PDO::PARAM_INT);
    $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        echo json_encode([
            "success" => true, 
            "message" => "Review deleted successfully"
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false, 
            "error" => "Failed to delete review"
        ]);
    }
    
} catch (PDOException $e) {
    error_log("Database error in delete_review: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        "success" => false, 
        "error" => "Database error: " . $e->getMessage()
    ]);
}
?> 