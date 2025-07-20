<?php
require_once 'db.php';

try {
    // Svuota la tabella reviews (perdiamo le recensioni esistenti ma risolviamo il conflitto)
    $db->exec("DELETE FROM reviews");
    
    // Aggiorna la colonna video_id da TEXT a INTEGER
    $db->exec("ALTER TABLE reviews ALTER COLUMN video_id TYPE INTEGER USING video_id::INTEGER");
    echo "Reviews table updated successfully! Old reviews have been cleared.";
} catch (Exception $e) {
    echo "Error updating reviews table: " . $e->getMessage();
}
?> 