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

// Cerca utente per email
$stmt = $conn->prepare("SELECT id, username, email FROM users WHERE email = :email");
$stmt->bindValue(":email", $email, SQLITE3_TEXT);
$result = $stmt->execute();
if ($row = $result->fetchArray(SQLITE3_ASSOC)) {
    // Utente già esistente: login
    echo json_encode(["success" => true, "mode" => "login", "user" => $row]);
} else {
    // Nuovo utente: registrazione
    $stmt2 = $conn->prepare("INSERT INTO users (username, email, password) VALUES (:username, :email, :password)");
    $stmt2->bindValue(":username", $username, SQLITE3_TEXT);
    $stmt2->bindValue(":email", $email, SQLITE3_TEXT);
    // Password random (non usata, ma richiesta dal DB)
    $stmt2->bindValue(":password", bin2hex(random_bytes(16)), SQLITE3_TEXT);
    if ($stmt2->execute()) {
        $userId = $conn->lastInsertRowID();
        echo json_encode(["success" => true, "mode" => "register", "user" => ["id" => $userId, "username" => $username, "email" => $email]]);
    } else {
        echo json_encode(["success" => false, "error" => "Registration failed"]);
    }
}
$stmt->close();
$conn->close();
?> 