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
    // Query ottimizzata con JOIN per calcolare le medie dei rating
    $query = "
        SELECT 
            m.id,
            m.title,
            m.overview,
            m.release_date,
            m.poster_url,
            m.trailer_id,
            COALESCE(AVG(r.rating), 0) as average_rating,
            COUNT(r.id) as review_count
        FROM movies m
        LEFT JOIN reviews r ON m.id = r.video_id
        GROUP BY m.id, m.title, m.overview, m.release_date, m.poster_url, m.trailer_id
        ORDER BY m.release_date DESC
    ";
    
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $movies = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Formatta i dati per il frontend
    foreach ($movies as &$movie) {
        $movie['average_rating'] = round((float)$movie['average_rating'], 1);
        $movie['review_count'] = (int)$movie['review_count'];
        $movie['id'] = (int)$movie['id'];
    }
    
    echo json_encode([
        'success' => true,
        'movies' => $movies,
        'count' => count($movies)
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