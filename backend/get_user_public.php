<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
header('Content-Type: application/json');
require_once 'db.php';

if (!isset($_GET['id'])) {
    echo json_encode(['success' => false, 'message' => 'Missing user id']);
    exit;
}
$user_id = intval($_GET['id']);

$stmt = $db->prepare('SELECT id, nickname, profile_picture_url FROM users WHERE id = :id');
$stmt->execute([':id' => $user_id]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$user) {
    echo json_encode(['success' => false, 'message' => 'User not found']);
    exit;
}

// Get reviews by this user
$stmt = $db->prepare('SELECT r.id, r.title, r.review, r.rating, r.created_at, r.video_id FROM reviews r WHERE r.user_id = :id ORDER BY r.created_at DESC');
$stmt->execute([':id' => $user_id]);
$reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Optionally, get video info for each review (not included for brevity)

echo json_encode(['success' => true, 'user' => $user, 'reviews' => $reviews]); 