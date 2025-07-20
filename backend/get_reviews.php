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
    $video_id = $_GET['video_id'] ?? null;
    
    if (!$video_id) {
        echo json_encode([
            'success' => false,
            'message' => 'Video ID is required'
        ]);
        exit;
    }
    
    // Query ottimizzata con JOIN per ottenere informazioni utente
    $query = "
        SELECT 
            r.id,
            r.title,
            r.comment,
            r.rating,
            r.created_at,
            r.video_id,
            u.nickname,
            u.email
        FROM reviews r
        LEFT JOIN users u ON r.user_id = u.id
        WHERE r.video_id = ?
        ORDER BY r.created_at DESC
    ";
    
    $stmt = $conn->prepare($query);
    $stmt->execute([$video_id]);
    $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Formatta i dati per il frontend
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
        'message' => 'Database error occurred',
        'error' => $e->getMessage()
    ]);
} catch (Exception $e) {
    error_log("General error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred'
    ]);
}
?> 