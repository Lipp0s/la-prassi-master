<?php
include 'db.php';

try {
    echo "Testing review insertion...\n";
    
    // Simula una sessione valida (usa un user_id esistente)
    $test_user_id = "5"; // User ID dalla sessione (integer)
    $test_video_id = "dQw4w9WgXcQ";
    $test_rating = 5;
    $test_comment = "Test review comment";
    
    echo "Test data:\n";
    echo "- User ID from session: $test_user_id\n";
    echo "- Video ID: $test_video_id\n";
    echo "- Rating: $test_rating\n";
    echo "- Comment: $test_comment\n\n";
    
    // Test 1: Ottieni l'UUID dell'utente
    echo "Test 1: Getting user UUID...\n";
    $stmt = $conn->prepare("SELECT id FROM users WHERE id::text = :user_id::text LIMIT 1");
    $stmt->bindParam(":user_id", $test_user_id, PDO::PARAM_STR);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user) {
        $user_uuid = $user['id'];
        echo "User UUID found: $user_uuid\n";
        
        // Test 2: Inserisci recensione
        echo "\nTest 2: Inserting review...\n";
        $stmt2 = $conn->prepare("INSERT INTO reviews (user_id, video_id, rating, comment) VALUES (:user_id, :video_id, :rating, :comment)");
        $stmt2->bindParam(":user_id", $user_uuid, PDO::PARAM_STR);
        $stmt2->bindParam(":video_id", $test_video_id, PDO::PARAM_STR);
        $stmt2->bindParam(":rating", $test_rating, PDO::PARAM_INT);
        $stmt2->bindParam(":comment", $test_comment, PDO::PARAM_STR);
        $stmt2->execute();
        
        echo "Review inserted successfully!\n";
        
        // Test 3: Verifica inserimento
        echo "\nTest 3: Verifying insertion...\n";
        $stmt3 = $conn->prepare("SELECT * FROM reviews WHERE user_id = :user_id AND video_id = :video_id ORDER BY created_at DESC LIMIT 1");
        $stmt3->bindParam(":user_id", $user_uuid, PDO::PARAM_STR);
        $stmt3->bindParam(":video_id", $test_video_id, PDO::PARAM_STR);
        $stmt3->execute();
        $review = $stmt3->fetch(PDO::FETCH_ASSOC);
        
        if ($review) {
            echo "Review found: " . json_encode($review) . "\n";
        } else {
            echo "Review not found after insertion\n";
        }
        
    } else {
        echo "User not found!\n";
    }
    
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?> 