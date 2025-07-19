<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json");
include 'db.php';

// Verifica l'autorizzazione
$headers = getallheaders();
$auth_header = isset($headers['Authorization']) ? $headers['Authorization'] : '';

if (!preg_match('/Bearer\s+(.*)$/i', $auth_header, $matches)) {
    echo json_encode(["success" => false, "error" => "Token non fornito"]);
    exit;
}

$session_token = $matches[1];

try {
    // Verifica la sessione
    $stmt = $conn->prepare("SELECT user_id FROM sessions WHERE session_token = :session_token AND expires_at > NOW()");
    $stmt->bindParam(":session_token", $session_token, PDO::PARAM_STR);
    $stmt->execute();
    $session = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$session) {
        echo json_encode(["success" => false, "error" => "Sessione non valida"]);
        exit;
    }

    $user_id = $session['user_id'];

    // Ottieni le recensioni dell'utente
    $stmt = $conn->prepare("
        SELECT r.id, r.video_id, r.title, r.rating, r.comment as review, r.created_at
        FROM reviews r
        WHERE r.user_id = :user_id
        ORDER BY r.created_at DESC
    ");
    $stmt->bindParam(":user_id", $user_id, PDO::PARAM_INT);
    $stmt->execute();
    $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "reviews" => $reviews
    ]);

} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => "Errore del database: " . $e->getMessage()]);
}
?> 