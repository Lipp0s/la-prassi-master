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

// Genera un token di verifica
$verification_token = bin2hex(random_bytes(32));

$hash = password_hash($password, PASSWORD_DEFAULT);
$stmt = $conn->prepare("INSERT INTO users (username, email, password, is_verified, verification_token) VALUES (:username, :email, :password, 0, :token)");
$stmt->bindValue(":username", $username, SQLITE3_TEXT);
$stmt->bindValue(":email", $email, SQLITE3_TEXT);
$stmt->bindValue(":password", $hash, SQLITE3_TEXT);
$stmt->bindValue(":token", $verification_token, SQLITE3_TEXT);

if ($stmt->execute()) {
    // Invia la mail di verifica
    $verify_link = 'http://' . $_SERVER['HTTP_HOST'] . dirname($_SERVER['REQUEST_URI']) . "/verify-email.php?token=" . $verification_token;
    $subject = "Verifica il tuo indirizzo email";
    $message = "<h2>Benvenuto $username!</h2><p>Per completare la registrazione, clicca sul link qui sotto per verificare la tua email:</p><p><a href='$verify_link'>$verify_link</a></p>";
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: noreply@" . $_SERVER['HTTP_HOST'] . "\r\n";
    mail($email, $subject, $message, $headers);
    echo json_encode(["success" => true, "message" => "Registrazione avvenuta. Controlla la tua email per la verifica."]);
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