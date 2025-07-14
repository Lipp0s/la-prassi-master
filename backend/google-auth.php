<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
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
    
    if ($row) {
        // Utente già esistente: login
        echo json_encode(["success" => true, "mode" => "login", "user" => $row]);
    } else {
        // Nuovo utente: registrazione
        $stmt2 = $conn->prepare("INSERT INTO users (username, email, password, is_verified) VALUES (:username, :email, :password, TRUE)");
        $stmt2->bindParam(":username", $username, PDO::PARAM_STR);
        $stmt2->bindParam(":email", $email, PDO::PARAM_STR);
        // Password random (non usata, ma richiesta dal DB)
        $stmt2->bindParam(":password", bin2hex(random_bytes(16)), PDO::PARAM_STR);
        
        if ($stmt2->execute()) {
            $userId = $conn->lastInsertId();
            echo json_encode(["success" => true, "mode" => "register", "user" => ["id" => $userId, "username" => $username, "email" => $email]]);
        } else {
            echo json_encode(["success" => false, "error" => "Registration failed"]);
        }
    }
} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => "Database error: " . $e->getMessage()]);
}
?> 