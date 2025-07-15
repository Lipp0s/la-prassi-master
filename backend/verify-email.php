<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
header("Content-Type: application/json");
include 'db.php';

if (!isset($_GET['token'])) {
    echo json_encode(["success" => false, "error" => "Token mancante"]);
    exit;
}
$token = $_GET['token'];

try {
    $stmt = $conn->prepare("SELECT * FROM users WHERE verification_token = :token");
    $stmt->bindParam(":token", $token, PDO::PARAM_STR);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user) {
        $update = $conn->prepare("UPDATE users SET is_verified = TRUE, verification_token = NULL WHERE id = :id");
        $update->bindParam(":id", $user['id'], PDO::PARAM_INT);
        $update->execute();
        echo json_encode(["success" => true, "message" => "Email verificata! Ora puoi accedere."]);
    } else {
        echo json_encode(["success" => false, "error" => "Token non valido o già usato."]);
    }
} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => "Database error: " . $e->getMessage()]);
}
?> 