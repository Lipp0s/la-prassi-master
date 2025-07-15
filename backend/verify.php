<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
ini_set('display_errors', 1);
error_reporting(E_ALL);

include 'db.php';

$token = $_GET['token'] ?? '';

if (empty($token)) {
    die('Verification token is missing.');
}

try {
    $stmt = $conn->prepare("SELECT id, is_verified FROM users WHERE verification_token = :token");
    $stmt->bindParam(':token', $token, PDO::PARAM_STR);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        die('Invalid verification token.');
    }

    if ($user['is_verified']) {
        die('This account has already been verified.');
    }

    $updateStmt = $conn->prepare("UPDATE users SET is_verified = TRUE, verification_token = NULL WHERE id = :id");
    $updateStmt->bindParam(':id', $user['id'], PDO::PARAM_INT);

    if ($updateStmt->execute()) {
        // You can redirect to a page on your frontend
        // header('Location: http://localhost:3000/login?verified=true');
        echo 'Your account has been successfully verified! You can now log in.';
    } else {
        die('Failed to verify account. Please try again or contact support.');
    }
} catch (PDOException $e) {
    die('Database error: ' . $e->getMessage());
}
?> 