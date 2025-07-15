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

$data = json_decode(file_get_contents("php://input"));
if (!isset($data->username) || !isset($data->password)) {
    echo json_encode(["success" => false, "error" => "Missing fields"]);
    exit;
}
$username = trim($data->username);
$password = $data->password;

try {
    $stmt = $conn->prepare("SELECT * FROM users WHERE username = :user OR email = :user");
    $stmt->bindParam(":user", $username, PDO::PARAM_STR);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password'])) {
        if (!$user['is_verified']) {
            echo json_encode(["success" => false, "error" => "Email non verificata. Controlla la tua casella di posta."]);
            exit;
        }
        // Crea sessione
        $session_token = bin2hex(random_bytes(32));
        $expires_at = date('Y-m-d H:i:s', strtotime('+7 days'));
        $stmt2 = $conn->prepare("INSERT INTO sessions (user_id, session_token, expires_at) VALUES (:user_id, :session_token, :expires_at)");
        $stmt2->bindParam(":user_id", $user['id'], PDO::PARAM_INT);
        $stmt2->bindParam(":session_token", $session_token, PDO::PARAM_STR);
        $stmt2->bindParam(":expires_at", $expires_at, PDO::PARAM_STR);
        $stmt2->execute();
        echo json_encode([
            "success" => true,
            "username" => $user['username'],
            "email" => $user['email'],
            "session_token" => $session_token,
            "expires_at" => $expires_at
        ]);
    } else {
        echo json_encode(["success" => false, "error" => "Invalid credentials"]);
    }
} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => "Database error: " . $e->getMessage()]);
}
?> 