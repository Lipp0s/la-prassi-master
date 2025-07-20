<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
require_once 'db.php';
header('Content-Type: application/json');

// Allow only POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Auth: Bearer token
$headers = getallheaders();
if (!isset($headers['Authorization'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Missing authorization header']);
    exit;
}
$token = str_replace('Bearer ', '', $headers['Authorization']);
$stmt = $db->prepare('SELECT user_id FROM sessions WHERE session_token = :token AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)');
$stmt->execute([':token' => $token]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$user) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Invalid or expired session']);
    exit;
}
$user_id = $user['user_id'];

// Parse form data
$nickname = isset($_POST['nickname']) ? trim($_POST['nickname']) : '';
if ($nickname === '') {
    echo json_encode(['success' => false, 'message' => 'Nickname is required']);
    exit;
}

// Check nickname uniqueness
$stmt = $db->prepare('SELECT id FROM users WHERE nickname = :nickname AND id != :id');
$stmt->execute([':nickname' => $nickname, ':id' => $user_id]);
if ($stmt->fetch()) {
    echo json_encode(['success' => false, 'message' => 'Nickname already taken']);
    exit;
}

// Handle profile picture upload
$profile_picture_url = null;
if (isset($_FILES['profile_picture']) && $_FILES['profile_picture']['error'] === UPLOAD_ERR_OK) {
    $file = $_FILES['profile_picture'];
    $allowed_types = ['image/jpeg', 'image/png', 'image/webp'];
    if (!in_array($file['type'], $allowed_types)) {
        echo json_encode(['success' => false, 'message' => 'Invalid image type']);
        exit;
    }
    if ($file['size'] > 2 * 1024 * 1024) { // 2MB
        echo json_encode(['success' => false, 'message' => 'Image too large (max 2MB)']);
        exit;
    }
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = 'user_' . $user_id . '_' . time() . '.' . $ext;
    $upload_dir = __DIR__ . '/uploads/profile_pics/';
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }
    $dest = $upload_dir . $filename;
    if (!move_uploaded_file($file['tmp_name'], $dest)) {
        echo json_encode(['success' => false, 'message' => 'Failed to save image']);
        exit;
    }
    $profile_picture_url = '/uploads/profile_pics/' . $filename;
}

// Update user
if ($profile_picture_url) {
    $stmt = $db->prepare('UPDATE users SET nickname = :nickname, profile_picture_url = :pic WHERE id = :id');
    $stmt->execute([':nickname' => $nickname, ':pic' => $profile_picture_url, ':id' => $user_id]);
} else {
    $stmt = $db->prepare('UPDATE users SET nickname = :nickname WHERE id = :id');
    $stmt->execute([':nickname' => $nickname, ':id' => $user_id]);
}

// Return updated user info
$stmt = $db->prepare('SELECT id, email, nickname, profile_picture_url FROM users WHERE id = :id');
$stmt->execute([':id' => $user_id]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);
echo json_encode(['success' => true, 'user' => $user]); 