<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include 'db.php';

if (!isset($_GET['token'])) {
    echo json_encode(["success" => false, "error" => "Token mancante"]);
    exit;
}
$token = $_GET['token'];
$stmt = $conn->prepare("SELECT * FROM users WHERE verification_token = :token");
$stmt->bindValue(":token", $token, SQLITE3_TEXT);
$result = $stmt->execute();
$user = $result->fetchArray(SQLITE3_ASSOC);
if ($user) {
    $update = $conn->prepare("UPDATE users SET is_verified = 1, verification_token = NULL WHERE id = :id");
    $update->bindValue(":id", $user['id'], SQLITE3_INTEGER);
    $update->execute();
    echo json_encode(["success" => true, "message" => "Email verificata! Ora puoi accedere."]);
} else {
    echo json_encode(["success" => false, "error" => "Token non valido o già usato."]);
}
$conn->close();
?> 