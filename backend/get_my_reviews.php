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
    
    if (!preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
        echo json_encode([
            'success' => false,
            'message' => 'Authorization header missing'
        ]);
        exit;
    }
    
    $token = $matches[1];
    
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
    
    // Get user reviews
    $stmt = $conn->prepare('
        SELECT 
            r.id,
            r.title,
            r.review,
            r.rating,
            r.created_at,
            r.video_id,
            m.title as movie_title,
            m.poster_url as movie_poster
        FROM reviews r
        LEFT JOIN movies m ON r.video_id = m.id
        WHERE r.user_id = ?
        ORDER BY r.created_at DESC
    ');
    $stmt->execute([$session['user_id']]);
    $reviews = $stmt->fetchAll();
    
    // Format data
    foreach ($reviews as &$review) {
        $review['id'] = (int)$review['id'];
        $review['rating'] = (int)$review['rating'];
        $review['video_id'] = (int)$review['video_id'];
        $review['created_at'] = date('Y-m-d H:i:s', strtotime($review['created_at']));
    }
    
    echo json_encode([
        'success' => true,
        'reviews' => $reviews,
        'count' => count($reviews)
    ]);
    
} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Database error occurred'
    ]);
} catch (Exception $e) {
    error_log("General error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred'
    ]);
}
?> 