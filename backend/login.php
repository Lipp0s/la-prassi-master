<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
include 'db.php';

$data = json_decode(file_get_contents("php://input"));
if (!isset($data->username) || !isset($data->password)) {
    echo json_encode(["success" => false, "error" => "Missing fields"]);
    exit;
}
$username = trim($data->username);
$password = $data->password;

$stmt = $conn->prepare("SELECT username, password, is_verified, id FROM users WHERE username = :user OR email = :user");
$stmt->bindValue(":user", $username, SQLITE3_TEXT);
$result = $stmt->execute();
$user = $result->fetchArray(SQLITE3_ASSOC);

if ($user && password_verify($password, $user['password'])) {
    if ($user['is_verified'] == 0) {
        echo json_encode(["success" => false, "error" => "Please verify your email before logging in."]);
        exit;
    }
    session_start();
    $_SESSION['user_id'] = $user['id'];
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => "Invalid credentials"]);
}
$stmt->close();
$conn->close();
?> 