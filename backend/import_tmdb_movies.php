<?php
require_once 'db.php';

$TMDB_API_KEY = '88cbcf75e7a3e866b2405e6ba23579c5'; // Inserisci qui la tua chiave TMDB

$url = 'https://api.themoviedb.org/3/movie/popular?api_key=' . $TMDB_API_KEY . '&language=en-US&page=1';
$response = file_get_contents($url);
if (!$response) {
    die('TMDB API request failed');
}
$data = json_decode($response, true);
if (!isset($data['results'])) {
    die('No results from TMDB');
}

foreach ($data['results'] as $movie) {
    $id = $movie['id'];
    $title = $movie['title'];
    $overview = $movie['overview'];
    $poster_url = $movie['poster_path'] ? 'https://image.tmdb.org/t/p/w500' . $movie['poster_path'] : null;
    $release_date = $movie['release_date'];
    $vote_average = $movie['vote_average'];
    
    // Fetch trailer YouTube ID
    $trailer_url = "https://api.themoviedb.org/3/movie/{$id}/videos?api_key={$TMDB_API_KEY}&language=en-US";
    $trailer_response = file_get_contents($trailer_url);
    $trailer_data = json_decode($trailer_response, true);
    
    $trailer_id = null;
    if (isset($trailer_data['results'])) {
        foreach ($trailer_data['results'] as $video) {
            if ($video['type'] === 'Trailer' && $video['site'] === 'YouTube') {
                $trailer_id = $video['key'];
                break;
            }
        }
    }

    // Inserisci o aggiorna il film
    $stmt = $db->prepare('INSERT INTO movies (id, title, overview, poster_url, release_date, vote_average, trailer_id) VALUES (:id, :title, :overview, :poster_url, :release_date, :vote_average, :trailer_id)
        ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, overview = EXCLUDED.overview, poster_url = EXCLUDED.poster_url, release_date = EXCLUDED.release_date, vote_average = EXCLUDED.vote_average, trailer_id = EXCLUDED.trailer_id');
    $stmt->execute([
        ':id' => $id,
        ':title' => $title,
        ':overview' => $overview,
        ':poster_url' => $poster_url,
        ':release_date' => $release_date,
        ':vote_average' => $vote_average,
        ':trailer_id' => $trailer_id
    ]);
}
echo "Import completed!"; 