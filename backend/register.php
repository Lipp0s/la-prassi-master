<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
include 'db.php';

$data = json_decode(file_get_contents("php://input"));
if (!isset($data->username) || !isset($data->password) || !isset($data->email)) {
    echo json_encode(["success" => false, "error" => "Missing fields"]);
    exit;
}
$username = trim($data->username);
$email = trim($data->email);
$password = $data->password;

if (strlen($username) < 3 || strlen($password) < 6) {
    echo json_encode(["success" => false, "error" => "Username or password too short"]);
    exit;
}

$hash = password_hash($password, PASSWORD_DEFAULT);
$stmt = $conn->prepare("INSERT INTO users (username, email, password) VALUES (:username, :email, :password)");
$stmt->bindValue(":username", $username, SQLITE3_TEXT);
$stmt->bindValue(":email", $email, SQLITE3_TEXT);
$stmt->bindValue(":password", $hash, SQLITE3_TEXT);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    $error = $conn->lastErrorMsg();
    if (strpos($error, 'UNIQUE') !== false) {
        echo json_encode(["success" => false, "error" => "Username already exists"]);
    } else {
        echo json_encode(["success" => false, "error" => $error]);
    }
}
$stmt->close();
$conn->close();
?> 