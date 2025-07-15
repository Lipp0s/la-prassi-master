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

require '../vendor/autoload.php';
require 'config.php';
include 'db.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

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

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["success" => false, "error" => "Invalid email format"]);
    exit;
}

$hash = password_hash($password, PASSWORD_DEFAULT);
$verification_token = bin2hex(random_bytes(32));

try {
    $stmt = $conn->prepare("INSERT INTO users (username, email, password, verification_token) VALUES (:username, :email, :password, :token)");
    $stmt->bindParam(":username", $username, PDO::PARAM_STR);
    $stmt->bindParam(":email", $email, PDO::PARAM_STR);
    $stmt->bindParam(":password", $hash, PDO::PARAM_STR);
    $stmt->bindParam(":token", $verification_token, PDO::PARAM_STR);

    if ($stmt->execute()) {
        // Recupera l'id dell'utente appena creato
        $user_id = $conn->lastInsertId();
        // Crea sessione subito dopo la registrazione
        $session_token = bin2hex(random_bytes(32));
        $expires_at = date('Y-m-d H:i:s', strtotime('+7 days'));
        $stmt2 = $conn->prepare("INSERT INTO sessions (user_id, session_token, expires_at) VALUES (:user_id, :session_token, :expires_at)");
        $stmt2->bindParam(":user_id", $user_id, PDO::PARAM_INT);
        $stmt2->bindParam(":session_token", $session_token, PDO::PARAM_STR);
        $stmt2->bindParam(":expires_at", $expires_at, PDO::PARAM_STR);
        $stmt2->execute();
        $mail = new PHPMailer(true);
        try {
            //Server settings
            $mail->isSMTP();
            $mail->Host       = SMTP_HOST;
            $mail->SMTPAuth   = true;
            $mail->Username   = SMTP_USERNAME;
            $mail->Password   = SMTP_PASSWORD;
            $mail->SMTPSecure = SMTP_SECURE;
            $mail->Port       = SMTP_PORT;

            //Recipients
            $mail->setFrom(SMTP_USERNAME, 'La Prassi');
            $mail->addAddress($email, $username);

            // Content
            $mail->isHTML(true);
            $verification_link = APP_URL . '/verify.php?token=' . $verification_token;
            $mail->Subject = 'Verify your email address';
            $mail->Body    = "Please click the following link to verify your email address: <a href=\"$verification_link\">$verification_link</a>";
            $mail->AltBody = "Please copy and paste the following URL into your browser to verify your email address: $verification_link";

            $mail->send();
            echo json_encode([
                "success" => true,
                "message" => "Registration successful. Please check your email to verify your account.",
                "session_token" => $session_token,
                "expires_at" => $expires_at
            ]);
        } catch (Exception $e) {
            error_log("PHPMailer Error: " . $mail->ErrorInfo);
            echo json_encode(["success" => false, "error" => "Could not send verification email. Please contact support."]);
        }
    }
} catch (PDOException $e) {
    $error = $e->getMessage();
    if (strpos($error, 'users_username_key') !== false) {
        echo json_encode(["success" => false, "error" => "Username already exists"]);
    } elseif (strpos($error, 'users_email_key') !== false) {
        echo json_encode(["success" => false, "error" => "Email already exists"]);
    } else {
        echo json_encode(["success" => false, "error" => "Database error: " . $error]);
    }
}
?> 