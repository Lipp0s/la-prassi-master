<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'db.php';

try {
    // Get authorization header
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';
    
    // Debug
    error_log("Auth header: " . $authHeader);
    
    if (!preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
        echo json_encode([
            'success' => false,
            'message' => 'Authorization header missing',
            'debug' => $authHeader
        ]);
        exit;
    }
    
    $token = $matches[1];
    error_log("Token: " . $token);
    
    // Find session
    $stmt = $conn->prepare('
        SELECT user_id, expires_at 
        FROM sessions 
        WHERE session_token = ? AND expires_at > NOW()
    ');
    $stmt->execute([$token]);
    $session = $stmt->fetch();
    
    if (!$session) {
        echo json_encode([
            'success' => false,
            'message' => 'Invalid or expired session'
        ]);
        exit;
    }
    
    // Get user data
    $stmt = $conn->prepare('
        SELECT id, username, email, nickname, profile_picture_url, created_at
        FROM users 
        WHERE id = ?
    ');
    $stmt->execute([$session['user_id']]);
    $user = $stmt->fetch();
    
    if (!$user) {
        echo json_encode([
            'success' => false,
            'message' => 'User not found'
        ]);
        exit;
    }
    
    echo json_encode([
        'success' => true,
        'user' => $user
    ]);
    
} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Database error occurred',
        'error' => $e->getMessage()
    ]);
} catch (Exception $e) {
    error_log("General error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred',
        'error' => $e->getMessage()
    ]);
}
?> 