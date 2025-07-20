<?php
require_once 'db.php';

try {
    // Aggiungi la colonna trailer_id se non esiste
    $db->exec("ALTER TABLE movies ADD COLUMN IF NOT EXISTS trailer_id VARCHAR(20)");
    echo "Trailer column added successfully!";
} catch (Exception $e) {
    echo "Error adding trailer column: " . $e->getMessage();
}
?> 