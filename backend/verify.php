<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

include 'db.php';

$token = $_GET['token'] ?? '';

if (empty($token)) {
    die('Verification token is missing.');
}

$stmt = $conn->prepare("SELECT id, is_verified FROM users WHERE verification_token = :token");
$stmt->bindValue(':token', $token, SQLITE3_TEXT);
$result = $stmt->execute();
$user = $result->fetchArray(SQLITE3_ASSOC);

if (!$user) {
    die('Invalid verification token.');
}

if ($user['is_verified']) {
    die('This account has already been verified.');
}

$updateStmt = $conn->prepare("UPDATE users SET is_verified = 1, verification_token = NULL WHERE id = :id");
$updateStmt->bindValue(':id', $user['id'], SQLITE3_INTEGER);

if ($updateStmt->execute()) {
    // You can redirect to a page on your frontend
    // header('Location: http://localhost:3000/login?verified=true');
    echo 'Your account has been successfully verified! You can now log in.';
} else {
    die('Failed to verify account. Please try again or contact support.');
}

$stmt->close();
$updateStmt->close();
$conn->close();
?> 