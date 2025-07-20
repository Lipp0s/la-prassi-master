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
require_once 'db.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Accept multipart/form-data
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$nickname = null;
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';

if ($name === '' || $email === '' || $password === '') {
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}

// Validate nickname uniqueness
$stmt = $db->prepare('SELECT id FROM users WHERE nickname = :nickname');
$stmt->execute([':nickname' => $nickname]);
if ($stmt->fetch()) {
    echo json_encode(['success' => false, 'message' => 'Nickname already taken']);
    exit;
}

// Validate email uniqueness
$stmt = $db->prepare('SELECT id FROM users WHERE email = :email');
$stmt->execute([':email' => $email]);
if ($stmt->fetch()) {
    echo json_encode(['success' => false, 'message' => 'Email already registered']);
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
    $filename = 'user_' . uniqid() . '_' . time() . '.' . $ext;
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

// Hash password
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// Insert user
$stmt = $db->prepare('INSERT INTO users (name, nickname, email, password, profile_picture_url) VALUES (:name, :nickname, :email, :password, :pic)');
$stmt->execute([
    ':name' => $name,
    ':nickname' => $nickname,
    ':email' => $email,
    ':password' => $hashed_password,
    ':pic' => $profile_picture_url
]);
$user_id = $db->lastInsertId();

// Return new user info
$stmt = $db->prepare('SELECT id, name, nickname, email, profile_picture_url FROM users WHERE id = :id');
$stmt->execute([':id' => $user_id]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);
echo json_encode(['success' => true, 'user' => $user]);
?> 