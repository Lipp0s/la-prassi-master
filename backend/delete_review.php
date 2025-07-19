<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
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

// Ricevi i dati
$data = json_decode(file_get_contents("php://input"));
if (!isset($data->review_id)) {
    echo json_encode(["success" => false, "error" => "ID recensione non fornito"]);
    exit;
}

$review_id = $data->review_id;

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

    // Verifica che la recensione appartenga all'utente
    $stmt = $conn->prepare("SELECT id FROM reviews WHERE id = :review_id AND user_id = :user_id");
    $stmt->bindParam(":review_id", $review_id, PDO::PARAM_INT);
    $stmt->bindParam(":user_id", $user_id, PDO::PARAM_INT);
    $stmt->execute();
    $review = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$review) {
        echo json_encode(["success" => false, "error" => "Recensione non trovata o non autorizzata"]);
        exit;
    }

    // Elimina la recensione
    $stmt = $conn->prepare("DELETE FROM reviews WHERE id = :review_id AND user_id = :user_id");
    $stmt->bindParam(":review_id", $review_id, PDO::PARAM_INT);
    $stmt->bindParam(":user_id", $user_id, PDO::PARAM_INT);
    
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Recensione eliminata con successo"]);
    } else {
        echo json_encode(["success" => false, "error" => "Errore nell'eliminazione"]);
    }

} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => "Errore del database: " . $e->getMessage()]);
}
?> 