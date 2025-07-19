<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'db.php';

try {
    
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $video_id = $_GET['video_id'] ?? null;
        
        if (!$video_id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Video ID is required']);
            exit;
        }
        
        // Get reviews for the specific video
        $stmt = $conn->prepare("
            SELECT r.id, r.video_id, r.user_id, r.rating, r.comment as review, r.title, r.created_at,
                   u.username 
            FROM reviews r 
            JOIN users u ON r.user_id = u.id 
            WHERE r.video_id = :video_id 
            ORDER BY r.created_at DESC
        ");
        $stmt->bindParam(":video_id", $video_id, PDO::PARAM_STR);
        $stmt->execute();
        $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Format the reviews
        $formatted_reviews = [];
        foreach ($reviews as $review) {
            $formatted_reviews[] = [
                'id' => $review['id'],
                'video_id' => $review['video_id'],
                'user_id' => $review['user_id'],
                'username' => $review['username'],
                'rating' => (int)$review['rating'],
                'review' => $review['review'],
                'title' => $review['title'] ?? 'Recensione',
                'created_at' => $review['created_at']
            ];
        }
        
        echo json_encode([
            'success' => true,
            'reviews' => $formatted_reviews,
            'count' => count($formatted_reviews)
        ]);
        
    } else {
        http_response_code(405);
        echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    }
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Server error: ' . $e->getMessage()]);
}
?> 