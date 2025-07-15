<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
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

// Ricevi il token dal frontend
$data = json_decode(file_get_contents("php://input"));
if (!isset($data->credential)) {
    echo json_encode(["success" => false, "error" => "Missing Google credential"]);
    exit;
}
$credential = $data->credential;

// Verifica il token con Google
$googleApiUrl = "https://oauth2.googleapis.com/tokeninfo?id_token=" . urlencode($credential);
$googleResponse = file_get_contents($googleApiUrl);
if ($googleResponse === FALSE) {
    echo json_encode(["success" => false, "error" => "Google token verification failed"]);
    exit;
}
$googleData = json_decode($googleResponse);
if (!isset($googleData->email) || !isset($googleData->sub)) {
    echo json_encode(["success" => false, "error" => "Invalid Google token"]);
    exit;
}
$email = $googleData->email;
$username = isset($googleData->name) ? $googleData->name : $email;
$google_id = $googleData->sub;

try {
    // Cerca utente per email
    $stmt = $conn->prepare("SELECT id, username, email FROM users WHERE email = :email");
    $stmt->bindParam(":email", $email, PDO::PARAM_STR);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Crea sessione
    $session_token = bin2hex(random_bytes(32));
    $expires_at = date('Y-m-d H:i:s', strtotime('+7 days'));
    if ($row) {
        // Utente già esistente: login
        $stmt2 = $conn->prepare("INSERT INTO sessions (user_id, session_token, expires_at) VALUES (:user_id, :session_token, :expires_at)");
        $stmt2->bindParam(":user_id", $row['id'], PDO::PARAM_INT);
        $stmt2->bindParam(":session_token", $session_token, PDO::PARAM_STR);
        $stmt2->bindParam(":expires_at", $expires_at, PDO::PARAM_STR);
        $stmt2->execute();
        echo json_encode([
            "success" => true,
            "mode" => "login",
            "user" => $row,
            "session_token" => $session_token,
            "expires_at" => $expires_at
        ]);
    } else {
        // Nuovo utente: registrazione
        $stmt2 = $conn->prepare("INSERT INTO users (username, email, password, is_verified) VALUES (:username, :email, :password, TRUE)");
        $stmt2->bindParam(":username", $username, PDO::PARAM_STR);
        $stmt2->bindParam(":email", $email, PDO::PARAM_STR);
        // Password random (non usata, ma richiesta dal DB)
        $stmt2->bindParam(":password", bin2hex(random_bytes(16)), PDO::PARAM_STR);
        if ($stmt2->execute()) {
            $userId = $conn->lastInsertId();
            // Crea sessione per il nuovo utente
            $stmt3 = $conn->prepare("INSERT INTO sessions (user_id, session_token, expires_at) VALUES (:user_id, :session_token, :expires_at)");
            $stmt3->bindParam(":user_id", $userId, PDO::PARAM_INT);
            $stmt3->bindParam(":session_token", $session_token, PDO::PARAM_STR);
            $stmt3->bindParam(":expires_at", $expires_at, PDO::PARAM_STR);
            $stmt3->execute();
            echo json_encode([
                "success" => true,
                "mode" => "register",
                "user" => ["id" => $userId, "username" => $username, "email" => $email],
                "session_token" => $session_token,
                "expires_at" => $expires_at
            ]);
        } else {
            echo json_encode(["success" => false, "error" => "Registration failed"]);
        }
    }
} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => "Database error: " . $e->getMessage()]);
}
?> 