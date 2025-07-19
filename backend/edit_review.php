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
if (!isset($data->review_id) || !isset($data->title) || !isset($data->rating) || !isset($data->review)) {
    echo json_encode(["success" => false, "error" => "Dati mancanti"]);
    exit;
}

$review_id = $data->review_id;
$title = trim($data->title);
$rating = intval($data->rating);
$review = trim($data->review);

// Validazione
if (empty($title) || empty($review)) {
    echo json_encode(["success" => false, "error" => "Titolo e recensione sono obbligatori"]);
    exit;
}

if ($rating < 1 || $rating > 5) {
    echo json_encode(["success" => false, "error" => "Valutazione deve essere tra 1 e 5"]);
    exit;
}

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
    $existing_review = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$existing_review) {
        echo json_encode(["success" => false, "error" => "Recensione non trovata o non autorizzata"]);
        exit;
    }

    // Aggiorna la recensione
    $stmt = $conn->prepare("
        UPDATE reviews 
        SET title = :title, rating = :rating, review = :review, updated_at = NOW()
        WHERE id = :review_id AND user_id = :user_id
    ");
    $stmt->bindParam(":title", $title, PDO::PARAM_STR);
    $stmt->bindParam(":rating", $rating, PDO::PARAM_INT);
    $stmt->bindParam(":review", $review, PDO::PARAM_STR);
    $stmt->bindParam(":review_id", $review_id, PDO::PARAM_INT);
    $stmt->bindParam(":user_id", $user_id, PDO::PARAM_INT);
    
    if ($stmt->execute()) {
        echo json_encode([
            "success" => true, 
            "message" => "Recensione aggiornata con successo",
            "review" => [
                "id" => $review_id,
                "title" => $title,
                "rating" => $rating,
                "review" => $review
            ]
        ]);
    } else {
        echo json_encode(["success" => false, "error" => "Errore nell'aggiornamento"]);
    }

} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => "Errore del database: " . $e->getMessage()]);
}
?> 