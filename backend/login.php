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

$stmt = $conn->prepare("SELECT username, password FROM users WHERE username = :user OR email = :user");
$stmt->bindValue(":user", $username, SQLITE3_TEXT);
$result = $stmt->execute();

if ($row = $result->fetchArray(SQLITE3_ASSOC)) {
    if (password_verify($password, $row['password'])) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => "Invalid credentials"]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Invalid credentials"]);
}
$stmt->close();
$conn->close();
?> 