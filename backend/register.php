<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");

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

$stmt = $conn->prepare("INSERT INTO users (username, email, password, verification_token) VALUES (:username, :email, :password, :token)");
$stmt->bindValue(":username", $username, SQLITE3_TEXT);
$stmt->bindValue(":email", $email, SQLITE3_TEXT);
$stmt->bindValue(":password", $hash, SQLITE3_TEXT);
$stmt->bindValue(":token", $verification_token, SQLITE3_TEXT);

set_error_handler(function($errno, $errstr, $errfile, $errline) {
    http_response_code(200);
    echo json_encode(["success" => false, "error" => "Server error: $errstr ($errfile:$errline)"]);
    exit;
});

if ($stmt->execute()) {
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
        echo json_encode(["success" => true, "message" => "Registration successful. Please check your email to verify your account."]);
    } catch (Exception $e) {
        // If email fails, we should ideally roll back the user creation or have a cron job for retries.
        // For simplicity, we'll just log the error and inform the user.
        error_log("PHPMailer Error: " . $mail->ErrorInfo);
        echo json_encode(["success" => false, "error" => "Could not send verification email. Please contact support."]);
    }
} else {
    $error = $conn->lastErrorMsg();
    if (strpos($error, 'UNIQUE') !== false) {
        if (strpos($error, 'email') !== false) {
            echo json_encode(["success" => false, "error" => "Email already exists"]);
        } else {
            echo json_encode(["success" => false, "error" => "Username already exists"]);
        }
    } else {
        echo json_encode(["success" => false, "error" => $error]);
    }
}
$stmt->close();
$conn->close();
?> 